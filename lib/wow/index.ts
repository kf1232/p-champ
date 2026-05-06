/** WoW feature — client persistence, Battle.net helpers, etc. */

export {
  WOW_SERVICE_LOCAL_STORAGE_KEY,
  WOW_SERVICE_STORAGE_TTL_MS,
  subscribeWowServiceStorage,
  getWowServiceStorageSnapshot,
  getWowServiceStorageServerSnapshot,
  parseWowServiceStorageRaw,
  writeWowServiceStoredData,
  clearWowServiceStoredData,
} from "./wowServiceLocalStorage";

export type {
  WowServiceStoredData,
  WowServiceStorageParse,
} from "./wowServiceLocalStorage";

export {
  WOW_SERVICE_CHARACTER_PROFILES_KEY,
  WOW_SERVICE_CHARACTER_PROFILE_LOOKUP_INDEX_KEY,
  WOW_SERVICE_CHARACTER_MYTHIC_KEYSTONE_PROFILES_KEY,
  WOW_SERVICE_CHARACTER_EQUIPMENT_KEY,
  WOW_SERVICE_CHARACTER_MYTHIC_SEASON_DETAILS_KEY,
  makeCharacterProfileLookupKey,
  parseRegionFromBlizzardCharacterResourceId,
  extractCharacterProfileSummaryStripFields,
  extractCharacterProfileSummaryStripFormPick,
  extractCharacterProfileSummaryId,
  findStoredCharacterProfileSummary,
  findStoredCharacterEquipment,
  findStoredCharacterMythicKeystoneProfile,
  findStoredCharacterMythicKeystoneSeasonDetails,
  hasStoredCharacterEquipmentForSummaryId,
  hasStoredCharacterMythicKeystoneForSummaryId,
  hasStoredCharacterMythicKeystoneSeasonDetailsForSummaryId,
  mergeCharacterProfileSummaryIntoWowServiceData,
  mergeCharacterEquipmentIntoWowServiceData,
  mergeCharacterMythicKeystoneProfileIntoWowServiceData,
  mergeCharacterMythicKeystoneSeasonDetailsIntoWowServiceData,
} from "./wowServiceCharacterProfiles";

export {
  mapProfileSummaryToCharacterInfoRows,
  mapEquipmentToItemCards,
  mapMythicProfileToOverview,
  mapSeasonDetailsToOverview,
  rgbaToCss,
} from "./characterOverviewViewModels";

export type {
  CharacterOverviewInfoRow,
  CharacterOverviewItemCard,
  CharacterOverviewMythicSummary,
  CharacterOverviewMythicRunRow,
  CharacterOverviewSeasonHeader,
  RgbaColor,
} from "./characterOverviewViewModels";

export {
  WOW_SERVICE_GUILD_PROFILES_KEY,
  WOW_SERVICE_GUILD_PROFILE_LOOKUP_INDEX_KEY,
  WOW_SERVICE_GUILD_ROSTERS_KEY,
  makeGuildProfileLookupKey,
  parseGuildRealmAndNameSlugFromHref,
  extractGuildProfileSummaryId,
  extractGuildProfileSummaryStripFields,
  extractGuildProfileSummaryStripFormPick,
  findStoredGuildProfileSummary,
  findStoredGuildRosterSummary,
  formatGuildRosterMemberCountLabel,
  hasStoredGuildRosterForGuildId,
  mergeGuildProfileSummaryIntoWowServiceData,
  mergeGuildRosterSummaryIntoWowServiceData,
} from "./wowServiceGuildProfiles";
