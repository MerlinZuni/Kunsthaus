---
phase: 02-static-homepage
plan: 04
subsystem: footer, homepage, composition
tags: [astro, footer, marquee, homepage-composition, section-mapping, mode-toggle]

requires:
  - phase: 02-static-homepage
    plan: 01
    provides: "Content collections, CSS interactions, section infrastructure"
provides:
  - "Complete footer component: marquee, 4-column layout, dark bottom bar"
  - "ReduceMotionToggle with localStorage persistence"
  - "Homepage composition: hero, 6 sections, footer, sticky CTA, section progress"
  - "Section-to-component mapping per D-29"
  - "Background rotation per D-26"
  - "Stub components for hero, sections, CTA, progress (Plans 02-02/03 not yet executed)"
affects: [03-dual-mode, 03-animations]

tech-stack:
  added: []
  patterns:
    - "Footer composition: marquee + columns + bottom bar sub-components"
    - "getCollection('footer') with single-entry array pattern"
    - "Section-to-component type mapping for mixed/pinned-narrative/standard-grid"
    - "bgStep rotation: i % 4 cycling through 4-step backgrounds"
    - "Mode toggle via data-mode attribute on html element"
    - "React island (SectionProgress) with client:visible hydration"

key-files:
  created:
    - src/components/footer/Footer.astro
    - src/components/footer/FooterMarquee.astro
    - src/components/footer/FooterColumns.astro
    - src/components/footer/FooterBottomBar.astro
    - src/components/ui/ReduceMotionToggle.astro
    - src/components/hero/HeroCarousel.astro
    - src/components/sections/SectionWrapper.astro
    - src/components/sections/CinematicReveal.astro
    - src/components/sections/PinnedNarrative.astro
    - src/components/sections/StandardGrid.astro
    - src/components/ui/StickyCTA.astro
    - src/components/ui/SectionProgress.tsx
  modified:
    - src/pages/index.astro
    - src/layouts/BaseLayout.astro

key-decisions:
  - "Created stub components for Plans 02-02/03 dependencies (Rule 3: blocking issues) -- these render real content from JSON but lack full styling/animation"
  - "ReduceMotionToggle placed in footer per D-40, uses localStorage with OS preference as default"
  - "Footer z-index 30 places it above stacking sections but below fixed UI elements"
  - "getString helper resolves ui-strings by key with lang fallback"

patterns-established:
  - "Footer sub-component composition: Footer.astro orchestrates Marquee + Columns + BottomBar"
  - "Homepage section loop with component type switch (mixed/pinned-narrative/standard-grid)"
  - "Stub component pattern: real data rendering with minimal layout, animation hooks ready for Phase 3"

requirements-completed: [HOME-04]

duration: 6min
completed: 2026-04-09
---

# Phase 2 Plan 4: Footer & Homepage Composition Summary

**Complete footer with infinite marquee, 4-column bilingual content, dark bottom bar with social icons; homepage composition wiring hero, 6 content sections with D-26 background rotation and D-29 component mapping, sticky CTA with mode toggle, and section progress indicator**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-09T11:26:56Z
- **Completed:** 2026-04-09T11:32:59Z
- **Tasks:** 2 of 3 (Task 3 is checkpoint:human-verify)
- **Files modified:** 14

## Accomplishments

- Footer component suite: marquee with infinite CSS animation (pauses on hover, disabled on reduced-motion), 4-column grid with address/hours/links/newsletter from JSON in EN+DE, dark bottom bar with Facebook/Instagram SVG icons
- ReduceMotionToggle: accessible switch with OS-preference detection and localStorage persistence
- Homepage composition: complete rewrite of index.astro with hero carousel, hero-spacer, 6 content sections using SectionWrapper with incrementing z-index and 4-step background rotation
- Section-to-component mapping: exhibitions uses CinematicReveal + PinnedNarrative, offerings/education use PinnedNarrative, key-info/events/planning-details use StandardGrid
- Sticky CTA with mode toggle (switches data-mode on html element) + Tickets button, desktop floating and mobile sticky bar layouts
- Section progress indicator as React island with SVG progress arc and fraction counter
- BaseLayout updated: dynamic lang prop (default 'en')

## Task Commits

Each task was committed atomically:

