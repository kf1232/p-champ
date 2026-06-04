/** Single-address geocode API query parameter name. */
export const BURKE_GEOCODE_QUERY_PARAM = "address";

export const BURKE_GEOCODE_BATCH_API_PATH = "/api/burke/geocode/batch";

/** Max addresses per batch API request. */
export const BURKE_GEOCODE_BATCH_MAX = 100;

/** Client sends smaller batches to avoid gateway timeouts. */
export const BURKE_GEOCODE_CLIENT_BATCH_SIZE = 12;

/** Google Geocoding API (server key only — never expose in the client). */
export const GOOGLE_GEOCODE_API_URL =
  "https://maps.googleapis.com/maps/api/geocode/json";

/** Parallel lookups during bulk import. */
export const GOOGLE_GEOCODE_BATCH_CONCURRENCY = 8;

/** Client batch prefetch retry delay (ms). */
export const BURKE_GEOCODE_BATCH_RETRY_MS = 2000;

/** Merge concurrent autocomplete lookups into one batch request. */
export const BURKE_GEOCODE_LOOKUP_COALESCE_MS = 50;

/** Minimum query length before address autocomplete / status validation runs. */
export const ADDRESS_FIELD_MIN_QUERY_LENGTH = 5;

import type { AddressStatusDisplayKey } from "./types";

/** Display order for status sections and header counters (problems first). */
export const ADDRESS_STATUS_DISPLAY_ORDER: readonly AddressStatusDisplayKey[] =
  ["warning", "error", "success"];

export const ADDRESS_STATUS_SECTION_LABELS: Record<
  AddressStatusDisplayKey,
  string
> = {
  warning: "Select from list",
  error: "Not found",
  success: "Confirmed",
};
