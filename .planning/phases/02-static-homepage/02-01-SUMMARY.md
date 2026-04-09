---
phase: 02-static-homepage
plan: 01
subsystem: content, css
tags: [astro, zod, content-collections, css-layers, clip-path, textures]

requires:
  - phase: 01-foundation
    provides: "Astro project, CSS @layer system, content collections, localizedText schema, texture assets"
provides:
  - "Expanded content collections: footer, uiStrings with Zod schemas"
  - "Rich homepage JSON with 7 sections, hero carousel slides, enriched exhibitions/offerings"
  - "Footer JSON with address, schedule, links, social, legal in EN+DE"
  - "UI strings JSON with 14 CTA/a11y labels in EN+DE+FR"
  - "CSS interaction states: clip-path wipe, inverse wipe, touch pulse, touch targets"
  - "CSS section infrastructure: background rotation, stacking, hero pinning, responsive spacing"
  - "Texture files served from /textures/ path"
affects: [02-02, 02-03, 02-04, 03-dual-mode]

tech-stack:
  added: []
  patterns:
    - "Hero carousel data as slides array within hero section entry"
    - "Footer content as single-entry file() collection"
    - "UI strings as key-value pairs with localizedText values"
    - "CSS clip-path wipe for hover interactions with @media (hover: hover) gate"
    - "4-step section background rotation via data-bg-step attribute"
    - "Hero pinning via position:fixed with spacer element pattern"

key-files:
  created:
    - src/content/shared/footer.json
    - src/content/shared/ui-strings.json
    - src/styles/components/interactions.css
    - src/styles/components/sections.css
    - public/textures/concrete-wall.png
    - public/textures/asfalt-dark.png
  modified:
    - src/content.config.ts
    - src/content/planning/homepage.json
    - src/content/shared/navigation.json
    - src/layouts/BaseLayout.astro

key-decisions:
  - "Hero slides stored as optional array within hero section entry rather than separate collection"
  - "Footer uses single-entry array for file() loader compatibility"
  - "UI strings use key+value pattern for template interpolation flexibility"

patterns-established:
  - "CSS component files in src/styles/components/ imported via BaseLayout.astro"
  - "Interaction classes: .hover-wipe, .hover-wipe-inverse, .touch-pulse, .link-underline, .touch-target"
  - "Section classes: .stacking-section[data-bg-step], .section-spacing, .hero-pinned, .hero-spacer"

requirements-completed: [HOME-01, HOME-02, HOME-03, HOME-04, NAV-01]

duration: 3min
completed: 2026-04-09
---

# Phase 2 Plan 1: Content & CSS Infrastructure Summary

**Expanded content layer with 7 homepage sections, footer, UI strings in EN+DE+FR, plus CSS interaction states (clip-path wipe, touch pulse) and section infrastructure (background rotation, hero pinning)**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-09T11:21:34Z
- **Completed:** 2026-04-09T11:24:45Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- All homepage content expanded: 7 sections with rich bilingual data, hero carousel with 4 slides, 4 exhibitions, 6 offerings
- Footer content complete: address, 7-day schedule, quick links, media links, newsletter, social, legal, copyright in EN+DE
- UI strings complete: 14 labels covering CTA, a11y, mode toggle, carousel, navigation in EN+DE+FR
- CSS interaction infrastructure: clip-path wipe hover (200ms/350ms asymmetric), inverse wipe for filled CTAs, touch pulse, WCAG touch targets
- CSS section infrastructure: 4-step background rotation with concrete textures, hero pinning, responsive section spacing, reduced motion support

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand content collections and JSON data** - `f36dbf7` (feat)
2. **Task 2: Copy textures and create CSS infrastructure** - `9a2604b` (feat)

## Files Created/Modified
- `src/content.config.ts` - Added footer, uiStrings collections and heroSlide schema
- `src/content/planning/homepage.json` - Expanded to 7 sections with hero slides, enriched exhibitions/offerings
- `src/content/shared/navigation.json` - Updated to 4 nav items (visit, collection, exhibitions, about)
- `src/content/shared/footer.json` - Complete footer content in EN+DE
- `src/content/shared/ui-strings.json` - 14 UI string labels in EN+DE+FR
- `src/styles/components/interactions.css` - Clip-path wipe, inverse wipe, touch pulse, link underline, touch targets
- `src/styles/components/sections.css` - Background rotation, section stacking, hero pinning, responsive spacing
- `src/layouts/BaseLayout.astro` - Added CSS imports for interactions and sections
- `public/textures/concrete-wall.png` - Concrete texture for section backgrounds
- `public/textures/asfalt-dark.png` - Asphalt texture for section backgrounds

## Decisions Made
- Hero slides stored as optional array within the hero section entry rather than a separate collection, keeping carousel data co-located with the section it belongs to
- Footer uses single-entry array wrapped for file() loader compatibility (Astro content collections require arrays)
- UI strings use key+value pattern to support template interpolation (e.g., "{n} of {total}")

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Content data layer is complete: all subsequent plans (02-02 nav/footer, 02-03 hero, 02-04 sections) can query collections directly
- CSS infrastructure is ready: interaction classes and section classes available for component implementation
- Texture files accessible at /textures/ path for section backgrounds

## Self-Check: PASSED

All 10 files verified present. Both task commits (f36dbf7, 9a2604b) verified in git log.

---
*Phase: 02-static-homepage*
*Completed: 2026-04-09*
