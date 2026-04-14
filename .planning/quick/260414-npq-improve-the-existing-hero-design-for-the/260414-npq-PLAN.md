---
phase: 260414-npq
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/hero/OnsiteHero.astro
autonomous: true
requirements:
  - QUICK-260414-npq
must_haves:
  truths:
    - "/onsite landing page hero visually mirrors the planning HeroCarousel (same container dimensions, same monumental right-aligned three-line title, same GridOverlay background)"
    - "Hero displays the three stacked lines AT / THE / MUSEUM in uppercase, right-aligned, using the same clamp() typographic scale as HeroCarousel"
    - "Background is the shared GridOverlay React island (48/24 tracks, custom row pattern), not a local repeating-linear-gradient"
    - "mix-blend-mode: screen is applied unconditionally to the title wrapper (single-mode onsite component)"
    - "OnsiteHero remains static — no GSAP, no SplitText, no carousel, no imagery"
    - "Consumer src/pages/onsite/index.astro still compiles with no prop-shape changes"
  artifacts:
    - path: "src/components/hero/OnsiteHero.astro"
      provides: "Static dark onsite hero with grid background + three-line monumental title"
      contains: "GridOverlay, onsite-hero__text, onsite-hero__title, three span lines"
  key_links:
    - from: "src/components/hero/OnsiteHero.astro"
      to: "src/components/GridOverlay.tsx"
      via: "Astro import + client:only=\"react\""
      pattern: "import GridOverlay.*GridOverlay\\.tsx"
    - from: "src/pages/onsite/index.astro"
      to: "src/components/hero/OnsiteHero.astro"
      via: "<OnsiteHero title={onsiteHome.hero.title} lang={lang} />"
      pattern: "OnsiteHero title="
---

<objective>
Rewrite `src/components/hero/OnsiteHero.astro` so the /onsite landing hero visually matches the planning HeroCarousel — same container, same three-line monumental right-aligned title, same GridOverlay background — minus all carousel/image/motion concerns. Dark palette comes for free via the `data-mode="onsite"` cascade on semantic tokens.

Purpose: The current OnsiteHero is a stub (single-line title, vertical-only gradient). The competition prototype needs the onsite landing hero to feel like a sibling of the planning hero so the dual-mode concept reads coherently.

Output: A rewritten `OnsiteHero.astro` that renders `GridOverlay` + a three-span title (`AT / THE / MUSEUM`) using the HeroCarousel CSS verbatim, with the `mix-blend-mode: screen` override applied unconditionally. Prop shape unchanged.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@./CLAUDE.md
@.planning/quick/260414-npq-improve-the-existing-hero-design-for-the/260414-npq-CONTEXT.md
@src/components/hero/OnsiteHero.astro
@src/components/hero/HeroCarousel.astro
@src/components/GridOverlay.tsx
@src/pages/onsite/index.astro
@src/content/onsite/home.json

<interfaces>
<!-- Key contracts the executor needs. Do not explore the codebase for these. -->

Consumer call site (src/pages/onsite/index.astro line 58):
```astro
<OnsiteHero title={onsiteHome.hero.title} lang={lang} />
```
where `onsiteHome.hero.title` is `{ de: "AT THE MUSEUM", en: "AT THE MUSEUM" }` and `lang` is `'en' | 'de'`. The `title` prop MUST remain `{ de: string; en: string }` and `lang` MUST remain `'en' | 'de'`. Do not change the prop shape.

GridOverlay import (from HeroCarousel.astro line 8, mirror verbatim):
```astro
import GridOverlay from '../GridOverlay.tsx';
```
Usage (from HeroCarousel.astro line 46):
```astro
<GridOverlay client:only="react" />
```
GridOverlay is an absolutely-positioned React island (inset: 0, zIndex: 0, pointer-events: none). It self-detects onsite mode via `html[data-mode="onsite"]` and switches color to `#fbf8f7`. No props needed.

