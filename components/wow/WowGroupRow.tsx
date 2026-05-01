import Link from "next/link";

import type {
  WowGroupEntry,
  WowGroupMemberMetrics,
} from "./config/wowRosterConfig";

type WowGroupRowProps = {
  group: WowGroupEntry;
  metrics: WowGroupMemberMetrics;
  /** Password-gated groups link to `/wow?gate=…` so the detail route never runs until unlocked. */
  detailHref: string;
};

export function WowGroupRow({ group, metrics, detailHref }: WowGroupRowProps) {
  const { name, scheduleLabel, linkUrl } = group;
  const hasLink = typeof linkUrl === "string" && linkUrl.length > 0;

  return (
    <article
      className="wow-entry-article wow-group-row-card"
      aria-label={`Scheduled group: ${name}`}
    >
      <Link
        href={detailHref}
        className="wow-group-row-overlay-link"
        aria-label={`Open details for ${name}`}
      />

      <section
        aria-label="Group"
        className="wow-entry-info wow-group-row-pane"
      >
        <h2 className="wow-group-detail-title">{name}</h2>
        <p className="wow-group-schedule">{scheduleLabel}</p>
        {hasLink ? (
          <p className="wow-group-link-wrap wow-group-external-link-wrap">
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wow-group-link wow-group-external-link"
            >
              Group link
            </a>
          </p>
        ) : null}
      </section>

      <section
        aria-label="Roster counts"
        className="wow-entry-metrics-section wow-group-row-pane"
      >
        <div className="wow-entry-metrics-inner wow-group-counts-inner">
          <p className="wow-group-metrics-lead">Members: {metrics.members}</p>
          <p className="wow-group-metrics-sub">
            (Tank {metrics.tank}, Heal {metrics.heal}, DPS {metrics.dps})
          </p>
        </div>
      </section>
    </article>
  );
}
