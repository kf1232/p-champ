import { AppTileGrid } from "@/components/commons";

import { WOW_HOME_GRID_LINKS } from "../configs/wowHomeGridLinks";

export function WowPlaceholderGrid() {
  return (
    <AppTileGrid ariaLabel="WoW feature grid" links={WOW_HOME_GRID_LINKS} />
  );
}
