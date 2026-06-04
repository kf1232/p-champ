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

type BurkeNavHeaderProps = {
  title?: string;
};

export function BurkeNavHeader({ title = BURKE_TITLE }: BurkeNavHeaderProps) {
  const pathname = usePathname() ?? "";
  const isBurkeHome = pathname === BURKE_HOME_PATH;
  const isLocationFinder = pathname === BURKE_LOCATION_FINDER_PATH;

  return (
    <header className="w-full border-b border-black/10 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2">
          <Link
            href={PORTAL_HOME_PATH}
            className="text-sm font-medium text-black/70 hover:text-black"
          >
            {PORTAL_NAME}
          </Link>
          <span className="text-sm text-black/30" aria-hidden>
            /
          </span>
          {isBurkeHome ? (
            <span className="text-sm font-semibold text-black">{title}</span>
          ) : (
            <Link
              href={BURKE_HOME_PATH}
              className="text-sm font-semibold text-black hover:opacity-80"
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
              isBurkeHome ? "text-black" : "text-black/70 hover:text-black",
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
                ? "text-black"
                : "text-black/70 hover:text-black",
            ].join(" ")}
            aria-current={isLocationFinder ? "page" : undefined}
          >
            Location Finder
          </Link>
        </nav>
      </div>
    </header>
  );
}
