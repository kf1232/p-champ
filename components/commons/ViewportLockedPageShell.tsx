"use client";

import type { ReactNode } from "react";

import type { ViewportBlankFooterKey } from "@/lib/viewportFooterChrome";

import { ViewportBlankFooter } from "./ViewportBlankFooter";

type ViewportLockedPageShellProps = {
  children: ReactNode;
  footer: ViewportBlankFooterKey;
};

/** Flex column + viewport-locked blank footer (portal, P-Champ, photography). */
export function ViewportLockedPageShell({
  children,
  footer,
}: ViewportLockedPageShellProps) {
  return (
    <>
      <div className="flex min-h-full flex-col">{children}</div>
      <ViewportBlankFooter footer={footer} />
    </>
  );
}
