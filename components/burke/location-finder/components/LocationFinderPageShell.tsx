import type { ReactNode } from "react";

import { ViewportLockedPageShell } from "@/components/commons";
import { VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX } from "@/lib/viewportFooterChrome";

import { BurkeNavHeader } from "../../BurkeNavHeader";

type LocationFinderPageShellProps = {
  children?: ReactNode;
  paddingBottom?: number;
};

export function LocationFinderPageShell({
  children,
  paddingBottom = VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
}: LocationFinderPageShellProps) {
  return (
    <ViewportLockedPageShell footer="burke">
      <BurkeNavHeader />
      <main
        className="mx-auto w-full max-w-5xl flex-1 px-6 pt-10"
        style={{ paddingBottom }}
      >
        {children}
      </main>
    </ViewportLockedPageShell>
  );
}
