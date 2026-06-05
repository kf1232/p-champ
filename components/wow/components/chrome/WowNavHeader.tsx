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

import { useWowDebugRawPanels } from "../providers/WowDebugRawPanelsContext";

type WowNavProps = {
  title?: string;
};

/** WoW nav — inner content only (`AppViewportHeader` supplies the shell). */
export function WowNav({ title = "WoW" }: WowNavProps) {
  const pathname = usePathname() ?? "";
  const isWowHome = pathname === WOW_HOME_PATH;
  const isCharacter = pathname === WOW_CHARACTER_PATH;
  const isGuild = pathname === WOW_GUILD_PATH;
  const { enabled: rawDebugEnabled, setEnabled: setRawDebugEnabled } =
    useWowDebugRawPanels();

  return (
    <>
      <div className="header-title">
        <Link href={PORTAL_HOME_PATH} className="header-title__parent-link">
          {PORTAL_NAME}
        </Link>
        <span className="header-title__separator" aria-hidden>
          /
        </span>
        {isWowHome ? (
          <span className="header-title__current">{title}</span>
        ) : (
          <Link
            href={WOW_HOME_PATH}
            className="header-title__link"
            aria-label={`${title} (home)`}
          >
            {title}
          </Link>
        )}
      </div>

      <div className="header-navigation-toolbar">
        <nav aria-label="WoW primary navigation" className="header-navigation">
          <Link
            href={WOW_HOME_PATH}
            className={[
              "header-navigation__link",
              isWowHome
                ? "header-navigation__link--current"
                : "header-navigation__link--inactive",
            ].join(" ")}
            aria-current={isWowHome ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href={WOW_CHARACTER_PATH}
            className={[
              "header-navigation__link",
              isCharacter
                ? "header-navigation__link--current"
                : "header-navigation__link--inactive",
            ].join(" ")}
            aria-current={isCharacter ? "page" : undefined}
          >
            Character
          </Link>
          <Link
            href={WOW_GUILD_PATH}
            className={[
              "header-navigation__link",
              isGuild
                ? "header-navigation__link--current"
                : "header-navigation__link--inactive",
            ].join(" ")}
            aria-current={isGuild ? "page" : undefined}
          >
            Guild
          </Link>
        </nav>

        <label className="header-toggle-selector">
          <input
            type="checkbox"
            className="header-toggle-selector__control"
            checked={rawDebugEnabled}
            onChange={(e) => setRawDebugEnabled(e.target.checked)}
            aria-label="Show raw Battle.net API response panels for troubleshooting"
          />
          <span className="header-toggle-selector__label">Raw API</span>
        </label>
      </div>
    </>
  );
}

/** @deprecated Use `WowNav` — kept for existing imports. */
export const WowNavHeader = WowNav;
