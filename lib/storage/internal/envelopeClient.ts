import type { EnvelopeStorageClient, ScopedStorageParse } from "../types";
import { readStorageRaw, removeStorageRaw, writeStorageRaw } from "./access";
import { emitStorageKey, subscribeStorageKey } from "./listeners";

export type StoredEnvelopeV1 = {
  v: 1;
  tool?: string;
  storedAt: number;
  data: Record<string, unknown>;
};

export type EnvelopeStorageOptions = {
  key: string;
  ttlMs?: number;
  expectedToolId?: string;
  sanitize?: (data: Record<string, unknown>) => Record<string, unknown>;
  canonicalizeOnRead?: boolean;
  serialize?: (
    storedAt: number,
    data: Record<string, unknown>,
  ) => string;
};

function shallowCloneData(
  data: Record<string, unknown>,
): Record<string, unknown> {
  return { ...data };
}

function parseEnvelope(
  raw: string | null,
  expectedToolId?: string,
): StoredEnvelopeV1 | null {
  if (!raw) {
    return null;
  }
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
    const env = parsed as StoredEnvelopeV1;
    if (
      expectedToolId !== undefined &&
      env.tool !== undefined &&
      env.tool !== expectedToolId
    ) {
      return null;
    }
    return env;
  } catch {
    return null;
  }
}

function isExpired(storedAt: number, ttlMs?: number): boolean {
  return ttlMs !== undefined && Date.now() - storedAt > ttlMs;
}

function defaultSerialize(
  storedAt: number,
  data: Record<string, unknown>,
  expectedToolId?: string,
): string {
  const envelope: StoredEnvelopeV1 = {
    v: 1,
    storedAt,
    data,
  };
  if (expectedToolId !== undefined) {
    envelope.tool = expectedToolId;
  }
  return JSON.stringify(envelope);
}

export function createEnvelopeStorageClient(
  options: EnvelopeStorageOptions,
): EnvelopeStorageClient {
  const {
    key,
    ttlMs,
    expectedToolId,
    sanitize,
    canonicalizeOnRead = false,
    serialize,
  } = options;

  const applySanitize = sanitize ?? shallowCloneData;

  const toCanonical = (storedAt: number, data: Record<string, unknown>) => {
    const clean = applySanitize(data);
    if (serialize) {
      return serialize(storedAt, clean);
    }
    return defaultSerialize(storedAt, clean, expectedToolId);
  };

  const parseRaw = (raw: string): ScopedStorageParse => {
    if (!raw) {
      return { data: {}, storedAt: null };
    }
    const env = parseEnvelope(raw, expectedToolId);
    if (!env) {
      return { data: {}, storedAt: null };
    }
    if (isExpired(env.storedAt, ttlMs)) {
      return { data: {}, storedAt: null };
    }
    return {
      data: applySanitize(env.data),
      storedAt: env.storedAt,
    };
  };

  const getSnapshot = (): string => {
    const raw = readStorageRaw(key);
    if (!raw) {
      return "";
    }
    const env = parseEnvelope(raw, expectedToolId);
    if (!env) {
      removeStorageRaw(key);
      emitStorageKey(key);
      return "";
    }
    if (isExpired(env.storedAt, ttlMs)) {
      removeStorageRaw(key);
      emitStorageKey(key);
      return "";
    }

    if (canonicalizeOnRead) {
      const canonical = toCanonical(env.storedAt, env.data);
      if (!canonical) {
        return "";
      }
      if (canonical !== raw) {
        writeStorageRaw(key, canonical);
        emitStorageKey(key);
      }
      return canonical;
    }

    return raw;
  };

  return {
    key,
    subscribe: (listener) => subscribeStorageKey(key, listener),
    getSnapshot,
    getServerSnapshot: () => "",
    parseRaw,
    write: (data) => {
      writeStorageRaw(key, toCanonical(Date.now(), data));
      emitStorageKey(key);
    },
    clear: () => {
      removeStorageRaw(key);
      emitStorageKey(key);
    },
  };
}
