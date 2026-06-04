"use client";

import { useMemo, useState } from "react";

import {
  OFF_ROAD_SNAP_METERS,
  routingLegFailureHint,
  routingLegFailureMessage,
  type ProximityRoutingDiagnostics,
  type RoutingLegFailureCode,
} from "@/lib/burke";

const FAILURE_CODE_ORDER: RoutingLegFailureCode[] = [
  "no_road_route",
  "null_duration",
  "null_distance",
  "invalid_duration",
  "invalid_distance",
];

const UNROUTED_TABLE_LIMIT = 30;

type DrivingRoutingDiagnosticsPanelProps = {
  diagnostics: ProximityRoutingDiagnostics;
};

function formatSnap(meters: number | undefined): string {
  if (meters === undefined || !Number.isFinite(meters)) {
    return "—";
  }
  if (meters < 1) {
    return "<1 m";
  }
  return `${Math.round(meters)} m`;
}

export function DrivingRoutingDiagnosticsPanel({
  diagnostics,
}: DrivingRoutingDiagnosticsPanelProps) {
  const [showAllUnrouted, setShowAllUnrouted] = useState(false);

  const failureRows = useMemo(
    () =>
      FAILURE_CODE_ORDER.filter(
        (code) => (diagnostics.failureCounts[code] ?? 0) > 0,
      ).map((code) => ({
        code,
        count: diagnostics.failureCounts[code] ?? 0,
        message: routingLegFailureMessage(code),
      })),
    [diagnostics.failureCounts],
  );

  const unroutedPreview = showAllUnrouted
    ? diagnostics.unrouted
    : diagnostics.unrouted.slice(0, UNROUTED_TABLE_LIMIT);

  const { likelyRootCause } = diagnostics;

  return (
    <div
      className="flex flex-col gap-4 rounded-md border border-amber-200/80 bg-amber-50/80 px-3 py-3 text-sm text-amber-950"
      role="region"
      aria-label="Driving distance diagnostics"
    >
      <p className="font-medium text-amber-950">{likelyRootCause.title}</p>

      <p className="text-xs text-amber-900/85">
        Target: {diagnostics.target.formatted}
        <span className="ml-2 tabular-nums text-amber-800/75">
          ({diagnostics.target.lat.toFixed(5)}, {diagnostics.target.lon.toFixed(5)})
        </span>
      </p>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-amber-800/80">Routed</dt>
          <dd className="font-medium tabular-nums">
            {diagnostics.routedCount} / {diagnostics.submittedDestinationCount}
          </dd>
        </div>
        <div>
          <dt className="text-amber-800/80">No road route</dt>
          <dd className="font-medium tabular-nums">{diagnostics.unroutedCount}</dd>
        </div>
        <div>
          <dt className="text-amber-800/80">Target snap</dt>
          <dd className="font-medium tabular-nums">
            {formatSnap(diagnostics.targetSnapDistanceMeters)}
            {typeof diagnostics.targetSnapDistanceMeters === "number" &&
            diagnostics.targetSnapDistanceMeters > OFF_ROAD_SNAP_METERS ? (
              <span className="ml-1 text-amber-800">(high)</span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-amber-800/80">Max routed snap</dt>
          <dd className="font-medium tabular-nums">
            {formatSnap(diagnostics.maxRoutedSnapMeters)}
          </dd>
        </div>
      </dl>

      {failureRows.length > 0 ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-amber-800/90">
            Failure breakdown
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {failureRows.map((row) => (
              <li key={row.code} className="text-amber-900/90">
                <span className="font-medium tabular-nums">{row.count}×</span>{" "}
                {row.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {diagnostics.unrouted.length > 0 ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-amber-800/90">
            Unrouted locations
          </p>
          <div className="mt-2 max-h-64 overflow-y-auto rounded border border-amber-200/60 bg-white/50">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-amber-100/90 text-amber-900">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Location</th>
                  <th className="px-2 py-1.5 font-medium">Straight mi</th>
                  <th className="px-2 py-1.5 font-medium">Snap</th>
                  <th className="px-2 py-1.5 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {unroutedPreview.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-amber-100/80 text-amber-950"
                  >
                    <td className="max-w-[12rem] truncate px-2 py-1.5" title={row.formatted}>
                      {row.formatted}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {row.straightLineMiles.toFixed(1)}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {formatSnap(row.failure.snapDistanceMeters)}
                    </td>
                    <td className="px-2 py-1.5">
                      <span title={routingLegFailureHint(row.failure.code)}>
                        {routingLegFailureMessage(row.failure.code)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {diagnostics.unrouted.length > UNROUTED_TABLE_LIMIT ? (
            <button
              type="button"
              className="mt-2 text-xs font-medium text-amber-900 underline-offset-2 hover:underline"
              onClick={() => setShowAllUnrouted((v) => !v)}
            >
              {showAllUnrouted
                ? "Show fewer"
                : `Show all ${diagnostics.unrouted.length} unrouted`}
            </button>
          ) : null}
        </div>
      ) : null}

    </div>
  );
}
