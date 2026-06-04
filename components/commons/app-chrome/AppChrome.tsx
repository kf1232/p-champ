"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

import { resolveAppChrome } from "@/lib/appChrome";
import {
  MAIN_SPACER_ABOVE_VIEWPORT_FOOTER_PX,
  VIEWPORT_LOCKED_FOOTER_H_PX,
} from "@/lib/viewportFooterChrome";

import { AppFooter } from "./AppFooter";
import { AppHeader } from "./AppHeader";

type AppChromeProps = {
  children: ReactNode;
};

const chromeLayoutVars = {
  "--app-footer-h": `${VIEWPORT_LOCKED_FOOTER_H_PX}px`,
  "--app-main-footer-gap": `${MAIN_SPACER_ABOVE_VIEWPORT_FOOTER_PX}px`,
} as CSSProperties;

/**
 * Root UI shell: header, page slot, fixed footer (always mounted).
 * Layout rules live in `components/commons/styles/appLayout.css`.
 */
export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname() ?? "";
  const chrome = resolveAppChrome(pathname);

  const contentClass = ["app-chrome__content", chrome.contentClass]
    .filter(Boolean)
    .join(" ");

  const columnMax = chrome.pageClass.includes("max-7xl") ? "80rem" : "64rem";

  const chromeStyle = {
    ...chromeLayoutVars,
    "--app-column-max": columnMax,
  } as CSSProperties;

  return (
    <div className="app-chrome" style={chromeStyle}>
      <AppHeader
        defaultVariant={chrome.header}
        defaultWide={chrome.headerWide}
      />
      <div className={contentClass}>
        <main className={chrome.pageClass}>{children}</main>
      </div>
      <AppFooter blankFooter={chrome.blankFooter} />
    </div>
  );
}
