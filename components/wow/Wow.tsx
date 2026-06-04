"use client";

import type { ReactNode } from "react";

import { WowDebugRawPanelsProvider } from "./components/providers/WowDebugRawPanelsContext";
import { WowServiceStorageProvider } from "./components/providers/WowServiceStorageProvider";
import { WowStorageFooterRegistration } from "./components/chrome/WowStorageFooterRegistration";

/** WoW route providers — header/footer/main chrome come from `app/layout.tsx`. */
export function WowLayoutShell({ children }: { children: ReactNode }) {
  return (
    <WowServiceStorageProvider>
      <WowStorageFooterRegistration />
      <WowDebugRawPanelsProvider>{children}</WowDebugRawPanelsProvider>
    </WowServiceStorageProvider>
  );
}
