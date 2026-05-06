import catalog from "../character/wowClassSpecCatalog.json";

const CLASS_ID_TO_NAME: ReadonlyMap<number, string> = new Map(
  catalog.classes.map((c) => [c.id, c.name]),
);

/** Blizzard `playable-class` id → localized display name from the retail catalog. */
export function getPlayableClassName(classId: number | null): string | null {
  if (classId == null || !Number.isFinite(classId)) return null;
  return CLASS_ID_TO_NAME.get(classId) ?? null;
}

/** Name, or `Unknown (id)` / em dash when missing or unknown. */
export function formatPlayableClassLabel(classId: number | null): string {
  const name = getPlayableClassName(classId);
  if (name) return name;
  if (classId != null && Number.isFinite(classId)) return `Unknown (${classId})`;
  return "—";
}
