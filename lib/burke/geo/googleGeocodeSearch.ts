import { GOOGLE_GEOCODE_API_URL } from "./constants";
import type {
  AddressParts,
  GeocodeSearchRow,
  GoogleAddressComponent,
  GoogleGeocodeResponse,
  GoogleGeocodeResult,
} from "./types";

export function geoGoogleMapsApiKey(): string | null {
  const key = process.env.BURKE_GOOGLE_MAPS_API_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

function component(
  components: GoogleAddressComponent[],
  type: string,
): GoogleAddressComponent | undefined {
  return components.find((c) => c.types.includes(type));
}

function googleComponentsToAddressParts(
  components: GoogleAddressComponent[] | undefined,
): AddressParts | undefined {
  if (!components?.length) {
    return undefined;
  }

  const streetNumber = component(components, "street_number");
  const route = component(components, "route");
  const locality =
    component(components, "locality") ??
    component(components, "postal_town") ??
    component(components, "sublocality");
  const state = component(components, "administrative_area_level_1");
  const postal = component(components, "postal_code");
  const country = component(components, "country");

  const parts: AddressParts = {};
  if (streetNumber) {
    parts.house_number = streetNumber.long_name;
  }
  if (route) {
    parts.road = route.long_name;
  }
  if (locality) {
    parts.city = locality.long_name;
  }
  if (state) {
    parts.state = state.long_name;
  }
  if (postal) {
    parts.postcode = postal.long_name;
  }
  if (country) {
    parts.country = country.long_name;
  }

  return Object.keys(parts).length > 0 ? parts : undefined;
}

function toGeocodeSearchRow(row: GoogleGeocodeResult): GeocodeSearchRow {
  const { lat, lng } = row.geometry.location;
  return {
    place_id: row.place_id,
    lat: String(lat),
    lon: String(lng),
    display_name: row.formatted_address,
    address: googleComponentsToAddressParts(row.address_components),
  };
}

/** Forward geocode via Google Geocoding API (requires `BURKE_GOOGLE_MAPS_API_KEY`). */
export async function searchGoogleGeocode(
  query: string,
  fetchImpl: typeof fetch = fetch,
): Promise<GeocodeSearchRow[]> {
  const trimmed = query.trim();
  const key = geoGoogleMapsApiKey();
  if (!trimmed || !key) {
    return [];
  }

  const params = new URLSearchParams({
    address: trimmed,
    key,
  });

  const res = await fetchImpl(`${GOOGLE_GEOCODE_API_URL}?${params}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const body: unknown = await res.json().catch(() => null);
  if (!res.ok || !body || typeof body !== "object") {
    return [];
  }

  const data = body as GoogleGeocodeResponse;
  if (data.status === "ZERO_RESULTS" || !data.results?.length) {
    return [];
  }

  if (data.status !== "OK") {
    return [];
  }

  return data.results.slice(0, 5).map(toGeocodeSearchRow);
}
