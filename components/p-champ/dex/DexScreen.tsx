"use client";

import { DexRecordGrid } from "./components/DexRecordGrid";
import { useDexDisplayEntriesForSelectedGame } from "./useDexDisplayEntriesForSelectedGame";

const DEX_TITLE = "Dex";
const DEX_DESCRIPTION =
  "Browse records in a five-wide grid. Each tile is its own component so we can evolve this quickly.";

export function DexScreen() {
  const records = useDexDisplayEntriesForSelectedGame();

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-primary">
          {DEX_TITLE}
        </h1>
        <p className="max-w-prose text-secondary">{DEX_DESCRIPTION}</p>
      </div>

      <DexRecordGrid records={records} />
    </>
  );
}
