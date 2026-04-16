---
phase: 03-dual-mode-routing
plan: 04
subsystem: ui
tags: [gsap, audio, overlay, login-sim, paywall, profile, qr]

# Dependency graph
requires:
  - phase: 03-dual-mode-routing/03-03
    provides: KJM detail page with ArtworkSlider headphones stub buttons
provides:
  - PaywallOverlay with simulateLogin() flow
  - AudioGuideOverlay with Playlist + DetailPlayer bottom-sheet views
  - NavProfileButton conditional profile icon in navbar
  - ProfileOverlay with QR ticket, 6 nav items, log out
  - Login-aware HamburgerOverlay (Log in becomes My Account)
  - Headphones button wiring (logged-out -> paywall, logged-in -> audio guide)
affects: [phase-04-deploy]

# Tech tracking
tech-stack:
  added: []
  patterns: [simulateLogin via localStorage + CustomEvent, window.__demoUser sync]

key-files:
  created:
    - src/components/nav/PaywallOverlay.astro
    - src/components/nav/AudioGuideOverlay.astro
    - src/components/nav/NavProfileButton.astro
    - src/components/nav/ProfileOverlay.astro
  modified:
    - src/components/nav/NavBar.astro
    - src/components/nav/HamburgerOverlay.astro
    - src/layouts/BaseLayout.astro
    - src/components/sections/ArtworkSlider.astro
    - src/pages/onsite/kerry-james-marshall.astro
    - src/content/shared/ui-strings.json

key-decisions:
  - "Audio element persists across track changes via single new Audio() in overlay closure"
  - "DetailPlayer bottom-sheet uses GSAP translateY animation with reduce-motion snap"
  - "Login state propagated via CustomEvent kunsthaus:login/logout across all components"
  - "Artworks data exposed on window.__kjmArtworks via define:vars for AudioGuideOverlay playlist"

patterns-established:
  - "Login sim: localStorage kunsthaus-demo-user + window.__demoUser + CustomEvent dispatch"
  - "Bottom-sheet pattern: translateY(100%) hidden, translateY(0) visible, GSAP animated"

requirements-completed: [NAV-02, NAV-03]

# Metrics
duration: 6min
completed: 2026-04-16
---

# Phase 03 Plan 04: Audio Guide + Login System Summary

**Audio guide with playlist/detail-player bottom-sheet, paywall with login simulation, profile overlay with QR ticket, and headphones-to-paywall-to-audio-guide flow wired into ArtworkSlider**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-16T09:26:42Z
- **Completed:** 2026-04-16T09:32:44Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- PaywallOverlay gates audio guide for logged-out users with Buy Tickets + Become a Member CTAs that trigger simulateLogin()
- AudioGuideOverlay with Playlist view listing all 10 KJM tracks and a DetailPlayer bottom-sheet with transport controls, progress bar, and persistent Audio element
- NavProfileButton conditionally appears in navbar on login with GSAP back-out animation, disappears on logout
- ProfileOverlay with QR ticket hero card, 6 secondary nav items, and log out that dispatches kunsthaus:logout
- HamburgerOverlay "Log in" dynamically becomes "My Account" linking to ProfileOverlay when logged in
- ArtworkSlider headphones buttons wired: logged-out opens paywall, logged-in opens audio guide directly, and after paywall login the audio guide auto-opens to the pending track

## Task Commits

Each task was committed atomically:

1. **Task 1: PaywallOverlay + AudioGuideOverlay + simulateLogin core** - `5c9074d` (feat)
2. **Task 2: NavProfileButton + ProfileOverlay + login-aware HamburgerOverlay** - `cc4a236` (feat)
3. **Task 3: Wire overlays into BaseLayout + ArtworkSlider headphones + build verification** - `23dc1dc` (feat)

## Files Created/Modified
- `src/components/nav/PaywallOverlay.astro` - Dismissible paywall modal with simulateLogin()
- `src/components/nav/AudioGuideOverlay.astro` - Fullscreen overlay with Playlist + DetailPlayer bottom-sheet
- `src/components/nav/NavProfileButton.astro` - Conditional profile icon, reactive to login/logout events
- `src/components/nav/ProfileOverlay.astro` - QR ticket hero, 6 nav items, log out
- `src/components/nav/NavBar.astro` - Added NavProfileButton import and render in navbar__right
- `src/components/nav/HamburgerOverlay.astro` - Login-state awareness on Log in item
- `src/layouts/BaseLayout.astro` - Import/render 3 new overlays + __demoUser is:inline init script
- `src/components/sections/ArtworkSlider.astro` - Headphones click handler + data-track-id + login listener
- `src/pages/onsite/kerry-james-marshall.astro` - Expose artworks data on window.__kjmArtworks
- `src/content/shared/ui-strings.json` - Added 4 new ui-string entries for paywall/audio guide

## Decisions Made
- Audio element persists across track changes via single `new Audio()` in overlay closure -- avoids re-creation overhead and enables seamless playback
- Login state propagated via CustomEvent (`kunsthaus:login`/`kunsthaus:logout`) so all components react independently without tight coupling
- Artworks data exposed on `window.__kjmArtworks` via Astro `define:vars` to feed the AudioGuideOverlay playlist without requiring prop drilling

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 03 is now structurally complete (all 4 plans shipped)
- All Phase 03 Success Criteria (SC1-SC8) are structurally addressed
- Ready for Phase 04 (deploy + present) or human smoke-testing

## Self-Check: PASSED

All 4 created files verified on disk. All 3 task commits verified in git log.

---
*Phase: 03-dual-mode-routing*
*Completed: 2026-04-16*
