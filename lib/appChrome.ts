import {
  BURKE_LOCATION_FINDER_PATH,
  P_CHAMP_TEAM_BUILDER_PATH,
  PORTAL_HOME_PATH,
} from "@/lib/site";
import type { ViewportBlankFooterKey } from "@/lib/viewportFooterChrome";

export type AppHeaderVariant =
  | "portal"
  | "pChamp"
  | "burke"
  | "photography"
  | "scheduler"
  | "wow";

/** CSS class list for the page slot wrapped around route children (see `styles/global/shell.css`). */
export type AppPageSlotClass =
  | "app-page app-page--max-5xl app-page--portal"
  | "app-page app-page--max-5xl app-page--scroll"
  | "app-page app-page--max-7xl app-page--scroll"
  | "app-page app-page--max-7xl app-page--viewport"
  | "app-page app-page--max-5xl app-page--location-finder";

export type AppChromeConfig = {
  /** Route-default header inner content (`AppViewportHeader`). */
  header: AppHeaderVariant;
  /** Wide nav inner (Team Builder, Dex). */
  headerWide: boolean;
  blankFooter: ViewportBlankFooterKey | undefined;
  contentClass: string;
  pageClass: AppPageSlotClass;
};

/** Route → app chrome (header, footer key, content region, page slot). */
export function resolveAppChrome(pathname: string): AppChromeConfig {
  if (pathname === PORTAL_HOME_PATH) {
    return {
      header: "portal",
      headerWide: false,
      blankFooter: "portal",
      contentClass: "",
      pageClass: "app-page app-page--max-5xl app-page--portal",
    };
  }

  if (pathname.startsWith("/p-champ/team-builder")) {
    return {
      header: "pChamp",
      headerWide: true,
      blankFooter: "pChamp",
      contentClass: "app-chrome__content--clip",
      pageClass: "app-page app-page--max-7xl app-page--viewport",
    };
  }

  if (pathname.startsWith("/p-champ")) {
    const wide = pathname.startsWith("/p-champ/dex");
    return {
      header: "pChamp",
      headerWide: wide,
      blankFooter: "pChamp",
      contentClass: "",
      pageClass: wide
        ? "app-page app-page--max-7xl app-page--scroll"
        : "app-page app-page--max-5xl app-page--scroll",
    };
  }

  if (pathname.startsWith("/photography")) {
    return {
      header: "photography",
      headerWide: false,
      blankFooter: "photography",
      contentClass: "",
      pageClass: "app-page app-page--max-5xl app-page--scroll",
    };
  }

  if (pathname.startsWith("/scheduler")) {
    return {
      header: "scheduler",
      headerWide: false,
      blankFooter: "scheduler",
      contentClass: "",
      pageClass: "app-page app-page--max-5xl app-page--scroll",
    };
  }

  if (pathname === BURKE_LOCATION_FINDER_PATH) {
    return {
      header: "burke",
      headerWide: false,
      blankFooter: "burke",
      contentClass: "",
      pageClass: "app-page app-page--max-5xl app-page--location-finder",
    };
  }

  if (pathname.startsWith("/burke")) {
    return {
      header: "burke",
      headerWide: false,
      blankFooter: "burke",
      contentClass: "",
      pageClass: "app-page app-page--max-5xl app-page--scroll",
    };
  }

  if (pathname.startsWith("/wow")) {
    return {
      header: "wow",
      headerWide: false,
      blankFooter: undefined,
      contentClass: "",
      pageClass: "app-page app-page--max-5xl app-page--scroll",
    };
  }

  return {
    header: "portal",
    headerWide: false,
    blankFooter: undefined,
    contentClass: "",
    pageClass: "app-page app-page--max-5xl app-page--scroll",
  };
}
