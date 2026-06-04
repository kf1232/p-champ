/**
 * WoW service: browser persistence with a sliding TTL (default 7 days from last write).
 * Reads purge expired payloads so the key does not linger past its useful life.
 */

import {
  APP_STORAGE_KEYS,
  appLocalStorage,
  type EnvelopeStorageClient,
} from "@/lib/storage";

export const WOW_SERVICE_LOCAL_STORAGE_KEY = APP_STORAGE_KEYS.wowService;

export const WOW_SERVICE_TOOL_ID = "wow-service" as const;

/** Seven days — data is dropped if not written again before this elapses. */
export const WOW_SERVICE_STORAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const WOW_SERVICE_FOOTER_CLEAR_CONFIRM =
  "Clear all WoW service cache? This removes saved character profiles, guild data, and related lookups on this device.";

export type WowServiceStoredData = Record<string, unknown>;

export type WowServiceStorageParse = {
  data: WowServiceStoredData;
  storedAt: number | null;
};

const wowServiceStorage: EnvelopeStorageClient = appLocalStorage(
  APP_STORAGE_KEYS.wowService,
);

export const subscribeWowServiceStorage = wowServiceStorage.subscribe;

export function getWowServiceStorageSnapshot(): string {
  return wowServiceStorage.getSnapshot();
}

export function getWowServiceStorageServerSnapshot(): string {
  return wowServiceStorage.getServerSnapshot();
}

export function parseWowServiceStorageRaw(raw: string): WowServiceStorageParse {
  return wowServiceStorage.parseRaw(raw);
}

export function writeWowServiceStoredData(data: WowServiceStoredData): void {
  wowServiceStorage.write(data);
}

export function clearWowServiceStoredData(): void {
  wowServiceStorage.clear();
}
