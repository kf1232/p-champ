import { applyGeocodeWithTargetContext } from "../applyGeocodeWithTargetContext";
import type { GeocodeResponse } from "../types";

const targetFormatted =
  "1400 Senate Street, Columbia, South Carolina, 29201";

function responseFor(
  lat: number,
  lon: number,
  formatted: string,
): GeocodeResponse {
  return {
    query: formatted,
    status: "found",
    match: {
      placeId: "x",
      formatted,
      displayName: formatted,
      lat,
      lon,
    },
    suggestions: [],
  };
}

describe("applyGeocodeWithTargetContext", () => {
  it("uses contextual geocode when street-only query has no primary match", () => {
    const map = new Map<string, GeocodeResponse>([
      [
        "1576 spence drive, columbia, south carolina, 29201",
        responseFor(34.05, -81.1, "1576 Spence Drive, Columbia, SC"),
      ],
    ]);
    const peek = (q: string) => {
      const key = q.trim().toLowerCase();
      for (const [k, v] of map) {
        if (k === key) {
          return v;
        }
      }
      return null;
    };

    const result = applyGeocodeWithTargetContext(
      "1576 Spence Drive",
      peek,
      targetFormatted,
    );
    expect(result.status).toBe("success");
    expect(result.value.query).toBe("1576 Spence Drive");
    expect(result.value.lat).toBe(34.05);
  });
});
