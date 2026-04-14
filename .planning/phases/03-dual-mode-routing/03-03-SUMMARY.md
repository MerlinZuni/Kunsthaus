---
phase: 03-dual-mode-routing
plan: 03
subsystem: onsite-kjm-detail, content, video-hero, sliders
tags: [astro, content-collections, zod, video, scroll-snap, intersection-observer, dark-mode, view-transitions]

requires:
  - phase: 03-dual-mode-routing
    plan: 01
    provides: "Astro View Transitions, data-mode='onsite' dark cascade, base-path-aware anchors"
  - phase: 03-dual-mode-routing
    plan: 02
    provides: "/onsite landing page, OnsiteExhibitionGrid, CinematicReveal cardTitle->title adapter, dark stacking-section bg-step cascade, id-keyed single-file collection wrapper"

provides:
  - "Full /onsite/kerry-james-marshall exhibition detail route"
  - "KjmHero: plain HTML5 background video hero with poster fallback + back link overlay"
  - "ArtworkSlider: one-per-viewport horizontal scroll-snap carousel; silent headphones stub on every slide"
  - "ArtistQuote: typographic pull-quote block (no JS)"
  - "HorizontalSlider: reusable center-snap peek slider with IntersectionObserver-driven scale/opacity"
  - "Rewritten onsiteExhibition collection schema matching 03-CONTEXT data shape"
  - "Rewritten kerry-james-marshall.json with 10 artworks, 3 video testimonials, 3 shop items, hero video paths, cinematicReveal + intro + artist quote"
  - "CinematicReveal imagePosition prop ('left' | 'center' | 'right') for desktop-only frame alignment"
  - "Clickable KJM card on /onsite (OnsiteExhibitionGrid renders <a> only for KJM)"

affects: [03-04]

tech-stack:
  added: []
  patterns:
    - "HTML5 background video (autoplay muted loop playsinline preload=metadata poster), NO transition:persist"
    - "CSS scroll-snap horizontal carousel with programmatic scrollBy({behavior:'smooth'}) prev/next"
    - "IntersectionObserver -> CSS custom props for peek scale/opacity; short-circuit under prefers-reduced-motion"
    - "Dual-init (DOMContentLoaded + astro:page-load), guarded by data-initialized flag"
    - "id-keyed single-file content collection wrapper ({'kerry-james-marshall': {...}})"
    - "CinematicReveal page-level cardTitle -> title adapter (same 03-02 trap)"

key-files:
  created:
    - src/pages/onsite/kerry-james-marshall.astro
    - src/components/hero/KjmHero.astro
    - src/components/sections/ArtworkSlider.astro
    - src/components/sections/ArtistQuote.astro
    - src/components/sections/HorizontalSlider.astro
  modified:
    - src/content.config.ts
    - src/content/onsite/kerry-james-marshall.json
    - src/components/sections/CinematicReveal.astro
    - src/components/sections/OnsiteExhibitionGrid.astro

key-decisions:
  - "Hero <video> is plain HTML5, not a GSAP-driven element; no ScrollTrigger on the video; no transition:persist"
  - "Headphones button is a zero-handler stub in 03-03; 03-04 will attach the listener"
  - "Intro lives in its own SectionWrapper between cinematic reveal and ArtworkSlider, not merged into the slider"
  - "CinematicReveal imagePosition prop added (desktop-only margin shift); default 'center'; KJM passes 'left'"
  - "10 artworks in JSON, 4 real artwork JPGs on disk — entries 5-10 cycle those 4 images (prototype, not pixel-accurate)"
  - "Videos + shop reuse HorizontalSlider twice with distinct inline cards (video-card, shop-card) rather than branching inside a single instance"

requirements-completed:
  - ANIM-04
  - ANIM-06

duration: ~6 min
completed: 2026-04-14
---

# Phase 03 Plan 03: KJM Exhibition Detail Page Summary

Built the full `/Kunsthaus/onsite/kerry-james-marshall` exhibition detail route: autoplaying dark hero video with a top-left "← Your visit" back link, cinematic reveal of `kjm-portrait.png` with the new desktop-only `imagePosition: 'left'` variant, a dedicated intro copy stacking section, a one-per-viewport 10-slide ArtworkSlider (with silent headphones stubs for 03-04 to wire), the Marshall "black paints" ArtistQuote, a 3-card video testimonials HorizontalSlider, a 3-card shop HorizontalSlider, and the standard Footer + StickyCTA — all under the `data-mode="onsite"` dark cascade. The `onsiteExhibition` content collection schema was rewritten end-to-end and the JSON file re-shaped as an id-keyed object wrapper to match Astro's `file()` loader contract. The KJM card on `/onsite` now routes into the page via a surgical `<a>`-vs-`<div>` edit.

