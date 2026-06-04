import type { AppStorageFooterConfig } from "../AppStorageFooterContext";

export function downloadStorageCacheFile(
  filenamePrefix: string,
  body: string,
): void {
  const ts = new Date().toISOString().replaceAll(":", "-").slice(0, 19);
  const blob = new Blob([body], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filenamePrefix}-${ts}.json`;
  a.rel = "noopener";
  a.click();
  URL.revokeObjectURL(url);
}

export type EnvelopeStorageFooterInput = {
  ariaLabel: string;
  ttlMs: number;
  storedAt: number | null;
  cacheByteSize: number;
  serviceId: string;
  downloadFilenamePrefix: string;
  getDownloadBody: () => string;
  onClear: () => void;
  clearConfirmMessage: string;
};

/** Shared contract for TTL envelope services (WoW, Burke Location Finder, …). */
export function createEnvelopeStorageFooterConfig(
  input: EnvelopeStorageFooterInput,
): AppStorageFooterConfig {
  return {
    ariaLabel: input.ariaLabel,
    ttlMs: input.ttlMs,
    storedAt: input.storedAt,
    cacheByteSize: input.cacheByteSize,
    serviceId: input.serviceId,
    clearConfirmMessage: input.clearConfirmMessage,
    onClear: input.onClear,
    onDownload: () => {
      downloadStorageCacheFile(
        input.downloadFilenamePrefix,
        input.getDownloadBody(),
      );
    },
  };
}
