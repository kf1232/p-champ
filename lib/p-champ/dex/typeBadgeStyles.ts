import type { TypeName } from "./types";

/**
 * Fixed Pokémon-style type colors (text tuned for contrast on each swatch).
 * @see https://bulbapedia.bulbagarden.net/wiki/Type
 */
export const TYPE_BADGE_CLASSES: Record<TypeName, string> = {
  bug: "bg-[#A8B820] text-black",
  dark: "bg-[#705848] text-white",
  dragon: "bg-[#7038F8] text-white",
  electric: "bg-[#F8D030] text-black",
  fairy: "bg-[#EE99AC] text-black",
  fighting: "bg-[#C03028] text-white",
  fire: "bg-[#F08030] text-white",
  flying: "bg-[#A890F0] text-black",
  ghost: "bg-[#705898] text-white",
  grass: "bg-[#78C850] text-black",
  ground: "bg-[#E0C068] text-black",
  ice: "bg-[#98D8D8] text-black",
  normal: "bg-[#A8A878] text-black",
  poison: "bg-[#A040A0] text-white",
  psychic: "bg-[#F85888] text-white",
  rock: "bg-[#B8A038] text-black",
  steel: "bg-[#B8B8D0] text-black",
  water: "bg-[#6890F0] text-white",
};

export function formatTypeLabel(typeName: TypeName): string {
  return typeName.charAt(0).toUpperCase() + typeName.slice(1);
}
