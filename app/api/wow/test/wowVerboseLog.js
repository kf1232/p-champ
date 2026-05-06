/**
 * Optional verbose logging for WoW API integration tests.
 * Emits when Jest is run with `--verbose` (e.g. `npm run test:verbose`).
 */

/**
 * @param {{
 *   title: string;
 *   details: string[];
 *   status: number;
 *   body: unknown;
 * }} input
 */
export function logWowVerboseApiPayload(input) {
  if (!process.argv.includes("--verbose")) {
    return;
  }
  const { title, details, status, body } = input;
  let bodyText;
  try {
    bodyText =
      typeof body === "object" && body !== null
        ? JSON.stringify(body, null, 2)
        : String(body);
  } catch {
    bodyText = "[unserializable body]";
  }
  const max = 12_000;
  if (bodyText.length > max) {
    bodyText = `${bodyText.slice(0, max)}\n… (${bodyText.length} chars, truncated)`;
  }
  const lines = [
    `[WoW API verbose] ${title}`,
    `HTTP ${status}`,
    ...details.map((d) => `  ${d}`),
    bodyText,
  ];
  console.log(lines.join("\n"));
}
