import {
  parseRegionHintFromFormatted,
  queryLikelyNeedsRegionContext,
  withRegionContext,
} from "../regionGeocodeContext";

describe("parseRegionHintFromFormatted", () => {
  it("drops the street line", () => {
    expect(
      parseRegionHintFromFormatted(
        "1400 Senate Street, Columbia, South Carolina, 29201",
      ),
    ).toBe("Columbia, South Carolina, 29201");
  });
});

describe("queryLikelyNeedsRegionContext", () => {
  it("flags street-only queries", () => {
    expect(queryLikelyNeedsRegionContext("1576 Spence Drive")).toBe(true);
    expect(
      queryLikelyNeedsRegionContext("1576 Spence Drive, Columbia, SC"),
    ).toBe(false);
  });
});

describe("withRegionContext", () => {
  it("appends region hint", () => {
    expect(withRegionContext("1576 Spence Drive", "Columbia, SC 29201")).toBe(
      "1576 Spence Drive, Columbia, SC 29201",
    );
  });
});
