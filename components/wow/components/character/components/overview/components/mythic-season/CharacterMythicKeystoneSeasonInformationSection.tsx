"use client";

import { useMemo } from "react";

import { mapSeasonDetailsToOverview } from "@/lib/wow";

import { MythicRatingSwatch } from "../rating-swatch";

export type CharacterMythicKeystoneSeasonInformationSectionProps = {
  seasonDetails: unknown | null;
  seasonEmptyMessage: string;
  seasonDetailsError?: string | null;
};

export function CharacterMythicKeystoneSeasonInformationSection({
  seasonDetails,
  seasonEmptyMessage,
  seasonDetailsError,
}: CharacterMythicKeystoneSeasonInformationSectionProps) {
  const season = useMemo(
    () =>
      seasonDetails ? mapSeasonDetailsToOverview(seasonDetails) : null,
    [seasonDetails],
  );

  const seasonBodyMessage =
    seasonDetailsError ??
    (seasonDetails &&
    typeof seasonDetails === "object" &&
    !Array.isArray(seasonDetails) &&
    typeof (seasonDetails as Record<string, unknown>).message === "string"
      ? String((seasonDetails as Record<string, unknown>).message)
      : null);

  return (
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
  );
}
