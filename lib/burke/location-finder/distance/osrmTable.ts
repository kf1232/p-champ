import { classifyLegMatrixValues } from "./routingDiagnostics";
import type { RoutingLegFailure } from "./routingDiagnostics";

const OSRM_TABLE_URL = "https://router.project-osrm.org/table/v1/driving";
const METERS_PER_MILE = 1609.344;
const OSRM_FETCH_TIMEOUT_MS = 30_000;
/** Keep coordinate strings under typical OSRM / proxy URL limits. */
export const OSRM_TABLE_MAX_DESTINATIONS_PER_REQUEST = 25;

export type OsrmLegMetrics = {
  miles: number;
  minutes: number;
  snapDistanceMeters?: number;
};

export type OsrmLegResult =
  | { status: "routed"; metrics: OsrmLegMetrics }
  | { status: "unrouted"; failure: RoutingLegFailure };

export type OsrmTableMatrix = {
  durations: (number | null)[][];
  distances: (number | null)[][];
  /** Per-destination snap distance (meters) from OSRM, same order as request destinations. */
  snapDistanceMeters: (number | null)[];
  /** Snap distance for coordinate index 0 (target). */
  sourceSnapDistanceMeters: number | null;
};

/** Parse OSRM table `durations` / `distances` for source row 0. */
export function parseOsrmTableLegs(matrix: OsrmTableMatrix): OsrmLegResult[] {
  const durationRow = matrix.durations[0];
  const distanceRow = matrix.distances[0];
  const count = matrix.snapDistanceMeters.length;

  if (!durationRow || !distanceRow) {
    const failure: RoutingLegFailure = {
      code: "no_road_route",
      detail: "missing_matrix_row",
    };
    return Array.from({ length: count }, () => ({
      status: "unrouted" as const,
      failure,
    }));
  }

  return Array.from({ length: count }, (_, i) => {
    const legFailure = classifyLegMatrixValues(
      durationRow[i],
      distanceRow[i],
      matrix.snapDistanceMeters[i],
    );
    if (legFailure) {
      const snap = matrix.snapDistanceMeters[i];
      if (typeof snap === "number" && Number.isFinite(snap)) {
        legFailure.snapDistanceMeters = snap;
        if (snap > 0) {
          legFailure.detail = [legFailure.detail, `snap_m=${snap.toFixed(0)}`]
            .filter(Boolean)
            .join("; ");
        }
      }
      return { status: "unrouted", failure: legFailure };
    }

    const durationSec = durationRow[i]!;
    const distanceM = distanceRow[i]!;
    const snap = matrix.snapDistanceMeters[i];
    return {
      status: "routed",
      metrics: {
        minutes: durationSec / 60,
        miles: distanceM / METERS_PER_MILE,
        snapDistanceMeters:
          typeof snap === "number" && Number.isFinite(snap) ? snap : undefined,
      },
    };
  });
}

type OsrmTableBody = {
  code?: string;
  message?: string;
  durations?: unknown;
  distances?: unknown;
  sources?: Array<{ distance?: number }>;
  destinations?: Array<{ distance?: number }>;
};

function parseOsrmTableBody(body: unknown, destinationsCount: number): OsrmTableMatrix {
  if (
    !body ||
    typeof body !== "object" ||
    !("durations" in body) ||
    !("distances" in body)
  ) {
    throw new Error("Invalid routing response");
  }

  const parsed = body as OsrmTableBody;
  const durations = parsed.durations;
  const distances = parsed.distances;

  if (
    !Array.isArray(durations) ||
    !Array.isArray(distances) ||
    !Array.isArray(durations[0]) ||
    !Array.isArray(distances[0])
  ) {
    throw new Error("Invalid routing matrix");
  }

  const snapDistanceMeters: (number | null)[] = Array.from(
    { length: destinationsCount },
    (_, i) => {
      const dest = parsed.destinations?.[i];
      const snap = dest?.distance;
      return typeof snap === "number" && Number.isFinite(snap) ? snap : null;
    },
  );

  const sourceSnap = parsed.sources?.[0]?.distance;
  const sourceSnapDistanceMeters =
    typeof sourceSnap === "number" && Number.isFinite(sourceSnap)
      ? sourceSnap
      : null;

  return {
    durations: durations as (number | null)[][],
    distances: distances as (number | null)[][],
    snapDistanceMeters,
    sourceSnapDistanceMeters,
  };
}

/**
 * OSRM expects `destinations=1;2;3` (semicolon list). Repeated
 * `destinations=1&destinations=2` only returns one matrix column.
 */
export function formatOsrmDestinationIndices(destinationCount: number): string {
  return Array.from({ length: destinationCount }, (_, i) => i + 1).join(";");
}

/** Build table service URL: coordinate 0 = target, 1..n = destinations. */
export function buildOsrmTableRequestUrl(
  target: { lat: number; lon: number },
  destinations: { lat: number; lon: number }[],
): string {
  const coords = [
    `${target.lon},${target.lat}`,
    ...destinations.map((d) => `${d.lon},${d.lat}`),
  ].join(";");

  const params = new URLSearchParams({
    sources: "0",
    annotations: "duration,distance",
    destinations: formatOsrmDestinationIndices(destinations.length),
  });

  return `${OSRM_TABLE_URL}/${coords}?${params}`;
}

async function fetchOsrmTableMatrix(
  target: { lat: number; lon: number },
  destinations: { lat: number; lon: number }[],
  fetchImpl: typeof fetch,
): Promise<OsrmTableMatrix> {
  const res = await fetchImpl(buildOsrmTableRequestUrl(target, destinations), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(OSRM_FETCH_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Routing service error (${res.status})`);
  }

  const body: unknown = await res.json().catch(() => null);
  const parsed = body as OsrmTableBody;
  if (parsed?.code && parsed.code !== "Ok") {
    const msg = parsed.message ? `: ${parsed.message}` : "";
    throw new Error(`Routing service could not compute routes (${parsed.code}${msg})`);
  }

  return parseOsrmTableBody(body, destinations.length);
}

export type OsrmTableMetricsResult = {
  legs: OsrmLegResult[];
  sourceSnapDistanceMeters: number | null;
};

/** Target is index 0; each destination is 1..n in the same order as `destinations`. */
export async function fetchOsrmTableMetrics(
  target: { lat: number; lon: number },
  destinations: { lat: number; lon: number }[],
  fetchImpl: typeof fetch = fetch,
): Promise<OsrmTableMetricsResult> {
  if (destinations.length === 0) {
    return { legs: [], sourceSnapDistanceMeters: null };
  }

  const legs: OsrmLegResult[] = [];
  let sourceSnapDistanceMeters: number | null = null;

  for (
    let offset = 0;
    offset < destinations.length;
    offset += OSRM_TABLE_MAX_DESTINATIONS_PER_REQUEST
  ) {
    const chunk = destinations.slice(
      offset,
      offset + OSRM_TABLE_MAX_DESTINATIONS_PER_REQUEST,
    );
    const matrix = await fetchOsrmTableMatrix(target, chunk, fetchImpl);
    if (offset === 0) {
      sourceSnapDistanceMeters = matrix.sourceSnapDistanceMeters;
    }
    legs.push(...parseOsrmTableLegs(matrix));
  }

  return { legs, sourceSnapDistanceMeters };
}
