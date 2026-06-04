const OSRM_TABLE_URL = "https://router.project-osrm.org/table/v1/driving";
const METERS_PER_MILE = 1609.344;
const OSRM_FETCH_TIMEOUT_MS = 15_000;

export type OsrmLegMetrics = {
  miles: number;
  minutes: number;
};

/** Target is index 0; each destination is 1..n in the same order as `destinations`. */
export async function fetchOsrmTableMetrics(
  target: { lat: number; lon: number },
  destinations: { lat: number; lon: number }[],
  fetchImpl: typeof fetch = fetch,
): Promise<OsrmLegMetrics[]> {
  if (destinations.length === 0) {
    return [];
  }

  const coords = [
    `${target.lon},${target.lat}`,
    ...destinations.map((d) => `${d.lon},${d.lat}`),
  ].join(";");

  const params = new URLSearchParams({
    sources: "0",
    annotations: "duration,distance",
  });
  for (let i = 0; i < destinations.length; i += 1) {
    params.append("destinations", String(i + 1));
  }

  const res = await fetchImpl(`${OSRM_TABLE_URL}/${coords}?${params}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(OSRM_FETCH_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Routing service error (${res.status})`);
  }

  const body: unknown = await res.json().catch(() => null);
  if (
    !body ||
    typeof body !== "object" ||
    !("durations" in body) ||
    !("distances" in body)
  ) {
    throw new Error("Invalid routing response");
  }

  const durations = (body as { durations: unknown }).durations;
  const distances = (body as { distances: unknown }).distances;

  if (
    !Array.isArray(durations) ||
    !Array.isArray(distances) ||
    !Array.isArray(durations[0]) ||
    !Array.isArray(distances[0])
  ) {
    throw new Error("Invalid routing matrix");
  }

  const durationRow = durations[0] as (number | null)[];
  const distanceRow = distances[0] as (number | null)[];

  return destinations.map((_, i) => {
    const durationSec = durationRow[i + 1];
    const distanceM = distanceRow[i + 1];
    if (
      durationSec === null ||
      distanceM === null ||
      !Number.isFinite(durationSec) ||
      !Number.isFinite(distanceM)
    ) {
      throw new Error("Unreachable route");
    }
    return {
      minutes: durationSec / 60,
      miles: distanceM / METERS_PER_MILE,
    };
  });
}
