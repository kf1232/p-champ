import { emptyAddressFieldValue } from "../../geo/addressFieldValue";
import type { AddressFieldStatus, AddressFieldValue } from "../../geo/types";
import {
  isDrivingDistanceUnit,
  normalizeDistanceUnit,
} from "../distance/distanceUnit";
import type { ProximityRoutingDiagnostics } from "../distance/routingDiagnostics";
import type { DistanceThreshold, ProximityMatch } from "../distance/types";
import { INITIAL_SECONDARY_ROW_ID } from "../secondaryRowId";

import { LOCATION_FINDER_FORM_DRAFT_KEY } from "./locationFinderCacheKeys";
import type { LocationFinderStoredData } from "./types";

export type StoredSecondaryRow = {
  id: string;
  value: AddressFieldValue;
  status: AddressFieldStatus;
};

/** Per-mode proximity results; never mix straight-line with driving in one blob. */
export type LocationFinderProximitySnapshot = {
  matches: ProximityMatch[] | null;
  proximityMetrics: ProximityMatch[] | null;
  unroutedCount?: number;
  proximityError?: string | null;
  routingDiagnostics?: ProximityRoutingDiagnostics | null;
  /** Secondary rows that shared coordinates with an earlier row in the same search. */
  duplicateCount?: number;
  inputsSnapshot?: string | null;
};

export type LocationFinderFormDraft = {
  target: AddressFieldValue;
  secondaries: StoredSecondaryRow[];
  threshold: DistanceThreshold;
  straightLine: LocationFinderProximitySnapshot;
  driving: LocationFinderProximitySnapshot;
};

function emptyProximitySnapshot(): LocationFinderProximitySnapshot {
  return {
    matches: null,
    proximityMetrics: null,
    unroutedCount: 0,
    proximityError: null,
    inputsSnapshot: null,
  };
}

function isAddressFieldValue(value: unknown): value is AddressFieldValue {
  if (!value || typeof value !== "object") {
    return false;
  }
  const o = value as AddressFieldValue;
  return (
    typeof o.query === "string" &&
    (o.formatted === null || typeof o.formatted === "string") &&
    (o.placeId === null || typeof o.placeId === "string") &&
    (o.lat === null || typeof o.lat === "number") &&
    (o.lon === null || typeof o.lon === "number")
  );
}

function isAddressFieldStatus(value: unknown): value is AddressFieldStatus {
  return (
    value === "idle" ||
    value === "success" ||
    value === "warning" ||
    value === "error"
  );
}

function isDistanceThreshold(value: unknown): value is DistanceThreshold {
  if (!value || typeof value !== "object") {
    return false;
  }
  const o = value as DistanceThreshold;
  return (
    typeof o.value === "number" &&
    Number.isFinite(o.value) &&
    (o.unit === "miles" ||
      o.unit === "drivingMiles" ||
      o.unit === "minutes")
  );
}

function isProximityMatch(value: unknown): value is ProximityMatch {
  if (!value || typeof value !== "object") {
    return false;
  }
  const o = value as ProximityMatch;
  return (
    typeof o.id === "string" &&
    typeof o.formatted === "string" &&
    typeof o.miles === "number" &&
    typeof o.minutes === "number"
  );
}

function isProximitySnapshot(value: unknown): value is LocationFinderProximitySnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }
  const o = value as LocationFinderProximitySnapshot;
  if (
    o.matches !== null &&
    o.matches !== undefined &&
    (!Array.isArray(o.matches) || !o.matches.every(isProximityMatch))
  ) {
    return false;
  }
  if (
    o.proximityMetrics !== null &&
    o.proximityMetrics !== undefined &&
    (!Array.isArray(o.proximityMetrics) ||
      !o.proximityMetrics.every(isProximityMatch))
  ) {
    return false;
  }
  return true;
}

function isLegacyFormDraft(value: unknown): value is {
  target: AddressFieldValue;
  secondaries: StoredSecondaryRow[];
  threshold: DistanceThreshold;
  results?: ProximityMatch[] | null;
  proximityMetrics?: ProximityMatch[] | null;
  unroutedCount?: number;
  proximityError?: string | null;
} {
  if (!value || typeof value !== "object") {
    return false;
  }
  const o = value as Record<string, unknown>;
  if (!isAddressFieldValue(o.target) || !isDistanceThreshold(o.threshold)) {
    return false;
  }
  if (!Array.isArray(o.secondaries)) {
    return false;
  }
  return true;
}

