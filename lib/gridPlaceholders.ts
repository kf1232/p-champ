/**
 * Empty cells needed to complete the last row of a `cols`-column grid.
 * Returns `0` when the last row is already full or there are no filled cells.
 */
export function incompleteRowPaddingCellCount(
  filledCellCount: number,
  cols: number,
): number {
  if (cols <= 0) {
    return 0;
  }
  if (cols === 1) {
    return 0;
  }

  const rem = filledCellCount % cols;
  if (filledCellCount === 0) {
    return 0;
  }
  return rem === 0 ? 0 : cols - rem;
}

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

  return incompleteRowPaddingCellCount(filledCellCount, cols) + cols;
}
