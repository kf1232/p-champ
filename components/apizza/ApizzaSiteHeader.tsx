"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  APIZZA_ABOUT_PATH,
  APIZZA_APIZZZA_PATH,
  APIZZA_HOME_PATH,
  APIZZA_INGREDIENTS_PATH,
  APIZZA_LOCATIONS_PATH,
  APIZZA_LOVING_CUP_PATH,
} from "@/lib/site";

import {
  APIZZA_LOGO_ALT,
  APIZZA_LOGO_SRC,
  APIZZA_NAV_ABOUT,
  APIZZA_NAV_INGREDIENTS,
  APIZZA_NAV_LOCATIONS,
  APIZZA_NAV_LOVING_CUP,
  APIZZA_NAV_ORDER,
} from "./configs/apizzaBrandCopy";
import { APIZZA_NAV_LABEL, APIZZA_NAV_APIZZZA } from "./configs/apizzaHomeCopy";

const PRIMARY_NAV = [
  { href: APIZZA_LOCATIONS_PATH, label: APIZZA_NAV_LOCATIONS },
  { href: APIZZA_INGREDIENTS_PATH, label: APIZZA_NAV_INGREDIENTS },
  { href: APIZZA_APIZZZA_PATH, label: APIZZA_NAV_APIZZZA },
  { href: APIZZA_LOVING_CUP_PATH, label: APIZZA_NAV_LOVING_CUP },
  { href: APIZZA_ABOUT_PATH, label: APIZZA_NAV_ABOUT },
] as const;

export function ApizzaSiteHeader() {
  const pathname = usePathname() ?? "";

  return (
    <header className="apizza-site-header">
      <Link href={APIZZA_HOME_PATH} className="apizza-site-header__brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={APIZZA_LOGO_SRC}
          alt={APIZZA_LOGO_ALT}
          className="apizza-site-header__logo"
        />
      </Link>
      <nav className="apizza-site-header__nav" aria-label={APIZZA_NAV_LABEL}>
        {PRIMARY_NAV.map((item) => {
          const current = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "apizza-site-header__link",
                current ? "apizza-site-header__link--current" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={current ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <span className="apizza-site-header__spacer" aria-hidden />
      <button type="button" className="apizza-site-header__order" disabled>
        {APIZZA_NAV_ORDER}
      </button>
    </header>
  );
}
