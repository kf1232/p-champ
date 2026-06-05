import { Suspense } from "react";

import { AppPageIntro } from "@/components/commons";

import { GUILD_PAGE_INTRO_DESCRIPTION } from "./configs/guildIntroCopy";
import { GuildLookupForm } from "./components/guild-lookup-form";

/** WoW `/wow/guild` — guild Game Data lookup. */
export function Guild() {
  return (
    <>
      <AppPageIntro title="Guild" description={GUILD_PAGE_INTRO_DESCRIPTION} />

      <Suspense fallback={null}>
        <GuildLookupForm />
      </Suspense>
    </>
  );
}
