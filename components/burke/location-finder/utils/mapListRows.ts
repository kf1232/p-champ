import {
  isWithinMapDisplayCap,
  markerTierForDistance,
  type DistanceThreshold,
  type ProximityMatch,
  type ProximityMarkerTier,
} from "@/lib/burke";

/** Threshold comparison always uses miles (straight-line or OSRM driving). */
function distanceForThreshold(metric: ProximityMatch): number {
  return metric.miles;
}

/** Metrics for secondaries that can appear on the map (within 200% cap). */
export function mapVisibleMetrics(
  metrics: ProximityMatch[],
  threshold: DistanceThreshold,
): ProximityMatch[] {
  return metrics.filter((row) =>
    isWithinMapDisplayCap(distanceForThreshold(row), threshold.value),
  );
}

export function pinIdsForMapTier(
  metrics: ProximityMatch[],
  threshold: DistanceThreshold,
  tier: ProximityMarkerTier,
): string[] {
  return mapVisibleMetrics(metrics, threshold)
    .filter(
      (row) =>
        markerTierForDistance(distanceForThreshold(row), threshold.value) ===
          tier,
    )
    .map((row) => row.id);
}

export function isTierSelectionActive(
  activePinIds: ReadonlySet<string>,
  tierPinIds: readonly string[],
): boolean {
  return (
    tierPinIds.length > 0 &&
    tierPinIds.length === activePinIds.size &&
    tierPinIds.every((id) => activePinIds.has(id))
  );
}

export function resultsListRows(
  matches: ProximityMatch[],
  metrics: ProximityMatch[],
  threshold: DistanceThreshold,
  activePinIds: ReadonlySet<string>,
): ProximityMatch[] {
  if (activePinIds.size === 0) {
    return matches;
  }
  const visible = mapVisibleMetrics(metrics, threshold);
  return visible.filter((row) => activePinIds.has(row.id));
}
