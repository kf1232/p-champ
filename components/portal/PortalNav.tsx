"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BURKE_HOME_PATH,
  P_CHAMP_HOME_PATH,
  PHOTOGRAPHY_HOME_PATH,
  PORTAL_HOME_PATH,
  WOW_HOME_PATH,
} from "@/lib/site";

import { PORTAL_TITLE } from "./portalHomeCopy";

/** Portal hub nav — inner content only (`AppViewportHeader` supplies the shell). */
export function PortalNav() {
  const pathname = usePathname() ?? "";
  const isPortalHome = pathname === PORTAL_HOME_PATH;

  return (
    <>
      <div className="header-title">
        {isPortalHome ? (
          <span className="header-title__current">{PORTAL_TITLE}</span>
        ) : (
          <Link
            href={PORTAL_HOME_PATH}
            className="header-title__link"
            aria-label={`${PORTAL_TITLE} (home)`}
          >
            {PORTAL_TITLE}
          </Link>
        )}
      </div>

      <nav
        aria-label="Portal feature navigation"
        className="header-navigation"
      >
        <Link
          href={P_CHAMP_HOME_PATH}
          className="header-navigation__link header-navigation__link--inactive"
        >
          P-Champ
        </Link>
        <Link
          href={PHOTOGRAPHY_HOME_PATH}
          className="header-navigation__link header-navigation__link--inactive"
        >
          Photography
        </Link>
        <Link
          href={WOW_HOME_PATH}
          className="header-navigation__link header-navigation__link--inactive"
        >
          WoW
        </Link>
        <Link
          href={BURKE_HOME_PATH}
          className="header-navigation__link header-navigation__link--inactive"
        >
          Burke
        </Link>
      </nav>
    </>
  );
}
