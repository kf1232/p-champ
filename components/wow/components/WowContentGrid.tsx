import { trailingPlaceholderCellCount } from "@/lib/gridPlaceholders";
import { wowGroupEntryHrefFromList } from "@/lib/wow/wowRoutes";
import { groupRequiresPassword } from "@/lib/wow/groupAuthCookie";

import { WOW_GROUP_ENTRIES, metricsForGroup } from "../config/wowRosterConfig";
import { WowGroupRow } from "./WowGroupRow";

const FILLED_ROW_COUNT = WOW_GROUP_ENTRIES.length;
const GRID_COLS = 1;

export function WowContentGrid() {
  const placeholderRows = trailingPlaceholderCellCount(
    FILLED_ROW_COUNT,
    GRID_COLS,
  );

  return (
    <section aria-label="Scheduled groups" className="wow-grid-section">
      <div className="wow-grid-inner">
        {WOW_GROUP_ENTRIES.map((group) => (
          <WowGroupRow
            key={group.id}
            group={group}
            metrics={metricsForGroup(group.id)}
            detailHref={wowGroupEntryHrefFromList(
              group.id,
              groupRequiresPassword(group.id),
            )}
          />
        ))}
        {Array.from({ length: placeholderRows }, (_, i) => (
          <div
            key={`wow-grid-placeholder-${i}`}
            className="wow-grid-placeholder-row"
            aria-hidden
          />
        ))}
      </div>
    </section>
  );
}
