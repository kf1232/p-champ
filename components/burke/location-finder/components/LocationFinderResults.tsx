"use client";

import { useCallback, useMemo, useState } from "react";

import {
  hasDrivingRoutingIssues,
  isDrivingDistanceUnit,
  type DistanceThreshold,
  ProximityMarkerTier,
  ProximityMatch,
  ProximityRoutingDiagnostics,
  ResolvedLocation,
} from "@/lib/burke";

import {
  pinIdsForMapTier,
  resultsListRows,
} from "../utils/mapListRows";
import { DrivingRoutingDiagnosticsOverlay } from "./DrivingRoutingDiagnosticsOverlay";
import { LocationFinderMap } from "./location-finder-map/LocationFinderMap";
import { LocationFinderMapLegend } from "./location-finder-map/LocationFinderMapLegend";

type LocationFinderResultsProps = {
  threshold: DistanceThreshold;
  matches: ProximityMatch[];
  target: ResolvedLocation;
  secondaries: ResolvedLocation[];
  metrics: ProximityMatch[];
  modeLabel: string;
  unroutedCount?: number;
  routingDiagnostics?: ProximityRoutingDiagnostics | null;
  duplicateCount?: number;
};

function formatDistance(
  match: ProximityMatch,
  threshold: DistanceThreshold,
): string {
  const miles = `${match.miles.toFixed(1)} mi`;
  if (isDrivingDistanceUnit(threshold.unit) && match.minutes > 0) {
    return `${miles} (${Math.round(match.minutes)} min drive)`;
  }
  return miles;
}

export function LocationFinderResults({
  matches,
  target,
  secondaries,
  threshold,
  metrics,
  modeLabel,
  unroutedCount = 0,
  routingDiagnostics = null,
  duplicateCount = 0,
}: LocationFinderResultsProps) {
  const matchesKey = useMemo(
    () => matches.map((match) => match.id).join("\0"),
    [matches],
  );
  const [activePinIds, setActivePinIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [pinFilterKey, setPinFilterKey] = useState(matchesKey);
  if (pinFilterKey !== matchesKey) {
    setPinFilterKey(matchesKey);
    setActivePinIds(new Set());
  }

  const togglePin = useCallback((id: string) => {
    setActivePinIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearPinFilter = useCallback(() => {
    setActivePinIds(new Set());
  }, []);

  const selectLegendTier = useCallback(
    (tier: ProximityMarkerTier | "target") => {
      if (tier === "target") {
        clearPinFilter();
        return;
      }
      const tierIds = pinIdsForMapTier(metrics, threshold, tier);
      if (tierIds.length === 0) {
        return;
      }
      setActivePinIds((prev) => {
        const allSelected =
          tierIds.length === prev.size &&
          tierIds.every((id) => prev.has(id));
        return allSelected ? new Set() : new Set(tierIds);
      });
    },
    [metrics, threshold, clearPinFilter],
  );

  const listRows = useMemo(
    () => resultsListRows(matches, metrics, threshold, activePinIds),
    [matches, metrics, threshold, activePinIds],
  );

  const showMap = secondaries.length > 0 && metrics.length > 0;
  const pinFilterActive = activePinIds.size > 0;
  const showRoutingOverlay =
    routingDiagnostics !== null && hasDrivingRoutingIssues(routingDiagnostics);
  const showLegacyUnroutedNote =
    routingDiagnostics === null && unroutedCount > 0;

  return (
    <section
      className="mt-8 flex w-full min-w-0 flex-col gap-4 rounded-lg border border-border-subtle bg-surface-overlay px-4 py-3"
      aria-label={`Proximity results, ${modeLabel}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-tertiary">
        {modeLabel}
      </p>

      {duplicateCount > 0 ? (
        <p className="text-sm text-secondary">
          {duplicateCount}{" "}
          {duplicateCount === 1
            ? "duplicate location was"
            : "duplicate locations were"}{" "}
          merged with an earlier row (same coordinates).
        </p>
      ) : null}

      {showRoutingOverlay && !showMap ? (
        <div className="flex flex-col gap-1">
          <DrivingRoutingDiagnosticsOverlay
            diagnostics={routingDiagnostics}
            placement="inline"
          />
          <p className="text-xs text-tertiary">
            No locations could be mapped. Hover or click the badge for routing
            details.
          </p>
        </div>
      ) : null}

      {showMap ? (
        <div className="location-finder-map-wrap">
          {showRoutingOverlay ? (
            <DrivingRoutingDiagnosticsOverlay
              diagnostics={routingDiagnostics}
              placement="map"
            />
          ) : null}
          <LocationFinderMap
            target={target}
            secondaries={secondaries}
            threshold={threshold}
            metrics={metrics}
            activePinIds={activePinIds}
            onPinToggle={togglePin}
            onClearSelection={clearPinFilter}
          />
          <LocationFinderMapLegend
            metrics={metrics}
            threshold={threshold}
            activePinIds={activePinIds}
            onTierSelect={selectLegendTier}
          />
          <p className="mt-2 text-xs text-tertiary">
            Click a pin or legend color to filter the list. Click again to
            clear.
            {showRoutingOverlay
              ? " Hover or click the unrouted badge on the map for routing details."
              : null}
          </p>
        </div>
      ) : showLegacyUnroutedNote ? (
        <p className="text-sm text-amber-800">
          {unroutedCount}{" "}
          {unroutedCount === 1
            ? "location has no driving route"
            : "locations have no driving route"}{" "}
          (omitted from map and results).
        </p>
      ) : null}

      {pinFilterActive ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-secondary">
            Showing {listRows.length} selected{" "}
            {listRows.length === 1 ? "location" : "locations"}
          </p>
          <button
            type="button"
            className="text-sm font-medium text-secondary underline-offset-2 hover:underline"
            onClick={clearPinFilter}
          >
            Show all in range
          </button>
        </div>
      ) : null}

      {!pinFilterActive && matches.length === 0 ? (
        <p className="text-sm text-secondary">No secondary locations in range.</p>
      ) : listRows.length === 0 ? (
        <p className="text-sm text-secondary">
          No locations match the selected pins.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {listRows.map((match) => (
            <li
              key={match.id}
              className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-primary"
            >
              <span>{match.formatted}</span>
              <span className="tabular-nums text-tertiary">
                {formatDistance(match, threshold)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
