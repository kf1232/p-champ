"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useGameSelection } from "./GameSelectionProvider";
import { DEX_LIST_VIEW_IDS, DEX_LIST_VIEW_LABELS } from "@/lib/p-champ/dex";

import {
  P_CHAMP_DEX_PATH,
  P_CHAMP_HOME_PATH,
  P_CHAMP_TEAM_BUILDER_PATH,
  PORTAL_HOME_PATH,
  PORTAL_NAME,
  SITE_NAME,
} from "@/lib/site";

/** P-Champ nav — inner content only (`AppViewportHeader` supplies the shell). */
export default function Navigation({ title = SITE_NAME, wide: _wide = false }) {
  const pathname = usePathname();
  const isHome = pathname === P_CHAMP_HOME_PATH;
  const isDex = pathname === P_CHAMP_DEX_PATH;
  const isTeamBuilder = pathname === P_CHAMP_TEAM_BUILDER_PATH;
  const { selectedGameId, setSelectedGameId } = useGameSelection();

  return (
    <>
      <div className="header-title">
        <Link href={PORTAL_HOME_PATH} className="header-title__parent-link">
          {PORTAL_NAME}
        </Link>
        <span className="header-title__separator" aria-hidden>
          /
        </span>
        {isHome ? (
          <span className="header-title__current">{title}</span>
        ) : (
          <Link
            href={P_CHAMP_HOME_PATH}
            className="header-title__link"
            aria-label={`${title} (home)`}
          >
            {title}
          </Link>
        )}
      </div>

      <div className="header-navigation-toolbar">
        <nav aria-label="Primary navigation" className="header-navigation">
          <Link
            href={P_CHAMP_HOME_PATH}
            className={[
              "header-navigation__link",
              isHome
                ? "header-navigation__link--current"
                : "header-navigation__link--inactive",
            ].join(" ")}
            aria-current={isHome ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href={P_CHAMP_DEX_PATH}
            className={[
              "header-navigation__link",
              isDex
                ? "header-navigation__link--current"
                : "header-navigation__link--inactive",
            ].join(" ")}
            aria-current={isDex ? "page" : undefined}
          >
            Dex
          </Link>
          <Link
            href={P_CHAMP_TEAM_BUILDER_PATH}
            className={[
              "header-navigation__link",
              isTeamBuilder
                ? "header-navigation__link--current"
                : "header-navigation__link--inactive",
            ].join(" ")}
            aria-current={isTeamBuilder ? "page" : undefined}
          >
            Team Builder
          </Link>
        </nav>

        <label className="header-dropdown-selector">
          <span className="header-dropdown-selector__label">Game</span>
          <select
            className="header-dropdown-selector__control"
            value={selectedGameId}
            onChange={(e) => {
              const v = e.target.value;
              if (DEX_LIST_VIEW_IDS.includes(v)) setSelectedGameId(v);
            }}
            aria-label="Active game filter"
          >
            {DEX_LIST_VIEW_IDS.map((id) => (
              <option key={id} value={id}>
                {DEX_LIST_VIEW_LABELS[id]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
}
