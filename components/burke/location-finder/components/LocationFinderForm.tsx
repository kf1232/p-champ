"use client";

import { useEffect, useMemo, useState } from "react";

import { BURKE_PROXIMITY_API_PATH } from "@/lib/burke";
import {
  dedupeResolvedLocations,
  expandProximityMatches,
  filterByDrivingMilesThreshold,
  findStoredProximityDrivingDiagnostics,
  findStoredProximityMetrics,
  isStraightLineDistanceUnit,
  isValidThreshold,
  listProximityMetricsMiles,
  LOCATION_FINDER_MAX_SECONDARY_LOCATIONS,
  normalizeDistanceUnit,
} from "@/lib/burke";
import type {
  DistanceThreshold,
  DistanceUnit,
  ProximityMatch,
  ProximityRoutingDiagnostics,
  ResolvedLocation,
} from "@/lib/burke";
import {
  emptyAddressFieldValue,
  isAddressResolved,
} from "@/lib/burke";
import type { AddressFieldValue } from "@/lib/burke";
import {
  mergeFormDraftIntoLocationFinderData,
  mergeProximityMatchesIntoLocationFinderData,
  readLocationFinderFormDraft,
  type LocationFinderFormDraft,
  type StoredSecondaryRow,
} from "@/lib/burke";
import {
  draftSnapshotsFromByMode,
  proximityByModeFromDraft,
} from "../utils/draftProximityByMode";
import {
  activeDistanceUnit,
  clearStaleModeSnapshots,
  getSnapshotForUnit,
  isSnapshotVisible,
  modeResultsLabel,
  type ProximityResultsByMode,
  type ProximityResultsSnapshot,
} from "../utils/proximityResultsByMode";
import { AddressField } from "./address-field";
import { DistanceThresholdControl } from "./DistanceThresholdControl";
import { LocationFinderResults } from "./LocationFinderResults";
import { useLocationFinderStorage } from "./providers/LocationFinderStorageProvider";
import { SecondaryJobLocationsEditor } from "./SecondaryJobLocationsEditor";
import {
  createInitialSecondaryRows,
  type SecondaryLocationRow,
} from "../utils/secondaryRows";

function toResolved(
  id: string,
  value: AddressFieldValue,
): ResolvedLocation | null {
  if (
    !isAddressResolved(value) ||
    value.formatted === null ||
    value.lat === null ||
    value.lon === null
  ) {
    return null;
  }
  return {
    id,
    formatted: value.formatted,
    lat: value.lat,
    lon: value.lon,
  };
}

function draftToSecondaryRows(draft: LocationFinderFormDraft): SecondaryLocationRow[] {
  return draft.secondaries.map((row) => ({
    id: row.id,
    value: row.value,
    status: row.status,
  }));
}

/** Fingerprint of target + secondaries used to invalidate stale proximity results. */
function locationInputsSnapshot(
  target: AddressFieldValue,
  secondaries: SecondaryLocationRow[],
): string {
  return JSON.stringify({
    target: {
      query: target.query,
      formatted: target.formatted,
      placeId: target.placeId,
      lat: target.lat,
      lon: target.lon,
    },
    secondaries: secondaries.map((row) => ({
      id: row.id,
      query: row.value.query,
      formatted: row.value.formatted,
      placeId: row.value.placeId,
      lat: row.value.lat,
      lon: row.value.lon,
    })),
  });
}

function patchModeSnapshot(
  byMode: ProximityResultsByMode,
  unit: DistanceUnit,
  patch: Partial<ProximityResultsSnapshot>,
): ProximityResultsByMode {
  const key = activeDistanceUnit(unit);
  return {
    ...byMode,
    [key]: { ...byMode[key], ...patch },
  };
}

function hasVisibleResultsForUnit(
  byMode: ProximityResultsByMode,
  unit: DistanceUnit,
  inputsSnapshot: string,
): boolean {
  return isSnapshotVisible(getSnapshotForUnit(byMode, unit), inputsSnapshot);
}

