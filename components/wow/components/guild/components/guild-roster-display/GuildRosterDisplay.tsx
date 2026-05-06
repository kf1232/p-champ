"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";

import {
  getGuildCrestThemeCssVars,
  mapGuildRosterPayloadToDisplay,
  type GuildRosterDisplayModel,
  type GuildRosterMemberRow,
} from "@/lib/wow";
import { WOW_CHARACTER_PATH } from "@/lib/site";
import { CHARACTER_PROFILE_SUMMARY_QUERY } from "@/lib/wow/api/characterProfileSummaryApi";
import {
  WOW_PROFILE_API_REGIONS,
  type WowProfileApiRegionId,
} from "@/lib/wow/battle-net/battleNetProfileRegions";

export type GuildRosterDisplayProps = {
  roster: unknown | null;
  /** Guild profile summary JSON from the same lookup; drives crest theming. */
  guildProfileSummary?: unknown;
};

function resolveCharacterLookupRegion(
  parsed: string | null,
): WowProfileApiRegionId {
  if (parsed && WOW_PROFILE_API_REGIONS.some((r) => r.value === parsed)) {
    return parsed as WowProfileApiRegionId;
  }
  return "us";
}

function buildCharacterLookupHref(row: GuildRosterMemberRow): string | null {
  const realm = row.characterRealmSlug?.trim();
  const name = row.name?.trim();
  if (!realm || !name) return null;
  const region = resolveCharacterLookupRegion(row.characterLookupRegion);
  const q = new URLSearchParams();
  q.set(CHARACTER_PROFILE_SUMMARY_QUERY.region, region);
  q.set(CHARACTER_PROFILE_SUMMARY_QUERY.realmSlug, realm);
  q.set(CHARACTER_PROFILE_SUMMARY_QUERY.characterName, name);
  return `${WOW_CHARACTER_PATH}?${q.toString()}`;
}

function isLevel90OrAbove(level: number | null): boolean {
  return level != null && level >= 90;
}

function GuildRosterTableBody({ rows }: { rows: GuildRosterMemberRow[] }) {
  return (
    <tbody>
      {rows.map((row, i) => (
        <tr key={`${i}-${row.name}-${row.profileHref ?? ""}`}>
          <td className="guild-roster-table-num">
            {row.rank != null ? row.rank : "—"}
          </td>
          <td className="guild-roster-table-name">{row.name}</td>
          <td className="guild-roster-table-num">
            {row.level != null ? row.level : "—"}
          </td>
          <td>{row.classDisplayName}</td>
          <td>{row.factionType ?? "—"}</td>
          <td>
            {(() => {
              const href = buildCharacterLookupHref(row);
              return href ? (
                <Link href={href} className="guild-roster-table-link">
                  Lookup
                </Link>
              ) : (
                "—"
              );
            })()}
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function GuildRosterBody({ model }: { model: GuildRosterDisplayModel }) {
  const [showUnderlevel, setShowUnderlevel] = useState(false);

  const { underlevelCount, visibleRows } = useMemo(() => {
    const under = model.rows.filter((r) => !isLevel90OrAbove(r.level));
    const visible = showUnderlevel
      ? model.rows
      : model.rows.filter((r) => isLevel90OrAbove(r.level));
    return { underlevelCount: under.length, visibleRows: visible };
  }, [model.rows, showUnderlevel]);

  return (
    <>
      <div className="guild-roster-display-header">
        <h2 className="guild-roster-display-title">Guild Roster</h2>
        {underlevelCount > 0 ? (
          <button
            type="button"
            className="guild-roster-filter-toggle"
            onClick={() => setShowUnderlevel((v) => !v)}
            aria-pressed={showUnderlevel}
          >
            {showUnderlevel
              ? "Show level 90+ only"
              : `Show ${underlevelCount.toLocaleString()} under level 90`}
          </button>
        ) : null}
      </div>

      {model.rows.length === 0 ? (
        <p className="guild-roster-display-empty">
          Roster has no member entries.
        </p>
      ) : visibleRows.length === 0 ? (
        <p className="guild-roster-display-empty">
          No members at level 90 or above.
        </p>
      ) : (
        <div className="guild-roster-table-wrap">
          <table className="guild-roster-table">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Character</th>
                <th scope="col" className="guild-roster-table-num">
                  Lv
                </th>
                <th scope="col">Class</th>
                <th scope="col">Faction</th>
                <th scope="col">Lookup</th>
              </tr>
            </thead>
            <GuildRosterTableBody rows={visibleRows} />
          </table>
        </div>
      )}
    </>
  );
}

export function GuildRosterDisplay({
  roster,
  guildProfileSummary,
}: GuildRosterDisplayProps) {
  const crestThemeStyle = useMemo(
    () =>
      getGuildCrestThemeCssVars(guildProfileSummary) as
        | CSSProperties
        | undefined,
    [guildProfileSummary],
  );

  const model = useMemo(
    () => (roster != null ? mapGuildRosterPayloadToDisplay(roster) : null),
    [roster],
  );

  if (roster === null) {
    return (
      <section
        className="guild-roster-display"
        style={crestThemeStyle}
        aria-label="Guild Roster"
      >
        <h2 className="guild-roster-display-title">Guild Roster</h2>
        <p className="guild-roster-display-empty">
          No roster loaded for this lookup yet.
        </p>
      </section>
    );
  }

  if (!model) {
    return (
      <section
        className="guild-roster-display"
        style={crestThemeStyle}
        aria-label="Guild Roster"
      >
        <h2 className="guild-roster-display-title">Guild Roster</h2>
        <p className="guild-roster-display-fallback">
          Roster response could not be read as a member list.
        </p>
      </section>
    );
  }

  return (
    <section
      className="guild-roster-display"
      style={crestThemeStyle}
      aria-label="Guild Roster"
    >
      <GuildRosterBody
        key={`${model.guildName ?? ""}|${model.guildRealm ?? ""}|${model.memberTotal}`}
        model={model}
      />
    </section>
  );
}
