/**
 * Cross-feature UI reused by multiple route areas (app chrome, footers, combobox).
 *
 * Do **not** put feature-only chrome here (e.g. P-Champ nav lives in `components/p-champ/`).
 *
 * See `components/README.md` for the full `commons` vs `{feature}` convention.
 */

export { AppChrome, AppFooter, AppHeader } from "./app-chrome";
export { ColorSchemeProvider, useColorScheme } from "./ColorSchemeProvider";
export { ColorSchemeToggle } from "./ColorSchemeToggle";
export { AppHeaderProvider } from "./AppHeaderContext";
export type { AppHeaderSlotConfig } from "./AppHeaderContext";
export { useRegisterAppHeader } from "./AppHeaderContext";
export { AppStorageFooterProvider } from "./AppStorageFooterContext";
export type { AppStorageFooterConfig } from "./AppStorageFooterContext";
export { useRegisterAppStorageFooter } from "./AppStorageFooterContext";
export { AppViewportFooter } from "./AppViewportFooter";
export { AppViewportHeader } from "./AppViewportHeader";
export { ViewportLockedFooterBar } from "./ViewportLockedFooterBar";
/** @deprecated Use `AppChrome` from `app/layout.tsx` instead of nesting a page shell. */
export { ViewportLockedPageShell } from "./ViewportLockedPageShell";
export { FloatingComboboxMenu, useFloatingComboboxAnchor } from "./combobox";
export { createEnvelopeStorageFooterConfig } from "./utils/storageFooterActions";
