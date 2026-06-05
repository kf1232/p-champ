import type { DistanceThreshold, DistanceUnit } from "@/lib/burke";

type DistanceThresholdControlProps = {
  value: DistanceThreshold;
  onChange: (next: DistanceThreshold) => void;
  /** `inline` — single row for use beside the submit button. */
  layout?: "stacked" | "inline";
};

const UNIT_OPTIONS: { value: DistanceUnit; label: string }[] = [
  { value: "miles", label: "straight-line miles" },
  { value: "drivingMiles", label: "driving miles" },
];

function ThresholdInputs({
  value,
  onChange,
}: Pick<DistanceThresholdControlProps, "value" | "onChange">) {
  return (
    <>
      <input
        id="location-finder-threshold-value"
        className="app-input app-input--auto-width w-28"
        type="number"
        min={0}
        step={0.1}
        value={Number.isFinite(value.value) ? value.value : ""}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          onChange({
            ...value,
            value: Number.isFinite(parsed) ? parsed : 0,
          });
        }}
        required
        aria-label="Distance threshold"
      />
      <select
        id="location-finder-threshold-unit"
        className="app-select app-select--auto-width"
        value={value.unit}
        onChange={(e) =>
          onChange({
            ...value,
            unit: e.target.value as DistanceUnit,
          })
        }
        aria-label="Distance type"
      >
        {UNIT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </>
  );
}

export function DistanceThresholdControl({
  value,
  onChange,
  layout = "stacked",
}: DistanceThresholdControlProps) {
  if (layout === "inline") {
    return (
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <span
          id="location-finder-threshold-label"
          className="text-sm font-medium text-primary"
        >
          Within
        </span>
        <ThresholdInputs value={value} onChange={onChange} />
        <span className="text-sm text-secondary">of target</span>
      </div>
    );
  }

  return (
    <fieldset
      className="flex flex-col gap-1.5"
      aria-labelledby="location-finder-threshold-label"
    >
      <legend
        id="location-finder-threshold-label"
        className="text-sm font-medium text-primary"
      >
        Within
      </legend>
      <div className="flex flex-wrap items-center gap-2">
        <ThresholdInputs value={value} onChange={onChange} />
        <span className="text-sm text-secondary">of target</span>
      </div>
    </fieldset>
  );
}
