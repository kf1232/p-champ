"use client";

import { useCallback, useMemo } from "react";

import { useRegisterAppStorageFooter } from "@/components/commons/AppStorageFooterContext";
import { createEnvelopeStorageFooterConfig } from "@/components/commons/utils/storageFooterActions";
import {
  getWowServiceStorageSnapshot,
  WOW_SERVICE_FOOTER_CLEAR_CONFIRM,
  WOW_SERVICE_LOCAL_STORAGE_KEY,
  WOW_SERVICE_STORAGE_TTL_MS,
  WOW_SERVICE_TOOL_ID,
} from "@/lib/wow";
import { VIEWPORT_WOW_STATS_FOOTER_ARIA } from "@/lib/viewportFooterChrome";

import { useWowServiceStorage } from "../providers/WowServiceStorageProvider";

export function WowStorageFooterRegistration() {
  const { storedAt, cacheByteSize, clear } = useWowServiceStorage();

  const getDownloadBody = useCallback(() => {
    const raw = getWowServiceStorageSnapshot();
    if (!raw) {
      return JSON.stringify(
        {
          message: "No active WoW service cache (empty or expired TTL).",
          storageKey: WOW_SERVICE_LOCAL_STORAGE_KEY,
        },
        null,
        2,
      );
    }
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  }, []);

  const config = useMemo(
    () =>
      createEnvelopeStorageFooterConfig({
        ariaLabel: VIEWPORT_WOW_STATS_FOOTER_ARIA,
        ttlMs: WOW_SERVICE_STORAGE_TTL_MS,
        storedAt,
        cacheByteSize,
        serviceId: WOW_SERVICE_TOOL_ID,
        downloadFilenamePrefix: "p-champ-wow-service-cache",
        getDownloadBody,
        onClear: clear,
        clearConfirmMessage: WOW_SERVICE_FOOTER_CLEAR_CONFIRM,
      }),
    [storedAt, cacheByteSize, getDownloadBody, clear],
  );

  useRegisterAppStorageFooter(config);
  return null;
}
