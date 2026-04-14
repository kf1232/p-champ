import { DEX_STAT_TODO, FORM_IDS } from "@/lib/dex";
import type { DexDisplayEntry } from "@/lib/dex";

type DexRecordPlaceholderProps = {
  record: DexDisplayEntry;
};

function statLine(label: string, value: number | undefined) {
  const display =
    value === undefined || value === DEX_STAT_TODO ? "—" : value;
  return (
    <div className="flex items-baseline justify-between gap-2">
      <div className="text-xs font-medium text-black/50">{label}</div>
      <div className="text-xs font-semibold text-black/80">{display}</div>
    </div>
  );
}

export function DexRecordPlaceholder({ record }: DexRecordPlaceholderProps) {
  const formLabel =
    record.formId === FORM_IDS.base ? String(record.dexNumber) : record.key;

  return (
    <div className="flex min-h-24 flex-col gap-2 rounded-lg border border-black/10 bg-white/60 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <div className="truncate text-sm font-semibold text-black">
          {record.dexName}
        </div>
        <div className="shrink-0 text-xs font-medium text-black/40">
          ({formLabel})
        </div>
      </div>

      {record.form ? (
        <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {statLine("HP", record.form.hp)}
            {statLine("ATK", record.form.attack)}
            {statLine("DEF", record.form.defense)}
            {statLine("SPD", record.form.speed)}
          </div>

          <div className="text-xs text-black/50">
            Moves: {record.form.moves.length}
          </div>
        </>
      ) : (
        <div className="text-sm text-black/60">Details coming soon.</div>
      )}
    </div>
  );
}

