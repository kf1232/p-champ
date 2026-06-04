import {
  DEX_STAT_TODO,
  FORM_IDS,
  formatDexTileDisplayName,
} from "@/lib/p-champ/dex";
import type { DexDisplayEntry } from "@/lib/p-champ/dex";

type DexRecordPlaceholderProps = {
  record: DexDisplayEntry;
};

function statLine(label: string, value: number | undefined) {
  const display =
    value === undefined || value === DEX_STAT_TODO ? "—" : value;
  return (
    <div className="flex items-baseline justify-between gap-2">
      <div className="text-sm font-medium text-tertiary">{label}</div>
      <div className="text-sm font-semibold text-secondary">{display}</div>
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
      className={`flex min-h-[11rem] flex-col gap-3 rounded-xl border border-border-subtle bg-surface-overlay p-5 ${
        record.formId !== FORM_IDS.base ? "cursor-help" : ""
      }`}
      title={formTooltip}
    >
      <div className="truncate text-lg font-semibold leading-snug text-primary">
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

          <div className="text-sm text-tertiary">
            Moves: {record.form.moves.length}
          </div>
        </>
      ) : (
        <div className="text-base text-secondary">Details coming soon.</div>
      )}
    </div>
  );
}
