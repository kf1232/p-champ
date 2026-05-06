"use client";

import { useMemo } from "react";

import {
  mapEquipmentToItemCards,
  mapMythicProfileToOverview,
  mapProfileSummaryToCharacterInfoRows,
  mapSeasonDetailsToOverview,
  rgbaToCss,
} from "@/lib/wow";
import { CharacterGearItemCard } from "@/components/wow/components/character/CharacterOverviewItemCard";

export type CharacterOverviewSegmentsProps = {
  profile: unknown;
  equipment: unknown | null;
  mythicProfile: unknown | null;
  seasonDetails: unknown | null;
  equipmentEmptyMessage: string;
  mythicEmptyMessage: string;
  seasonEmptyMessage: string;
  equipmentError?: string | null;
  mythicError?: string | null;
  seasonDetailsError?: string | null;
};

function MythicRatingSwatch({
  color,
  label,
}: {
  color: { r: number; g: number; b: number; a: number };
  label: string;
}) {
  return (
    <span
      className="character-overview-rating-swatch"
      style={{ backgroundColor: rgbaToCss(color) }}
      title={label}
      aria-hidden
    />
  );
}

export function CharacterOverviewSegments({
  profile,
  equipment,
  mythicProfile,
  seasonDetails,
  equipmentEmptyMessage,
  mythicEmptyMessage,
  seasonEmptyMessage,
  equipmentError,
  mythicError,
  seasonDetailsError,
}: CharacterOverviewSegmentsProps) {
  const infoRows = useMemo(
    () => mapProfileSummaryToCharacterInfoRows(profile),
    [profile],
  );

  const itemCards = useMemo(
    () => (equipment ? mapEquipmentToItemCards(equipment) : []),
    [equipment],
  );

  const mythic = useMemo(
    () => (mythicProfile ? mapMythicProfileToOverview(mythicProfile) : null),
    [mythicProfile],
  );

  const season = useMemo(
    () =>
      seasonDetails ? mapSeasonDetailsToOverview(seasonDetails) : null,
    [seasonDetails],
  );

  const equipmentBodyMessage =
    equipmentError ??
    (equipment &&
    typeof equipment === "object" &&
    !Array.isArray(equipment) &&
    typeof (equipment as Record<string, unknown>).message === "string" &&
    !Array.isArray((equipment as Record<string, unknown>).equipped_items)
      ? String((equipment as Record<string, unknown>).message)
      : null);

  const showGearCards =
    equipment !== null && !equipmentBodyMessage && itemCards.length > 0;

  const gearEmptyCopy = equipmentBodyMessage ?? equipmentEmptyMessage;
  const gearFallbackEmpty =
    equipment !== null &&
    !equipmentBodyMessage &&
    itemCards.length === 0
      ? "No equipped items in response."
      : gearEmptyCopy;

  const mythicBodyMessage =
    mythicError ??
    (mythicProfile &&
    typeof mythicProfile === "object" &&
    !Array.isArray(mythicProfile) &&
    typeof (mythicProfile as Record<string, unknown>).message === "string"
      ? String((mythicProfile as Record<string, unknown>).message)
      : null);

  const seasonBodyMessage =
    seasonDetailsError ??
    (seasonDetails &&
    typeof seasonDetails === "object" &&
    !Array.isArray(seasonDetails) &&
    typeof (seasonDetails as Record<string, unknown>).message === "string"
      ? String((seasonDetails as Record<string, unknown>).message)
      : null);

  return (
    <div className="character-overview-root" aria-label="Character overview">
      <section
        className="character-overview-segment"
        aria-labelledby="character-overview-info-heading"
      >
        <h2
          id="character-overview-info-heading"
          className="character-overview-segment-title"
        >
          Character Information
        </h2>
        {infoRows.length === 0 ? (
          <p className="character-overview-empty">No profile data.</p>
        ) : (
          <dl className="character-overview-dl">
            {infoRows.map((row) => (
              <div key={row.label} className="character-overview-dl-row">
                <dt className="character-overview-dl-term">{row.label}</dt>
                <dd className="character-overview-dl-def">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section
        className="character-overview-segment"
        aria-labelledby="character-overview-gear-heading"
      >
        <h2
          id="character-overview-gear-heading"
          className="character-overview-segment-title"
        >
          Character Gear Information
        </h2>
        {equipment === null ? (
          <p className="character-overview-empty">
            {equipmentError ?? equipmentEmptyMessage}
          </p>
        ) : !showGearCards ? (
          <p className="character-overview-empty">{gearFallbackEmpty}</p>
        ) : (
          <div className="character-overview-item-card-list">
            {itemCards.map((card) => (
              <CharacterGearItemCard
                key={`${card.slotType}-${card.itemName}-${card.itemLevel}`}
                card={card}
              />
            ))}
          </div>
        )}
      </section>

      <section
        className="character-overview-segment"
        aria-labelledby="character-overview-mythic-heading"
      >
        <h2
          id="character-overview-mythic-heading"
          className="character-overview-segment-title"
        >
          Character Mythic Keystone information
        </h2>
        {mythicProfile === null ? (
          <p className="character-overview-empty">
            {mythicError ?? mythicEmptyMessage}
          </p>
        ) : mythicBodyMessage ? (
          <p className="character-overview-empty">{mythicBodyMessage}</p>
        ) : mythic && mythic.summary ? (
          <>
            <div className="character-overview-mythic-summary">
              {mythic.summary.characterLine ? (
                <p className="character-overview-mythic-line">
                  {mythic.summary.characterLine}
                </p>
              ) : null}
              <ul className="character-overview-mythic-kv">
                <li>
                  <span className="character-overview-mythic-k">Current period</span>
                  <span className="character-overview-mythic-v">
                    {mythic.summary.periodId ?? "—"}
                  </span>
                </li>
                <li>
                  <span className="character-overview-mythic-k">Seasons (index)</span>
                  <span className="character-overview-mythic-v">
                    {mythic.summary.seasonIds.length > 0
                      ? mythic.summary.seasonIds.join(", ")
                      : "—"}
                  </span>
                </li>
                <li>
                  <span className="character-overview-mythic-k">Current rating</span>
                  <span className="character-overview-mythic-v character-overview-mythic-rating">
                    {mythic.summary.currentRating !== null ? (
                      <>
                        {mythic.summary.currentRatingColor ? (
                          <MythicRatingSwatch
                            color={mythic.summary.currentRatingColor}
                            label="Rating color"
                          />
                        ) : null}
                        {(
                          Math.round(mythic.summary.currentRating * 10) / 10
                        ).toFixed(1)}
                      </>
                    ) : (
                      "—"
                    )}
                  </span>
                </li>
              </ul>
            </div>
            {mythic.runs.length === 0 ? (
              <p className="character-overview-muted">
                No best runs listed for the current period.
              </p>
            ) : (
              <div className="character-overview-table-wrap">
                <table className="character-overview-table">
                  <thead>
                    <tr>
                      <th scope="col">Dungeon</th>
                      <th scope="col">Level</th>
                      <th scope="col">Affixes</th>
                      <th scope="col">Completed</th>
                      <th scope="col">Time</th>
                      <th scope="col">In time</th>
                      <th scope="col">Run rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mythic.runs.map((run, i) => (
                      <tr key={`${run.dungeon}-${run.completed}-${i}`}>
                        <td>{run.dungeon}</td>
                        <td className="character-overview-table-num">
                          {run.keystoneLevel}
                        </td>
                        <td className="character-overview-table-cell-preline">
                          {run.affixes}
                        </td>
                        <td>{run.completed}</td>
                        <td className="character-overview-table-num">
                          {run.duration}
                        </td>
                        <td>{run.inTime}</td>
                        <td className="character-overview-table-num">
                          {run.runRating ? (
                            <span className="character-overview-mythic-rating">
                              {run.runRatingColor ? (
                                <MythicRatingSwatch
                                  color={run.runRatingColor}
                                  label="Run rating color"
                                />
                              ) : null}
                              {run.runRating}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <p className="character-overview-empty">No Mythic Keystone data.</p>
        )}
      </section>

      <section
        className="character-overview-segment"
        aria-labelledby="character-overview-season-heading"
      >
        <h2
          id="character-overview-season-heading"
          className="character-overview-segment-title"
        >
          Character Mythic Keystone Season Information
        </h2>
        {seasonDetails === null ? (
          <p className="character-overview-empty">
            {seasonDetailsError ?? seasonEmptyMessage}
          </p>
        ) : seasonBodyMessage ? (
          <p className="character-overview-empty">{seasonBodyMessage}</p>
        ) : season && season.header ? (
          <>
            <div className="character-overview-mythic-summary">
              <ul className="character-overview-mythic-kv">
                <li>
                  <span className="character-overview-mythic-k">Season ID</span>
                  <span className="character-overview-mythic-v">
                    {season.header.seasonId ?? "—"}
                  </span>
                </li>
                <li>
                  <span className="character-overview-mythic-k">Season rating</span>
                  <span className="character-overview-mythic-v character-overview-mythic-rating">
                    {season.header.mythicRating !== null ? (
                      <>
                        {season.header.mythicRatingColor ? (
                          <MythicRatingSwatch
                            color={season.header.mythicRatingColor}
                            label="Season rating color"
                          />
                        ) : null}
                        {(
                          Math.round(season.header.mythicRating * 10) / 10
                        ).toFixed(1)}
                      </>
                    ) : (
                      "—"
                    )}
                  </span>
                </li>
              </ul>
            </div>
            {season.runs.length === 0 ? (
              <p className="character-overview-muted">No season best runs.</p>
            ) : (
              <div className="character-overview-table-wrap">
                <table className="character-overview-table">
                  <thead>
                    <tr>
                      <th scope="col">Dungeon</th>
                      <th scope="col">Level</th>
                      <th scope="col">Affixes</th>
                      <th scope="col">Completed</th>
                      <th scope="col">Time</th>
                      <th scope="col">In time</th>
                      <th scope="col">Run rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {season.runs.map((run, i) => (
                      <tr key={`season-${run.dungeon}-${run.completed}-${i}`}>
                        <td>{run.dungeon}</td>
                        <td className="character-overview-table-num">
                          {run.keystoneLevel}
                        </td>
                        <td className="character-overview-table-cell-preline">
                          {run.affixes}
                        </td>
                        <td>{run.completed}</td>
                        <td className="character-overview-table-num">
                          {run.duration}
                        </td>
                        <td>{run.inTime}</td>
                        <td className="character-overview-table-num">
                          {run.runRating ? (
                            <span className="character-overview-mythic-rating">
                              {run.runRatingColor ? (
                                <MythicRatingSwatch
                                  color={run.runRatingColor}
                                  label="Run rating color"
                                />
                              ) : null}
                              {run.runRating}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <p className="character-overview-empty">No season data.</p>
        )}
      </section>
    </div>
  );
}
