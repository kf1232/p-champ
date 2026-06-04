import { BURKE_LOCATION_FINDER_PATH } from "@/lib/site";

export type BurkeHomeGridLink = {
  href: string;
  label: string;
  ariaLabel: string;
};

/** Burke home grid tiles; `null` slots stay inactive placeholders. */
export const BURKE_HOME_GRID_LINKS: (BurkeHomeGridLink | null)[] = [
  {
    href: BURKE_LOCATION_FINDER_PATH,
    label: "Location Finder",
    ariaLabel: "Go to Location Finder",
  },
];
