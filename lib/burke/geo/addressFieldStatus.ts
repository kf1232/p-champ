import {
  ADDRESS_FIELD_MIN_QUERY_LENGTH,
  ADDRESS_STATUS_DISPLAY_ORDER,
  ADDRESS_STATUS_SECTION_LABELS,
} from "./constants";
import { normalizeGeocodeQuery } from "./geocodeCache";
import { isAddressResolved } from "./addressFieldValue";
import type {
  AddressFieldStatus,
  AddressFieldValue,
  AddressStatusCounts,
  AddressStatusDisplayKey,
  SecondaryRowStatusSection,
} from "./types";

export function deriveAddressFieldStatus(
  value: AddressFieldValue,
  query: string,
  suggestionsCount: number,
  lookupSettled: boolean,
): AddressFieldStatus {
  if (isAddressResolved(value)) {
    return "success";
  }

  const trimmed = query.trim();
  if (
    trimmed.length >= ADDRESS_FIELD_MIN_QUERY_LENGTH &&
    value.formatted !== null &&
    value.placeId !== null &&
    value.lat !== null &&
    value.lon !== null &&
    normalizeGeocodeQuery(trimmed) === normalizeGeocodeQuery(value.formatted)
  ) {
    return "success";
  }

  if (trimmed.length < ADDRESS_FIELD_MIN_QUERY_LENGTH) {
    return "idle";
  }

  if (!lookupSettled) {
    return "idle";
  }

  if (suggestionsCount > 0) {
    return "warning";
  }

  return "error";
}

/** Row already geocoded (e.g. bulk import) — skip pending-idle UI. */
export function isLookupSettledForRow(
  value: AddressFieldValue,
  rowStatus?: AddressFieldStatus,
): boolean {
  return (
    isAddressResolved(value) ||
    (rowStatus !== undefined && rowStatus !== "idle")
  );
}

/** Avoid parent updates / setState loops during hydration. */
export function shouldEmitAddressFieldStatusChange(
  nextStatus: AddressFieldStatus,
  lastEmitted: AddressFieldStatus | null,
  rowStatus?: AddressFieldStatus,
  options?: { lookupSettled: boolean },
): boolean {
  if (nextStatus === lastEmitted) {
    return false;
  }
  if (rowStatus !== undefined && rowStatus === nextStatus) {
    return false;
  }
  if (
    rowStatus !== undefined &&
    rowStatus !== "idle" &&
    nextStatus === "idle" &&
    options?.lookupSettled === false
  ) {
    return false;
  }
  return true;
}

export function countAddressStatuses(
  rows: { status: AddressFieldStatus }[],
): AddressStatusCounts {
  const counts: AddressStatusCounts = { success: 0, warning: 0, error: 0 };
  for (const row of rows) {
    if (row.status === "success") {
      counts.success += 1;
    } else if (row.status === "warning") {
      counts.warning += 1;
    } else if (row.status === "error") {
      counts.error += 1;
    }
  }
  return counts;
}

/** Status for UI counts/icons: resolved rows are always success. */
export function effectiveAddressFieldStatus(
  value: AddressFieldValue,
  reportedStatus: AddressFieldStatus,
): AddressFieldStatus {
  if (isAddressResolved(value)) {
    return "success";
  }
  return reportedStatus;
}

export function groupSecondaryRowsByEffectiveStatus<
  T extends { value: AddressFieldValue; status: AddressFieldStatus },
>(rows: T[]): SecondaryRowStatusSection<T>[] {
  const buckets: Record<AddressStatusDisplayKey | "idle", T[]> = {
    warning: [],
    error: [],
    success: [],
    idle: [],
  };

  for (const row of rows) {
    const status = effectiveAddressFieldStatus(row.value, row.status);
    if (status === "idle") {
      buckets.idle.push(row);
    } else {
      buckets[status].push(row);
    }
  }

  const sections: SecondaryRowStatusSection<T>[] =
    ADDRESS_STATUS_DISPLAY_ORDER.map((key) => ({
      key,
      label: ADDRESS_STATUS_SECTION_LABELS[key],
      rows: buckets[key],
    })).filter((section) => section.rows.length > 0);

  if (buckets.idle.length > 0) {
    sections.push({ key: "idle", label: null, rows: buckets.idle });
  }

  return sections;
}
