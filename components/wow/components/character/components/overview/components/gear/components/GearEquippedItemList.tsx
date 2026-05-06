import type { CharacterOverviewItemCard } from "@/lib/wow";

import { CharacterGearItemCard } from "./CharacterGearItemCard";

export type GearEquippedItemListProps = {
  cards: CharacterOverviewItemCard[];
};

export function GearEquippedItemList({ cards }: GearEquippedItemListProps) {
  return (
    <div className="character-overview-item-card-list">
      {cards.map((card) => (
        <CharacterGearItemCard
          key={`${card.slotType}-${card.itemName}-${card.itemLevel}`}
          card={card}
        />
      ))}
    </div>
  );
}
