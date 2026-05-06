"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  PHOTOGRAPHY_HOME_PATH,
  PORTAL_HOME_PATH,
  PORTAL_NAME,
} from "@/lib/site";

type PhotographyNavHeaderProps = {
  title?: string;
};

export function PhotographyNavHeader({
  title = "Photography",
}: PhotographyNavHeaderProps) {
  const pathname = usePathname() ?? "";
  const isPhotographyHome = pathname === PHOTOGRAPHY_HOME_PATH;

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
          {isPhotographyHome ? (
            <span className="text-sm font-semibold text-black">{title}</span>
          ) : (
            <Link
              href={PHOTOGRAPHY_HOME_PATH}
              className="text-sm font-semibold text-black hover:opacity-80"
              aria-label={`${title} (home)`}
            >
              {title}
            </Link>
          )}
        </div>

        <nav
          aria-label="Photography primary navigation"
          className="flex flex-wrap items-center gap-4"
        >
          <Link
            href={PHOTOGRAPHY_HOME_PATH}
            className={[
              "text-sm font-medium",
              isPhotographyHome
                ? "text-black"
                : "text-black/70 hover:text-black",
            ].join(" ")}
            aria-current={isPhotographyHome ? "page" : undefined}
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
