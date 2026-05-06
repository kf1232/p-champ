import { ViewportLockedPageShell } from "@/components/commons";
import {
  VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
} from "@/lib/viewportFooterChrome";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

import Navigation from "./Navigation";
import { PChampPlaceholderGrid } from "./PChampPlaceholderGrid";

/** P-Champ landing at `/p-champ` — not the site portal (`/`). */
export function PChampHomeScreen() {
  return (
    <ViewportLockedPageShell footer="pChamp">
      <Navigation />

      <main
        className="mx-auto w-full max-w-5xl flex-1 px-6 pt-10"
        style={{
          paddingBottom: VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
        }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            {SITE_NAME}
          </h1>
          <p className="max-w-prose text-black/70">{SITE_DESCRIPTION}</p>
        </div>

        <PChampPlaceholderGrid />
      </main>
    </ViewportLockedPageShell>
  );
}
