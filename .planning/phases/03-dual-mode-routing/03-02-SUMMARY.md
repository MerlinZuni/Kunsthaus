---
phase: 03-dual-mode-routing
plan: 02
subsystem: onsite-landing, content, accordion-forks
tags: [astro, content-collections, zod, gsap, accordion, dark-mode, view-transitions]

requires:
  - phase: 03-dual-mode-routing
    plan: 01
    provides: "/onsite route stub, data-mode='onsite' dark cascade, ClientRouter, base-path-aware anchors"

provides:
  - "Full /onsite landing page replacing the 03-01 stub"
  - "OnsiteHero static dark hero with grid-line background"
  - "OnsiteExhibitionGrid: responsive 2/3/4-col grid grouped by building"
  - "MuseumNavigatorTeaser dark teaser block with external link"
  - "InfoBox outlined card composing Wifi + TodaysEventsAccordion"
  - "TodaysEventsAccordion fork with client-side today filter, 4-state headline, dual init"
  - "FAQAccordion multi-open fork with dual init"
  - "onsiteHome content collection + src/content/onsite/home.json"
  - "Marisol patched with Moser Building / 1st Floor location"
  - "5 new events dated 2026-04-22 for today's-events demo"

affects: [03-03, 03-04]

tech-stack:
  added: []
  patterns:
    - "Single-file content collection stored as id-keyed object map (Astro file() loader expects object form)"
    - "Client-side today filter via data-events JSON attribute"
    - "Dual-init pattern: DOMContentLoaded + astro:page-load, guarded by data-initialized flag"
    - "Multi-open accordion (no sibling collapse on expand)"
    - "CinematicReveal adapter: map cardTitle → data.title at page level"

key-files:
  created:
    - src/content/onsite/home.json
    - src/components/hero/OnsiteHero.astro
    - src/components/sections/OnsiteExhibitionGrid.astro
    - src/components/sections/MuseumNavigatorTeaser.astro
    - src/components/sections/InfoBox.astro
    - src/components/ui/TodaysEventsAccordion.astro
    - src/components/ui/FAQAccordion.astro
  modified:
    - src/content.config.ts
    - src/content/planning/exhibitions.json
    - src/pages/onsite/index.astro

key-decisions:
  - "home.json restructured as {'onsite-home': {...}} object map (Astro file() loader schema error required this)"
  - "CinematicReveal uses data.title not cardTitle — page-level adapter remaps"
  - "KJM card NON-CLICKABLE in 03-02 (plain div); 03-03 will flip to <a>"
  - "TodaysEvents filter runs client-side, never build-time"
  - "StatusAccordion.astro NOT MODIFIED — dual-init fix lives only in forks"
  - "Two sibling SectionWrappers for Chipperfield + Moser groups"
  - "FAQ accordion is multi-open"
  - "home.json imported directly (not via getEntry) for simplicity; Zod schema still validates at build"

requirements-completed:
  - NAV-03

duration: ~15 min
completed: 2026-04-14
---

# Phase 03 Plan 02: On-site Landing Page Summary

The `/Kunsthaus/onsite` route is now a full landing page: a static "AT THE MUSEUM" hero, a cinematic reveal of the Chipperfield entrance, two building-grouped exhibition grids (Chipperfield 3 cards, Moser 2 cards incl. Marisol), a Museum Navigator teaser with an external link, an outlined Info Box combining Wi-Fi info with a live Today's Events accordion, and a multi-open 3-item FAQ accordion — all rendered under the dark `data-mode="onsite"` palette cascade established in 03-01.

**Started:** 2026-04-14T14:43Z
**Ended:** 2026-04-14T14:50Z
**Tasks completed:** 7
**Files touched:** 10 (7 created, 3 modified)

## Tasks

| # | Description | Commit |
|---|---|---|
| 1 | Content + schema foundation (home.json, onsiteHome collection, Marisol location, 5 events for 2026-04-22) | `eb91f5b` |
| 2 | OnsiteHero static dark hero | `0d429d4` |
| 3 | OnsiteExhibitionGrid responsive 2/3/4-col grid | `fd0e263` |
| 4 | TodaysEventsAccordion fork with 4-state headline | `f575fd5` |
| 5 | FAQAccordion + MuseumNavigatorTeaser + InfoBox | `776eeb9` |
| 6 | Compose /onsite/index.astro | `a3131d7` |
| 7 | Integration verification | `373d150` |

