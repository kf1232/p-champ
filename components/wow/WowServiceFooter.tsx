"use client";

import { useEffect, useMemo, useState } from "react";

import { ViewportLockedFooterBar } from "@/components/commons";
import {
  getWowServiceStorageSnapshot,
  WOW_SERVICE_LOCAL_STORAGE_KEY,
  WOW_SERVICE_STORAGE_TTL_MS,
} from "@/lib/wow";
import { VIEWPORT_WOW_STATS_FOOTER_ARIA } from "@/lib/viewportFooterChrome";

import { useWowServiceStorage } from "./WowServiceStorageProvider";

function formatByteSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"] as const;
  const i = Math.min(
    sizes.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k))
  );
  const n = bytes / k ** i;
  const digits = i === 0 ? 0 : n >= 10 ? 0 : 1;
  return `${n.toFixed(digits)} ${sizes[i]}`;
}

function formatTimeToTtlEnd(msRemaining: number): string {
  if (msRemaining <= 0) return "0s";
  let rest = Math.floor(msRemaining / 1000);
  const s = rest % 60;
  rest = Math.floor(rest / 60);
  const m = rest % 60;
  rest = Math.floor(rest / 60);
  const h = rest % 24;
  const d = Math.floor(rest / 24);
  const parts: string[] = [];
  if (d) parts.push(`${d}d`);
  if (d || h) parts.push(`${h}h`);
  if (d || h || m) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

export function WowServiceFooter() {
  const { storedAt, cacheByteSize } = useWowServiceStorage();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const msRemaining = useMemo(() => {
    if (storedAt === null) return null;
    return storedAt + WOW_SERVICE_STORAGE_TTL_MS - now;
  }, [storedAt, now]);

  const ttlLabel =
    msRemaining === null ? "—" : formatTimeToTtlEnd(msRemaining);

  const downloadCacheFile = () => {
    const raw = getWowServiceStorageSnapshot();
    let body: string;
    if (!raw) {
      body = JSON.stringify(
        {
          message: "No active WoW service cache (empty or expired TTL).",
          storageKey: WOW_SERVICE_LOCAL_STORAGE_KEY,
        },
        null,
        2,
      );
    } else {
      try {
        body = JSON.stringify(JSON.parse(raw), null, 2);
      } catch {
        body = raw;
      }
    }
    const ts = new Date().toISOString().replaceAll(":", "-").slice(0, 19);
    const blob = new Blob([body], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `p-champ-wow-service-cache-${ts}.json`;
    a.rel = "noopener";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ViewportLockedFooterBar
      ariaLabel={VIEWPORT_WOW_STATS_FOOTER_ARIA}
      className="wow-service-footer-bar"
    >
      <div className="wow-service-footer-inner">
        <p className="wow-service-footer-line">
          <span className="wow-service-footer-label">Cache : </span>
          <span className="wow-service-footer-value">
            {formatByteSize(cacheByteSize)}
          </span>
        </p>
        <span className="wow-service-footer-divider" aria-hidden>
          |
        </span>
        <p className="wow-service-footer-line">
          <span className="wow-service-footer-label">TTL : </span>
          <span className="wow-service-footer-value">{ttlLabel}</span>
        </p>
        <span className="wow-service-footer-divider" aria-hidden>
          |
        </span>
        <button
          type="button"
          className="wow-service-footer-cache-download"
          onClick={downloadCacheFile}
        >
          Download cache
        </button>
      </div>
    </ViewportLockedFooterBar>
  );
}
