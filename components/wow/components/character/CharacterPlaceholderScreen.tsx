import { CharacterProfileLookupForm } from "./CharacterProfileLookupForm";

/** WoW `/wow/character` — character tools entry (profile summary lookup). */
export function CharacterPlaceholderScreen() {
  return (
    <>
      <div className="character-service-intro">
        <h1 className="character-service-title">Character</h1>
      </div>

      <CharacterProfileLookupForm />
    </>
  );
}
