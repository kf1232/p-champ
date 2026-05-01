import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import {
  clearBlizzardCharacterProfileResponseCaches,
  WOW_BLIZZARD_PROFILE_FETCH_CACHE_TAG,
} from "@/lib/wow/battleNetCharacterProfile";

/** Drops in-process caches and Next fetch cache for tagged Blizzard profile requests. */
export async function POST() {
  clearBlizzardCharacterProfileResponseCaches();
  revalidateTag(WOW_BLIZZARD_PROFILE_FETCH_CACHE_TAG, { expire: 0 });
  return new NextResponse(null, { status: 204 });
}
