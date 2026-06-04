"use client";

import { useCallback, useMemo } from "react";

import { useRegisterAppStorageFooter } from "@/components/commons/AppStorageFooterContext";
import { createEnvelopeStorageFooterConfig } from "@/components/commons/utils/storageFooterActions";
import {
  exportLocationFinderCacheDownloadBody,
  LOCATION_FINDER_FOOTER_CLEAR_CONFIRM,
  LOCATION_FINDER_STORAGE_TTL_MS,
  LOCATION_FINDER_TOOL_ID,
} from "@/lib/burke/location-finder/store";
import { VIEWPORT_BURKE_LOCATION_FINDER_FOOTER_ARIA } from "@/lib/viewportFooterChrome";

import { useLocationFinderStorage } from "./providers/LocationFinderStorageProvider";

export function LocationFinderStorageFooterRegistration() {
  const { storedAt, cacheByteSize, clear } = useLocationFinderStorage();

  const getDownloadBody = useCallback(
    () => exportLocationFinderCacheDownloadBody(),
    [],
  );

  const config = useMemo(
    () =>
      createEnvelopeStorageFooterConfig({
        ariaLabel: VIEWPORT_BURKE_LOCATION_FINDER_FOOTER_ARIA,
        ttlMs: LOCATION_FINDER_STORAGE_TTL_MS,
        storedAt,
        cacheByteSize,
        serviceId: LOCATION_FINDER_TOOL_ID,
        downloadFilenamePrefix: "p-champ-burke-location-finder-cache",
        getDownloadBody,
        onClear: clear,
        clearConfirmMessage: LOCATION_FINDER_FOOTER_CLEAR_CONFIRM,
      }),
    [storedAt, cacheByteSize, getDownloadBody, clear],
  );

  useRegisterAppStorageFooter(config);
  return null;
}
