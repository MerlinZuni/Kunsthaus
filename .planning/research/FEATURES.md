# Feature Landscape

**Domain:** Museum website redesign (competition prototype)
**Target:** Kunsthaus Zurich
**Researched:** 2026-04-06
**Competitors analyzed:** MoMA, Tate, Guggenheim Bilbao, Rijksmuseum, British Museum, V&A, Van Gogh Museum, Nordiska Museet, Frans Hals Museum, Cooper Hewitt, Baltic, MIT Museum, Fondation Beyeler, National Gallery

## Table Stakes

Features users expect. Missing = product feels incomplete. Visitors will leave or lose trust without these.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Exhibition listings (current + upcoming) | Primary reason people visit the site; every competitor has this prominently | Low | Must include dates, hero images, brief descriptions. Current Kunsthaus.ch has this but buried under "Plan Your Visit" |
| Visit planning essentials | Users need hours, location, directions, transport, parking, accessibility info | Low | Must be findable in under 2 clicks. Integrate map. Fondation Beyeler and Rijksmuseum nail this |
| Ticket purchase / CTA | Conversion is the site's primary business goal. Every major museum has prominent ticket CTAs | Low | Out of scope for prototype, but must show WHERE it would go. Prominent CTA button, even if non-functional |
| Responsive design | 60%+ of museum website traffic is mobile (visitors searching on phones pre-visit or on-site) | Medium | Mobile-first is non-negotiable. On-site mode will be almost exclusively mobile |
| Clear navigation structure | Users must find exhibitions, visit info, and collection in seconds | Low | Top nav with max 5-6 items. Rijksmuseum and National Gallery do this well with minimal top-level items |
| High-quality imagery | Art museums sell visual experiences; low-res images undermine credibility | Low | Full-bleed hero images, proper aspect ratios, lazy loading for performance |
| Open/closed status indicator | Baltic and Guggenheim Bilbao both feature this; visitors check before coming | Low | Green/red visual signal, current hours, next opening time if closed |
| Accessibility basics | Legal requirement in many jurisdictions; expected by all cultural institutions | Medium | Semantic HTML, keyboard navigation, screen reader support, respect prefers-reduced-motion for animations |
| Search functionality | V&A and MoMA both feature prominent search; expected for collection exploration | Medium | At minimum a search bar. For prototype, can be styled but not fully functional |
| Multilingual support (DE/EN minimum) | Zurich is multilingual; international visitors expect English. Kunsthaus.ch currently supports DE/EN/FR | Low | Content layer must support language switching. JSON structure should account for locale keys |

## Differentiators

Features that set the product apart. Not expected, but create competitive advantage. These win the competition pitch.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Dual-mode experience (Planning / On-site)** | THE core concept. No major museum does this. Transforms the website from a brochure into a contextual companion. Planning mode = explore exhibitions, buy tickets, plan route. On-site mode = deeper exhibit content, contextual to physical location | High | This is the competition-winning feature. Must feel like two naturally different experiences, not a gimmick. UI states change (typography weight, color temperature, content density, navigation structure) |
| **Mode switching via geolocation** | Intelligent context detection. Site recognizes you're at the museum and offers to switch. Opt-in, not forced | Medium | Use Geolocation API with geofence around Kunsthaus coordinates. Show a gentle prompt ("Looks like you're at the museum. Switch to On-site mode?"). Must handle denial gracefully |
| **Mode switching via QR codes** | Physical-digital bridge. QR at an exhibit opens the website directly to that exhibit's on-site content | Medium | URL parameter triggers on-site mode for a specific exhibit (e.g., `?mode=onsite&exhibit=giacometti-room`). Each QR code = unique deep link |
| **Scroll-driven animations** | Nordiska Museet won a 2025 Webby for this. Baltic uses it throughout. Creates an immersive, editorial feel that differentiates from static museum sites | Medium | GSAP ScrollTrigger: parallax layers, content reveals, scaling effects, pinned sections. Keep it purposeful (art reveals, exhibition previews) not gratuitous |
| **Text/typographic animations** | Creates a premium, gallery-like digital feel. Baltic's typographic load animation is a reference point | Medium | GSAP SplitText for heading reveals, staggered character animations, scroll-linked text motion. Must feel like the typography IS the design, not decoration |
| **Cursor/hover interaction effects** | Adds playfulness and discovery. Frans Hals Museum and Nottingham Contemporary use hover microinteractions extensively | Low-Med | Custom cursor states near artwork images, hover reveals, magnetic buttons. Enhances "curiosity-driven navigation" from project requirements |
| **Exhibition-specific color palettes** | British Museum and Nordiska Museet both use this. Each exhibition gets its own color world, making navigation feel immersive | Low | CSS custom properties per exhibition. JSON data includes color tokens per exhibit. Smooth transitions between color worlds |
| **Page/section transitions** | Smooth transitions between modes and sections create a premium, app-like feel. Frans Hals Museum scored high on Awwwards for this | Medium | GSAP-powered view transitions. Mode switch should feel like a transformation, not a page reload |
| **Playful discovery elements** | Frans Hals Museum has mini-games ("Art Roulette", "Gif Me Frans"). Cooper Hewitt has a "Shoebox" for saving favorites. MIT Museum has "peepholes" revealing images. These create delight | Medium | For prototype: one or two discovery moments (e.g., hover to reveal artwork details, draggable exhibit map, parallax artwork "peek"). Not mini-games -- too much scope |
| **Collection highlight curation** | Cooper Hewitt's "Shoebox" and MIT Museum's personalizable collections (no login required). Let visitors curate their own trail | High | For prototype: "Save to my visit" functionality that builds a personal exhibit route. Could use localStorage, no auth needed. Impressive in demo but high effort |
| **Contextual on-site content** | When in on-site mode at a specific exhibit: show artist background, related works, audio/video context, "what to look for" guidance | Medium | This is what makes on-site mode valuable, not just a UI skin change. Content must be genuinely different and deeper than planning mode |

