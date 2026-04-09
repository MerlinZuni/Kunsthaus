# Phase 2: Static Homepage - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-09
**Phase:** 02-static-homepage
**Areas discussed:** Hero section, Navigation bar, Section composition, Exhibition cards, Sticky CTA + Mode toggle

---

## Hero Section

| Option | Description | Selected |
|--------|-------------|----------|
| Full-bleed image with text overlay | Large exhibition image fills viewport, title overlaid | |
| Split layout — image + text side by side | Image on one side, text on other, asymmetric grid | |
| Minimal text hero — image below fold | Large typographic statement, image on scroll | |
| User's own vision | Carousel with scattered layered images + monumental typography | ✓ |

**User's choice:** Carousel with large right-aligned "KUNST / HAUS / ZÜRICH" typography on topmost z-index. Exhibition images layer underneath in offset scattered arrangement, grid-aligned but not to each other. Images fade in and scale down, stacking.

### CTA Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Exhibition detail (future page) | Each CTA links to exhibition — placeholder href | ✓ |
| Ticket / visit info | Scrolls to visit info or links to ticketing | |
| Varies per slide | Each slide has its own CTA purpose | |

### Carousel Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Labeled progress tabs | Tab per exhibition with title + fill bar for auto-play | ✓ |
| Dots + active title | Standard dots with active title displayed separately | |
| You decide | Claude picks | |

**Notes:** Research on MoMA, Tate, Rijksmuseum confirmed labeled tabs outperform dots. User agreed with recommendation. Pause/play toggle added for WCAG 2.2 compliance.

---

## Navigation Bar

### Layout (from Figma)

**Figma reference:** node-id=25-1911 in Kunsthaus-Pitch-Design

Figma shows: Search icon (left), KUNSTHAUS ZÜRICH logo center (mix-blend-exclusion), 3 nav links + language switcher (right). #EBEBEB background, DINNextW1G Regular 16px.

**User decision:** Expand beyond Figma's 3 items to include full nav links.

**Later revision:** "I'm at the museum" removed from nav — mode toggle moved to floating bottom buttons / sticky bottom bar.

**Final nav items:** Visit us, Collection, Exhibitions, About + EN/DE/FR language switcher.

### Scroll Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Logo Island + Velocity-aware | Nav dissolves, logo persists as island, velocity-aware reveal | ✓ |
| Morphing Capsule | Full bar compresses to centered pill with spring easing | |
| Logo Island + Magnetic Reveal | Logo island + re-expand on cursor proximity to top | |

**Notes:** Research on Fondation Louis Vuitton, Burberry, Bottega Veneta, MoMA, Tate informed the recommendation.

### Search Overlay

| Option | Description | Selected |
|--------|-------------|----------|
| Visual shell only | Overlay with input + hardcoded suggestions, no logic | ✓ |
| Client-side JSON search | Actual search across content collections | |

### Mobile Menu

| Option | Description | Selected |
|--------|-------------|----------|
| Full-screen overlay with large type | Full viewport takeover, large DINNextW1G, logo visible | ✓ |
| Slide-in drawer | ~80% width panel, content blurred behind | |

**User additions:** Logo must stay visible when menu is open. Language options (EN/DE/FR) displayed below nav links (not in a dropdown).

### Interaction States (site-wide)

| Option | Description | Selected |
|--------|-------------|----------|
| Clip-path wipe + scale pulse | Wipe hover (200ms/350ms), scale touch, focus-visible outline | ✓ |
| Character stagger + opacity flash | Letter Y-shift stagger, opacity flash on tap | |

**Notes:** Research covered desktop hover, mobile touch, tablet, keyboard/accessibility. Asymmetric timing (faster in, slower out) documented as key quality signal. User confirmed same pattern for ALL interactive elements site-wide including CTAs (inverse wipe for filled buttons).

---

## Section Composition

### Grid Layouts

| Option | Description | Selected |
|--------|-------------|----------|
| Varied asymmetric layouts | Each section uses grid differently | ✓ |
| Uniform contained width | All sections use same centered width | |

### Vertical Spacing

| Option | Description | Selected |
|--------|-------------|----------|
| Generous — 128px+ | Large gaps, gallery-like pacing | ✓ |
| Moderate — 64-96px | Comfortable, natural flow | |

### 3D Stacking Scroll

**User's vision:** Each new section slides over previous. Covered section scales down, rotates slightly (varied direction), fades opacity. Like a deck of cards being dealt.

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle — 90% scale, 2-3deg tilt | Noticeable but restrained | ✓ |
| Dramatic — 75% scale, 5-8deg tilt | More theatrical | |

