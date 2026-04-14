import {
  DEX_STAT_TODO,
  FORM_IDS,
  formatDexTileDisplayName,
} from "@/lib/dex";
import type { DexDisplayEntry } from "@/lib/dex";

type DexRecordPlaceholderProps = {
  record: DexDisplayEntry;
};

function statLine(label: string, value: number | undefined) {
  const display =
    value === undefined || value === DEX_STAT_TODO ? "—" : value;
  return (
    <div className="flex items-baseline justify-between gap-2">
      <div className="text-sm font-medium text-black/50">{label}</div>
      <div className="text-sm font-semibold text-black/80">{display}</div>
    </div>
  );
}

export function DexRecordPlaceholder({ record }: DexRecordPlaceholderProps) {
  const displayName = formatDexTileDisplayName(record.dexName, record.formId);
  const formTooltip =
    record.formId === FORM_IDS.base
      ? undefined
      : `Form ID: ${record.formId}`;

  return (
    <div
      className={`flex min-h-[11rem] flex-col gap-3 rounded-xl border border-black/10 bg-white/60 p-5 ${
        record.formId !== FORM_IDS.base ? "cursor-help" : ""
      }`}
      title={formTooltip}
    >
      <div className="truncate text-lg font-semibold leading-snug text-black">
        {displayName}
      </div>

      {record.form ? (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {statLine("HP", record.form.hp)}
            {statLine("Atk", record.form.attack)}
            {statLine("Def", record.form.defense)}
            {statLine("SpA", record.form.spAtk)}
            {statLine("SpD", record.form.spDef)}
            {statLine("Spe", record.form.speed)}
          </div>

          <div className="text-sm text-black/50">
            Moves: {record.form.moves.length}
          </div>
        </>
      ) : (
        <div className="text-base text-black/60">Details coming soon.</div>
      )}
    </div>
  );
}
