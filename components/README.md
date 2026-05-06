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
| **Portal** | `/` | Site hub: links **out** to P-Champ, Photography, WoW (`PortalHomeScreen`). |
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

## Commons viewport chrome

**Files:** `ViewportLockedPageShell`, `ViewportBlankFooter`, `ViewportLockedFooterBar` in `components/commons/`.

**Usage:** Pass blank-footer key `portal` \| `pChamp` \| `photography`, or use `ViewportLockedFooterBar` for custom footer (WoW). Constants in `lib/viewportFooterChrome.ts`.
