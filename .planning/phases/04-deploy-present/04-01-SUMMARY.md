---
phase: 04-deploy-present
plan: 01
subsystem: ui
tags: [svg-icons, audio-player, css-polish, gsap]

requires:
  - phase: 03-dual-mode-routing
    provides: "Profile overlay, audio guide overlay, KJM page with artworks data"
provides:
  - "Polished NavProfileButton with inline SVG icon matching nav icon system"
  - "ProfileOverlay close-X aligned to navbar position with SVG icon"
  - "AudioGuideOverlay with exhibition title, circular play buttons, working audio playback"
affects: [04-deploy-present]

tech-stack:
  added: []
  patterns:
    - "Inline SVG icons for nav consistency (18x18 viewBox 0 0 24 24 stroke-based)"
    - "Exhibition data exposed on window globals for overlay consumption"

key-files:
  created: []
  modified:
    - src/components/nav/NavProfileButton.astro
    - src/components/nav/ProfileOverlay.astro
    - src/components/nav/AudioGuideOverlay.astro
    - src/pages/onsite/kerry-james-marshall.astro

key-decisions:
  - "Profile icon uses inline SVG (circle+path) instead of Material Symbol for visual consistency with other nav icons"
  - "Exhibition title passed via window.__kjmExhibitionData global to avoid prop drilling through overlay"

patterns-established:
  - "Nav icon pattern: 18x18 SVG with viewBox 0 0 24 24, stroke-based, currentColor"
  - "Overlay open/close hides/restores trigger button for visual replacement effect"

requirements-completed: [TECH-05]

duration: 3min
completed: 2026-04-17
---

# Phase 04 Plan 01: Visual Polish Summary

**Profile icon replaced with stroke SVG, audio playlist styled with exhibition title and circular play buttons, audio playback wired with correct base path**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-17T08:07:02Z
- **Completed:** 2026-04-17T08:09:49Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- NavProfileButton now uses an 18x18 inline SVG matching the search/clock/hamburger icon style
- ProfileOverlay header restructured with left/right layout; close-X uses inline SVG and hides the profile button when overlay opens
- AudioGuideOverlay shows exhibition title header, has increased track spacing, circular play buttons, and correctly plays audio via base-prefixed paths
- Detail player constrained to 100dvh with description line-clamp for mobile viewport fit

## Task Commits

Each task was committed atomically:

1. **Task 1: Profile icon SVG and profile overlay close-X alignment** - `2a58750` (feat)
2. **Task 2: Audio playlist styling and audio playback wiring** - `cb4efbc` (feat)

## Files Created/Modified
- `src/components/nav/NavProfileButton.astro` - Replaced Material Symbol with inline SVG profile icon
- `src/components/nav/ProfileOverlay.astro` - Restructured header, SVG close-X, hide/restore profile button on open/close
- `src/components/nav/AudioGuideOverlay.astro` - Exhibition title, circular play buttons, base-prefixed audio.src, 100dvh detail player
- `src/pages/onsite/kerry-james-marshall.astro` - Exposed exhibition title data via window.__kjmExhibitionData

## Decisions Made
- Profile icon uses inline SVG (circle + path) for visual consistency with other nav icons
- Exhibition title passed via window global to avoid complex prop drilling

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added exhibition title data exposure from KJM page**
- **Found during:** Task 2 (Audio playlist styling)
- **Issue:** AudioGuideOverlay needed exhibition title but `window.__kjmExhibitionData` was not set by the KJM page
- **Fix:** Added `exhibitionTitleJson` to define:vars and set `window.__kjmExhibitionData` in kerry-james-marshall.astro
- **Files modified:** src/pages/onsite/kerry-james-marshall.astro
- **Verification:** Build passes, exhibition title available at runtime
- **Committed in:** cb4efbc (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix necessary for exhibition title display. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Profile and audio guide components are presentation-ready for screenshots
- Build passes cleanly with all changes

---
*Phase: 04-deploy-present*
*Completed: 2026-04-17*
