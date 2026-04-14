import { DexRecordPlaceholder } from "./DexRecordPlaceholder";

import type { DexDisplayEntry } from "@/lib/dex";

const ROW_BREAK_EVERY = 30;

type DexRecordGridProps = {
  records: DexDisplayEntry[];
};

export function DexRecordGrid({ records }: DexRecordGridProps) {
  return (
    <section aria-label="Dex records" className="mt-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6">
        {records.flatMap((r, i) => {
          const nodes = [];
          if (i > 0 && i % ROW_BREAK_EVERY === 0) {
            nodes.push(
              <div
                key={`dex-break-${i}`}
                role="separator"
                aria-hidden="true"
                className="col-span-full my-3 border-t border-black/10 sm:my-4"
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

