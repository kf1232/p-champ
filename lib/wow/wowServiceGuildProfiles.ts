import type { WowServiceStoredData } from "./wowServiceLocalStorage";
import { parseRegionFromBlizzardCharacterResourceId } from "./wowServiceCharacterProfiles";

/**
 * Nested map under WoW service local storage: Blizzard guild summary `id` → last payload.
 */
export const WOW_SERVICE_GUILD_PROFILES_KEY =
  "guildProfileSummaries" as const;

/**
 * Maps normalized lookup key (`region|realmSlug|nameSlug`) → Blizzard guild `id`.
 */
export const WOW_SERVICE_GUILD_PROFILE_LOOKUP_INDEX_KEY =
  "guildProfileSummaryLookupIndex" as const;

/**
 * Guild roster payloads keyed by the same Blizzard guild `id` as {@link WOW_SERVICE_GUILD_PROFILES_KEY}.
 */
export const WOW_SERVICE_GUILD_ROSTERS_KEY = "guildRosterSummaries" as const;

export function makeGuildProfileLookupKey(
  region: string,
  realmSlug: string,
  nameSlug: string,
): string {
  return [
    region.toLowerCase().trim(),
    realmSlug.toLowerCase().trim(),
    nameSlug.toLowerCase().trim(),
  ].join("|");
}

function parseStringRecord(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string" && v.length > 0) out[k] = v;
  }
  return out;
}

export function extractGuildProfileSummaryId(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const id = (body as { id?: unknown }).id;
  if (typeof id === "string" && id.length > 0) return id;
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  return null;
}

function readSelfHrefFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const links = (payload as Record<string, unknown>)._links;
  if (!links || typeof links !== "object") return null;
  const self = (links as Record<string, unknown>).self;
  if (!self || typeof self !== "object") return null;
  const href = (self as Record<string, unknown>).href;
  return typeof href === "string" && href.length > 0 ? href : null;
}

