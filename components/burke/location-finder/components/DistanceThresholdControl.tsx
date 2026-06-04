import type { DistanceThreshold, DistanceUnit } from "@/lib/burke/location-finder/distance/types";

import { LOCATION_FINDER_CONTROL_CLASS } from "../configs/locationFinderStyles";

type DistanceThresholdControlProps = {
  value: DistanceThreshold;
  onChange: (next: DistanceThreshold) => void;
};

export function DistanceThresholdControl({
  value,
  onChange,
}: DistanceThresholdControlProps) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="text-sm font-medium text-black">Within</legend>
      <div className="flex flex-wrap items-center gap-2">
        <input
          id="location-finder-threshold-value"
          className={`${LOCATION_FINDER_CONTROL_CLASS} w-28`}
          type="number"
          min={0}
          step={value.unit === "minutes" ? 1 : 0.1}
          value={Number.isFinite(value.value) ? value.value : ""}
          onChange={(e) => {
            const parsed = Number(e.target.value);
            onChange({
              ...value,
              value: Number.isFinite(parsed) ? parsed : 0,
            });
          }}
          required
        />
        <select
          id="location-finder-threshold-unit"
          className={LOCATION_FINDER_CONTROL_CLASS}
          value={value.unit}
          onChange={(e) =>
            onChange({
              ...value,
              unit: e.target.value as DistanceUnit,
            })
          }
        >
          <option value="miles">miles</option>
          <option value="minutes">minutes</option>
        </select>
        <span className="text-sm text-black/60">of target</span>
      </div>
    </fieldset>
  );
}
