import { haversineMiles } from "./haversineMiles";
import { isDrivingDistanceUnit, isStraightLineDistanceUnit } from "./distanceUnit";
import type {
  DistanceThreshold,
  ProximityMatch,
  ResolvedLocation,
} from "./types";

export function listProximityMetricsMiles(
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
): ProximityMatch[] {
  return destinations
    .map((dest) => {
      const miles = haversineMiles(target.lat, target.lon, dest.lat, dest.lon);
      return {
        id: dest.id,
        formatted: dest.formatted,
        miles,
        minutes: 0,
      };
    })
    .sort((a, b) => a.miles - b.miles);
}

export function filterByMilesThreshold(
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
  thresholdMiles: number,
): ProximityMatch[] {
  return listProximityMetricsMiles(target, destinations).filter(
    (row) => row.miles <= thresholdMiles,
  );
}

export function listProximityMetricsDriving(
  destinations: ResolvedLocation[],
  driveMilesById: Map<string, number>,
  driveMinutesById: Map<string, number>,
): ProximityMatch[] {
  const rows: ProximityMatch[] = [];

  for (const dest of destinations) {
    const miles = driveMilesById.get(dest.id);
    const minutes = driveMinutesById.get(dest.id);
    if (miles === undefined || minutes === undefined) {
      continue;
    }
    rows.push({
      id: dest.id,
      formatted: dest.formatted,
      miles,
      minutes,
    });
  }

  return rows.sort((a, b) => a.miles - b.miles);
}

export function filterByDrivingMilesThreshold(
  destinations: ResolvedLocation[],
  driveMilesById: Map<string, number>,
  driveMinutesById: Map<string, number>,
  thresholdMiles: number,
): ProximityMatch[] {
  return listProximityMetricsDriving(
    destinations,
    driveMilesById,
    driveMinutesById,
  ).filter((row) => row.miles <= thresholdMiles);
}

export function isValidThreshold({ value, unit }: DistanceThreshold): boolean {
  return (
    Number.isFinite(value) &&
    value > 0 &&
    (isStraightLineDistanceUnit(unit) || isDrivingDistanceUnit(unit))
  );
}