/** Realm slug and guild name slug from a Game Data guild `self` or `id` URL. */
export function parseGuildRealmAndNameSlugFromHref(
  href: string,
): { realmSlug: string; nameSlug: string } | null {
  const m = href.match(/\/data\/wow\/guild\/([^/?#]+)\/([^/?#]+)/i);
  if (!m) return null;
  try {
    return {
      realmSlug: decodeURIComponent(m[1]!),
      nameSlug: decodeURIComponent(m[2]!),
    };
  } catch {
    return { realmSlug: m[1]!, nameSlug: m[2]! };
  }
}

export function findStoredGuildProfileSummary(
  data: WowServiceStoredData,
  region: string,
  realmSlug: string,
  nameSlug: string,
): unknown | null {
  const lookupKey = makeGuildProfileLookupKey(region, realmSlug, nameSlug);
  const index = parseStringRecord(
    data[WOW_SERVICE_GUILD_PROFILE_LOOKUP_INDEX_KEY],
  );
  const summaryId = index[lookupKey];
  if (!summaryId) return null;

  const summariesRaw = data[WOW_SERVICE_GUILD_PROFILES_KEY];
  if (
    !summariesRaw ||
    typeof summariesRaw !== "object" ||
    Array.isArray(summariesRaw)
  ) {
    return null;
  }
  const summaries = summariesRaw as Record<string, unknown>;
  const payload = summaries[summaryId];
  return payload !== undefined ? payload : null;
}

export function mergeGuildProfileSummaryIntoWowServiceData(
  prev: WowServiceStoredData,
  guildId: string,
  profilePayload: unknown,
  lookupKey: string,
): WowServiceStoredData {
  const raw = prev[WOW_SERVICE_GUILD_PROFILES_KEY];
  const map: Record<string, unknown> =
    raw &&
    typeof raw === "object" &&
    !Array.isArray(raw)
      ? { ...(raw as Record<string, unknown>) }
      : {};
  map[guildId] = profilePayload;

  const indexRaw = prev[WOW_SERVICE_GUILD_PROFILE_LOOKUP_INDEX_KEY];
  const index: Record<string, string> = parseStringRecord(indexRaw);
  index[lookupKey] = guildId;

  return {
    ...prev,
    [WOW_SERVICE_GUILD_PROFILES_KEY]: map,
    [WOW_SERVICE_GUILD_PROFILE_LOOKUP_INDEX_KEY]: index,
  };
}

/** Guild name, realm slug, and faction label for cache-debug / summary rows. */
export function extractGuildProfileSummaryStripFields(
  payload: unknown,
): { name: string; realmSlug: string; factionName: string } {
  if (!payload || typeof payload !== "object") {
    return { name: "—", realmSlug: "—", factionName: "—" };
  }
  const o = payload as Record<string, unknown>;
  const name = typeof o.name === "string" && o.name.length > 0 ? o.name : "—";
  let realmSlug = "—";
  const realm = o.realm;
  if (realm && typeof realm === "object") {
    const slug = (realm as Record<string, unknown>).slug;
    if (typeof slug === "string" && slug.length > 0) realmSlug = slug;
  }
  let factionName = "—";
  const faction = o.faction;
  if (faction && typeof faction === "object") {
    const fn = (faction as Record<string, unknown>).name;
    if (typeof fn === "string" && fn.length > 0) factionName = fn;
  }
  return { name, realmSlug, factionName };
}

/**
 * Form autofill from a cached guild summary: slug pair from `_links.self.href` or `id`,
 * realm slug from `realm`, region from URL when parseable.
 */
export function extractGuildProfileSummaryStripFormPick(
  payload: unknown,
): {
  nameSlug: string | null;
  realmSlug: string | null;
  regionFromResource: string | null;
} {
  if (!payload || typeof payload !== "object") {
    return { nameSlug: null, realmSlug: null, regionFromResource: null };
  }
  const o = payload as Record<string, unknown>;

  const href = readSelfHrefFromPayload(payload);
  if (href) {
    const parsed = parseGuildRealmAndNameSlugFromHref(href);
    if (parsed) {
      return {
        nameSlug: parsed.nameSlug,
        realmSlug: parsed.realmSlug,
        regionFromResource: parseRegionFromBlizzardCharacterResourceId(href),
      };
    }
  }

  const idStr = typeof o.id === "string" && o.id.length > 0 ? o.id : null;
  if (idStr) {
    const parsed = parseGuildRealmAndNameSlugFromHref(idStr);
    if (parsed) {
      return {
        nameSlug: parsed.nameSlug,
        realmSlug: parsed.realmSlug,
        regionFromResource: parseRegionFromBlizzardCharacterResourceId(idStr),
      };
    }
  }

  let realmSlug: string | null = null;
  const realm = o.realm;
  if (realm && typeof realm === "object") {
    const slug = (realm as Record<string, unknown>).slug;
    if (typeof slug === "string" && slug.trim().length > 0) {
      realmSlug = slug.trim();
    }
  }
  const regionFromResource = idStr
    ? parseRegionFromBlizzardCharacterResourceId(idStr)
    : null;
  return { nameSlug: null, realmSlug, regionFromResource };
}

export function findStoredGuildRosterSummary(
  data: WowServiceStoredData,
  region: string,
  realmSlug: string,
  nameSlug: string,
): unknown | null {
  const lookupKey = makeGuildProfileLookupKey(region, realmSlug, nameSlug);
  const index = parseStringRecord(
    data[WOW_SERVICE_GUILD_PROFILE_LOOKUP_INDEX_KEY],
  );
  const guildId = index[lookupKey];
  if (!guildId) return null;

  const rostersRaw = data[WOW_SERVICE_GUILD_ROSTERS_KEY];
  if (
    !rostersRaw ||
    typeof rostersRaw !== "object" ||
    Array.isArray(rostersRaw)
  ) {
    return null;
  }
  const roster = (rostersRaw as Record<string, unknown>)[guildId];
  return roster !== undefined ? roster : null;
}

export function hasStoredGuildRosterForGuildId(
  data: WowServiceStoredData,
  guildId: string,
): boolean {
  const raw = data[WOW_SERVICE_GUILD_ROSTERS_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
  return (raw as Record<string, unknown>)[guildId] !== undefined;
}

export function mergeGuildRosterSummaryIntoWowServiceData(
  prev: WowServiceStoredData,
  guildId: string,
  rosterPayload: unknown,
): WowServiceStoredData {
  const raw = prev[WOW_SERVICE_GUILD_ROSTERS_KEY];
  const map: Record<string, unknown> =
    raw &&
    typeof raw === "object" &&
    !Array.isArray(raw)
      ? { ...(raw as Record<string, unknown>) }
      : {};
  map[guildId] = rosterPayload;
  return {
    ...prev,
    [WOW_SERVICE_GUILD_ROSTERS_KEY]: map,
  };
}

/** Short label for cache UI (member count when `members` is an array). */
export function formatGuildRosterMemberCountLabel(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "Roster";
  const members = (payload as { members?: unknown }).members;
  if (Array.isArray(members)) return `Roster (${members.length})`;
  return "Roster";
}
