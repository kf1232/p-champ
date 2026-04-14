import { NATIONAL_VIEW_ID } from "./constants";
import type { DexListViewId, GameId } from "./constants";
import type { DexRecord } from "./dexObject";

/** Dex records that participate in the given game (`games[gameId] === true`). */
export function filterDexRecordsForGame(
  records: readonly DexRecord[],
  gameId: GameId
): DexRecord[] {
  return filterDexRecordsForListView(records, gameId);
}

/**
 * When `viewId` is {@link NATIONAL_VIEW_ID}, returns all records. Otherwise only
 * species with `games[viewId] === true`.
 */
export function filterDexRecordsForListView(
  records: readonly DexRecord[],
  viewId: DexListViewId
): DexRecord[] {
  if (viewId === NATIONAL_VIEW_ID) return [...records];
  return records.filter((r) => r.games[viewId] === true);
}