**Started:** 2026-04-14T20:51Z
**Ended:** 2026-04-14T20:55Z
**Tasks completed:** 8
**Files touched:** 9 (5 created, 4 modified)

## Tasks

| # | Description | Commit |
|---|---|---|
| 1 | Rewrite onsiteExhibition schema + KJM JSON content | `0b908e8` |
| 2 | KJM detail route skeleton (KjmHero + CinematicReveal imagePosition prop) | `dbf2faf` |
| 3 | ArtworkSlider (scroll-snap, silent headphones stub) | `a36037b` |
| 4 | ArtistQuote component | `7aac754` |
| 5 | HorizontalSlider (center-snap peek) | `4157c28` |
| 6 | Compose KJM detail page sections | `78be094` |
| 7 | OnsiteExhibitionGrid KJM click-through | `eef0335` |
| 8 | Build + grep gate verification | `e00c134` |


## Success Criteria

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | `/onsite/kerry-james-marshall` renders successfully | PASS | `dist/onsite/kerry-james-marshall/index.html` generated in 36ms |
| 2 | `data-mode="onsite"` on html | PASS | `grep -c 'data-mode="onsite"' dist/onsite/kerry-james-marshall/index.html` = 1 |
| 3 | Video has all 5 required attributes + poster + no transition:persist | PASS | KjmHero.astro contains autoplay, muted, loop, playsinline, preload="metadata", poster={posterSrc}; `grep 'transition:persist' KjmHero.astro` = 0 |
| 4 | Back link top-left reads "← Your visit" and points at `${base}/onsite` | PASS | `.kjm-hero__back` absolute-positioned top-left; href built from `${base}/onsite` at page level |
| 5 | CinematicReveal wrapped in stacking section with `cardTitle -> title` adapter | PASS | Page builds `cinematicData` adapter object; wrapper matches `/onsite/index.astro` pattern |
| 6 | CinematicReveal `imagePosition` prop added, KJM passes 'left' | PASS | Props interface extended; data-image-position attribute on root; desktop-only CSS rule shifts frame margin |
| 7 | Intro section in its own SectionWrapper | PASS | Section index=1, bgStep=1, sectionName=intro.heading |
| 8 | ArtworkSlider renders 10 slides with role/aria + prev/next | PASS | `role="region"` + `aria-roledescription="carousel"`; 10 artworks in JSON; prev/next click handlers use `scrollBy` |
| 9 | Headphones button is silent (no handler, no event dispatch) | PASS | `grep -cE 'dispatchEvent\|audioGuide\|__audioGuideOverlay' ArtworkSlider.astro` = 0 |
| 10 | ArtistQuote renders Marshall quote | PASS | `<blockquote>` + `<figcaption>`, no JS |
| 11 | Videos HorizontalSlider with 3 cards | PASS | 3 video-card `<article>` children in slot |
| 12 | Shop HorizontalSlider with 3 cards | PASS | 3 shop-card `<article>` children; non-functional add-to-cart button |
| 13 | HorizontalSlider scroll-snap + IntersectionObserver + reduce-motion | PASS | `grep -c IntersectionObserver HorizontalSlider.astro` = 2 (one in script + one in the threshold check) — script contains the observer, reduce-motion branch short-circuits |
| 14 | Rewritten schema, old fields removed | PASS | `grep -c practicalInfo src/content.config.ts` = 0; new schema contains heroVideo, cinematicReveal, intro, artworks, artistQuote, videos, shop |
| 15 | Rewritten JSON id-keyed | PASS | Top-level key `"kerry-james-marshall"` present |
| 16 | OnsiteExhibitionGrid renders `<a>` only for KJM | PASS | `grep -c '<a ' OnsiteExhibitionGrid.astro` ≥ 1; conditional on `item.id === 'kerry-james-marshall'` |
| 17 | Every src/href is base-prefixed | PASS | `grep -oE 'src="/[^"]*"' dist/onsite/kerry-james-marshall/index.html \| grep -v '/Kunsthaus/'` returns 0 lines |
| 18 | `npm run build` succeeds, 3 pages | PASS | `/index.html`, `/onsite/index.html`, `/onsite/kerry-james-marshall/index.html` all generated in 6.18s |
| 19 | Visual spot check | PARTIAL | Not performed — headless environment. Flagged below. |
| 20 | Prefers-reduced-motion paths wired | PASS | KjmHero script pauses video; HorizontalSlider script short-circuits observer; CSS `@media (prefers-reduced-motion: reduce)` rule neutralises track child transform/opacity |

