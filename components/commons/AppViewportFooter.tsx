"use client";

import { useEffect, useMemo, useState } from "react";

import {
  VIEWPORT_BLANK_FOOTER_ARIA,
  type ViewportBlankFooterKey,
} from "@/lib/viewportFooterChrome";

import {
  useAppStorageFooterConfig,
  type AppStorageFooterConfig,
} from "./AppStorageFooterContext";
import { ViewportLockedFooterBar } from "./ViewportLockedFooterBar";
import {
  formatFooterByteSize,
  formatFooterTtlRemaining,
} from "./utils/footerFormat";

type AppViewportFooterProps = {
  /** Used when no service registers a local-storage footer on this page. */
  blankFooter?: ViewportBlankFooterKey;
};

export function AppViewportFooter({ blankFooter }: AppViewportFooterProps) {
  const storage = useAppStorageFooterConfig();

  if (storage) {
    return <AppViewportStorageFooter config={storage} />;
  }

  if (!blankFooter) {
    return null;
  }

  return (
    <ViewportLockedFooterBar
      ariaLabel={VIEWPORT_BLANK_FOOTER_ARIA[blankFooter]}
    />
  );
}

function AppViewportStorageFooter({
  config,
}: {
  config: AppStorageFooterConfig;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const msRemaining = useMemo(() => {
    if (config.storedAt === null) {
      return null;
    }
    return config.storedAt + config.ttlMs - now;
  }, [config.storedAt, config.ttlMs, now]);

  const ttlLabel =
    msRemaining === null ? "—" : formatFooterTtlRemaining(msRemaining);

  const actionsDisabled = config.cacheByteSize === 0;

  const clearCache = () => {
    if (actionsDisabled) {
      return;
    }
    const ok = window.confirm(config.clearConfirmMessage);
    if (!ok) {
      return;
    }
    config.onClear();
  };

  return (
    <ViewportLockedFooterBar
      ariaLabel={config.ariaLabel}
      className="app-viewport-footer-bar"
    >
      <div className="app-viewport-footer-inner">
        <p className="app-viewport-footer-line">
          <span className="app-viewport-footer-label">Cache : </span>
          <span className="app-viewport-footer-value">
            {formatFooterByteSize(config.cacheByteSize)}
          </span>
          <span className="sr-only"> for {config.serviceId}</span>
        </p>
        <span className="app-viewport-footer-divider" aria-hidden>
          |
        </span>
        <p className="app-viewport-footer-line">
          <span className="app-viewport-footer-label">TTL : </span>
          <span className="app-viewport-footer-value">{ttlLabel}</span>
        </p>
        <span className="app-viewport-footer-divider" aria-hidden>
          |
        </span>
        <button
          type="button"
          className="app-viewport-footer-action"
          onClick={config.onDownload}
          disabled={actionsDisabled}
        >
          Download cache
        </button>
        <span className="app-viewport-footer-divider" aria-hidden>
          |
        </span>
        <button
          type="button"
          className="app-viewport-footer-action app-viewport-footer-action--clear"
          onClick={clearCache}
          disabled={actionsDisabled}
        >
          Clear cache
        </button>
      </div>
    </ViewportLockedFooterBar>
  );
}
