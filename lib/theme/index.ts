export {
  APP_THEME_ENV,
  getAppThemeFromEnv,
  isKnownAppThemeEnvValue,
  resolveAppTheme,
  type AppThemeName,
} from "./appTheme";
export {
  applyColorSchemeToDocument,
  COLOR_SCHEME_ATTRIBUTE,
  persistColorSchemeOnClient,
  reconcileColorSchemeFromDocument,
  resolveColorScheme,
  type ColorScheme,
} from "./colorScheme";
export {
  COLOR_SCHEME_COOKIE_MAX_AGE_SEC,
  COLOR_SCHEME_COOKIE_NAME,
  readColorSchemeCookieValue,
  resolveColorSchemeFromCookieHeader,
  resolveColorSchemeFromRequestCookies,
  writeColorSchemeCookie,
} from "./colorSchemeCookie";
export { colorSchemeBootstrapScript } from "./colorSchemeInitScript";

/** CSS variable names for semantic colors (see `themes/semantic.css`). */
export const APP_TEXT_PRIMARY_VAR = "--app-text-primary" as const;
export const APP_TEXT_SECONDARY_VAR = "--app-text-secondary" as const;
