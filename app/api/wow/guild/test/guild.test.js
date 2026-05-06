/**
 * Blizzard JSON when Jest uses `--verbose` (e.g. `npm run test:verbose`). See
 * `app/api/wow/test/jestProviders.js` and `wowVerboseLog.js`.
 *
 * @jest-environment node
 */
import { getGuild } from "../guild.js";
import { logWowVerboseApiPayload } from "../../test/wowVerboseLog.js";

const hasCreds =
  Boolean(process.env.BATTLENET_CLIENT_ID) &&
  Boolean(process.env.BATTLENET_CLIENT_SECRET);

describe("getGuild", () => {
  const run = hasCreds ? it : it.skip;

  run(
    "returns 200 for US Mal'Ganis WE ARE RATS (needs BATTLENET_CLIENT_ID / BATTLENET_CLIENT_SECRET)",
    async () => {
      const { status, body } = await getGuild({
        region: "us",
        realmSlug: "malganis",
        nameSlug: "we-are-rats",
      });

      logWowVerboseApiPayload({
        title: "Guild (Game Data)",
        details: [
          "GET /data/wow/guild/{realmSlug}/{nameSlug}",
          "Sample: us / malganis / we-are-rats",
        ],
        status,
        body,
      });

      expect(status).toBe(200);
      expect(body).toBeDefined();
      expect(typeof body).toBe("object");
      expect(String(body.name ?? "")).toMatch(/rats/i);
    },
  );
});
