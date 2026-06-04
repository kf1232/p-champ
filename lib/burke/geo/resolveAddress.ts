import {
  getCachedGeocode,
  setCachedGeocode,
} from "./geocodeCache";
import { sanitizeGeocodeResponse } from "./sanitizeGeocodeResponse";
import { GOOGLE_GEOCODE_BATCH_CONCURRENCY } from "./constants";
import { toGeocodeSuggestion } from "./geocodeSuggestion";
import { searchGoogleGeocode } from "./googleGeocodeSearch";
import type {
  GeocodeResponse,
  GeocodeSuggestion,
  ResolveAddressOptions,
} from "./types";

/** Shorter queries to suggest when the full address has no match. */
function buildFallbackQueries(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const parts = trimmed
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const out: string[] = [];
  const seen = new Set<string>([trimmed.toLowerCase()]);

  const push = (q: string) => {
    const key = q.toLowerCase();
    if (q.length < 3 || seen.has(key)) {
      return;
    }
    seen.add(key);
    out.push(q);
  };

  if (parts.length >= 2) {
    push(parts.slice(-2).join(", "));
    push(parts[parts.length - 1]!);
  }

  const withoutLeadingNumber = trimmed.replace(/^\d+[\s-]+/, "").trim();
  if (withoutLeadingNumber !== trimmed) {
    push(withoutLeadingNumber);
  }

  return out;
}

function mergeSuggestions(
  target: GeocodeSuggestion[],
  rows: GeocodeSuggestion[],
  seen: Set<string>,
  max: number,
): void {
  for (const row of rows) {
    if (seen.has(row.placeId)) {
      continue;
    }
    seen.add(row.placeId);
    target.push(row);
    if (target.length >= max) {
      return;
    }
  }
}

export async function resolveAddressQuery(
  query: string,
  fetchImpl: typeof fetch = fetch,
  options: ResolveAddressOptions = {},
): Promise<GeocodeResponse> {
  const { skipFallbacks = false, useCache = true } = options;
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      query: trimmed,
      status: "not_found",
      match: null,
      suggestions: [],
    };
  }

  if (useCache) {
    const cached = getCachedGeocode(trimmed);
    if (cached) {
      return { ...cached, query: trimmed };
    }
  }

  const primary = await searchGoogleGeocode(trimmed, fetchImpl);
  if (primary.length >= 1) {
    const suggestions = primary.map(toGeocodeSuggestion);
    const response = sanitizeGeocodeResponse({
      query: trimmed,
      status: primary.length === 1 ? "found" : "ambiguous",
      match: primary.length === 1 ? suggestions[0]! : null,
      suggestions,
    });
    if (useCache) {
      setCachedGeocode(trimmed, response);
    }
    return response;
  }

  if (skipFallbacks) {
    const response: GeocodeResponse = {
      query: trimmed,
      status: "not_found",
      match: null,
      suggestions: [],
    };
    if (useCache) {
      setCachedGeocode(trimmed, response);
    }
    return response;
  }

  const seen = new Set<string>();
  const suggestions: GeocodeSuggestion[] = [];

  for (const fallback of buildFallbackQueries(trimmed)) {
    const rows = await searchGoogleGeocode(fallback, fetchImpl);
    mergeSuggestions(
      suggestions,
      rows.map(toGeocodeSuggestion),
      seen,
      5,
    );
    if (suggestions.length >= 5) {
      break;
    }
  }

  const response: GeocodeResponse = {
    query: trimmed,
    status: "not_found",
    match: null,
    suggestions,
  };
  if (useCache) {
    setCachedGeocode(trimmed, response);
  }
  return response;
}

/** Bulk resolve with parallel Google lookups; cache hits are instant. */
export async function resolveAddressQueries(
  queries: string[],
  fetchImpl: typeof fetch = fetch,
  options: ResolveAddressOptions = {},
): Promise<Record<string, GeocodeResponse>> {
  const unique = [
    ...new Set(
      queries.map((q) => q.trim()).filter((q) => q.length >= 3),
    ),
  ];

  if (unique.length === 0) {
    return {};
  }

  const resolvedOptions = {
    ...options,
    skipFallbacks: options.skipFallbacks ?? true,
    useCache: options.useCache ?? true,
  };

  const results: Record<string, GeocodeResponse> = {};
  let index = 0;

  const worker = async () => {
    while (index < unique.length) {
      const query = unique[index]!;
      index += 1;
      try {
        results[query] = await resolveAddressQuery(query, fetchImpl, resolvedOptions);
      } catch {
        results[query] = {
          query,
          status: "not_found",
          match: null,
          suggestions: [],
        };
      }
    }
  };

  const workers = Array.from(
    { length: Math.min(GOOGLE_GEOCODE_BATCH_CONCURRENCY, unique.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}
