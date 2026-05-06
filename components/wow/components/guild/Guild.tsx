import { Suspense } from "react";

import { GUILD_PAGE_INTRO_DESCRIPTION } from "./configs/guildIntroCopy";
import { GuildLookupForm } from "./components/guild-lookup-form";

import "./styles/guild.css";

/** WoW `/wow/guild` — guild Game Data lookup. */
export function Guild() {
  return (
    <>
      <div className="guild-service-intro">
        <h1 className="guild-service-title">Guild</h1>
        <p className="guild-service-desc">{GUILD_PAGE_INTRO_DESCRIPTION}</p>
      </div>

      <Suspense fallback={null}>
        <GuildLookupForm />
      </Suspense>
    </>
  );
}
