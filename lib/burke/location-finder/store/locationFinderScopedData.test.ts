import {
  LOCATION_FINDER_FORM_DRAFT_KEY,
  LOCATION_FINDER_GEOCODE_RESPONSES_KEY,
  LOCATION_FINDER_TOOL_ID,
} from "./locationFinderCacheKeys";
import {
  sanitizeLocationFinderStoredData,
  serializeLocationFinderCacheEnvelope,
} from "./locationFinderScopedData";

describe("sanitizeLocationFinderStoredData", () => {
  it("keeps only Location Finder cache keys", () => {
    const scoped = sanitizeLocationFinderStoredData({
      [LOCATION_FINDER_GEOCODE_RESPONSES_KEY]: { "main st": {} },
      [LOCATION_FINDER_FORM_DRAFT_KEY]: { target: { query: "" } },
      characterProfileSummaries: { should: "drop" },
      wowNoise: true,
    });

    expect(scoped).toEqual({
      [LOCATION_FINDER_GEOCODE_RESPONSES_KEY]: { "main st": {} },
      [LOCATION_FINDER_FORM_DRAFT_KEY]: { target: { query: "" } },
    });
    expect(scoped).not.toHaveProperty("characterProfileSummaries");
    expect(scoped).not.toHaveProperty("wowNoise");
  });
});

describe("serializeLocationFinderCacheEnvelope", () => {
  it("tags the envelope with the Location Finder tool id", () => {
    const raw = serializeLocationFinderCacheEnvelope(1_700_000_000_000, {});
    const parsed = JSON.parse(raw) as { tool: string; data: object };
    expect(parsed.tool).toBe(LOCATION_FINDER_TOOL_ID);
    expect(parsed.data).toEqual({});
  });
});
