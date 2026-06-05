import { DexRecordPlaceholder } from "./DexRecordPlaceholder";

import type { DexDisplayEntry } from "@/lib/p-champ/dex";

const ROW_BREAK_EVERY = 30;

type DexRecordGridProps = {
  records: DexDisplayEntry[];
};

export function DexRecordGrid({ records }: DexRecordGridProps) {
  return (
    <section aria-label="Dex records" className="app-grid-section">
      <div className="app-grid app-grid--dex">
        {records.flatMap((r, i) => {
          const nodes = [];
          if (i > 0 && i % ROW_BREAK_EVERY === 0) {
            nodes.push(
              <div
                key={`dex-break-${i}`}
                role="separator"
                aria-hidden="true"
                className="app-grid-break"
              />,
            );
          }
          nodes.push(<DexRecordPlaceholder key={r.key} record={r} />);
          return nodes;
        })}
      </div>
    </section>
  );
}
