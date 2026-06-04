import { ViewportLockedPageShell } from "@/components/commons";
import {
  VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
} from "@/lib/viewportFooterChrome";

import { BurkeNavHeader } from "./BurkeNavHeader";
import { BurkePlaceholderGrid } from "./BurkePlaceholderGrid";
import { BURKE_DESCRIPTION, BURKE_TITLE } from "./configs/burkeHomeCopy";

export function BurkeScreen() {
  return (
    <ViewportLockedPageShell footer="burke">
      <BurkeNavHeader />

      <main
        className="mx-auto w-full max-w-5xl flex-1 px-6 pt-10"
        style={{
          paddingBottom: VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
        }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            {BURKE_TITLE}
          </h1>
          <p className="max-w-prose text-black/70">{BURKE_DESCRIPTION}</p>
        </div>

        <BurkePlaceholderGrid />
      </main>
    </ViewportLockedPageShell>
  );
}
