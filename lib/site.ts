/** App-wide copy and metadata defaults — single source of truth. */
export const SITE_NAME = "P-Champ";

export const PORTAL_NAME = "Fink Social";
export const PORTAL_HOME_PATH = "/";

export const SITE_DESCRIPTION =
  "A clean starting point. Choose a square below to plug in your first feature.";

/** Routes for the P-Champ area (Dex, Team Builder, home). */
export const P_CHAMP_HOME_PATH = "/p-champ";
export const P_CHAMP_DEX_PATH = "/p-champ/dex";
export const P_CHAMP_TEAM_BUILDER_PATH = "/p-champ/team-builder";

export const PHOTOGRAPHY_HOME_PATH = "/photography";

export const WOW_HOME_PATH = "/wow";
/** Query param on `/wow` to open the group password modal (`?gate={groupId}`). */
export const WOW_GATE_SEARCH_PARAM = "gate";
/** Per-group pages: `/wow/groups/{groupId}`. */
export const WOW_GROUPS_PATH = "/wow/groups";

export function wowGroupDetailPath(groupId: string): string {
  return `${WOW_GROUPS_PATH}/${groupId}`;
}
