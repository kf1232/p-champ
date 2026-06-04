import { normalizeGeocodeQuery } from "@/lib/burke/geo/geocodeCache";

import { LOCATION_FINDER_GEOCODE_RESPONSES_KEY } from "./locationFinderCacheKeys";
import {
  findStoredGeocodeResponse,
  mergeGeocodeResponseIntoLocationFinderData,
} from "./locationFinderGeocodeCache";

describe("locationFinderGeocodeCache", () => {
  it("stores and finds geocode responses by normalized query key", () => {
    const query = "1200 Main St, Columbia, SC 29201, USA";
    const response = {
      query,
      status: "ambiguous" as const,
      match: null,
      suggestions: [
        {
          placeId: "1",
          formatted: "1200 Main St, Columbia, SC, 29201",
          lat: 34,
          lon: -81,
          displayName: "1200 Main St, Columbia, SC, 29201",
        },
      ],
    };

    const data = mergeGeocodeResponseIntoLocationFinderData({}, query, response);
    const key = normalizeGeocodeQuery(query);
    expect(
      (data[LOCATION_FINDER_GEOCODE_RESPONSES_KEY] as Record<string, unknown>)[
        key
      ],
    ).toBeDefined();

    const hit = findStoredGeocodeResponse(data, query);
    expect(hit?.suggestions).toHaveLength(1);
    expect(hit?.query).toBe(query);
  });
});
