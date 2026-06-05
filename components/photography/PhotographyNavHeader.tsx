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
      <div className="header-title">
        <Link href={PORTAL_HOME_PATH} className="header-title__parent-link">
          {PORTAL_NAME}
        </Link>
        <span className="header-title__separator" aria-hidden>
          /
        </span>
        {isPhotographyHome ? (
          <span className="header-title__current">{title}</span>
        ) : (
          <Link
            href={PHOTOGRAPHY_HOME_PATH}
            className="header-title__link"
            aria-label={`${title} (home)`}
          >
            {title}
          </Link>
        )}
      </div>

      <nav
        aria-label="Photography primary navigation"
        className="header-navigation"
      >
        <Link
          href={PHOTOGRAPHY_HOME_PATH}
          className={[
            "header-navigation__link",
            isPhotographyHome
              ? "header-navigation__link--current"
              : "header-navigation__link--inactive",
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
