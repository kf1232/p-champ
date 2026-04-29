/**
 * For a grid with `cols` columns: pad the incomplete last row to `cols` cells,
 * then add one full row of placeholder cells (n + 1 row pattern).
 *
 * When `cols === 1`, each row is a single full-width module—there is no
 * “partial first row” to pre-fill when `filledCellCount === 0`, so we only
 * append one trailing row of placeholders (`cols` cells).
 */
export function trailingPlaceholderCellCount(
  filledCellCount: number,
  cols: number,
): number {
  if (cols === 1) {
    return cols;
  }

  const rem = filledCellCount % cols;
  const padCurrentRow =
    filledCellCount === 0 ? cols : rem === 0 ? 0 : cols - rem;
  return padCurrentRow + cols;
}
