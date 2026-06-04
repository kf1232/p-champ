/**
 * Sole public API for browser `localStorage` in this app.
 *
 * @example
 * const wow = appLocalStorage(APP_STORAGE_KEYS.wowService);
 * wow.write({ ... });
 */
export { APP_STORAGE_KEYS, type AppStorageKey } from "./keys";
export { appLocalStorage, registerAppStorageClient } from "./registry";
export type {
  AppStorageClient,
  EnvelopeStorageClient,
  RawFlagStorageClient,
  RawStringStorageClient,
  ScopedStorageParse,
} from "./types";
