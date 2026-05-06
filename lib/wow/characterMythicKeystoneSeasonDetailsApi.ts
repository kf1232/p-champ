/** Same keys as `app/api/wow/character-mythic-keystone-season-details/constants.js`. */
export const CHARACTER_MYTHIC_KEYSTONE_SEASON_DETAILS_QUERY = {
  region: "region",
  realmSlug: "realmSlug",
  characterName: "characterName",
  seasonId: "seasonId",
  namespace: "namespace",
  locale: "locale",
} as const;

export const CHARACTER_MYTHIC_KEYSTONE_SEASON_DETAILS_API_PATH =
  "/api/wow/character-mythic-keystone-season-details";

/** Default season for the character page until a season picker exists. */
export const CHARACTER_MYTHIC_KEYSTONE_DEFAULT_SEASON_ID = "17" as const;
