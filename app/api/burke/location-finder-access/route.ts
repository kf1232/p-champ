import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { BURKE_LOCATION_FINDER_GRANT_COOKIE } from "@/lib/burke";
import { getLocationFinderPreloadStatus } from "@/lib/burke/server";

/** GET — preload grant and geocode config (call when the tool opens). */
export async function GET() {
  const store = await cookies();
  const status = await getLocationFinderPreloadStatus(
    store.get(BURKE_LOCATION_FINDER_GRANT_COOKIE)?.value,
  );

  if (!status.configured) {
    return NextResponse.json(
      {
        ...status,
        granted: false,
      },
      { status: 503 },
    );
  }

  return NextResponse.json(status, { status: 200 });
}
