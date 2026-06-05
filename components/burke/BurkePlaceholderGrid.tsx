import { AppTileGrid } from "@/components/commons";

import { BURKE_HOME_GRID_LINKS } from "./configs/burkeHomeGridLinks";

export function BurkePlaceholderGrid() {
  return (
    <AppTileGrid ariaLabel="Burke feature grid" links={BURKE_HOME_GRID_LINKS} />
  );
}
