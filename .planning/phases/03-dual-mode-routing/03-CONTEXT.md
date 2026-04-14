# Phase 03 — Dual-Mode Routing

**Created:** 2026-04-14
**Authority:** Captures the full decision set from the planning conversation held 2026-04-13 → 2026-04-14 (see Session Log at the bottom for reference).

## Phase Goal

Transform the dual-mode concept from a CSS palette flip into a genuine routing experience. The user switches between **Planning mode** (`/`) and **On-site mode** (`/onsite`) via the existing mode toggle, which now navigates between two real pages using Astro View Transitions. From the on-site landing, a user can drill down into a single exhibition detail page (`/onsite/kerry-james-marshall`) that features an audio guide with a paywall and a simulated logged-in state.

This is the **competition differentiator** — the dual-mode story becomes tangible instead of purely chromatic.

## Scope

### In scope
- New Astro routes: `/onsite` and `/onsite/kerry-james-marshall`
- Astro View Transitions enabled across all pages
- URL-as-source-of-truth mode state (replaces localStorage)
- Full On-site landing page with hero, cinematic reveal, building-grouped exhibition thumbnails, museum navigator teaser, Wifi/events info box, FAQ accordion
- Full KJM exhibition detail page with hero video, cinematic reveal, title block, intro, artwork slider, artist quote, video testimonials slider, shop slider
- Audio guide fullscreen overlay with two internal views (Playlist + Detail Player) and bottom-sheet transitions
- Paywall overlay with Buy Tickets + Become a Member CTAs
- Login state simulation via localStorage with Profile overlay and NavProfileButton
- Reusable horizontal slider component (for videos + shop)
- Dark-mode aware colors on all new components (fully tokenized)

### Out of scope (deferred or abandoned)
- **NAV-04 (QR deep-link with `?mode=onsite&exhibit=xyz`)** — deferred; the mode is now the URL itself (`/onsite` vs `/`), so QR codes can point directly at the URL. Not implementing the query-param redirect layer.
- **NAV-05 (Geolocation prompt)** — deferred; not essential for the pitch.
- **ANIM-02 (SplitText heading reveals)** — deferred; page typography is already strong enough without animation.
- **ANIM-03 (Cursor/image tracking)** — deferred; not mobile-relevant and mobile is priority.
- **ANIM-04 (GSAP Flip mode transitions)** — REPLACED by Astro View Transitions API. Same visual effect, standard API, zero custom animation code.
- **ANIM-05 (Hidden discovery micro-interactions)** — deferred; delight scope.
- **Real authentication** — the login flow is entirely simulated via localStorage.
- **Real audio narration** — using placeholder classical music (`Ballad for Classical Strings.mp3`) as the demo audio file for all 10 KJM tracks.
- **Full YouTube video playback** — the video testimonials are thumbnail-only with simulated "duration" labels.

