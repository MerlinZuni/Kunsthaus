---
phase: 02-static-homepage
plan: 02
subsystem: ui
tags: [astro, gsap, navigation, carousel, a11y, css-grid, scroll-trigger]

# Dependency graph
requires:
  - phase: 02-01
    provides: content collections, CSS interaction classes, section styles, typography tokens
provides:
  - Responsive navigation bar with velocity-aware scroll behavior
  - Logo island persistent floating element
  - Search overlay visual shell
  - Hamburger full-screen mobile menu
  - Language switcher (EN/DE/FR) with localStorage persistence
  - Hero carousel with GSAP auto-play and progress tabs
  - Monumental KUNST/HAUS/ZURICH right-aligned typography
  - Pause/play toggle (WCAG 2.2.2)
  - HeroSlide component with scattered image grid
  - CarouselTabs with animated fill bars
affects: [02-03, 02-04, 03-animation]

# Tech tracking
tech-stack:
  added: []
  patterns: [velocity-aware scroll hide/reveal, overlay scroll lock with lenis, GSAP timeline carousel auto-play, aria-roledescription carousel pattern]

key-files:
  created:
    - src/components/nav/NavBar.astro
    - src/components/nav/LogoIsland.astro
    - src/components/nav/SearchOverlay.astro
    - src/components/nav/HamburgerOverlay.astro
    - src/components/nav/LanguageSwitcher.astro
    - src/components/hero/HeroSlide.astro
    - src/components/hero/CarouselTabs.astro
  modified:
    - src/layouts/BaseLayout.astro
    - src/components/hero/HeroCarousel.astro

key-decisions:
  - "Direct JSON imports for nav data in BaseLayout (matching index.astro pattern, not getCollection)"
  - "Lenis instance exposed on window.__lenis for overlay scroll lock coordination"
  - "Carousel uses GSAP timeline with scaleX fill animation, not CSS keyframes"
  - "Auto-pause carousel on keyboard focus for accessibility"

patterns-established:
  - "Overlay pattern: toggle .is-open class, set aria-hidden, lock body scroll + lenis.stop()"
  - "Nav scroll: ScrollTrigger velocity check > 1500 hides, < 300 on scroll up reveals"
  - "Carousel auto-play: GSAP timeline repeat:-1, 5s per slide, fill bar scaleX 0->1"

requirements-completed: [NAV-01, HOME-01]

# Metrics
duration: 6min
completed: 2026-04-09
---

# Phase 02 Plan 02: Navigation & Hero Carousel Summary

**Responsive floating nav with velocity-aware scroll, mobile hamburger overlay, search shell, language switcher, and hero carousel with GSAP auto-play, progress tabs, and WCAG pause/play toggle**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-09T21:40:58Z
- **Completed:** 2026-04-09T21:46:25Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Navigation bar with search icon, centered logo (mix-blend-mode: exclusion), 4 nav links from JSON, and language switcher
- Velocity-aware scroll: fast scroll down hides nav + shows logo island, slow scroll up reveals nav
- Mobile simplified bar (search | logo | hamburger) that never hides, plus full-screen hamburger overlay
- Search overlay shell with input and 6 suggestion links, body scroll lock
- Hero carousel cycles 4 exhibition slides with GSAP timeline auto-play (5s per slide)
- Progress tabs with animated fill bars (scaleX), click to jump to slide
- Pause/play toggle, auto-pause on prefers-reduced-motion and keyboard focus
- ARIA carousel pattern with aria-roledescription, role=group slides, aria-live polite region

## Task Commits

Each task was committed atomically:

1. **Task 1: Navigation bar with scroll behavior, overlays, and language switcher** - `23f3b8b` (feat)
2. **Task 2: Hero carousel with monumental typography, scattered images, and progress tabs** - `ac6f430` (feat)

## Files Created/Modified
- `src/components/nav/NavBar.astro` - Floating nav with velocity-aware scroll hide/reveal
- `src/components/nav/LogoIsland.astro` - Persistent floating logo (z-index 65, mix-blend-mode exclusion)
- `src/components/nav/SearchOverlay.astro` - Visual search shell (z-index 80, body scroll lock)
- `src/components/nav/HamburgerOverlay.astro` - Full-screen mobile menu (z-index 80)
- `src/components/nav/LanguageSwitcher.astro` - EN/DE/FR dropdown with localStorage
- `src/components/hero/HeroCarousel.astro` - Full carousel with auto-play, pause/play, ARIA pattern
- `src/components/hero/HeroSlide.astro` - Individual slide with scattered images and CTA
- `src/components/hero/CarouselTabs.astro` - Progress tabs with animated fill bars
- `src/layouts/BaseLayout.astro` - Added nav imports, JSON data, lenis exposure on window

## Decisions Made
- Used direct JSON imports for navigation data in BaseLayout (consistent with index.astro pattern, avoiding getCollection which requires async frontmatter)
- Exposed Lenis instance on `window.__lenis` so overlays can coordinate scroll lock without importing Lenis directly
- Carousel uses GSAP timeline (not CSS keyframes) for precise coordination between slide transitions and fill bar animations
- Auto-pause carousel on keyboard focus into the carousel region for accessibility

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all components are fully wired with JSON data.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Nav and hero fully functional, ready for Phase 3 animation enhancements
- Hero spacer already in index.astro (placed by Plan 04)
- Overlay scroll lock pattern established for reuse in other overlays

## Self-Check: PASSED

- All 9 created/modified files verified on disk
- Commit 23f3b8b (Task 1) verified in git log
- Commit ac6f430 (Task 2) verified in git log
- Build passes (`npx astro build` completes successfully)

---
*Phase: 02-static-homepage*
*Completed: 2026-04-09*
