import { classRoleCapacity } from "@/components/wow/config/wowClassRoleSlots";
import type {
  WowCharacterEntry,
  WowGroupRosterUserSection,
  WowUserEntry,
} from "@/components/wow/config/wowRosterConfig";
import type { WowRoleSlots } from "@/components/wow/config/wowRoleTypes";

import {
  parseWowArmoryCharacterUrl,
  type WowArmoryCharacterRef,
} from "./armory";
import {
  battleNetOAuthTokenSuccessSchema,
  blizzardCharacterProfileSummarySchema,
  blizzardMythicKeystoneSeasonProfileSchema,
  formatZodErrorBrief,
  mythicKeystoneSeasonIndexSchema,
  mythicSeasonIdFromIndex,
  type BlizzardCharacterProfileSummary,
} from "./schemas/battleNetApiSchemas";

/** How we obtained a stat for UI styling and messaging. */
export type WowStatTier =
  | "live"
  | "snapshot"
  | "blocked-private"
  | "blocked-unconfigured";

export type WowCharacterForDisplay = {
  readonly rosterId: string;
  readonly name: string;
  readonly characterClass: string;
  /** From shared class commons (`classRoleCapacity`) — only lanes with count > 0 are eligible. */
  readonly classRoleSlots: WowRoleSlots;
  readonly profileUrl?: string;
  readonly ilvl: number | null;
  readonly ilvlTier: WowStatTier;
  readonly mythicPlusScore: number | null;
  readonly mythicTier: WowStatTier;
};

const HOST_BY_REGION: Record<string, string> = {
  us: "us.api.blizzard.com",
  eu: "eu.api.blizzard.com",
  kr: "kr.api.blizzard.com",
  tw: "tw.api.blizzard.com",
};

const LOG_NS = "[wow/battle-net]";

function warn(...args: unknown[]): void {
  console.warn(LOG_NS, ...args);
}

let warnedMissingCredentials = false;

let tokenCache: { token: string; expiresAtMs: number } | null = null;

async function getClientCredentialsToken(): Promise<string | null> {
  const id = process.env.BATTLENET_CLIENT_ID;
  const secret = process.env.BATTLENET_CLIENT_SECRET;
  if (!id || !secret) {
    if (!warnedMissingCredentials) {
      warnedMissingCredentials = true;
      warn(
        "BATTLENET_CLIENT_ID / BATTLENET_CLIENT_SECRET not set — OAuth token will not be requested.",
      );
    }
    return null;
  }

  if (tokenCache && Date.now() < tokenCache.expiresAtMs - 60_000) {
    return tokenCache.token;
  }

  const body = new URLSearchParams({ grant_type: "client_credentials" });
  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch("https://oauth.battle.net/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    tokenCache = null;
    const preview = (await res.text().catch(() => "")).slice(0, 400);
    warn("OAuth token request failed", {
      status: res.status,
      statusText: res.statusText,
      bodyPreview: preview || "(empty)",
    });
    return null;
  }

  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    warn("OAuth token response was not valid JSON");
    return null;
  }

  const parsed = battleNetOAuthTokenSuccessSchema.safeParse(raw);
  if (!parsed.success) {
    warn("OAuth token response failed schema validation", {
      issues: formatZodErrorBrief(parsed.error),
      keys:
        raw !== null && typeof raw === "object"
          ? Object.keys(raw as Record<string, unknown>)
          : [],
    });
    return null;
  }

  const token = parsed.data.access_token;
  const ttlSec =
    typeof parsed.data.expires_in === "number" ? parsed.data.expires_in : 3600;
  tokenCache = {
    token,
    expiresAtMs: Date.now() + ttlSec * 1000,
  };
  return token;
}

