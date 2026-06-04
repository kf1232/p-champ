"use client";

import type { ReactNode } from "react";

import type { ViewportBlankFooterKey } from "@/lib/viewportFooterChrome";

type ViewportLockedPageShellProps = {
  children: ReactNode;
  /** Ignored — footer is rendered by `AppChrome` in `app/layout.tsx`. */
  footer: ViewportBlankFooterKey;
};

/**
 * @deprecated Chrome lives in `app/layout.tsx` (`AppChrome`). This wrapper only
 * renders children so legacy imports keep working during migration.
 */
export function ViewportLockedPageShell({
  children,
}: ViewportLockedPageShellProps) {
  return <>{children}</>;
}
