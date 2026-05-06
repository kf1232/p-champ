"use client";

import Link from "next/link";
import { useMemo } from "react";

import type { WowProfileApiRegionId } from "@/lib/wow/battle-net/battleNetProfileRegions";
import {
  buildWowGuildPageLookupHref,
  mapProfileSummaryToCharacterInfoRows,
  pickCharacterGuildForGameDataLookup,
} from "@/lib/wow";

export type CharacterInformationSectionProps = {
  profile: unknown;
  /** Region from the character lookup form (Battle.net profile namespace). */
  lookupRegion: WowProfileApiRegionId;
};

export function CharacterInformationSection({
  profile,
  lookupRegion,
}: CharacterInformationSectionProps) {
  const infoRows = useMemo(
    () => mapProfileSummaryToCharacterInfoRows(profile),
    [profile],
  );

  const guildHref = useMemo(() => {
    const g = pickCharacterGuildForGameDataLookup(profile);
    if (!g) return null;
    return buildWowGuildPageLookupHref({
      region: lookupRegion,
      guildRealmSlug: g.guildRealmSlug,
      guildNameInput: g.guildDisplayName,
    });
  }, [profile, lookupRegion]);

  return (
    <section
      className="character-overview-segment"
      aria-labelledby="character-overview-info-heading"
    >
      <div className="character-overview-segment-header">
        <h2
          id="character-overview-info-heading"
          className="character-overview-segment-title"
        >
          Character Information
        </h2>
        {guildHref ? (
          <div className="character-overview-segment-header-actions">
            <Link
              href={guildHref}
              className="character-submit-secondary"
              prefetch={false}
            >
              View Guild
            </Link>
          </div>
        ) : null}
      </div>
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
  );
}