async function fetchRetailCharacterSummary(
  ref: WowArmoryCharacterRef,
  token: string,
): Promise<BlizzardCharacterProfileSummary | null> {
  const host = HOST_BY_REGION[ref.region.toLowerCase()];
  if (!host) {
    warn("Unsupported region for Profile API host mapping", {
      region: ref.region,
    });
    return null;
  }

  const namespace = `profile-${ref.region.toLowerCase()}`;
  const realm = encodeURIComponent(ref.realmSlug.toLowerCase());
  const name = encodeURIComponent(ref.characterName.toLowerCase());

  const qs = new URLSearchParams({
    namespace,
    locale:
      ref.region.toLowerCase() === "eu"
        ? "en_GB"
        : ref.region.toLowerCase() === "kr" || ref.region.toLowerCase() === "tw"
          ? "en_US"
          : "en_US",
  });

  const url = `https://${host}/profile/wow/character/${realm}/${name}?${qs}`;

  const started = Date.now();
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    const elapsedMs = Date.now() - started;
    const preview = (await res.text().catch(() => "")).slice(0, 400);
    warn("Character profile request failed", {
      region: ref.region,
      realmSlug: ref.realmSlug,
      character: ref.characterName,
      status: res.status,
      statusText: res.statusText,
      elapsedMs,
      bodyPreview: preview || "(empty)",
    });
    return null;
  }

  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    warn("Character profile response was not valid JSON", {
      region: ref.region,
      realmSlug: ref.realmSlug,
      character: ref.characterName,
    });
    return null;
  }

  const parsed = blizzardCharacterProfileSummarySchema.safeParse(raw);
  if (!parsed.success) {
    warn("Character profile JSON failed schema validation", {
      region: ref.region,
      realmSlug: ref.realmSlug,
      character: ref.characterName,
      issues: formatZodErrorBrief(parsed.error),
    });
    return null;
  }

  const summary = parsed.data;

  return summary;
}

function rosterNumber(n: number | null | undefined): number | null {
  if (n === undefined || n === null) {
    return null;
  }
  return n;
}

function mythicFromSummary(
  summary: BlizzardCharacterProfileSummary,
): number | null {
  const r = summary.mythic_rating?.rating;
  return typeof r === "number" && !Number.isNaN(r) ? Math.round(r) : null;
}

/** Game Data season index is stable for hours; avoids hammering `/mythic-keystone/season/index`. */
let mythicSeasonIndexCache: {
  regionKey: string;
  seasonId: number;
  fetchedAtMs: number;
} | null = null;

const MYTHIC_SEASON_INDEX_TTL_MS = 6 * 60 * 60 * 1000;

async function fetchCurrentMythicSeasonId(
  regionKey: string,
  token: string,
): Promise<number | null> {
  const rk = regionKey.toLowerCase();
  const now = Date.now();
  if (
    mythicSeasonIndexCache &&
    mythicSeasonIndexCache.regionKey === rk &&
    now - mythicSeasonIndexCache.fetchedAtMs < MYTHIC_SEASON_INDEX_TTL_MS
  ) {
    return mythicSeasonIndexCache.seasonId;
  }

  const host = HOST_BY_REGION[rk];
  if (!host) {
    return null;
  }

  const qs = new URLSearchParams({
    namespace: `dynamic-${rk}`,
    locale: rk === "eu" ? "en_GB" : "en_US",
  });
  const url = `https://${host}/data/wow/mythic-keystone/season/index?${qs}`;

  const started = Date.now();
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const elapsedMs = Date.now() - started;
    const preview = (await res.text().catch(() => "")).slice(0, 300);
    warn(
      "Mythic keystone season index failed (Game Data). Ensure your Battle.net client has WoW Game Data APIs enabled if you see 403.",
      {
        region: rk,
        status: res.status,
        statusText: res.statusText,
        elapsedMs,
        bodyPreview: preview || "(empty)",
      },
    );
    return null;
  }

  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    warn("Mythic season index response was not valid JSON", { region: rk });
    return null;
  }

  const parsed = mythicKeystoneSeasonIndexSchema.safeParse(raw);
  if (!parsed.success) {
    warn("Mythic season index JSON failed schema validation", {
      region: rk,
      issues: formatZodErrorBrief(parsed.error),
    });
    return null;
  }

  const seasonId = mythicSeasonIdFromIndex(parsed.data);
  if (seasonId === null) {
    warn("Could not resolve mythic season id from season index", {
      region: rk,
    });
    return null;
  }

  mythicSeasonIndexCache = {
    regionKey: rk,
    seasonId,
    fetchedAtMs: now,
  };

  return seasonId;
}

