"use client";

import type { ReactNode } from "react";

type ViewportLockedFooterBarProps = {
  children?: ReactNode;
  ariaLabel?: string;
};

/** Fixed bottom band — shell only; styles from `styles/footer/` (`.footer-container`). */
export function ViewportLockedFooterBar({
  children,
  ariaLabel,
}: ViewportLockedFooterBarProps) {
  return (
    <footer className="footer-container" aria-label={ariaLabel}>
      {children}
    </footer>
  );
}