CSS to copy verbatim from HeroCarousel.astro (rename `hero-carousel` → `onsite-hero`):
- `.hero-carousel` → `.onsite-hero` (lines 86-93): position:relative, width:100%, height:85vh, min-height:500px, overflow:hidden. Background: use `var(--color-bg)` instead of `var(--color-surface)` per CONTEXT.md.
- `.hero-carousel__text` → `.onsite-hero__text` (lines 115-125): absolute inset:0, flex, align-items:center, justify-content:flex-end, padding-right:var(--space-12), z-index:5, pointer-events:none, **mix-blend-mode: screen** (NOT multiply — applied unconditionally since this component is single-mode onsite).
- `.hero-carousel__title` → `.onsite-hero__title` (lines 127-136): display:flex, flex-direction:column, text-align:right, font-size:clamp(var(--type-4xl), 11vw, 9rem), font-weight:var(--weight-bold), line-height:var(--leading-tight), text-transform:uppercase, color:var(--color-text).
- Mobile @media (max-width: 767px) (lines 159-170): `.onsite-hero { height: 100vh; }` and `.onsite-hero__text { align-items: flex-start; justify-content: flex-end; padding-right: var(--space-4); padding-top: 100px; }`.
- Do NOT copy `.hero-carousel__facade`, `.hero-carousel__slides`, `.hero-carousel__scrim`, `.sr-only`, or the `html[data-mode="onsite"]` override rule.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Rewrite OnsiteHero.astro — GridOverlay background + three-line monumental title</name>
  <files>src/components/hero/OnsiteHero.astro</files>
  <action>
Fully replace the contents of `src/components/hero/OnsiteHero.astro` with a single-concern static component that mirrors HeroCarousel's structure and CSS.

**Frontmatter (TypeScript):**
- Keep the Props interface exactly as-is: `{ title: { de: string; en: string }; lang: 'en' | 'de' }`. Do not alter the prop shape — the consumer at `src/pages/onsite/index.astro:58` depends on it.
- Add import: `import GridOverlay from '../GridOverlay.tsx';` (same relative path pattern HeroCarousel uses).
- Destructure `{ title, lang }` from `Astro.props`. `lang` is currently unused in the markup (hardcoded spans), but keep it destructured so the prop contract is preserved and future i18n has a hook. If the linter complains about unused `lang`, either reference it in a comment or use it inside the aria-label expression (see below).

**Markup:**
```astro
<section class="onsite-hero" aria-label={title[lang]}>
  <GridOverlay client:only="react" />

  <div class="onsite-hero__text">
    <h1 class="onsite-hero__title">
      <span>AT</span>
      <span>THE</span>
      <span>MUSEUM</span>
    </h1>
  </div>
</section>
```

Rationale for hardcoded spans (Claude's Discretion per CONTEXT.md): `home.json` currently stores `title` as a single string `"AT THE MUSEUM"` for both `de` and `en`. Splitting at render time requires string parsing and branching; updating the content schema adds churn across the content collection + Zod validation. Hardcoding three spans is the minimum-churn path and mirrors HeroCarousel's hardcoded `KUNST/HAUS/ZURICH` exactly. The `title` prop is still honored via `aria-label` so screen readers announce the accessible name. If German copy ever diverges, revisit by introducing a three-element array in `home.json`.

**Styles (`<style>` block, replace wholesale):**
Copy the HeroCarousel rules named above verbatim, renaming `hero-carousel` → `onsite-hero`. Specifically:

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
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  mix-blend-mode: screen;
  padding-right: var(--space-12);
  z-index: 5;
  pointer-events: none;
}

.onsite-hero__title {
  display: flex;
  flex-direction: column;
  text-align: right;
  font-size: clamp(var(--type-4xl), 11vw, 9rem);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  text-transform: uppercase;
  color: var(--color-text);
  margin: 0;
}

