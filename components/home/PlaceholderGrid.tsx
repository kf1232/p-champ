import Link from "next/link";

import {
  P_CHAMP_DEX_PATH,
  P_CHAMP_TEAM_BUILDER_PATH,
  PHOTOGRAPHY_HOME_PATH,
} from "@/lib/site";

type PlaceholderGridProps = {
  count?: number;
};

type GridLink = { href: string; label: string; ariaLabel: string };

/** First cells map to feature apps; remaining slots are inactive placeholders. */
const GRID_LINKS: (GridLink | null)[] = [
  { href: P_CHAMP_DEX_PATH, label: "Dex", ariaLabel: "Go to Dex" },
  {
    href: P_CHAMP_TEAM_BUILDER_PATH,
    label: "Team Builder",
    ariaLabel: "Go to Team Builder",
  },
  {
    href: PHOTOGRAPHY_HOME_PATH,
    label: "Photography",
    ariaLabel: "Go to Photography",
  },
];

export function PlaceholderGrid({ count = 9 }: PlaceholderGridProps) {
  return (
    <section aria-label="Feature grid" className="mt-8">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
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
                "flex aspect-square items-center justify-center rounded-lg border border-black/10 bg-white/60 text-sm font-medium",
                isActive
                  ? "text-black hover:bg-white/80 hover:border-black/20"
                  : "pointer-events-none text-black/40",
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
