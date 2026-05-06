import { NextResponse } from "next/server";

import {
  CLIENT_ERROR,
  QUERY_PARAMS,
  REQUIRED_QUERY_PARAMS,
} from "./constants.js";
import { getTrimmedQueryParam } from "../utils/queryParams.js";
import { getCharacterProfileSummary } from "./character-profile-summary.js";

/**
 * Proxies Blizzard Character Profile Summary.
 * Query: region, realmSlug, characterName (e.g. us / emerald-dream / flojob).
 */
export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const region = getTrimmedQueryParam(searchParams, QUERY_PARAMS.REGION);
  const realmSlug = getTrimmedQueryParam(searchParams, QUERY_PARAMS.REALM_SLUG);
  const characterName = getTrimmedQueryParam(
    searchParams,
    QUERY_PARAMS.CHARACTER_NAME,
  );

  if (!region || !realmSlug || !characterName) {
    return NextResponse.json(
      {
        error: CLIENT_ERROR.MISSING_QUERY_PARAMS,
        required: [...REQUIRED_QUERY_PARAMS],
      },
      { status: 400 },
    );
  }

  const { status, body } = await getCharacterProfileSummary({
    region,
    realmSlug,
    characterName,
  });

  return NextResponse.json(body, { status });
}
