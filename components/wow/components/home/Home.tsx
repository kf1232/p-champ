import { AppPageIntro } from "@/components/commons";

import { WOW_HOME_DESCRIPTION } from "./configs/wowHomeCopy";
import { WowPlaceholderGrid } from "./components/WowPlaceholderGrid";

/** WoW `/wow` home body — intro copy and feature grid. */
export function Home() {
  return (
    <>
      <AppPageIntro title="WoW" description={WOW_HOME_DESCRIPTION} />
      <WowPlaceholderGrid />
    </>
  );
}
