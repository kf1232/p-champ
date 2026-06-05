import type { PhotographyAlbumEntry } from "./config/photographyAlbumEntries";
import { GatedGalleryLink } from "./GatedGalleryLink";

type PhotographyEntryRowBase = {
  /** Primary label (e.g. shoot or project name). */
  name: string;
  /** Secondary line (e.g. display date). */
  dateLabel: string;
  /** Optional live Adobe rendition URLs; null/empty slots render placeholders only. */
  detailImageSrcs?: readonly (string | null | undefined)[];
};

type PhotographyEntryRowProps = PhotographyEntryRowBase &
  (
    | {
      albumId: PhotographyAlbumEntry["id"];
    }
    | {
      albumId?: undefined;
    }
  );

const DETAIL_GRID_SLOTS = 6;

/**
 * Full-width row: 1/3 info (centered name + date) and 2/3 detail grid.
 * Images use native img elements so bytes load directly from Adobe — no app-side copy or optimization cache.
 */
export function PhotographyEntryRow({
  name,
  dateLabel,
  detailImageSrcs = [],
  albumId,
}: PhotographyEntryRowProps) {
  const gated =
    albumId !== undefined &&
    typeof albumId === "string" &&
    albumId.length > 0;

  return (
    <article
      className="app-content-row"
      aria-label={`Photography entry: ${name}`}
    >
      <section aria-label="Information" className="app-content-row__info">
        <h2 className="app-content-row__title">{name}</h2>
        <p className="app-content-row__meta">{dateLabel}</p>
        {gated ? (
          <p className="app-content-row__link-wrap">
            <GatedGalleryLink
              albumId={albumId}
              className="app-gated-link--text"
              ariaLabel="Open album on Adobe Lightroom"
            >
              Open album on Lightroom
            </GatedGalleryLink>
          </p>
        ) : null}
      </section>

      <section className="app-content-row__detail">
        <div className="app-content-row__thumb-grid" role="presentation">
          {Array.from({ length: DETAIL_GRID_SLOTS }, (_, i) => {
            const src = detailImageSrcs[i] ?? null;
            if (!src) {
              return (
                <div
                  key={i}
                  className="app-content-row__slot-empty"
                  aria-hidden
                />
              );
            }
            const img = (
              // Direct load from Adobe (no next/image — avoids our CDN/cache copying bytes).
              // eslint-disable-next-line @next/next/no-img-element -- live Lightroom renditions only
              <img
                src={src}
                alt={`${name} — photo ${i + 1} (hosted by Adobe Lightroom)`}
                loading="lazy"
                decoding="async"
                className="app-content-row__thumb-img"
                referrerPolicy="no-referrer-when-downgrade"
              />
            );
            return (
              <div
                key={`detail-${i}`}
                className="app-content-row__thumb-wrap"
              >
                {gated ? (
                  <GatedGalleryLink
                    albumId={albumId}
                    className="app-gated-link--thumb"
                    ariaLabel={`Open ${name} on Adobe Lightroom (photo ${i + 1})`}
                  >
                    {img}
                  </GatedGalleryLink>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}
