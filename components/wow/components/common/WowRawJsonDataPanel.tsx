"use client";

import { useWowDebugRawPanels } from "@/components/wow/components/providers/WowDebugRawPanelsContext";

import "./styles/wowRawJsonDataPanel.css";

export type WowRawDataFreshness = "live" | "cache" | "error";

export type WowRawJsonDataPanelProps = {
  /** Shown top-left (e.g. “Guild Roster”, “Character Profile”). */
  title: string;
  /** Data freshness chip top-right. */
  freshness: WowRawDataFreshness;
  /**
   * Raw body inside the scrollable `<pre>`: objects/arrays are `JSON.stringify`’d;
   * strings are shown as-is.
   */
  rawBody: unknown;
  className?: string;
};

const FRESHNESS_LABEL: Record<WowRawDataFreshness, string> = {
  live: "Live",
  cache: "Cache",
  error: "Error",
};

function isRedactedBattleNetApiUrlString(s: string): boolean {
  const t = s.trim();
  if (!/^https?:\/\//i.test(t)) return false;
  const l = t.toLowerCase();
  return (
    l.includes("battle.net") ||
    l.includes("blizzard.com") ||
    l.includes("api.blizzard.com") ||
    l.includes("/data/wow/") ||
    l.includes("/profile/world-of-warcraft") ||
    l.includes("/profile/wow/")
  );
}

function formatRawBody(rawBody: unknown): string {
  if (rawBody === undefined) return "";
  if (typeof rawBody === "string") {
    return isRedactedBattleNetApiUrlString(rawBody) ? "[removed]" : rawBody;
  }
  try {
    return JSON.stringify(rawBody, (_k, v) => {
      if (typeof v === "string" && isRedactedBattleNetApiUrlString(v)) {
        return "[removed]";
      }
      return v;
    }, 2);
  } catch {
    return String(rawBody);
  }
}

export function WowRawJsonDataPanel({
  title,
  freshness,
  rawBody,
  className,
}: WowRawJsonDataPanelProps) {
  const { enabled: rawDebugEnabled } = useWowDebugRawPanels();
  if (!rawDebugEnabled) return null;

  const text = formatRawBody(rawBody);
  const rootClass = ["wow-raw-json-data-panel", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={rootClass} aria-label={title}>
      <header className="wow-raw-json-data-panel__header">
        <h3 className="wow-raw-json-data-panel__title">{title}</h3>
        <span
          className={`wow-raw-json-data-panel__chip wow-raw-json-data-panel__chip--${freshness}`}
          data-freshness={freshness}
          role="status"
        >
          {FRESHNESS_LABEL[freshness]}
        </span>
      </header>
      <div className="wow-raw-json-data-panel__body">
        <pre className="wow-raw-json-data-panel__pre">{text}</pre>
      </div>
    </section>
  );
}
