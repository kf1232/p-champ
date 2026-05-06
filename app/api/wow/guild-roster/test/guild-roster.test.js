/**
 * Blizzard JSON when Jest uses `--verbose` (e.g. `npm run test:verbose`). See
 * `app/api/wow/test/jestProviders.js` and `wowVerboseLog.js`.
 *
 * @jest-environment node
 */
import { getGuildRoster } from "../guild-roster.js";
import { logWowVerboseApiPayload } from "../../test/wowVerboseLog.js";

const hasCreds =
  Boolean(process.env.BATTLENET_CLIENT_ID) &&
  Boolean(process.env.BATTLENET_CLIENT_SECRET);

describe("getGuildRoster", () => {
  const run = hasCreds ? it : it.skip;

  run(
    "returns 200 for US Mal'Ganis WE ARE RATS roster (needs BATTLENET_CLIENT_ID / BATTLENET_CLIENT_SECRET)",
    async () => {
      const { status, body } = await getGuildRoster({
        region: "us",
        realmSlug: "malganis",
        nameSlug: "we-are-rats",
      });

      logWowVerboseApiPayload({
        title: "Guild roster (Game Data)",
        details: [
          "GET /data/wow/guild/{realmSlug}/{nameSlug}/roster",
          "Sample: us / malganis / we-are-rats",
        ],
        status,
        body,
      });

      expect(status).toBe(200);
      expect(body).toBeDefined();
      expect(typeof body).toBe("object");
      expect(Array.isArray(body.members)).toBe(true);
      expect(body.members.length).toBeGreaterThan(0);
    },
  );
});
