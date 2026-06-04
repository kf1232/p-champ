/**
 * Canonical `localStorage` keys for the app. New keys must be added here and
 * registered in `registry.ts` — do not call `localStorage` directly.
 */
export const APP_STORAGE_KEYS = {
  burkeLocationFinder: "p-champ:burke-location-finder",
  colorScheme: "p-champ:color-scheme",
  wowService: "p-champ:wow-service",
  selectedGame: "p-champ:selected-game",
  wowDebugRawPanels: "p-champ:wow-debug-raw-panels",
  wowLastCharacterLookup: "p-champ:wow-last-character-lookup",
  wowLastGuildLookup: "p-champ:wow-last-guild-lookup",
} as const;

export type AppStorageKey =
  (typeof APP_STORAGE_KEYS)[keyof typeof APP_STORAGE_KEYS];
