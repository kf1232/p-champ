"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import {
  hasDrivingRoutingIssues,
  type ProximityRoutingDiagnostics,
} from "@/lib/burke";

import { DrivingRoutingDiagnosticsPanel } from "./DrivingRoutingDiagnosticsPanel";

type DrivingRoutingDiagnosticsOverlayProps = {
  diagnostics: ProximityRoutingDiagnostics;
  /** Map: badge over the map. Inline: standalone when the map has no pins. */
  placement?: "map" | "inline";
};

function routingAlertSummary(diagnostics: ProximityRoutingDiagnostics): string {
  const { unroutedCount, likelyRootCause } = diagnostics;
  const places =
    unroutedCount === 1 ? "1 location" : `${unroutedCount} locations`;
  return `${likelyRootCause.title} — ${places} could not be routed. Click for details.`;
}

export function DrivingRoutingDiagnosticsOverlay({
  diagnostics,
  placement = "map",
}: DrivingRoutingDiagnosticsOverlayProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const summary = routingAlertSummary(diagnostics);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!hasDrivingRoutingIssues(diagnostics)) {
    return null;
  }

  const modal =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            className="location-finder-diagnostics-modal-backdrop"
            role="presentation"
            onMouseDown={(ev) => {
              if (ev.target === ev.currentTarget) {
                handleClose();
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="location-finder-diagnostics-modal-dialog"
            >
              <div className="location-finder-diagnostics-modal-header">
                <h2 id={titleId} className="location-finder-diagnostics-modal-title">
                  Driving route issues
                </h2>
                <button
                  type="button"
                  className="location-finder-diagnostics-modal-close"
                  onClick={handleClose}
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
              <div className="location-finder-diagnostics-modal-body">
                <DrivingRoutingDiagnosticsPanel diagnostics={diagnostics} />
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        className={`location-finder-routing-alert-btn location-finder-routing-alert-btn--${placement}`}
        title={summary}
        aria-label={summary}
        onClick={() => setOpen(true)}
      >
        <span className="location-finder-routing-alert-btn-label" aria-hidden>
          !
        </span>
        <span>
          {diagnostics.unroutedCount}{" "}
          {diagnostics.unroutedCount === 1
            ? "unrouted location"
            : "unrouted locations"}
        </span>
      </button>
      {modal}
    </>
  );
}