## Deviations from Plan

None. The plan executed exactly as written. All files listed in the Files → Created/Modified tables were created/modified; no new files were introduced; no tasks were re-ordered, skipped, or split.

## Authentication Gates

None.

## Build / Type Check

`npm run build` succeeds end-to-end:
- Content sync OK (new onsiteExhibition schema validates)
- Types generated in ~1.2s
- 3 pages built: `dist/index.html`, `dist/onsite/index.html`, `dist/onsite/kerry-james-marshall/index.html`
- Total: ~6.2s

Only pre-existing warnings (unrelated texture path resolution) — no new errors or warnings introduced.

## Needs human verification

1. **Hero video playback** — that the MP4 file plays back without jank and the poster image shows while loading, on both desktop and iOS Safari.
2. **Cinematic reveal `imagePosition: 'left'`** — that the pre-expansion frame actually sits at the left edge on desktop ≥768px, and that GSAP's timeline re-centers the frame full-bleed as expected (CSS rule only applies to the starting state; inline GSAP styles take over during the scroll timeline).
3. **Artwork slider horizontal scroll inside vertical pin** — that a horizontal swipe on mobile scrolls the slider rather than the document, given the slider is nested in a SectionWrapper that pins on vertical scroll.
4. **HorizontalSlider peek-scale timing** — that the IntersectionObserver writes to `--card-scale`/`--card-opacity` smoothly during scroll, with no visible jank.
5. **View Transitions navigation** — that clicking the KJM card on `/onsite` animates smoothly into the detail page and returning via the "← Your visit" link reverses the transition, on both desktop and mobile.
6. **Prefers-reduced-motion** — emulate via devtools and confirm hero video pauses, cinematic reveal lands in final state, horizontal slider cards render at full scale/opacity.

## Known Stubs

- **Headphones button on each artwork slide** — deliberately silent. 03-04 will wire it to the paywall + audio guide overlay.
- **Add-to-cart button on shop cards** — visual stub, no handler. No cart system exists in the prototype.
- **Artwork image rotation** — entries 5-10 reuse the 4 real JPGs on disk (`de-style.jpg`, `better-homes.jpg`, `past-times.jpg`, `untitled-studio.jpg`) rather than displaying unique images per artwork. The JSON still lists 10 distinct artwork records with real titles/years/collections. True unique images are out of scope for 03-03.
- **Video testimonial thumbnails** — all three reuse `kjm-portrait.png`. True thumbnails are flagged in 03-CONTEXT as "to download during implementation" and are not a 03-03 blocker.
- **Shop item images** — all three reuse `kjm-portrait.png` for the same reason.

None of these stubs block the 03-03 deliverable; the page renders end-to-end, routes correctly, and the UX story is intact for the pitch.

## Self-Check: PASSED

- `src/pages/onsite/kerry-james-marshall.astro` exists.
- `src/components/hero/KjmHero.astro` exists (commit `dbf2faf`).
- `src/components/sections/ArtworkSlider.astro` exists (commit `a36037b`).
- `src/components/sections/ArtistQuote.astro` exists (commit `7aac754`).
- `src/components/sections/HorizontalSlider.astro` exists (commit `4157c28`).
- `src/content/onsite/kerry-james-marshall.json` rewritten (commit `0b908e8`).
- `src/content.config.ts` rewritten (commit `0b908e8`).
- `src/components/sections/OnsiteExhibitionGrid.astro` modified (commit `eef0335`).
- `src/components/sections/CinematicReveal.astro` modified (commit `dbf2faf`).
- `npm run build` succeeds; `dist/onsite/kerry-james-marshall/index.html` exists.
- All grep gates pass: `data-mode="onsite"` = 1, `autoplay` = 1, unprefixed `src="/...` = 0, `practicalInfo` = 0, `"kerry-james-marshall"` ≥ 1, `dispatchEvent|audioGuide|__audioGuideOverlay` in ArtworkSlider = 0, `<a ` in OnsiteExhibitionGrid ≥ 1, `IntersectionObserver` in HorizontalSlider ≥ 1.
- All 8 task commits reachable from HEAD: `0b908e8`, `dbf2faf`, `a36037b`, `7aac754`, `4157c28`, `78be094`, `eef0335`, `e00c134`.
