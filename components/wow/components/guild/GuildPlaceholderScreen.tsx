import { GuildLookupForm } from "./GuildLookupForm";

/** WoW `/wow/guild` — guild Game Data lookup. */
export function GuildPlaceholderScreen() {
  return (
    <>
      <div className="guild-service-intro">
        <h1 className="guild-service-title">Guild</h1>
        <p className="guild-service-desc">
          Look up a guild via the Battle.net Game Data API. Required fields match
          the proxy route; namespace and locale default from your region when
          left blank.
        </p>
      </div>

      <GuildLookupForm />
    </>
  );
}
