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
 * Default Blizzard `namespace` for guild Game Data when the request omits it.
 * Keep in sync with `app/api/wow/guild/guild.js`.
 */
export function guildDefaultNamespaceForRegion(region: string): string {
  return `profile-${region.toLowerCase()}`;
}

/**
 * Default Blizzard `locale` when the request omits it.
 * Keep in sync with `wowApiLocaleForRegion` in `battleNetClientCredentials.ts`.
 */
export function guildDefaultLocaleForRegion(region: string): string {
  const r = region.toLowerCase();
  if (r === "eu") return "en_GB";
  if (r === "kr") return "ko_KR";
  if (r === "tw") return "zh_TW";
  if (r === "cn") return "zh_CN";
  return "en_US";
}
