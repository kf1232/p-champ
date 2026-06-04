import { normalizeGeocodeQuery } from "../geocodeCache";

describe("normalizeGeocodeQuery", () => {
  const base = "1200 Main St, Columbia, SC 29201";

  it("strips trailing country so keys match", () => {
    expect(normalizeGeocodeQuery(`${base}, USA`)).toBe(
      normalizeGeocodeQuery(base),
    );
    expect(normalizeGeocodeQuery(`${base}, United States`)).toBe(
      normalizeGeocodeQuery(base),
    );
  });
});
