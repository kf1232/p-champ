import type { AppHeaderVariant } from "@/lib/appChrome";

/** `aria-label` for route-default app headers (portal + each feature hub). */
export const VIEWPORT_DEFAULT_HEADER_ARIA: Record<AppHeaderVariant, string> = {
  portal: "Fink Social portal",
  pChamp: "P-Champ",
  photography: "Photography",
  burke: "Burke",
  wow: "WoW",
} as const;
