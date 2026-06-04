export type ProximityMarkerTier =
  | "green"
  | "yellow"
  | "orange"
  | "red"
  | "black";

/** Secondaries above this % of threshold are omitted from the map (e.g. 25 mi → hide beyond 50 mi). */
export const MAP_MAX_PROXIMITY_PERCENT = 200;

/** Upper % of threshold for each map color (legend: `≤ N%`). */
export const MARKER_TIER_MAX_PERCENT: Record<ProximityMarkerTier, number> = {
  green: 25,
  yellow: 50,
  orange: 75,
  red: 100,
  black: MAP_MAX_PROXIMITY_PERCENT,
};

export function markerTierLegendLabel(tier: ProximityMarkerTier): string {
  return `≤ ${MARKER_TIER_MAX_PERCENT[tier]}%`;
}

/** Share of threshold used (e.g. 1 mi / 5 mi → 20). */
export function proximityPercent(
  distance: number,
  threshold: number,
): number {
  if (!Number.isFinite(distance) || !Number.isFinite(threshold) || threshold <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  return (distance / threshold) * 100;
}

export function markerTierFromProximityPercent(
  percent: number,
): ProximityMarkerTier {
  if (percent >= 100) {
    return "black";
  }
  if (percent >= 75) {
    return "red";
  }
  if (percent >= 50) {
    return "orange";
  }
  if (percent >= 25) {
    return "yellow";
  }
  return "green";
}

export function markerTierForDistance(
  distance: number,
  threshold: number,
): ProximityMarkerTier {
  return markerTierFromProximityPercent(proximityPercent(distance, threshold));
}

/** Whether a secondary should appear on the proximity map. */
export function isWithinMapDisplayCap(
  distance: number,
  threshold: number,
): boolean {
  return proximityPercent(distance, threshold) <= MAP_MAX_PROXIMITY_PERCENT;
}
