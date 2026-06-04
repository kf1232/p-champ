import type { DistanceUnit } from "./types";

/** Legacy drafts used `minutes` for OSRM-based search; treat as driving miles. */
export function normalizeDistanceUnit(unit: unknown): DistanceUnit {
  if (unit === "drivingMiles" || unit === "minutes") {
    return "drivingMiles";
  }
  return "miles";
}

export function isStraightLineDistanceUnit(unit: DistanceUnit): boolean {
  return unit === "miles";
}

export function isDrivingDistanceUnit(unit: DistanceUnit): boolean {
  return unit === "drivingMiles";
}
