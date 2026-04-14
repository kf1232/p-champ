/**
 * Shared parsing for dex GitHub issue automation (sync-* and cleanup-workflow-issues).
 */

/** @param {string} title @param {string} [body] */
export function parseMoveIdFromIssue(title, body) {
  const fromBody = body?.match(/<!--\s*work-item:dex-move:(\w+)\s*-->/);
  if (fromBody) return fromBody[1];
  if (title.startsWith("Configure move: ")) {
    const rest = title.slice("Configure move: ".length).trim();
    if (/^\w+$/.test(rest)) return rest;
  }
  return null;
}

/** @param {string} title @param {string} [body] */
export function parseTypeKeyFromIssue(title, body) {
  const fromBody = body?.match(/<!--\s*work-item:dex-type:(\w+)\s*-->/);
  if (fromBody) return fromBody[1];
  if (title.startsWith("Configure type: ")) {
    const rest = title.slice("Configure type: ".length).trim();
    if (/^\w+$/.test(rest)) return rest;
  }
  return null;
}

/** @param {string} title @param {string} [body] */
export function parsePokemonFormItemIdFromIssue(title, body) {
  const fromBody = body?.match(
    /<!--\s*work-item:dex-pokemon-form:([\w-]+)\s*-->/,
  );
  if (fromBody) return fromBody[1];
  const m = title.match(
    /^Configure\s+Pokemon\s+form:\s*(\d+)\s*\(\s*([\w-]+)\s*\)\s*$/i,
  );
  if (m) return `${m[1]}-${m[2]}`;
  return null;
}

/**
 * @returns {{ key: string; kind: "move" | "form" | "type" } | null}
 */
export function parseWorkItemKey(title, body) {
  const t = title ?? "";
  const b = body ?? "";

  let m = b.match(/<!--\s*work-item:dex-move:(\w+)\s*-->/);
  if (m) return { key: `move:${m[1]}`, kind: "move" };

  m = b.match(/<!--\s*work-item:dex-pokemon-form:([\w-]+)\s*-->/);
  if (m) return { key: `form:${m[1]}`, kind: "form" };

  m = b.match(/<!--\s*work-item:dex-type:(\w+)\s*-->/);
  if (m) return { key: `type:${m[1]}`, kind: "type" };

  if (t.startsWith("Configure move: ")) {
    const rest = t.slice("Configure move: ".length).trim();
    if (/^\w+$/.test(rest)) return { key: `move:${rest}`, kind: "move" };
  }

  const tf = t.match(
    /^Configure\s+Pokemon\s+form:\s*(\d+)\s*\(\s*([\w-]+)\s*\)\s*$/i,
  );
  if (tf) return { key: `form:${tf[1]}-${tf[2]}`, kind: "form" };

  if (t.startsWith("Configure type: ")) {
    const rest = t.slice("Configure type: ".length).trim();
    if (/^\w+$/.test(rest)) return { key: `type:${rest}`, kind: "type" };
  }

  return null;
}
