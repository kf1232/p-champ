"use client";

import type { AppHeaderVariant } from "@/lib/appChrome";

import { AppViewportHeader } from "../AppViewportHeader";

type AppHeaderProps = {
  defaultVariant: AppHeaderVariant;
  defaultWide?: boolean;
};

/** App-level top band. Storage-style overrides via `AppHeaderProvider`. */
export function AppHeader({ defaultVariant, defaultWide }: AppHeaderProps) {
  return (
    <AppViewportHeader
      defaultVariant={defaultVariant}
      defaultWide={defaultWide}
    />
  );
}
