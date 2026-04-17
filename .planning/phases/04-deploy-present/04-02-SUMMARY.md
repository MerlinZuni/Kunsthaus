---
phase: 04-deploy-present
plan: 02
subsystem: ui
tags: [i18n, language-switching, dom-manipulation, mutation-observer, astro]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: JSON content layer with de/en fields
  - phase: 02
    provides: Page templates and component library
  - phase: 03
    provides: All three pages (planning, onsite, KJM detail)
provides:
  - Working EN/DE language switching across all three pages
  - Global i18n swap script with MutationObserver pattern
  - FR disabled state with coming-soon indicator
affects: [04-deploy-present]

# Tech tracking
tech-stack:
  added: []
  patterns: [data-i18n attribute pattern for client-side language swap, MutationObserver on html[lang] for reactive i18n]

key-files:
  created: []
  modified:
    - src/layouts/BaseLayout.astro
    - src/components/nav/LanguageSwitcher.astro
    - src/components/nav/HamburgerOverlay.astro
    - src/pages/index.astro
    - src/pages/onsite/index.astro
    - src/pages/onsite/kerry-james-marshall.astro
    - src/components/sections/SectionWrapper.astro
    - src/components/sections/CinematicReveal.astro
    - src/components/sections/ExhibitionList.astro
    - src/components/sections/PinnedNarrative.astro
    - src/components/sections/EssentialsCard.astro
    - src/components/sections/OnsiteExhibitionGrid.astro
    - src/components/sections/HorizontalSlider.astro
    - src/components/sections/ArtistQuote.astro
    - src/components/ui/FAQAccordion.astro
    - src/components/hero/KjmHero.astro
    - src/components/hero/HeroSlide.astro

key-decisions:
  - "data-i18n-de/en attribute pattern chosen over full page re-render for lightweight client-side swap"
  - "MutationObserver on html[lang] attribute enables any lang-setting code to trigger swap"
  - "data-i18n-html marker for elements using set:html (innerHTML swap vs textContent)"
  - "Text node replacement preserves child elements like icons during language swap"

patterns-established:
  - "i18n attribute pattern: data-i18n-de and data-i18n-en on text elements, data-i18n-html for HTML content"
  - "SectionWrapper sectionNameDe optional prop for passing DE translation alongside EN default"

requirements-completed: [TECH-05]

# Metrics
duration: 9min
completed: 2026-04-17
---

# Phase 04 Plan 02: Language Switcher Summary

**EN/DE language switching via data-i18n attributes and MutationObserver, with FR coming-soon disabled state**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-17T08:13:10Z
- **Completed:** 2026-04-17T08:21:44Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments
- Global i18n swap script in BaseLayout that reactively swaps text content when html[lang] changes
- data-i18n-de/data-i18n-en attributes added across all three pages and 12 shared components
- FR language option visually disabled with "(soon)" label in both LanguageSwitcher and HamburgerOverlay
- Language preference persists across View Transitions via localStorage + astro:page-load listener

## Task Commits

Each task was committed atomically:

1. **Task 1: Add data-i18n attributes to page templates and create global swap script** - `1b54df5` (feat)
2. **Task 2: Disable FR language option with coming-soon state** - `14a38e2` (feat)

## Files Created/Modified
- `src/layouts/BaseLayout.astro` - Global i18n swap script with MutationObserver and language restore
- `src/components/nav/LanguageSwitcher.astro` - FR disabled state, click guard, CSS
- `src/components/nav/HamburgerOverlay.astro` - FR disabled state, click guard, CSS
- `src/pages/index.astro` - sectionNameDe prop passthrough
- `src/pages/onsite/index.astro` - sectionNameDe props and data-i18n on link labels
- `src/pages/onsite/kerry-james-marshall.astro` - data-i18n on intro, tickets, events, shop, headings
- `src/components/sections/SectionWrapper.astro` - Optional sectionNameDe prop, data-i18n on h2
- `src/components/sections/CinematicReveal.astro` - data-i18n on tagline, title, description, CTA
- `src/components/sections/ExhibitionList.astro` - data-i18n on group titles, exhibition titles, dates
- `src/components/sections/PinnedNarrative.astro` - data-i18n on card titles and descriptions
- `src/components/sections/EssentialsCard.astro` - data-i18n on title and description
- `src/components/sections/OnsiteExhibitionGrid.astro` - data-i18n on heading and exhibition titles
- `src/components/sections/HorizontalSlider.astro` - data-i18n on heading
- `src/components/sections/ArtistQuote.astro` - data-i18n on blockquote
- `src/components/ui/FAQAccordion.astro` - data-i18n on questions and answers (with data-i18n-html)
- `src/components/hero/KjmHero.astro` - data-i18n on title, date label, back link
- `src/components/hero/HeroSlide.astro` - data-i18n on CTA label

## Decisions Made
- Used data-i18n attribute pattern over page re-render for zero-JS-overhead client-side switching
- MutationObserver on html[lang] decouples the swap trigger from specific UI components
- Added data-i18n-html marker attribute for elements that use set:html (innerHTML swap vs textContent)
- Text node replacement logic preserves child elements (icons, arrows) during swap

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Extended i18n to shared components beyond page templates**
- **Found during:** Task 1
- **Issue:** Plan only mentioned adding data-i18n to 3 page files, but most text is rendered by shared components (ExhibitionList, PinnedNarrative, CinematicReveal, etc.)
- **Fix:** Added data-i18n attributes to 12 component files that render i18n text with [lang] accessor
- **Files modified:** All component files listed above
- **Verification:** npm run build passes, data-i18n-de count across components totals 29+ elements
- **Committed in:** 1b54df5 (Task 1 commit)

**2. [Rule 2 - Missing Critical] Added data-i18n-html for HTML content elements**
- **Found during:** Task 1
- **Issue:** CinematicReveal tagline/description and FAQ answers use set:html with embedded HTML tags (br, links). Using textContent would strip HTML.
- **Fix:** Added data-i18n-html marker attribute; global swap script uses innerHTML for these elements
- **Files modified:** CinematicReveal.astro, FAQAccordion.astro, BaseLayout.astro
- **Committed in:** 1b54df5 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 missing critical)
**Impact on plan:** Both auto-fixes necessary for comprehensive language coverage. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Language switching wired and functional across all pages
- Ready for deployment and presentation demo

---
*Phase: 04-deploy-present*
*Completed: 2026-04-17*
