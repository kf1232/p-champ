import { normalizeGeocodeQuery } from "./geocodeCache";
import { isCountryOnlyGeocodeCorrection } from "./geocodeCountryOnlyCorrection";
import { emptyAddressFieldValue } from "./addressFieldValue";
import type {
  AddressFieldValue,
  GeocodeResponse,
  GeocodeRowApplyResult,
  GeocodeSuggestion,
} from "./types";

function shouldAutoPickSuggestion(
  userInput: string,
  suggestion: GeocodeSuggestion,
): boolean {
  return (
    isCountryOnlyGeocodeCorrection(userInput, suggestion.formatted) ||
    isCountryOnlyGeocodeCorrection(userInput, suggestion.displayName)
  );
}

function suggestionMatchesCanonicalInput(
  userInput: string,
  suggestion: GeocodeSuggestion,
): boolean {
  return (
    normalizeGeocodeQuery(suggestion.formatted) ===
    normalizeGeocodeQuery(userInput)
  );
}

function selectAutoPickSuggestion(
  userInput: string,
  response: GeocodeResponse,
): GeocodeSuggestion | null {
  if (response.status === "found" && response.match) {
    return response.match;
  }

  for (const suggestion of response.suggestions) {
    if (suggestionMatchesCanonicalInput(userInput, suggestion)) {
      return suggestion;
    }
  }

  const top = response.suggestions[0];
  if (top && shouldAutoPickSuggestion(userInput, top)) {
    return top;
  }

  return null;
}

function suggestionToFieldValue(
  suggestion: GeocodeSuggestion,
): AddressFieldValue {
  return {
    query: suggestion.formatted,
    formatted: suggestion.formatted,
    placeId: suggestion.placeId,
    lat: suggestion.lat,
    lon: suggestion.lon,
  };
}

/** Apply a cached/API geocode response to a row query (used for bulk import). */
export function applyGeocodeResponseToRow(
  query: string,
  response: GeocodeResponse | null,
): GeocodeRowApplyResult {
  const trimmed = query.trim();
  const base = trimmed
    ? { ...emptyAddressFieldValue(), query: trimmed }
    : emptyAddressFieldValue();

  if (!response || trimmed.length < 3) {
    return { value: base, status: "idle" };
  }

  const pick = selectAutoPickSuggestion(trimmed, response);
  if (pick) {
    return {
      value: suggestionToFieldValue(pick),
      status: "success",
    };
  }

  if (response.suggestions.length > 0) {
    return { value: base, status: "warning" };
  }

  return { value: base, status: "error" };
}
