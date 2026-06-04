/**
 * Shared layout for viewport-locked footers (`AppViewportFooter`).
 * Keep footer height and main bottom padding in sync wherever used.
 */
export const VIEWPORT_LOCKED_FOOTER_H_PX = 64;

/** Extra scroll padding above the footer band (matches typical `py-10` lower half). */
export const MAIN_SPACER_ABOVE_VIEWPORT_FOOTER_PX = 40;

/** Bottom padding for `<main>` so scrollable content clears the locked footer + breathing room. */
export const VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX =
  VIEWPORT_LOCKED_FOOTER_H_PX + MAIN_SPACER_ABOVE_VIEWPORT_FOOTER_PX;

/**
 * Gap between the viewport-locked footer and in-page sticky controls (rem).
 * Used in CSS `calc()` so spacing scales with user font size.
 */
export const VIEWPORT_STICKY_ABOVE_FOOTER_GAP_REM = 1;

/**
 * Minimum scroll budget for a sticky action band (submit row + padding), in rem.
 */
export const VIEWPORT_STICKY_ACTION_BAND_MIN_REM = 4.5;

/** `aria-label` for blank footers — portal, P-Champ, photography, Burke. */
export const VIEWPORT_BLANK_FOOTER_ARIA = {
  portal: "Fink Social portal",
  pChamp: "P-Champ",
  photography: "Photography",
  burke: "Burke",
} as const;

export type ViewportBlankFooterKey = keyof typeof VIEWPORT_BLANK_FOOTER_ARIA;

/** `aria-label` when WoW registers a local-storage footer. */
export const VIEWPORT_WOW_STATS_FOOTER_ARIA = "WoW local cache" as const;

/** `aria-label` when Burke Location Finder registers a local-storage footer. */
export const VIEWPORT_BURKE_LOCATION_FINDER_FOOTER_ARIA =
  "Burke Location Finder local cache" as const;
