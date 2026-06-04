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
      <div className="flex min-w-0 flex-wrap items-center gap-x-2">
        {isPortalHome ? (
          <span className="text-sm font-semibold text-primary">{PORTAL_TITLE}</span>
        ) : (
          <Link
            href={PORTAL_HOME_PATH}
            className="text-sm font-semibold text-primary hover:opacity-80"
            aria-label={`${PORTAL_TITLE} (home)`}
          >
            {PORTAL_TITLE}
          </Link>
        )}
      </div>

      <nav
        aria-label="Portal feature navigation"
        className="flex flex-wrap items-center gap-4"
      >
        <Link
          href={P_CHAMP_HOME_PATH}
          className="text-sm font-medium text-secondary hover:text-primary"
        >
          P-Champ
        </Link>
        <Link
          href={PHOTOGRAPHY_HOME_PATH}
          className="text-sm font-medium text-secondary hover:text-primary"
        >
          Photography
        </Link>
        <Link
          href={WOW_HOME_PATH}
          className="text-sm font-medium text-secondary hover:text-primary"
        >
          WoW
        </Link>
        <Link
          href={BURKE_HOME_PATH}
          className="text-sm font-medium text-secondary hover:text-primary"
        >
          Burke
        </Link>
      </nav>
    </>
  );
}
