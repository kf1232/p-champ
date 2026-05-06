/**
 * WoW Profile / Game Data API regional hosts use these region IDs in URLs and
 * `namespace=profile-{region}` (see Blizzard “Regionality and APIs”).
 * https://develop.battle.net/documentation/guides/regionality-and-apis
 */
export const WOW_PROFILE_API_REGIONS = [
  { value: "us", label: "Americas" },
  { value: "eu", label: "Europe" },
  { value: "kr", label: "Korea" },
  { value: "tw", label: "Taiwan" },
  { value: "cn", label: "China" },
] as const;

export type WowProfileApiRegionId =
  (typeof WOW_PROFILE_API_REGIONS)[number]["value"];
