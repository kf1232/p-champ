import { applyGeocodeResponseToRow } from "../applyGeocodeToRow";
import type { GeocodeResponse, GeocodeSuggestion } from "../types";

const user = "1200 Main St, Columbia, SC 29201";

function suggestion(overrides: Partial<GeocodeSuggestion> = {}): GeocodeSuggestion {
  const line = user;
  return {
    placeId: "abc",
    formatted: line,
    displayName: line,
    lat: 34,
    lon: -81,
    ...overrides,
  };
}

describe("applyGeocodeResponseToRow", () => {
  it("returns success when response is found", () => {
    const response: GeocodeResponse = {
      query: user,
      status: "found",
      match: {
        placeId: "1",
        formatted: "1200 Main St, Columbia, SC, 29201",
        lat: 34,
        lon: -81,
        displayName: "1200 Main St, Columbia, SC, 29201",
      },
      suggestions: [],
    };
    const result = applyGeocodeResponseToRow(user, response);
    expect(result.status).toBe("success");
    expect(result.value.placeId).toBe("1");
  });

  it("auto-picks when canonical address matches (e.g. with or without country)", () => {
    const top = suggestion({ formatted: user, displayName: user });
    const response: GeocodeResponse = {
      query: `${user}, USA`,
      status: "ambiguous",
      match: null,
      suggestions: [top],
    };
    const result = applyGeocodeResponseToRow(`${user}, USA`, response);
    expect(result.status).toBe("success");
    expect(result.value.placeId).toBe("abc");
  });

  it("auto-picks top suggestion when only country was appended", () => {
    const top = suggestion();
    const response: GeocodeResponse = {
      query: user,
      status: "ambiguous",
      match: null,
      suggestions: [top, suggestion({ placeId: "other" })],
    };
    const result = applyGeocodeResponseToRow(user, response);
    expect(result.status).toBe("success");
    expect(result.value).toMatchObject({ placeId: "abc" });
  });

  it("returns warning when suggestions change the street", () => {
    const response: GeocodeResponse = {
      query: user,
      status: "ambiguous",
      match: null,
      suggestions: [
        suggestion({
          formatted: "1201 Main St, Columbia, SC 29201, USA",
          displayName: "1201 Main St, Columbia, SC 29201, USA",
        }),
      ],
    };
    const result = applyGeocodeResponseToRow(user, response);
    expect(result.status).toBe("warning");
    expect(result.value.placeId).toBeNull();
  });
});
