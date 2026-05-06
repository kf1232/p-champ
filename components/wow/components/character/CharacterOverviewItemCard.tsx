import type { CharacterOverviewItemCard } from "@/lib/wow";

function ItemCardRow({
  label,
  children,
  valueClassName,
}: {
  label: string;
  children: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="character-overview-item-card__row">
      <span className="character-overview-item-card__label">{label}</span>
      <span
        className={["character-overview-item-card__value", valueClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </span>
    </div>
  );
}

function MergedSourceQualityStage({ card }: { card: CharacterOverviewItemCard }) {
  const hasSource =
    card.itemSource != null && card.itemSource.trim().length > 0;
  const hasStage =
    card.itemStage != null && card.itemStage.trim().length > 0;
  const stageSuffix = hasStage ? ` (${card.itemStage})` : null;

  if (hasSource) {
    return (
      <>
        {card.itemSource}
        {stageSuffix}
      </>
    );
  }

  return (
    <>
      {card.qualityType ? (
        <span
          className={`character-overview-quality character-overview-quality--${card.qualityType}`}
        >
          {card.qualityLabel}
        </span>
      ) : (
        card.qualityLabel
      )}
      {stageSuffix}
    </>
  );
}

export function CharacterGearItemCard({ card }: { card: CharacterOverviewItemCard }) {
  const hasEnchantText =
    card.enchant != null && card.enchant.trim().length > 0;
  const showEnchantRow = hasEnchantText || card.slotExpectsEnchant;

  const rootClass = [
    "character-overview-item-card",
    card.enchantError ? "character-overview-item-card--enchant-error" : "",
    card.socketError ? "character-overview-item-card--socket-error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const gearInvalid = card.enchantError || card.socketError;

  return (
    <article
      className={rootClass}
      aria-label={`${card.slotLabel}: ${card.itemName}`}
      aria-invalid={gearInvalid}
    >
      <ItemCardRow label="Item Slot">{card.slotLabel}</ItemCardRow>
      <ItemCardRow label="Item Name">{card.itemName}</ItemCardRow>
      <ItemCardRow label="Item Quality">
        <MergedSourceQualityStage card={card} />
      </ItemCardRow>
      <ItemCardRow label="Item Level">{card.itemLevel}</ItemCardRow>
      {showEnchantRow ? (
        <ItemCardRow
          label="Enchant"
          valueClassName={
            card.enchantError
              ? "character-overview-item-card__value--enchant-error"
              : undefined
          }
        >
          {hasEnchantText ? card.enchant : "-"}
        </ItemCardRow>
      ) : null}
      {card.socketsDisplay != null ? (
        <ItemCardRow
          label="Sockets"
          valueClassName={
            card.socketError
              ? "character-overview-item-card__value--enchant-error"
              : undefined
          }
        >
          {card.socketsDisplay}
        </ItemCardRow>
      ) : null}
      {card.itemSet ? (
        <ItemCardRow label="Item Set">{card.itemSet}</ItemCardRow>
      ) : null}
    </article>
  );
}
