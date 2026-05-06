"use client";

import { useMemo, type CSSProperties } from "react";

import {
  getGuildCrestThemeCssVars,
  mapGuildProfileSummaryToDisplay,
} from "@/lib/wow";

export type GuildProfileDisplayProps = {
  profile: unknown;
};

export function GuildProfileDisplay({ profile }: GuildProfileDisplayProps) {
  const model = useMemo(
    () => mapGuildProfileSummaryToDisplay(profile),
    [profile],
  );

  const crestThemeStyle = useMemo(
    () => getGuildCrestThemeCssVars(profile) as CSSProperties | undefined,
    [profile],
  );

  if (!model) {
    return (
      <p className="guild-profile-display-fallback">
        Guild profile could not be read from this response.
      </p>
    );
  }

  const createdLabel =
    model.createdAtMs != null
      ? new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(model.createdAtMs))
      : "—";

  const realmLine = model.realmName?.trim() ? model.realmName : "—";

  return (
    <section
      className="guild-profile-display"
      style={crestThemeStyle}
      aria-label="Guild profile summary"
    >
      <div className="guild-profile-display-header">
        <h2 className="guild-profile-display-title">
          {model.name ?? "Guild"}
        </h2>
        <p className="guild-profile-display-sub">{realmLine}</p>
      </div>

      <dl className="guild-profile-display-dl">
        <div className="guild-profile-display-dl-row">
          <dt className="guild-profile-display-dt">Faction</dt>
          <dd className="guild-profile-display-dd">
            {model.factionName ?? "—"}
          </dd>
        </div>
        <div className="guild-profile-display-dl-row">
          <dt className="guild-profile-display-dt">Members</dt>
          <dd className="guild-profile-display-dd">
            {model.memberCount != null
              ? model.memberCount.toLocaleString()
              : "—"}
          </dd>
        </div>
        <div className="guild-profile-display-dl-row">
          <dt className="guild-profile-display-dt">Achievement points</dt>
          <dd className="guild-profile-display-dd">
            {model.achievementPoints != null
              ? model.achievementPoints.toLocaleString()
              : "—"}
          </dd>
        </div>
        <div className="guild-profile-display-dl-row">
          <dt className="guild-profile-display-dt">Created</dt>
          <dd className="guild-profile-display-dd">{createdLabel}</dd>
        </div>
      </dl>
    </section>
  );
}
