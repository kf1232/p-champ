import type { WowServiceStoredData } from "./wowServiceLocalStorage";
import {
  extractBlizzardJsonEntityId,
  parseStringRecord,
} from "./wowServiceStorageUtils";

/**
 * Nested map under WoW service local storage: Blizzard profile summary `id` → last payload.
 */
export const WOW_SERVICE_CHARACTER_PROFILES_KEY =
  "characterProfileSummaries" as const;

/**
 * Maps normalized lookup key (`region|realmSlug|characterName`) → Blizzard summary `id`.
 */
export const WOW_SERVICE_CHARACTER_PROFILE_LOOKUP_INDEX_KEY =
  "characterProfileSummaryLookupIndex" as const;

/**
 * Mythic Keystone profile index payloads keyed by the same Blizzard character `id`
 * as {@link WOW_SERVICE_CHARACTER_PROFILES_KEY}.
 */
export const WOW_SERVICE_CHARACTER_MYTHIC_KEYSTONE_PROFILES_KEY =
  "characterMythicKeystoneProfiles" as const;

/**
 * Character equipment payloads keyed by the same Blizzard character `id` as profile summaries.
 */
export const WOW_SERVICE_CHARACTER_EQUIPMENT_KEY =
  "characterEquipmentProfiles" as const;

/**
 * Mythic Keystone **season** payloads: keyed by Blizzard character `id`, then by `seasonId` string.
 */
export const WOW_SERVICE_CHARACTER_MYTHIC_SEASON_DETAILS_KEY =
  "characterMythicKeystoneSeasonDetails" as const;

export function makeCharacterProfileLookupKey(
  region: string,
  realmSlug: string,
  characterName: string,
): string {
  return [
    region.toLowerCase().trim(),
    realmSlug.toLowerCase().trim(),
    characterName.toLowerCase().trim(),
  ].join("|");
}

export function extractCharacterProfileSummaryId(
  body: unknown,
): string | null {
  return extractBlizzardJsonEntityId(body);
}

export function findStoredCharacterProfileSummary(
  data: WowServiceStoredData,
  region: string,
  realmSlug: string,
  characterName: string,
): unknown | null {
  const lookupKey = makeCharacterProfileLookupKey(
    region,
    realmSlug,
    characterName,
  );
  const index = parseStringRecord(
    data[WOW_SERVICE_CHARACTER_PROFILE_LOOKUP_INDEX_KEY],
  );
  const summaryId = index[lookupKey];
  if (!summaryId) return null;

  const summariesRaw = data[WOW_SERVICE_CHARACTER_PROFILES_KEY];
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

export function mergeCharacterProfileSummaryIntoWowServiceData(
  prev: WowServiceStoredData,
  summaryId: string,
  profilePayload: unknown,
  lookupKey: string,
): WowServiceStoredData {
  const raw = prev[WOW_SERVICE_CHARACTER_PROFILES_KEY];
  const map: Record<string, unknown> =
    raw &&
    typeof raw === "object" &&
    !Array.isArray(raw)
      ? { ...(raw as Record<string, unknown>) }
      : {};
  map[summaryId] = profilePayload;

  const indexRaw = prev[WOW_SERVICE_CHARACTER_PROFILE_LOOKUP_INDEX_KEY];
  const index: Record<string, string> = parseStringRecord(indexRaw);
  index[lookupKey] = summaryId;

  return {
    ...prev,
    [WOW_SERVICE_CHARACTER_PROFILES_KEY]: map,
    [WOW_SERVICE_CHARACTER_PROFILE_LOOKUP_INDEX_KEY]: index,
  };
}

/** Region segment from Blizzard profile `id` URL or `namespace=profile-{region}`. */
export function parseRegionFromBlizzardCharacterResourceId(
  id: string,
): string | null {
  const host = id.match(/https?:\/\/([a-z]{2})\.api\.blizzard\.com\b/i);
  if (host) return host[1]!.toLowerCase();
  if (/gateway\.battlenet\.com\.cn/i.test(id)) return "cn";
  const ns = id.match(/[?&]namespace=profile-([a-z]{2})\b/i);
  if (ns) return ns[1]!.toLowerCase();
  return null;
}

/** Name, class label, and level for cache-debug / summary rows. */
export function extractCharacterProfileSummaryStripFields(
  payload: unknown,
): { name: string; characterClassName: string; level: string } {
  if (!payload || typeof payload !== "object") {
    return { name: "—", characterClassName: "—", level: "—" };
  }
  const o = payload as Record<string, unknown>;
  const name = typeof o.name === "string" && o.name.length > 0 ? o.name : "—";
  let characterClassName = "—";
  const cc = o.character_class;
  if (cc && typeof cc === "object") {
    const cn = (cc as Record<string, unknown>).name;
    if (typeof cn === "string" && cn.length > 0) characterClassName = cn;
  }
  const lv = o.level;
  const level =
    typeof lv === "number" && Number.isFinite(lv)
      ? String(lv)
      : typeof lv === "string" && lv.length > 0
        ? lv
        : "—";
  return { name, characterClassName, level };
}

function readProfileSelfHrefFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const links = (payload as Record<string, unknown>)._links;
  if (!links || typeof links !== "object") return null;
  const self = (links as Record<string, unknown>).self;
  if (!self || typeof self !== "object") return null;
  const href = (self as Record<string, unknown>).href;
  return typeof href === "string" && href.length > 0 ? href : null;
}

