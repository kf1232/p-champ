/**
 * Remembers the last successful character / guild lookup so revisiting
 * `/wow/character` or `/wow/guild` without query params can restore the form
 * and cached payloads from `WowServiceStorageProvider`.
 */

import {
  WOW_PROFILE_API_REGIONS,
  type WowProfileApiRegionId,
} from "../battle-net/battleNetProfileRegions";

export const WOW_LAST_CHARACTER_LOOKUP_STORAGE_KEY =
  "p-champ:wow-last-character-lookup";

export const WOW_LAST_GUILD_LOOKUP_STORAGE_KEY =
  "p-champ:wow-last-guild-lookup";

export type WowLastCharacterLookup = {
  region: WowProfileApiRegionId;
  realmSlug: string;
  characterName: string;
};

export type WowLastGuildLookup = {
  region: WowProfileApiRegionId;
  realmSlug: string;
  nameSlug: string;
};

function isWowProfileRegionId(value: string): value is WowProfileApiRegionId {
  return WOW_PROFILE_API_REGIONS.some((r) => r.value === value);
}

function readJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function readLastCharacterLookup(): WowLastCharacterLookup | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(WOW_LAST_CHARACTER_LOOKUP_STORAGE_KEY);
  } catch {
    return null;
  }
  const parsed = readJson(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }
  const o = parsed as Record<string, unknown>;
  const region = o.region;
  const realmSlug =
    typeof o.realmSlug === "string" ? o.realmSlug.trim() : "";
  const characterName =
    typeof o.characterName === "string" ? o.characterName.trim() : "";
  if (
    typeof region !== "string" ||
    !isWowProfileRegionId(region) ||
    !realmSlug ||
    !characterName
  ) {
    return null;
  }
  return { region, realmSlug, characterName };
}

export function writeLastCharacterLookup(
  entry: WowLastCharacterLookup,
): void {
  if (typeof window === "undefined") return;
  const realmSlug = entry.realmSlug.trim();
  const characterName = entry.characterName.trim();
  if (!realmSlug || !characterName) return;
  if (!isWowProfileRegionId(entry.region)) return;
  try {
    localStorage.setItem(
      WOW_LAST_CHARACTER_LOOKUP_STORAGE_KEY,
      JSON.stringify({
        region: entry.region,
        realmSlug,
        characterName,
      }),
    );
  } catch {
    /* ignore quota / private mode */
  }
}

export function readLastGuildLookup(): WowLastGuildLookup | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(WOW_LAST_GUILD_LOOKUP_STORAGE_KEY);
  } catch {
    return null;
  }
  const parsed = readJson(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }
  const o = parsed as Record<string, unknown>;
  const region = o.region;
  const realmSlug =
    typeof o.realmSlug === "string" ? o.realmSlug.trim() : "";
  const nameSlug =
    typeof o.nameSlug === "string" ? o.nameSlug.trim() : "";
  if (
    typeof region !== "string" ||
    !isWowProfileRegionId(region) ||
    !realmSlug ||
    !nameSlug
  ) {
    return null;
  }
  return { region, realmSlug, nameSlug };
}

export function writeLastGuildLookup(entry: WowLastGuildLookup): void {
  if (typeof window === "undefined") return;
  const realmSlug = entry.realmSlug.trim();
  const nameSlug = entry.nameSlug.trim();
  if (!realmSlug || !nameSlug) return;
  if (!isWowProfileRegionId(entry.region)) return;
  try {
    localStorage.setItem(
      WOW_LAST_GUILD_LOOKUP_STORAGE_KEY,
      JSON.stringify({
        region: entry.region,
        realmSlug,
        nameSlug,
      }),
    );
  } catch {
    /* ignore quota / private mode */
  }
}
