import {
  LOCATION_FINDER_ALLOWED_DATA_KEYS,
  LOCATION_FINDER_TOOL_ID,
  type LocationFinderAllowedDataKey,
} from "./locationFinderCacheKeys";
import type { LocationFinderStoredData } from "./types";

/** Keep only Location Finder cache sections; drop any other keys. */
export function sanitizeLocationFinderStoredData(
  data: Record<string, unknown>,
): LocationFinderStoredData {
  const out: LocationFinderStoredData = {};
  for (const key of LOCATION_FINDER_ALLOWED_DATA_KEYS) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      out[key] = data[key as LocationFinderAllowedDataKey];
    }
  }
  return out;
}

export type LocationFinderCacheEnvelope = {
  v: 1;
  tool: typeof LOCATION_FINDER_TOOL_ID;
  storedAt: number;
  data: LocationFinderStoredData;
};

export function serializeLocationFinderCacheEnvelope(
  storedAt: number,
  data: LocationFinderStoredData,
): string {
  const envelope: LocationFinderCacheEnvelope = {
    v: 1,
    tool: LOCATION_FINDER_TOOL_ID,
    storedAt,
    data: sanitizeLocationFinderStoredData(data),
  };
  return JSON.stringify(envelope);
}

/** Download / inspect: tool id, storage key, and scoped data only. */
export function formatLocationFinderCacheExport(
  storedAt: number | null,
  data: LocationFinderStoredData,
  storageKey: string,
): string {
  if (storedAt === null) {
    return JSON.stringify(
      {
        tool: LOCATION_FINDER_TOOL_ID,
        storageKey,
        message: "No active Location Finder cache (empty or expired TTL).",
      },
      null,
      2,
    );
  }

  return JSON.stringify(
    {
      tool: LOCATION_FINDER_TOOL_ID,
      storageKey,
      storedAt,
      data: sanitizeLocationFinderStoredData(data),
    },
    null,
    2,
  );
}
