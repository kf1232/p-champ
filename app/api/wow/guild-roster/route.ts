import { NextResponse } from "next/server";

import {
  CLIENT_ERROR,
  QUERY_PARAMS,
  REQUIRED_QUERY_PARAMS,
} from "./constants.js";
import { getTrimmedQueryParam } from "../utils/queryParams.js";
import { getGuildRoster } from "./guild-roster.js";

/**
 * Proxies Blizzard Game Data Guild Roster.
 * Query: region, realmSlug, nameSlug (required); namespace, locale (optional).
 */
export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const region = getTrimmedQueryParam(searchParams, QUERY_PARAMS.REGION);
  const realmSlug = getTrimmedQueryParam(searchParams, QUERY_PARAMS.REALM_SLUG);
  const nameSlug = getTrimmedQueryParam(searchParams, QUERY_PARAMS.NAME_SLUG);
  const namespace = getTrimmedQueryParam(
    searchParams,
    QUERY_PARAMS.NAMESPACE,
  );
  const locale = getTrimmedQueryParam(searchParams, QUERY_PARAMS.LOCALE);

  if (!region || !realmSlug || !nameSlug) {
    return NextResponse.json(
      {
        error: CLIENT_ERROR.MISSING_QUERY_PARAMS,
        required: [...REQUIRED_QUERY_PARAMS],
      },
      { status: 400 },
    );
  }

  const { status, body } = await getGuildRoster({
    region,
    realmSlug,
    nameSlug,
    ...(namespace != null ? { namespace } : {}),
    ...(locale != null ? { locale } : {}),
  });

  return NextResponse.json(body, { status });
}
