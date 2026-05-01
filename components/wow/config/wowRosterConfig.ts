import roster from "./wowRoster.json";

import type { WowRoleSlots } from "./wowRoleTypes";
import { classRoleCapacity } from "./wowClassRoleSlots";

export type { WowRoleSlots } from "./wowRoleTypes";

/**
 * Roster model:
 * - **Groups** hold schedule metadata and which **users** are assigned (`userIds`).
 * - **Users** are identity records only.
 * - **Characters** belong to a single user (`userId`) and carry WoW profile fields only —
 *   they never store group membership.
 *
 * Role eligibility comes from **shared class definitions** (`wowClassRoleSlots.ts`), not
 * per-character `roleSlots`.
 *
 * Metrics: count users with at least one character whose class has capacity > 0 in that
 * role column.
 */

export type WowGroupEntry = {
  readonly id: string;
  readonly name: string;
  readonly scheduleLabel: string;
  readonly linkUrl?: string;
  /** Users assigned to this scheduled block. */
  readonly userIds: readonly string[];
};

export type WowUserEntry = {
  readonly id: string;
  readonly displayName: string;
};

/** In-game character — references exactly one user; no group fields. */
export type WowCharacterEntry = {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  /** Fallback when Battle.net Profile API is not used or fails; omit if resolved from API only. */
  readonly ilvl?: number | null;
  readonly characterClass: string;
  /**
   * Snapshot when Battle.net does not expose Mythic+ rating (optional).
   * Same availability rules as ilvl — see enrichment layer.
   */
  readonly mythicPlusScore?: number | null;
  /**
   * Blizzard armory URL — used server-side with Battle.net OAuth (see `lib/wow/battleNetCharacterProfile.ts`)
   * to resolve ilvl/class when credentials are set.
   */
  readonly profileUrl?: string;
};

export type WowGroupMemberMetrics = {
  /** Users assigned to this group. */
  readonly members: number;
  readonly tank: number;
  readonly heal: number;
  readonly dps: number;
};

/** One user block on a group detail page: their characters (by reference to roster). */
export type WowGroupRosterUserSection = {
  readonly user: WowUserEntry;
  readonly characters: readonly WowCharacterEntry[];
};

export const WOW_GROUP_ENTRIES: readonly WowGroupEntry[] = roster.groups;

export const WOW_USER_ENTRIES: readonly WowUserEntry[] = roster.users;

const USER_BY_ID = new Map<string, WowUserEntry>(
  WOW_USER_ENTRIES.map((u) => [u.id, u]),
);

export const WOW_CHARACTER_ENTRIES: readonly WowCharacterEntry[] =
  roster.characters;

export function metricsForGroup(groupId: string): WowGroupMemberMetrics {
  const group = WOW_GROUP_ENTRIES.find((g) => g.id === groupId);
  if (!group || group.userIds.length === 0) {
    return { members: 0, tank: 0, heal: 0, dps: 0 };
  }

  const assignedUserIds = [...new Set(group.userIds)];
  const chars = WOW_CHARACTER_ENTRIES.filter((c) =>
    assignedUserIds.includes(c.userId),
  );

  const userHasRole = (
    userId: string,
    role: keyof WowRoleSlots,
  ): boolean =>
    chars.some((c) => {
      const cap = classRoleCapacity(c.characterClass);
      return c.userId === userId && cap[role] > 0;
    });

  return {
    members: assignedUserIds.length,
    tank: assignedUserIds.filter((uid) => userHasRole(uid, "tank")).length,
    heal: assignedUserIds.filter((uid) => userHasRole(uid, "heal")).length,
    dps: assignedUserIds.filter((uid) => userHasRole(uid, "dps")).length,
  };
}

/**
 * Users assigned to the group (in `userIds` order, deduped) with their characters.
 * Unknown `userId` entries in the group still appear using the id as display fallback.
 */
export function rosterByUserForGroup(
  groupId: string,
): readonly WowGroupRosterUserSection[] {
  const group = WOW_GROUP_ENTRIES.find((g) => g.id === groupId);
  if (!group) {
    return [];
  }

  const map = USER_BY_ID;
  const seen = new Set<string>();
  const orderedUserIds: string[] = [];
  for (const id of group.userIds) {
    if (!seen.has(id)) {
      seen.add(id);
      orderedUserIds.push(id);
    }
  }

  return orderedUserIds.map((userId) => {
    const user = map.get(userId) ?? { id: userId, displayName: userId };
    const characters = WOW_CHARACTER_ENTRIES.filter(
      (c) => c.userId === userId,
    );
    return { user, characters };
  });
}
