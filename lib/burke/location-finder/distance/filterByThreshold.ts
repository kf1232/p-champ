import { haversineMiles } from "./haversineMiles";
import type {
  DistanceThreshold,
  ProximityMatch,
  ResolvedLocation,
} from "./types";

export function filterByMilesThreshold(
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
  thresholdMiles: number,
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
    .filter((row) => row.miles <= thresholdMiles)
    .sort((a, b) => a.miles - b.miles);
}

export function filterByMinutesThreshold(
  destinations: ResolvedLocation[],
  driveMinutesById: Map<string, number>,
  driveMilesById: Map<string, number>,
  thresholdMinutes: number,
): ProximityMatch[] {
  const rows: ProximityMatch[] = [];

  for (const dest of destinations) {
    const minutes = driveMinutesById.get(dest.id);
    const miles = driveMilesById.get(dest.id);
    if (minutes === undefined || miles === undefined) {
      continue;
    }
    rows.push({
      id: dest.id,
      formatted: dest.formatted,
      miles,
      minutes,
    });
  }

  return rows
    .filter((row) => row.minutes <= thresholdMinutes)
    .sort((a, b) => a.minutes - b.minutes);
}

export function isValidThreshold({ value, unit }: DistanceThreshold): boolean {
  return Number.isFinite(value) && value > 0 && (unit === "miles" || unit === "minutes");
}
