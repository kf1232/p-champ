export function nextComboboxHighlight(
  current: number,
  length: number,
  direction: "up" | "down",
): number {
  if (length === 0) {
    return -1;
  }
  if (direction === "down") {
    return current < length - 1 ? current + 1 : 0;
  }
  return current <= 0 ? length - 1 : current - 1;
}
