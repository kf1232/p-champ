import { NextResponse } from "next/server";

import {
  CLIENT_ERROR,
  QUERY_PARAMS,
  REQUIRED_QUERY_PARAMS,
} from "./constants.js";
import { getTrimmedQueryParam } from "../utils/queryParams.js";
import { getCharacterMythicKeystoneProfile } from "./character-mythic-keystone-profile.js";

/**
 * Proxies Blizzard Character Mythic Keystone Profile Index.
 * Query: region, realmSlug, characterName (required); namespace, locale (optional).
 * Example: us / emerald-dream / flojob — defaults namespace=profile-{region}, locale per region.
 */
export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const region = getTrimmedQueryParam(searchParams, QUERY_PARAMS.REGION);
  const realmSlug = getTrimmedQueryParam(searchParams, QUERY_PARAMS.REALM_SLUG);
  const characterName = getTrimmedQueryParam(
    searchParams,
    QUERY_PARAMS.CHARACTER_NAME,
  );
  const namespace = getTrimmedQueryParam(
    searchParams,
    QUERY_PARAMS.NAMESPACE,
  );
  const locale = getTrimmedQueryParam(searchParams, QUERY_PARAMS.LOCALE);

  if (!region || !realmSlug || !characterName) {
    return NextResponse.json(
      {
        error: CLIENT_ERROR.MISSING_QUERY_PARAMS,
        required: [...REQUIRED_QUERY_PARAMS],
      },
      { status: 400 },
    );
  }

  const { status, body } = await getCharacterMythicKeystoneProfile({
    region,
    realmSlug,
    characterName,
    ...(namespace != null ? { namespace } : {}),
    ...(locale != null ? { locale } : {}),
  });

  return NextResponse.json(body, { status });
}
