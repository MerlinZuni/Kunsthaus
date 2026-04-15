---
phase: 03-dual-mode-routing
verified: 2026-04-14T21:00:00Z
status: human_needed
score: 7/7 automated must-haves verified (plans 03-01/02/03; 03-04 out of scope)
re_verification:
  previous_status: human_needed
  previous_score: 12/12 structural
  gaps_closed: []
  gaps_remaining: []
  regressions: []
scope_note: |
  Phase 03 has 4 plans in ROADMAP. This verification covers plans 03-01, 03-02, 03-03
  (all marked complete). Plan 03-04 (Audio Guide + Login System) is still pending and
  its success criteria (paywall, simulateLogin, audio guide overlay, profile overlay)
  are explicitly NOT evaluated here.
human_verification:
  - test: "Click mode toggle on / — palette flip via View Transitions, not hard reload"
    expected: "Smooth View Transitions animation; URL changes to /Kunsthaus/onsite; dark palette applied"
    why_human: "Visual smoothness of the animation can only be judged in a browser"
  - test: "Hard refresh /onsite — no flash of light palette"
    expected: "Dark palette visible from first paint"
    why_human: "First-paint flash requires real browser render"
  - test: "KJM hero video autoplays with poster fallback on iOS Safari"
    expected: "Video plays muted on load; poster shows before playback"
    why_human: "Mobile autoplay behaviour and poster timing only testable in a real browser"
  - test: "Artwork slider horizontal scroll vs page vertical scroll on mobile"
    expected: "Horizontal swipe scrolls the slider, not the page"
    why_human: "Touch gesture conflict with SectionWrapper pinning needs device testing"
  - test: "HorizontalSlider peek-scale/opacity smoothness during scroll"
    expected: "Cards scale/fade smoothly as they approach center"
    why_human: "IntersectionObserver → CSS var timing is visual"
  - test: "CinematicReveal imagePosition='left' frame alignment on desktop"
    expected: "Pre-expansion frame sits toward left edge ≥768px; recenters during scroll timeline"
    why_human: "Layout offset is visual; GSAP timeline interaction with CSS var needs eyeballing"
---

# Phase 03: Dual-Mode Routing Verification Report

**Phase Goal:** Transform the dual-mode concept from a CSS palette flip into a genuine routing experience with Astro View Transitions and a drill-down exhibition detail page for Kerry James Marshall.

**Verified:** 2026-04-14
**Status:** human_needed (all automated checks PASS)
**Scope:** Plans 03-01, 03-02, 03-03 — Plan 03-04 is still pending per ROADMAP and is explicitly out of scope for this verification.

## Goal Achievement

