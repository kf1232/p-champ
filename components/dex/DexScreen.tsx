"use client";

import { Navigation } from "@/components/navigation";
import { SITE_NAME } from "@/lib/site";

import { DexRecordGrid } from "./components/DexRecordGrid";
import { useDexDisplayEntriesForSelectedGame } from "./useDexDisplayEntriesForSelectedGame";

const DEX_TITLE = "Dex";
const DEX_DESCRIPTION =
  "Browse records in a 6-up grid. Each tile is its own component so we can evolve this quickly.";

export function DexScreen() {
  const records = useDexDisplayEntriesForSelectedGame();

  return (
    <div className="flex min-h-full flex-col">
      <Navigation title={SITE_NAME} />

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            {DEX_TITLE}
          </h1>
          <p className="max-w-prose text-black/70">{DEX_DESCRIPTION}</p>
        </div>

        <DexRecordGrid records={records} />
      </main>
    </div>
  );
}

