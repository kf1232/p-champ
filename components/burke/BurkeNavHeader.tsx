"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BURKE_HOME_PATH,
  BURKE_LOCATION_FINDER_PATH,
  PORTAL_HOME_PATH,
  PORTAL_NAME,
} from "@/lib/site";

import { BURKE_TITLE } from "./configs/burkeHomeCopy";

type BurkeNavProps = {
  title?: string;
};

/** Burke nav — inner content only (`AppViewportHeader` supplies the shell). */
export function BurkeNav({ title = BURKE_TITLE }: BurkeNavProps) {
  const pathname = usePathname() ?? "";
  const isBurkeHome = pathname === BURKE_HOME_PATH;
  const isLocationFinder = pathname === BURKE_LOCATION_FINDER_PATH;

  return (
    <>
      <div className="header-title">
        <Link href={PORTAL_HOME_PATH} className="header-title__parent-link">
          {PORTAL_NAME}
        </Link>
        <span className="header-title__separator" aria-hidden>
          /
        </span>
        {isBurkeHome ? (
          <span className="header-title__current">{title}</span>
        ) : (
          <Link
            href={BURKE_HOME_PATH}
            className="header-title__link"
            aria-label={`${title} (home)`}
          >
            {title}
          </Link>
        )}
      </div>

      <nav
        aria-label="Burke primary navigation"
        className="header-navigation"
      >
        <Link
          href={BURKE_HOME_PATH}
          className={[
            "header-navigation__link",
            isBurkeHome
              ? "header-navigation__link--current"
              : "header-navigation__link--inactive",
          ].join(" ")}
          aria-current={isBurkeHome ? "page" : undefined}
        >
          Home
        </Link>
        <Link
          href={BURKE_LOCATION_FINDER_PATH}
          className={[
            "header-navigation__link",
            isLocationFinder
              ? "header-navigation__link--current"
              : "header-navigation__link--inactive",
          ].join(" ")}
          aria-current={isLocationFinder ? "page" : undefined}
        >
          Location Finder
        </Link>
      </nav>
    </>
  );
}

/** @deprecated Use `BurkeNav` — kept for existing imports. */
export const BurkeNavHeader = BurkeNav;
