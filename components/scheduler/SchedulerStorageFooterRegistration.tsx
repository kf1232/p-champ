"use client";

import { useCallback, useMemo } from "react";

import {
  createEnvelopeStorageFooterConfig,
  useRegisterAppStorageFooter,
} from "@/components/commons";
import {
  exportSchedulerCacheDownloadBody,
  SCHEDULER_FOOTER_CLEAR_CONFIRM,
  SCHEDULER_STORAGE_TTL_MS,
  SCHEDULER_TOOL_ID,
} from "@/lib/scheduler";
import { VIEWPORT_SCHEDULER_LOCAL_CACHE_FOOTER_ARIA } from "@/lib/viewportFooterChrome";

import { useSchedulerStorage } from "./SchedulerStorageProvider";

export function SchedulerStorageFooterRegistration() {
  const { storedAt, cacheByteSize, clear } = useSchedulerStorage();

  const getDownloadBody = useCallback(
    () => exportSchedulerCacheDownloadBody(),
    [],
  );

  const config = useMemo(
    () =>
      createEnvelopeStorageFooterConfig({
        ariaLabel: VIEWPORT_SCHEDULER_LOCAL_CACHE_FOOTER_ARIA,
        ttlMs: SCHEDULER_STORAGE_TTL_MS,
        storedAt,
        cacheByteSize,
        serviceId: SCHEDULER_TOOL_ID,
        downloadFilenamePrefix: "p-champ-scheduler-cache",
        getDownloadBody,
        onClear: clear,
        clearConfirmMessage: SCHEDULER_FOOTER_CLEAR_CONFIRM,
      }),
    [storedAt, cacheByteSize, getDownloadBody, clear],
  );

  useRegisterAppStorageFooter(config);
  return null;
}
