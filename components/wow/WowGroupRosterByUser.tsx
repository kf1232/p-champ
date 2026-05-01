import type {
  WowCharacterForDisplay,
  WowStatTier,
} from "@/lib/wow/battleNetCharacterProfile";
import type { WowRoleSlots } from "./config/wowRoleTypes";
import type { WowUserEntry } from "./config/wowRosterConfig";
import { WowArmoryLinkWithRefresh } from "./WowArmoryLinkWithRefresh";

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
  return (
    score !== null &&
    score !== undefined &&
    typeof score === "number" &&
    !Number.isNaN(score)
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

type WowGroupRosterByUserProps = {
  sections: readonly {
    user: WowUserEntry;
    characters: readonly WowCharacterForDisplay[];
  }[];
};

export function WowGroupRosterByUser({ sections }: WowGroupRosterByUserProps) {
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
        <section
          key={user.id}
          className="wow-group-roster-user-section"
          aria-labelledby={`wow-roster-user-${user.id}`}
        >
          <h2
            id={`wow-roster-user-${user.id}`}
            className="wow-group-roster-user-heading"
          >
            {user.displayName}
          </h2>
          {characters.length === 0 ? (
            <p className="wow-group-roster-no-chars">No characters on file.</p>
          ) : (
            <ul className="wow-group-roster-char-list">
              {characters.map((c) => (
                <li key={c.rosterId} className="wow-group-roster-char-row">
                  <div className="wow-group-roster-char-main">
                    <span className="wow-group-roster-char-name">{c.name}</span>
                    <div className="wow-group-roster-char-stats-line">
                      <span className="wow-group-roster-class-label">
                        {c.characterClass}
                      </span>
                      <span className="wow-group-roster-stat-sep" aria-hidden>
                        ·
                      </span>
                      <StatLine
                        kind="ilvl"
                        label="iLvl"
                        value={c.ilvl}
                        tier={c.ilvlTier}
                      />
                      {hasNumericMythicPlus(c.mythicPlusScore) ? (
                        <>
                          <span className="wow-group-roster-stat-sep" aria-hidden>
                            ·
                          </span>
                          <StatLine
                            kind="mplus"
                            label="M+"
                            value={c.mythicPlusScore}
                            tier={c.mythicTier}
                          />
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="wow-group-roster-char-secondary">
                    <div className="wow-group-roster-char-secondary-row">
                      <ClassRoleEligibility slots={c.classRoleSlots} />
                      {c.profileUrl ? (
                        <WowArmoryLinkWithRefresh
                          profileUrl={c.profileUrl}
                          characterLabel={c.name}
                        />
                      ) : null}
                    </div>
                    <CharacterLiveAvailabilityBadge character={c} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
