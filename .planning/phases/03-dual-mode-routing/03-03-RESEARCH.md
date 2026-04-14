# Phase 03-03 Research — KJM Exhibition Detail Page

**Researched:** 2026-04-14
**Domain:** Astro 6 detail-page composition + HTML5 video hero + horizontal sliders
**Confidence:** HIGH (codebase patterns are well-established by 03-01/02)

## Goal recap

Roadmap SC #4: `/onsite/kerry-james-marshall` produces an exhibition detail page with **hero video, cinematic reveal, artwork slider, artist quote, video testimonials, and shop**. Routes from the KJM card on `/onsite` (currently a non-clickable `<div>`).

## Existing assets to reuse

| File | What it provides | Reuse as-is? |
|---|---|---|
| `src/components/sections/CinematicReveal.astro` | Sticky scroll-driven expanding image with tagline + content card; reads `data: { tagline, title, description, image }`; auto re-inits on `astro:after-swap`; reduce-motion path | YES — but page must adapt `cardTitle → title` (same shim as `/onsite/index.astro` does) and add an optional `imagePosition: 'left'` prop per 03-CONTEXT design constraint. That's a one-line CSS prop addition, not a rewrite. |
| `src/components/sections/SectionWrapper.astro` | Pin + scale stacking section pattern, dispatches `sectionchange` event, dark-mode bg-step variants | YES |
| `src/layouts/BaseLayout.astro` | `data-mode` prop, `<ClientRouter />`, footer/StickyCTA mounting | YES — pass `mode="onsite"` |
| `src/components/footer/Footer.astro` + `src/components/ui/StickyCTA.astro` | Footer + sticky CTA bar | YES — same composition pattern as `/onsite/index.astro` |
| `src/content.config.ts` | **Already has** an `onsiteExhibition` collection wired to `src/content/onsite/kerry-james-marshall.json` (Phase 1 schema) | Schema needs an extension — see Content/data shape below |
| `public/audio/Ballad for Classical Strings.mp3` | Demo audio (referenced from artwork data; not played in 03-03 — that's 03-04) | Reference path only |
| `public/images/exhibitions/kjm/kjm-portrait.png` | Cinematic-reveal image | YES |
| `src/components/sections/EssentialsCard.astro` | Card visual language reference (border, background tokens) | Pattern reference for new card components |

**No existing video hero component.** `HeroCarousel.astro` is image-based (no `<video>` element). `KjmHero.astro` from 03-CONTEXT must be created from scratch.

## New components to create

### `src/components/hero/KjmHero.astro` — Hero video
Single autoplaying muted looped HTML5 video with a poster image fallback, plus an overlay title block (exhibition title + dates). Roughly the same height/structure as `OnsiteHero.astro` (full viewport-ish dark hero) but the background is `<video>` instead of a CSS grid pattern. Title overlay uses the existing `--type-4xl` token + right-aligned layout to mirror the planning hero. No JS — autoplay attributes are sufficient.

### `src/components/sections/ArtworkSlider.astro` — One-per-viewport artwork slider
Per 03-CONTEXT decision (#10): "inline ArtworkSlider, one per viewport". Recommended approach: **CSS scroll-snap horizontal track** (`scroll-snap-type: x mandatory` + `scroll-snap-align: center` on each slide), with `<button>` prev/next controls that programmatically scroll using `scrollBy({ left: cardWidth, behavior: 'smooth' })`. Each slide renders artwork number, title, year, collection, credit, description, and a **headphones button** (placeholder click handler now — the actual paywall/audio-guide wiring is 03-04 scope, so the button just needs to dispatch a `kunsthaus:headphones` CustomEvent or call an optional `window.__audioGuideOverlay?.open(trackId)` if defined). Accessibility: `role="region"` + `aria-roledescription="carousel"`, slide buttons with `aria-label`, keyboard left/right arrow handlers on the track, focus-visible outlines on each slide. No GSAP needed for the base slider — keep it static and CSS-driven so the GSAP budget goes to ArtworkSlider's headphones interaction only.

### `src/components/sections/ArtistQuote.astro` — Typographic pull quote
Pure typography component. Large quote glyph + quote text + attribution. Reuse `var(--type-3xl)` (matches CinematicReveal title scale) for the quote, `var(--type-md)` + opacity 0.7 for attribution. Center-aligned, max-width ~70ch, generous vertical padding. Nothing scroll-driven. One-shot Astro component, no JS, no GSAP.

### `src/components/sections/HorizontalSlider.astro` — Reusable center-snap peek slider
Per 03-CONTEXT design constraint: center-snap via `scroll-snap-type: x mandatory`, peek cards at ~55% width and 50% opacity, IntersectionObserver maps intersection ratio → CSS custom properties (`--card-scale`, `--card-opacity`). **Used twice** on the KJM page: once for video testimonials, once for shop items. The component takes a `<slot />` plus optional `heading` and `variant` props; the page passes in `<HorizontalSlider><VideoTestimonialCard ... /></HorizontalSlider>` and `<HorizontalSlider><ShopCard ... /></HorizontalSlider>`. The two card types are visually distinct enough (video thumbnail + duration + quote vs. product image + price + add-to-cart) that they should be separate small inline components or simple inline markup inside the slider — **don't try to unify them**. The slider is the shared piece; the cards are not.

### Card sub-components (inline or small files)
- **VideoTestimonialCard:** thumbnail image, duration label, quote text, role label. Thumbnail-only — no actual video playback (per scope).
- **ShopCard:** product image, title, price, "add to cart" button (no real cart, just visual).

These can be inline markup in the page file OR tiny components in `src/components/sections/`. Recommendation: inline first, extract only if reused.

## Hero video pattern

Standard HTML5 background video — Astro adds nothing special here, just plain JSX:

```astro
<video
  class="kjm-hero__video"
  autoplay
  muted
  loop
  playsinline
  preload="metadata"
  poster={`${base}/images/exhibitions/kjm/kjm-hero-poster.jpg`}
>
  <source src={`${base}/videos/kjm-hero.mp4`} type="video/mp4" />
</video>
```

**Required attributes (all four, no exceptions):**
- `autoplay` — start without user interaction
- `muted` — **autoplay only works on mobile if muted** (iOS Safari + Chrome Android both enforce this). Without `muted` the video silently fails to start.
- `loop` — repeat seamlessly
- `playsinline` — **iOS Safari otherwise hijacks the video into fullscreen** the moment it tries to play. Critical.

**Other recommendations:**
- `preload="metadata"` (not `auto`) — don't blow the bandwidth budget for a hero video on slow connections.
- `poster` — show an image while the video loads; also acts as the still frame if the user has data-saver enabled or the video file is missing.
- CSS `object-fit: cover` + `width: 100%; height: 100%` to behave like a CSS background image.
- Add a dark gradient scrim overlay (`linear-gradient(rgba(0,0,0,0.4), transparent)`) above the video so the title text stays legible.

**View Transitions interaction:** Astro's `<ClientRouter />` swaps `<body>` content on navigation. The new `<video>` element on `/onsite/kerry-james-marshall` mounts fresh on each navigation, which is fine — autoplay still triggers because the navigation is a user-initiated click (browser counts the click as activation context). No special handling needed. **Do NOT add `transition:persist`** to the video — that would try to keep the same DOM node across pages and only confuses things.

**Reduce-motion path:** Detect `prefers-reduced-motion: reduce` and either pause the video (`videoEl.pause()`) or replace it with the poster image. Recommend pause-only — keeping the poster visible is enough. No GSAP, no Lenis interaction needed; the video is fully self-contained.

**Asset:** 03-CONTEXT lists "KJM hero video — needs investigation" as an asset to download. Fallback if not findable: a short looping interior shot, OR a high-quality still poster image with a subtle CSS Ken Burns animation as a degraded variant.

## Content/data shape

**Recommendation:** Use a dedicated content file at `src/content/onsite/kerry-james-marshall.json`. Reasons:

1. **It already exists in `content.config.ts`** — `onsiteExhibition` collection is wired to that exact path with a Phase 1 stub schema.
2. **The data volume is large** (10 artworks × ~6 fields, 3 video testimonials, 3 shop items, hero video path, intro copy, cinematic reveal data, artist quote) — putting it inside `exhibitions.json` would balloon that file.
3. **Mirrors `home.json`** — same `src/content/onsite/` directory, same single-file content collection pattern.

**Schema extension required.** The existing Phase-1 stub schema for `onsiteExhibition` has fields like `practicalInfo` and `audioGuideAvailable` that don't match what 03-CONTEXT specifies. Plan-time choice: rewrite the `onsiteExhibition` schema to match the 03-CONTEXT shape:

```ts
// src/content.config.ts (replace existing onsiteExhibition definition)
const onsiteExhibition = defineCollection({
  loader: file("src/content/onsite/kerry-james-marshall.json"),
  schema: z.object({
    id: z.string(),
    title: localizedText,
    dateLabel: localizedText,
    heroVideo: z.object({
      src: z.string(),
      poster: z.string(),
    }),
    cinematicReveal: z.object({
      tagline: localizedText,
      cardTitle: localizedText,
      description: localizedText,
      image: z.string(),
      imagePosition: z.enum(['left', 'center', 'right']).optional(),
    }),
    intro: z.object({
      heading: localizedText,
      body: localizedText,
    }),
    artworks: z.array(z.object({
      id: z.string(),
      number: z.number().int(),
      title: localizedText,
      year: z.string(),
      collection: z.string(),
      credit: z.string().optional(),
      image: z.string(),
      description: localizedText,
      audioSrc: z.string(),
    })),
    artistQuote: z.object({
      quote: localizedText,
      attribution: z.string(),
    }),
    videos: z.array(z.object({
      id: z.string(),
      thumbnail: z.string(),
      duration: z.string(),
      quote: localizedText,
      role: z.enum(['artist', 'audience', 'curator']),
    })),
    shop: z.array(z.object({
      id: z.string(),
      image: z.string(),
      title: localizedText,
      price: z.string(),
      addToCartLabel: localizedText,
    })),
  }),
});
```

Same caveat the 03-02 Plan summary captured (deviation #1): the JSON file must be wrapped as `{ "kerry-james-marshall": { id: "kerry-james-marshall", ... } }` because Astro's `file()` loader for single-JSON collections expects an id-keyed object map. The page file imports the JSON directly (`import kjmJson from '.../kerry-james-marshall.json'`) and reads `kjmJson['kerry-james-marshall']` — same pattern as `home.json`.

**Do NOT try to put the detail content inside `exhibitions.json > currentExhibitions[KJM].detailContent`** — it'd require Zod schema bloat that affects the planning page that already consumes that file. Keep the two concerns separated.

## Route structure and base-path rules

**Route file:** `src/pages/onsite/kerry-james-marshall.astro` (single file, not a directory). Renders cleanly under Astro's file-based routing alongside the existing `src/pages/onsite/index.astro`. No conflict.

**BaseLayout:** No changes required. `mode="onsite"` is already supported. The page composes: `<BaseLayout mode="onsite"> → <KjmHero> → <CinematicReveal> in stacking-section → <ArtworkSlider> → <ArtistQuote> → <HorizontalSlider> (videos) → <HorizontalSlider> (shop) → <Footer> → <StickyCTA>`.

**Base path (NON-NEGOTIABLE):** Every internal `href`, every image `src`, every video `src`, every poster `src` MUST be prefixed with `import.meta.env.BASE_URL`. Pattern used everywhere in the codebase:

```ts
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
// then: href={`${base}/onsite/kerry-james-marshall`} or src={`${base}${item.image}`}
```

This applies inside ArtworkSlider artwork images, HorizontalSlider thumbnails, hero video sources, the back-link `← Your visit` href that points at `/onsite`, and the cinematic-reveal image (already handled by the component itself — verify by inspection during planning).

## Layout decision: stacking sections vs flow

**Recommendation: stacking sections (same as `/onsite/index.astro`).**

Why — overruling my own initial instinct: 03-CONTEXT explicitly locked this in (Architectural Decisions → "Section stacking: same as Planning"; Session Log #20 — "overruled my flat-scroll recommendation"). The user wants UX consistency across `/`, `/onsite`, and `/onsite/kerry-james-marshall`. The dark-mode bg-step CSS already exists from 03-01/02 (no new CSS needed). Composition: each major section (Cinematic Reveal, Intro, ArtworkSlider, ArtistQuote, Videos, Shop) gets its own `<SectionWrapper index={N} bgStep={1..4} ...>`.

The hero is **not** a stacking section (consistent with `/onsite/index.astro` where `OnsiteHero` is not wrapped). It sits above the first stacking section.

Open nuance for the planner: the ArtworkSlider is "one per viewport" — meaning *one artwork at a time fills the viewport* horizontally. That's a horizontal scroller inside a stacking section. The two interaction models (vertical scroll-pin from SectionWrapper + horizontal scroll-snap inside the slider) shouldn't conflict because the slider's horizontal scroll is contained inside its own scroll container (`overflow-x: auto`), not the document-level scroll Lenis is managing. Worth a smoke test.

## KJM card click-through on `/onsite/index.astro`

`OnsiteExhibitionGrid.astro` currently renders every card as `<div class="onsite-grid__card">` inside an `<li>`. The minimal change to make ONLY the KJM card clickable while leaving the others as plain divs:

```astro
{items.map((item) => {
  const isClickable = item.id === 'kerry-james-marshall';
  const href = isClickable ? `${base}/onsite/${item.id}` : undefined;
  const Tag = (isClickable ? 'a' : 'div') as any;
  return (
    <li class="onsite-grid__item" data-id={item.id}>
      <Tag class="onsite-grid__card" {...(href ? { href } : {})}>
        ... (existing media + meta markup unchanged) ...
      </Tag>
    </li>
  );
})}
```

CSS additions: `.onsite-grid__card { color: inherit; text-decoration: none; }` so the `<a>` variant doesn't pick up default link styles, plus an optional hover state (`opacity: 0.85` on `a.onsite-grid__card:hover`). Keyboard focus ring should appear automatically because the `<a>` is focusable; add `:focus-visible` outline to match the rest of the site.

This is the only required edit to `/onsite/index.astro`'s subtree.

## Pitfalls and gotchas

1. **Autoplay without `muted` = silent failure.** The browser will not throw an error; the video just won't play. Lock `muted` and `playsinline` into the component template — don't make them props.
2. **Base path everywhere.** Phase 03-VERIFICATION already flagged this as a deploy blocker once. Every video src, poster, thumbnail, artwork image, headphones audio src must use `${base}${path}`.
3. **View Transitions + persistent audio.** The `<audio>` element for the audio guide is 03-04 scope, but if any hero video gets `transition:persist` it'll fight with the `<ClientRouter />` element-swap logic. Don't persist the video — let it remount on navigation.
4. **CinematicReveal `cardTitle` adapter.** 03-02 deviation #2 documented this: the CinematicReveal component reads `data.title`, not `data.cardTitle`. The page must build a `cinematicData` object remapping `cardTitle → title`. Same trap will catch 03-03 if not handled.
5. **Single-JSON collection wrapping.** `kerry-james-marshall.json` MUST be structured as `{ "kerry-james-marshall": { id: "kerry-james-marshall", ... } }`. A flat top-level object will fail schema validation (03-02 deviation #1 — same trap).
6. **Existing `onsiteExhibition` Phase-1 schema is incompatible** with 03-CONTEXT data shape. Rewriting it is mandatory (artworks no longer have `room`, `medium`, `audioGuide`; new fields like `heroVideo`, `cinematicReveal`, `videos`, `shop` need to be added). Plan task to update `content.config.ts` and verify build succeeds.
7. **Horizontal scroll inside vertical pin.** The ArtworkSlider's horizontal scroll-snap track sits inside a SectionWrapper that pins on vertical scroll. Test on mobile: the user's horizontal swipe gesture must scroll the slider, not the document. Should work because the slider is `overflow-x: auto` and the document is `overflow-y` — touch scroll directionality is handled by the browser. But verify.
8. **Scroll-snap performance with peek scaling.** The HorizontalSlider's IntersectionObserver fires often during scroll. Use `requestAnimationFrame` to debounce CSS variable writes if profiling shows jank.
9. **Headphones button click-through.** The headphones button on each artwork must NOT navigate (no anchor wrapping the whole slide). It's a `<button>` inside the slide. In 03-03 it dispatches a placeholder event or no-ops; 03-04 wires up the paywall + audio guide.
10. **Reduce-motion:** disable the cinematic reveal expansion (already handled by the component), pause the hero video, skip the HorizontalSlider scale animation (the IntersectionObserver path can short-circuit when `prefers-reduced-motion: reduce`), keep the static layout intact.

## Open questions for the planner

1. **Hero video asset** — does the user have an actual KJM hero video file, or do we ship the page with a Ken-Burns-animated poster as a placeholder? (03-CONTEXT calls this "needs investigation".) Plan should include both paths and a fallback.
2. **Headphones button behavior in 03-03** — silent no-op, console.log, or already dispatch `kunsthaus:headphones` and let 03-04 listen for it? Cleanest is to dispatch the event now so 03-04 only adds a listener; no rework needed.
3. **Intro section as its own SectionWrapper or merged with ArtworkSlider?** — 03-CONTEXT says "title + intro" comes after the cinematic reveal and before the artwork slider. It's a small block. Recommend its own SectionWrapper for stacking consistency, but the planner can collapse it into the ArtworkSlider section header if scope is tight.
4. **i18n hardcoding** — `lang = 'en' as const` is the current convention (`/onsite/index.astro` line 22). KJM page should follow the same. Confirm the user is OK with English-only for the prototype (German strings still live in JSON, just not displayed yet).
5. **Back link "← Your visit"** — where does it live? Top of the page, top of the hero, or as part of the navbar? 03-CONTEXT says it exists but doesn't pin a location. Recommend top-left of the hero, above the title, base-path-prefixed `<a href={\`${base}/onsite\`}>← Your visit</a>`.

---

## RESEARCH COMPLETE

**Phase:** 03-03 — KJM Exhibition Detail Page
**Confidence:** HIGH

### Key Findings
- The route `src/pages/onsite/kerry-james-marshall.astro` slots cleanly into existing patterns; no BaseLayout changes required.
- `content.config.ts` already declares an `onsiteExhibition` collection wired to `kerry-james-marshall.json` — but the **Phase 1 stub schema is incompatible** with the 03-CONTEXT data shape and must be rewritten.
- `CinematicReveal` is reusable as-is, with the same `cardTitle → title` page-level adapter that 03-02 already pioneered. The `imagePosition: 'left'` desktop variant requires a small CSS prop addition to the component.
- Hero video pattern is plain HTML5: `autoplay muted loop playsinline preload="metadata" poster=...`. Do not add `transition:persist` — let it remount on navigation.
- ArtworkSlider, ArtistQuote, and HorizontalSlider are all greenfield. Recommended approach: CSS scroll-snap (no GSAP) for both sliders; HorizontalSlider gets the IntersectionObserver-driven scale/opacity peek behavior already specified in 03-CONTEXT.
- KJM card click-through on `/onsite/index.astro` is a 5-line surgical edit to `OnsiteExhibitionGrid.astro` — render `<a>` only when `item.id === 'kerry-james-marshall'`, leave others as plain `<div>`.
- Stacking sections (not flow layout) — 03-CONTEXT locked this in; my flat-scroll instinct was already overruled.

### File Created
`/Users/merlinzuni/develop/Kunsthaus/.planning/phases/03-dual-mode-routing/03-03-RESEARCH.md`
