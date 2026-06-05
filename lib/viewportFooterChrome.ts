/**
 * Viewport footer aria labels and route keys (`AppViewportFooter`).
 * Layout dimensions: `styles/global/shell.css`.
 */

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
