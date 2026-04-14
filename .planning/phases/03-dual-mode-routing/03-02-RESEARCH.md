# Phase 03 Plan 02: On-site Landing Page — Research

**Researched:** 2026-04-14
**Domain:** Astro page composition, content schema extension, accordion UI, building-grouped grid layout
**Confidence:** HIGH (scope is well-defined by 03-CONTEXT; all dependencies exist on disk)

## Summary

Plan 03-02 is a **composition + content plan**, not a framework plan. All routing, View Transitions, base-path handling, and dark-palette cascade infrastructure landed in 03-01. What 03-02 builds is the actual `/onsite` page: six new Astro components, a new `onsite/home.json` content file, two small additions to `exhibitions.json` (Marisol location + 5 events dated 2026-04-22), and a Zod schema for the new onsite-home collection.

Two of the six components (`TodaysEventsAccordion`, `FAQAccordion`) are forks of the existing `StatusAccordion` pattern at `src/components/ui/StatusAccordion.astro`. The `OnsiteExhibitionGrid` has no direct predecessor — it's a new responsive 2/3/4-column grouped grid built from JSON, not a fork of `ExhibitionList` (which is a list/hover-thumbnail layout, wrong shape for this). `CinematicReveal` and `SectionWrapper` are reused verbatim. `OnsiteHero` is a brand-new static block (no animation, unlike `HeroCarousel`).

**Primary recommendation:** Ship as **one plan with ~7 tasks** in this order: (1) content + schema, (2) OnsiteHero, (3) OnsiteExhibitionGrid, (4) TodaysEventsAccordion, (5) InfoBox + MuseumNavigatorTeaser, (6) FAQAccordion, (7) compose `/onsite/index.astro`, replacing the stub. Split is not warranted — the pieces are small, interlocking, and all read from one new JSON file.

## User Constraints (from 03-CONTEXT.md)

### Locked Decisions (direct quotes)
- **Section stacking:** Same as Planning home — `/onsite` uses `SectionWrapper.astro` (pin + scale on scroll). Dark-mode overrides for bg-step 1–4 already exist.
- **OnsiteHero:** Static, right-aligned "AT THE MUSEUM" title using `--type-4xl`, structural grid-line background via CSS `repeating-linear-gradient` (`rgba(255,255,255,0.08)` on dark). **No animations.**
- **OnsiteExhibitionGrid breakpoints:** Mobile <768px = 2 cols · Tablet 768–1023 = 3 cols · Desktop ≥1024 = 4 cols. Grouped by **building** (Chipperfield = 3 exhibits, Moser = 2 incl. Marisol).
- **TodaysEventsAccordion:** Forked from StatusAccordion. Dynamic 4-state headline (next / now / ended / none) based on current time vs `events[].time`.
- **InfoBox:** Outlined card containing **Wifi info + TodaysEventsAccordion** (not hours — hours live in the footer).
- **Museum Navigator Teaser:** Dark-mode teaser block with external "Interactive Visitor Guide" link. It's a teaser, not a real navigator.
- **Dark-mode aware:** Every new component must work under the `html[data-mode="onsite"]` cascade without hardcoded colors.
- **All new content loaded from JSON**, no hardcoded strings.
- **Respects prefers-reduced-motion:** No stacking, no accordion GSAP animation expansion when set.

### Claude's Discretion
- Exact section order on `/onsite` (likely: Hero → CinematicReveal → Chipperfield grid → Moser grid → MuseumNavigatorTeaser → InfoBox → FAQ)
- Whether Chipperfield and Moser are two `SectionWrapper`s or one section containing both groups (**recommendation: two wrappers** — one per building gives cleaner pin/scale moments and matches the "building-grouped" concept)
- "Today" filter strategy: build-time vs client-side runtime
- Exact FAQ data shape (only 3 placeholder Q&As provided)
- Wifi info box microcopy
- Museum Navigator Teaser visual treatment (preview map thumbnail? icon? plain text block?)

