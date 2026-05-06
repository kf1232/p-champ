import { ViewportLockedPageShell } from "@/components/commons";
import {
  VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
} from "@/lib/viewportFooterChrome";

import { PhotographyContentGrid } from "./PhotographyContentGrid";
import { PhotographyNavHeader } from "./PhotographyNavHeader";
const PHOTOGRAPHY_DESCRIPTION = "Shared Lightroom gallery.";

export function PhotographyScreen() {
  return (
    <ViewportLockedPageShell footer="photography">
      <PhotographyNavHeader />

      <main
        className="mx-auto w-full max-w-5xl flex-1 px-6 pt-10"
        style={{
          paddingBottom: VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
        }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            Photography
          </h1>
          <p className="max-w-prose text-black/70">{PHOTOGRAPHY_DESCRIPTION}</p>
        </div>

        <PhotographyContentGrid />
      </main>
    </ViewportLockedPageShell>
  );
}
