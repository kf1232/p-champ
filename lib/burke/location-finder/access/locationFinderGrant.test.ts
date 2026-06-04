import {
  createGrantToken,
  hasValidLocationFinderGrant,
  requireLocationFinderGrant,
  verifyGrantToken,
  verifyLocationFinderPassword,
} from "./locationFinderGrant";

jest.mock("next/headers", () => ({
  cookies: jest.fn(async () => ({
    get: () => undefined,
  })),
}));

describe("locationFinderGrant", () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
    process.env.BURKE_LOCATION_FINDER_PASSWORD = "test-pass";
    process.env.BURKE_LOCATION_FINDER_SECRET = "test-secret";
  });

  afterAll(() => {
    process.env = env;
  });

  it("verifies the configured password", () => {
    expect(verifyLocationFinderPassword("test-pass")).toBe(true);
    expect(verifyLocationFinderPassword("wrong")).toBe(false);
  });

  it("creates and verifies a grant token", () => {
    const token = createGrantToken("test-secret");
    expect(verifyGrantToken("test-secret", token)).toBe(true);
    expect(verifyGrantToken("test-secret", "lf.invalid")).toBe(false);
    expect(hasValidLocationFinderGrant(token)).toBe(true);
  });

  it("requireLocationFinderGrant returns 503 when gate is not configured", async () => {
    delete process.env.BURKE_LOCATION_FINDER_PASSWORD;
    delete process.env.BURKE_LOCATION_FINDER_SECRET;
    const res = await requireLocationFinderGrant();
    expect(res?.status).toBe(503);
  });

  it("requireLocationFinderGrant returns 401 when configured but not granted", async () => {
    process.env.BURKE_LOCATION_FINDER_PASSWORD = "test-pass";
    process.env.BURKE_LOCATION_FINDER_SECRET = "test-secret";
    const res = await requireLocationFinderGrant();
    expect(res?.status).toBe(401);
  });
});
