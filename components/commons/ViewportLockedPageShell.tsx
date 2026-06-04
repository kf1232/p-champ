"use client";

import type { ReactNode } from "react";

import type { ViewportBlankFooterKey } from "@/lib/viewportFooterChrome";

import { AppViewportFooter } from "./AppViewportFooter";

type ViewportLockedPageShellProps = {
  children: ReactNode;
  footer: ViewportBlankFooterKey;
};

/** Flex column + viewport-locked footer (blank or local-storage when registered). */
export function ViewportLockedPageShell({
  children,
  footer,
}: ViewportLockedPageShellProps) {
  return (
    <>
      <div className="flex min-h-full flex-col">{children}</div>
      <AppViewportFooter blankFooter={footer} />
    </>
  );
}
