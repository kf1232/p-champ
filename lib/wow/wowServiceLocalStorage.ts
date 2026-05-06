/**
 * WoW service: browser persistence with a sliding TTL (default 7 days from last write).
 * Reads purge expired payloads so the key does not linger past its useful life.
 */

export const WOW_SERVICE_LOCAL_STORAGE_KEY = "p-champ:wow-service";

/** Seven days — data is dropped if not written again before this elapses. */
export const WOW_SERVICE_STORAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type WowServiceStoredData = Record<string, unknown>;

type StoredEnvelopeV1 = {
  v: 1;
  storedAt: number;
  data: WowServiceStoredData;
};

export type WowServiceStorageParse = {
  data: WowServiceStoredData;
  /** Last successful write time (ms), or null if nothing stored. */
  storedAt: number | null;
};

let listeners: Array<() => void> = [];

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeWowServiceStorage(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function parseEnvelope(raw: string | null): StoredEnvelopeV1 | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      (parsed as StoredEnvelopeV1).v !== 1 ||
      typeof (parsed as StoredEnvelopeV1).storedAt !== "number" ||
      typeof (parsed as StoredEnvelopeV1).data !== "object" ||
      (parsed as StoredEnvelopeV1).data === null ||
      Array.isArray((parsed as StoredEnvelopeV1).data)
    ) {
      return null;
    }
    return parsed as StoredEnvelopeV1;
  } catch {
    return null;
  }
}

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(WOW_SERVICE_LOCAL_STORAGE_KEY);
  } catch {
    return null;
  }
}

function removeRaw(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(WOW_SERVICE_LOCAL_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Raw snapshot for `useSyncExternalStore` — stable string identity while storage unchanged.
 */
export function getWowServiceStorageSnapshot(): string {
  if (typeof window === "undefined") return "";
  const raw = readRaw();
  if (!raw) return "";
  const env = parseEnvelope(raw);
  if (!env) {
    removeRaw();
    emit();
    return "";
  }
  if (Date.now() - env.storedAt > WOW_SERVICE_STORAGE_TTL_MS) {
    removeRaw();
    emit();
    return "";
  }
  return raw;
}

export function getWowServiceStorageServerSnapshot(): string {
  return "";
}

export function parseWowServiceStorageRaw(raw: string): WowServiceStorageParse {
  if (!raw) return { data: {}, storedAt: null };
  const env = parseEnvelope(raw);
  if (!env) return { data: {}, storedAt: null };
  if (Date.now() - env.storedAt > WOW_SERVICE_STORAGE_TTL_MS) {
    return { data: {}, storedAt: null };
  }
  return { data: { ...env.data }, storedAt: env.storedAt };
}

export function writeWowServiceStoredData(data: WowServiceStoredData): void {
  if (typeof window === "undefined") return;
  try {
    const envelope: StoredEnvelopeV1 = {
      v: 1,
      storedAt: Date.now(),
      data: { ...data },
    };
    localStorage.setItem(
      WOW_SERVICE_LOCAL_STORAGE_KEY,
      JSON.stringify(envelope)
    );
  } catch {
    /* ignore quota / private mode */
  }
  emit();
}

export function clearWowServiceStoredData(): void {
  removeRaw();
  emit();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === WOW_SERVICE_LOCAL_STORAGE_KEY || e.key === null) emit();
  });
}
