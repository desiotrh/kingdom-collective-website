# State & County Seeding

This package can generate skeleton JSON files for EVERY US state and county:

- `states/<state>/<county>/family.json`
- `states/<state>/<county>/lawyers.json`

These are placeholders for verified resources and directories you will fill over time.

## Commands

- Dry run (no files written):

```
npm run seed:dry --workspace=packages/stand-state-packs
```

- Pilot states only (IA, OK):

```
npm run seed:pilot --workspace=packages/stand-state-packs
```

- Full seeding (all states and counties):

```
npm run seed:all --workspace=packages/stand-state-packs
```

## How it works

- Fetches county list via US Census API and maps to USPS state abbreviations (territories skipped).
- Creates directories per state and county slug, and writes empty `family.json` and `lawyers.json` if not present.

## Notes

- If network is unavailable or the API rate-limits, rerun later or use `--limit-states=CA,TX,FL` flags (edit the script as needed).
- Generated files are additive (existing files are not overwritten).
- After seeding, add verified sources and data to each JSON with `verifiedAt` timestamps.
