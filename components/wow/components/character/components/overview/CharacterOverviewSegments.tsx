"use client";

import { CharacterWowheadBisGearSection } from "./components/bis";
import { CharacterGearInformationSection } from "./components/gear";
import { CharacterInformationSection } from "./components/information";
import { CharacterMythicKeystoneInformationSection } from "./components/mythic-keystone";
import { CharacterMythicKeystoneSeasonInformationSection } from "./components/mythic-season";

import type { WowProfileApiRegionId } from "@/lib/wow/battle-net/battleNetProfileRegions";

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
  /** Battle.net profile region from the character lookup (drives “View Guild”). */
  lookupRegion: WowProfileApiRegionId;
};

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
  lookupRegion,
}: CharacterOverviewSegmentsProps) {
  return (
    <div className="character-overview-root" aria-label="Character overview">
      <CharacterInformationSection
        profile={profile}
        lookupRegion={lookupRegion}
      />

      <CharacterWowheadBisGearSection profile={profile} />

      <CharacterGearInformationSection
        equipment={equipment}
        equipmentEmptyMessage={equipmentEmptyMessage}
        equipmentError={equipmentError}
      />

      <CharacterMythicKeystoneInformationSection
        mythicProfile={mythicProfile}
        mythicEmptyMessage={mythicEmptyMessage}
        mythicError={mythicError}
      />

      <CharacterMythicKeystoneSeasonInformationSection
        seasonDetails={seasonDetails}
        seasonEmptyMessage={seasonEmptyMessage}
        seasonDetailsError={seasonDetailsError}
      />
    </div>
  );
}
