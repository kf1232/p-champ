import { AppTileGrid } from "@/components/commons";
import { APP_TILE_GRID_COLS } from "@/lib/gridPlaceholders";

import { SCHEDULER_HOME_GRID_LINKS } from "./configs/schedulerHomeGridLinks";

export function SchedulerPlaceholderGrid() {
  return (
    <AppTileGrid
      ariaLabel="Scheduler feature grid"
      links={SCHEDULER_HOME_GRID_LINKS}
      count={APP_TILE_GRID_COLS}
    />
  );
}
