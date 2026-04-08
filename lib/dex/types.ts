export const TYPES = {
  dragon: "dragon",
  steel: "steel",
  flying: "flying",
  fairy: "fairy",
  grass: "grass",
  electric: "electric",
  normal: "normal",
  fire: "fire",
  ghost: "ghost",
} as const;

export type TypeId = (typeof TYPES)[keyof typeof TYPES];

