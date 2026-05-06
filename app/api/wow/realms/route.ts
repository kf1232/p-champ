import { NextResponse } from "next/server";

import {
  CLIENT_ERROR,
  QUERY_PARAMS,
  REQUIRED_QUERY_PARAMS,
} from "./constants.js";
import { getTrimmedQueryParam } from "../utils/queryParams.js";
import { getRealmsIndex } from "./realms.js";

/** Query: region (required). Returns merged Blizzard realm index for that region. */
export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const region = getTrimmedQueryParam(searchParams, QUERY_PARAMS.REGION);

  if (!region) {
    return NextResponse.json(
      {
        error: CLIENT_ERROR.MISSING_QUERY_PARAMS,
        required: [...REQUIRED_QUERY_PARAMS],
      },
      { status: 400 },
    );
  }

  const { status, body } = await getRealmsIndex({ region });

  return NextResponse.json(body, { status });
}