### Deferred / OUT OF SCOPE (belong to other plans)
- KJM detail page, `/onsite/kerry-james-marshall`, any `KjmHero`, `ArtworkSlider`, `ArtistQuote`, `HorizontalSlider`, video testimonials, shop (**03-03**)
- `AudioGuideOverlay`, `PaywallOverlay`, `ProfileOverlay`, `NavProfileButton`, `simulateLogin` (**03-04**)
- Clicking into an exhibition from the OnsiteExhibitionGrid — only the KJM card links (to a route that 03-03 creates). In 03-02, the KJM card renders as a link placeholder (`<a href="{base}/onsite/kerry-james-marshall">`) that 404s until 03-03 ships. Other cards are non-clickable.
- SplitText animations on hero title (deferred ANIM-02)
- QR deep-link (NAV-04), geolocation (NAV-05)

## Phase Requirements

| ID | Description | Which plan |
|----|-------------|------------|
| NAV-02 | Dual-mode toggle visible in navigation | **03-01** (already done) |
| NAV-03 | Mode-aware navigation with content/links that change per mode | **03-02 completes this** — the on-site landing is the mode-aware content that NAV-03 refers to. 03-04 extends it with login-aware nav items. |

03-02 **completes NAV-03** as far as the on-site landing is concerned. The KJM detail page (03-03) and profile/login nav (03-04) are further NAV-03 scope.

## Scope Recap

**03-02 builds:** The full `/onsite` landing page replacing the current stub at `src/pages/onsite/index.astro`. Six new components, one new JSON content file, one Zod schema addition, two small patches to `exhibitions.json`.

**03-02 does NOT build:** Any routing, View Transitions, mode toggle logic, base-path handling, KJM detail page, audio guide, paywall, login, profile, any slider component, or the hero carousel.

## Existing Assets to Reuse (file paths)

| Asset | Path | How 03-02 uses it |
|---|---|---|
| `BaseLayout` (mode-aware) | `src/layouts/BaseLayout.astro` | Page imports with `mode="onsite"` (pattern identical to stub) |
| `SectionWrapper` | `src/components/sections/SectionWrapper.astro` | Wraps each building grid + FAQ + InfoBox — gives pin/scale/bg-step styling |
| `CinematicReveal` | `src/components/sections/CinematicReveal.astro` | Reuse verbatim for the onsite home cinematic reveal (image: `/images/onsite/chipperfield-entrance.jpg`, already on disk at `public/images/onsite/chipperfield-entrance.jpg`). Content per CONTEXT "Welcome to the Kunsthaus Zurich…" — likely already drafted in `planning/homepage.json` from a prior session per CONTEXT line 214. **Verify** — if not, plan adds it to the new `onsite/home.json`. |
| `StatusAccordion` (pattern source) | `src/components/ui/StatusAccordion.astro` | **Fork pattern** for both TodaysEventsAccordion and FAQAccordion. Copy the GSAP height-animate expand/collapse, the arrow rotation, the `aria-expanded` + `aria-hidden` accessibility pattern. |
| `StickyCTA`, `Footer` | `src/components/ui/StickyCTA.astro`, `src/components/footer/Footer.astro` | Already rendered in stub — keep as-is in final page. |
| UI strings loader helper | `src/pages/onsite/index.astro` lines 11–15 | `getString(key)` pattern — continue using it |
| exhibitions.json | `src/content/planning/exhibitions.json` | Source of truth for `currentExhibitions` (4 entries with `location.building`/`location.floor`) + `upcomingExhibitions.marisol` (needs location added) + `events` (needs 5 entries dated 2026-04-22 added) |
| Content config | `src/content.config.ts` | Add new `onsiteHome` collection entry |
| Dark palette semantic tokens | `src/styles/tokens/semantic.css` | `html[data-mode="onsite"]` flips `--color-surface` → softblack, `--color-text` → offwhite. All new components use semantic tokens only. |
| Section CSS | `src/styles/components/sections.css` | Existing bg-step 1–4 dark overrides work for new SectionWrappers |
| View Transitions hook | `astro:page-load` event | All new stateful scripts (accordions) must listen to `astro:page-load` (NOT `DOMContentLoaded`) so they re-init after navigation — `StatusAccordion` currently uses `DOMContentLoaded` only, which is a **known pitfall** (see below). |
| Base-path helper | `import.meta.env.BASE_URL` | Every image path, every link must go through `${base}${path}`. Pattern shown in `ExhibitionCard.astro:15`, `CinematicReveal.astro:20`. |
| Lenis on window | `window.__lenis` | Only matters if 03-02 needs overlay scroll lock — it doesn't (no overlays in this plan). |

## New Assets to Create

