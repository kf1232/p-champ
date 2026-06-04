"use client";

import type { ReactNode } from "react";

type ViewportLockedFooterBarProps = {
  children?: ReactNode;
  /** Merged with base chrome classes (e.g. flex + text sizing for storage footer). */
  className?: string;
  ariaLabel?: string;
};

/** Fixed bottom band — dimensions from `appLayout.css` (`.app-chrome__footer`). */
export function ViewportLockedFooterBar({
  children,
  className = "",
  ariaLabel,
}: ViewportLockedFooterBarProps) {
  return (
    <footer
      className={["app-chrome__footer", className].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
    >
      {children}
    </footer>
  );
}
