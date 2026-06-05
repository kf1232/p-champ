import { Suspense } from "react";

import { AppPageIntro } from "@/components/commons";

import { CharacterProfileLookupForm } from "./components/lookup";

/** WoW `/wow/character` — character tools entry (profile summary lookup). */
export function CharacterPlaceholderScreen() {
  return (
    <>
      <AppPageIntro title="Character" />

      <Suspense fallback={null}>
        <CharacterProfileLookupForm />
      </Suspense>
    </>
  );
}
