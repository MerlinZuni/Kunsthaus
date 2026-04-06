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
- [ ] 01-01-PLAN.md -- Astro 6 scaffold, CSS token architecture, Lenis smooth scroll, accessibility foundations
- [ ] 01-02-PLAN.md -- 48-track proportional grid system with responsive breakpoints and Leva dev overlay
- [ ] 01-03-PLAN.md -- JSON content collections with Zod schemas, Planning and On-site mock data

### Phase 2: Static Homepage
**Goal**: A complete homepage with hero, exhibitions, visit info, and footer -- all sections rendering real mock content in both mode layouts
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, NAV-01
**Success Criteria** (what must be TRUE):
  1. Hero section displays a featured exhibition with image, title, and description
  2. Current exhibitions are listed below the hero with images and metadata
  3. Visit information section shows hours, location, and ticket info
  4. Footer displays contact details, social links, and museum information
  5. Responsive navigation with mobile hamburger menu works across all breakpoints
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Dual-Mode + Animation
**Goal**: The competition differentiator -- mode switching transforms the page between Planning and On-site experiences, layered with scroll-driven animations, text motion, hover effects, and stacking/layering scroll effects
**Depends on**: Phase 2
**Requirements**: NAV-02, NAV-03, NAV-04, NAV-05, ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05, ANIM-06
**Success Criteria** (what must be TRUE):
  1. A visible toggle in the navigation switches between Planning and On-site modes, and the page content/layout transforms smoothly in response
  2. Appending a QR code URL parameter (e.g., `?mode=onsite&exhibit=xyz`) opens the page directly in On-site mode for that exhibit
  3. Scroll-driven animations (parallax, reveals, stacking/layering pin effect) play as the user scrolls down the page
  4. Text animations with line splitting and staggered blur reveals appear on key headings
  5. Hover interactions (image tracking, underline effects) and at least one hidden discovery micro-interaction reward exploration
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD
- [ ] 03-03: TBD

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
| 1. Foundation | 0/3 | Not started | - |
| 2. Static Homepage | 0/2 | Not started | - |
| 3. Dual-Mode + Animation | 0/3 | Not started | - |
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
