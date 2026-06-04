/** Parse one CSV line respecting quoted fields. */
export function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (c === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += c;
  }

  out.push(cur.trim());
  return out;
}

function isHeaderRow(cells: string[]): boolean {
  if (cells.length !== 1) {
    return false;
  }
  return /^address$/i.test(cells[0]!.trim());
}

/** Each non-empty line becomes one address string (columns joined with ", "). */
export function parseLocationsCsv(csv: string): string[] {
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const addresses: string[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const cells = parseCsvLine(lines[i]!);
    if (cells.length === 0) {
      continue;
    }
    if (i === 0 && isHeaderRow(cells)) {
      continue;
    }
    const joined = cells.filter(Boolean).join(", ").trim();
    if (joined.length > 0) {
      addresses.push(joined);
    }
  }

  return addresses;
}