## Anti-Features

Features to explicitly NOT build. These are tempting but wrong for this project.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Virtual tours / 3D walkthroughs | Expensive to build, often clunky, and contradicts the goal of driving physical visits. The dual-mode concept already bridges digital and physical better | Show compelling exhibition previews that make people WANT to visit in person |
| Full e-commerce / shop | Out of scope per project constraints. Adds complexity without serving the competition pitch | Show a "Shop" nav item that signals it would exist, but don't build it |
| User accounts / authentication | Unnecessary for prototype. Adds auth complexity that distracts from the core dual-mode concept | Use localStorage for any personalization (saved exhibits, mode preference) |
| Chatbot / AI assistant | Field Museum has "Maximo" but it feels gimmicky for an art museum. Kunsthaus should feel curated, not automated | Good content architecture and clear navigation serve visitors better than a chatbot |
| Social media feed integration | Guggenheim Bilbao integrates UGC but it often looks messy and dates quickly. The prototype should feel timeless | Social sharing buttons are fine; embedded feeds are not |
| Full CMS integration | Explicitly out of scope. JSON data files are the right call for the prototype timeline | Structure JSON to be CMS-mappable so the concept is clear, but don't build CMS pipelines |
| Overly complex animations | Motion sickness risk. Excessive parallax and cursor effects harm accessibility and can feel like showing off rather than enhancing content | Every animation must serve content. Respect prefers-reduced-motion. Less is more with purpose |
| Blog / editorial section | Some museum sites have editorial content, but it's not what wins a competition pitch. Focus on the hero experience | If time permits, show one "Stories" teaser to signal editorial capability |
| Full collection database search | V&A has 1.25M+ objects searchable. This is a massive engineering effort irrelevant to the prototype | Show a beautifully designed collection highlights section. The search bar can be non-functional |
| Audio guide integration | MoMA has an audio app. Building audio playback, syncing, and content is a project unto itself | For on-site mode, show where audio would integrate (play button UI) without building the player |
| Indoor positioning / BLE beacons | Real indoor geolocation requires hardware infrastructure. Way beyond prototype scope | QR codes at exhibits achieve the same "exhibit-specific content" goal with zero infrastructure |

## Feature Dependencies

```
Responsive design --> Everything (foundation)
JSON content layer --> Exhibition listings, Multilingual, Dual-mode content
  |
  +--> Exhibition-specific color palettes (colors in JSON per exhibit)
  +--> Contextual on-site content (different content blocks per mode)

Navigation structure --> Dual-mode experience (nav changes between modes)
  |
  +--> Mode switching toggle (lives in nav)
  +--> Open/closed indicator (lives in nav/header)

GSAP setup --> Scroll-driven animations
  |
  +--> Text animations (SplitText plugin)
  +--> Page transitions
  +--> Cursor/hover effects

Dual-mode experience --> Mode switching via geolocation
  |                   --> Mode switching via QR codes
  |                   --> Contextual on-site content
  |
  +--> URL parameter handling (QR deep links)
  +--> Geolocation API integration
  +--> localStorage (mode persistence)

High-quality imagery --> Scroll-driven animations (images as animation subjects)
  |
  +--> Playful discovery elements (image reveals, peek effects)
```