### Observable Truths (automated)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `/onsite` route exists, uses `data-mode="onsite"`, and inherits the dark stacking cascade | ✓ VERIFIED | `src/pages/onsite/index.astro:77` passes `mode="onsite"` to `BaseLayout`; `BaseLayout.astro:52` renders `<html lang={lang} data-mode={mode}>`; `src/styles/tokens/semantic.css:13` cascades onsite palette; `src/styles/components/sections.css:18-21` maps bg-step 1-4 to `#272523 / #1e1c1a / #333130 / #1a1816` under `html[data-mode="onsite"]`; built `dist/onsite/index.html` renders with `data-mode="onsite"`. |
| 2 | `/onsite/kerry-james-marshall` exists with hero video carrying all 5 required HTML5 attributes + poster | ✓ VERIFIED | `src/components/hero/KjmHero.astro:22-33` declares `<video autoplay muted loop playsinline preload="metadata" poster={posterSrc}>`; built HTML tokens grep yields `autoplay, muted, loop, playsinline, preload="metadata", poster=`. No `transition:persist` anywhere in KjmHero. `dist/onsite/kerry-james-marshall/index.html` exists (generated in 36ms per build log). |
| 3 | ArtworkSlider: horizontal scroll-snap, 10 slides, silent headphones stub | ✓ VERIFIED | `ArtworkSlider.astro:138-161` sets `scroll-snap-type: x mandatory` + `scroll-snap-align: center` on `.artwork-slider__slide { flex: 0 0 100% }`; prev/next handlers call `track.scrollBy({left: dir * clientWidth, behavior: 'smooth'})`. Headphones button at lines 66-72 has **no click handler** and no `dispatchEvent` / `audioGuide` / `__audioGuideOverlay` reference (grep clean). `kerry-james-marshall.json` contains 10 artwork entries (id `de-style` … up to number 10). |
| 4 | HorizontalSlider uses IntersectionObserver mapped to `--card-scale` / `--card-opacity` with reduce-motion short-circuit | ✓ VERIFIED | `HorizontalSlider.astro:44-60` constructs `new IntersectionObserver` with `root: track, threshold: [0,.25,.5,.75,1]`, writes `--card-scale` (0.85+0.15*ratio) and `--card-opacity` (0.5+0.5*ratio) per entry; lines 36-42 short-circuit under `prefers-reduced-motion`; CSS lines 97-104 apply the custom props to `:global(*)` children with scroll-snap-align center; reduce-motion CSS branch at 115-121 neutralises the transform. |
| 5 | CinematicReveal adapter pattern + SectionWrapper bgStep cadence on KJM detail | ✓ VERIFIED | `kerry-james-marshall.astro:30-35` builds `cinematicData` mapping `cardTitle → title`; wraps CinematicReveal in `<section class="stacking-section cinematic-reveal-section">`; passes `imagePosition={kjm.cinematicReveal.imagePosition || 'left'}`. `CinematicReveal.astro:17,20,26,283` adds the `imagePosition` prop, exposes it as `data-image-position`, and applies a desktop-only CSS rule. SectionWrappers on the KJM page use index 1-5 with bgStep 1,2,3,4,1 (intro, artworks, quote, videos, shop). |
| 6 | OnsiteExhibitionGrid KJM card is click-through; other cards remain non-clickable | ✓ VERIFIED | `OnsiteExhibitionGrid.astro:31-55` conditionally renders `<a class="onsite-grid__card onsite-grid__card--link" href={\`${base}/onsite/${item.id}\`}>` only when `item.id === 'kerry-james-marshall'`; all other items render a plain `<div class="onsite-grid__card">`. |
| 7 | `onsiteExhibition` schema matches rewritten shape and KJM JSON validates | ✓ VERIFIED | `src/content.config.ts:53-104` defines `onsiteExhibition` with `heroVideo{src,poster}`, `cinematicReveal{tagline,cardTitle,description,image,imagePosition?}`, `intro{heading,body}`, `artworks[]`, `artistQuote`, `videos[]`, `shop[]`. `src/content/onsite/kerry-james-marshall.json` top-level key is `"kerry-james-marshall"` (id-keyed wrapper per Astro `file()` loader contract). Build log: `[content] Synced content` with no Zod errors. |

### ROADMAP Success Criteria mapping

| SC | ROADMAP text | Status | Evidence |
|----|--------------|--------|----------|
| 1 | Mode toggle navigates `/` → `/onsite` via View Transitions | ✓ STRUCTURAL PASS | `BaseLayout.astro:13,55` imports + renders `<ClientRouter />`; HamburgerOverlay + FooterColumns use base-prefixed `<a href>` (per 03-01 summary commit `c1f9cb5`); visual smoothness flagged for human. |
| 2 | URL is single source of truth; localStorage removed | ✓ VERIFIED | 03-01 summary documents `grep -rn 'kunsthaus-mode' src/` = 0; `ModeToggle.tsx` deleted. |
| 3 | `/onsite` full landing with hero, cinematic reveal, building grids, navigator, info box with today's events, FAQ | ✓ VERIFIED | `src/pages/onsite/index.astro` composes OnsiteHero → CinematicReveal → 2× OnsiteExhibitionGrid (Chipperfield, Moser) → Visitor Essentials grid (superset of old InfoBox/NavigatorTeaser per quick task `260414-ru8`) → FAQAccordion. |
| 4 | `/onsite/kerry-james-marshall` full detail page | ✓ VERIFIED | Truths 2,3,5 above cover hero video, cinematic reveal, artwork slider, artist quote, video testimonials slider, shop slider. |
| 5 | Headphones → paywall (logged out) | ⏭ DEFERRED → Plan 03-04 | Plan 03-04; headphones button is intentionally silent per 03-03 decision. |
| 6 | Buy Tickets → simulated login | ⏭ DEFERRED → Plan 03-04 | — |
| 7 | Audio guide Playlist + Detail Player | ⏭ DEFERRED → Plan 03-04 | — |
| 8 | Profile overlay | ⏭ DEFERRED → Plan 03-04 | — |

### Requirements Coverage

