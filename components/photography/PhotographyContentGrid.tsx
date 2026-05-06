import { trailingPlaceholderCellCount } from "@/lib/gridPlaceholders";
import { lightroomRenditionSrcs } from "@/lib/lightroomWeb";

import { PHOTOGRAPHY_ALBUM_ENTRIES } from "./config/photographyAlbumEntries";
import { PhotographyEntryRow } from "./PhotographyEntryRow";

const FILLED_ROW_COUNT = PHOTOGRAPHY_ALBUM_ENTRIES.length;

const GRID_COLS = 1;

export function PhotographyContentGrid() {
  const placeholderRows = trailingPlaceholderCellCount(FILLED_ROW_COUNT, GRID_COLS);

  return (
    <section aria-label="Photography modules" className="mt-8">
      <div className="grid min-w-0 w-full grid-cols-1 gap-3 sm:gap-4">
        {PHOTOGRAPHY_ALBUM_ENTRIES.map((album) => (
          <PhotographyEntryRow
            key={album.id}
            name={album.name}
            dateLabel={album.dateLabel}
            detailImageSrcs={lightroomRenditionSrcs(
              album.detailRenditionPaths,
              album.lightroomSpaceId,
            )}
            albumId={album.id}
          />
        ))}
        {Array.from({ length: placeholderRows }, (_, i) => (
          <div
            key={`photography-placeholder-${i}`}
            className="photography-grid-placeholder-row"
            aria-hidden
          />
        ))}
      </div>
    </section>
  );
}
