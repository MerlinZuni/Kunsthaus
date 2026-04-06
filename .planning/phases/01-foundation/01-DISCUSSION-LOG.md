# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-06
**Phase:** 01-foundation
**Areas discussed:** Mode theming depth, Content structure, Dev grid overlay

---

## Mode Theming Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Colors + mood only | Typography and spacing stay consistent. Fastest to build. | ✓ |
| Colors + typography | Each mode gets own color + type treatment | |
| Full differentiation | Colors, typography, AND spacing change per mode | |

**User's choice:** Colors + mood only
**Notes:** Timeline-appropriate. Modes differ through color palette and background treatments only.

### Color Palette Source

| Option | Description | Selected |
|--------|-------------|----------|
| Light/dark split | Planning=light, On-site=dark | |
| Warm/cool split | Warm vs cool tones | |
| Pull from Figma designs | Extract via MCP | ✓ |

**User's choice:** Pull from Figma — but then provided specific hex values directly:
- Planning: #fbf8f7 bg, #272523 text, concrete tones (#EBEBEB, #C1BFB2, #A4A197) with noise texture
- On-site: Warm dark inverse (#272523 bg, #fbf8f7 text), inspired by Cursor's warm dark feel

### Mode Switch Mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| data-mode attribute | html[data-mode] toggles CSS custom properties | ✓ |
| CSS class toggle | .mode-planning / .mode-onsite on body | |
| You decide | Claude picks | |

**User's choice:** data-mode attribute

### Token Layer Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Semantic aliases | Primitives → Semantic → Component, mode switches at semantic layer | ✓ |
| Flat tokens only | One layer, mode directly switches | |
| You decide | Claude picks from Figma | |

**User's choice:** Semantic aliases

### Typography

**User provided:** DINNextW1G single family, weights Light (300), Regular (400), Medium (500), Bold (700). Perfect Fourth (1.333) modular scale.

### Graphic Scale

**User's choice:** 4px base unit system — "the practice online that also has the highest flexibility"

### Accessibility

| Option | Description | Selected |
|--------|-------------|----------|
| Spec basics only | Semantic HTML, reduced-motion, no-JS | |
| WCAG AA compliance | Full contrast, focus indicators, ARIA landmarks, skip-nav | ✓ |
| Contrast check + basics | Middle ground | |

**User's choice:** WCAG AA compliance

---

## Content Structure

### Mode Content Organization

| Option | Description | Selected |
|--------|-------------|----------|
| Single file, mode fields | One JSON with mode-specific fields | |
| Shared base + mode overlays | Base + override files | |
| Separate content sets | Independent planning/onsite/shared collections | ✓ |

**User's choice:** Separate content sets — On-site is completely different content, not the same data with different presentation.

### Language Support

**User's choice:** i18n-ready with DE + EN active, FR as placeholder slot.

### Font Clarification

**User's choice:** DINNextW1G only. FT Kunst noted in briefing but not used.

### Content Priority

**User's choice:** Follow the brief's hierarchy: Inspiration → Key Info → Exhibitions → Offerings → Events → Planning → Education.

### Mock Content Source

**User's choice:** Pull full homepage content from kunsthaus.ch. Structure to match content priority. Label by content type and section location.

### Creative Briefing Reference

**User provided:** Google Doc creative briefing (https://docs.google.com/document/d/1KYvPsi6CkOQD0_uSyPuFG9_FF9L-GaoT1xsyVPRLOuA/). Saved locally to docs/creative-briefing.md as canonical reference.

### On-Site Content

**User's choice:** Based on Dreipol visitor guide structure. Featured exhibition: Kerry James Marshall (temporary). Deep-dive content for in-gallery visitors.

### On-Site Sections

**User's choice:** Artwork highlights (scrollable list), Audio guide teasers (members-only paywall), Practical on-site info.

### On-Site Entry Point

| Option | Description | Selected |
|--------|-------------|----------|
| QR per artwork | Granular deep-link per piece | |
| QR per room/exhibition | Exhibition-level QR codes | ✓ |
| Single QR + geolocation | One museum-wide entry | |
| Mix of approaches | Exhibition + featured artwork QRs | |

**User's choice:** QR per room/exhibition

### Membership Paywall

**User's clarification:** Non-members see artwork visuals and text freely. Audio play buttons visible but show "members only" message. Visual mockup only — no real auth for prototype.

### On-Site Navigation

**User's choice:** Scrollable list of artworks in exhibition order.

### On-Site JSON Structure

**User's choice:** One JSON file per exhibition containing all artworks.

---

## Dev Grid Overlay

### GUI Tool

| Option | Description | Selected |
|--------|-------------|----------|
| Tweakpane | Lightweight, minimal | |
| Leva | React-based, richer UI | ✓ |
| Custom panel | No dependencies | |
| You decide | Claude picks | |

**User's choice:** Leva

### Grid Specification

**User provided:** Detailed grid image (.planning/assets/grid-reference.png) and documentation (.planning/GRID.md).
- 48-track fine grid, grouping into 12 layout columns (every 4th track)
- Leva toggles: 12 / 24 / 48 vertical line density
- 8 sparse horizontal rows tied to type-scale rhythm
- Full-bleed grid extending to viewport edges
- Column start lines only (not filled bands)

### Grid Activation

**User's choice:** Leva panel only — no keyboard shortcuts.

### Content Placement

**User's clarification:** Fully flexible — any element can start at any column and span to any column. No rigid placement rules. Titles, images, subtitles can each align to different column start points. The grid provides alignment options, not constraints.

### Responsive Breakpoints

**User's choice:** Desktop 12 → Tablet 8 → Mobile 4 columns.

### Grid Layer Behavior

**User's clarification:** Grid overlay only visible on base page layer. Stacked content (cards, overlays) does not show grid but still aligns to grid coordinates.

---

## Claude's Discretion

- Leva panel layout and positioning
- Grid line styling defaults
- Content collection schema field naming
- Zod validation specifics
- CSS @layer organization
- Lenis smooth scroll configuration
- CSS noise/grain texture implementation

## Deferred Ideas

- Membership auth system (beyond visual mockup)
- Exhibition-specific color palettes (ADV-01, v2)
- FT Kunst typeface (briefing reference, not used)
- After-visit retention mode (brief's framework, not in phase scope)
