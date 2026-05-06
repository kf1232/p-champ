"use client";

import type { CSSProperties, ReactNode } from "react";

import {
  VIEWPORT_LOCKED_FOOTER_H_PX,
  VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
} from "@/lib/viewportFooterChrome";
import { WowNavHeader } from "./components/chrome/WowNavHeader";
import { WowServiceFooter } from "./components/chrome/WowServiceFooter";
import { WowDebugRawPanelsProvider } from "./components/providers/WowDebugRawPanelsContext";
import { WowServiceStorageProvider } from "./components/providers/WowServiceStorageProvider";

/** WoW `/wow` layout: storage + debug toggles, nav, scrollable main, stats footer. */
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
                "--wow-viewport-footer-h": `${VIEWPORT_LOCKED_FOOTER_H_PX}px`,
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
