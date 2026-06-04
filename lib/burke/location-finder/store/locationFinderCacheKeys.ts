/** Identifies this cache blob as Burke Location Finder only (not WoW or other tools). */
export const LOCATION_FINDER_TOOL_ID = "burke-location-finder" as const;

export const LOCATION_FINDER_FOOTER_CLEAR_CONFIRM =
  "Clear all Location Finder cache? This removes saved addresses, geocode results, proximity results, and the form draft on this device.";

export const LOCATION_FINDER_GEOCODE_RESPONSES_KEY =
  "geocodeResponses" as const;

export const LOCATION_FINDER_PROXIMITY_RESULTS_KEY =
  "proximityResults" as const;

/** Driving routing diagnostics keyed like proximity metrics (per target + destinations + unit). */
export const LOCATION_FINDER_PROXIMITY_DIAGNOSTICS_KEY =
  "proximityDiagnostics" as const;

export const LOCATION_FINDER_FORM_DRAFT_KEY = "formDraft" as const;

/** Only these keys are read, written, sized, or exported for this tool. */
export const LOCATION_FINDER_ALLOWED_DATA_KEYS = [
  LOCATION_FINDER_GEOCODE_RESPONSES_KEY,
  LOCATION_FINDER_PROXIMITY_RESULTS_KEY,
  LOCATION_FINDER_PROXIMITY_DIAGNOSTICS_KEY,
  LOCATION_FINDER_FORM_DRAFT_KEY,
] as const;

export type LocationFinderAllowedDataKey =
  (typeof LOCATION_FINDER_ALLOWED_DATA_KEYS)[number];
