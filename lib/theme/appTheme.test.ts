import {
  getAppThemeFromEnv,
  isKnownAppThemeEnvValue,
  resolveAppTheme,
} from "./appTheme";

describe("resolveAppTheme", () => {
  it("defaults to release when unset", () => {
    expect(resolveAppTheme(undefined)).toBe("release");
    expect(resolveAppTheme("")).toBe("release");
  });

  it("accepts RELEASE and DEBUG case-insensitively", () => {
    expect(resolveAppTheme("RELEASE")).toBe("release");
    expect(resolveAppTheme("release")).toBe("release");
    expect(resolveAppTheme("DEBUG")).toBe("debug");
    expect(resolveAppTheme(" debug ")).toBe("debug");
  });

  it("falls back to release for unknown values", () => {
    expect(resolveAppTheme("staging")).toBe("release");
  });
});

describe("getAppThemeFromEnv", () => {
  it("reads APP_THEME from env", () => {
    expect(getAppThemeFromEnv({ APP_THEME: "DEBUG" })).toBe("debug");
    expect(getAppThemeFromEnv({})).toBe("release");
  });
});

describe("isKnownAppThemeEnvValue", () => {
  it("treats empty as valid (default release)", () => {
    expect(isKnownAppThemeEnvValue(undefined)).toBe(true);
    expect(isKnownAppThemeEnvValue("  ")).toBe(true);
  });

  it("rejects unknown tokens", () => {
    expect(isKnownAppThemeEnvValue("STAGING")).toBe(false);
    expect(isKnownAppThemeEnvValue("DEBUG")).toBe(true);
  });
});
