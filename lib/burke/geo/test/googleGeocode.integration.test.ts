/**
 * Live Google Geocoding API check (uses `BURKE_GOOGLE_MAPS_API_KEY` from `.env`).
 *
 * @jest-environment node
 */
import { resolveAddressQuery } from "../resolveAddress";

const hasGoogleKey = Boolean(process.env.BURKE_GOOGLE_MAPS_API_KEY?.trim());

describe("Google Geocoding API (integration)", () => {
  const run = hasGoogleKey ? it : it.skip;

  run(
    "resolves a known US address (needs BURKE_GOOGLE_MAPS_API_KEY)",
    async () => {
      const result = await resolveAddressQuery(
        "1200 Main Street, Columbia, SC 29201",
        fetch,
        { useCache: false, skipFallbacks: true },
      );

      expect(result.status).toBe("found");
      expect(result.match).not.toBeNull();
      expect(result.match!.lat).toBeGreaterThan(33);
      expect(result.match!.lat).toBeLessThan(35);
      expect(result.match!.lon).toBeLessThan(-80);
      expect(result.match!.lon).toBeGreaterThan(-82);
      expect(result.match!.formatted.length).toBeGreaterThan(10);
      expect(result.suggestions.length).toBeGreaterThanOrEqual(1);
    },
    20_000,
  );
});
