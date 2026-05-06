/**
 * Shared layout for viewport-locked footers (WoW stats bar, blank bars elsewhere).
 * Keep footer height and main bottom padding in sync wherever used.
 */
export const VIEWPORT_LOCKED_FOOTER_H_PX = 64;

/** Extra scroll padding above the footer band (matches typical `py-10` lower half). */
export const MAIN_SPACER_ABOVE_VIEWPORT_FOOTER_PX = 40;

/** Bottom padding for `<main>` so scrollable content clears the locked footer + breathing room. */
export const VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX =
  VIEWPORT_LOCKED_FOOTER_H_PX + MAIN_SPACER_ABOVE_VIEWPORT_FOOTER_PX;

/** `aria-label` for blank footers — portal, P-Champ, photography. */
export const VIEWPORT_BLANK_FOOTER_ARIA = {
  portal: "Fink Social portal",
  pChamp: "P-Champ",
  photography: "Photography",
} as const;

export type ViewportBlankFooterKey = keyof typeof VIEWPORT_BLANK_FOOTER_ARIA;

/** Populated WoW stats strip (not a blank footer). */
export const VIEWPORT_WOW_STATS_FOOTER_ARIA = "WoW local cache" as const;