/**
 * Form autofill from a cached profile summary: `name`, `realm.slug`, and an
 * optional region parsed from `_links.self.href` or the resource `id` URL.
 */
export function extractCharacterProfileSummaryStripFormPick(
  payload: unknown,
): {
  characterName: string | null;
  realmSlug: string | null;
  regionFromResource: string | null;
} {
  if (!payload || typeof payload !== "object") {
    return { characterName: null, realmSlug: null, regionFromResource: null };
  }
  const o = payload as Record<string, unknown>;
  const characterName =
    typeof o.name === "string" && o.name.trim().length > 0
      ? o.name.trim()
      : null;
  let realmSlug: string | null = null;
  const realm = o.realm;
  if (realm && typeof realm === "object") {
    const slug = (realm as Record<string, unknown>).slug;
    if (typeof slug === "string" && slug.trim().length > 0) {
      realmSlug = slug.trim();
    }
  }
  const href = readProfileSelfHrefFromPayload(payload);
  const idStr = typeof o.id === "string" && o.id.length > 0 ? o.id : null;
  const regionSource = href ?? idStr;
  const regionFromResource = regionSource
    ? parseRegionFromBlizzardCharacterResourceId(regionSource)
    : null;
  return { characterName, realmSlug, regionFromResource };
}

export function findStoredCharacterEquipment(
  data: WowServiceStoredData,
  region: string,
  realmSlug: string,
  characterName: string,
): unknown | null {
  const lookupKey = makeCharacterProfileLookupKey(
    region,
    realmSlug,
    characterName,
  );
  const index = parseStringRecord(
    data[WOW_SERVICE_CHARACTER_PROFILE_LOOKUP_INDEX_KEY],
  );
  const summaryId = index[lookupKey];
  if (!summaryId) return null;

  const raw = data[WOW_SERVICE_CHARACTER_EQUIPMENT_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const payload = (raw as Record<string, unknown>)[summaryId];
  return payload !== undefined ? payload : null;
}

export function findStoredCharacterMythicKeystoneProfile(
  data: WowServiceStoredData,
  region: string,
  realmSlug: string,
  characterName: string,
): unknown | null {
  const lookupKey = makeCharacterProfileLookupKey(
    region,
    realmSlug,
    characterName,
  );
  const index = parseStringRecord(
    data[WOW_SERVICE_CHARACTER_PROFILE_LOOKUP_INDEX_KEY],
  );
  const summaryId = index[lookupKey];
  if (!summaryId) return null;

  const raw = data[WOW_SERVICE_CHARACTER_MYTHIC_KEYSTONE_PROFILES_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const payload = (raw as Record<string, unknown>)[summaryId];
  return payload !== undefined ? payload : null;
}

export function hasStoredCharacterMythicKeystoneForSummaryId(
  data: WowServiceStoredData,
  summaryId: string,
): boolean {
  const raw = data[WOW_SERVICE_CHARACTER_MYTHIC_KEYSTONE_PROFILES_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
  return (raw as Record<string, unknown>)[summaryId] !== undefined;
}

export function hasStoredCharacterEquipmentForSummaryId(
  data: WowServiceStoredData,
  summaryId: string,
): boolean {
  const raw = data[WOW_SERVICE_CHARACTER_EQUIPMENT_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
  return (raw as Record<string, unknown>)[summaryId] !== undefined;
}

export function mergeCharacterEquipmentIntoWowServiceData(
  prev: WowServiceStoredData,
  summaryId: string,
  equipmentPayload: unknown,
): WowServiceStoredData {
  const raw = prev[WOW_SERVICE_CHARACTER_EQUIPMENT_KEY];
  const map: Record<string, unknown> =
    raw &&
    typeof raw === "object" &&
    !Array.isArray(raw)
      ? { ...(raw as Record<string, unknown>) }
      : {};
  map[summaryId] = equipmentPayload;
  return {
    ...prev,
    [WOW_SERVICE_CHARACTER_EQUIPMENT_KEY]: map,
  };
}

export function mergeCharacterMythicKeystoneProfileIntoWowServiceData(
  prev: WowServiceStoredData,
  summaryId: string,
  mythicPayload: unknown,
): WowServiceStoredData {
  const raw = prev[WOW_SERVICE_CHARACTER_MYTHIC_KEYSTONE_PROFILES_KEY];
  const map: Record<string, unknown> =
    raw &&
    typeof raw === "object" &&
    !Array.isArray(raw)
      ? { ...(raw as Record<string, unknown>) }
      : {};
  map[summaryId] = mythicPayload;
  return {
    ...prev,
    [WOW_SERVICE_CHARACTER_MYTHIC_KEYSTONE_PROFILES_KEY]: map,
  };
}

export function findStoredCharacterMythicKeystoneSeasonDetails(
  data: WowServiceStoredData,
  region: string,
  realmSlug: string,
  characterName: string,
  seasonId: string,
): unknown | null {
  const lookupKey = makeCharacterProfileLookupKey(
    region,
    realmSlug,
    characterName,
  );
  const index = parseStringRecord(
    data[WOW_SERVICE_CHARACTER_PROFILE_LOOKUP_INDEX_KEY],
  );
  const summaryId = index[lookupKey];
  if (!summaryId) return null;

  const raw = data[WOW_SERVICE_CHARACTER_MYTHIC_SEASON_DETAILS_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const byCharacter = (raw as Record<string, unknown>)[summaryId];
  if (
    !byCharacter ||
    typeof byCharacter !== "object" ||
    Array.isArray(byCharacter)
  ) {
    return null;
  }
  const payload = (byCharacter as Record<string, unknown>)[seasonId];
  return payload !== undefined ? payload : null;
}

export function hasStoredCharacterMythicKeystoneSeasonDetailsForSummaryId(
  data: WowServiceStoredData,
  summaryId: string,
  seasonId: string,
): boolean {
  const raw = data[WOW_SERVICE_CHARACTER_MYTHIC_SEASON_DETAILS_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
  const byCharacter = (raw as Record<string, unknown>)[summaryId];
  if (
    !byCharacter ||
    typeof byCharacter !== "object" ||
    Array.isArray(byCharacter)
  ) {
    return false;
  }
  return (byCharacter as Record<string, unknown>)[seasonId] !== undefined;
}

export function mergeCharacterMythicKeystoneSeasonDetailsIntoWowServiceData(
  prev: WowServiceStoredData,
  summaryId: string,
  seasonId: string,
  seasonPayload: unknown,
): WowServiceStoredData {
  const key = WOW_SERVICE_CHARACTER_MYTHIC_SEASON_DETAILS_KEY;
  const raw = prev[key];
  const prevOuter: Record<string, Record<string, unknown>> =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, Record<string, unknown>>)
      : {};
  const outer = { ...prevOuter };
  const prevInner = outer[summaryId];
  const inner = {
    ...(prevInner &&
    typeof prevInner === "object" &&
    !Array.isArray(prevInner)
      ? prevInner
      : {}),
    [seasonId]: seasonPayload,
  };
  outer[summaryId] = inner;
  return { ...prev, [key]: outer };
}
