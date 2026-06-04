import { toGeocodeSuggestion } from "../geocodeSuggestion";
import type { GeocodeSearchRow } from "../types";

function row(
  address: GeocodeSearchRow["address"],
  display_name: string,
): GeocodeSearchRow {
  return {
    place_id: "1",
    lat: "0",
    lon: "0",
    display_name,
    address,
  };
}

describe("toGeocodeSuggestion formatting", () => {
  it("joins structured address parts", () => {
    expect(
      toGeocodeSuggestion(
        row(
          {
            house_number: "135",
            road: "Pilkington Avenue",
            city: "Birmingham",
            postcode: "B72 1LH",
            country: "United Kingdom",
          },
          "fallback",
        ),
      ).formatted,
    ).toBe("135 Pilkington Avenue, Birmingham, B72 1LH");
  });

  it("omits country by default", () => {
    expect(
      toGeocodeSuggestion(
        row(
          {
            house_number: "1200",
            road: "Main St",
            city: "Columbia",
            state: "SC",
            postcode: "29201",
            country: "United States",
          },
          "fallback",
        ),
      ).formatted,
    ).toBe("1200 Main St, Columbia, SC, 29201");
  });

  it("falls back to display name when parts are empty", () => {
    expect(toGeocodeSuggestion(row({}, "Display Name, UK")).formatted).toBe(
      "Display Name",
    );
  });
});
