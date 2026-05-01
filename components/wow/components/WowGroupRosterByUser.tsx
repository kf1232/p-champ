"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  WowCharacterForDisplay,
  WowMythicBestRunForDisplay,
  WowStatTier,
} from "@/lib/wow/battleNetCharacterProfile";
import {
  aggregateBestRunsForSeasonGrid,
  MYTHIC_SEASON_GRID_SLOT_COUNT,
  MYTHIC_SEASON_GRID_SLOT_LABELS,
  orderMythicRunsIntoSeasonGrid,
} from "@/lib/wow/mythicKeystoneSeasonGridOrder";
import { mythicDungeonChipShortLabel } from "@/lib/wow/mythicDungeonShortLabel";
import type { WowRoleSlots } from "../config/wowRoleTypes";
import type { WowUserEntry } from "../config/wowRosterConfig";
import { WowArmoryLinkWithRefresh } from "./WowArmoryLinkWithRefresh";

function ChevronExpandIcon({
  expanded,
  className,
}: {
  expanded: boolean;
  className?: string;
}) {
  return (
    <svg
      className={[
        "wow-group-roster-user-chevron",
        expanded ? "wow-group-roster-user-chevron--expanded" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 9 6 6 6-6"
      />
    </svg>
  );
}

function tierTitle(kind: "ilvl" | "mplus", tier: WowStatTier): string | undefined {
  switch (tier) {
    case "live":
      return kind === "ilvl"
        ? "From Battle.net Profile API (equipped / average item level)."
        : "From Battle.net Profile API (mythic_rating).";
    case "snapshot":
      return "Value from roster JSON (manual snapshot).";
    case "blocked-unconfigured":
      return "Live Battle.net data not requested—add BATTLENET_CLIENT_ID and BATTLENET_CLIENT_SECRET, or no armory URL on this row.";
    case "blocked-private":
      return kind === "ilvl"
        ? "Armory URL present but API returned no item level—character may be private, wrong realm/name, or transient API error."
        : "Unused for M+ — row hidden when there is no score.";
    default:
      return undefined;
  }
}

function hasNumericMythicPlus(score: number | null): boolean {
  return typeof score === "number" && !Number.isNaN(score);
}

/** Circular check — keystone completed in time. */
function KeystoneTimedCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 6L9 17l-5-5"
      />
    </svg>
  );
}

/** X — keystone over time / not timed. */
function KeystoneUntimedXIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 6L6 18M6 6l12 12"
      />
    </svg>
  );
}

function mythicKeyAriaStatus(r: WowMythicBestRunForDisplay): string {
  return r.completedInTime
    ? `+${r.keystoneLevel}, completed in time`
    : `+${r.keystoneLevel}, not in time`;
}

