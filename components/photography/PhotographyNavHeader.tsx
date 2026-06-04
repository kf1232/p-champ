"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  PHOTOGRAPHY_HOME_PATH,
  PORTAL_HOME_PATH,
  PORTAL_NAME,
} from "@/lib/site";

type PhotographyNavProps = {
  title?: string;
};

/** Photography nav — inner content only (`AppViewportHeader` supplies the shell). */
export function PhotographyNav({ title = "Photography" }: PhotographyNavProps) {
  const pathname = usePathname() ?? "";
  const isPhotographyHome = pathname === PHOTOGRAPHY_HOME_PATH;

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
        {isPhotographyHome ? (
          <span className="text-sm font-semibold text-primary">{title}</span>
        ) : (
          <Link
            href={PHOTOGRAPHY_HOME_PATH}
            className="text-sm font-semibold text-primary hover:opacity-80"
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
              ? "text-primary"
              : "text-secondary hover:text-primary",
          ].join(" ")}
          aria-current={isPhotographyHome ? "page" : undefined}
        >
          Home
        </Link>
      </nav>
    </>
  );
}

/** @deprecated Use `PhotographyNav` — kept for existing imports. */
export const PhotographyNavHeader = PhotographyNav;
