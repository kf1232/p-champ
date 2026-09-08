/**
 * APizza Austin visual language.
 * Measured from computed styles on https://www.apizzaforeveryone.com/
 * (home, about-us, ingredients), 8 Sep 2026.
 *
 * Parent is one geometric sans. Do not mix a serif display face with a
 * geometric nav. Freight Big / Freight Sans load on the parent template and
 * are unused on sampled UI. The wordmark is the logo PNG, not a web font.
 */

export const APIZZA_TYPE_LICENSED = {
  ui: "futura-pt",
  display: "futura-pt-bold",
} as const;

/** Open stand-in when Futura PT is not licensed. Use for every type role. */
export const APIZZA_TYPE_STANDIN = "Jost";

export const APIZZA_TYPE_DO_NOT_USE = ["Anton", "Forum", "Freight Big", "Freight Sans"] as const;

export const APIZZA_COLOR = {
  red: "#f03841",
  ink: "rgb(46, 46, 46)",
  headingAlt: "rgb(125, 38, 40)",
  black: "rgb(0, 0, 0)",
  white: "rgb(255, 255, 255)",
} as const;

export const APIZZA_TYPE_ROLES = {
  h1: {
    family: "display",
    weight: 700,
    sizePx: 43,
    letterSpacingPx: 0.43,
    lineHeightPx: 55.9,
    transform: "none",
    color: "red",
  },
  h2: {
    family: "ui",
    weight: 600,
    sizePx: 34,
    letterSpacingPx: 0.68,
    lineHeightPx: 44.2,
    transform: "none",
    color: "red or headingAlt",
  },
  h3: {
    family: "ui",
    weight: 700,
    sizePx: 18,
    letterSpacingPx: 0.72,
    lineHeightPx: 19.8,
    transform: "lowercase",
    color: "red",
  },
  body: {
    family: "ui",
    weight: 400,
    sizePx: 16,
    letterSpacingPx: 0.16,
    lineHeightPx: 19.2,
    transform: "none",
    color: "ink",
  },
  nav: {
    family: "ui",
    weight: 700,
    sizePx: 16,
    letterSpacingPx: 0.32,
    lineHeightPx: 16,
    transform: "none",
    color: "black",
  },
  order: {
    family: "ui",
    weight: 700,
    sizePx: 16,
    letterSpacingPx: 0.32,
    lineHeightPx: 16,
    transform: "lowercase",
    color: "white",
  },
  button: {
    family: "ui",
    weight: 700,
    sizePx: 13,
    letterSpacingPx: 2.6,
    lineHeightPx: "normal",
    transform: "lowercase",
    color: "headingAlt",
  },
  footer: {
    family: "ui",
    weight: 600,
    sizePx: 16,
    letterSpacingPx: 0.32,
    transform: "lowercase",
    color: "black",
  },
} as const;

export const APIZZA_BREAKPOINTS = {
  /** Material 3 compact — single column, horizontal nav scroll */
  compactMaxPx: 599,
  /** Material 3 medium — two-column panes, full header row */
  mediumMinPx: 600,
  /** Material 3 expanded — same layout; wider gutters only */
  expandedMinPx: 840,
} as const;

export const APIZZA_LAYOUT = {
  /** One geometric sans on `.apizza-site`; fixed px type roles — no fluid clamp. */
  typeScale: "fixed",
  /** M3 compact / medium / expanded only. No extra breakpoints (e.g. 799px). */
  breakpoints: APIZZA_BREAKPOINTS,
  /** Header bar height never changes at breakpoints. */
  headerHeightRem: 5.25,
  /** 4/3 frame on compact stack only; split panes share one grid row height. */
  mediaAspectRatio: "4 / 3 compact stack",
  /** Side-by-side panes use equal columns, not ratio columns that drift. */
  paneColumns: "1fr 1fr",
  /** Prefer horizontal nav scroll over wrapping (avoids header height jump). */
  compactNav: "scroll",
} as const;

export const APIZZA_COPY_CASING = {
  /** Default voice on the customer site — lowercase, like apizzaforeveryone.com body copy. */
  default: "lowercase",
  /** Keep title case only for other brands and named partners (not apizza). */
  preserveTitleCase: [
    "Loving Cup",
    "Central Milling",
    "Yolo-o Tomato Sauce",
    "Creminelli Fine Meats",
    "La Tourangelle Organic Olive Oil",
    "Instagram",
    "Facebook",
  ],
  /** Fink portal / breadcrumb product label — not customer-site voice. */
  portalTitle: "APizza Austin",
} as const;

export const APIZZA_CHROME = {
  header: "logo | nav | spacer | order",
  orderInteractive: false,
  heroText: "opaque panel, never over the photo",
  heroImage:
    "first image is this slot only; extra images in APIZZA_HERO_ROTATING_IMAGES auto-rotate; no pager",
  pageFrame:
    "centered app column; split panes share row height; object-fit cover on media",
  layoutStability:
    "discrete M3 breakpoints; fixed header height; no flex-wrap reflow; equal pane columns",
} as const;