### Pragmatic concessions
- Exhibition detail pages are **onsite-mode-only** for v1. Planning mode exhibition rows stay non-clickable. A Planning-mode detail page variant is v2 scope.
- Artist portrait for the cinematic reveal is sourced from the KJM testimonial video thumbnail (user's own finding) rather than a generic portrait.
- 3 Chipperfield + 2 Moser exhibitions (reality, not forced 4+4 symmetry).

## Architectural Decisions

### Routing: Plan A (Astro routes + View Transitions)
- Two real Astro pages: `src/pages/index.astro` and `src/pages/onsite/index.astro`, plus detail: `src/pages/onsite/kerry-james-marshall.astro`
- Astro `<ClientRouter />` imported in `BaseLayout.astro` to enable View Transitions globally
- Each page declares its own `data-mode` attribute on the `<html>` element via the layout prop, not JS
- `html[data-mode="planning"]` on `/`, `html[data-mode="onsite"]` on `/onsite*`
- Planning-mode exhibition rows stay non-clickable; onsite-mode Chipperfield grid's KJM card links to `/onsite/kerry-james-marshall`

### Mode toggle: URL-as-state
- All four writers (StickyCTA, HamburgerOverlay, FooterColumns, ModeToggle) become route-aware `<a href>` links instead of `<button>` + JS handler
- Active segment state derived from `location.pathname`: starts with `/onsite` → onsite segment active; else planning segment active
- localStorage mode persistence **removed** — URL is the single source of truth
- All four writers update in sync because all four read the same URL; no state synchronization needed
- Back button navigates naturally between modes without custom history stack management

### Section stacking: same as Planning
- Both `/onsite` and `/onsite/kerry-james-marshall` use the existing `SectionWrapper.astro` stacking effect (pin + scale on scroll)
- Consistent UX across all pages — overrules my earlier recommendation of flat scroll
- Dark-mode overrides already exist for bg-step 1-4 (added in the current session), so onsite sections render correctly without new CSS

### Audio guide: fullscreen overlay with bottom-sheet detail player
- Mounted via BaseLayout so all pages can trigger it via `window.__audioGuideOverlay?.open(trackId)`
- Two internal views: `Playlist` (base layer) + `DetailPlayer` (slide-up sheet on top of playlist)
- Detail player is always mounted; shown/hidden via GSAP `translateY` (`0%` visible → `100%` hidden below viewport)
- Tapping the top chevron-down area slides the detail player back down, revealing the playlist underneath
- Audio `<audio>` element is persistent across view transitions — playback continues when user toggles between playlist and detail
- Closing the overlay entirely (via "Close audio guide" button) stops audio and unmounts track state

### Paywall: gates the audio guide
- Triggered when `window.__demoUser` is absent/null and user taps headphones on an artwork
- Dismissible (× and backdrop click)
- "Buy Tickets" and "Become a Member" CTAs both call the same `simulateLogin()` function
- `simulateLogin()` sets `localStorage.kunsthaus-demo-user = "purchased"`, closes the paywall, dispatches a `kunsthaus:login` custom event
- Once dispatched, the NavProfileButton fades in and the HamburgerOverlay "Log in" item becomes "My Account"
- Audio does **not** auto-play after login sim — user taps play again manually (per UX decision Q16a)

### Profile overlay: logged-in state panel
- Opens from navbar profile button or hamburger "My Account" item
- Same glass backdrop + header pattern as other overlays
- Content: QR ticket hero (Day Pass, valid 22 April 2026, access list) + 6 secondary nav items + log out button + optional upsell card

## Component Inventory

### New components
| File | Purpose |
|---|---|
| `src/pages/onsite/index.astro` | On-site landing page route |
| `src/pages/onsite/kerry-james-marshall.astro` | KJM exhibition detail page route |
| `src/components/hero/OnsiteHero.astro` | Static dark hero with grid-line background, "AT THE MUSEUM" title |
| `src/components/hero/KjmHero.astro` | Hero video component for exhibition detail pages, autoplay muted loop |
| `src/components/sections/OnsiteExhibitionGrid.astro` | Responsive 2/3/4-col thumbnail grid filtered by building with floor metadata |
| `src/components/sections/ArtworkSlider.astro` | One-per-viewport artwork slider with prev/next, headphones button |
| `src/components/sections/ArtistQuote.astro` | Typographic quote block |
| `src/components/sections/HorizontalSlider.astro` | Reusable center-snap slider with peek-scale-opacity mechanic |
| `src/components/sections/MuseumNavigatorTeaser.astro` | Dark-mode teaser block with external "Interactive Visitor Guide" link |
| `src/components/sections/InfoBox.astro` | Outlined card containing Wifi info + TodaysEventsAccordion |
| `src/components/ui/TodaysEventsAccordion.astro` | Forked from StatusAccordion; shows today's events with dynamic headline |
| `src/components/ui/FAQAccordion.astro` | Helpful Information Q&A accordion |
| `src/components/nav/NavProfileButton.astro` | Navbar profile icon, conditionally rendered when logged in |
| `src/components/nav/AudioGuideOverlay.astro` | Fullscreen audio guide overlay with Playlist + DetailPlayer views |
| `src/components/nav/PaywallOverlay.astro` | Dismissible paywall modal |
| `src/components/nav/ProfileOverlay.astro` | Logged-in profile panel with QR ticket + nav items |

### Extensions to existing components
| File | Change |
|---|---|
| `src/layouts/BaseLayout.astro` | Enable Astro View Transitions via `<ClientRouter />`; add `data-mode` prop; conditionally render NavProfileButton, AudioGuideOverlay, PaywallOverlay, ProfileOverlay |
| `src/components/ui/StickyCTA.astro` | Mode segments become `<a href>` links; read pathname for active state; remove localStorage logic |
| `src/components/nav/HamburgerOverlay.astro` | Mode toggle becomes navigation; "Log in" item triggers simulateLogin(); when logged in, "Log in" is replaced with "My Account" linking to ProfileOverlay |
| `src/components/footer/FooterColumns.astro` | Mode toggle becomes `<a href>` navigation; removes JS handler |
| `src/components/ui/ModeToggle.tsx` | Convert to route-aware active state; navigate via `<a href>` or `window.location` |
| `src/components/nav/NavBar.astro` | Conditionally render NavProfileButton to the left of the hamburger when `window.__demoUser` is set |
| `src/components/sections/CinematicReveal.astro` | Add optional `imagePosition` prop for desktop-only image shifting (default center) |
| `src/content/shared/footer.json` | (no changes expected) |
| `src/content/planning/exhibitions.json` | Add `location` field to Marisol entry; add 5 events for 2026-04-22 |

### Files that may need a new data file
| File | Purpose |
|---|---|
| `src/content/onsite/home.json` | Onsite landing content: hero tagline, cinematic reveal data, building groupings, navigator/wifi/faq content |
| `src/content/onsite/kerry-james-marshall.json` | Full KJM detail page content: hero video path, cinematic reveal, intro, 10 artworks, artist quote, 3 video testimonials, 3 shop items |

## Data Contracts

### Exhibition location
All entries in `exhibitions.json > currentExhibitions` and `upcomingExhibitions` already have `location: { building, floor }` on 4 of 5 current exhibits. Only Marisol needs it added: `{ "building": "Moser Building", "floor": "1st Floor" }`.

### Events — Today filter
```js
const todayISO = new Date().toISOString().split('T')[0];
const todays = events.filter(e => e.date === todayISO);
```
For the demo date 2026-04-22, 5 new event entries need to be added to `exhibitions.json > events`.

### Artwork data shape (for `kerry-james-marshall.json > artworks`)
```ts
interface Artwork {
  id: string;
  number: number;              // 1..10
  title: { de: string; en: string };
  year: string;                // "1993"
  collection: string;           // "Los Angeles County Museum of Art"
  credit?: string;              // "Purchased with funds..."
  image: string;                // "/images/exhibitions/kjm/01-de-style.jpg"
  description: { de: string; en: string };
  audioSrc: string;             // "/audio/Ballad%20for%20Classical%20Strings.mp3" (shared)
}
```

### Video testimonial (for `kerry-james-marshall.json > videos`)
```ts
interface Video {
  id: string;
  thumbnail: string;
  duration: string;             // "1 Min"
  quote: { de: string; en: string };
  role: 'artist' | 'audience' | 'curator';
}
```

### Shop item (for `kerry-james-marshall.json > shop`)
```ts
interface ShopItem {
  id: string;
  image: string;
  title: { de: string; en: string };
  price: string;                // "CHF 750.-"
  addToCartLabel: { de: string; en: string };
}
```

## Design Constraints

### Back button labels
- **KJM detail → /onsite:** `← Your visit`
- **Audio guide Playlist → KJM detail:** `← Close audio guide`
- **Detail Player → Playlist:** icon-only `keyboard_arrow_down` chevron, large tap-target, no text

### Cinematic reveal positioning
- `imagePosition: "left"` on the KJM detail page cinematic reveal
- Desktop only; mobile stays centered (content card covers whole viewport anyway)
- Implementation: CSS custom property `--image-position-desktop` driven by the prop

### OnsiteHero
- Structural background grid: CSS `repeating-linear-gradient` vertical lines (`rgba(255,255,255,0.08)` on dark bg)
- Title typography: existing `--type-4xl` token (consistent with Planning hero)
- Title: right-aligned "AT THE MUSEUM" in same geometric slot as Planning's "KUNST/HAUS/ZURICH"
- Static, no animations

### OnsiteExhibitionGrid responsive breakpoints
- **Mobile (<768px):** 2 columns
- **Tablet (768–1023px):** 3 columns
- **Desktop (≥1024px):** 4 columns

### HorizontalSlider (video testimonials + shop)
- Center-snap via `scroll-snap-type: x mandatory` + `scroll-snap-align: center` on cards
- Peek card behavior: ~55% width, 50% opacity, scaled typography
- Implementation: `IntersectionObserver` maps intersection ratio → CSS custom properties (`--card-scale`, `--card-opacity`)
- Used for both video testimonials section and shop section on KJM detail page

### TodaysEventsAccordion dynamic headline
Four states depending on time:
- **Before any event:** `Next at 10:30 — Architecture Tour`
- **During an event:** `Now: Marisol Introduction`
- **All events ended:** `Today's program has ended`
- **No events:** `No events today`

## Content Data

### Cinematic reveal — onsite home (existing, created in earlier session)
Image: `/images/onsite/chipperfield-entrance.jpg`
Title: "Welcome to the Kunsthaus Zurich. It's nice to have you here."
Card title: "Open space for living art"
Description: C2 — "Concrete, light, and silence. The Chipperfield Building was designed to disappear behind the art — to make room for looking.<br/><br/>Seven exhibitions wait for you across five floors. There is no wrong way through."

### Cinematic reveal — KJM detail page
Image: `/images/exhibitions/kjm/kjm-portrait.png`
ImagePosition: `left`
(Tagline + card title + description drafted during implementation.)

### Artist quote
«I try to make the black paints that I use as complex as any other colour on the palette.»
— Kerry James Marshall

### Paywall overlay copy (English)
> **Audio guide access**
>
> The audio guide is free when you buy your ticket online. If you purchased your ticket at the counter, you can rent the audio guide for CHF 4 on site. Members of Kunsthaus Zürich always listen free.
>
> [Buy tickets] [Become a member]

German:
> **Audioguide**
>
> Der Audioguide ist beim Online-Ticketkauf gratis enthalten. Haben Sie Ihr Ticket an der Kasse gekauft, können Sie den Audioguide vor Ort für CHF 4 leihen. Mitglieder des Kunsthauses Zürich hören immer kostenlos.

### Profile overlay content
- **Ticket hero:** "Day Pass — All Exhibitions", QR code (demo payload `KUNSTHAUS-DEMO-2026-04-22-DAYPASS-001`), valid 22 April 2026, 10:00–20:00, access to all 5 current exhibitions + permanent collection
- **Secondary nav:** My audio guide history · Favourites · Upcoming visits & events · Membership · Account settings · Help & contact
- **Footer:** Signed in as Demo User + Log out button
- **Optional upsell:** "Become a member" card at bottom

### FAQ accordion (placeholder content)
1. **Where can I leave my coats and bags?** — Complimentary cloakroom on the ground floor of the Chipperfield Building.
2. **Am I allowed to eat and drink in the museum?** — Eating and drinking only in the Kunsthaus Bar and Restaurant Bei Moudi.
3. **Am I allowed to take photographs at the Kunsthaus?** — Photography allowed without flash, except in the Marisol and Kerry James Marshall exhibitions.

## Assets

### Already in place
- `public/images/onsite/chipperfield-entrance.jpg` (872 KB JPEG) — onsite cinematic reveal
- `public/images/exhibitions/kjm/kjm-portrait.png` (2.5 MB PNG) — KJM cinematic reveal
- `public/audio/Ballad for Classical Strings.mp3` (7.4 MB) — shared demo audio for all 10 KJM tracks

### To download during implementation
- **10 KJM artwork thumbnails** from kunsthaus.ch → `public/images/exhibitions/kjm/01..10-*.jpg`
- **Marisol hero thumbnail** from kunsthaus.ch → `public/images/exhibitions/marisol.jpg`
- **KJM hero video** — needs investigation; may be on kunsthaus.ch homepage or Vimeo/YouTube embed. Fallback to a short looping interior shot if not findable.
- **3 video testimonial thumbnails** from the "Stimmen zur Ausstellung" section on kunsthaus.ch → `public/images/exhibitions/kjm/video-artist.png`, `video-audience.png`, `video-curator.png` (Video 1 artist thumbnail is same file as kjm-portrait.png — accepted duplication)
- **3 shop item images** from Figma node 105-3226 (Lithograph, Candleholder, Scented candle) → `public/images/exhibitions/kjm/shop-*.png`
- **Dynamic QR code** for the profile overlay — generate at build time or use a static pre-made PNG

## Sub-plan Breakdown

Phase 03 splits into four sub-plans with natural shipping checkpoints:

### 03-01 — Routing Foundation (critical path)
Enable Astro View Transitions; refactor mode toggle to URL-as-state; remove localStorage-based mode persistence; add `data-mode` as layout prop; create `/onsite` stub route to prove routing works. **Blocks everything else.**

### 03-02 — On-site Landing Page (shippable baseline)
Full `/onsite` page implementation: OnsiteHero, cinematic reveal, OnsiteExhibitionGrid with building groupings, MuseumNavigatorTeaser, InfoBox with TodaysEventsAccordion, FAQAccordion, dark-mode section stacking. **This is the minimum viable Phase 03 deliverable for the pitch.**

### 03-03 — KJM Exhibition Detail Page
Full `/onsite/kerry-james-marshall` page: KjmHero (video), cinematic reveal, title + intro, ArtworkSlider, ArtistQuote, HorizontalSlider (video testimonials + shop). Routes from onsite Chipperfield grid. **Nice-to-have for pitch; can be demoed verbally if not shipped.**

### 03-04 — Audio Guide + Login System
AudioGuideOverlay with Playlist + DetailPlayer views and bottom-sheet animation; PaywallOverlay with Buy Tickets + Become a Member; simulateLogin() flow; NavProfileButton; ProfileOverlay with QR ticket. **Most complex piece; can be scoped to just "open the playlist view" if time runs out.**

## Success Criteria (phase-level)

1. Clicking the mode toggle on `/` navigates to `/onsite` with an animated View Transitions palette flip (not a hard reload)
2. Clicking the mode toggle on `/onsite` navigates back to `/` with the same transition
3. The URL `/onsite` produces the full on-site landing page with hero, cinematic reveal, two building grids, museum navigator, Wifi/info box with live today's events, and FAQ
4. The URL `/onsite/kerry-james-marshall` produces the full exhibition detail page with hero video, cinematic reveal, title, intro, 10-artwork slider, artist quote, video testimonials slider, and shop slider
5. Tapping the headphones button on an artwork (while logged out) opens the paywall overlay with Buy Tickets + Become a Member CTAs
6. Clicking Buy Tickets (or Log in via hamburger) sets the demo-logged-in state: profile icon fades into the navbar, hamburger "Log in" becomes "My Account"
7. Tapping the headphones button (while logged in) opens the audio guide in Playlist view with the launched track auto-playing
8. Tapping a track in the playlist slides up the Detail Player (bottom-sheet animation) with full transport controls
9. Tapping the profile icon opens the ProfileOverlay with a QR code ticket, 6 secondary nav items, and a log out button
10. All new pages respect prefers-reduced-motion (no stacking, no slider scale animation, no cinematic reveal expansion)
11. All new content is loaded from JSON, no hardcoded strings in templates
12. Dark-mode palette applies consistently across /onsite and /onsite/kerry-james-marshall via the existing semantic token cascade

## Session Log

This Phase 03 planning conversation was held over ~1 day of intensive discussion. Key decisions made in order:

1. Mode toggle becomes navigation, not just CSS flip → requires `/onsite` route
2. `/onsite` is mobile-first, Figma node 99-2688 is the reference layout
3. OnsiteHero is static, grid-line background, "AT THE MUSEUM" title
4. Building sections: Chipperfield (3 exhibits) + Moser (2 exhibits including Marisol from Apr 17)
5. Cinematic reveal after hero on all pages for consistency
6. Museum Navigator teaser → dark mode (user unsure, will iterate)
7. Mode toggle bidirectional via URL-as-state, not localStorage
8. TodaysEventsAccordion forked from StatusAccordion, dynamic 4-state headline, events data already has ISO dates
9. KJM detail page at `/onsite/kerry-james-marshall` (onsite-scoped, not mode-neutral)
10. Artwork browsing = inline ArtworkSlider (one per viewport); audio guide = fullscreen overlay triggered by headphones button
11. Audio guide: Playlist view (base) + Detail Player view (bottom-sheet slide-up)
12. Back buttons: "Your visit" / "Close audio guide" / chevron-only
13. Login sim: two entry points (paywall + hamburger "Log in"), localStorage flag, profile icon fades in
14. Profile overlay content: QR ticket hero + 6 nav items + log out + upsell
15. Cinematic reveal on KJM page uses kjm-portrait.png (user-provided) with `imagePosition: left` on desktop
16. Real `<audio>` element playing `Ballad for Classical Strings.mp3` for all 10 tracks
17. 10 artworks real data from kunsthaus.ch scrape
18. Videos slider + shop slider reuse single HorizontalSlider component with center-snap + peek-scale behavior
19. Artist quote («I try to make the black paints…») placed after artwork slider
20. Section stacking: same as Planning (overruled my flat-scroll recommendation)
