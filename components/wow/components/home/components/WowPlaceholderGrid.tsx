import Link from "next/link";

import { WOW_HOME_GRID_LINKS } from "../configs/wowHomeGridLinks";

type WowPlaceholderGridProps = {
  count?: number;
};

export function WowPlaceholderGrid({ count = 6 }: WowPlaceholderGridProps) {
  return (
    <section aria-label="WoW feature grid" className="wow-grid-section">
      <div className="wow-grid">
        {Array.from({ length: count }).map((_, i) => {
          const link = WOW_HOME_GRID_LINKS[i] ?? null;
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
