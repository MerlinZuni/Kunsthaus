---
phase: 01-foundation
plan: 03
subsystem: ui
tags: [astro-content-collections, zod, json, i18n, content-layer]

# Dependency graph
requires:
  - phase: 01-foundation-01
    provides: BaseLayout.astro with CSS layer imports, Astro project scaffold
provides:
  - "Three Astro Content Collections: planning, onsite, shared"
  - "Zod schemas with localizedText i18n structure (DE+EN, FR optional)"
  - "Planning mode homepage content following D-13 priority hierarchy"
  - "On-site Kerry James Marshall exhibition content with artworks, rooms, audio guide"
  - "Shared navigation strings with localized labels"
  - "Proven JSON -> Content Collection -> Zod -> Astro template -> HTML data flow"
affects: [02-static-homepage, 03-dual-mode]

# Tech tracking
tech-stack:
  added: []
  patterns: [astro-content-collections, file-loader-json-array, localized-text-schema, priority-sorted-content]

key-files:
  created:
    - src/content.config.ts
    - src/content/planning/homepage.json
    - src/content/onsite/kerry-james-marshall.json
    - src/content/shared/navigation.json
  modified:
    - src/pages/index.astro

key-decisions:
  - "Content collections use file() loader with JSON arrays (id field as identifier)"
  - "localizedText Zod schema: de + en required, fr optional placeholder for future"

patterns-established:
  - "Content collection pattern: defineCollection + file() loader + Zod schema in src/content.config.ts"
  - "i18n JSON structure: all text fields use {de: string, en: string, fr?: string} shape"
  - "Content query pattern: getCollection('name') returns sorted typed entries"
  - "One JSON file per exhibition (D-19) -- onsite collection points to specific file"

requirements-completed: [TECH-02]

# Metrics
duration: 2min
completed: 2026-04-07
---

# Phase 01 Plan 03: Content Collections Summary

**Astro Content Collections with Zod-validated JSON for Planning homepage (5 sections), On-site Kerry James Marshall exhibition (4 artworks), and shared navigation -- wired into index page proving end-to-end data flow**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-07T15:31:02Z
- **Completed:** 2026-04-07T15:33:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Three content collections (planning, onsite, shared) with Zod schemas and localizedText i18n pattern
- Planning homepage with 5 priority-ordered sections: hero, key-info, exhibitions, offerings, events -- realistic mock data modeled after kunsthaus.ch
- On-site exhibition: Kerry James Marshall retrospective with 4 artworks including room locations, audio guide flags, and members-only gates
- Index page renders all content from JSON with zero hardcoded text, proving the full data pipeline

## Task Commits

Each task was committed atomically:

1. **Task 1: Create content collection schemas and JSON data files** - `2d384ac` (feat)
2. **Task 2: Wire content collections into index page** - `ef049b1` (feat)

## Files Created/Modified
- `src/content.config.ts` - Three collection definitions with Zod schemas, localizedText helper, file() loaders
- `src/content/planning/homepage.json` - 5 homepage sections following priority hierarchy with DE+EN text
- `src/content/onsite/kerry-james-marshall.json` - Exhibition with 4 artworks, practical info, rooms, audio guide
- `src/content/shared/navigation.json` - 6 navigation entries with localized labels and hrefs
- `src/pages/index.astro` - Loads planning content via getCollection, renders sorted sections from JSON

## Decisions Made
- Content collections use `file()` loader with JSON arrays where each entry has an `id` field -- this matches Astro 6's expected format for the file() loader
- localizedText schema defined as reusable Zod object with `de` + `en` required, `fr` optional -- ready for future language expansion without schema changes
- Default language set to `'de'` in index page with comment noting Phase 2 will add language switching

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered
None

## Known Stubs
None -- all content collections contain real structured data, index page renders live content from JSON.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Content collections are queryable via `getCollection('planning')`, `getCollection('onsite')`, `getCollection('shared')`
- Phase 2 components can import and render typed content immediately
- i18n structure ready for language switcher implementation
- On-site exhibition data ready for artwork detail pages and audio guide UI

---
*Phase: 01-foundation*
*Completed: 2026-04-07*
