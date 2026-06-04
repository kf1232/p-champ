import { resolveColorScheme, type ColorScheme } from "./colorScheme";

/** Cookie mirrored with `localStorage` so SSR matches the user preference. */
export const COLOR_SCHEME_COOKIE_NAME = "p-champ-color-scheme";

export const COLOR_SCHEME_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

export function readColorSchemeCookieValue(
  cookieHeader: string | undefined,
): string | null {
  if (!cookieHeader) {
    return null;
  }
  const prefix = `${COLOR_SCHEME_COOKIE_NAME}=`;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

export function resolveColorSchemeFromCookieHeader(
  cookieHeader: string | undefined,
): ColorScheme {
  return resolveColorScheme(readColorSchemeCookieValue(cookieHeader));
}

export function resolveColorSchemeFromRequestCookies(
  get: (name: string) => { value: string } | undefined,
): ColorScheme {
  return resolveColorScheme(get(COLOR_SCHEME_COOKIE_NAME)?.value);
}

/** Client-only — keeps cookie in sync with `localStorage`. */
export function writeColorSchemeCookie(scheme: ColorScheme): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${COLOR_SCHEME_COOKIE_NAME}=${encodeURIComponent(scheme)}; path=/; max-age=${COLOR_SCHEME_COOKIE_MAX_AGE_SEC}; SameSite=Lax`;
}
