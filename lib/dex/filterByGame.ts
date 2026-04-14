import type { GameId } from "./constants";
import type { DexRecord } from "./dexObject";

/** Dex records that participate in the given game (`games[gameId] === true`). */
export function filterDexRecordsForGame(
  records: readonly DexRecord[],
  gameId: GameId
): DexRecord[] {
  return records.filter((r) => r.games[gameId] === true);
}
