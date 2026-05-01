"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import { WOW_HOME_PATH } from "@/lib/site";

import { WowGroupPasswordGate } from "./WowGroupPasswordGate";

type WowGroupGateModalProps = {
  groupId: string;
  groupName: string;
  scheduleLabel: string;
  /** Absolute path to navigate after successful password (e.g. `/wow/groups/tuesday-raid`). */
  afterSuccessHref: string;
};

export function WowGroupGateModal({
  groupId,
  groupName,
  scheduleLabel,
  afterSuccessHref,
}: WowGroupGateModalProps) {
  const router = useRouter();

  const dismissToSelector = useCallback(() => {
    router.replace(WOW_HOME_PATH);
  }, [router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismissToSelector();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismissToSelector]);

  return (
    <div
      className="wow-group-gate-modal-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`wow-gate-modal-title-${groupId}`}
    >
      <div
        role="presentation"
        className="wow-group-gate-modal-backdrop"
        onClick={dismissToSelector}
      />
      <div className="wow-group-gate-modal-panel">
        <button
          type="button"
          className="wow-group-gate-modal-close"
          aria-label="Close"
          onClick={dismissToSelector}
        >
          ×
        </button>
        <WowGroupPasswordGate
          groupId={groupId}
          groupName={groupName}
          scheduleLabel={scheduleLabel}
          variant="compact"
          afterSuccessHref={afterSuccessHref}
          titleId={`wow-gate-modal-title-${groupId}`}
        />
      </div>
    </div>
  );
}
