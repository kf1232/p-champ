import {
  TYPE_BADGE_CLASSES,
  formatTypeLabel,
} from "@/lib/dex";
import type { TypeName } from "@/lib/dex";

type TypeBadgesProps = {
  typeNames: readonly TypeName[];
  /** Smaller badges in tight tiles (team slots). */
  size?: "default" | "compact";
};

export function TypeBadges({ typeNames, size = "default" }: TypeBadgesProps) {
  if (typeNames.length === 0) return null;

  const text =
    size === "compact"
      ? "text-[8px] px-1 py-0.5"
      : "text-[9px] px-1.5 py-0.5";

  return (
    <div className="flex flex-wrap justify-center gap-1">
      {typeNames.map((t) => (
        <span
          key={t}
          className={`inline-block rounded font-bold uppercase leading-none tracking-wide ${text} ${TYPE_BADGE_CLASSES[t]}`}
        >
          {formatTypeLabel(t)}
        </span>
      ))}
    </div>
  );
}
