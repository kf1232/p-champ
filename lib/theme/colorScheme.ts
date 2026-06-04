import {
  readColorSchemeCookieValue,
  writeColorSchemeCookie,
} from "./colorSchemeCookie";

export type ColorScheme = "light" | "dark";

export const COLOR_SCHEME_ATTRIBUTE = "data-color-scheme" as const;

export function isColorScheme(value: string | null | undefined): value is ColorScheme {
  return value === "light" || value === "dark";
}

export function resolveColorScheme(stored: string | null | undefined): ColorScheme {
  if (isColorScheme(stored)) {
    return stored;
  }
  return "light";
}

/** Applies `data-color-scheme` on `<html>` (client-only). */
export function applyColorSchemeToDocument(scheme: ColorScheme): void {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.setAttribute(COLOR_SCHEME_ATTRIBUTE, scheme);
}

/** Client-only — document attribute, cookie, and storage stay aligned. */
export function persistColorSchemeOnClient(
  scheme: ColorScheme,
  writeStorage: (value: ColorScheme) => void,
): void {
  writeStorage(scheme);
  applyColorSchemeToDocument(scheme);
  writeColorSchemeCookie(scheme);
}

/**
 * After bootstrap, `<html data-color-scheme>` is canonical; sync storage/cookie if drifted.
 * Client-only (call from `useEffect` on mount).
 */
export function reconcileColorSchemeFromDocument(
  readStorage: () => string | null,
  writeStorage: (value: ColorScheme) => void,
): void {
  if (typeof document === "undefined") {
    return;
  }
  const canonical = resolveColorScheme(
    document.documentElement.getAttribute(COLOR_SCHEME_ATTRIBUTE),
  );
  const stored = resolveColorScheme(readStorage());
  const cookie = resolveColorScheme(
    readColorSchemeCookieValue(document.cookie),
  );
  if (stored !== canonical || cookie !== canonical) {
    persistColorSchemeOnClient(canonical, writeStorage);
  }
}