async function fetchMythicRatingFromKeystoneSeason(
  ref: WowArmoryCharacterRef,
  token: string,
  seasonId: number,
): Promise<number | null> {
  const host = HOST_BY_REGION[ref.region.toLowerCase()];
  if (!host) {
    return null;
  }

  const namespace = `profile-${ref.region.toLowerCase()}`;
  const realm = encodeURIComponent(ref.realmSlug.toLowerCase());
  const name = encodeURIComponent(ref.characterName.toLowerCase());

  const qs = new URLSearchParams({
    namespace,
    locale:
      ref.region.toLowerCase() === "eu"
        ? "en_GB"
        : ref.region.toLowerCase() === "kr" || ref.region.toLowerCase() === "tw"
          ? "en_US"
          : "en_US",
  });

  const url = `https://${host}/profile/wow/character/${realm}/${name}/mythic-keystone-profile/season/${seasonId}?${qs}`;

  const started = Date.now();
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    const elapsedMs = Date.now() - started;
    const preview = (await res.text().catch(() => "")).slice(0, 300);
    warn("Mythic keystone season profile request failed", {
      region: ref.region,
      realmSlug: ref.realmSlug,
      character: ref.characterName,
      seasonId,
      status: res.status,
      statusText: res.statusText,
      elapsedMs,
      bodyPreview: preview || "(empty)",
    });
    return null;
  }

  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    warn("Mythic keystone season response was not valid JSON", {
      region: ref.region,
      character: ref.characterName,
      seasonId,
    });
    return null;
  }

  const parsed = blizzardMythicKeystoneSeasonProfileSchema.safeParse(raw);
  if (!parsed.success) {
    warn("Mythic keystone season JSON failed schema validation", {
      region: ref.region,
      character: ref.characterName,
      seasonId,
      issues: formatZodErrorBrief(parsed.error),
    });
    return null;
  }

  const r = parsed.data.mythic_rating?.rating;
  const rating =
    typeof r === "number" && !Number.isNaN(r) ? Math.round(r) : null;

  return rating;
}

/**
 * Live M+ rating: root character resource usually omits `mythic_rating` (armory web UI
 * uses keystone season data). Prefer root when present; otherwise Game Data season index +
 * Profile `.../mythic-keystone-profile/season/{id}`.
 */
async function resolveLiveMythicPlusRating(
  ref: WowArmoryCharacterRef,
  token: string,
  summary: BlizzardCharacterProfileSummary,
): Promise<number | null> {
  const fromRoot = mythicFromSummary(summary);
  if (fromRoot !== null) {
    return fromRoot;
  }

  const seasonId = await fetchCurrentMythicSeasonId(ref.region, token);
  if (seasonId === null) {
    return null;
  }

  return fetchMythicRatingFromKeystoneSeason(ref, token, seasonId);
}

