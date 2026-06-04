import { stripTrailingCountry } from "./geocodeCountryOnlyCorrection";
import type {
  AddressParts,
  FormatAddressOptions,
  GeocodeSearchRow,
  GeocodeSuggestion,
} from "./types";

function formatAddressFromParts(
  parts: AddressParts | undefined,
  fallbackDisplayName: string,
  options: FormatAddressOptions = {},
): string {
  const includeCountry = options.includeCountry === true;

  if (!parts || Object.keys(parts).length === 0) {
    const fallback = fallbackDisplayName.trim();
    return includeCountry ? fallback : stripTrailingCountry(fallback);
  }

  const street = [parts.house_number, parts.road ?? parts.pedestrian]
    .filter(Boolean)
    .join(" ")
    .trim();

  const locality =
    parts.city ??
    parts.town ??
    parts.village ??
    parts.municipality ??
    parts.hamlet ??
    parts.suburb;

  const region = parts.state ?? parts.region ?? parts.state_district;
  const postal = parts.postcode;

  const line = [
    street,
    parts.neighbourhood ?? parts.quarter,
    locality,
    region,
    postal,
    includeCountry ? parts.country : undefined,
  ]
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter((s) => s.length > 0);

  if (line.length === 0) {
    const fallback = fallbackDisplayName.trim();
    return includeCountry ? fallback : stripTrailingCountry(fallback);
  }

  return line.join(", ");
}

export function toGeocodeSuggestion(row: GeocodeSearchRow): GeocodeSuggestion {
  const formatted = formatAddressFromParts(row.address, row.display_name);
  return {
    placeId: String(row.place_id),
    formatted,
    lat: Number(row.lat),
    lon: Number(row.lon),
    displayName: formatted,
  };
}