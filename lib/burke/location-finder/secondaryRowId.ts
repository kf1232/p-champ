export const INITIAL_SECONDARY_ROW_ID = "secondary-row-0";

const ROW_ID_PATTERN = /^secondary-row-(\d+)$/;

/** Deterministic ids for SSR/hydration; call with current rows when adding another. */
export function nextSecondaryRowId(existingRows: { id: string }[]): string {
  let max = 0;
  for (const row of existingRows) {
    const match = ROW_ID_PATTERN.exec(row.id);
    if (match) {
      max = Math.max(max, Number(match[1]));
    }
  }
  return `secondary-row-${max + 1}`;
}
