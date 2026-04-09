---
phase: 02-static-homepage
plan: 03
subsystem: ui
tags: [gsap, scrolltrigger, astro, react-island, scroll-animation, mode-toggle, accessibility]

# Dependency graph
requires:
  - phase: 02-01
    provides: CSS component files (sections.css, interactions.css, grid.css), content collections, homepage JSON
  - phase: 02-04
    provides: Static stub components for sections and UI elements
provides:
  - GSAP ScrollTrigger stacking scroll effect on SectionWrapper
  - CinematicReveal scroll-driven clipPath image reveal animation
  - PinnedNarrative pinned card crossfade sequence (desktop) with mobile fallback
  - ExhibitionCard component with 60/40 image-text split
  - ModeToggle React island with data-mode switching and localStorage persistence
  - SectionProgress scroll-tracking fraction counter with SVG progress arc
  - ReduceMotionToggle with localStorage and OS preference detection
  - Global reduce-motion CSS override
affects: [03-dual-mode, 04-deploy-present]

# Tech tracking
tech-stack:
  added: []
  patterns: [GSAP ScrollTrigger.matchMedia for responsive animation, sectionchange CustomEvent for cross-component communication, client:load React islands for interactive UI]

key-files:
  created:
    - src/components/sections/ExhibitionCard.astro
    - src/components/ui/ModeToggle.tsx
  modified:
    - src/components/sections/SectionWrapper.astro
    - src/components/sections/CinematicReveal.astro
    - src/components/sections/PinnedNarrative.astro
    - src/components/ui/StickyCTA.astro
    - src/components/ui/SectionProgress.tsx
    - src/components/ui/ReduceMotionToggle.astro
    - src/styles/base.css

key-decisions:
  - "SectionWrapper uses ScrollTrigger onUpdate with gsap.set instead of pin for content sections (already position:relative in CSS)"
  - "PinnedNarrative uses absolute-positioned cards with scrub-driven opacity/y crossfade instead of CSS scroll-snap"
  - "ModeToggle React island syncs with StickyCTA segmented toggle via DOM querySelectorAll"
  - "SectionProgress tracks sections via scroll position measurement rather than GSAP ScrollTrigger dependency"
  - "ReduceMotionToggle uses kunsthaus-reduce-motion localStorage key (namespaced)"

patterns-established:
  - "GSAP ScrollTrigger.matchMedia pattern: desktop/tablet/mobile responsive animation breakpoints"
  - "sectionchange CustomEvent dispatched by SectionWrapper for cross-component scroll tracking"
  - "astro:after-swap event listener for re-initialization after Astro page transitions"
  - "import.meta.env.BASE_URL prefix for all image src paths"

requirements-completed: [HOME-02, HOME-03]

# Metrics
duration: 5min
completed: 2026-04-09
---

# Phase 02 Plan 03: Content Sections & Interactive UI Summary

**GSAP ScrollTrigger scroll animations for section stacking, cinematic reveal, and pinned narrative; plus ModeToggle island, section progress tracker, and reduce-motion system**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-09T21:48:34Z
- **Completed:** 2026-04-09T21:53:57Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- SectionWrapper upgraded with GSAP ScrollTrigger stacking effect: pin/scale/rotate on desktop, scale+opacity on tablet, fade-up on mobile, with reduced-motion guard
- CinematicReveal now does scroll-driven clipPath expansion with overlay fade and text slide-in
- PinnedNarrative pins on desktop with card crossfade sequence, stacks on mobile
- ExhibitionCard created with 60/40 image-text split, 3:2 aspect ratio, placeholder support
- ModeToggle React island switches data-mode between planning/onsite with localStorage persistence
- SectionProgress tracks scroll position across sections with SVG arc and fraction counter
- Global reduce-motion CSS override added to base.css

## Task Commits

Each task was committed atomically:

1. **Task 1: Section wrapper, Cinematic Reveal Strip, Pinned Narrative Sequence** - `0d1d3a0` (feat)
2. **Task 2: Sticky CTA, mode toggle, section progress indicator, reduce-motion toggle** - `4783b10` (feat)

## Files Created/Modified
- `src/components/sections/SectionWrapper.astro` - Added GSAP ScrollTrigger stacking with matchMedia, data-section-index, sectionchange events
- `src/components/sections/CinematicReveal.astro` - Scroll-driven clipPath reveal, overlay fade, text slide-in animations
- `src/components/sections/PinnedNarrative.astro` - Pinned card crossfade (desktop), stacked scroll (mobile), ExhibitionCard import
- `src/components/sections/ExhibitionCard.astro` - New: 60/40 image-text card with 3:2 aspect ratio and placeholder
- `src/components/sections/StandardGrid.astro` - Unchanged (already complete)
- `src/components/ui/ModeToggle.tsx` - New: React island for data-mode switching with localStorage
- `src/components/ui/StickyCTA.astro` - Added ModeToggle client:load import, localStorage init, responsive @media
- `src/components/ui/SectionProgress.tsx` - Scroll-based section tracking, SVG progress arc with strokeDashoffset
- `src/components/ui/ReduceMotionToggle.astro` - Namespaced localStorage key, localized labels, astro:after-swap
- `src/styles/base.css` - Global html.reduce-motion animation/transition override

## Decisions Made
- SectionWrapper dispatches `sectionchange` CustomEvent for cross-component communication with SectionProgress
- PinnedNarrative uses absolute-positioned cards with scrub-driven opacity/y transitions for smooth crossfade
- ModeToggle syncs with StickyCTA segmented toggles by querying `[data-mode-segment]` elements
- SectionProgress uses direct scroll measurement rather than depending on GSAP ScrollTrigger internally
- ReduceMotionToggle uses `kunsthaus-reduce-motion` namespaced localStorage key

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added BASE_URL prefix to image paths in CinematicReveal and ExhibitionCard**
- **Found during:** Task 1
- **Issue:** Plan did not specify BASE_URL prefix for image src, but astro.config.mjs has `base: '/Kunsthaus'`
- **Fix:** Added `import.meta.env.BASE_URL.replace(/\/$/, '')` prefix to all image src attributes
- **Files modified:** CinematicReveal.astro, ExhibitionCard.astro
- **Verification:** Build passes, images will resolve correctly with base path
- **Committed in:** 0d1d3a0

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Essential for correct image loading with base URL. No scope creep.

## Issues Encountered
None

## Known Stubs
None - all components render real data from JSON content and all scroll animations are wired.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All section components have GSAP ScrollTrigger animations ready
- Mode toggle functional with data-mode attribute switching (semantic tokens automatically respond)
- Section progress indicator tracking scroll position
- Reduce-motion system in place for accessibility
- Ready for Phase 3 dual-mode logic and advanced animation refinement

## Self-Check: PASSED

- All 9 files verified present on disk
- Commit 0d1d3a0 (Task 1) confirmed in git log
- Commit 4783b10 (Task 2) confirmed in git log
- `npx astro build` passes successfully

---
*Phase: 02-static-homepage*
*Completed: 2026-04-09*
