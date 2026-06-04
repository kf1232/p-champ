/** `.env` key — `RELEASE` (default) or `DEBUG`. */
export const APP_THEME_ENV = "APP_THEME" as const;

export type AppThemeName = "release" | "debug";

const APP_THEME_VALUES: ReadonlySet<string> = new Set(["RELEASE", "DEBUG"]);

/**
 * Resolves the active app theme from `APP_THEME`.
 * Unknown or missing values fall back to `release`.
 */
export function resolveAppTheme(raw: string | undefined): AppThemeName {
  const normalized = raw?.trim().toUpperCase();
  if (normalized === "DEBUG") {
    return "debug";
  }
  return "release";
}

/** Server-only: read theme for root layout (`data-app-theme`). */
export function getAppThemeFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): AppThemeName {
  return resolveAppTheme(env[APP_THEME_ENV]);
}

export function isKnownAppThemeEnvValue(raw: string | undefined): boolean {
  if (!raw?.trim()) {
    return true;
  }
  return APP_THEME_VALUES.has(raw.trim().toUpperCase());
}
