/**
 * Blizzard JSON appears when Jest runs with `--verbose`.
 *
 * @jest-environment node
 */
import { getCharacterMythicKeystoneSeasonDetails } from "../character-mythic-keystone-season-details.js";
import { logWowVerboseApiPayload } from "../../test/wowVerboseLog.js";

const hasCreds =
  Boolean(process.env.BATTLENET_CLIENT_ID) &&
  Boolean(process.env.BATTLENET_CLIENT_SECRET);

describe("getCharacterMythicKeystoneSeasonDetails", () => {
  const run = hasCreds ? it : it.skip;

  run(
    "returns 200 or 404 for US emerald-dream flojob season 13 (needs BATTLENET_CLIENT_ID / BATTLENET_CLIENT_SECRET)",
    async () => {
      const { status, body } = await getCharacterMythicKeystoneSeasonDetails({
        region: "us",
        realmSlug: "emerald-dream",
        characterName: "flojob",
        seasonId: "13",
      });

      logWowVerboseApiPayload({
        title: "Character Mythic Keystone season details",
        details: [
          "GET /profile/wow/character/{realm}/{name}/mythic-keystone-profile/season/{seasonId}",
          "Sample: us / emerald-dream / flojob / 13",
        ],
        status,
        body,
      });

      expect([200, 404]).toContain(status);
      expect(body).toBeDefined();
      expect(typeof body).toBe("object");
    },
  );
});