function MythicKeystoneGrid({
  slots,
  ariaLabel = "Mythic Keystone season best runs (four by two grid)",
}: {
  slots: readonly (WowMythicBestRunForDisplay | null)[];
  ariaLabel?: string;
}) {
  return (
    <ul className="wow-group-roster-mplus-grid" aria-label={ariaLabel}>
      {Array.from({ length: MYTHIC_SEASON_GRID_SLOT_COUNT }, (_, i) => {
        const r = slots[i];
        return (
          <li key={i} className="wow-group-roster-mplus-cell">
            {r ? (
              <span
                className="wow-group-roster-mplus-chip"
                title={r.dungeonName}
                aria-label={`${r.dungeonName}, ${mythicKeyAriaStatus(r)}`}
              >
                <span className="wow-group-roster-mplus-chip-short">
                  {mythicDungeonChipShortLabel(r.dungeonName, r.dungeonId)}
                </span>
                <span className="wow-group-roster-mplus-chip-status">
                  <span className="wow-group-roster-mplus-chip-levelnum">
                    +{r.keystoneLevel}
                  </span>
                  <span
                    className={
                      r.completedInTime
                        ? "wow-group-roster-mplus-chip-icon wow-group-roster-mplus-chip-icon--timed"
                        : "wow-group-roster-mplus-chip-icon wow-group-roster-mplus-chip-icon--untimed"
                    }
                    title={r.completedInTime ? "In time" : "Not in time"}
                  >
                    {r.completedInTime ? (
                      <KeystoneTimedCheckIcon />
                    ) : (
                      <KeystoneUntimedXIcon />
                    )}
                  </span>
                </span>
              </span>
            ) : (
              <div
                className="wow-group-roster-mplus-slot-placeholder"
                title={`No key: ${MYTHIC_SEASON_GRID_SLOT_LABELS[i]}`}
                aria-label={`No Mythic+ data for ${MYTHIC_SEASON_GRID_SLOT_LABELS[i]}`}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Single row-level indicator: any stat currently sourced live from Battle.net. */
function CharacterLiveAvailabilityBadge({
  character: c,
}: {
  character: WowCharacterForDisplay;
}) {
  const live = c.ilvlTier === "live" || c.mythicTier === "live";
  const title = live
    ? "At least one value on this row came from the Battle.net Profile API on the last load."
    : "No values on this row were served live from the API on the last load (roster snapshot only, credentials missing, or API did not return data).";

  return (
    <span
      className={
        live
          ? "wow-group-roster-live-badge wow-group-roster-live-badge--yes"
          : "wow-group-roster-live-badge wow-group-roster-live-badge--no"
      }
      title={title}
    >
      {live ? "Live" : "API Error"}
    </span>
  );
}

function StatLine({
  label,
  value,
  tier,
  kind,
}: {
  label: string;
  value: number | null;
  tier: WowStatTier;
  kind: "ilvl" | "mplus";
}) {
  const title = tierTitle(kind, tier);

  if (tier === "blocked-private") {
    return (
      <span className="wow-stat-line wow-stat-tier-blocked" title={title}>
        {label}{" "}
        <span className="wow-stat-blocked-msg">blocked</span>
      </span>
    );
  }

  if (tier === "blocked-unconfigured") {
    return (
      <span className="wow-stat-line wow-stat-tier-muted" title={title}>
        {label} —
      </span>
    );
  }

  const n =
    value !== null && value !== undefined && !Number.isNaN(value)
      ? String(value)
      : "—";

  return (
    <span
      className={
        tier === "live"
          ? "wow-stat-line wow-stat-tier-live"
          : "wow-stat-line wow-stat-tier-snapshot"
      }
      title={title}
    >
      {label} {n}
    </span>
  );
}

/** Renders only role lanes the class supports (capacity &gt; 0). */
function ClassRoleEligibility({ slots }: { slots: WowRoleSlots }) {
  const parts: string[] = [];
  if (slots.tank > 0) {
    parts.push(`Tank×${slots.tank}`);
  }
  if (slots.heal > 0) {
    parts.push(`Heal×${slots.heal}`);
  }
  if (slots.dps > 0) {
    parts.push(`DPS×${slots.dps}`);
  }

  if (parts.length === 0) {
    return (
      <span className="wow-group-roster-role-none" title="Class unknown or no specs">
        Roles —
      </span>
    );
  }

  return (
    <span className="wow-group-roster-role-slots" title="Eligibility from shared class table">
      {parts.join(" · ")}
    </span>
  );
}

/** One character row in the group roster (stats, M+ grid, armory link). */
function RosterCharacterRow({ character: c }: { character: WowCharacterForDisplay }) {
  const hasMplus = hasNumericMythicPlus(c.mythicPlusScore);

  return (
    <li className="wow-group-roster-char-item">
      <div className="wow-group-roster-char-grid">
        <div className="wow-group-roster-char-col wow-group-roster-char-col--left">
          <div className="wow-group-roster-char-left-top">
            <span className="wow-group-roster-char-name">{c.name}</span>
            <span className="wow-group-roster-char-classline">{c.characterClass}</span>
            <div className="wow-group-roster-char-statstack">
              <StatLine kind="ilvl" label="iLvl" value={c.ilvl} tier={c.ilvlTier} />
              {hasMplus ? (
                <StatLine
                  kind="mplus"
                  label="M+"
                  value={c.mythicPlusScore}
                  tier={c.mythicTier}
                />
              ) : null}
            </div>
          </div>
          <div className="wow-group-roster-char-left-bottom">
            <ClassRoleEligibility slots={c.classRoleSlots} />
          </div>
        </div>

        <div className="wow-group-roster-char-col wow-group-roster-char-col--middle">
          <MythicKeystoneGrid slots={orderMythicRunsIntoSeasonGrid(c.mythicBestRuns)} />
        </div>

        <div className="wow-group-roster-char-col wow-group-roster-char-col--right">
          <div className="wow-group-roster-char-right-top">
            {c.profileUrl ? (
              <WowArmoryLinkWithRefresh
                profileUrl={c.profileUrl}
                characterLabel={c.name}
                variant="stack"
              />
            ) : null}
          </div>
          <div className="wow-group-roster-char-right-bottom">
            <CharacterLiveAvailabilityBadge character={c} />
          </div>
        </div>
      </div>
    </li>
  );
}

function RosterUserSection({
  user,
  characters,
  expanded,
  onToggle,
}: {
  user: WowUserEntry;
  characters: readonly WowCharacterForDisplay[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const panelId = `wow-roster-chars-${user.id}`;
  const bestRunsCollapsedGrid = useMemo(
    () =>
      aggregateBestRunsForSeasonGrid(
        characters.flatMap((c) => c.mythicBestRuns),
      ),
    [characters],
  );

  return (
    <section
      className="wow-group-roster-user-section"
      aria-labelledby={`wow-roster-user-${user.id}`}
    >
      <div className="wow-group-roster-user-section-head">
        <h2
          id={`wow-roster-user-${user.id}`}
          className="wow-group-roster-user-heading"
        >
          {user.displayName}
        </h2>
        <button
          type="button"
          className="wow-group-roster-user-toggle"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={
            expanded
              ? `Collapse all characters for ${user.displayName}`
              : `Expand all characters for ${user.displayName}`
          }
          title={expanded ? "Hide all characters" : "Show all characters"}
        >
          <ChevronExpandIcon expanded={expanded} />
        </button>
      </div>
      {expanded ? (
        <div id={panelId} className="wow-group-roster-user-chars-panel">
          {characters.length === 0 ? (
            <p className="wow-group-roster-no-chars">No characters on file.</p>
          ) : (
            <ul className="wow-group-roster-char-list">
              {characters.map((c) => (
                <RosterCharacterRow key={c.rosterId} character={c} />
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div id={panelId} className="wow-group-roster-user-collapsed-summary">
          <MythicKeystoneGrid
            slots={bestRunsCollapsedGrid}
            ariaLabel={`Best Mythic Keystone per dungeon slot for all characters under ${user.displayName}`}
          />
        </div>
      )}
    </section>
  );
}

type WowGroupRosterByUserProps = {
  sections: readonly {
    user: WowUserEntry;
    characters: readonly WowCharacterForDisplay[];
  }[];
};

export function WowGroupRosterByUser({ sections }: WowGroupRosterByUserProps) {
  const [collapsedUserIds, setCollapsedUserIds] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleUser = useCallback((userId: string) => {
    setCollapsedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }, []);

  if (sections.length === 0) {
    return (
      <p className="wow-group-roster-empty">
        No users assigned to this group in the roster config.
      </p>
    );
  }

  return (
    <div className="wow-group-roster">
      {sections.map(({ user, characters }) => (
        <RosterUserSection
          key={user.id}
          user={user}
          characters={characters}
          expanded={!collapsedUserIds.has(user.id)}
          onToggle={() => toggleUser(user.id)}
        />
      ))}
    </div>
  );
}
