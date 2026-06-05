"use client";

import type { AppHeaderVariant } from "@/lib/appChrome";
import { VIEWPORT_DEFAULT_HEADER_ARIA } from "@/lib/appHeaderChrome";

import { ColorSchemeToggle } from "./ColorSchemeToggle";
import { useAppHeaderSlotConfig } from "./AppHeaderContext";
import { renderDefaultAppHeaderContent } from "./app-chrome/defaultAppHeaderContent";

type AppViewportHeaderProps = {
  /** Route-default feature nav when nothing is registered. */
  defaultVariant: AppHeaderVariant;
  defaultWide?: boolean;
};

/**
 * App-level top band — always rendered (same as footer).
 * Features override inner content via `useRegisterAppHeader`.
 */
export function AppViewportHeader({
  defaultVariant,
  defaultWide = false,
}: AppViewportHeaderProps) {
  const registered = useAppHeaderSlotConfig();
  const wide = registered?.wide ?? defaultWide;
  const ariaLabel =
    registered?.ariaLabel ?? VIEWPORT_DEFAULT_HEADER_ARIA[defaultVariant];

  const content =
    registered?.content ??
    renderDefaultAppHeaderContent(defaultVariant, wide);

  return (
    <header className="header-container" aria-label={ariaLabel}>
      <div className="header-container__inner">
        <div className="header-container__main">{content}</div>
        <ColorSchemeToggle />
      </div>
    </header>
  );
}
