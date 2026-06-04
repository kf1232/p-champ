import { createEnvelopeStorageClient } from "./internal/envelopeClient";
import { createRawFlagStorageClient } from "./internal/rawFlagClient";
import { createRawStringStorageClient } from "./internal/rawStringClient";
import { APP_STORAGE_KEYS, type AppStorageKey } from "./keys";
import type {
  AppStorageClient,
  EnvelopeStorageClient,
  RawFlagStorageClient,
  RawStringStorageClient,
} from "./types";

const SEVEN_DAY_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const PLUGIN_CLIENTS = new Map<AppStorageKey, AppStorageClient>();

/** Register a feature-owned storage client (call from that feature's store module). */
export function registerAppStorageClient(
  key: AppStorageKey,
  client: AppStorageClient,
): void {
  if (PLUGIN_CLIENTS.has(key)) {
    throw new Error(`Storage client already registered for key: ${key}`);
  }
  PLUGIN_CLIENTS.set(key, client);
}

const BASE_CLIENTS: Record<
  Exclude<AppStorageKey, typeof APP_STORAGE_KEYS.burkeLocationFinder>,
  AppStorageClient
> = {
  [APP_STORAGE_KEYS.wowService]: createEnvelopeStorageClient({
    key: APP_STORAGE_KEYS.wowService,
    ttlMs: SEVEN_DAY_TTL_MS,
  }),
  [APP_STORAGE_KEYS.selectedGame]: createRawStringStorageClient(
    APP_STORAGE_KEYS.selectedGame,
  ),
  [APP_STORAGE_KEYS.wowDebugRawPanels]: createRawFlagStorageClient(
    APP_STORAGE_KEYS.wowDebugRawPanels,
  ),
  [APP_STORAGE_KEYS.wowLastCharacterLookup]: createRawStringStorageClient(
    APP_STORAGE_KEYS.wowLastCharacterLookup,
  ),
  [APP_STORAGE_KEYS.wowLastGuildLookup]: createRawStringStorageClient(
    APP_STORAGE_KEYS.wowLastGuildLookup,
  ),
};

function resolveClient(key: AppStorageKey): AppStorageClient | undefined {
  return PLUGIN_CLIENTS.get(key) ?? BASE_CLIENTS[key as keyof typeof BASE_CLIENTS];
}

export function appLocalStorage(
  key: typeof APP_STORAGE_KEYS.burkeLocationFinder,
): EnvelopeStorageClient;
export function appLocalStorage(
  key: typeof APP_STORAGE_KEYS.wowService,
): EnvelopeStorageClient;
export function appLocalStorage(
  key: typeof APP_STORAGE_KEYS.selectedGame,
): RawStringStorageClient;
export function appLocalStorage(
  key: typeof APP_STORAGE_KEYS.wowDebugRawPanels,
): RawFlagStorageClient;
export function appLocalStorage(
  key: typeof APP_STORAGE_KEYS.wowLastCharacterLookup,
): RawStringStorageClient;
export function appLocalStorage(
  key: typeof APP_STORAGE_KEYS.wowLastGuildLookup,
): RawStringStorageClient;
export function appLocalStorage(key: AppStorageKey): AppStorageClient {
  const client = resolveClient(key);
  if (!client) {
    throw new Error(
      `Unknown storage key: ${key}. Register a plugin client or add it to lib/storage/registry.ts.`,
    );
  }
  return client;
}
