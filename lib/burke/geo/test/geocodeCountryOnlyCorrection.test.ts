import {
  isCountryOnlyGeocodeCorrection,
  stripTrailingCountry,
} from "../geocodeCountryOnlyCorrection";

describe("isCountryOnlyGeocodeCorrection", () => {
  const user = "1200 Main St, Columbia, SC 29201";

  it.each([
    `${user}, USA`,
    `${user}, United States`,
    `${user}, US`,
    `${user},United States`,
  ])("accepts country-only suffix: %s", (suggestion) => {
    expect(isCountryOnlyGeocodeCorrection(user, suggestion)).toBe(true);
  });

  it("rejects a different street or city", () => {
    expect(
      isCountryOnlyGeocodeCorrection(
        user,
        "1201 Main St, Columbia, SC 29201, USA",
      ),
    ).toBe(false);
  });

  it("rejects when suggestion is shorter than input", () => {
    expect(isCountryOnlyGeocodeCorrection(user, "Columbia, SC")).toBe(false);
  });

  it("accepts exact match (no suffix)", () => {
    expect(isCountryOnlyGeocodeCorrection(user, user)).toBe(true);
  });

  it("matches when country is stripped from the end", () => {
    expect(
      isCountryOnlyGeocodeCorrection(
        user,
        "1200 Main St, Columbia, SC 29201, United States",
      ),
    ).toBe(true);
    expect(stripTrailingCountry(`${user}, USA`)).toBe(user);
  });
});