## MVP Recommendation

For a 3-4 day competition prototype, prioritize ruthlessly:

### Must Ship (Day 1-2)
1. **Responsive homepage with exhibition listings** - The canvas everything else lives on
2. **Dual-mode UI states** - Planning mode and On-site mode with visually distinct presentations. This IS the pitch
3. **Mode switching toggle** - Manual toggle in navigation that transforms the page
4. **Scroll-driven animations** - 3-4 purposeful scroll effects (hero parallax, exhibition card reveals, section transitions). These create the "wow" for the presentation
5. **High-quality imagery with exhibition color palettes** - Each exhibition section feels like its own world
6. **Visit planning essentials** - Hours, location, ticket CTA (even if non-functional)

### Should Ship (Day 2-3)
7. **Text/typographic animations** - Heading reveals, staggered text. Elevates the premium feel
8. **Mode switching via QR code** - URL parameter demo. Show a QR code in the presentation that switches to on-site mode
9. **Cursor/hover microinteractions** - Custom cursor on artwork, hover reveals. Adds the "playful discovery" feel
10. **Page transitions between modes** - The mode switch should feel like a transformation

### Nice to Have (Day 3-4)
11. **Geolocation prompt** - "You're at the museum" detection. Impressive in demo but not essential
12. **Contextual on-site exhibit content** - At least one exhibit with genuinely different on-site content (deeper info, "what to look for")
13. **Playful discovery moment** - One unexpected interaction (artwork peek, draggable element)
14. **Open/closed status** - Real-time or time-based indicator

### Defer Entirely
- Collection highlight curation / "Save to my visit" (too much scope)
- Full search functionality (style the bar, don't build the engine)
- Audio integration (show the UI, don't build the player)
- Blog/stories section

## Competitive Positioning

| Feature | Kunsthaus.ch (current) | MoMA | Tate | Guggenheim Bilbao | Nordiska | **This Prototype** |
|---------|----------------------|------|------|-------------------|----------|-------------------|
| Dual-mode experience | No | No | No | No | No | **YES - unique** |
| QR exhibit deep links | No | No | No | No | No | **YES - unique** |
| Geolocation context | No | No | No | No | No | **YES - unique** |
| Scroll animations | Minimal | Minimal | Some | Some | **Strong** | **Strong** |
| Exhibition color worlds | No | No | Some | No | **Yes** | **Yes** |
| Typographic animation | No | No | No | No | **Yes** | **Yes** |
| Cursor interactions | No | No | No | No | No | **Yes** |
| Mobile-first on-site | No | App only | App only | No | No | **YES - web native** |

The dual-mode concept is genuinely novel in the museum website space. No major competitor does this. Combined with strong animation craft and the physical-digital bridge (QR codes, geolocation), this prototype can demonstrate a paradigm shift from "museum website as brochure" to "museum website as companion."

## Sources

- [Numiko: Best Museum and Gallery Websites 2026](https://numiko.com/insights/best-museum-and-gallery-websites-2026)
- [Purple Rock Scissors: Best Museum Websites](https://www.purplerockscissors.com/journal/best-museum-websites-to-inspire-your-next-redesign)
- [DesignRush: Best Museum Website Designs 2025](https://www.designrush.com/best-designs/websites/museum)
- [Awwwards: Frans Hals Museum](https://www.awwwards.com/sites/franshals-museum)
- [The Drum: Frans Hals Museum case study](https://www.thedrum.com/news/2018/06/18/contemporary-meets-classical-digital-invite-the-frans-hals-museum)
- [Oomph: Museum Visit Page Best Practices](https://www.oomphinc.com/insights/museum-visit-page-best-practices/)
- [Mapsted: Museum Digital Transformation](https://mapsted.com/blog/how-museum-digital-transformation-reshaping-visitor-experience)
- [Codrops: Scroll-Revealed WebGL Gallery with GSAP + Astro](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)
- [Webby Awards: Cultural Institutions 2025](https://winners.webbyawards.com/winners/websites-and-mobile-sites/general-desktop-mobile-sites/cultural-institutions)
- [Jotform: QR Codes in Museums](https://www.jotform.com/blog/qr-code-museum/)
