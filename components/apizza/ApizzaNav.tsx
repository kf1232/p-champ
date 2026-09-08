"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { APIZZA_HOME_PATH, PORTAL_HOME_PATH, PORTAL_NAME } from "@/lib/site";

import { APIZZA_TITLE } from "./configs/apizzaHomeCopy";

type ApizzaNavProps = {
  title?: string;
};

/** Fink Social chrome — inner content only (`AppViewportHeader` supplies the shell). */
export function ApizzaNav({ title = APIZZA_TITLE }: ApizzaNavProps) {
  const pathname = usePathname() ?? "";
  const isApizzaHome = pathname === APIZZA_HOME_PATH;

  return (
    <div className="header-title">
      <Link href={PORTAL_HOME_PATH} className="header-title__parent-link">
        {PORTAL_NAME}
      </Link>
      <span className="header-title__separator" aria-hidden>
        /
      </span>
      {isApizzaHome ? (
        <span className="header-title__current">{title}</span>
      ) : (
        <Link
          href={APIZZA_HOME_PATH}
          className="header-title__link"
          aria-label={`${title} (home)`}
        >
          {title}
        </Link>
      )}
    </div>
  );
}
