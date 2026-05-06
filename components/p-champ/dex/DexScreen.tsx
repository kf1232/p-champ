"use client";

import { ViewportLockedPageShell } from "@/components/commons";
import {
  VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
} from "@/lib/viewportFooterChrome";
import { SITE_NAME } from "@/lib/site";

import Navigation from "../Navigation";
import { DexRecordGrid } from "./components/DexRecordGrid";
import { useDexDisplayEntriesForSelectedGame } from "./useDexDisplayEntriesForSelectedGame";

const DEX_TITLE = "Dex";
const DEX_DESCRIPTION =
  "Browse records in a five-wide grid. Each tile is its own component so we can evolve this quickly.";

export function DexScreen() {
  const records = useDexDisplayEntriesForSelectedGame();

  return (
    <ViewportLockedPageShell footer="pChamp">
      <Navigation title={SITE_NAME} />

      <main
        className="mx-auto w-full max-w-7xl flex-1 px-6 pt-10"
        style={{
          paddingBottom: VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX,
        }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            {DEX_TITLE}
          </h1>
          <p className="max-w-prose text-black/70">{DEX_DESCRIPTION}</p>
        </div>

        <DexRecordGrid records={records} />
      </main>
    </ViewportLockedPageShell>
  );
}
