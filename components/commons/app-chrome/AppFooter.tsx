"use client";

import type { ViewportBlankFooterKey } from "@/lib/viewportFooterChrome";

import { AppViewportFooter } from "../AppViewportFooter";

type AppFooterProps = {
  blankFooter: ViewportBlankFooterKey | undefined;
};

/** App-level bottom band (fixed). Storage footers override via `AppStorageFooterProvider`. */
export function AppFooter({ blankFooter }: AppFooterProps) {
  return <AppViewportFooter blankFooter={blankFooter} />;
}
