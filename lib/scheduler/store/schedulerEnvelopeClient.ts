import { createEnvelopeStorageClient } from "@/lib/storage/internal/envelopeClient";
import { APP_STORAGE_KEYS } from "@/lib/storage/keys";

import { SCHEDULER_TOOL_ID } from "./cacheKeys";
import { SCHEDULER_STORAGE_TTL_MS } from "./constants";
import {
  sanitizeSchedulerStoredData,
  serializeSchedulerCacheEnvelope,
} from "./schedulerScopedData";

/** Scheduler envelope client (registered with `appLocalStorage`). */
export function createSchedulerEnvelopeClient() {
  return createEnvelopeStorageClient({
    key: APP_STORAGE_KEYS.scheduler,
    ttlMs: SCHEDULER_STORAGE_TTL_MS,
    expectedToolId: SCHEDULER_TOOL_ID,
    sanitize: sanitizeSchedulerStoredData,
    canonicalizeOnRead: true,
    serialize: (storedAt, data) =>
      serializeSchedulerCacheEnvelope(
        storedAt,
        data as Parameters<typeof serializeSchedulerCacheEnvelope>[1],
      ),
  });
}
