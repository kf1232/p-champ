/** Normalize whitespace for comparing user input to geocoder suggestions. */
export function normalizeAddressCompareString(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

const COUNTRY_SUFFIX_PATTERN =
  /^,?\s*(USA|U\.?S\.?A\.?|United States(?: of America)?|US)\s*$/i;

/** True when `remainder` looks like a single trailing country name (no street/postal digits). */
export function isLikelyCountrySuffix(remainder: string): boolean {
  const trimmed = remainder.trim();
  if (!trimmed) {
    return false;
  }
  if (COUNTRY_SUFFIX_PATTERN.test(trimmed)) {
    return true;
  }
  const withoutComma = trimmed.replace(/^,\s*/, "").trim();
  if (!withoutComma || /\d/.test(withoutComma)) {
    return false;
  }
  return /^[A-Za-z][A-Za-z\s.\-'()]{0,58}[A-Za-z.]?$/.test(withoutComma);
}

/** Remove a trailing ", USA" / ", United States" style segment when present. */
export function stripTrailingCountry(formatted: string): string {
  const normalized = normalizeAddressCompareString(formatted);
  const lastComma = normalized.lastIndexOf(",");
  if (lastComma < 0) {
    return normalized;
  }
  const tail = normalized.slice(lastComma);
  if (!isLikelyCountrySuffix(tail)) {
    return normalized;
  }
  return normalized.slice(0, lastComma).trim();
}

/**
 * True when the suggestion equals the user input with only a country appended
 * (e.g. "…29201" → "…29201, USA"), compared with or without the country segment.
 */
export function isCountryOnlyGeocodeCorrection(
  userInput: string,
  suggestionFormatted: string,
): boolean {
  const user = normalizeAddressCompareString(userInput);
  const suggestion = normalizeAddressCompareString(suggestionFormatted);
  if (!user || !suggestion) {
    return false;
  }
  if (user.toLowerCase() === suggestion.toLowerCase()) {
    return true;
  }

  const userKey = user.toLowerCase();
  const coreKey = stripTrailingCountry(suggestion).toLowerCase();
  if (userKey === coreKey) {
    return true;
  }

  if (!suggestion.toLowerCase().startsWith(user.toLowerCase())) {
    return false;
  }
  const remainder = suggestion.slice(user.length);
  return isLikelyCountrySuffix(remainder);
}
