"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

/** Circular arrows — universal “reload / sync” affordance (outline stroke icon). */
function RefreshCwIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  );
}

type WowArmoryLinkWithRefreshProps = {
  profileUrl: string;
  characterLabel: string;
  /** Column layout: refresh on top, then Armory link (group roster grid). */
  variant?: "inline" | "stack";
};

export function WowArmoryLinkWithRefresh({
  profileUrl,
  characterLabel,
  variant = "inline",
}: WowArmoryLinkWithRefreshProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const refreshBtn = (
    <button
      type="button"
      className="wow-group-roster-sync-btn"
      onClick={() => {
        startTransition(() => {
          void fetch("/api/wow/clear-profile-cache", { method: "POST" }).then(
            () => {
              router.refresh();
            },
          );
        });
      }}
      disabled={isPending}
      aria-busy={isPending}
      title={`Refresh Battle.net data for ${characterLabel}`}
      aria-label={`Refresh Battle.net data for ${characterLabel}`}
    >
      <RefreshCwIcon className="wow-group-roster-sync-icon" />
    </button>
  );

  const armoryLink = (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="wow-group-roster-armory-link"
    >
      Armory
    </a>
  );

  return (
    <span
      className={
        variant === "stack"
          ? "wow-group-roster-armory-actions wow-group-roster-armory-actions--stack"
          : "wow-group-roster-armory-actions"
      }
    >
      {variant === "stack" ? (
        <>
          {refreshBtn}
          {armoryLink}
        </>
      ) : (
        <>
          {armoryLink}
          {refreshBtn}
        </>
      )}
    </span>
  );
}
