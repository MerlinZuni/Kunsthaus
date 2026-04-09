# Phase 2: Static Homepage - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

A complete homepage with hero, exhibitions, visit info, and footer — all sections rendering real mock content from JSON. Responsive navigation with mobile hamburger menu. Sticky CTA and mode toggle across all breakpoints. All content in EN and DE for language switcher demo. No animations or mode switching logic in this phase (Phase 3), but structural hooks must be in place.

</domain>

<decisions>
## Implementation Decisions

### Hero Section
- **D-01:** Carousel with large right-aligned bold typography "KUNST / HAUS / ZÜRICH" on the topmost z-index layer, largest font size in the type scale. Text is right-aligned, three lines.
- **D-02:** Exhibition images layer underneath the typography in an offset, scattered arrangement — grid-aligned but never aligned to each other. Images fade in and scale down to land on top of each other, creating a stacked collage effect.
- **D-03:** Carousel auto-plays through featured exhibitions. Each slide has a CTA button linking to the exhibition detail page (placeholder href for now, detail pages are future phases).
- **D-04:** Carousel navigation uses labeled progress tabs — one tab per exhibition showing the exhibition title + animated fill bar for auto-play timing. Active title visible on mobile, inactive tabs collapse to compact indicators.
- **D-05:** Pause/play toggle for carousel auto-play (WCAG 2.2 SC 2.2.2 compliance).
- **D-06:** Hero is fixed/pinned — stays in place while subsequent sections scroll over it as part of the stacking scroll effect.

### Navigation Bar
- **D-07:** Floating bar with transparent padding around entire element, topmost z-index above all content. Background: #EBEBEB concrete color. DINNextW1G Regular 16px for all nav items.
- **D-08:** Layout — Left: search icon (magnifying glass). Center: Kunsthaus Zürich logo with mix-blend-exclusion. Right: nav links (Visit us, Collection, Exhibitions, About) + EN language switcher with dropdown (EN/DE/FR).
- **D-09:** Mode toggle ("I'm at the museum" / "Plan a visit") is NOT in the navigation — it lives exclusively in the floating bottom-right buttons (desktop) and sticky bottom bar (mobile).
- **D-10:** Scroll behavior — Logo Island + Velocity-aware reveal. Full nav dissolves on scroll, logo persists as floating island anchored top-center. Fast scroll = instant hide. Slow scroll or micro-pause = nav fades back in with blur-expand animation. Search icon migrates to a corner when nav dissolves.
- **D-11:** Search icon opens a visual shell overlay — input field with hardcoded suggestion links, no actual search logic. Functional search is backlog item 999.1.
- **D-12:** Mobile top nav (always visible, never hidden): Search icon | Kunsthaus Zürich logo | Hamburger menu icon.
- **D-13:** Mobile hamburger opens full-screen overlay with large DINNextW1G typography. Kunsthaus logo stays visible centered at top. Nav links stacked vertically (Visit us, Collection, Exhibitions, About). Language options (EN / DE / FR) displayed below nav links. Search field at bottom.

### Interaction States (site-wide)
- **D-14:** All interactive elements share one interaction pattern: clip-path background wipe on desktop hover (200ms in, 350ms out — asymmetric timing for premium feel), scale(0.96) press pulse on touch (80ms), focus-visible outline with outline-offset for keyboard users.
- **D-15:** `@media (hover: hover)` gates hover effects to real hover devices, preventing sticky hover states on touch screens.
- **D-16:** Filled CTA buttons use inverse wipe — background already present, wipe reveals a contrasting color. Same timing, same easing.
- **D-17:** `touch-action: manipulation` applied globally to eliminate 300ms tap delay on mobile.

