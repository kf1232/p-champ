/**
 * Blizzard JSON appears when Jest runs with `--verbose`.
 *
 * @jest-environment node
 */
import { getCharacterMythicKeystoneProfile } from "../character-mythic-keystone-profile.js";
import { logWowVerboseApiPayload } from "../../test/wowVerboseLog.js";

const hasCreds =
  Boolean(process.env.BATTLENET_CLIENT_ID) &&
  Boolean(process.env.BATTLENET_CLIENT_SECRET);

describe("getCharacterMythicKeystoneProfile", () => {
  const run = hasCreds ? it : it.skip;

  run(
    "returns 200 for US emerald-dream flojob (needs BATTLENET_CLIENT_ID / BATTLENET_CLIENT_SECRET)",
    async () => {
      const { status, body } = await getCharacterMythicKeystoneProfile({
        region: "us",
        realmSlug: "emerald-dream",
        characterName: "flojob",
      });

      logWowVerboseApiPayload({
        title: "Character Mythic Keystone profile index",
        details: [
          "GET /profile/wow/character/{realmSlug}/{characterName}/mythic-keystone-profile",
          "Sample: us / emerald-dream / flojob",
        ],
        status,
        body,
      });

      expect(status).toBe(200);
      expect(body).toBeDefined();
      expect(typeof body).toBe("object");
    },
  );
});