@media (max-width: 767px) {
  .onsite-hero {
    height: 100vh;
  }

  .onsite-hero__text {
    align-items: flex-start;
    justify-content: flex-end;
    padding-right: var(--space-4);
    padding-top: 100px;
  }
}
```

Notes:
- `background: var(--color-bg)` (NOT `--color-surface`) per CONTEXT.md "Container dimensions (LOCKED)".
- `mix-blend-mode: screen` is unconditional — no `html[data-mode="onsite"]` override needed since this component only renders on /onsite.
- `margin: 0` added to `.onsite-hero__title` to neutralize default `<h1>` margins (HeroCarousel inherits from a different reset path but onsite may be affected; safe to include).
- DELETE all of the current OnsiteHero styles: `min-height: 100svh`, `display: grid`, `place-items: end`, `padding`, and the `repeating-linear-gradient` background-image.

**Do NOT include:**
- No `<script>` block. No GSAP. No SplitText. No carousel state.
- No `HeroCarousel` changes. No `GridOverlay` changes. No `home.json` changes. No `src/pages/onsite/index.astro` changes (verification only).
- No facade image, no scrim, no slides container.

**Base path:** The GridOverlay import is a relative TS import (`../GridOverlay.tsx`) — no `import.meta.env.BASE_URL` handling needed. HeroCarousel's only base-path usage is for the facade image (`chipperfield-facade.jpg`), which OnsiteHero does not render, so there is nothing to port.
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -40</automated>
    <manual>
Run `npm run dev` and visit `/onsite` in a browser. Confirm:
1. Hero occupies 85vh (desktop) / 100vh (mobile) at the top of the page.
2. Background shows the shared GridOverlay (vertical + horizontal lines in light color `#fbf8f7` at 0.20 opacity on the dark onsite background).
3. Three stacked lines `AT` / `THE` / `MUSEUM` appear in uppercase, right-aligned, bold, using the monumental clamp() scale (visually sized like planning hero's KUNST/HAUS/ZURICH).
4. On mobile viewport (<768px) the title sits top-right with 100px top padding, not centered.
5. No carousel, no images, no tabs, no entrance motion.
6. The /onsite page still renders all sections below the hero (CinematicReveal, grids, FAQ, footer) — no regressions in the consumer.
    </manual>
  </verify>
  <done>
- `src/components/hero/OnsiteHero.astro` rewritten with GridOverlay import, three-span markup, and HeroCarousel-derived CSS renamed to `.onsite-hero*`.
- Props interface unchanged (`{ title: { de; en }; lang: 'en' | 'de' }`).
- `npm run build` succeeds with zero new errors or warnings attributable to OnsiteHero.
- Visual verification on /onsite confirms desktop + mobile layout matches planning HeroCarousel's title/grid feel in the dark cascade.
- No changes to HeroCarousel.astro, GridOverlay.tsx, home.json, or src/pages/onsite/index.astro.
  </done>
</task>

</tasks>

<verification>
**Build check:**
```bash
npm run build
```
Must complete without errors. Zero new warnings from `src/components/hero/OnsiteHero.astro`.

**Consumer integrity check:**
```bash
grep -n "OnsiteHero" src/pages/onsite/index.astro
```
Confirms the prop-passing line is still `<OnsiteHero title={onsiteHome.hero.title} lang={lang} />`. No edits to this file should have happened.

**Scope-creep check:**
```bash
git status --short
```
Only `src/components/hero/OnsiteHero.astro` should appear as modified (plus planning files). If HeroCarousel, GridOverlay, or home.json appear, back those changes out.

**Visual verification:** see Task 1 manual verify steps.
</verification>

<success_criteria>
1. `src/components/hero/OnsiteHero.astro` imports and renders `GridOverlay` as a `client:only="react"` island.
2. Hero renders three stacked spans `AT / THE / MUSEUM` inside `.onsite-hero__title`.
3. Container uses `height: 85vh; min-height: 500px; overflow: hidden; position: relative;` and `background: var(--color-bg)`.
4. `.onsite-hero__text` applies `mix-blend-mode: screen` unconditionally.
5. Mobile breakpoint matches HeroCarousel: `height: 100vh`, `align-items: flex-start`, `padding-right: var(--space-4)`, `padding-top: 100px`.
6. No GSAP, no `<script>` block, no imagery, no carousel markup.
7. `npm run build` succeeds.
8. `/onsite` renders correctly in-browser with no consumer regressions.
9. Only `src/components/hero/OnsiteHero.astro` is modified in the source tree.
</success_criteria>

<output>
After completion, create `.planning/quick/260414-npq-improve-the-existing-hero-design-for-the/260414-npq-SUMMARY.md` capturing:
- What changed (OnsiteHero rewrite — GridOverlay + three-span monumental title)
- Why the three-span markup was hardcoded (minimum-churn vs. schema change)
- Commit hash and message (suggested: `feat(onsite-hero): mirror planning hero visual language`)
- Before/after snapshot of the `.onsite-hero` CSS surface area
- Any deviations from CONTEXT.md (expected: none)
</output>
