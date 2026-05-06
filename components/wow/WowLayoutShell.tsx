"use client";

import type { CSSProperties, ReactNode } from "react";

import {
  VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
} from "@/lib/viewportFooterChrome";
import { WowDebugRawPanelsProvider } from "./WowDebugRawPanelsContext";
import { WowNavHeader } from "./WowNavHeader";
import { WowServiceFooter } from "./WowServiceFooter";
import { WowServiceStorageProvider } from "./WowServiceStorageProvider";

export function WowLayoutShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WowServiceStorageProvider>
      <WowDebugRawPanelsProvider>
      <div className="wow-layout">
        <WowNavHeader />
        <main
          className="wow-layout-main"
          style={
            {
              "--wow-main-padding-bottom": `${VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX}px`,
            } as CSSProperties
          }
        >
          {children}
        </main>
        <WowServiceFooter />
      </div>
      </WowDebugRawPanelsProvider>
    </WowServiceStorageProvider>
  );
}
