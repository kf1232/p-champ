"use client";

import { useMemo } from "react";

import { mapEquipmentToItemCards } from "@/lib/wow";

import { GearEmptyState, GearEquippedItemList } from "./components";

export type CharacterGearInformationSectionProps = {
  equipment: unknown | null;
  equipmentEmptyMessage: string;
  equipmentError?: string | null;
};

export function CharacterGearInformationSection({
  equipment,
  equipmentEmptyMessage,
  equipmentError,
}: CharacterGearInformationSectionProps) {
  const itemCards = useMemo(
    () => (equipment ? mapEquipmentToItemCards(equipment) : []),
    [equipment],
  );

  const equipmentBodyMessage =
    equipmentError ??
    (equipment &&
    typeof equipment === "object" &&
    !Array.isArray(equipment) &&
    typeof (equipment as Record<string, unknown>).message === "string" &&
    !Array.isArray((equipment as Record<string, unknown>).equipped_items)
      ? String((equipment as Record<string, unknown>).message)
      : null);

  const showGearCards =
    equipment !== null && !equipmentBodyMessage && itemCards.length > 0;

  const gearEmptyCopy = equipmentBodyMessage ?? equipmentEmptyMessage;
  const gearFallbackEmpty =
    equipment !== null &&
    !equipmentBodyMessage &&
    itemCards.length === 0
      ? "No equipped items in response."
      : gearEmptyCopy;

  return (
    <section
      className="character-overview-segment"
      aria-labelledby="character-overview-gear-heading"
    >
      <h2
        id="character-overview-gear-heading"
        className="character-overview-segment-title"
      >
        Character Gear Information
      </h2>
      {equipment === null ? (
        <GearEmptyState
          message={equipmentError ?? equipmentEmptyMessage}
        />
      ) : !showGearCards ? (
        <GearEmptyState message={gearFallbackEmpty} />
      ) : (
        <GearEquippedItemList cards={itemCards} />
      )}
    </section>
  );
}
