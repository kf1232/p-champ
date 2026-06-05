import {
  SCHEDULER_ALLOWED_DATA_KEYS,
  SCHEDULER_TOOL_ID,
  type SchedulerAllowedDataKey,
} from "./cacheKeys";
import type { SchedulerStoredData } from "./types";

export function sanitizeSchedulerStoredData(
  data: Record<string, unknown>,
): SchedulerStoredData {
  const out: SchedulerStoredData = {};
  for (const key of SCHEDULER_ALLOWED_DATA_KEYS) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      out[key] = data[key as SchedulerAllowedDataKey];
    }
  }
  return out;
}

export type SchedulerCacheEnvelope = {
  v: 1;
  tool: typeof SCHEDULER_TOOL_ID;
  storedAt: number;
  data: SchedulerStoredData;
};

export function serializeSchedulerCacheEnvelope(
  storedAt: number,
  data: SchedulerStoredData,
): string {
  const envelope: SchedulerCacheEnvelope = {
    v: 1,
    tool: SCHEDULER_TOOL_ID,
    storedAt,
    data: sanitizeSchedulerStoredData(data),
  };
  return JSON.stringify(envelope);
}

export function formatSchedulerCacheExport(
  storedAt: number | null,
  data: SchedulerStoredData,
  storageKey: string,
): string {
  if (storedAt === null) {
    return JSON.stringify(
      {
        tool: SCHEDULER_TOOL_ID,
        storageKey,
        empty: true,
      },
      null,
      2,
    );
  }

  return JSON.stringify(
    {
      tool: SCHEDULER_TOOL_ID,
      storageKey,
      storedAt,
      data: sanitizeSchedulerStoredData(data),
    },
    null,
    2,
  );
}
