import Link from "next/link";

import { trailingPlaceholderCellCount } from "@/lib/gridPlaceholders";
import {
  P_CHAMP_HOME_PATH,
  PHOTOGRAPHY_HOME_PATH,
  WOW_HOME_PATH,
} from "@/lib/site";
import {
  VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
} from "@/lib/viewportFooterChrome";

import { ViewportLockedPageShell } from "@/components/commons";

import {
  PORTAL_DESCRIPTION,
  PORTAL_TITLE,
} from "./portalHomeCopy";

type FeatureLink = {
  href: string;
  label: string;
  active?: boolean;
};

const FEATURE_LINKS: FeatureLink[] = [
  { href: P_CHAMP_HOME_PATH, label: "P-Champ", active: true },
  { href: PHOTOGRAPHY_HOME_PATH, label: "Photography", active: true },
  { href: WOW_HOME_PATH, label: "WoW", active: true },
];

const PORTAL_GRID_COLS = 3;

const activeTileClass =
  "flex aspect-square items-center justify-center rounded-lg border border-black/10 bg-white/60 text-sm font-medium text-black shadow-sm hover:border-black/20 hover:bg-white/80";

const placeholderCellClassName =
  "flex aspect-square items-center justify-center rounded-lg border border-dashed border-black/15 bg-black/[0.02] text-sm font-medium text-black/35";

export function PortalHomeScreen() {
  const placeholderCount = trailingPlaceholderCellCount(
    FEATURE_LINKS.length,
    PORTAL_GRID_COLS,
  );

  return (
    <ViewportLockedPageShell footer="portal">
      <main
        className="mx-auto w-full max-w-5xl flex-1 px-6 pt-10"
        style={{
          paddingBottom: VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
        }}
      >
        <header className="mb-10 text-center sm:mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            {PORTAL_TITLE}
          </h1>
          <p className="mx-auto mt-3 max-w-prose text-black/70">
            {PORTAL_DESCRIPTION}
          </p>
        </header>

        <section aria-label="Features" className="mx-auto w-full max-w-3xl">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {FEATURE_LINKS.map((item) =>
              item.active ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={activeTileClass}
                >
                  {item.label}
                </Link>
              ) : (
                <div key={item.label} className={placeholderCellClassName}>
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
    </ViewportLockedPageShell>
  );
}