export async function enrichCharacterForDisplay(
  character: WowCharacterEntry,
): Promise<WowCharacterForDisplay> {
  const rosterIlvl = rosterNumber(character.ilvl ?? null);
  const rosterMplus = rosterNumber(character.mythicPlusScore ?? null);

  const baseClass = character.characterClass.trim();
  const baseSlots = classRoleCapacity(baseClass);

  if (!character.profileUrl) {
    return {
      rosterId: character.id,
      name: character.name,
      characterClass: baseClass,
      classRoleSlots: baseSlots,
      profileUrl: character.profileUrl,
      ilvl: rosterIlvl,
      ilvlTier:
        rosterIlvl !== null ? "snapshot" : "blocked-unconfigured",
      mythicPlusScore: rosterMplus,
      mythicTier:
        rosterMplus !== null ? "snapshot" : "blocked-unconfigured",
    };
  }

  const parsed = parseWowArmoryCharacterUrl(character.profileUrl);
  if (!parsed) {
    warn("Armory URL did not match expected profile path", {
      rosterId: character.id,
      profileUrl: character.profileUrl,
    });
    const resolvedClass = baseClass;
    return {
      rosterId: character.id,
      name: character.name,
      characterClass: resolvedClass,
      classRoleSlots: classRoleCapacity(resolvedClass),
      profileUrl: character.profileUrl,
      ilvl: rosterIlvl,
      ilvlTier: rosterIlvl !== null ? "snapshot" : "blocked-private",
      mythicPlusScore: rosterMplus,
      mythicTier: rosterMplus !== null ? "snapshot" : "blocked-private",
    };
  }

  const token = await getClientCredentialsToken();
  if (!token) {
    const resolvedClass = baseClass;
    return {
      rosterId: character.id,
      name: character.name,
      characterClass: resolvedClass,
      classRoleSlots: classRoleCapacity(resolvedClass),
      profileUrl: character.profileUrl,
      ilvl: rosterIlvl,
      ilvlTier: rosterIlvl !== null ? "snapshot" : "blocked-unconfigured",
      mythicPlusScore: rosterMplus,
      mythicTier: rosterMplus !== null ? "snapshot" : "blocked-unconfigured",
    };
  }

  const summary = await fetchRetailCharacterSummary(parsed, token);
  if (!summary) {
    const resolvedClass = baseClass;
    return {
      rosterId: character.id,
      name: character.name,
      characterClass: resolvedClass,
      classRoleSlots: classRoleCapacity(resolvedClass),
      profileUrl: character.profileUrl,
      ilvl: rosterIlvl,
      ilvlTier: rosterIlvl !== null ? "snapshot" : "blocked-private",
      mythicPlusScore: rosterMplus,
      mythicTier: rosterMplus !== null ? "snapshot" : "blocked-private",
    };
  }

  const apiIlvl =
    summary.equipped_item_level ?? summary.average_item_level ?? null;
  const apiMplus = await resolveLiveMythicPlusRating(parsed, token, summary);

  const resolvedClass =
    summary.character_class?.name?.trim() || baseClass;

  const ilvl =
    typeof apiIlvl === "number" && !Number.isNaN(apiIlvl)
      ? apiIlvl
      : rosterIlvl;
  const ilvlTier: WowStatTier =
    typeof apiIlvl === "number" && !Number.isNaN(apiIlvl)
      ? "live"
      : rosterIlvl !== null
        ? "snapshot"
        : "blocked-private";

  const mythicPlusScore =
    apiMplus !== null ? apiMplus : rosterMplus;
  const mythicTier: WowStatTier =
    apiMplus !== null
      ? "live"
      : rosterMplus !== null
        ? "snapshot"
        : "blocked-private";

  return {
    rosterId: character.id,
    name: character.name,
    characterClass: resolvedClass,
    classRoleSlots: classRoleCapacity(resolvedClass),
    profileUrl: character.profileUrl,
    ilvl,
    ilvlTier,
    mythicPlusScore,
    mythicTier,
  };
}

export async function enrichGroupRosterSections(
  sections: readonly WowGroupRosterUserSection[],
): Promise<
  readonly { user: WowUserEntry; characters: WowCharacterForDisplay[] }[]
> {
  return Promise.all(
    sections.map(async (section) => ({
      user: section.user,
      characters: await Promise.all(
        section.characters.map((c) => enrichCharacterForDisplay(c)),
      ),
    })),
  );
}
