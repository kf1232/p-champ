# p-champ

`p-champ` is a public, free-to-use fan project for organizing and displaying battle-ready dex data.

## Published Website

https://fink.social/

## Project Structure and Design

- `app/`: Next.js App Router pages (`/` and `/dex`) and global layout.
- `components/`: UI screens and reusable view components.
- `lib/dex/`: Core domain data and types.
  - `dexObject.ts`: source-of-truth record map keyed by dex id.
  - `moves.ts`, `types.ts`, `constants.ts`: normalized reference catalogs.
  - `display.ts`: transforms raw records into UI-friendly display entries.
  - `index.ts`: centralized exports for consumers.

Design approach:
- Data is modeled as typed records (`DexRecord`, `DexForm`) with explicit form variants.
- Display logic is separated from raw data to keep UI rendering simple and predictable.
- Incomplete entries are intentionally tracked as `null` values until verified game data is available.

## Open Issue Scope

Current open issues are primarily data-completion tasks (for example, `Configure Record ###`) and are intended as a focused TODO list for filling incomplete dex records.

Contribution rules:
1. This code repo is public and free to use.
2. Open issue submissions must include proof of game data (for example, screenshot/snapshot evidence).
3. There is no reward beyond the satisfaction of helping complete the project.

## Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