### Sticky CTA + Mode Toggle
- **D-18:** Desktop — two floating buttons paired together in bottom-right: mode toggle ("Plan a visit" ↔ "I'm here") + "Tickets" button. No bar — just floating buttons. Fraction counter + progress arc positioned bottom-left.
- **D-19:** Mobile/Tablet — sticky bottom bar: "Tickets" CTA on the left, mode toggle on the right. Same pairing as desktop, different container.
- **D-20:** Mode toggle is a two-state switch: "Plan a visit" (default, Planning mode) ↔ "I'm here" (On-site mode). Tapping switches the `[data-mode]` attribute. The toggle visually indicates the active state.
- **D-21:** "Tickets" links to kunsthaus.ch ticketing (external link, placeholder for prototype).
- **D-22:** Labeling across languages: EN: "Plan a visit" / "I'm here" / "Tickets". DE: "Besuch planen" / "Ich bin da" / "Tickets". FR: "Planifier" / "Je suis ici" / "Billets".

### Section Composition
- **D-23:** Varied asymmetric grid layouts — each section uses the 48-track grid differently. Hero full-bleed, exhibitions 8+4 column split, visit info 3-column grid, etc. No uniform layout across sections.
- **D-24:** Generous 128px+ vertical spacing between major sections — gallery-like pacing.
- **D-25:** 3D stacking scroll effect: each new section slides over the previous one. Covered section scales to ~90%, rotates 2-3deg (varied direction per section), fades opacity, then fully covered (no peeking edges). Responsive behavior:
  - Desktop (1024px+): Full effect — pin, scale, rotate, opacity
  - Tablet (768-1023px): Scale + opacity only, rotation dropped
  - Mobile (<768px): No pinning — native-scroll fade-up (opacity + translateY) transitions
  - Reduced motion (all viewports): No transforms, static layout only
