import {
  isDrivingDistanceUnit,
  isStraightLineDistanceUnit,
  type DistanceUnit,
  type ProximityMatch,
  type ProximityRoutingDiagnostics,
} from "@/lib/burke";

export type ProximityResultsSnapshot = {
  matches: ProximityMatch[] | null;
  metrics: ProximityMatch[] | null;
  unroutedCount: number;
  error: string | null;
  routingDiagnostics: ProximityRoutingDiagnostics | null;
  /** Rows that shared the same coordinates as an earlier secondary. */
  duplicateCount: number;
  /** Set when a search completes; must match current addresses to display. */
  inputsSnapshot: string | null;
};

export function emptyProximityResultsSnapshot(): ProximityResultsSnapshot {
  return {
    matches: null,
    metrics: null,
    unroutedCount: 0,
    error: null,
    routingDiagnostics: null,
    duplicateCount: 0,
    inputsSnapshot: null,
  };
}

export type ProximityResultsByMode = {
  straightLine: ProximityResultsSnapshot;
  driving: ProximityResultsSnapshot;
};

export function emptyProximityResultsByMode(): ProximityResultsByMode {
  return {
    straightLine: emptyProximityResultsSnapshot(),
    driving: emptyProximityResultsSnapshot(),
  };
}

export function activeDistanceUnit(unit: DistanceUnit): keyof ProximityResultsByMode {
  return isDrivingDistanceUnit(unit) ? "driving" : "straightLine";
}

export function getSnapshotForUnit(
  byMode: ProximityResultsByMode,
  unit: DistanceUnit,
): ProximityResultsSnapshot {
  return byMode[activeDistanceUnit(unit)];
}

export function isSnapshotVisible(
  snapshot: ProximityResultsSnapshot,
  currentInputsSnapshot: string,
): boolean {
  if (
    snapshot.inputsSnapshot === null ||
    snapshot.inputsSnapshot !== currentInputsSnapshot
  ) {
    return false;
  }
  if (snapshot.routingDiagnostics !== null) {
    return true;
  }
  return snapshot.metrics !== null && snapshot.metrics.length > 0;
}

export function modeResultsLabel(unit: DistanceUnit): string {
  return isStraightLineDistanceUnit(unit)
    ? "Straight-line distance"
    : "Driving distance";
}
