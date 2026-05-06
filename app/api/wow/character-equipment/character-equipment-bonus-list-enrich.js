/**
 * Blizzard character equipment responses expose `equipped_items` (array of
 * slot payloads). For each element that has `bonus_list`, sets sibling
 * `bonus_list_detail`: known ids expand from `bonusMap`; unknown numeric ids
 * become `{ key: <id> }`; non-numeric entries become `{ key: <rawEntry> }`.
 *
 * Does not recurse into nested objects — only top-level fields on each
 * `equipped_items` entry.
 *
 * @param {unknown} body
 * @param {Record<string, unknown>} bonusMap stringified bonus id → expansion object
 */
export function applyBonusListDetailsToEquipmentBody(body, bonusMap) {
  if (!bonusMap || typeof bonusMap !== "object" || Array.isArray(bonusMap)) {
    return;
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return;
  }

  const items = body.equipped_items;
  if (!Array.isArray(items)) {
    return;
  }

  for (let i = 0; i < items.length; i += 1) {
    const slot = items[i];
    if (!slot || typeof slot !== "object" || Array.isArray(slot)) {
      continue;
    }
    const bl = slot.bonus_list;
    if (!Array.isArray(bl)) {
      continue;
    }

    const detail = [];
    for (let j = 0; j < bl.length; j += 1) {
      const rawEntry = bl[j];
      const idNum =
        typeof rawEntry === "number" && Number.isFinite(rawEntry)
          ? rawEntry
          : typeof rawEntry === "string" &&
              /^-?\d+$/.test(String(rawEntry).trim())
            ? Number(String(rawEntry).trim())
            : null;

      if (idNum === null) {
        detail.push({ key: rawEntry });
        continue;
      }

      const expansion = bonusMap[String(idNum)];
      if (expansion != null && typeof expansion === "object") {
        detail.push(structuredClone(expansion));
      } else {
        detail.push({ key: idNum });
      }
    }
    slot.bonus_list_detail = detail;
  }
}
