# Components layout

## Folders

| Location | Purpose |
|----------|---------|
| **`components/commons/`** | **Shared** UI used by **more than one feature** (e.g. viewport-locked footer shell, blank footer band keyed by feature). Import from `@/components/commons`. |
| **`components/{feature}/`** | **Page-level** and **feature-owned** UI for one surface (`portal`, `wow`, `photography`, `p-champ`, …). Import from `@/components/{feature}`. |

Put something in **commons** only when it is truly cross-feature. If it only serves routes under **`/p-champ`**, it belongs under **`components/p-champ/`**, not under commons.

## Portal vs P-Champ (no duplicate “home” folder)

| Area | Route | Role |
|------|--------|------|
| **Portal** | `/` | Site hub: links **out** to P-Champ, Photography, WoW, Burke (`PortalHomeScreen`). |
| **P-Champ** | `/p-champ` | Dex product **landing**: nav, copy, grid into Dex / Team Builder (`PChampHomeScreen`). |

They both use a title + grid pattern, but different routes, copy, and targets — keep **portal** and **p-champ** as separate feature folders.

## Portal (Fink Social hub)

**Route:** `/` (`app/page.tsx`).

**Files:**

| File | Role |
|------|------|
| `components/portal/portalHomeCopy.ts` | `PORTAL_TITLE`, `PORTAL_DESCRIPTION` — shared with route **metadata** in `app/page.tsx`. |
| `components/portal/PortalHomeScreen.tsx` | Hub grid + layout; **`ViewportLockedPageShell`** with `footer="portal"`. |
| `components/portal/index.ts` | Barrel exports. |

**Usage:**

```ts
import { PortalHomeScreen, PORTAL_TITLE, PORTAL_DESCRIPTION } from "@/components/portal";
```

## P-Champ (`/p-champ/*`)

**Barrel:** `@/components/p-champ`.

| File | Role |
|------|------|
| `Navigation.jsx` | Top nav + game filter for P-Champ routes. |
| `GameSelectionProvider.tsx` | Dex list “game” selection (`useGameSelection`). |
| `PChampHomeScreen.tsx` | Landing at **`/p-champ`** (nav + intro + placeholder grid). |
| `PChampPlaceholderGrid.tsx` | Dex / Team Builder tiles + empty cells. |
| `dex/` | Dex route UI (`DexScreen`, grid/placeholder/modal, `useDexDisplayEntriesForSelectedGame`, damage-category icons). Re-exported from the barrel. |
| `team-builder/` | Team Builder route UI (`TeamBuilderScreen`, selector matchup grid, type badges). Re-exported from the barrel. |

**Landing usage** (`app/p-champ/page.tsx`):

```ts
import { PChampHomeScreen } from "@/components/p-champ";
```

**`Navigation` is used by:** `PChampHomeScreen`, `components/p-champ/dex/DexScreen.tsx`, `components/p-champ/team-builder/TeamBuilderScreen.tsx`.

**Props (`Navigation`):** optional `title` (default `SITE_NAME`).

## P-Champ game / dex list selection

**Exports:** `GameSelectionProvider`, `useGameSelection` from `@/components/p-champ`.

**Purpose:** Persists dex list view (`localStorage` `p-champ:selected-game`).

**Usage:**

```ts
import { GameSelectionProvider, useGameSelection } from "@/components/p-champ";
```

**`GameSelectionProvider`:** Wrapped in `app/layout.tsx`. **`useGameSelection`:** only under that provider.

## Browser storage (`lib/storage`)

**Sole API:** `appLocalStorage(APP_STORAGE_KEYS.…)` from `@/lib/storage`. Do not call `localStorage` elsewhere (ESLint enforces this).

**Keys:** All keys live in `APP_STORAGE_KEYS` (`lib/storage/keys.ts`). Core clients live in `lib/storage/registry.ts`; feature-specific envelope clients register via `registerAppStorageClient` (see `lib/burke/location-finder/store/registerAppStorage.ts`). Persisted key strings still use the `p-champ:` prefix for backward compatibility.

## Feature libs (`lib/{feature}/`)

Product-specific server/domain code lives under **`lib/<feature>/`**, mirroring **`components/<feature>/`** and **`app/<feature>/`** (or **`app/api/<feature>/`**). Cross-app helpers stay at **`lib/`** root (`site.ts`, `storage/`, `viewportFooterChrome.ts`, `gridPlaceholders.ts`).

### P-Champ (`lib/p-champ/`)

| Module | Role |
|--------|------|
| **`lib/p-champ/dex/`** | Dex data, types, matchup/stat helpers, team-builder logic |
| **`lib/p-champ/paths.ts`** | `/p-champ` route constants (also re-exported from `lib/site.ts`) |

### Photography (`lib/photography/`)

| Module | Role |
|--------|------|
| **`lib/photography/lightroomWeb.ts`** | Adobe Lightroom share rendition URLs |
| **`lib/photography/galleryEnv.ts`** | Gallery password / share URL env parsing |
| **`lib/photography/paths.ts`** | `/photography` route (re-exported from `lib/site.ts`) |

### Burke (`lib/burke/`)

| Module | Role |
|--------|------|
| **`lib/burke/geo/`** | Geocoding: Google API, resolve, address field types, in-memory geocode cache |
| **`lib/burke/location-finder/store/`** | Data control: read/write/merge Location Finder cache via `appLocalStorage` |
| **`lib/burke/location-finder/distance/`** | Proximity (haversine, OSRM, thresholds) |
| **`lib/burke/location-finder/access/`** | Gate cookie + API grant helpers |
| **`lib/burke/paths.ts`** | `/burke` routes (re-exported from `lib/site.ts`) |

### WoW (`lib/wow/`)

API clients, storage, guild/character helpers — see `lib/wow/`. Route constants in **`lib/wow/paths.ts`** (re-exported from `lib/site.ts`).

**`lib/site.ts`** still aggregates portal-wide names and re-exports feature paths so hub/nav code can import one module.

## Commons viewport chrome

**Files:** `ViewportLockedPageShell`, `AppViewportFooter`, `AppStorageFooterProvider`, `ViewportLockedFooterBar` in `components/commons/`. TTL envelope services register via `createEnvelopeStorageFooterConfig` + `useRegisterAppStorageFooter` (cache size, TTL, download, clear — same controls on WoW and Burke Location Finder).

**Usage:** Pass blank-footer key `portal` \| `pChamp` \| `photography`, or use `ViewportLockedFooterBar` for custom footer (WoW). Constants in `lib/viewportFooterChrome.ts`.
