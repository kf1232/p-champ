export type ScopedStorageParse = {
  data: Record<string, unknown>;
  storedAt: number | null;
};

/** TTL envelope cache (WoW service, Burke Location Finder). */
export type EnvelopeStorageClient = {
  readonly key: string;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => string;
  getServerSnapshot: () => string;
  parseRaw: (raw: string) => ScopedStorageParse;
  write: (data: Record<string, unknown>) => void;
  clear: () => void;
};

/** Plain string value (dex game selection, JSON blobs). */
export type RawStringStorageClient = {
  readonly key: string;
  subscribe: (listener: () => void) => () => void;
  read: () => string | null;
  write: (value: string) => void;
  clear: () => void;
};

/** Presence flag stored as `"1"` when enabled. */
export type RawFlagStorageClient = {
  readonly key: string;
  subscribe: (listener: () => void) => () => void;
  read: () => boolean;
  write: (enabled: boolean) => void;
  clear: () => void;
};

export type AppStorageClient =
  | EnvelopeStorageClient
  | RawStringStorageClient
  | RawFlagStorageClient;
