import { searchGoogleGeocode } from "../googleGeocodeSearch";

describe("searchGoogleGeocode", () => {
  const prevKey = process.env.BURKE_GOOGLE_MAPS_API_KEY;

  beforeEach(() => {
    process.env.BURKE_GOOGLE_MAPS_API_KEY = "test-key";
  });

  afterEach(() => {
    if (prevKey === undefined) {
      delete process.env.BURKE_GOOGLE_MAPS_API_KEY;
    } else {
      process.env.BURKE_GOOGLE_MAPS_API_KEY = prevKey;
    }
  });

  it("returns rows for OK responses", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "OK",
        results: [
          {
            place_id: "ChIJtest",
            formatted_address: "123 Main St, Springfield, IL 62701, USA",
            geometry: { location: { lat: 39.78, lng: -89.65 } },
            address_components: [],
          },
        ],
      }),
    });

    const rows = await searchGoogleGeocode("123 Main St Springfield IL", fetchImpl);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.place_id).toBe("ChIJtest");
    expect(rows[0]?.lat).toBe("39.78");
    expect(fetchImpl).toHaveBeenCalledWith(
      expect.stringContaining("maps.googleapis.com/maps/api/geocode/json"),
      expect.any(Object),
    );
  });

  it("maps street, city, state, postal, and country components", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "OK",
        results: [
          {
            place_id: "ChIJparts",
            formatted_address: "123 Main St, Springfield, IL 62701, USA",
            geometry: { location: { lat: 39.78, lng: -89.65 } },
            address_components: [
              { long_name: "123", short_name: "123", types: ["street_number"] },
              { long_name: "Main St", short_name: "Main St", types: ["route"] },
              {
                long_name: "Springfield",
                short_name: "Springfield",
                types: ["locality"],
              },
              {
                long_name: "Illinois",
                short_name: "IL",
                types: ["administrative_area_level_1"],
              },
              { long_name: "62701", short_name: "62701", types: ["postal_code"] },
              {
                long_name: "United States",
                short_name: "US",
                types: ["country"],
              },
            ],
          },
        ],
      }),
    });

    const rows = await searchGoogleGeocode("123 Main St", fetchImpl);
    expect(rows[0]?.address).toEqual({
      house_number: "123",
      road: "Main St",
      city: "Springfield",
      state: "Illinois",
      postcode: "62701",
      country: "United States",
    });
  });

  it("returns empty when status is ZERO_RESULTS", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: "ZERO_RESULTS", results: [] }),
    });

    expect(await searchGoogleGeocode("nowhere", fetchImpl)).toEqual([]);
  });
});
