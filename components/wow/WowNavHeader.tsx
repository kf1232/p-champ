"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  PORTAL_HOME_PATH,
  PORTAL_NAME,
  WOW_CHARACTER_PATH,
  WOW_GUILD_PATH,
  WOW_HOME_PATH,
} from "@/lib/site";

import { useWowDebugRawPanels } from "./WowDebugRawPanelsContext";

type WowNavHeaderProps = {
  title?: string;
};

export function WowNavHeader({ title = "WoW" }: WowNavHeaderProps) {
  const pathname = usePathname() ?? "";
  const isWowHome = pathname === WOW_HOME_PATH;
  const isCharacter = pathname === WOW_CHARACTER_PATH;
  const isGuild = pathname === WOW_GUILD_PATH;
  const { enabled: rawDebugEnabled, setEnabled: setRawDebugEnabled } =
    useWowDebugRawPanels();

  return (
    <header className="wow-nav-header">
      <div className="wow-nav-inner">
        <div className="wow-nav-breadcrumb">
          <Link href={PORTAL_HOME_PATH} className="wow-nav-link-muted">
            {PORTAL_NAME}
          </Link>
          <span className="wow-nav-sep" aria-hidden>
            /
          </span>
          {isWowHome ? (
            <span className="wow-nav-title-current">{title}</span>
          ) : (
            <Link
              href={WOW_HOME_PATH}
              className="wow-nav-title-link"
              aria-label={`${title} (home)`}
            >
              {title}
            </Link>
          )}
        </div>

        <div className="wow-nav-actions">
          <nav aria-label="WoW primary navigation" className="wow-nav-links">
            <Link
              href={WOW_HOME_PATH}
              className={[
                "wow-nav-page-link",
                isWowHome
                  ? "wow-nav-page-link--current"
                  : "wow-nav-page-link--inactive",
              ].join(" ")}
              aria-current={isWowHome ? "page" : undefined}
            >
              Home
            </Link>
            <Link
              href={WOW_CHARACTER_PATH}
              className={[
                "wow-nav-page-link",
                isCharacter
                  ? "wow-nav-page-link--current"
                  : "wow-nav-page-link--inactive",
              ].join(" ")}
              aria-current={isCharacter ? "page" : undefined}
            >
              Character
            </Link>
            <Link
              href={WOW_GUILD_PATH}
              className={[
                "wow-nav-page-link",
                isGuild
                  ? "wow-nav-page-link--current"
                  : "wow-nav-page-link--inactive",
              ].join(" ")}
              aria-current={isGuild ? "page" : undefined}
            >
              Guild
            </Link>
          </nav>

          <label className="wow-nav-debug-toggle">
            <input
              type="checkbox"
              className="wow-nav-debug-toggle__input"
              checked={rawDebugEnabled}
              onChange={(e) => setRawDebugEnabled(e.target.checked)}
              aria-label="Show raw Battle.net API response panels for troubleshooting"
            />
            <span className="wow-nav-debug-toggle__label">Raw API</span>
          </label>
        </div>
      </div>
    </header>
  );
}
