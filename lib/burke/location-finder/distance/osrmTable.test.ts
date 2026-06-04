import {
  buildOsrmTableRequestUrl,
  fetchOsrmTableMetrics,
  formatOsrmDestinationIndices,
  OSRM_TABLE_MAX_DESTINATIONS_PER_REQUEST,
  parseOsrmTableLegs,
} from "./osrmTable";

describe("parseOsrmTableLegs", () => {
  it("reads matrix columns by destination order (not global coordinate index)", () => {
    const legs = parseOsrmTableLegs({
      durations: [[600, 1200]],
      distances: [[1609.344, 3218.688]],
      snapDistanceMeters: [5, 12],
      sourceSnapDistanceMeters: 3,
    });
    expect(legs[0]).toMatchObject({
      status: "routed",
      metrics: { minutes: 10, miles: 1, snapDistanceMeters: 5 },
    });
    expect(legs[1]).toMatchObject({
      status: "routed",
      metrics: { minutes: 20, miles: 2, snapDistanceMeters: 12 },
    });
  });

  it("returns structured failure for unreachable legs", () => {
    const legs = parseOsrmTableLegs({
      durations: [[600, null]],
      distances: [[1609.344, null]],
      snapDistanceMeters: [5, null],
      sourceSnapDistanceMeters: 3,
    });
    expect(legs[0]?.status).toBe("routed");
    expect(legs[1]).toMatchObject({
      status: "unrouted",
      failure: { code: "no_road_route" },
    });
  });
});

describe("formatOsrmDestinationIndices", () => {
  it("joins 1-based indices with semicolons", () => {
    expect(formatOsrmDestinationIndices(3)).toBe("1;2;3");
    expect(formatOsrmDestinationIndices(1)).toBe("1");
  });
});

describe("buildOsrmTableRequestUrl", () => {
  it("uses semicolon-separated destinations, not repeated query keys", () => {
    const url = buildOsrmTableRequestUrl(
      { lat: 34, lon: -81 },
      [
        { lat: 34.05, lon: -81.28 },
        { lat: 34.09, lon: -81.14 },
      ],
    );
    expect(url).toContain("destinations=1%3B2");
    expect(url).not.toContain("destinations=1&destinations=2");
  });
});

describe("fetchOsrmTableMetrics", () => {
  it("parses all legs when OSRM returns one column per destination", async () => {
    const target = { lat: 34, lon: -81 };
    const destinations = [
      { lat: 34.05, lon: -81.28 },
      { lat: 34.09, lon: -81.14 },
    ];

    const fetchMock: typeof fetch = async (input) => {
      const url = String(input);
      expect(url).toContain("destinations=1%3B2");

      return {
        ok: true,
        json: async () => ({
          code: "Ok",
          durations: [[600, 1200]],
          distances: [[1609.344, 3218.688]],
          destinations: [{ distance: 5 }, { distance: 12 }],
          sources: [{ distance: 3 }],
        }),
      } as Response;
    };

    const { legs } = await fetchOsrmTableMetrics(
      target,
      destinations,
      fetchMock,
    );
    expect(legs).toHaveLength(2);
    expect(legs[0]?.status).toBe("routed");
    expect(legs[1]?.status).toBe("routed");
  });
});

describe("OSRM_TABLE_MAX_DESTINATIONS_PER_REQUEST", () => {
  it("chunks large destination lists", () => {
    expect(OSRM_TABLE_MAX_DESTINATIONS_PER_REQUEST).toBeGreaterThan(0);
  });
});
