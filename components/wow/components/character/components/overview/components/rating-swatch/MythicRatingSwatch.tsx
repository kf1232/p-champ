import { rgbaToCss } from "@/lib/wow";

export function MythicRatingSwatch({
  color,
  label,
}: {
  color: { r: number; g: number; b: number; a: number };
  label: string;
}) {
  return (
    <span
      className="character-overview-rating-swatch"
      style={{ backgroundColor: rgbaToCss(color) }}
      title={label}
      aria-hidden
    />
  );
}