### New components (all under `src/components/`)
| File | Purpose | Notes |
|---|---|---|
| `hero/OnsiteHero.astro` | Static dark hero, grid-line bg, right-aligned "AT THE MUSEUM" | No JS. Pure CSS + one `<section>`. |
| `sections/OnsiteExhibitionGrid.astro` | Responsive 2/3/4-col grouped grid | Props: `{ buildingName: string; floorLabel?: string; items: Exhibition[]; lang }`. Renders one building group. Called twice on the page (Chipperfield + Moser). |
| `sections/MuseumNavigatorTeaser.astro` | Teaser block with external "Interactive Visitor Guide" link | Static content from JSON. No JS. |
| `sections/InfoBox.astro` | Outlined card containing Wifi info + `<TodaysEventsAccordion>` slot | Reusable outline pattern; dark-mode aware via semantic tokens. |
| `ui/TodaysEventsAccordion.astro` | Forked StatusAccordion variant | See Component Research below. |
| `ui/FAQAccordion.astro` | Generic Q&A accordion | Forked StatusAccordion pattern — takes `items: Array<{ q: localizedText; a: localizedText }>`. |

### New content
| File | Purpose |
|---|---|
| `src/content/onsite/home.json` | Onsite landing content: hero title, cinematic-reveal data (if not already in `homepage.json`), Chipperfield + Moser building labels, MuseumNavigatorTeaser copy + external link, InfoBox wifi copy, FAQ items |

### Schema additions in `src/content.config.ts`
- New `onsiteHome` collection (single-file loader on `src/content/onsite/home.json`)
- Schema fields (recommendation): `{ hero: { title: localizedText }, cinematicReveal?: { tagline, cardTitle, description, image }, buildings: Array<{ id, name: localizedText }>, navigatorTeaser: { title, body, linkLabel, linkHref }, infoBox: { wifiSsid, wifiPassword, wifiNote?: localizedText }, faq: Array<{ id, question: localizedText, answer: localizedText }> }`

### Patches to `exhibitions.json`
1. Add `location: { "building": "Moser Building", "floor": "1st Floor" }` to `upcomingExhibitions.marisol` — currently missing (verified at lines 116–122 of exhibitions.json).
2. Add **5 events** with `date: "2026-04-22"` to the `events` array so "today's events" has content when the prototype is demoed on 2026-04-22. CONTEXT line 135 mandates this. Use existing event shape (`id, title: localizedText, date, dateLabel: localizedText, time: "HH:MM–HH:MM", type: localizedText, places, tags, image`).

## Per-Component Research Findings

### OnsiteHero
**Concept:** Static dark hero matching the Planning home's "KUNST/HAUS/ZURICH" geometric slot but right-aligned and reading "AT THE MUSEUM". Background is NOT an image — it's a `repeating-linear-gradient` vertical line pattern (`rgba(255,255,255,0.08) 0 1px, transparent 1px X`).

**Reuse:** Nothing from `HeroCarousel.astro` — that's 539 lines of GSAP-driven slide carousel. OnsiteHero is intentionally static.

**Implementation notes:**
- Use `--type-4xl` and existing type scale (same as Planning hero title)
- Full-viewport-height section (`min-height: 100svh`), aligns text to right edge with grid gutters
- No JS, no GSAP, no SplitText
- Respects dark cascade because it uses `var(--color-text)` not hardcoded colors

**Does NOT differ from Planning hero via video** — per CONTEXT, video hero is KJM (03-03), not onsite landing.

### OnsiteExhibitionGrid
**Concept:** Grouped grid of exhibition thumbnails by building. Mobile 2-col, tablet 3-col, desktop 4-col via CSS Grid `grid-template-columns: repeat(N, 1fr)` and media queries.

**No direct precedent:** `ExhibitionList.astro` is a list with hover-thumbnail reveal — wrong shape. `ExhibitionCard.astro` (134 lines) is image-over-text card built for `PinnedNarrative`, could be **re-styled but not reused wholesale** — its sizing (`flex: 0 0 60vh`) is for a different layout. Recommendation: write a new card markup inline in `OnsiteExhibitionGrid` that's simpler — image + title + floor label.

**Data source:** Filter `exhibitions.json → currentExhibitions + upcomingExhibitions (Marisol)` by `location.building === "Chipperfield Building"` for the first group, `"Moser Building"` for the second. Do this filter at page level in `src/pages/onsite/index.astro`, pass grouped arrays as props.

