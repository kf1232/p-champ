export type GeocodeSuggestion = {
  placeId: string;
  formatted: string;
  lat: number;
  lon: number;
  displayName: string;
};

export type GeocodeStatus = "found" | "ambiguous" | "not_found";

export type GeocodeResponse = {
  query: string;
  status: GeocodeStatus;
  match: GeocodeSuggestion | null;
  suggestions: GeocodeSuggestion[];
};

/** Parsed row from Google Geocoding API before mapping to suggestions. */
export type AddressParts = Record<string, string>;

export type GeocodeSearchRow = {
  place_id: number | string;
  lat: string;
  lon: string;
  display_name: string;
  address?: AddressParts;
};

export type ResolveAddressOptions = {
  /** Skip extra fallback searches (faster for bulk import). */
  skipFallbacks?: boolean;
  /** Bypass read/write cache (single live lookups). */
  useCache?: boolean;
};

export type AddressFieldValue = {
  query: string;
  formatted: string | null;
  placeId: string | null;
  lat: number | null;
  lon: number | null;
};

export type AddressFieldStatus = "idle" | "success" | "warning" | "error";

export type AddressStatusCounts = {
  success: number;
  warning: number;
  error: number;
};

export type AddressStatusDisplayKey = "warning" | "error" | "success";

export type SecondaryRowStatusSection<T> = {
  key: AddressStatusDisplayKey | "idle";
  label: string | null;
  rows: T[];
};

export type GeocodeRowApplyResult = {
  value: AddressFieldValue;
  status: AddressFieldStatus;
};

export type FormatAddressOptions = {
  /** When false (default), country is omitted from stored/display lines. */
  includeCountry?: boolean;
};

export type GeocodeCacheEntry = {
  result: GeocodeResponse;
  expiresAt: number;
};

/** Google Geocoding API `address_components` entry (server-only). */
export type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

/** Google Geocoding API result row (server-only). */
export type GoogleGeocodeResult = {
  place_id: string;
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
  address_components?: GoogleAddressComponent[];
};

/** Google Geocoding API JSON body (server-only). */
export type GoogleGeocodeResponse = {
  status: string;
  results?: GoogleGeocodeResult[];
  error_message?: string;
};
