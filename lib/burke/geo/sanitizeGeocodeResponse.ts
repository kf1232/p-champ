import { stripTrailingCountry } from "./geocodeCountryOnlyCorrection";
import type { GeocodeResponse, GeocodeSuggestion } from "./types";

function sanitizeSuggestion(row: GeocodeSuggestion): GeocodeSuggestion {
  const formatted = stripTrailingCountry(row.formatted);
  return {
    ...row,
    formatted,
    displayName: formatted,
  };
}

/** Normalize cached/API geocode rows so formatted lines omit trailing country. */
export function sanitizeGeocodeResponse(
  response: GeocodeResponse,
): GeocodeResponse {
  const suggestions = response.suggestions.map(sanitizeSuggestion);
  const match = response.match ? sanitizeSuggestion(response.match) : null;
  let status = response.status;
  if (match && suggestions.length === 1) {
    status = "found";
  } else if (suggestions.length >= 1 && status === "not_found") {
    status = suggestions.length === 1 ? "found" : "ambiguous";
  }
  return {
    ...response,
    status,
    match: match ?? (suggestions.length === 1 ? suggestions[0]! : null),
    suggestions,
  };
}
