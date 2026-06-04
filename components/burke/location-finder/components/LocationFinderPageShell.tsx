import type { ReactNode } from "react";

/** @deprecated Pass content directly; `AppChrome` owns the page slot. */
export function LocationFinderPageShell({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
