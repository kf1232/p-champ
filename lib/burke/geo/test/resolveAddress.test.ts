import { GOOGLE_GEOCODE_API_URL } from "../constants";
import { resolveAddressQuery } from "../resolveAddress";

function googleOk(
  results: Array<{
    place_id: string;
    formatted_address: string;
    lat?: number;
    lon?: number;
  }>,
) {
  return {
    ok: true,
    json: async () => ({
      status: "OK",
      results: results.map((r) => ({
        place_id: r.place_id,
        formatted_address: r.formatted_address,
        geometry: {
          location: { lat: r.lat ?? 40, lng: r.lon ?? -74 },
        },
        address_components: [
          { long_name: "Main St", short_name: "Main St", types: ["route"] },
          { long_name: "Example", short_name: "Example", types: ["locality"] },
          {
            long_name: "New Jersey",
            short_name: "NJ",
            types: ["administrative_area_level_1"],
          },
          {
            long_name: "United States",
            short_name: "US",
            types: ["country"],
          },
        ],
      })),
    }),
  };
}

function googleEmpty() {
  return {
    ok: true,
    json: async () => ({ status: "ZERO_RESULTS", results: [] }),
  };
}

describe("resolveAddressQuery", () => {
  const prevKey = process.env.BURKE_GOOGLE_MAPS_API_KEY;

  beforeEach(() => {
    process.env.BURKE_GOOGLE_MAPS_API_KEY = "test-key";
  });

  afterAll(() => {
    if (prevKey === undefined) {
      delete process.env.BURKE_GOOGLE_MAPS_API_KEY;
    } else {
      process.env.BURKE_GOOGLE_MAPS_API_KEY = prevKey;
    }
  });

  it("returns found for a single match", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      googleOk([
        {
          place_id: "42",
          formatted_address: "999 Main St, Example, NJ, USA",
        },
      ]),
    );

    const result = await resolveAddressQuery("999 Main St", fetchImpl);
    expect(result.status).toBe("found");
    expect(result.match?.placeId).toBe("42");
    expect(result.match?.formatted).toContain("Main St");
    expect(fetchImpl).toHaveBeenCalledWith(
      expect.stringContaining(GOOGLE_GEOCODE_API_URL),
      expect.any(Object),
    );
  });

  it("returns ambiguous when multiple matches", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      googleOk([
        { place_id: "1", formatted_address: "Main St, Example, NJ, USA" },
        { place_id: "2", formatted_address: "Other, NJ, USA" },
      ]),
    );

    const result = await resolveAddressQuery("Main St", fetchImpl);
    expect(result.status).toBe("ambiguous");
    expect(result.suggestions).toHaveLength(2);
  });

  it("returns not_found with correction suggestions from fallbacks", async () => {
    let call = 0;
    const fetchImpl = jest.fn().mockImplementation(async () => {
      call += 1;
      if (call === 1) {
        return googleEmpty();
      }
      return googleOk([
        {
          place_id: "99",
          formatted_address: "Example, NJ, USA",
        },
      ]);
    });

    const result = await resolveAddressQuery(
      "999 Fake St, Springfield, IL",
      fetchImpl,
    );
    expect(result.status).toBe("not_found");
    expect(result.suggestions.some((s) => s.placeId === "99")).toBe(true);
  });
});
