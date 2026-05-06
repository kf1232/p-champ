import { Suspense } from "react";

import { CharacterProfileLookupForm } from "./components/lookup";

/** WoW `/wow/character` — character tools entry (profile summary lookup). */
export function CharacterPlaceholderScreen() {
  return (
    <>
      <div className="character-service-intro">
        <h1 className="character-service-title">Character</h1>
      </div>

      <Suspense fallback={null}>
        <CharacterProfileLookupForm />
      </Suspense>
    </>
  );
}