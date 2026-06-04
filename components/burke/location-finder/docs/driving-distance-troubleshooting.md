# Driving distance troubleshooting

Location Finder **driving miles** mode asks the public [OSRM](https://project-osrm.org/) service for **road-network** distance from your **target** to each **secondary** location. A result is only returned when OSRM finds a **drivable path** on its map data.

## Google shows a route but Location Finder does not

Google searches like **“1400 Senate Street, Columbia, SC 29201 to 1576 Spence Drive”** send **both** addresses together. Google uses the first address to infer that **Spence Drive** is in the **Columbia** area.

Location Finder geocodes **each line by itself**:

| Your CSV / paste row | What Google does | What we did before |
|---------------------|------------------|-------------------|
| `1576 Spence Drive` | Interprets as Columbia-area (from “to” context) | Geocoded street-only, often wrong region |
| Full street + city + state | Same | Same |

**Fix in app:** When the **target** is resolved, bulk import now also geocodes street-only secondaries as  
`1576 Spence Drive, Columbia, South Carolina, 29201` (city/state/ZIP taken from the target).

**You should still:** Put city and state on every secondary when possible. Re-import or re-resolve rows after setting the target.

For the Senate → Spence example, OSRM **does** return a driving route once both pins are in the Columbia/Lexington area with correct coordinates (on the order of ~15–20 road miles depending on the exact pins).

## Why straight-line and driving disagree

| Symptom | Likely meaning |
|--------|----------------|
| Close in **straight-line miles**, missing in **driving miles** | Coordinates are near in air distance but **not connected by roads** (water, private land, missing ferry in OSRM, etc.). |
| Far in both modes | Genuinely far; driving may also be longer than crow-flies. |
| Driving works for a few pins on the same shore | **Geographic disconnect** — only the same landmass / road component routes. |

This is often correct behavior for peninsulas, lakes, and islands: straight-line can cross water; driving cannot.

## How to read the diagnostics panel

After **Find locations** in driving mode, if any destination has no driving route, a small **unrouted** badge appears on the map (top-right). Hover for a short summary; click to open the full diagnostics modal. When every location routes successfully, the badge and panel are hidden.

The modal includes:

1. **Likely root cause** — automated summary (geography vs geocoding vs target).
2. **Routed X / N** — how many secondaries received a road distance.
3. **Target snap** — meters OSRM moved the target pin to reach a road. Values **> 300 m** suggest the target geocode is not on a drivable point.
4. **Failure breakdown** — counts by reason code.
5. **Unrouted table** — each failed row with **straight mi**, **snap**, and **reason**.

### Failure codes

| Code | Meaning |
|------|--------|
| `no_road_route` | OSRM returned null duration and distance — **no drivable path** on the public graph. |
| `null_duration` / `null_distance` | Partial matrix — often transient or odd coordinates. |
| `invalid_*` | Unexpected numeric values from the router. |

### Snap distance

OSRM reports how far it moved each input coordinate to snap to the road network.

- **Low snap** (e.g. &lt; 50 m) + `no_road_route` → pins are on roads but **not reachable from the target by car** on this graph.
- **High snap** (e.g. &gt; 300 m) → geocode may be a rooftop, centroid, or wrong place; fix the address or pick a street-level suggestion.

## What to do

1. **Compare modes** — Run the same search with **straight-line miles** to see who is close in air distance.
2. **Check the map** — Failed pins across a bay from the target usually need geography, not better geocoding.
3. **Fix warnings** — Secondary rows in **warning** have no coordinates; resolve them before driving search.
4. **Refine target** — If **target snap** is high, re-pick the target on a public road near the job site.
5. **Bulk import** — Use full street addresses; ambiguous rows stay in warning until you confirm a suggestion.

## Technical notes

- Routing uses `https://router.project-osrm.org` (demo server, rate limits, no ferries where the graph omits them).
- Requests chunk to 25 destinations per OSRM call; large lists mean multiple sequential calls.
- The table request must send `destinations=1;2;3` (semicolon list). Repeated `destinations=1&destinations=2` only returns one leg and looked like mass “no road route” failures.
- Cached driving results store diagnostics alongside metrics. Older caches (metrics only) trigger a fresh API call on the next search.
