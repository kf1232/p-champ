import { WOW_GUILD_PATH } from "@/lib/site";

import { normalizeGuildNameSlugForApi } from "../guild/guildNameSlugNormalize.js";

/** Same keys as `app/api/wow/guild/constants.js`. */
export const GUILD_QUERY = {
  region: "region",
  realmSlug: "realmSlug",
  nameSlug: "nameSlug",
  namespace: "namespace",
  locale: "locale",
} as const;

export const GUILD_API_PATH = "/api/wow/guild";

export const GUILD_ROSTER_API_PATH = "/api/wow/guild-roster";

/**
 * Builds `/wow/guild` with query params the guild lookup form reads (`GUILD_QUERY`).
 * `guildNameInput` is the raw guild name (same as the guild form field); the API normalizes it.
 */
export function buildWowGuildPageLookupHref(options: {
  region: string;
  guildRealmSlug: string;
  guildNameInput: string;
}): string {
  const q = new URLSearchParams();
  q.set(GUILD_QUERY.region, options.region.toLowerCase().trim());
  q.set(GUILD_QUERY.realmSlug, options.guildRealmSlug.trim());
  q.set(GUILD_QUERY.nameSlug, options.guildNameInput.trim());
  return `${WOW_GUILD_PATH}?${q.toString()}`;
}

/**
 * Normalizes guild name for API path / cache keys (trim, lowercase, spaces → hyphens).
 * Call from the client only when deriving lookup keys; the guild API applies the same rule.
 */
export function guildNameInputToNameSlug(raw: string): string {
  return normalizeGuildNameSlugForApi(raw);
}

/**
 * Default Blizzard `namespace` for guild Game Data when the request omits it.
 * Keep in sync with `app/api/wow/guild/guild.js`.
 */
export function guildDefaultNamespaceForRegion(region: string): string {
  return `profile-${region.toLowerCase()}`;
}

/**
 * Default Blizzard `locale` when the request omits it.
 * Keep in sync with `wowApiLocaleForRegion` in `battle-net/battleNetClientCredentials.ts`.
 */
export function guildDefaultLocaleForRegion(region: string): string {
  const r = region.toLowerCase();
  if (r === "eu") return "en_GB";
  if (r === "kr") return "ko_KR";
  if (r === "tw") return "zh_TW";
  if (r === "cn") return "zh_CN";
  return "en_US";
}