- **D-26:** Background rotation — 4-step cycle repeating through sections: off-white (#fbf8f7) → pure white (#ffffff) → concrete light (#EBEBEB + concrete-wall.png texture) → concrete warm (#C1BFB2 + asfalt-dark.png texture).
- **D-27:** In-page navigation: fraction counter + progress arc, bottom-left corner. Small "03 / 07" with thin circular progress arc. Accessible: `aria-label="Section X of 7: [name]"`, keyboard-focusable, `aria-live="polite"` announces section changes. Nav state driven by GSAP ScrollTrigger callbacks (not IntersectionObserver — unreliable with pinned sections).

### Immersive Storytelling Components
- **D-28:** Two reusable component patterns for immersive sections:
  1. **Cinematic Reveal Strip** — full-bleed image starts masked/cropped behind colored overlay. On scroll, mask expands via clipPath, overlay fades, title + editorial line enter from opposite sides. Mobile: vertical wipe, text below image.
  2. **Pinned Narrative Sequence** — section pins in viewport, content cards scroll through one at a time, each offset alternating left/right, background shifts between cards. Mobile: unpin, cards become standard vertical scroll stack (same markup, pin disabled via ScrollTrigger matchMedia).
- **D-29:** Section → pattern mapping:
  - Exhibitions: Cinematic Reveal for featured exhibition + Pinned Narrative for exhibition list
  - Offerings (membership, Design Shop, Art Shop, restaurant, bar, guided tours): Pinned Narrative
  - Education (workshops, school programs, family programs, lectures): Pinned Narrative
  - Key-info, Events, Planning details: Standard grid layouts (informational, not storytelling)
- **D-30:** Both components accept a `contentType` prop and `data` array from JSON. Structural HTML/GSAP logic stays identical — only rendered fields change.

### Exhibition Cards
- **D-31:** Image-dominant cards with 60/40 viewport split — image takes 60vh, text area (title, date, description, CTA) takes 40vh. All content visible within one viewport without scrolling. Mobile: 50/50 split.
- **D-32:** Exhibition images use 3:2 landscape aspect ratio. Container filled via object-fit: cover.
- **D-33:** Card transitions within Pinned Narrative: crossfade with offset slide. Current card fades out + slides slightly up/left, next card fades in from opposite direction. Cards alternate offset direction (left/right) for rhythm.
- **D-34:** Hero carousel and exhibition section use separate components — hero has its own unique scattered-image layout, not shared with the Pinned Narrative cards.

### Footer (from Figma reference)
- **D-35:** Thick 4px black top border. White background.
- **D-36:** Marquee banner: "KUNSTHAUS ZÜRICH" in large bold DIN type, continuous CSS animation right-to-left at constant speed. Pauses on hover for accessibility. Text repeated for seamless loop.
- **D-37:** Four-column layout below marquee:
  - Col 1: KUNSTHAUS ZÜRICH address (Heimplatz, 8001 Zürich), Google Maps link, email, phone (+41 44 253 84 84)
  - Col 2: "Open today from 10:00" dynamic status, full schedule (Tue-Wed/Fri-Sun 10-18, Thu 10-20, Mon closed), closing note
  - Col 3: Quick links (Exhibitions, Tickets, Membership) + Media section (Press area, Press releases, Image downloads)
  - Col 4: Newsletter description + subscribe link
- **D-38:** Dark bottom bar (#0f0f0f): social icons (Facebook, Instagram), legal links (Impressum, Terms, Privacy, Cookies, Social Media Netiquette), copyright "© 2026 Kunsthaus Zürich".
- **D-39:** Footer content in both EN and DE for language switcher demo. Section headers in DIN Bold uppercase 16px with letter-spacing. Body in DIN Regular 16px. All links styled with 2px bottom border underline.

### Accessibility
- **D-40:** Manual reduce-motion toggle in footer + collapsed nav logo-island area. localStorage persistence. Respects OS `prefers-reduced-motion` as default, user can override.
- **D-41:** Carousel: `<section aria-roledescription="carousel">` wrapper, each slide `role="group" aria-roledescription="slide" aria-label="X of N"`, `aria-live="polite"` for slide changes. `prefers-reduced-motion`: disable auto-play and transitions.
- **D-42:** Skip-nav link, semantic HTML landmarks, all content visible and usable with JavaScript disabled (from Phase 1 foundation).

### Content & Language
- **D-43:** All page content in both EN and DE JSON for the language switcher demo. EN is the development default. FR placeholder slots in schema (from Phase 1 D-12).
- **D-44:** Navigation labels: Visit us, Collection, Exhibitions, About. Footer content translated from Figma German to English, with German retained in JSON.

### Claude's Discretion
- Exact grid column assignments per section (which columns each section spans)
- Individual section internal layouts for Key-info, Events, Planning details (standard grid)
- Search overlay visual design (layout of suggestion links)
- Language switcher dropdown styling and animation
- Exact spacing within the sticky bottom bar and floating button sizing
- Footer responsive behavior (column stacking on mobile)
- Image placeholder strategy (which images to source for exhibitions)
- Logo island transition animation details
- Hamburger menu open/close animation

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Creative Brief & Design Direction
- `docs/creative-briefing.md` — Full competition briefing: strategy, content hierarchy, design principles, audience, success criteria, benchmark sites
- `.planning/GRID.md` — Grid specification derived from reference blueprint image
- `.planning/assets/grid-reference.png` — Visual grid reference (48×8 track blueprint)

### Figma Design References
- Figma nav bar: `node-id=25-1911` in Kunsthaus-Pitch-Design — floating nav with search, logo, links, language switcher
- Figma footer: `node-id=16-258` in Kunsthaus-Pitch-Design — marquee, 4-column layout, dark bottom bar

### Phase 1 Foundation
- `.planning/phases/01-foundation/01-CONTEXT.md` — All foundation decisions: mode theming (D-01 through D-06), typography (D-07/D-08), spacing (D-09), accessibility (D-10), content structure (D-11 through D-19), shop (D-29 through D-34), grid (D-20 through D-25), textures (D-35/D-36)

### Design Resources (external)
- Kunsthaus image database: https://www.kunsthaus.ch/en/medien-bereich/image-database/
- Dreipol visitor guide: https://visitorguide.kunsthaus.ch/
- Kerry James Marshall exhibition: https://www.kunsthaus.ch/en/besuch-planen/ausstellungen/kerry-james-marshall/

### Project Specs
- `.planning/REQUIREMENTS.md` — Phase 2 requirements: HOME-01 through HOME-04, NAV-01
- `.planning/ROADMAP.md` — Phase 2 success criteria and scope boundary

### Presentation
- `.planning/phases/02-static-homepage/02-DESIGN-PRESENTATION-ARGUMENTS.md` — Design rationale document for competition deck

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/layouts/BaseLayout.astro` — Base layout with CSS imports, Lenis + GSAP initialization, SkipNav, GridOverlay, `[data-mode]` attribute on HTML element
- `src/components/Head.astro` — Head component with meta tags
- `src/components/SkipNav.astro` — Accessibility skip navigation
- `src/components/GridOverlay.tsx` — Dev-mode grid overlay (React island with Leva controls)
- `src/styles/grid.css` — 48-track grid system with .col-1 through .col-12 helpers, responsive breakpoints (desktop 48 / tablet 32 / mobile 16 tracks)
- `src/styles/tokens/primitives.css` — Color primitives including concrete tones (#EBEBEB, #C1BFB2, #A4A197)
- `src/styles/tokens/semantic.css` — Semantic tokens with `[data-mode]` switching
- `src/styles/typography.css` — DINNextW1G type scale (Perfect Fourth ratio)

### Established Patterns
- CSS `@layer` cascade: reset, tokens, base, layout, components, utilities
- Astro Content Collections with Zod schemas and `file()` loader
- GSAP + Lenis integration for smooth scrolling (Lenis synced with ScrollTrigger)
- React islands in Astro for interactive components (GridOverlay pattern)
- `[data-mode="planning"]` / `[data-mode="onsite"]` for theme switching at semantic token layer

### Integration Points
- `src/pages/index.astro` — Current placeholder homepage, renders planning content sorted by priority. Needs complete rebuild with new section components.
- `src/content/planning/homepage.json` — Homepage sections (hero, key-info, exhibitions, offerings, events, education, planning-details). May need schema updates for new section types.
- `src/content/shared/navigation.json` — Navigation items. Needs update to match new nav structure (remove mode-toggle, update labels).
- `src/content/onsite/kerry-james-marshall.json` — On-site exhibition content (for future On-site mode rendering)
- GSAP ScrollTrigger already registered in BaseLayout.astro — ready for section pinning and stacking effects
- `[data-mode]` attribute already on `<html>` element — mode toggle can switch it directly
- Texture files in `.planning/assets/textures/` — need to be copied to `public/textures/` for use

</code_context>

<specifics>
## Specific Ideas

- Hero typography "KUNST / HAUS / ZÜRICH" should feel monumental — like the physical presence of the Chipperfield building. The museum's name becomes architecture, not just branding.
- Scattered hero images should create visual tension and curiosity — the eye moves between overlapping images, discovering each exhibition.
- Logo Island scroll behavior inspired by Fondation Louis Vuitton, Burberry, Bottega Veneta — the logo floating freely reads as intentional design authority.
- Velocity-aware nav reveal inspired by MoMA and Tate — the interface feels alive and responsive to user intent.
- Asymmetric animation timing (faster in, slower out) is the single most impactful technique for perceived quality — documented across Awwwards-winning luxury and museum sites.
- Touch interaction via scale pulse (not Material ripple) respects Swiss-modernist restraint — Material Design ripples belong to Google's language, not a European cultural institution.
- Section stacking metaphor is architectural — layers of content stacked like the floors of the Chipperfield extension. The museum experience of moving through spaces, translated digitally.
- Concrete textures connect the digital experience to the physical museum — the Chipperfield extension is defined by its concrete materiality.
- "Open today from 10:00" in the footer answers the #1 visitor question without requiring search.
- The accessibility toggle is a competition differentiator — most museum prototypes ignore accessibility entirely.

</specifics>

<deferred>
## Deferred Ideas

- Functional search across JSON content — backlog item 999.1
- Exhibition detail pages — future phase (Phase 3+ or new phase)
- Real ticketing integration — out of scope, prototype uses external link
- Geolocation-based mode switching (opt-in prompt when near museum) — Phase 3 (NAV-05)
- QR code URL parameter for On-site mode — Phase 3 (NAV-04)
- Mode switching transitions and animations — Phase 3 (ANIM-04)
- All scroll-driven animations, text animations, hover effects — Phase 3 (ANIM-01 through ANIM-06)
- Shop overlay panel slide-in behavior — structural hooks in Phase 2, interaction in Phase 3

</deferred>

---

*Phase: 02-static-homepage*
*Context gathered: 2026-04-09*