**Scroll/animation treatment:** None in 03-02. The group section is wrapped by `SectionWrapper` which already provides pin + scale + bg-step from Phase 02. Per-card reveals are **deferred** (ANIM-01 is not in 03-02 scope).

**KJM card links:** Only the `kerry-james-marshall` card renders as `<a href="${base}/onsite/kerry-james-marshall">`. Other cards are `<div>`. The KJM link will 404 until 03-03 ships — that's acceptable per the sub-plan sequence; 03-02 is shippable with KJM card either non-clickable OR linking to a 404 (recommendation: make it non-clickable in 03-02 and let 03-03 flip it to a link when the target exists — simpler and avoids a broken demo).

### MuseumNavigatorTeaser
**Concept:** A dark block that *previews* an Interactive Visitor Guide with an external link out. This is a **teaser**, not a real navigator. The real navigator is not in the prototype scope at all.

**Simplest viable treatment:** Static `<section>` containing a short title, one descriptive paragraph, a CTA button linking externally (per CONTEXT "external Interactive Visitor Guide link"). Optionally a background image or decorative SVG. No interaction, no map, no JS.

**Content shape in JSON:** `{ title: localizedText, body: localizedText, linkLabel: localizedText, linkHref: string }`.

### InfoBox
**Concept:** Outlined card (border via `color-mix(in srgb, var(--color-text) 20%, transparent)` to match StatusAccordion's border style) containing:
1. Wifi info (SSID + password in mono, short instructional sentence)
2. `<TodaysEventsAccordion />`

Hours are **not** here — they live in the footer and in the navbar's existing StatusAccordion usage (per Phase 02).

**This is NOT the same as Phase 02 visitor info StatusAccordion usage.** It's a new outlined card that *contains* the accordion, not the accordion itself.

### TodaysEventsAccordion
**Base:** Fork of `src/components/ui/StatusAccordion.astro` (269 lines). Copy: the container + trigger + panel + GSAP height-animate (lines 225–263), the dark-mode overrides (lines 159–172), the aria pattern.

**Changes from StatusAccordion:**
- **Data:** Events for today, not schedule days. Filter on mount: `events.filter(e => e.date === new Date().toISOString().split('T')[0])` (per CONTEXT line 132).
- **Trigger text (dynamic 4 states):** Compute from filtered events:
  1. **Before any event** (now < first event start): `Next at {HH:MM} — {title}`
  2. **During an event** (one event's time range contains now): `Now: {title}`
  3. **All events ended** (all events end time < now): `Today's program has ended`
  4. **No events today** (empty filter): `No events today`
- **Panel content:** Rendered list of `{time} — {title} · {type}`, not day/hours rows.
- **Dot color:** Green when there's a "now" or "next", dim/grey for ended/empty states.

**Time parsing gotcha:** Events store `time: "10:30–12:00"` (en-dash character, not hyphen). Split on `–`. Parse both ends to minutes-since-midnight.

**Today-computation strategy (RECOMMENDED):** Compute the date on the **client**, not at build time. Build-time filtering would bake 2026-04-14 (today) into the HTML and the demo on 2026-04-22 would show an empty list. Running on the client after `astro:page-load` makes the prototype "live" whenever demoed. Pass the **full events array** into the component via `data-events` attribute (JSON-stringified) and filter in the init script — exactly the pattern StatusAccordion uses with `data-schedule` at line 26.

**Rendering fallback:** SSR the list as "today's events" against the event data for the expected demo date (2026-04-22) so no-JS users still see something meaningful. Script then replaces/re-filters on load. *Or* simpler: SSR an empty panel with a "loading" placeholder and populate on client. Decide in plan — recommendation is SSR against build-time's today, let client overwrite.

### FAQAccordion
**Base:** Same StatusAccordion fork pattern, but each **row is itself an accordion item**. Unlike StatusAccordion (one trigger, one panel), FAQAccordion renders N triggers + N panels.

**Data shape:** `items: Array<{ id: string; question: localizedText; answer: localizedText }>` from JSON.

**Accessibility:**
- Each question is a `<button aria-expanded>` with a unique `aria-controls` pointing at its answer panel's `id`.
- Panel has `role="region"` + `aria-labelledby` pointing back at the trigger.
- Keyboard: native button semantics handle Enter/Space. Up/Down arrow navigation between questions is nice-to-have, not required.
- Only one open at a time is a UX choice — recommendation is **allow multiple open** (simpler, more forgiving on mobile).

**CONTEXT provides 3 placeholder FAQ entries** (coats/bags, food/drink, photography) — use them as seed content.

## Inherited Constraints from 03-01

All of these MUST be honored by every new component:

### 1. Base path is `/Kunsthaus` — always use `import.meta.env.BASE_URL`
- Every `<img src>` must prefix with `${base}` (`ExhibitionCard.astro:15`, `CinematicReveal.astro:20`)
- Every `<a href>` to an internal route must prefix with `${base}`
- Client-side pathname checks must strip base first (`HamburgerOverlay.astro` and `FooterColumns.astro` after commit `c1f9cb5`)
- **Pitfall:** A bare `<a href="/onsite/kerry-james-marshall">` will 404 on GitHub Pages. Must be `<a href={`${base}/onsite/kerry-james-marshall`}>`.

### 2. View Transitions → use `astro:page-load`, NOT `DOMContentLoaded`
- `<ClientRouter />` is active in `BaseLayout.astro` — navigations are SPA-like, `DOMContentLoaded` only fires on full page loads.
- **StatusAccordion at line 268 listens only to `DOMContentLoaded`** — if the user navigates from `/` to `/onsite` via View Transitions and the onsite page contains a StatusAccordion (it doesn't today, but the nav/footer do), it won't re-init. TodaysEventsAccordion and FAQAccordion must **listen to BOTH** (`DOMContentLoaded` for first load, `astro:page-load` for subsequent nav). Pattern: `function init(){…}; document.addEventListener('DOMContentLoaded', init); document.addEventListener('astro:page-load', init);` and inside `init()`, kill/skip already-initialized elements (use a `data-initialized` flag) to avoid double-binding.
- This is a **known correctness issue to carry forward** from the existing StatusAccordion — the 03-02 forks must fix it in their forks. Consider a small deviation fix to StatusAccordion itself in 03-02 (add `astro:page-load` listener) — optional, but the nav's StatusAccordion would be broken on navigations otherwise.

### 3. `data-mode="onsite"` cascade
- Already set by `BaseLayout` when the page imports with `mode="onsite"` (03-01 Task 1).
- Semantic tokens flip: `--color-surface` → softblack (`#272523`), `--color-text` → offwhite, `--color-bg` likewise (see `src/styles/tokens/semantic.css` lines 5–15).
- **Pitfall:** Hardcoding `background: white` or `color: #272523` breaks the dark cascade. Every new component uses `var(--color-surface)`, `var(--color-text)`, `var(--color-bg)`, or `color-mix()` on them.
- `OnsiteHero`'s grid-line color `rgba(255,255,255,0.08)` is explicitly spec'd against the dark bg and is acceptable as a hardcoded value *because* OnsiteHero only renders on `/onsite` under the dark cascade.

### 4. Reduce-motion CSS override in `base.css` kills all transitions/animations
- Any GSAP animation must be gated: `const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduce-motion');` (pattern at `SectionWrapper.astro:54`)
- For the accordions: when reduce-motion is on, snap `panel.style.height = 'auto'` / `'0'` instantly instead of GSAP-tweening. Same pattern StatusAccordion should use (but currently doesn't — minor accessibility gap).

### 5. `window.__lenis` is exposed
- 03-02 doesn't need it (no overlays), but don't break it.

### 6. Built-in footer/nav StatusAccordion still works
- No changes to `StatusAccordion.astro` required for 03-02 functionality; optional improvement noted above.

## Content Data Already Drafted (from 03-CONTEXT)

- **Cinematic reveal onsite:** image `/images/onsite/chipperfield-entrance.jpg` (on disk, 872 KB), title "Welcome to the Kunsthaus Zurich. It's nice to have you here.", card title "Open space for living art", full description C2 text block. **CONTEXT line 212 says this was "created in earlier session"** — planner must **grep `planning/homepage.json` and confirm** whether this exists there, or needs to be added to the new `onsite/home.json`. Either way content exists, location is the only question.
- **FAQ seed (3 items):** coats/bags, food/drink, photography (CONTEXT lines 246–248)
- **OnsiteHero title:** "AT THE MUSEUM"

Everything else (MuseumNavigatorTeaser copy, InfoBox wifi info, exact TodaysEventsAccordion rendering, 5 events for 2026-04-22) needs to be written during implementation and placed in the new JSON.

## Recommended Plan Shape

**One plan with 7 tasks.** Split is not warranted — all pieces are small and share one content file. Estimated total: 3–4 hours.

| # | Task | Files | Why this order |
|---|---|---|---|
| 1 | **Content + schema groundwork** — create `src/content/onsite/home.json` with hero, navigator teaser, info box, FAQ seed; add `onsiteHome` collection to `src/content.config.ts`; patch `exhibitions.json` (Marisol location + 5 events for 2026-04-22); confirm cinematic-reveal data location | `src/content/onsite/home.json` (new), `src/content.config.ts`, `src/content/planning/exhibitions.json` | Everything downstream imports this; doing it first means no backtracking |
| 2 | **OnsiteHero** — static hero, grid-line bg, right-aligned title | `src/components/hero/OnsiteHero.astro` (new) | Leaf component, no deps beyond tokens |
| 3 | **OnsiteExhibitionGrid** — responsive grid, groups by building, props-driven | `src/components/sections/OnsiteExhibitionGrid.astro` (new) | Leaf, depends only on exhibitions.json shape |
| 4 | **TodaysEventsAccordion** — fork StatusAccordion pattern, 4-state headline, client-side today filter, `astro:page-load`-aware init | `src/components/ui/TodaysEventsAccordion.astro` (new) | Most complex single component |
| 5 | **FAQAccordion + MuseumNavigatorTeaser + InfoBox** — three small components, batch in one task | `src/components/ui/FAQAccordion.astro`, `src/components/sections/MuseumNavigatorTeaser.astro`, `src/components/sections/InfoBox.astro` (all new) | All leaf-level; FAQ shares the accordion pattern from Task 4; InfoBox composes TodaysEventsAccordion |
| 6 | **Compose `/onsite/index.astro`** — replace stub, wire hero + cinematic reveal + two building grids (via SectionWrapper) + navigator teaser + infobox + FAQ, keep Footer + StickyCTA | `src/pages/onsite/index.astro` (replace stub content, keep existing imports pattern) | Everything exists now — pure composition |
| 7 | **Integration verification** — `npm run build`, dev server, manual walkthrough: dark palette, base-path-correct links, View Transitions nav from `/`, accordion expand/collapse, reduce-motion path, console clean | none | Gate |

### Alternate split (only if time is very tight)
- **03-02a:** Tasks 1–3 (ships a visible on-site page with hero + exhibition grids — already demo-able)
- **03-02b:** Tasks 4–7 (adds info box, accordions, FAQ, navigator teaser)

Not recommended — adds ceremony for no real shipping value; the full plan is still under 4 hours.

## Open Questions for the Planner

1. **Cinematic reveal data location** — is it already in `planning/homepage.json` (per CONTEXT line 212 claim "created in earlier session"), or does it need to go into the new `onsite/home.json`? Planner should grep for `"chipperfield-entrance"` in content files in Task 1 and branch accordingly.
2. **KJM card link in 03-02** — leave it non-clickable (same as other cards) and let 03-03 flip it to a link when the target exists, OR ship it as a link that 404s until 03-03? **Research recommendation: non-clickable in 03-02**, since a broken demo is worse than a deferred link.
3. **Today filter strategy** — client-side runtime filter recommended (see TodaysEventsAccordion section). Confirmation needed because it differs from the "build-time static filter" instinct.
4. **Multi-open vs single-open FAQ** — recommend multi-open. Confirmation optional.
5. **Should the fix to StatusAccordion's `DOMContentLoaded`-only listener (add `astro:page-load`) be included in 03-02?** — Scope creep but low-cost and fixes a nav StatusAccordion correctness gap on View Transitions navigations. Planner call.
6. **MuseumNavigatorTeaser visual treatment** — plain text block? With decorative background image? Icon? Not specified beyond "dark-mode teaser block". Planner can decide during implementation or defer to human review.
7. **InfoBox wifi content** — what SSID/password to display? Placeholder content acceptable (e.g., `Kunsthaus-Guest` / no password). Same content category as FAQ placeholder.

## Anti-Patterns to Avoid

1. **Do not hardcode colors.** Every color through `var(--color-*)` or `color-mix()` on them. The dark cascade is the whole reason this page looks right.
2. **Do not use `DOMContentLoaded` alone for stateful scripts.** Add `astro:page-load` listener too, and guard against double-init with a `data-initialized` flag on the element.
3. **Do not hardcode `/onsite/...` or `/images/...` paths.** Always prefix with `${import.meta.env.BASE_URL.replace(/\/$/, '')}`. The GitHub Pages demo is at `/Kunsthaus/onsite`, not `/onsite`.
4. **Do not animate or GSAP-pin the OnsiteHero.** It's spec'd as static. Animation belongs to deferred ANIM-02.
5. **Do not reuse `ExhibitionList.astro` for the building grid.** Wrong shape (it's a list with hover-thumbnail). The grid is a fresh component.
6. **Do not build a real museum navigator.** It's a teaser only — static block with an external link.
7. **Do not filter events at build time for "today".** Use client-side filter so the prototype is live on any demo date.
8. **Do not forget to gate GSAP on reduce-motion.** Global CSS kills transitions, but GSAP timelines still run JS-side and can cause layout thrash / wasted work.
9. **Do not fork `HeroCarousel.astro`.** It's 539 lines of auto-playing slider machinery — OnsiteHero is 30 lines of static markup + CSS.
10. **Do not let the KJM card link to a non-existent route.** Wait for 03-03 to ship, then flip it to a link. In the interim, treat it like every other card.
11. **Do not forget to JSON-stringify event data for client-side filter.** StatusAccordion pattern at `data-schedule={JSON.stringify(schedule)}` on line 26 — same approach for `data-events`.
12. **Do not nest two `SectionWrapper`s inside one another** for the two building groups — each group is its own sibling SectionWrapper with its own `index`, `bgStep`, and `sectionId`.

## Sources

- `.planning/phases/03-dual-mode-routing/03-CONTEXT.md` — authoritative decisions for the whole phase (HIGH)
- `.planning/phases/03-dual-mode-routing/03-01-SUMMARY.md` — routing foundation state, inherited base-path + View Transitions patterns (HIGH)
- `.planning/ROADMAP.md` — Phase 03 success criteria #3, requirement IDs (HIGH)
- `.planning/REQUIREMENTS.md` — NAV-02, NAV-03 mapping (HIGH)
- `src/components/ui/StatusAccordion.astro` — fork source, 269 lines including GSAP expand/collapse + aria + dark-mode overrides (HIGH, direct read)
- `src/components/sections/CinematicReveal.astro` — reuse target, base-path pattern at line 20 (HIGH, direct read)
- `src/components/sections/SectionWrapper.astro` — reuse target, reduce-motion guard at line 54 (HIGH, direct read)
- `src/components/sections/ExhibitionList.astro` — confirmed NOT reusable for building grid (HIGH, direct read)
- `src/components/sections/ExhibitionCard.astro` — image/card pattern reference, base-path at line 15 (HIGH, direct read)
- `src/content/planning/exhibitions.json` — confirmed current 4 exhibitions have `location`, Marisol does not, events have ISO `date` + `time` "HH:MM–HH:MM" shape with en-dash (HIGH, direct read)
- `src/content.config.ts` — schema extension point, existing `localizedText` helper at lines 5–9 (HIGH, direct read)
- `src/pages/onsite/index.astro` — current stub, composition pattern to replace (HIGH, direct read)
- `src/pages/index.astro` — Planning home composition pattern to mirror (HIGH, direct read)
- `src/styles/tokens/semantic.css` — dark cascade tokens at lines 13–15 (HIGH, direct read)
- `public/images/onsite/chipperfield-entrance.jpg` — asset exists on disk (HIGH, direct ls)
- `CLAUDE.md` — Astro 6 + GSAP + Lenis + vanilla CSS tech stack (HIGH)

## Metadata

**Confidence breakdown:**
- Scope and deliverables: HIGH — CONTEXT.md is exhaustive
- Component reuse decisions: HIGH — all candidate files read directly
- Schema additions: HIGH — existing Zod patterns are clear
- Today-filter strategy: MEDIUM — judgment call, recommend client-side but planner may override
- StatusAccordion `astro:page-load` gap: HIGH — verified at line 268 of the file

**Research date:** 2026-04-14
**Valid until:** 2026-05-14 (or until `src/content.config.ts` / `StatusAccordion.astro` / `exhibitions.json` shape changes)

## RESEARCH COMPLETE
