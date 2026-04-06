# Phase 1: Foundation - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Astro 6 project scaffold with a 48-track proportional grid system (12 layout columns), JSON content layer for dual-mode content (Planning and On-site as separate content sets), and CSS custom property architecture with semantic token layers for mode-based theming via `[data-mode]` attribute. Includes dev-mode grid overlay with Leva GUI controls, WCAG AA accessibility, and i18n-ready content structure (DE+EN active, FR placeholder).

</domain>

<decisions>
## Implementation Decisions

### Mode Theming
- **D-01:** Theme depth is colors + mood only — typography and spacing stay consistent across modes. Only color palette and background treatments change per mode.
- **D-02:** Mode switching via `[data-mode]` attribute on HTML element (`html[data-mode='planning']` / `html[data-mode='onsite']`).
- **D-03:** Token architecture uses semantic aliases: Primitives (e.g., `--color-offwhite`) → Semantic (e.g., `--color-surface`, `--color-accent`) → Component (e.g., `--hero-bg`). Mode switches at the semantic layer.
- **D-04:** Planning mode palette — Background: #fbf8f7 (warm off-white), Text: #272523 (soft black). Concrete tones: #EBEBEB (light), #C1BFB2 (warm), #A4A197 (shadow). CSS noise/grain texture on concrete-colored elements to evoke physical concrete.
- **D-05:** On-site mode palette — Warm dark inverse: #272523 background, #fbf8f7 text. Keep warm tones throughout, not cold/clinical. Inspired by Cursor's warm dark palette feel.
- **D-06:** Concrete mid-tones (#C1BFB2, #A4A197) only for decorative elements, not text — they won't meet AA contrast ratios against either background.

### Typography
- **D-07:** Single typeface system: DINNextW1G. Weights: Light (300), Regular (400), Medium (500), Bold (700).
- **D-08:** Type scale: Perfect Fourth ratio (1.333) modular scale.

### Spacing
- **D-09:** 4px base unit spacing system — tokens at 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.

### Accessibility
- **D-10:** WCAG AA compliance — 4.5:1 contrast ratio for normal text, 3:1 for large text, visible focus indicators, ARIA landmarks, skip-nav link, `prefers-reduced-motion` support, semantic HTML, content visible and usable with JavaScript disabled.

### Content Structure
- **D-11:** Three separate Astro content collections: `src/content/planning/`, `src/content/onsite/`, `src/content/shared/`. Planning and On-site are completely different content — not the same data with different presentation.
- **D-12:** i18n-ready JSON structure: German (DE) and English (EN) active with full content. French (FR) as a placeholder slot in the schema for future.
- **D-13:** Planning mode content follows the brief's priority hierarchy: Inspiration → Key Info (hours, tickets) → Current Exhibitions (teasing) → Museum Offerings (shop, membership) → Events & Programs → Planning Details → Educational Deep Dives.
- **D-14:** Pull full homepage content from kunsthaus.ch for Planning mode mock data. Structure and label by content type (main title, lead text, paragraph) and section location (hero, teaser, etc.). Reorganize to match content priority hierarchy.
- **D-15:** On-site mode features Kerry James Marshall temporary exhibition as featured content. Deep-dive information for in-gallery visitors. Content modeled after Dreipol visitor guide structure.
- **D-16:** On-site sections: Artwork highlights (scrollable list in exhibition order), Audio guide teasers (with members-only paywall message on play buttons), Practical on-site info (room map, facilities).
- **D-17:** On-site entry via QR code per room/exhibition — URL parameter triggers On-site mode for that exhibition.
- **D-18:** Membership paywall is visual mockup only — no real auth. Non-members see artwork visuals and text freely; audio play buttons show "members only" message when tapped.
- **D-19:** One JSON file per exhibition containing all artworks (maps to QR-per-room model).

### Grid System
- **D-20:** 48-track fine grid as the underlying blueprint. 12 layout columns = every 4th track. 24 half-columns = every 2nd track. Full-bleed, extending to viewport edges.
- **D-21:** 8 horizontal rows, sparse, tied to type-scale rhythm. Visually distinct from vertical lines.
- **D-22:** Grid cells are tall narrow rectangles (height ≈ 6× width). Overall grid area is square (1:1) when cell proportions are maintained.
- **D-23:** Content placement is fully flexible — any element can start at any column and span to any column. No rigid rules about which elements go where. The grid provides alignment points, not constraints.
- **D-24:** Responsive breakpoints: Desktop 12 columns → Tablet 8 columns → Mobile 4 columns (underlying track count scales proportionally).
- **D-25:** Grid overlay visible only on the base page layer. Elevated content (cards, modals, stacked layers) does not show the grid, but elements still align to grid coordinates underneath.

### Dev Grid Overlay
- **D-26:** Leva (React island in Astro) for GUI controls. Panel is the sole activation method — no keyboard shortcuts.
- **D-27:** Leva controls: toggle grid visibility, vertical line density (12 / 24 / 48), toggle full-viewport extension vs content-area only, horizontal row visibility, grid line color + opacity.
- **D-28:** Vertical lines at left edge of each column (start lines only, not filled bands). Horizontal lines visually distinct from vertical.

### Claude's Discretion
- Exact Leva panel layout and positioning
- Grid line styling details (color defaults, dash patterns)
- Astro Content Collections schema field naming
- Zod validation specifics
- CSS `@layer` organization details
- Lenis smooth scroll configuration
- How to implement CSS noise/grain texture on concrete elements

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Creative Brief & Design Direction
- `docs/creative-briefing.md` — Full competition briefing: strategy, content hierarchy, design principles, audience, success criteria, benchmark sites
- `.planning/GRID.md` — Grid specification derived from reference blueprint image
- `.planning/assets/grid-reference.png` — Visual grid reference (48×8 track blueprint)

### Design Resources (external)
- Kunsthaus image database: https://www.kunsthaus.ch/en/medien-bereich/image-database/
- David Chipperfield architect case: https://davidchipperfield.com/projects/kunsthaus-zurich
- Dreipol visitor guide: https://visitorguide.kunsthaus.ch/
- Kerry James Marshall exhibition: https://www.kunsthaus.ch/en/besuch-planen/ausstellungen/kerry-james-marshall/

### Benchmark References (from creative brief)
- https://www.moma.org/ — Best UX/UI reference
- https://louisiana.dk/en/ — Solid UX/UI reference
- https://lowenbraukunst.ch/en — Cool visual design reference
- https://www.royalacademy.org.uk — Cool visual design reference

### Project Specs
- `.planning/REQUIREMENTS.md` — Phase 1 requirements: TECH-01 through TECH-04, GRID-01 through GRID-04
- `.planning/ROADMAP.md` — Phase 1 success criteria and scope boundary

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing code — greenfield project. All code created from scratch in this phase.

### Established Patterns
- No patterns yet — this phase establishes them. Key patterns to set: Astro component structure, CSS custom property naming, content collection schemas, GSAP initialization in Astro islands.

### Integration Points
- Astro Content Collections for JSON data loading
- GSAP + Lenis integration for smooth scrolling (foundation for Phase 3 animations)
- Leva React island for dev grid overlay (Astro islands architecture)
- `[data-mode]` attribute as the mode switching hook (foundation for Phase 3 mode switching)

</code_context>

<specifics>
## Specific Ideas

- Concrete colors (#EBEBEB, #C1BFB2, #A4A197) should feel like physical concrete with CSS noise/grain texture — ties the digital experience to the museum building (David Chipperfield architecture)
- On-site dark mode inspired by Cursor's warm dark palette — dark but warm, not cold/clinical
- Grid has an architectural planning / blueprint aesthetic (Swiss modernist) — structural, not decorative
- Content scraped from kunsthaus.ch should be labeled by both content type and section location for clean mapping to components
- The membership paywall in On-site mode directly addresses the brief's goal of "upselling and new revenue streams digitally"

</specifics>

<deferred>
## Deferred Ideas

- Membership authentication system — beyond visual mockup, belongs in future phase
- Exhibition-specific color palette system (ADV-01) — v2 requirement
- FT Kunst typeface — noted in briefing but not used for this prototype (DINNextW1G only)
- After-visit retention mode (extend and deepen) — mentioned in brief's experience framework but not in current phase scope

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-06*
