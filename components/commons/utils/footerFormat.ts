export function formatFooterByteSize(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"] as const;
  const i = Math.min(
    sizes.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k)),
  );
  const n = bytes / k ** i;
  const digits = i === 0 ? 0 : n >= 10 ? 0 : 1;
  return `${n.toFixed(digits)} ${sizes[i]}`;
}

export function formatFooterTtlRemaining(msRemaining: number): string {
  if (msRemaining <= 0) {
    return "0s";
  }
  let rest = Math.floor(msRemaining / 1000);
  const s = rest % 60;
  rest = Math.floor(rest / 60);
  const m = rest % 60;
  rest = Math.floor(rest / 60);
  const h = rest % 24;
  const d = Math.floor(rest / 24);
  const parts: string[] = [];
  if (d) {
    parts.push(`${d}d`);
  }
  if (d || h) {
    parts.push(`${h}h`);
  }
  if (d || h || m) {
    parts.push(`${m}m`);
  }
  parts.push(`${s}s`);
  return parts.join(" ");
}
