import Link from "next/link";

import { tileGridTotalCellCount } from "@/lib/gridPlaceholders";

export type AppTileGridLink = {
  href: string;
  label: string;
  ariaLabel?: string;
};

type AppTileGridProps = {
  /** Accessible name for the grid section. */
  ariaLabel: string;
  /** Per-index link config; `null` → inactive placeholder tile. */
  links: (AppTileGridLink | null)[];
  /** Override auto-computed cell count (see `tileGridTotalCellCount`). */
  count?: number;
  /** Optional layout overrides on the section wrapper (e.g. width constraint). */
  sectionClassName?: string;
};

function filledTileCount(links: (AppTileGridLink | null)[]): number {
  return links.filter((link): link is AppTileGridLink => link != null).length;
}

/** 3-column square tile grid for feature home / nav placeholders. */
export function AppTileGrid({
  ariaLabel,
  count,
  links,
  sectionClassName,
}: AppTileGridProps) {
  const cellCount = count ?? tileGridTotalCellCount(filledTileCount(links));

  return (
    <section
      aria-label={ariaLabel}
      className={["app-grid-section", sectionClassName].filter(Boolean).join(" ")}
    >
      <div className="app-grid app-grid--cols-3">
        {Array.from({ length: cellCount }).map((_, i) => {
          const link = links[i] ?? null;
          const isActive = link !== null;
          const href = link?.href ?? "#";
          const label = link?.label ?? `Placeholder ${i + 1}`;
          const ariaLabelCell = link?.ariaLabel ?? `Placeholder ${i + 1}`;

          return (
            <Link
              key={i}
              href={href}
              aria-label={ariaLabelCell}
              className={[
                "app-grid-cell",
                isActive ? "app-grid-cell--active" : "app-grid-cell--inactive",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
