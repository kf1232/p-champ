import type { Metadata } from "next";

import Link from "next/link";

import { P_CHAMP_HOME_PATH } from "@/lib/site";

const PORTAL_TITLE = "Fink Social";
const PORTAL_DESCRIPTION = "Entry Service Point";

export const metadata: Metadata = {
  title: PORTAL_TITLE,
  description: PORTAL_DESCRIPTION,
};

type FeatureLink = {
  href: string;
  label: string;
  /** false = reserved / coming soon (non-interactive cell) */
  active?: boolean;
};

/** Add entries to grow the grid; layout stays 3 columns with automatic rows. */
const FEATURE_LINKS: FeatureLink[] = [
  { href: P_CHAMP_HOME_PATH, label: "P-Champ", active: true },
];

const GRID_COLS = 3; // must match `grid-cols-*` on the feature grid

/** Pad the partial last row to 3 columns, then add one full row of placeholders. */
function portalGridPlaceholderCount(featureCount: number): number {
  const rem = featureCount % GRID_COLS;
  const padCurrentRow =
    featureCount === 0 ? GRID_COLS : rem === 0 ? 0 : GRID_COLS - rem;
  return padCurrentRow + GRID_COLS;
}

const placeholderCellClassName =
  "flex aspect-square items-center justify-center rounded-lg border border-dashed border-black/15 bg-black/[0.02] text-sm font-medium text-black/35";

export default function PortalHomePage() {
  const placeholderCount = portalGridPlaceholderCount(FEATURE_LINKS.length);

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-zinc-50 to-white">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-black">
            {PORTAL_TITLE}
          </h1>
          <p className="mt-3 text-lg text-black/65">{PORTAL_DESCRIPTION}</p>
        </header>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {FEATURE_LINKS.map((item) =>
              item.active ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex aspect-square items-center justify-center rounded-lg border border-black/10 bg-white/60 text-sm font-medium text-black shadow-sm hover:border-black/20 hover:bg-white/80"
                >
                  {item.label}
                </Link>
              ) : (
                <div
                  key={item.label}
                  className={placeholderCellClassName}
                >
                  {item.label}
                </div>
              ),
            )}
            {Array.from({ length: placeholderCount }, (_, i) => (
              <div
                key={`portal-grid-placeholder-${i}`}
                className={placeholderCellClassName}
                aria-hidden
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
