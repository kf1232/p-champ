"use client";

import { useMemo } from "react";

import { mapMythicProfileToOverview } from "@/lib/wow";

import { MythicRatingSwatch } from "../rating-swatch";

export type CharacterMythicKeystoneInformationSectionProps = {
  mythicProfile: unknown | null;
  mythicEmptyMessage: string;
  mythicError?: string | null;
};

export function CharacterMythicKeystoneInformationSection({
  mythicProfile,
  mythicEmptyMessage,
  mythicError,
}: CharacterMythicKeystoneInformationSectionProps) {
  const mythic = useMemo(
    () => (mythicProfile ? mapMythicProfileToOverview(mythicProfile) : null),
    [mythicProfile],
  );

  const mythicBodyMessage =
    mythicError ??
    (mythicProfile &&
    typeof mythicProfile === "object" &&
    !Array.isArray(mythicProfile) &&
    typeof (mythicProfile as Record<string, unknown>).message === "string"
      ? String((mythicProfile as Record<string, unknown>).message)
      : null);

  return (
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
  );
}