1. **Task 1: Footer component with marquee, columns, and dark bottom bar** - `cddcb18` (feat)
2. **Task 2: Compose complete homepage in index.astro** - `28d6a3c` (feat)

## Files Created/Modified

### Footer Components
- `src/components/footer/Footer.astro` - Composition: 4px border-top, getCollection('footer'), sub-components
- `src/components/footer/FooterMarquee.astro` - Infinite CSS marquee, hover pause, reduced-motion support
- `src/components/footer/FooterColumns.astro` - 4-column grid: address, hours, links/media, newsletter
- `src/components/footer/FooterBottomBar.astro` - Dark #0f0f0f bar with SVG social icons, legal links, copyright

### UI Components
- `src/components/ui/ReduceMotionToggle.astro` - Accessible toggle, localStorage + OS preference
- `src/components/ui/StickyCTA.astro` - Mode toggle + Tickets, desktop floating / mobile sticky bar
- `src/components/ui/SectionProgress.tsx` - React island, SVG progress arc + fraction counter

### Stub Components (Plans 02-02/03 dependencies)
- `src/components/hero/HeroCarousel.astro` - Hero with scattered images, right-aligned KUNST/HAUS/ZURICH, progress tabs
- `src/components/sections/SectionWrapper.astro` - Section wrapper with z-index, bgStep, aria-label
- `src/components/sections/CinematicReveal.astro` - 2-column image/content layout for featured exhibitions
- `src/components/sections/PinnedNarrative.astro` - Alternating card layout for scrolling content
- `src/components/sections/StandardGrid.astro` - Responsive grid for informational sections

### Modified
- `src/pages/index.astro` - Complete rewrite: hero + 6 sections + footer + fixed UI
- `src/layouts/BaseLayout.astro` - Dynamic lang prop on html element

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created stub components for missing Plan 02-02/03 dependencies**
- **Found during:** Task 2
- **Issue:** Plans 02-02 (Nav/Hero) and 02-03 (Section components) have not been executed. index.astro imports HeroCarousel, SectionWrapper, CinematicReveal, PinnedNarrative, StandardGrid, StickyCTA, SectionProgress -- none of which exist.
- **Fix:** Created functional stub implementations that render real content from JSON with proper layout. These are not empty stubs -- they display actual content with responsive CSS. Full animation/interaction will be added by Plans 02-02/03 or Phase 3.
- **Files created:** 7 stub components (see list above)
- **Commits:** 28d6a3c

## Known Stubs

| File | Description | Resolution |
|------|-------------|------------|
| src/components/hero/HeroCarousel.astro | Static first slide only, no carousel auto-play/switching | Plan 02-02 or Phase 3 |
| src/components/sections/CinematicReveal.astro | Static 2-column layout, no scroll-driven clipPath animation | Phase 3 (GSAP ScrollTrigger) |
| src/components/sections/PinnedNarrative.astro | Static card list, no pinning/scroll animation | Phase 3 (GSAP ScrollTrigger) |
| src/components/ui/SectionProgress.tsx | Static "01/06" display, not driven by scroll position | Phase 3 (GSAP ScrollTrigger) |
| src/components/ui/StickyCTA.astro | Mode toggle switches data-mode but no visual transition | Phase 3 (mode transitions) |

These stubs render real JSON content and are structurally complete. They are intentional -- Plans 02-02/03 will replace or enhance them with full interactivity.

## Decisions Made

- Created functional stub components for missing dependencies rather than blocking on plan ordering -- enables end-to-end homepage viewing
- ReduceMotionToggle placed within footer (not as a separate fixed element) per D-40 specification
- Footer gets z-index: 30, positioning it above stacking sections (20-27) but below sticky CTA/progress (50) and nav (60)
- getString helper provides localized UI string lookup by key with language parameter

## Issues Encountered

None beyond the missing Plan 02-02/03 dependencies (handled via Rule 3).

## Checkpoint Status

Task 3 (visual verification) is a human-verify checkpoint. The dev server needs to be started (`npm run dev`) for the user to verify the complete homepage visually.

## Self-Check: PASSED

All 14 created/modified files verified present. Both task commits (cddcb18, 28d6a3c) verified in git log.

---
*Phase: 02-static-homepage*
*Completed: 2026-04-09 (Tasks 1-2; Task 3 awaiting verification)*
