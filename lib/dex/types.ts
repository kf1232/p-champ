export const TYPES = {
  dragon: "dragon",
  flying: "flying",
  fairy: "fairy",
  grass: "grass",
  electric: "electric",
  fire: "fire",
  ghost: "ghost",
} as const;

export type TypeId = (typeof TYPES)[keyof typeof TYPES];

