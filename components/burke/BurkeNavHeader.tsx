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
      <div className="flex min-w-0 flex-wrap items-center gap-x-2">
        <Link
          href={PORTAL_HOME_PATH}
          className="text-sm font-medium text-secondary hover:text-primary"
        >
          {PORTAL_NAME}
        </Link>
        <span className="text-sm text-tertiary" aria-hidden>
          /
        </span>
        {isBurkeHome ? (
          <span className="text-sm font-semibold text-primary">{title}</span>
        ) : (
          <Link
            href={BURKE_HOME_PATH}
            className="text-sm font-semibold text-primary hover:opacity-80"
            aria-label={`${title} (home)`}
          >
            {title}
          </Link>
        )}
      </div>

      <nav
        aria-label="Burke primary navigation"
        className="flex flex-wrap items-center gap-4"
      >
        <Link
          href={BURKE_HOME_PATH}
          className={[
            "text-sm font-medium",
            isBurkeHome ? "text-primary" : "text-secondary hover:text-primary",
          ].join(" ")}
          aria-current={isBurkeHome ? "page" : undefined}
        >
          Home
        </Link>
        <Link
          href={BURKE_LOCATION_FINDER_PATH}
          className={[
            "text-sm font-medium",
            isLocationFinder
              ? "text-primary"
              : "text-secondary hover:text-primary",
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
