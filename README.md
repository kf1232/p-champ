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

Open issues are used as a community task queue for incremental project improvements and data validation updates.

### Open Issue Workflow

1. Pick an open issue and start work.
2. Gather source proof for the change you are making.
3. Implement the update in the relevant project files.
4. Open a PR that links the issue and includes proof attachments (screenshots/snapshots).
5. Add a clear PR description of what changed and why the attached evidence supports it.

Workflow rules:
1. This code repo is public and free to use.
2. PR submissions must include proof of game data (for example, screenshot/snapshot evidence).
3. There is no reward beyond the satisfaction of helping complete the project.

## Local Development Info

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
