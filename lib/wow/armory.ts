/**
 * Blizzard armory URLs — parsing only (`parseWowArmoryCharacterUrl`).
 *
 * Live ilvl/class for roster rows with `profileUrl` are resolved server-side via the
 * Battle.net OAuth client-credentials flow — see `battleNetCharacterProfile.ts`.
 */

/** Parsed from URLs like `…/character/{region}/{realm-slug}/{name}/`. */
export type WowArmoryCharacterRef = {
  region: string;
  realmSlug: string;
  characterName: string;
};

/**
 * Extracts region, realm slug, and character name from a Blizzard WoW character profile URL.
 * Returns `null` if the path does not match the expected pattern.
 */
export function parseWowArmoryCharacterUrl(
  url: string,
): WowArmoryCharacterRef | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (
      !host.endsWith("blizzard.com") &&
      !host.endsWith("battle.net") &&
      host !== "worldofwarcraft.com"
    ) {
      return null;
    }

    const segments = parsed.pathname.split("/").filter(Boolean);
    const idx = segments.indexOf("character");
    if (idx === -1 || segments.length < idx + 4) {
      return null;
    }

    const region = segments[idx + 1];
    const realmSlug = segments[idx + 2];
    const characterName = segments[idx + 3];

    if (!region || !realmSlug || !characterName) {
      return null;
    }

    return {
      region: decodeURIComponent(region),
      realmSlug: decodeURIComponent(realmSlug),
      characterName: decodeURIComponent(characterName),
    };
  } catch {
    return null;
  }
}
