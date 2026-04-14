export const GAME_IDS = {
  CHAMPIONS: "CHAMPIONS",
} as const;

export type GameId = (typeof GAME_IDS)[keyof typeof GAME_IDS];

/** All valid game ids; derived from `GAME_IDS` so new games are registered in one place. */
export const VALID_GAMES: readonly GameId[] = Object.values(GAME_IDS);

export const GAME_LABELS: Record<GameId, string> = {
  [GAME_IDS.CHAMPIONS]: "Champions",
};

/**
 * Dex list filter: full national dex (no `games` filter), or a single release
 * (`games[gameId] === true` only).
 */
export const NATIONAL_VIEW_ID = "NATIONAL" as const;

export type DexListViewId = GameId | typeof NATIONAL_VIEW_ID;

export const DEX_LIST_VIEW_IDS: readonly DexListViewId[] = [
  NATIONAL_VIEW_ID,
  ...VALID_GAMES,
];

export const DEX_LIST_VIEW_LABELS: Record<DexListViewId, string> = {
  [NATIONAL_VIEW_ID]: "National",
  ...GAME_LABELS,
};

export const FORM_IDS = {
  base: "base",
  aloan: "aloan",
  galarian: "galarian",
  hisuian: "hisuian",
  paldeanCombat: "paldean-combat",
  paldeanFire: "paldean-fire",
  paldeanWater: "paldean-water",
  heat: "heat",
  wash: "wash",
  frost: "frost",
  fan: "fan",
  grass: "grass",
  female: "female",
  small: "small",
  medium: "medium",
  large: "large",
  jumbo: "jumbo",
  midnight: "midnight",
  dusk: "dusk",
} as const;

export type FormId =
  | (typeof FORM_IDS)[keyof typeof FORM_IDS]
  | `form-${string}`;

export const MOVE_CATEGORIES = {
  SPATK: "SPATK",
  ATK: "ATK",
} as const;

export type MoveCategory =
  (typeof MOVE_CATEGORIES)[keyof typeof MOVE_CATEGORIES];

export const MOVE_RANGES = {
  SELF: "SELF",
  SINGLE_ALLY: "SINGLE_ALLY",
  SINGLE_TARGET: "SINGLE_TARGET",
  ALL_TARGET: "ALL_TARGET",
  ALL_OPPONENTS: "ALL_OPPONENTS",
  ALL_ALLY: "ALL_ALLY",
  RANDOM_OPPONENT: "RANDOM_OPPONENT",
  RANDOM_TARGET: "RANDOM_TARGET",
} as const;

export type MoveRange = (typeof MOVE_RANGES)[keyof typeof MOVE_RANGES];