function legacyInputsSnapshot(
  target: AddressFieldValue,
  secondaries: StoredSecondaryRow[],
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

type LegacyFormDraft = {
  target: AddressFieldValue;
  secondaries: StoredSecondaryRow[];
  threshold: DistanceThreshold;
  results?: ProximityMatch[] | null;
  proximityMetrics?: ProximityMatch[] | null;
  unroutedCount?: number;
  proximityError?: string | null;
};

function migrateLegacyDraft(raw: LegacyFormDraft): LocationFinderFormDraft {
  const unit = normalizeDistanceUnit(raw.threshold.unit);
  const hasResults =
    raw.results != null || raw.proximityMetrics != null;
  const legacySnapshot: LocationFinderProximitySnapshot = {
    matches: raw.results ?? null,
    proximityMetrics: raw.proximityMetrics ?? null,
    unroutedCount:
      typeof raw.unroutedCount === "number" ? raw.unroutedCount : 0,
    proximityError:
      typeof raw.proximityError === "string" ? raw.proximityError : null,
    inputsSnapshot: hasResults
      ? legacyInputsSnapshot(raw.target, raw.secondaries)
      : null,
  };

  return {
    target: raw.target,
    secondaries: raw.secondaries,
    threshold: {
      value: raw.threshold.value,
      unit,
    },
    straightLine: isDrivingDistanceUnit(unit)
      ? emptyProximitySnapshot()
      : legacySnapshot,
    driving: isDrivingDistanceUnit(unit)
      ? legacySnapshot
      : emptyProximitySnapshot(),
  };
}

function readRawDraft(
  data: LocationFinderStoredData,
): unknown | null {
  return data[LOCATION_FINDER_FORM_DRAFT_KEY] ?? null;
}

function normalizeDraft(raw: unknown): LocationFinderFormDraft | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const o = raw as Record<string, unknown>;

  if (isLegacyFormDraft(raw) && !("straightLine" in o)) {
    return migrateLegacyDraft(raw as LegacyFormDraft);
  }

  if (
    !isAddressFieldValue(o.target) ||
    !isDistanceThreshold(o.threshold) ||
    !isProximitySnapshot(o.straightLine) ||
    !isProximitySnapshot(o.driving) ||
    !Array.isArray(o.secondaries)
  ) {
    return null;
  }

  for (const row of o.secondaries) {
    if (
      !row ||
      typeof row !== "object" ||
      typeof (row as StoredSecondaryRow).id !== "string" ||
      !isAddressFieldValue((row as StoredSecondaryRow).value) ||
      !isAddressFieldStatus((row as StoredSecondaryRow).status)
    ) {
      return null;
    }
  }

  return {
    target: o.target as AddressFieldValue,
    secondaries: o.secondaries as StoredSecondaryRow[],
    threshold: {
      value: (o.threshold as DistanceThreshold).value,
      unit: normalizeDistanceUnit((o.threshold as DistanceThreshold).unit),
    },
    straightLine: o.straightLine as LocationFinderProximitySnapshot,
    driving: o.driving as LocationFinderProximitySnapshot,
  };
}

export function readLocationFinderFormDraft(
  data: LocationFinderStoredData,
): LocationFinderFormDraft | null {
  return normalizeDraft(readRawDraft(data));
}

export function mergeFormDraftIntoLocationFinderData(
  prev: LocationFinderStoredData,
  draft: LocationFinderFormDraft,
): LocationFinderStoredData {
  return {
    ...prev,
    [LOCATION_FINDER_FORM_DRAFT_KEY]: draft,
  };
}

export function defaultLocationFinderFormDraft(): LocationFinderFormDraft {
  return {
    target: emptyAddressFieldValue(),
    secondaries: [
      {
        id: INITIAL_SECONDARY_ROW_ID,
        value: emptyAddressFieldValue(),
        status: "idle",
      },
    ],
    threshold: { value: 25, unit: "miles" },
    straightLine: emptyProximitySnapshot(),
    driving: emptyProximitySnapshot(),
  };
}
