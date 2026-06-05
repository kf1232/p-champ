"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

import { resolveAppChrome } from "@/lib/appChrome";

import { AppFooter } from "./AppFooter";
import { AppHeader } from "./AppHeader";

type AppChromeProps = {
  children: ReactNode;
};

/**
 * Root UI shell: header, page slot, fixed footer (always mounted).
 * Layout rules: `styles/global/shell.css` (header/footer: `styles/header/`, `styles/footer/`).
 */
export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname() ?? "";
  const chrome = resolveAppChrome(pathname);

  const contentClass = ["app-chrome__content", chrome.contentClass]
    .filter(Boolean)
    .join(" ");

  const columnMax = chrome.pageClass.includes("max-7xl") ? "80rem" : "64rem";

  const chromeStyle = {
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