## Success Criteria

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | Full page renders, no stub copy | PASS | `grep 'onsite-stub' dist/onsite/index.html` = 0 |
| 2 | data-mode="onsite" on html | PASS | grep match in dist/onsite/index.html |
| 3 | OnsiteHero "AT THE MUSEUM" right-aligned, no JS | PASS | text present; grep `<script` in OnsiteHero.astro = 0 |
| 4 | Chipperfield 3 cards, Moser 2 cards | PASS | filtered at page level (Chipperfield: KJM, Laib, Wu Tsang; Moser: Rops, Marisol) |
| 5 | KJM card is non-clickable `<div>` | PASS | `grep '<a ' OnsiteExhibitionGrid.astro` = 0 |
| 6 | Grid 2/3/4 cols at 768/1024px | PASS | all three media queries present |
| 7 | Marisol has Moser Building/1st Floor | PASS | exhibitions.json patched |
| 8 | 5 events dated 2026-04-22 | PASS | 5 new entries with en-dash time strings |
| 9 | 4-state TodaysEvents headline | PASS | logic branches for none / now / next / ended |
| 10 | Dual-listener init guarded by dataset.initialized | PASS | both accordion forks |
| 11 | FAQ multi-open | PASS | click handler does not touch siblings |
| 12 | InfoBox outlined card + Wifi + TodaysEvents | PASS | composed via TodaysEventsAccordion import |
| 13 | Navigator teaser external link | PASS | target="_blank" rel="noopener noreferrer" |
| 14 | All internal hrefs + images base-prefixed | PASS | dist HTML only has `/Kunsthaus/...` image sources |
| 15 | Semantic tokens only (except OnsiteHero grid lines) | PASS | no hex literals in new components |
| 16 | `npm run build` succeeds | PASS | 2 pages built in ~6s |
| 17 | Reduce-motion path skips gsap.to | PASS | both accordion forks branch on matchMedia |
| 18 | Navigation from / → /onsite still works | PASS (structural) | ClientRouter + base-path anchors inherited from 03-01 |

## Deviations from Plan

### [Rule 3 - Blocking] Single-file content collection requires id-keyed object

- **Found during:** Task 1 build verification
- **Issue:** Astro's `file()` loader for single-JSON collections expects either a flat object keyed by id or an array of `{id, ...}`. A top-level object with an `id` field fails with `Expected type "object", received "string"`.
- **Fix:** Restructured `src/content/onsite/home.json` to `{ "onsite-home": { id, hero, ... } }`.
- **Files modified:** `src/content/onsite/home.json`
- **Verification:** Build now passes.
- **Commit:** `eb91f5b`

### [Rule 3 - Blocking] CinematicReveal prop shape mismatch

- **Found during:** Task 6 composition
- **Issue:** Plan snippet passed `{tagline, cardTitle, description, image, lang}` as individual props, but `CinematicReveal.astro` accepts `{contentType, data: {tagline, title, description, image}, lang}` where the card title is named `title`, not `cardTitle`.
- **Fix:** At page level, built a `cinematicData` object adapting `cardTitle → title`, wrapped the component inside a `<section class="stacking-section cinematic-reveal-section">` matching the Planning home pattern so the sticky-reveal scroll container works.
- **Files modified:** `src/pages/onsite/index.astro`
- **Verification:** Build succeeds, `/Kunsthaus/images/onsite/chipperfield-entrance.jpg` appears in rendered HTML.
- **Commit:** `a3131d7`

**Total deviations:** 2 auto-fixed (both Rule 3 - Blocking). Both were schema/API shape mismatches between the plan snippet and the real codebase; both discovered and fixed within the normal task flow with no architectural impact.

## Authentication Gates

None.

## Build / Type Check

`npm run build` succeeds end-to-end:
- Content sync OK (onsiteHome collection validates)
- Types generated in ~1.2s
- 2 pages built: `dist/index.html`, `dist/onsite/index.html`
- Total: 6.61s

Only pre-existing warnings (unrelated texture path resolution) — no new errors or warnings introduced by 03-02.

## Needs human verification

1. **Visual layout of OnsiteHero** — right-alignment, grid-line density, type sizing on desktop vs mobile.
2. **Cinematic reveal on /onsite** — image expand timing, card slide-in, confirm tagline reads correctly under the dark palette.
3. **TodaysEventsAccordion headline** depends on wall-clock time; to see the "Next at…" state before 09:00 (or the "Now:…" state between event windows) the demo must be run on 2026-04-22.
4. **Stacking-section scroll** — confirm the 5 SectionWrappers pin/scale correctly without any overlap glitches when scrolled slowly.
5. **FAQ multi-open behavior** visually.
6. **View Transitions navigation** from `/` to `/onsite` renders the full page (not the 03-01 stub), and accordions re-init via `astro:page-load`.

## Known Stubs

- KJM card in OnsiteExhibitionGrid renders as a plain `<div>` intentionally; 03-03 ships `/onsite/kerry-james-marshall` and will flip that card to an `<a href>` at that time. This is documented in 03-CONTEXT and is not a stub that blocks the 03-02 deliverable.
- `upcomingExhibitions[1..]` (hammershoi, lassnig-munch) still have no `location` field — they are not rendered on `/onsite` so no code path needs them. Left untouched.

## Self-Check: PASSED

- `src/content/onsite/home.json` exists and parses.
- `src/components/hero/OnsiteHero.astro` exists (commit 0d429d4).
- `src/components/sections/OnsiteExhibitionGrid.astro` exists (commit fd0e263).
- `src/components/sections/MuseumNavigatorTeaser.astro` exists (commit 776eeb9).
- `src/components/sections/InfoBox.astro` exists (commit 776eeb9).
- `src/components/ui/TodaysEventsAccordion.astro` exists (commit f575fd5).
- `src/components/ui/FAQAccordion.astro` exists (commit 776eeb9).
- `src/pages/onsite/index.astro` rewritten (commit a3131d7) — stub gone.
- `git diff eb91f5b~1 HEAD -- src/components/ui/StatusAccordion.astro` = empty (untouched).
- `grep -rn 'kunsthaus-mode' src/` = 0 matches (no 03-01 regression).
- `npm run build` succeeds.
- All 7 task commits reachable from HEAD: `eb91f5b`, `0d429d4`, `fd0e263`, `f575fd5`, `776eeb9`, `a3131d7`, `373d150`.
