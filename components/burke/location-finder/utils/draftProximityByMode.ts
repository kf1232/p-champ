import type { LocationFinderProximitySnapshot } from "@/lib/burke/location-finder/store/locationFinderFormDraft";

import type { ProximityResultsByMode, ProximityResultsSnapshot } from "./proximityResultsByMode";
import { emptyProximityResultsByMode } from "./proximityResultsByMode";

export function proximityByModeFromDraft(
  draft: {
    straightLine: LocationFinderProximitySnapshot;
    driving: LocationFinderProximitySnapshot;
  } | null,
): ProximityResultsByMode {
  if (!draft) {
    return emptyProximityResultsByMode();
  }
  const toSnapshot = (
    s: LocationFinderProximitySnapshot,
  ): ProximityResultsSnapshot => ({
    matches: s.matches,
    metrics: s.proximityMetrics,
    unroutedCount: s.unroutedCount ?? 0,
    error: s.proximityError ?? null,
    routingDiagnostics: s.routingDiagnostics ?? null,
    duplicateCount: s.duplicateCount ?? 0,
    inputsSnapshot: s.inputsSnapshot ?? null,
  });
  return {
    straightLine: toSnapshot(draft.straightLine),
    driving: toSnapshot(draft.driving),
  };
}

export function draftSnapshotsFromByMode(
  byMode: ProximityResultsByMode,
): Pick<
  import("@/lib/burke/location-finder/store/locationFinderFormDraft").LocationFinderFormDraft,
  "straightLine" | "driving"
> {
  const toDraft = (s: ProximityResultsSnapshot): LocationFinderProximitySnapshot => ({
    matches: s.matches,
    proximityMetrics: s.metrics,
    unroutedCount: s.unroutedCount,
    proximityError: s.error,
    routingDiagnostics: s.routingDiagnostics,
    duplicateCount: s.duplicateCount,
    inputsSnapshot: s.inputsSnapshot,
  });
  return {
    straightLine: toDraft(byMode.straightLine),
    driving: toDraft(byMode.driving),
  };
}
