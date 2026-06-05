"use client";

import { AppPageIntro } from "@/components/commons";

import { DexRecordGrid } from "./components/DexRecordGrid";
import { useDexDisplayEntriesForSelectedGame } from "./useDexDisplayEntriesForSelectedGame";

const DEX_TITLE = "Dex";
const DEX_DESCRIPTION =
  "Browse records in a five-wide grid. Each tile is its own component so we can evolve this quickly.";

export function DexScreen() {
  const records = useDexDisplayEntriesForSelectedGame();

  return (
    <>
      <AppPageIntro title={DEX_TITLE} description={DEX_DESCRIPTION} />
      <DexRecordGrid records={records} />
    </>
  );
}
