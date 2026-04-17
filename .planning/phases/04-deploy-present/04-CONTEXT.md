# Phase 4: Deploy + Present - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Get the prototype presentation-ready on the existing GitHub Pages deployment and capture key design moments as high-res screenshots with device-framed mockups for the competition presentation deck. Includes visual polish fixes for the profile icon, profile overlay navigation behavior, audio playlist styling, and audio player functionality.

</domain>

<decisions>
## Implementation Decisions

### Deployment
- **D-01:** No Cloudflare Pages migration — keep existing GitHub Pages deployment. The prototype is already live at the GitHub Pages URL.
- **D-02:** No changes to `astro.config.mjs` site/base configuration — current GitHub Pages setup works.

### Visual Polish — Nav Profile Button
- **D-03:** Convert the profile icon from Material Symbol (`account_circle`) to an 18x18 inline SVG to match the search, clock, and hamburger nav icons exactly.
- **D-04:** Fix profile button colors — remove any hardcoded white background. Use `var(--color-text)` and transparent background like all other `navbar__icon-btn` elements. Must work correctly in both Planning (light) and On-site (dark) modes.

### Visual Polish — Profile Overlay Navigation
- **D-05:** When the profile overlay opens, the close X icon must appear in the exact position where the profile icon was — replacing it in-place.
- **D-06:** All other nav icons (search, clock, hamburger) must remain visible and unmoved when the profile overlay is open. Same behavior pattern as the hamburger overlay — the X replaces the trigger, everything else stays.

### Visual Polish — Audio Playlist Overlay
- **D-07:** Add an exhibition title header above the track list — "Kerry James Marshall" (or the exhibition name from content data).
- **D-08:** Increase vertical spacing between tracks for proper touch targets.
- **D-09:** Add horizontal line dividers between tracks.
- **D-10:** Play buttons must be circular and right-aligned in each track row.
- **D-11:** Overall playlist styling should be closer to the Figma reference — not a plain unstyled list.

### Visual Polish — Audio Detail Player
- **D-12:** Wire up actual audio playback using the `Ballad for Classical Strings.mp3` file. Play, pause, and skip forward/backward controls must produce real audio output.
- **D-13:** Detail player view must fit within mobile viewport height (`100dvh`) — artwork, controls, and progress bar all contained in one screen, no scrolling.

### Screenshot Capture
- **D-14:** Automated capture using Playwright — scripted navigation through key pages with screenshots at set viewport sizes.
- **D-15:** Four design moments to capture:
  1. Hero + carousel (Planning mode homepage)
  2. Mode switch transition (Planning → On-site, showing URL routing and palette change)
  3. On-site KJM detail page (exhibition detail with artwork slider, audio guide)
  4. Mobile responsive views (key screens at mobile breakpoint)
- **D-16:** Two breakpoints per moment: desktop (2560×1440 @2x retina) and mobile (750×1334 @2x retina). No tablet breakpoint.
- **D-17:** Output format: PNG for sharp text and UI detail preservation.

### Presentation Deck Assets
- **D-18:** Desktop screenshots wrapped in minimal browser chrome frame showing the GitHub Pages URL in the address bar.
- **D-19:** Mobile screenshots wrapped in iPhone bezel mockup frame.

### Claude's Discretion
- Playwright script structure and navigation timing (wait for animations to settle)
- Browser chrome and iPhone frame styling/source
- Exact scroll positions for capturing scroll-driven effects
- Screenshot output directory structure
- Which specific mobile screens to capture (hamburger menu, sticky bar, stacking sections)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Nav & Profile Components
- `src/components/nav/NavBar.astro` — Navigation bar with inline SVG icons (reference for icon styling)
- `src/components/nav/NavProfileButton.astro` — Profile button component to fix (icon + colors + overlay behavior)
- `src/components/overlays/ProfileOverlay.astro` — Profile overlay to fix (close button positioning)
- `src/components/overlays/HamburgerOverlay.astro` — Reference for correct overlay-open nav behavior (X replaces trigger)

### Audio Guide Components
- `src/components/overlays/AudioGuideOverlay.astro` — Audio guide overlay with playlist and detail player views
- `src/styles/components/interactions.css` — Touch target and interaction pattern styles

### Styling & Theming
- `src/styles/typography.css` — Icon font-face and .icon utility class
- `src/styles/tokens.css` — CSS custom properties including dark mode overrides

### Project Specs
- `.planning/REQUIREMENTS.md` — TECH-05 (deployment) and PRES-01 (screenshots)
- `.planning/ROADMAP.md` — Phase 4 success criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `NavBar.astro`: Inline SVG icon pattern (18x18, stroke-based) — profile icon must match this
- `HamburgerOverlay.astro`: Close button replacing trigger icon pattern — profile overlay must replicate
- `interactions.css`: `.touch-target` (44px min), `.touch-pulse` (scale 0.96) — shared across all nav buttons
- Existing `<audio>` element in AudioGuideOverlay — needs wiring to controls, not creation from scratch

### Established Patterns
- `navbar__icon-btn` class: transparent background, `var(--color-text)` color, flex-centered
- Dark mode: `html[data-mode="onsite"]` sets CSS custom properties — all nav elements inherit automatically when using tokens
- Overlay open/close: GSAP-driven animations with `translateY` transitions

### Integration Points
- Profile button sits in NavBar's right section alongside search, clock, hamburger
- Audio guide mounted in BaseLayout, triggered via `window.__audioGuideOverlay?.open(trackId)`
- Playwright would run against the dev server (`astro dev`) or build output (`astro preview`)

</code_context>

<specifics>
## Specific Ideas

- The audio playlist should look closer to the Figma reference — structured, polished, not a raw list
- Profile overlay navigation must be 100% consistent with hamburger overlay behavior — same pattern, no exceptions
- Audio detail player must work as a real demo — hearing actual music is important for the competition pitch
- Mobile viewport constraint for audio player is critical — this is a mobile-first on-site feature

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-deploy-present*
*Context gathered: 2026-04-17*
