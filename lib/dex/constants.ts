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

export type FormId = (typeof FORM_IDS)[keyof typeof FORM_IDS];

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

