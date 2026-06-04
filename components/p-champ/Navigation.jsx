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
        {isHome ? (
          <span className="text-sm font-semibold text-primary">{title}</span>
        ) : (
          <Link
            href={P_CHAMP_HOME_PATH}
            className="text-sm font-semibold text-primary hover:opacity-80"
            aria-label={`${title} (home)`}
          >
            {title}
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <nav aria-label="Primary navigation" className="flex items-center gap-4">
          <Link
            href={P_CHAMP_HOME_PATH}
            className={[
              "text-sm font-medium",
              isHome ? "text-primary" : "text-secondary hover:text-primary",
            ].join(" ")}
            aria-current={isHome ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href={P_CHAMP_DEX_PATH}
            className={[
              "text-sm font-medium",
              isDex ? "text-primary" : "text-secondary hover:text-primary",
            ].join(" ")}
            aria-current={isDex ? "page" : undefined}
          >
            Dex
          </Link>
          <Link
            href={P_CHAMP_TEAM_BUILDER_PATH}
            className={[
              "text-sm font-medium",
              isTeamBuilder ? "text-primary" : "text-secondary hover:text-primary",
            ].join(" ")}
            aria-current={isTeamBuilder ? "page" : undefined}
          >
            Team Builder
          </Link>
        </nav>

        <label className="flex items-center gap-2 text-sm text-secondary">
          <span className="font-medium text-primary">Game</span>
          <select
            className="rounded-md border border-border-default bg-surface px-2 py-1.5 text-sm font-medium text-primary shadow-sm focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-[var(--app-focus-ring)]"
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
