/**
 * One Lightroom album row on the photography page (public copy + thumbnails).
 * Share URLs live in env (`PHOTOGRAPHY_GALLERY_SHARE_URLS`), not here.
 *
 * **`id`** is the stable key for server env maps and the verify API — use a code-safe slug;
 * do not change after deployment without updating env keys on each host.
 *
 * **`lightroomSpaceId`** scopes `detailRenditionPaths` to the correct Adobe cloud space.
 * A future album may use a different space id alongside its own rendition paths.
 */
export type PhotographyAlbumEntry = {
  readonly id: string;
  readonly lightroomSpaceId: string;
  readonly name: string;
  readonly dateLabel: string;
  readonly detailRenditionPaths: readonly string[];
};

/**
 * Catalog of albums. Keys in `PHOTOGRAPHY_GALLERY_PASSWORDS` / `PHOTOGRAPHY_GALLERY_SHARE_URLS`
 * must match each entry’s **`id`** exactly.
 */
export const PHOTOGRAPHY_ALBUM_ENTRIES = [
  {
    id: "2026-04-japan",
    lightroomSpaceId: "804f68aac25f4994a1584c21b31383c2",
    name: "2026.04 Japan",
    dateLabel: "April 2026",
    detailRenditionPaths: [
      "assets/14d5adaaa39d43be85e4c959d6c8755b/revisions/9c90051bd2864967be08b981f9ae962c/renditions/82020b1b930b04f7e88aa10731739028",
      "assets/4d8ed205f55d4ba3a05f9ff599d96767/revisions/d85abc01307e4f91a16b38725e6c1953/renditions/4ef054b4211ec40f459a27f3c183cd99",
      "assets/160a47b64bb14aeba897d80d621f8819/revisions/dac339df9ce8428daf622aebc8ce278a/renditions/b66a3af8157ada20f4ea6fd915a1f6a7",
      "assets/810faf90656947729a7f73015200affb/revisions/2de96bf46d554e33b7c31333f9210808/renditions/e7599b10e4479e2a2a34e60cb5434689",
      "assets/d854a55b12ca41b196ab93dfb29a1171/revisions/53fba5475e41459f89237a98234ef24a/renditions/739e9c5a0528ec9221edbcc7e94e78d0",
      "assets/8f78d44dec5f4fd78bd38df910a0d9eb/revisions/cb2a104383b34e348560fd5651749b69/renditions/21a86721869b10e6bf827d5e4f784acc",
    ],
  },
] as const satisfies readonly PhotographyAlbumEntry[];
