import { DexRecordPlaceholder } from "./DexRecordPlaceholder";

import type { DexDisplayEntry } from "@/lib/dex";

type DexRecordGridProps = {
  records: DexDisplayEntry[];
};

export function DexRecordGrid({ records }: DexRecordGridProps) {
  return (
    <section aria-label="Dex records" className="mt-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {records.map((r) => (
          <DexRecordPlaceholder key={r.key} record={r} />
        ))}
      </div>
    </section>
  );
}