| Option | Description | Selected |
|--------|-------------|----------|
| Partially visible — peeking edges | Scaled edges visible as stack | |
| Fully covered | Each section completely covers previous | ✓ |

**Mobile behavior:** Research confirmed scroll-hijacking is a UX antipattern on mobile. Desktop: full effect. Tablet: no rotation. Mobile: no pinning, fade-up transitions. Reduced motion: static.

### Background Rotation

**User specified:** 4-step cycle: off-white → pure white → concrete light (textured) → concrete warm (textured) → repeat.

### In-Page Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Fraction counter + progress arc | Small "03/07" with progress arc, bottom corner | ✓ |
| Floating pill navigator | Bottom-center pill with section name + arrows | |
| Typographic progress rail | Vertical line with section title labels | |

**Notes:** Research on Hermès, Rijksmuseum microsites. Zero spatial conflict with logo island. Identical on all viewports.

### Footer (from Figma)

**Figma reference:** node-id=16-258 in Kunsthaus-Pitch-Design

User specified: marquee "KUNSTHAUS ZÜRICH" scrolling right-to-left continuously. CSS animation, pauses on hover. Content in both EN and DE for language switcher demo.

### Accessibility Toggle

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — in footer + nav | Toggle in footer and collapsed nav, localStorage | ✓ |
| Yes — footer only | Toggle in footer only | |
| No — OS detection only | Rely on prefers-reduced-motion | |

**Notes:** User asked about how reduced motion is triggered. Discussion covered OS-level settings, WCAG 2.1 SC 2.3.3, shared devices, museum demographic. User agreed manual toggle is important.

### Immersive Storytelling Patterns

| Option | Description | Selected |
|--------|-------------|----------|
| Mix all four patterns | Different pattern per section | |
| Focus on 2 patterns | Keep implementation focused for timeline | ✓ |
| You decide | Claude assigns per content type | |

| Option | Description | Selected |
|--------|-------------|----------|
| Cinematic Reveal + Pinned Narrative | Image reveals + pinned card sequences | ✓ |
| Cinematic Reveal + Parallax Composition | Image reveals + layered depth | |
| Pinned Narrative + Ticker Interrupt | Card sequences + ticker teasers | |

**User addition:** Offerings section must include shops, restaurant, and bar — not just membership and tours.

---

## Exhibition Cards

### Card Style

| Option | Description | Selected |
|--------|-------------|----------|
| Image-dominant with minimal text | Large image, text below, 60/40 vh split | ✓ |
| Editorial split — image + text side by side | Alternating left/right columns | |
| Full-bleed cinematic | One card fills entire viewport | |

**User note:** Ensure all text is viewable within one viewport without scrolling. Mobile: 50/50 split.

### Card Transitions

| Option | Description | Selected |
|--------|-------------|----------|
| Crossfade with offset slide | Fade out + slide, alternating direction | ✓ |
| Hard cut with stagger | Elements enter separately with staggered timing | |

### Image Ratio

| Option | Description | Selected |
|--------|-------------|----------|
| 3:2 landscape | Standard exhibition photography ratio | ✓ |
| 4:3 landscape | Slightly taller | |
| Flexible — object-fit: cover | Fixed container, any image ratio | |

### Hero vs Section Cards

| Option | Description | Selected |
|--------|-------------|----------|
| Separate hero display | Hero has own scattered layout, section has own cards | ✓ |
| Same card, different context | One component used in both places | |

---

## Sticky CTA + Mode Toggle

**User initiated:** Team requires two significant CTAs — buy tickets and plan a visit / mode switch.

**Evolution during discussion:**
1. Initially proposed as two stacked buttons (bottom-right)
2. User clarified "I'm at the museum" is a mode toggle, not just a link
3. User moved mode toggle out of the main navigation entirely
4. Desktop: floating paired buttons (bottom-right). Mobile: sticky bottom bar.
5. Fraction counter repositioned to bottom-left.
6. Nav updated: "I'm at the museum" removed from nav links.

**Final labels:** "Plan a visit" ↔ "I'm here" (toggle), "Tickets" (CTA). Tested across EN/DE/FR.

---

## Claude's Discretion

- Exact grid column assignments per section
- Individual section layouts for Key-info, Events, Planning details
- Search overlay visual design
- Language switcher dropdown styling
- Floating button sizing and spacing
- Footer responsive column stacking
- Image placeholder strategy
- Logo island transition details
- Hamburger open/close animation

## Deferred Ideas

- Functional search — backlog 999.1
- Exhibition detail pages — future phase
- Real ticketing integration — out of scope
- Geolocation mode switching — Phase 3
- QR code mode triggers — Phase 3
- Mode switching animations — Phase 3
- All scroll/hover/text animations — Phase 3
- Shop overlay panel interaction — Phase 3
