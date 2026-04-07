# Requirements: Kunsthaus Zurich Website Redesign

**Defined:** 2026-04-06
**Core Value:** The dual-mode experience -- a single website that transforms based on whether you're planning your visit or standing in front of the art

## v1 Requirements

### Navigation & Mode System

- [ ] **NAV-01**: Responsive main navigation with mobile hamburger menu
- [ ] **NAV-02**: Dual-mode toggle (Planning / On-site) visible in navigation
- [ ] **NAV-03**: Mode-aware navigation that changes content/links based on active mode
- [ ] **NAV-04**: QR code URL parameters trigger On-site mode for specific exhibits
- [ ] **NAV-05**: Opt-in geolocation prompt suggests On-site mode when near museum

### Homepage Content

- [ ] **HOME-01**: Hero section with featured exhibition (both mode variants)
- [ ] **HOME-02**: Current exhibitions listing with mode-dependent detail level
- [ ] **HOME-03**: Visit information section (hours, location, tickets)
- [ ] **HOME-04**: Footer with contact, social links, and museum info

### Animation & Interaction

- [ ] **ANIM-01**: Scroll-driven reveal animations (fade-in, scale, parallax)
- [ ] **ANIM-02**: Typographic text animations -- line splitting, staggered reveals with blur (GSAP SplitText)
- [ ] **ANIM-03**: Hover and cursor interaction effects (image tracking, underline animations)
- [ ] **ANIM-04**: Smooth transitions when switching between Planning/On-site modes
- [ ] **ANIM-05**: Playful discovery micro-interactions and hidden moments
- [ ] **ANIM-06**: Stacking/layering scroll effect -- sections pin, scale down with 3D perspective, and fade behind focused content (SIRNIK-inspired)

### Layout & Grid

- [x] **GRID-01**: Principled grid system based on classical proportional design (Obys/Van de Graaf inspired)
- [x] **GRID-02**: Responsive breakpoint adaptations (desktop, tablet, mobile)
- [x] **GRID-03**: Modular composition supporting flexible content arrangement
- [x] **GRID-04**: Dev-mode grid overlay (columns + rows) with toggle visibility and GUI controls (Leva/Tweakpane) for adjusting spacing, sizing, and rhythm settings

### Technical Foundation

- [x] **TECH-01**: Astro 6 project with GSAP 3.14 and Lenis smooth scroll
- [ ] **TECH-02**: JSON content layer for all page text and data (CMS-ready)
- [x] **TECH-03**: CSS custom properties architecture with mode-based theming (`[data-mode]` attribute)
- [x] **TECH-04**: Accessible -- reduced-motion support, semantic HTML, content visible without JS
- [ ] **TECH-05**: Deployed to Cloudflare Pages as live prototype

### Presentation

- [ ] **PRES-01**: Screenshots of key design highlights for presentation deck

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Multi-Page

- **PAGE-01**: About page with museum history and mission
- **PAGE-02**: Exhibitions detail pages with On-site deep-dive content
- **PAGE-03**: Visit page with interactive map and directions

### Advanced Features

- **ADV-01**: Exhibition-specific color palette system (shifts theme per exhibit)
- **ADV-02**: Full CMS integration (Sanity, Contentful, or similar)
- **ADV-03**: Collection search and filtering
- **ADV-04**: Audio guide integration for On-site mode
- **ADV-05**: Astro View Transitions for multi-page navigation

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend / server logic | Static prototype -- no server needed |
| User accounts / authentication | Not relevant for museum browsing experience |
| E-commerce / ticketing | Complex integration, out of scope for concept |
| Virtual tours / 3D galleries | High complexity, not aligned with core dual-mode concept |
| Chatbot / AI assistant | Adds complexity without advancing the pitch |
| Real exhibit data pipeline | Mock content sufficient for prototype |
| CMS admin interface | Future concern -- JSON files for now |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 3 | Pending |
| NAV-03 | Phase 3 | Pending |
| NAV-04 | Phase 3 | Pending |
| NAV-05 | Phase 3 | Pending |
| HOME-01 | Phase 2 | Pending |
| HOME-02 | Phase 2 | Pending |
| HOME-03 | Phase 2 | Pending |
| HOME-04 | Phase 2 | Pending |
| ANIM-01 | Phase 3 | Pending |
| ANIM-02 | Phase 3 | Pending |
| ANIM-03 | Phase 3 | Pending |
| ANIM-04 | Phase 3 | Pending |
| ANIM-05 | Phase 3 | Pending |
| ANIM-06 | Phase 3 | Pending |
| GRID-01 | Phase 1 | Complete |
| GRID-02 | Phase 1 | Complete |
| GRID-03 | Phase 1 | Complete |
| GRID-04 | Phase 1 | Complete |
| TECH-01 | Phase 1 | Complete |
| TECH-02 | Phase 1 | Pending |
| TECH-03 | Phase 1 | Complete |
| TECH-04 | Phase 1 | Complete |
| TECH-05 | Phase 4 | Pending |
| PRES-01 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0

---
*Requirements defined: 2026-04-06*
*Last updated: 2026-04-06 after roadmap creation*
