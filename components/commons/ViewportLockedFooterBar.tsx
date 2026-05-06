"use client";

import type { ReactNode } from "react";

import { VIEWPORT_LOCKED_FOOTER_H_PX } from "@/lib/viewportFooterChrome";

type ViewportLockedFooterBarProps = {
  children?: ReactNode;
  /** Merged with base chrome classes (e.g. flex + text sizing for WoW). */
  className?: string;
  ariaLabel?: string;
};

/**
 * Fixed-height bottom band shared by blank footers and WoW’s stats footer.
 */
export function ViewportLockedFooterBar({
  children,
  className = "",
  ariaLabel,
}: ViewportLockedFooterBarProps) {
  return (
    <footer
      className={[
        "fixed bottom-0 left-0 right-0 z-40 w-full border-t border-black/10 bg-white/90 backdrop-blur",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ height: VIEWPORT_LOCKED_FOOTER_H_PX }}
      aria-label={ariaLabel}
    >
      {children}
    </footer>
  );
}
