import Link from "next/link";

import { BURKE_HOME_GRID_LINKS } from "./configs/burkeHomeGridLinks";

type BurkePlaceholderGridProps = {
  count?: number;
};

export function BurkePlaceholderGrid({ count = 6 }: BurkePlaceholderGridProps) {
  return (
    <section aria-label="Burke feature grid" className="mt-8">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: count }).map((_, i) => {
          const link = BURKE_HOME_GRID_LINKS[i] ?? null;
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
                "flex aspect-square items-center justify-center rounded-lg border border-border-subtle bg-surface-overlay text-sm font-medium",
                isActive
                  ? "text-primary hover:bg-surface-elevated hover:border-border-default"
                  : "pointer-events-none text-tertiary",
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
