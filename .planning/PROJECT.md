# Kunsthaus Zürich — Website Redesign Concept

## What This Is

A competition prototype for the Kunsthaus Zürich museum website redesign. A responsive, animated, interactive homepage that demonstrates a new dual-mode concept: **Planning mode** (remote visitors exploring what's on offer) and **On-site mode** (visitors physically at the museum diving deeper into exhibits). Built as a headless frontend with content separated from presentation, ready for future CMS integration.

## Core Value

The dual-mode experience — a single website that transforms based on whether you're planning your visit or standing in front of the art — is the concept that must land in the competition presentation.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Responsive homepage pulling design elements from three Figma concepts
- [ ] Dual-mode navigation: Planning mode and On-site mode with distinct UI states
- [ ] Mode switching via manual toggle in the navigation
- [ ] Mode switching via opt-in geolocation prompt (detect proximity, present choice)
- [ ] Mode switching via QR codes (URL parameter triggers On-site mode for specific exhibit)
- [ ] Scroll-driven animations (parallax, reveals, scaling)
- [ ] Hover and cursor interaction effects
- [ ] Section/page transitions between modes
- [ ] Text animations (modern, clean typographic motion)
- [ ] Content layer using JSON data files (CMS-ready architecture)
- [ ] CSS structured for headless frontend (theming via custom properties, decoupled from CMS)
- [ ] Presentation-ready screenshots of key design highlights
- [ ] Playful discovery feel — curiosity-driven navigation, unexpected interactions

### Out of Scope

- CMS integration — prototype uses JSON data files, CMS comes later
- Backend/server logic — static site, no server
- Full multi-page build — homepage + mode switch only (additional pages later)
- User accounts or authentication
- Real exhibit data pipeline — mock content for prototype
- E-commerce / ticketing integration

## Context

- **Competition:** Pitch to Kunsthaus Zürich for their website redesign
- **Timeline:** Must be complete within days (before end of week, April 2026)
- **Design source:** Three Figma designs from the design team — cherry-picking the strongest elements from each into one unified concept
- **Figma MCP available:** Dev Mode MCP server connected for extracting design context, screenshots, and variables directly from Figma
- **Existing site:** kunsthaus.ch — real content can be scraped/referenced for mock data
- **Presentation flow:** Screenshots of design highlights first, then live prototype demo
- **Dual-mode concept:**
  - Planning mode: Explore exhibitions, plan visits, browse what's on offer
  - On-site mode: Deeper exhibit content, contextual to physical location
  - Triggers: Manual toggle, geolocation prompt (opt-in, not forced), QR codes at exhibits
- **Animation reference sites:** User has examples from other websites to reference

## Constraints

- **Timeline**: ~3-4 days — must prioritize ruthlessly, ship a polished homepage
- **Tech stack**: Astro + GSAP — fast build, lightweight output, CMS-ready architecture
- **Content**: JSON data files for all text/images — no hardcoded content in templates
- **Design source**: Three Figma files — need to extract and unify elements via Figma MCP
- **Output**: Must run as a live working prototype in a browser
- **CSS architecture**: Headless-ready — custom properties for theming, no CMS coupling

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro + GSAP stack | Fastest to build, ships vanilla HTML, great animation support, CMS-ready | — Pending |
| JSON content layer | Simple, no API complexity, maps directly to future CMS data model | — Pending |
| Cherry-pick from 3 Figma designs | Strongest elements from each into unified concept | — Pending |
| Dual-mode (Planning/On-site) as core concept | Key differentiator for competition — transforms the museum website paradigm | — Pending |
| Geolocation as opt-in prompt | Respects user choice, not forced into mode switch | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-06 after initialization*
