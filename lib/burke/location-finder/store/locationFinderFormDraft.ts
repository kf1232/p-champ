import { emptyAddressFieldValue } from "@/lib/burke/geo/addressFieldValue";
import type { AddressFieldStatus, AddressFieldValue } from "@/lib/burke/geo/types";
import type {
  DistanceThreshold,
  ProximityMatch,
} from "@/lib/burke/location-finder/distance/types";
import { INITIAL_SECONDARY_ROW_ID } from "@/lib/burke/location-finder/secondaryRowId";

import { LOCATION_FINDER_FORM_DRAFT_KEY } from "./locationFinderCacheKeys";
import type { LocationFinderStoredData } from "./types";

export type StoredSecondaryRow = {
  id: string;
  value: AddressFieldValue;
  status: AddressFieldStatus;
};

export type LocationFinderFormDraft = {
  target: AddressFieldValue;
  secondaries: StoredSecondaryRow[];
  threshold: DistanceThreshold;
  results: ProximityMatch[] | null;
};

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
    (o.unit === "miles" || o.unit === "minutes")
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

function isFormDraft(value: unknown): value is LocationFinderFormDraft {
  if (!value || typeof value !== "object") {
    return false;
  }
  const o = value as LocationFinderFormDraft;
  if (!isAddressFieldValue(o.target) || !isDistanceThreshold(o.threshold)) {
    return false;
  }
  if (!Array.isArray(o.secondaries)) {
    return false;
  }
  for (const row of o.secondaries) {
    if (
      !row ||
      typeof row !== "object" ||
      typeof (row as StoredSecondaryRow).id !== "string" ||
      !isAddressFieldValue((row as StoredSecondaryRow).value) ||
      !isAddressFieldStatus((row as StoredSecondaryRow).status)
    ) {
      return false;
    }
  }
  if (
    o.results !== null &&
    (!Array.isArray(o.results) || !o.results.every(isProximityMatch))
  ) {
    return false;
  }
  return true;
}

export function readLocationFinderFormDraft(
  data: LocationFinderStoredData,
): LocationFinderFormDraft | null {
  const raw = data[LOCATION_FINDER_FORM_DRAFT_KEY];
  return isFormDraft(raw) ? raw : null;
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
    results: null,
  };
}
