import Link from "next/link";

import {
  P_CHAMP_DEX_PATH,
  P_CHAMP_TEAM_BUILDER_PATH,
} from "@/lib/site";

type PChampPlaceholderGridProps = {
  count?: number;
};

type GridLink = { href: string; label: string; ariaLabel: string };

/** Dex + Team Builder tiles; remaining cells are inactive placeholders. */
const GRID_LINKS: (GridLink | null)[] = [
  { href: P_CHAMP_DEX_PATH, label: "Dex", ariaLabel: "Go to Dex" },
  {
    href: P_CHAMP_TEAM_BUILDER_PATH,
    label: "Team Builder",
    ariaLabel: "Go to Team Builder",
  },
];

export function PChampPlaceholderGrid({
  count = 9,
}: PChampPlaceholderGridProps) {
  return (
    <section aria-label="P-Champ feature grid" className="mt-8">
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
