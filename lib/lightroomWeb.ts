/**
 * Builds direct browser URLs to Adobe’s photos API for public Lightroom shares.
 * Pixels load from photos.adobe.io in the visitor’s browser only — this app does not
 * re-host, optimize, or persist image files.
 *
 * Each album supplies its own **`lightroomSpaceId`** — asset paths are scoped to that
 * Adobe cloud space; different galleries may live under different spaces.
 *
 * The web client key is Adobe’s public identifier for lightroom.adobe.com (same idea
 * as the `api_key` on share-page preview URLs). Set via env — never commit values in source.
 */
function lightroomSpaceBase(lightroomSpaceId: string): string {
  const id = lightroomSpaceId.trim();
  return `https://photos.adobe.io/v2/spaces/${id}/`;
}

export function lightroomRenditionSrc(
  relativePath: string,
  lightroomSpaceId: string,
): string | null {
  const key = process.env.NEXT_PUBLIC_ADOBE_LIGHTROOM_WEB_CLIENT_KEY?.trim();
  if (!key) return null;
  const sid = lightroomSpaceId.trim();
  if (!sid) return null;
  return `${lightroomSpaceBase(sid)}${relativePath}?api_key=${encodeURIComponent(key)}`;
}

export function lightroomRenditionSrcs(
  relativePaths: readonly string[],
  lightroomSpaceId: string,
): (string | null)[] {
  return relativePaths.map((p) => lightroomRenditionSrc(p, lightroomSpaceId));
}
