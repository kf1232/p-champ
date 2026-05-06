import Link from "next/link";

import { WOW_CHARACTER_PATH, WOW_GUILD_PATH } from "@/lib/site";

type WowPlaceholderGridProps = {
  count?: number;
};

type GridLink = { href: string; label: string; ariaLabel: string };

/** WoW tool tiles; `null` slots stay inactive placeholders. */
const GRID_LINKS: (GridLink | null)[] = [
  {
    href: WOW_CHARACTER_PATH,
    label: "Character",
    ariaLabel: "Go to Character tools",
  },
  {
    href: WOW_GUILD_PATH,
    label: "Guild",
    ariaLabel: "Go to Guild tools",
  },
];

export function WowPlaceholderGrid({ count = 9 }: WowPlaceholderGridProps) {
  return (
    <section aria-label="WoW feature grid" className="wow-grid-section">
      <div className="wow-grid">
        {Array.from({ length: count }).map((_, i) => {
          const link = GRID_LINKS[i] ?? null;
          const isActive = link !== null;
          const href = link?.href ?? "#";
          const label = link?.label ?? `Placeholder ${i + 1}`;
          const ariaLabel = link?.ariaLabel ?? `Placeholder ${i + 1}`;

          return (
            <Link
              key={i}
              href={href}
              aria-label={ariaLabel}
              className={[
                "wow-grid-cell",
                isActive ? "wow-grid-cell--active" : "wow-grid-cell--inactive",
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
