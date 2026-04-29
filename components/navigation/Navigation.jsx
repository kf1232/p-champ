"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useGameSelection } from "@/components/game";
import { DEX_LIST_VIEW_IDS, DEX_LIST_VIEW_LABELS } from "@/lib/dex";

import {
  P_CHAMP_DEX_PATH,
  P_CHAMP_HOME_PATH,
  P_CHAMP_TEAM_BUILDER_PATH,
  SITE_NAME,
} from "@/lib/site";

export default function Navigation({ title = SITE_NAME }) {
  const pathname = usePathname();
  const isHome = pathname === P_CHAMP_HOME_PATH;
  const isDex = pathname === P_CHAMP_DEX_PATH;
  const isTeamBuilder = pathname === P_CHAMP_TEAM_BUILDER_PATH;
  const { selectedGameId, setSelectedGameId } = useGameSelection();

  return (
    <header className="w-full border-b border-black/10 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link
          href={P_CHAMP_HOME_PATH}
          className="font-semibold tracking-tight text-black hover:opacity-80"
          aria-label={`${title} (Home)`}
        >
          {title}
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <nav aria-label="Primary navigation" className="flex items-center gap-4">
            <Link
              href={P_CHAMP_HOME_PATH}
              className={[
                "text-sm font-medium",
                isHome ? "text-black" : "text-black/70 hover:text-black",
              ].join(" ")}
              aria-current={isHome ? "page" : undefined}
            >
              Home
            </Link>
            <Link
              href={P_CHAMP_DEX_PATH}
              className={[
                "text-sm font-medium",
                isDex ? "text-black" : "text-black/70 hover:text-black",
              ].join(" ")}
              aria-current={isDex ? "page" : undefined}
            >
              Dex
            </Link>
            <Link
              href={P_CHAMP_TEAM_BUILDER_PATH}
              className={[
                "text-sm font-medium",
                isTeamBuilder ? "text-black" : "text-black/70 hover:text-black",
              ].join(" ")}
              aria-current={isTeamBuilder ? "page" : undefined}
            >
              Team Builder
            </Link>
          </nav>

          <label className="flex items-center gap-2 text-sm text-black/80">
            <span className="font-medium text-black">Game</span>
            <select
              className="rounded-md border border-black/15 bg-white px-2 py-1.5 text-sm font-medium text-black shadow-sm focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
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
      </div>
    </header>
  );
}
