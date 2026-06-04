"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BURKE_PROXIMITY_API_PATH } from "@/lib/burke/location-finder/distance/constants";
import {
  filterByMilesThreshold,
  isValidThreshold,
} from "@/lib/burke/location-finder/distance/filterByThreshold";
import type {
  DistanceThreshold,
  ProximityMatch,
  ResolvedLocation,
} from "@/lib/burke/location-finder/distance/types";
import {
  emptyAddressFieldValue,
  isAddressResolved,
} from "@/lib/burke/geo/addressFieldValue";
import type { AddressFieldValue } from "@/lib/burke/geo/types";
import {
  findStoredProximityMatches,
  mergeFormDraftIntoLocationFinderData,
  mergeProximityMatchesIntoLocationFinderData,
  readLocationFinderFormDraft,
  type LocationFinderFormDraft,
  type StoredSecondaryRow,
} from "@/lib/burke/location-finder/store";
import { VIEWPORT_LOCKED_FOOTER_H_PX } from "@/lib/viewportFooterChrome";

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
  const [threshold, setThreshold] = useState<DistanceThreshold>(
    () => savedDraft?.threshold ?? { value: 25, unit: "miles" },
  );
  const [results, setResults] = useState<ProximityMatch[] | null>(
    () => savedDraft?.results ?? null,
  );
  const [secondariesCollapsed, setSecondariesCollapsed] = useState(
    () => savedDraft?.results != null,
  );
  const [submitting, setSubmitting] = useState(false);
  const resultsInputsSnapshotRef = useRef<string | null>(null);

  useEffect(() => {
    const current = locationInputsSnapshot(target, secondaries);

    if (results === null) {
      resultsInputsSnapshotRef.current = null;
      return;
    }

    if (resultsInputsSnapshotRef.current === null) {
      resultsInputsSnapshotRef.current = current;
      return;
    }

    if (current !== resultsInputsSnapshotRef.current) {
      setResults(null);
      resultsInputsSnapshotRef.current = null;
      setSecondariesCollapsed(false);
    }
  }, [target, secondaries, results]);

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
        results,
      };
      setData((prev) => mergeFormDraftIntoLocationFinderData(prev, draft));
    }, 400);
    return () => window.clearTimeout(handle);
  }, [target, secondaries, threshold, results, setData]);

  const resolvedTarget = useMemo(() => toResolved("target", target), [target]);

  const resolvedSecondaries = useMemo(
    () =>
      secondaries
        .map((row) => toResolved(row.id, row.value))
        .filter((row): row is ResolvedLocation => row !== null),
    [secondaries],
  );

  const canSubmit =
    resolvedTarget !== null &&
    resolvedSecondaries.length > 0 &&
    isValidThreshold(threshold) &&
    !submitting;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || !resolvedTarget) {
      return;
    }

    setSubmitting(true);
    setResults(null);

    try {
      if (threshold.unit === "miles") {
        const matches = filterByMilesThreshold(
          resolvedTarget,
          resolvedSecondaries,
          threshold.value,
        );
        setResults(matches);
        setSecondariesCollapsed(true);
        setData((prev) =>
          mergeProximityMatchesIntoLocationFinderData(
            prev,
            resolvedTarget,
            resolvedSecondaries,
            threshold,
            matches,
          ),
        );
        return;
      }

      const cached = findStoredProximityMatches(
        data,
        resolvedTarget,
        resolvedSecondaries,
        threshold,
      );
      if (cached) {
        setResults(cached);
        setSecondariesCollapsed(true);
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

      if (!res.ok || !body || typeof body !== "object" || !("matches" in body)) {
        setResults([]);
        setSecondariesCollapsed(true);
        return;
      }

      const matches = (body as { matches: ProximityMatch[] }).matches;
      setResults(matches);
      setSecondariesCollapsed(true);
      setData((prev) =>
        mergeProximityMatchesIntoLocationFinderData(
          prev,
          resolvedTarget,
          resolvedSecondaries,
          threshold,
          matches,
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="mt-8 flex max-w-xl flex-col gap-6 pb-4"
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

      <DistanceThresholdControl value={threshold} onChange={setThreshold} />

      <SecondaryJobLocationsEditor
        rows={secondaries}
        onChange={setSecondaries}
        collapsed={secondariesCollapsed}
        onCollapsedChange={setSecondariesCollapsed}
      />

      <div
        className="sticky z-30 -mx-6 border-t border-black/10 bg-white/90 px-6 py-3 backdrop-blur"
        style={{ bottom: VIEWPORT_LOCKED_FOOTER_H_PX }}
      >
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-md border border-black/20 bg-white/80 px-4 py-2.5 text-sm font-medium text-black shadow-sm hover:border-black/30 hover:bg-white disabled:pointer-events-none disabled:opacity-40 sm:w-auto"
        >
          {submitting ? "Finding…" : "Find locations"}
        </button>
      </div>

      {results !== null ? (
        <LocationFinderResults unit={threshold.unit} matches={results} />
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
