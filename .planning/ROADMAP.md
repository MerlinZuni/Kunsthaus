# Roadmap: Kunsthaus Zurich Website Redesign

## Overview

Transform three Figma concepts into a single animated, dual-mode homepage prototype that wins the Kunsthaus Zurich website redesign competition. Four phases take us from project scaffold through static content, then layer on the dual-mode switching and animation that differentiates this pitch, and finally deploy a live prototype with presentation-ready screenshots. The dual-mode concept -- Planning vs On-site -- is the competition winner and gets the largest phase.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation** - Astro project, grid system, content layer, CSS architecture with mode theming
- [ ] **Phase 2: Static Homepage** - Full page structure with all sections rendering from JSON content
- [ ] **Phase 3: Dual-Mode + Animation** - Mode switching system and all scroll/hover/text animations
- [ ] **Phase 4: Deploy + Present** - Live on Cloudflare Pages with presentation screenshots

## Phase Details

### Phase 1: Foundation
**Goal**: A working Astro project with principled grid, JSON content layer, and CSS custom property architecture ready for mode-based theming
**Depends on**: Nothing (first phase)
**Requirements**: TECH-01, TECH-02, TECH-03, TECH-04, GRID-01, GRID-02, GRID-03, GRID-04
**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` serves a page in the browser with Lenis smooth scroll active
  2. A proportional grid system (columns + rows) is visible with responsive breakpoints (desktop, tablet, mobile)
  3. Page content (text, image paths) is pulled from JSON data files, not hardcoded in templates
  4. CSS custom properties exist for colors/spacing with a `[data-mode]` attribute switching between Planning and On-site themes
  5. Content is visible and page is usable with JavaScript disabled (semantic HTML, no-JS fallback)
  6. A dev-mode grid overlay with GUI controls (Leva/Tweakpane) allows toggling grid visibility and adjusting column/row spacing and sizing
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md -- Astro 6 scaffold, CSS token architecture, Lenis smooth scroll, accessibility foundations
- [x] 01-02-PLAN.md -- 48-track proportional grid system with responsive breakpoints and Leva dev overlay
- [x] 01-03-PLAN.md -- JSON content collections with Zod schemas, Planning and On-site mock data

### Phase 2: Static Homepage
**Goal**: A complete homepage with hero carousel, exhibitions, visit info, and footer -- all sections rendering real mock content with immersive storytelling components, responsive navigation, and section stacking scroll effect
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, NAV-01
**Success Criteria** (what must be TRUE):
  1. Hero section displays a featured exhibition with image, title, and description
  2. Current exhibitions are listed below the hero with images and metadata
  3. Visit information section shows hours, location, and ticket info
  4. Footer displays contact details, social links, and museum information
  5. Responsive navigation with mobile hamburger menu works across all breakpoints
**Plans**: 4 plans

Plans:
- [x] 02-01-PLAN.md -- Content layer expansion (JSON data, schemas, textures) and CSS infrastructure (interactions, sections)
- [x] 02-02-PLAN.md -- Navigation bar with scroll behavior, overlays, language switcher, and hero carousel with monumental typography
- [x] 02-03-PLAN.md -- Immersive storytelling sections (Cinematic Reveal, Pinned Narrative), sticky CTA, mode toggle, section progress
- [x] 02-04-PLAN.md -- Footer with marquee and columns, final homepage composition wiring all components into index.astro

### Phase 3: Dual-Mode Routing
**Goal**: Transform the dual-mode concept from a CSS palette flip into genuine routing. The mode toggle navigates between `/` (Planning) and `/onsite` (On-site) via Astro View Transitions. From the on-site landing, the user can drill into a single exhibition detail page (`/onsite/kerry-james-marshall`) with an audio guide, a paywall, and a simulated logged-in state.
**Depends on**: Phase 2
**Requirements**: NAV-02, NAV-03, ANIM-04 (as View Transitions), ANIM-06 (as SectionWrapper stacking — already shipped)
**Deferred requirements**: NAV-04 (QR deep-link → URL itself replaces this), NAV-05 (geolocation), ANIM-01/02/03/05 (scroll/text/hover/easter-egg animations — not essential for pitch)
**Success Criteria** (what must be TRUE):
  1. Clicking the mode toggle on `/` navigates to `/onsite` with an animated View Transitions palette flip (not a hard reload)
  2. URL is the single source of truth for mode — `localStorage` mode persistence is removed
  3. `/onsite` produces a full on-site landing with hero, cinematic reveal, building-grouped exhibition thumbnails, museum navigator, info box with live today's events, and FAQ
  4. `/onsite/kerry-james-marshall` produces an exhibition detail page with hero video, cinematic reveal, artwork slider, artist quote, video testimonials, and shop
  5. Tapping an artwork's headphones button triggers a paywall (if logged out) with Buy Tickets + Become a Member CTAs
  6. Clicking Buy Tickets (or Log in via hamburger) simulates login: profile icon fades into the navbar, hamburger "Log in" becomes "My Account"
  7. Audio guide overlay opens with a Playlist view; tapping a track slides up a Detail Player bottom-sheet with full transport controls
  8. Profile overlay shows a QR ticket, secondary nav items, and log out
**Plans**: 4 sub-plans

Plans:
- [x] 03-01-PLAN.md -- Routing Foundation: Astro View Transitions, URL-as-state mode toggle refactor across 4 writers, /onsite stub route
- [x] 03-02-PLAN.md -- On-site Landing Page: OnsiteHero, cinematic reveal, OnsiteExhibitionGrid, MuseumNavigatorTeaser, InfoBox with TodaysEventsAccordion, FAQAccordion
- [x] 03-03-PLAN.md -- KJM Exhibition Detail Page: /onsite/kerry-james-marshall, hero video, cinematic reveal, ArtworkSlider, ArtistQuote, HorizontalSlider (videos + shop)
- [x] 03-04-PLAN.md -- Audio Guide + Login System: AudioGuideOverlay (Playlist + DetailPlayer bottom-sheet), PaywallOverlay, simulateLogin, NavProfileButton, ProfileOverlay

### Phase 4: Deploy + Present
**Goal**: A live prototype accessible via URL and high-quality screenshots capturing the design highlights for the competition presentation deck
**Depends on**: Phase 3
**Requirements**: TECH-05, PRES-01
**Success Criteria** (what must be TRUE):
  1. The prototype is live on a Cloudflare Pages URL accessible from any browser
  2. Screenshots of key design moments (hero, mode switch, scroll animations, mobile view) are exported and ready for the presentation deck
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete (human_needed) | 2026-04-06 |
| 2. Static Homepage | 4/4 | Verified (human_needed) | 2026-04-13 |
| 3. Dual-Mode Routing | 0/4 | Planned (03-01 plan written) | - |
| 4. Deploy + Present | 0/1 | Not started | - |

## Backlog

Parking lot for unsequenced ideas (999.x) — not in the active milestone sequence until promoted.

### Phase 999.1: A site search in the main navigation (BACKLOG)

**Goal:** Let visitors discover exhibitions, people, and visit-related content via a **search entry in the main nav** (desktop + mobile), aligned with the dual-mode shell.

**Description:** Add a clear search affordance in the primary navigation so users are not limited to browsing and footer links. When this phase is scheduled, decide interaction pattern (modal, drawer, or route), what JSON/content is indexed, and how **Planning vs On-site** might bias or label results. For the static prototype, expect **client-side search over mock JSON** or a **UI shell with placeholder results** unless scope adds a backend.

Industry research on **museum-site search** (common intents: visit planning, collection exploration, specialized research; typical query types; pre/post-visit behavior; heavy use of external search for collection discovery) is captured in context to inform prioritization—**Kunsthaus Zürich–specific validation** (content audit, goals of this pitch, optional interviews) is still required before locking scope.

**Context:** See [.planning/phases/999.1-a-site-search-in-the-main-navigation/999.1-CONTEXT.md](phases/999.1-a-site-search-in-the-main-navigation/999.1-CONTEXT.md) for intent, **museum-sector research (generic)**, scope candidates, dual-mode notes, constraints, and open questions.

**Requirements:** TBD
**Plans:** 0 plans

Plans:
- [ ] TBD (promote with /gsd-review-backlog when ready)

### Phase 999.2: Source real KJM painting images for artworks 5–10 (BACKLOG)

**Goal:** Replace prototype image placeholders for ArtworkSlider slides 5–10 on the KJM detail page with real Kerry James Marshall painting images so every artwork card has its own correct visual.

**Description:** Slides 5–10 (school-of-beauty, 7am-sunday-morning, souvenir-i, slow-dance, vignette, garden-party) currently all reuse the 4 real JPGs that exist for slides 1–4 (de-style, better-homes, past-times, untitled-studio) — documented in 03-VERIFICATION.md as "prototype fidelity". Titles, years, collections, credits, and descriptions in `src/content/onsite/kerry-james-marshall.json` are already correct for all 10 works; only the `image` paths need to point to new files. Once the 6 JPGs are placed at `public/images/artworks/{slide-id}.jpg`, the fix is a ~6-line JSON edit and the slider, counter, and expand-modal all pick up the new assets automatically. Worth doing before the competition pitch if time allows.

**Requirements:** TBD
**Plans:** 0 plans

Plans:
- [ ] TBD (promote with /gsd-review-backlog when ready)
