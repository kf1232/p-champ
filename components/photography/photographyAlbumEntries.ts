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
      "assets/a03f1a062cbd474d81afc7cd6ce0a08e/revisions/a57ec637d0ac49a4b0f1a0eddc562975/renditions/11ca316e55098955ea97da1886fe4824",
      "assets/d1006e65d73e4f5b8720cf7a786aa6f7/revisions/21a5439563274f4ba3650f5b37e84593/renditions/ba4225692d968d9e365e4ce5b0d1bf7d",
      "assets/e51f010af8ce4c48a2c2c195d33da829/revisions/0f59937f89d44e179a087ffaf3916bc3/renditions/e5648ae9573fdb9ba66f4d4e831282ec",
      "assets/230d2a2f11504114922e643cd581b7b8/revisions/4effe7cfaccb4654a91af650301ba3f7/renditions/a0db91dee65fb387dd7531e20c31a2c0",
      "assets/e56c749256a949e28ff7be2fb2f5655c/revisions/891d684c53b049328807e43b7436c5a4/renditions/e8a21ac703a8bb5599db14e8693a7057",
      "assets/14d5adaaa39d43be85e4c959d6c8755b/revisions/9c90051bd2864967be08b981f9ae962c/renditions/49e166e120aed09c31038e899e743b94",
    ],
  },
  {
    id: "2025-09-yellowstone",
    lightroomSpaceId: "d5fcca324bff4d78ac9df5dce95576cf",
    name: "2025.09 Yellowstone",
    dateLabel: "September 2025",
    detailRenditionPaths: [
      "assets/58674922309543aeb5859db7d61c050e/revisions/64d04094b2b644eb929fd742bae5411b/renditions/7ad7b02606e8f345fe41e2f4e8f57062",
      "assets/b3ace9fc9fe94bd7824a5c27745602d3/revisions/f737e76aa54848bcae8286dd9530d256/renditions/9ea263d00ce06f9953e9d3d4511da63c",
      "assets/5a068894ae9d4be688395a87c1052fdf/revisions/3c5b49a9d9cb4b40b730a852687a1db1/renditions/0d50a13037671238760176b4c4e7c838",
      "assets/dacf459503184d2c971b61123d626a3d/revisions/0e71f4f0b7d04eb3997e77d8467a7b73/renditions/7b36c81b30bb1491182052756a38638d",
      "assets/1906fdadea2b48599a5b1b547af46b5e/revisions/9e8a806560e69c8e464e5ac122c48216/renditions/b0698ba71343a7b75ab38ef5aa3cf0d5",
      "assets/6fd0751de71b4816af542a37cfe4813f/revisions/38a9c9cc0c674da8a2c24999154fccf3/renditions/74b8da72392284daf6f112e480ca01a6",
    ],
  },
] as const satisfies readonly PhotographyAlbumEntry[];
