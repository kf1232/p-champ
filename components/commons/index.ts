/**
 * Cross-feature UI reused by multiple route areas (viewport-locked footers, page shells).
 *
 * Do **not** put feature-only chrome here (e.g. P-Champ nav lives in `components/p-champ/`).
 *
 * See `components/README.md` for the full `commons` vs `{feature}` convention.
 */

export { AppStorageFooterProvider } from "./AppStorageFooterContext";
export type { AppStorageFooterConfig } from "./AppStorageFooterContext";
export { useRegisterAppStorageFooter } from "./AppStorageFooterContext";
export { AppViewportFooter } from "./AppViewportFooter";
export { ViewportLockedFooterBar } from "./ViewportLockedFooterBar";
export { ViewportLockedPageShell } from "./ViewportLockedPageShell";
export { FloatingComboboxMenu, useFloatingComboboxAnchor } from "./combobox";
export { createEnvelopeStorageFooterConfig } from "./utils/storageFooterActions";
