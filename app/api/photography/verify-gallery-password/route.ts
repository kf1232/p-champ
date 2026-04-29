import { createHash, timingSafeEqual } from "crypto";

import { NextResponse } from "next/server";

import {
  normalizeShareUrlForRedirect,
  parseGalleryKeyedEnvJson,
} from "@/lib/photographyGalleryEnv";

function hashPassword(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/**
 * Validates the gallery password for a specific album (server-side only).
 * On success, returns the Lightroom share URL from env (never stored in client source).
 * Body: `{ id: string, password: string }` — `id` must match `PhotographyAlbumEntry.id` and env JSON keys.
 */
export async function POST(req: Request) {
  const passwordMap = parseGalleryKeyedEnvJson(
    process.env.PHOTOGRAPHY_GALLERY_PASSWORDS,
  );
  const shareUrlMap = parseGalleryKeyedEnvJson(
    process.env.PHOTOGRAPHY_GALLERY_SHARE_URLS,
  );

  if (!passwordMap || !shareUrlMap) {
    return NextResponse.json(
      { error: "Gallery configuration is incomplete." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const b = body as { id?: unknown; password?: unknown };
  const albumId =
    typeof b.id === "string" && b.id.trim().length > 0 ? b.id.trim() : "";
  const password = typeof b.password === "string" ? b.password : "";

  if (!albumId) {
    return NextResponse.json({ error: "Missing album id." }, { status: 400 });
  }

  const expectedPassword = passwordMap.get(albumId);
  if (!expectedPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const a = hashPassword(password);
  const expectedBuf = hashPassword(expectedPassword);
  if (
    a.length !== expectedBuf.length ||
    !timingSafeEqual(a, expectedBuf)
  ) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const rawShareUrl = shareUrlMap.get(albumId);
  const shareUrl =
    rawShareUrl !== undefined ? normalizeShareUrlForRedirect(rawShareUrl) : null;
  if (!shareUrl) {
    return NextResponse.json(
      { error: "Gallery share link is not configured." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, shareUrl });
}
