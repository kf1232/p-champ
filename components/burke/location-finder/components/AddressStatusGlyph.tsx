import {
  ADDRESS_STATUS_DISPLAY_ORDER,
  ADDRESS_STATUS_SECTION_LABELS,
} from "@/lib/burke/geo/constants";
import type { AddressStatusDisplayKey } from "@/lib/burke/geo/types";

type AddressStatusGlyphProps = {
  status: AddressStatusDisplayKey;
  size?: "row" | "inline";
};

const sizeClassName = {
  row: "h-5 w-5",
  inline: "h-4 w-4",
} as const;

const toneClassName = {
  success: "rounded-full bg-emerald-100 text-emerald-700",
  warning: "rounded-full bg-amber-100 text-amber-700",
  error: "rounded-full bg-red-100 text-red-700",
} as const;

export function AddressStatusGlyph({
  status,
  size = "row",
}: AddressStatusGlyphProps) {
  const box = `${sizeClassName[size]} flex shrink-0 items-center justify-center ${toneClassName[status]}`;

  if (status === "success") {
    return (
      <span className={box} aria-hidden>
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5">
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 0 1 .006 1.412l-7.25 7.333a1 1 0 0 1-1.435-.016l-3.5-3.75a1 1 0 1 1 1.462-1.362l2.79 2.993 6.548-6.61a1 1 0 0 1 1.414-.001Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  if (status === "warning") {
    return (
      <span className={box} aria-hidden>
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5">
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 6a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 10 6Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className={box} aria-hidden>
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5">
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
      </svg>
    </span>
  );
}

export type AddressStatusCountKey = AddressStatusDisplayKey;

const COUNT_META: Record<AddressStatusCountKey, { title: string; label: string }> =
  {
    warning: {
      title: ADDRESS_STATUS_SECTION_LABELS.warning,
      label: "need selection",
    },
    error: {
      title: ADDRESS_STATUS_SECTION_LABELS.error,
      label: "not found",
    },
    success: {
      title: ADDRESS_STATUS_SECTION_LABELS.success,
      label: "confirmed",
    },
  };

type SecondaryLocationStatusCountsProps = {
  counts: { success: number; warning: number; error: number };
};

export function SecondaryLocationStatusCounts({
  counts,
}: SecondaryLocationStatusCountsProps) {
  const items = ADDRESS_STATUS_DISPLAY_ORDER.filter((key) => counts[key] > 0);

  if (items.length === 0) {
    return null;
  }

  const ariaLabel = items
    .map((key) => `${counts[key]} ${COUNT_META[key].label}`)
    .join(", ");

  return (
    <span
      className="flex items-center gap-2 tabular-nums text-xs font-normal"
      aria-label={ariaLabel}
    >
      {items.map((key) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 text-black/80"
          title={COUNT_META[key].title}
        >
          <AddressStatusGlyph status={key} size="inline" />
          {counts[key]}
        </span>
      ))}
    </span>
  );
}
