/**
 * Blizzard JSON appears when Jest runs with `--verbose` (e.g. `npm run test:verbose`).
 * Jest prints `console.log` for each file above that file's PASS line — search the terminal
 * for `WoW API verbose`. See `app/api/wow/test/jestProviders.js` and `wowVerboseLog.js`.
 * Full ad-hoc sampling: `npm run wow:sample-api`.
 *
 * @jest-environment node
 */
import { getCharacterProfileSummary } from "../character-profile-summary.js";
import { logWowVerboseApiPayload } from "../../test/wowVerboseLog.js";

const hasCreds =
  Boolean(process.env.BATTLENET_CLIENT_ID) &&
  Boolean(process.env.BATTLENET_CLIENT_SECRET);

describe("getCharacterProfileSummary", () => {
  const run = hasCreds ? it : it.skip;

  run(
    "returns 200 for US emerald-dream flojob (needs BATTLENET_CLIENT_ID / BATTLENET_CLIENT_SECRET)",
    async () => {
      const { status, body } = await getCharacterProfileSummary({
        region: "us",
        realmSlug: "emerald-dream",
        characterName: "flojob",
      });

      logWowVerboseApiPayload({
        title: "Character profile summary",
        details: [
          "GET /profile/wow/character/{realmSlug}/{characterName}",
          "Sample: us / emerald-dream / flojob",
        ],
        status,
        body,
      });

      expect(status).toBe(200);
      expect(body).toBeDefined();
      expect(typeof body).toBe("object");
      expect(String(body.name ?? "")).toMatch(/flojob/i);
    },
  );
});
