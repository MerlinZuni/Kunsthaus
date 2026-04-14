---
task: 260414-npq
type: quick
title: Improve the existing hero design for the on-site index
status: complete
completed: 2026-04-14
commit: 0f5a83b
files_modified:
  - src/components/hero/OnsiteHero.astro
requirements:
  - QUICK-260414-npq
---

# Quick Task 260414-npq: OnsiteHero Visual Redesign — Summary

**One-liner:** Rewrote `OnsiteHero.astro` to mirror `HeroCarousel`'s visual language — shared `GridOverlay` background + monumental three-line right-aligned `AT / THE / MUSEUM` title — minus all carousel/image/motion concerns.

## What Changed

Fully replaced `src/components/hero/OnsiteHero.astro` with a static, single-concern component that visually matches the planning homepage hero so the dual-mode concept reads coherently across routes.

**Structure:**
- `<section class="onsite-hero">` wraps a `GridOverlay` React island (`client:only="react"`) and a `.onsite-hero__text` wrapper containing an `<h1>` with three stacked `<span>` lines: `AT / THE / MUSEUM`.
- Props shape unchanged: `{ title: { de; en }; lang: 'en' | 'de' }`. `title[lang]` is still honored as the `aria-label` on the section so screen readers announce the accessible name.

**Styles (copied verbatim from HeroCarousel with rename `hero-carousel` → `onsite-hero`):**
- `.onsite-hero`: `position: relative; width: 100%; height: 85vh; min-height: 500px; overflow: hidden; background: var(--color-bg)`.
- `.onsite-hero__text`: absolute `inset: 0`, flex, `align-items: center`, `justify-content: flex-end`, `padding-right: var(--space-12)`, `z-index: 5`, `pointer-events: none`, **`mix-blend-mode: screen`** applied unconditionally (single-mode onsite component — no `html[data-mode="onsite"]` override needed).
- `.onsite-hero__title`: `display: flex; flex-direction: column; text-align: right; font-size: clamp(var(--type-4xl), 11vw, 9rem); font-weight: var(--weight-bold); line-height: var(--leading-tight); text-transform: uppercase; color: var(--color-text); margin: 0`.
- Mobile (`max-width: 767px`): `height: 100vh`; text wrapper becomes `align-items: flex-start; padding-right: var(--space-4); padding-top: 100px`.

## Why Three-Span Markup Was Hardcoded

Per CONTEXT.md "Claude's Discretion": the planner chose hardcoded spans over a data-driven array to minimize churn.

- `home.json` currently stores `title` as a single string `"AT THE MUSEUM"` for both `de` and `en`.
- Splitting at render time requires string parsing + branching; updating the content schema would cascade through the content collection + Zod validation.
- HeroCarousel itself hardcodes `KUNST / HAUS / ZURICH` as three literal spans — this mirrors that pattern exactly.
- The `title` prop is still honored via `aria-label` so screen readers receive the full accessible name. If German copy ever diverges from English, revisit by introducing a three-element array in `home.json`.

## Before / After — `.onsite-hero` CSS Surface

**Before:**
```css
.onsite-hero {
  min-height: 100svh;
  display: grid;
  place-items: end;
  padding: var(--space-24) var(--space-8) var(--space-16);
  background-color: var(--color-bg);
  background-image: repeating-linear-gradient(
    to right,
    rgba(255, 255, 255, 0.08) 0 1px,
    transparent 1px calc(100% / 12)
  );
}
.onsite-hero__title {
  font-size: var(--type-4xl);
  font-weight: var(--weight-regular);
  /* single-line, letter-spacing, max-width: 14ch */
}
```

**After:**
```css
.onsite-hero {
  position: relative;
  width: 100%;
  height: 85vh;
  min-height: 500px;
  overflow: hidden;
  background: var(--color-bg);
}
.onsite-hero__text {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: flex-end;
  mix-blend-mode: screen;
  padding-right: var(--space-12);
  z-index: 5; pointer-events: none;
}
.onsite-hero__title {
  display: flex; flex-direction: column;
  text-align: right;
  font-size: clamp(var(--type-4xl), 11vw, 9rem);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  text-transform: uppercase;
  color: var(--color-text);
  margin: 0;
}
```

Key differences: fixed container height with `overflow: hidden` instead of intrinsic grid; absolute-positioned text wrapper with flex alignment; monumental clamp() scale (`11vw` up to `9rem`) bold instead of regular `--type-4xl`; `mix-blend-mode: screen` added; local gradient background removed in favor of the shared `GridOverlay` island.

## Verification

**Build:**
```
npm run build → ✓ Completed in 6.75s
2 page(s) built (/index.html, /onsite/index.html)
```
No new errors or warnings attributable to OnsiteHero. Pre-existing texture resolution warnings (`/Kunsthaus/textures/*.png`) are unrelated runtime-resolved assets.

**Scope check:** Only `src/components/hero/OnsiteHero.astro` modified in this commit. No changes to `HeroCarousel.astro`, `GridOverlay.tsx`, `home.json`, or `src/pages/onsite/index.astro`.

**Consumer integrity:** `src/pages/onsite/index.astro:58` still calls `<OnsiteHero title={onsiteHome.hero.title} lang={lang} />` — prop shape preserved.

## Commit

- `0f5a83b` — `feat(onsite-hero): mirror planning hero visual language`

## Deviations from CONTEXT.md

None. All LOCKED decisions (visual direction, background grid, typography, container dimensions, dark-mode styling, out-of-scope boundary) were honored exactly as specified.

## Self-Check: PASSED

- File exists: `src/components/hero/OnsiteHero.astro` — FOUND
- Commit exists: `0f5a83b` — FOUND
- Build status: PASS

---

## Follow-up Hotfix (post-review)

During interactive browser review the initial commit revealed two issues introduced by literal CSS carry-over from `HeroCarousel`:

1. **`background: var(--color-bg)` was undefined.** The actual semantic token is `--color-surface` (see `src/styles/tokens/semantic.css`). The hero was effectively transparent and only looked dark because the `<body>` background was dark. Changed to `var(--color-surface)`.
2. **`mix-blend-mode: screen` on `.onsite-hero__text` created visual noise** on the title letterforms wherever they intersected the bright `GridOverlay` lines. HeroCarousel only needs screen-blend in onsite mode because the same React component has to work in both light and dark modes; `OnsiteHero` is single-mode, so the blend mode is unnecessary and harmful. Dropped entirely — text now renders with `var(--color-text)` directly over the dark background.

Additionally: the user reported a "flash-correct-then-wrong" symptom that turned out to be **stale Vite HMR CSS cache** from earlier dev sessions. A hard reload resolved it — no code change needed for that part.

**Follow-up commit:** included in the docs commit that wraps this follow-up section. No deviations from CONTEXT.md; these are corrections to a mis-copy from HeroCarousel, not scope changes.
