# Quick Task 260414-npq: improve the existing hero design for the on-site index - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Task Boundary

Improve the visual design of `src/components/hero/OnsiteHero.astro` (the `/onsite` landing hero). Current implementation is content-correct but visually underdeveloped — a stub-level single-line title on a vertical-only grid background. The redesign reuses the planning homepage hero's existing visual language verbatim, adapted to the dark onsite cascade, minus any carousel behavior.

</domain>

<decisions>
## Implementation Decisions

### Visual direction (LOCKED)
- OnsiteHero must visually emulate the Planning homepage hero exactly — same structure, same typographic scale and placement, same grid background — with two deltas only:
  1. Content: "AT THE MUSEUM" instead of "KUNSTHAUS ZÜRICH"
  2. Palette: dark-mode styling via the `data-mode="onsite"` cascade
- OnsiteHero MUST NOT include any carousel element (no slides, no facade image, no tabs, no scrim, no auto-play).
- Planning hero reference source: `src/components/hero/HeroCarousel.astro` — specifically `.hero-carousel` container (lines 86-93), `.hero-carousel__text` wrapper (lines 115-125), `.hero-carousel__title` (lines 127-136), and the mobile overrides at lines 159-170.

### Background grid (LOCKED — reuse exact definitions)
- Use the existing `src/components/GridOverlay.tsx` component as the background layer, same as the planning hero.
- GridOverlay already handles onsite mode: color switches to `#fbf8f7` at opacity 0.20 when `html[data-mode="onsite"]`.
- Vertical tracks: 48 desktop / 24 mobile (already defined in GridOverlay).
- Horizontal row pattern: 80px, 80px, 160px, 160px, 160px repeating up to 2000px (already defined in GridOverlay).
- Do NOT re-implement the grid inside OnsiteHero. Do NOT define custom `repeating-linear-gradient` backgrounds. Remove the current vertical-only gradient from OnsiteHero.
- Render the GridOverlay as an absolutely-positioned background child of the hero section, matching the z-index/stacking of the planning hero.

### Typography (LOCKED — copy exact definitions)
- Copy `.hero-carousel__title` rules verbatim: `font-size: clamp(var(--type-4xl), 11vw, 9rem)`, `font-weight: var(--weight-bold)`, `line-height: var(--leading-tight)`, `text-transform: uppercase`, `text-align: right`, `color: var(--color-text)`, `display: flex; flex-direction: column`.
- Copy `.hero-carousel__text` wrapper rules verbatim: absolute inset:0, flex, align-items: center, justify-content: flex-end, padding-right: var(--space-12), z-index: 5, pointer-events: none, mix-blend-mode: multiply — with the onsite `mix-blend-mode: screen` override (already present in HeroCarousel) applied directly since this component is always onsite.
- Title markup: three stacked `<span>` lines mirroring the "KUNST / HAUS / ZURICH" three-span pattern. Content is "AT / THE / MUSEUM" (English) and the German equivalent from the existing content collection (translate if needed — current data only has English "AT THE MUSEUM"; planner must decide whether to split at render time or update `home.json` to a three-line array).
- Mobile overrides (max-width 767px): `align-items: flex-start`, `padding-right: var(--space-4)`, `padding-top: 100px` — identical to planning hero.

### Container dimensions (LOCKED)
- `.onsite-hero` must use `height: 85vh; min-height: 500px; overflow: hidden; position: relative` — mirroring `.hero-carousel` exactly.
- Mobile: `height: 100vh` override.
- Background color: `var(--color-bg)` (resolves to dark via the onsite cascade).
- Drop the current `min-height: 100svh`, `display: grid; place-items: end`, and `padding` rules — they are inconsistent with the planning hero.

### Dark-mode styling (LOCKED)
- Because OnsiteHero renders only on `/onsite` where `html[data-mode="onsite"]` is active, semantic tokens (`var(--color-bg)`, `var(--color-text)`) already resolve to dark values via the existing cascade. No hardcoded dark colors.
- `mix-blend-mode: screen` is the dark-mode equivalent of the planning hero's `multiply` — apply it unconditionally here since the component is single-mode.

### Out of scope (explicit non-goals)
- No GSAP, no SplitText, no scroll-driven motion, no entrance animation. Plan 03-02's "OnsiteHero is STATIC" decision still holds.
- No imagery or photographic background. Type + grid only.
- No changes to `HeroCarousel.astro`, `GridOverlay.tsx`, or any planning-side file.
- No changes to the `/onsite` page composition beyond whatever prop shape OnsiteHero needs.

### Claude's Discretion
- Exact way to render the three-line title: inline hard-coded spans vs. data-driven array from `home.json`. Planner decides, leaning toward minimum content churn.
- Whether to introduce a shared `.hero-title` / `.hero-grid-container` class or keep OnsiteHero self-contained with duplicated CSS. Given the 3-4 day timeline and competition focus, inline duplication is acceptable.

</decisions>

<specifics>
## Specific Ideas

- Planning hero as reference: `src/components/hero/HeroCarousel.astro` (structure + CSS to copy)
- Grid component to reuse: `src/components/GridOverlay.tsx` (import as a React island via `client:only="react"`, same as HeroCarousel does)
- Current file to rewrite: `src/components/hero/OnsiteHero.astro`
- Consumer: `src/pages/onsite/index.astro` — verify prop shape still matches after rewrite

</specifics>

<canonical_refs>
## Canonical References

- Plan 03-02 key-decision: "OnsiteHero is STATIC — no GSAP, no SplitText, no carousel. Does not fork HeroCarousel.astro." — This task updates the visual fidelity but keeps the static-no-carousel constraint intact; "does not fork" is relaxed to "reuses CSS patterns without forking the component file."
- `.planning/phases/03-dual-mode-routing/03-02-PLAN.md` Task 2 (OnsiteHero creation) — original spec being superseded visually.

</canonical_refs>
