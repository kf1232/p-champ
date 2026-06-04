import { createEnvelopeStorageClient } from "@/lib/storage/internal/envelopeClient";

import { APP_STORAGE_KEYS } from "@/lib/storage/keys";

import { LOCATION_FINDER_TOOL_ID } from "./locationFinderCacheKeys";
import {
  sanitizeLocationFinderStoredData,
  serializeLocationFinderCacheEnvelope,
} from "./locationFinderScopedData";

const SEVEN_DAY_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Burke Location Finder envelope client (registered with `appLocalStorage`). */
export function createBurkeLocationFinderEnvelopeClient() {
  return createEnvelopeStorageClient({
    key: APP_STORAGE_KEYS.burkeLocationFinder,
    ttlMs: SEVEN_DAY_TTL_MS,
    expectedToolId: LOCATION_FINDER_TOOL_ID,
    sanitize: sanitizeLocationFinderStoredData,
    canonicalizeOnRead: true,
    serialize: (storedAt, data) =>
      serializeLocationFinderCacheEnvelope(
        storedAt,
        data as Parameters<typeof serializeLocationFinderCacheEnvelope>[1],
      ),
  });
}