| Requirement | Source | Status | Evidence |
|-------------|--------|--------|----------|
| ANIM-04 (View Transitions mode switch) | 03-03 summary | ✓ SATISFIED | `<ClientRouter />` mounted in BaseLayout head; mode-toggle writers use `<a href>` navigation; ROADMAP explicitly re-scopes ANIM-04 as "View Transitions". |
| ANIM-06 (Stacking/layering scroll extended) | 03-03 summary | ✓ SATISFIED | KJM detail page uses SectionWrapper bgStep 1-4 cadence; dark cascade rules in `sections.css` map bgStep 1-4 to dark backgrounds. |
| NAV-02 | ROADMAP phase requirements | ✓ SATISFIED (structural) | Mode toggle writers refactored to route-aware navigation (03-01). |
| NAV-03 | 03-02 summary | ✓ SATISFIED | Landing page delivered. |

### Required Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `src/pages/onsite/index.astro` | ✓ VERIFIED | Exists, `mode="onsite"`, full composition |
| `src/pages/onsite/kerry-james-marshall.astro` | ✓ VERIFIED | Exists, 5 SectionWrappers + hero + cinematic |
| `src/components/hero/KjmHero.astro` | ✓ VERIFIED | All 5 video attrs + poster present; no `transition:persist` |
| `src/components/sections/ArtworkSlider.astro` | ✓ VERIFIED | scroll-snap horizontal; silent headphones button |
| `src/components/sections/HorizontalSlider.astro` | ✓ VERIFIED | IntersectionObserver + reduce-motion short-circuit |
| `src/components/sections/CinematicReveal.astro` | ✓ VERIFIED | `imagePosition` prop added, default 'center' |
| `src/components/sections/OnsiteExhibitionGrid.astro` | ✓ VERIFIED | KJM-only `<a>` click-through |
| `src/content/onsite/kerry-james-marshall.json` | ✓ VERIFIED | id-keyed wrapper; 10 artworks; new shape |
| `src/content.config.ts` (`onsiteExhibition`) | ✓ VERIFIED | Rewritten schema matches new JSON |
| `dist/onsite/kerry-james-marshall/index.html` | ✓ VERIFIED | Generated by `npm run build` |

### Build Verification

`npm run build` executed from `/Users/merlinzuni/develop/Kunsthaus` at 2026-04-14T20:59:13Z:

- Content sync OK (`onsiteExhibition`, `onsiteHome` both validate)
- 3 pages built: `dist/index.html`, `dist/onsite/index.html`, `dist/onsite/kerry-james-marshall/index.html`
- Total: 6.28s
- Only pre-existing warnings (texture path resolution) — no new errors
- Built HTML for the KJM page contains all six tokens: `autoplay`, `muted`, `loop`, `playsinline`, `preload="metadata"`, `poster=` (confirmed via grep on `dist/onsite/kerry-james-marshall/index.html`)

### Anti-Patterns Found

None. No `TODO` / `FIXME` markers on the critical path, no hardcoded stub arrays flowing to render, no empty handlers on the critical path. Headphones button being a no-op is a documented deliberate stub for Plan 03-04, not a regression.

### Known Stubs (documented, not gaps)

- Headphones button on each artwork slide is silent by design (03-04 wires it).
- Shop "Add to cart" is a visual stub (no cart system exists).
- Artwork entries 5-10 reuse 4 real JPGs (prototype fidelity).
- Video testimonial thumbnails + shop images reuse `kjm-portrait.png`.
- Plan 03-04 (Audio Guide + Login System) is not yet shipped — ROADMAP still shows `[ ] 03-04-PLAN.md`. SCs 5-8 from ROADMAP are therefore deferred, not failing.

### Human Verification Required

See frontmatter `human_verification` block. Six items require real browser sessions:
1. View Transitions visual smoothness on mode toggle
2. No-flash-of-light-palette on `/onsite` hard refresh
3. KJM hero video autoplay + poster on iOS Safari
4. Artwork slider horizontal scroll gesture on mobile (nested in vertical pin)
5. HorizontalSlider peek-scale/opacity smoothness
6. CinematicReveal `imagePosition: 'left'` desktop alignment

### Gaps Summary

No automated gaps. All files exist, all contracts are honoured, build succeeds, the rewritten `onsiteExhibition` schema validates the new JSON, the KJM card click-through is scoped correctly, the five required HTML5 video attributes are present in both source and built output, the dark stacking cascade extends to bg-step 1-4 under `html[data-mode="onsite"]`, and the CinematicReveal adapter + `imagePosition` prop are wired end to end. Verification status is `human_needed` solely because visual/browser-only behaviours cannot be confirmed headlessly.

---

_Verified: 2026-04-14_
_Verifier: Claude (gsd-verifier)_