type LocationFinderFormProps = {
  onUnauthorized?: () => void;
};

export function LocationFinderForm({
  onUnauthorized,
}: LocationFinderFormProps) {
  const { data, setData } = useLocationFinderStorage();
  const savedDraft = useMemo(
    () => readLocationFinderFormDraft(data),
    [data],
  );

  const [target, setTarget] = useState<AddressFieldValue>(
    () => savedDraft?.target ?? emptyAddressFieldValue(),
  );
  const [secondaries, setSecondaries] = useState<SecondaryLocationRow[]>(
    () =>
      savedDraft
        ? draftToSecondaryRows(savedDraft)
        : createInitialSecondaryRows(),
  );
  const [threshold, setThreshold] = useState<DistanceThreshold>(() => {
    const draft = savedDraft?.threshold ?? { value: 25, unit: "miles" as const };
    return {
      value: draft.value,
      unit: normalizeDistanceUnit(draft.unit),
    };
  });
  const [resultsByMode, setResultsByMode] = useState<ProximityResultsByMode>(
    () => proximityByModeFromDraft(savedDraft),
  );
  const [secondariesCollapseOverride, setSecondariesCollapseOverride] = useState<
    boolean | null
  >(null);
  const [submitting, setSubmitting] = useState(false);

  const inputsSnapshot = useMemo(
    () => locationInputsSnapshot(target, secondaries),
    [target, secondaries],
  );

  const [trackedInputsSnapshot, setTrackedInputsSnapshot] =
    useState(inputsSnapshot);
  if (trackedInputsSnapshot !== inputsSnapshot) {
    setTrackedInputsSnapshot(inputsSnapshot);
    setSecondariesCollapseOverride(null);
  }

  const displayResultsByMode = useMemo(
    () => clearStaleModeSnapshots(resultsByMode, inputsSnapshot),
    [resultsByMode, inputsSnapshot],
  );

  const activeSnapshot = useMemo(
    () => getSnapshotForUnit(displayResultsByMode, threshold.unit),
    [displayResultsByMode, threshold.unit],
  );

  const showResults = useMemo(
    () => isSnapshotVisible(activeSnapshot, inputsSnapshot),
    [activeSnapshot, inputsSnapshot],
  );

  const autoCollapseSecondaries = useMemo(
    () =>
      hasVisibleResultsForUnit(
        displayResultsByMode,
        threshold.unit,
        inputsSnapshot,
      ),
    [displayResultsByMode, threshold.unit, inputsSnapshot],
  );

  const secondariesCollapsed =
    secondariesCollapseOverride ?? autoCollapseSecondaries;

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const draft: LocationFinderFormDraft = {
        target,
        secondaries: secondaries.map(
          (row): StoredSecondaryRow => ({
            id: row.id,
            value: row.value,
            status: row.status,
          }),
        ),
        threshold,
        ...draftSnapshotsFromByMode(
          clearStaleModeSnapshots(resultsByMode, inputsSnapshot),
        ),
      };
      setData((prev) => mergeFormDraftIntoLocationFinderData(prev, draft));
    }, 400);
    return () => window.clearTimeout(handle);
  }, [target, secondaries, threshold, resultsByMode, inputsSnapshot, setData]);

  const resolvedTarget = useMemo(() => toResolved("target", target), [target]);

  const resolvedSecondaries = useMemo(
    () =>
      secondaries
        .map((row) => toResolved(row.id, row.value))
        .filter((row): row is ResolvedLocation => row !== null),
    [secondaries],
  );

  const dedupedSecondaries = useMemo(
    () => dedupeResolvedLocations(resolvedSecondaries),
    [resolvedSecondaries],
  );

  const overSecondaryLimit =
    dedupedSecondaries.unique.length >
    LOCATION_FINDER_MAX_SECONDARY_LOCATIONS;

  const canSubmit =
    resolvedTarget !== null &&
    dedupedSecondaries.unique.length > 0 &&
    !overSecondaryLimit &&
    isValidThreshold(threshold) &&
    !submitting;

  const activeError =
    activeSnapshot.inputsSnapshot === inputsSnapshot
      ? activeSnapshot.error
      : null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || !resolvedTarget) {
      return;
    }

    setSubmitting(true);
    setResultsByMode((prev) =>
      patchModeSnapshot(prev, threshold.unit, {
        matches: null,
        metrics: null,
        error: null,
        unroutedCount: 0,
        routingDiagnostics: null,
        duplicateCount: 0,
        inputsSnapshot: null,
      }),
    );

    const completeSearch = (patch: Partial<ProximityResultsSnapshot>) => {
      setResultsByMode((prev) =>
        patchModeSnapshot(prev, threshold.unit, {
          ...patch,
          inputsSnapshot,
        }),
      );
      setSecondariesCollapseOverride(true);
    };

    try {
      if (isStraightLineDistanceUnit(threshold.unit)) {
        const canonicalMetrics = listProximityMetricsMiles(
          resolvedTarget,
          dedupedSecondaries.unique,
        );
        const canonicalMatches = canonicalMetrics.filter(
          (row) => row.miles <= threshold.value,
        );
        const metrics = expandProximityMatches(
          canonicalMetrics,
          resolvedSecondaries,
          dedupedSecondaries.canonicalIdByInputId,
        );
        const matches = expandProximityMatches(
          canonicalMatches,
          resolvedSecondaries,
          dedupedSecondaries.canonicalIdByInputId,
        );
        completeSearch({
          metrics,
          matches,
          error: null,
          unroutedCount: 0,
          routingDiagnostics: null,
          duplicateCount: dedupedSecondaries.duplicateInputIds.length,
        });
        setData((prev) =>
          mergeProximityMatchesIntoLocationFinderData(
            prev,
            resolvedTarget,
            resolvedSecondaries,
            threshold,
            matches,
            metrics,
          ),
        );
        return;
      }

      const cachedMetrics = findStoredProximityMetrics(
        data,
        resolvedTarget,
        resolvedSecondaries,
        threshold,
      );
      const cachedDiagnostics = cachedMetrics
        ? findStoredProximityDrivingDiagnostics(
            data,
            resolvedTarget,
            resolvedSecondaries,
            threshold,
          )
        : undefined;
      if (cachedMetrics && cachedDiagnostics !== undefined) {
        const minutesById = new Map(
          cachedMetrics.map((row) => [row.id, row.minutes]),
        );
        const milesById = new Map(cachedMetrics.map((row) => [row.id, row.miles]));
        const matches = filterByDrivingMilesThreshold(
          resolvedSecondaries,
          milesById,
          minutesById,
          threshold.value,
        );
        completeSearch({
          metrics: cachedMetrics,
          matches,
          error: null,
          unroutedCount: cachedDiagnostics.unroutedCount,
          routingDiagnostics: cachedDiagnostics,
          duplicateCount: dedupedSecondaries.duplicateInputIds.length,
        });
        return;
      }

      const res = await fetch(BURKE_PROXIMITY_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          target: resolvedTarget,
          destinations: resolvedSecondaries,
          threshold,
        }),
      });

      const body: unknown = await res.json().catch(() => null);
      if (res.status === 401) {
        onUnauthorized?.();
        return;
      }

      if (!res.ok || !body || typeof body !== "object") {
        const message =
          body &&
          typeof body === "object" &&
          "error" in body &&
          typeof (body as { error: unknown }).error === "string"
            ? (body as { error: string }).error
            : "Could not compute driving distances.";
        completeSearch({
          error: message,
          matches: [],
          metrics: [],
          unroutedCount: 0,
          routingDiagnostics: null,
          duplicateCount: 0,
        });
        return;
      }

      if (!("matches" in body)) {
        completeSearch({
          error: "Could not compute driving distances.",
          matches: [],
          metrics: [],
          unroutedCount: 0,
          routingDiagnostics: null,
          duplicateCount: 0,
        });
        return;
      }

      const parsed = body as {
        matches: ProximityMatch[];
        metrics?: ProximityMatch[];
        unroutedCount?: number;
        duplicateCount?: number;
        diagnostics?: ProximityRoutingDiagnostics;
      };
      const metrics = Array.isArray(parsed.metrics)
        ? parsed.metrics
        : parsed.matches;
      const matches = parsed.matches;
      const diagnostics =
        parsed.diagnostics && typeof parsed.diagnostics === "object"
          ? parsed.diagnostics
          : null;
      completeSearch({
        metrics,
        matches,
        error: null,
        unroutedCount:
          typeof parsed.unroutedCount === "number"
            ? parsed.unroutedCount
            : diagnostics?.unroutedCount ?? 0,
        routingDiagnostics: diagnostics,
        duplicateCount:
          typeof parsed.duplicateCount === "number"
            ? parsed.duplicateCount
            : dedupedSecondaries.duplicateInputIds.length,
      });
      setData((prev) =>
        mergeProximityMatchesIntoLocationFinderData(
          prev,
          resolvedTarget,
          resolvedSecondaries,
          threshold,
          matches,
          metrics,
          diagnostics,
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="mt-8 flex w-full flex-col gap-6 pb-4"
      onSubmit={onSubmit}
      noValidate
    >
      <AddressField
        id="location-finder-target"
        name="target"
        label="Target Location"
        value={target}
        onChange={setTarget}
        showStatusIcon
        required
      />

      <SecondaryJobLocationsEditor
        rows={secondaries}
        onChange={setSecondaries}
        targetFormatted={target.formatted}
        collapsed={secondariesCollapsed}
        onCollapsedChange={setSecondariesCollapseOverride}
      />

      <div className="location-finder-search-actions app-chrome__sticky-above-bottom flex flex-col gap-2">
        <div className="location-finder-search-panel">
          {overSecondaryLimit ? (
            <p
              className="location-finder-search-panel-alert text-sm text-red-700"
              role="alert"
            >
              At most {LOCATION_FINDER_MAX_SECONDARY_LOCATIONS} distinct locations
              per search ({dedupedSecondaries.unique.length} after removing
              duplicates).
            </p>
          ) : null}
          <div className="location-finder-search-panel-row">
            <DistanceThresholdControl
              layout="inline"
              value={threshold}
              onChange={setThreshold}
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className="location-finder-submit-btn"
            >
              {submitting ? "Finding…" : "Find locations"}
            </button>
          </div>
        </div>
      </div>

      {activeError ? (
        <p className="text-sm text-red-700" role="alert">
          {activeError}
        </p>
      ) : null}

      {showResults &&
      resolvedTarget &&
      activeSnapshot.matches !== null &&
      (activeSnapshot.metrics !== null ||
        activeSnapshot.routingDiagnostics !== null) ? (
        <LocationFinderResults
          matches={activeSnapshot.matches}
          target={resolvedTarget}
          secondaries={resolvedSecondaries}
          threshold={threshold}
          metrics={activeSnapshot.metrics ?? []}
          unroutedCount={activeSnapshot.unroutedCount}
          routingDiagnostics={activeSnapshot.routingDiagnostics}
          duplicateCount={activeSnapshot.duplicateCount}
          modeLabel={modeResultsLabel(threshold.unit)}
        />
      ) : null}
    </form>
  );
}

/** Remount form when Location Finder localStorage cache is cleared. */
export function LocationFinderFormWithStorageReset(
  props: LocationFinderFormProps,
) {
  const { resetNonce } = useLocationFinderStorage();
  return <LocationFinderForm key={resetNonce} {...props} />;
}
