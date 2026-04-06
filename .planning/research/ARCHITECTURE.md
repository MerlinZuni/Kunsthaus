# Architecture Patterns

**Domain:** Museum website redesign prototype (Astro + GSAP)
**Researched:** 2026-04-06

## Recommended Architecture

### High-Level Structure

```
Kunsthaus/
├── public/
│   ├── fonts/
│   └── images/              # Static assets (museum images, icons)
├── src/
│   ├── animations/          # GSAP animation modules (pure JS)
│   │   ├── orchestrator.ts  # Central animation registry + lifecycle
│   │   ├── scroll.ts        # ScrollTrigger-based animations
│   │   ├── hover.ts         # Cursor/hover interactions
│   │   ├── text.ts          # SplitText typographic motion
│   │   └── transitions.ts   # Mode-switch transition sequences
│   ├── components/          # Astro components (.astro)
│   │   ├── global/          # Header, Footer, ModeToggle, Nav
│   │   ├── sections/        # Homepage section blocks
│   │   ├── ui/              # Buttons, cards, tags, badges
│   │   └── exhibits/        # Exhibit-specific components
│   ├── content/             # JSON data files
│   │   ├── exhibitions.json
│   │   ├── navigation.json
│   │   ├── hero.json
│   │   └── site.json        # Global site metadata
│   ├── layouts/
│   │   └── BaseLayout.astro # Single layout: head, mode state, animation bootstrap
│   ├── pages/
│   │   └── index.astro      # Homepage (only page for prototype)
│   ├── scripts/
│   │   ├── mode-manager.ts  # Planning/On-site state + triggers
│   │   └── geolocation.ts   # Opt-in proximity detection
│   └── styles/
│       ├── tokens.css       # Design tokens as custom properties
│       ├── modes.css         # Mode-specific token overrides
│       ├── global.css        # Reset, typography, base styles
│       └── animations.css    # Animation utility classes (will-change, etc.)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **BaseLayout** | HTML shell, meta, font loading, animation bootstrap, mode state init | All pages, mode-manager, orchestrator |
| **ModeToggle** | UI control for Planning/On-site switch | mode-manager (reads/writes state) |
| **Nav** | Navigation bar, adapts items per mode | mode-manager (reads state), navigation.json |
| **Hero section** | Primary visual, scroll-driven parallax | scroll animations, hero.json |
| **Exhibition sections** | Exhibition cards/grid, mode-dependent content | exhibitions.json, mode-manager |
| **Animation orchestrator** | Registers, initializes, cleans up all GSAP instances | All animated components |
| **Mode manager** | Single source of truth for current mode | ModeToggle, Nav, sections, CSS via data attribute |

## Data Flow

### Content: JSON to Templates

```
src/content/*.json
       |
       v  (Astro frontmatter import)
  Layout / Page (.astro)
       |
       v  (props passed down)
  Section Components (.astro)
       |
       v  (props passed down)
  UI Components (.astro)
```

Astro components import JSON at build time in frontmatter:

```astro
---
import exhibitions from '../content/exhibitions.json';
import hero from '../content/hero.json';
---
```

This renders to static HTML. The JSON structure should mirror what a future CMS API would return -- flat, normalized, with IDs for cross-referencing.

**JSON shape recommendation:**

```json
// exhibitions.json
{
  "exhibitions": [
    {
      "id": "monet-2026",
      "title": "Monet: Immersion",
      "subtitle": "A journey through light",
      "dates": { "start": "2026-03-15", "end": "2026-07-20" },
      "image": "/images/exhibitions/monet-hero.jpg",
      "planning": {
        "description": "Plan your visit to our landmark Monet exhibition...",
        "cta": "Book tickets"
      },
      "onsite": {
        "description": "You are steps away from Room 4...",
        "cta": "View exhibit map",
        "rooms": ["room-4", "room-5"]
      }
    }
  ]
}
```

Each content item has both `planning` and `onsite` sub-objects. Components render whichever sub-object matches the active mode. This avoids duplicating entire entries and keeps the CMS migration path clean (one content model, two presentation variants).

### Mode State: Data Attribute on HTML Element

```
User action (toggle / geolocation / QR)
       |
       v
  mode-manager.ts
       |
       ├─→ document.documentElement.dataset.mode = "planning" | "onsite"
       |
       ├─→ localStorage.setItem("kh-mode", mode)
       |
       └─→ window.dispatchEvent(new CustomEvent("kh:mode-change", { detail: { mode } }))
              |
              ├─→ CSS reacts via [data-mode="onsite"] selectors (instant)
              ├─→ ModeToggle updates UI state
              ├─→ Sections swap visible content blocks
              └─→ transitions.ts plays mode-switch animation
```

**Why `data-mode` on `<html>`:** CSS custom properties cascade from root. Changing one attribute at the top triggers all mode-specific styles instantly with zero JS per-component. Components that need JS-side mode awareness listen to the `kh:mode-change` custom event.

**Mode triggers:**

| Trigger | Implementation | Priority |
|---------|---------------|----------|
| Manual toggle | Click handler on ModeToggle component | Build first |
| QR code | URL param `?mode=onsite&exhibit=monet-2026` parsed on page load | Build second |
| Geolocation | Opt-in prompt, check coordinates against museum bounds | Build third |

### Animation Lifecycle

```
Page load
    |
    v
BaseLayout <script> runs
    |
    v
orchestrator.init()
    ├── Creates gsap.Context(rootElement)
    ├── Registers ScrollTrigger plugin
    ├── Registers SplitText plugin (if using)
    ├── Calls each animation module's setup()
    │     ├── scroll.setup(ctx)    → scroll-driven parallax, reveals
    │     ├── text.setup(ctx)      → heading/text entrance animations
    │     ├── hover.setup(ctx)     → cursor effects, card interactions
    │     └── transitions.setup(ctx) → mode-switch sequences
    └── Returns cleanup function

View transition / page unload
    |
    v
orchestrator.cleanup()
    ├── ctx.revert()  → kills all GSAP instances, reverts DOM
    └── Nullifies references
```

**Critical pattern -- GSAP Context wrapping:**

```typescript
// src/animations/orchestrator.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupScrollAnimations } from './scroll';
import { setupTextAnimations } from './text';
import { setupHoverAnimations } from './hover';
import { setupTransitions } from './transitions';

gsap.registerPlugin(ScrollTrigger);

let ctx: gsap.Context | null = null;

export function init() {
  cleanup(); // safety: kill any existing context

  ctx = gsap.context(() => {
    setupScrollAnimations();
    setupTextAnimations();
    setupHoverAnimations();
    setupTransitions();
  }, document.documentElement);
}

export function cleanup() {
  if (ctx) {
    ctx.revert();
    ctx = null;
  }
}

// Bootstrap (called from BaseLayout inline script)
document.addEventListener('astro:page-load', () => init());
document.addEventListener('astro:after-swap', () => cleanup());
```

Every animation created inside `gsap.context()` is automatically tracked. Calling `ctx.revert()` kills every tween, timeline, and ScrollTrigger instance in one call, preventing memory leaks and ghost animations.

## CSS Architecture

### Token Layer (tokens.css)

```css
:root {
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  --space-2xl: 8rem;

  /* Typography */
  --font-display: 'Archivo Black', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --font-size-base: clamp(1rem, 0.9rem + 0.4vw, 1.125rem);
  --font-size-lg: clamp(1.25rem, 1rem + 1vw, 1.75rem);
  --font-size-xl: clamp(2rem, 1.5rem + 2vw, 3.5rem);
  --font-size-2xl: clamp(3rem, 2rem + 4vw, 6rem);

  /* Colors -- Planning mode defaults */
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-text: #1A1A1A;
  --color-text-muted: #6B6B6B;
  --color-accent: #0038FF;
  --color-accent-hover: #002BD4;

  /* Layout */
  --grid-columns: 12;
  --grid-gap: var(--space-md);
  --container-max: 1440px;
  --container-padding: var(--space-lg);

  /* Animation */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast: 0.2s;
  --duration-normal: 0.4s;
  --duration-slow: 0.8s;
}
```

### Mode Overrides (modes.css)

```css
[data-mode="onsite"] {
  --color-bg: #0A0A0A;
  --color-surface: #1A1A1A;
  --color-text: #F0F0F0;
  --color-text-muted: #999999;
  --color-accent: #FFD700;
  --color-accent-hover: #FFC800;
}
```

Planning mode is the default (light, institutional, editorial). On-site mode inverts to a dark, immersive palette -- the visitor is in the museum, the UI recedes, the art takes focus.

**No extra JS needed for color changes.** Setting `data-mode="onsite"` on `<html>` cascades every token change through the entire page instantly.

### Component Scoping

Astro scoped styles (automatic) for component-specific layout. Global custom properties for all themeable values. No utility-class framework (unnecessary complexity for a prototype with this timeline).

```astro
<!-- ExhibitionCard.astro -->
<article class="exhibition-card">
  <slot />
</article>

<style>
  .exhibition-card {
    background: var(--color-surface);
    color: var(--color-text);
    padding: var(--space-lg);
    border-radius: 8px;
    transition: background var(--duration-normal) var(--ease-out),
                color var(--duration-normal) var(--ease-out);
  }
</style>
```

Components use tokens, never raw values. Mode switches animate via CSS transitions on the custom property consumers.

## Patterns to Follow

### Pattern 1: Content-Aware Mode Rendering

Sections render both mode variants but only show the active one.

```astro
---
// ExhibitionHero.astro
const { exhibition } = Astro.props;
---
<section class="exhibition-hero">
  <div class="mode-content" data-show="planning">
    <h2>{exhibition.title}</h2>
    <p>{exhibition.planning.description}</p>
    <a href="#">{exhibition.planning.cta}</a>
  </div>
  <div class="mode-content" data-show="onsite">
    <h2>{exhibition.title}</h2>
    <p>{exhibition.onsite.description}</p>
    <a href="#">{exhibition.onsite.cta}</a>
  </div>
</section>

<style>
  .mode-content { display: none; }
  :global([data-mode="planning"]) .mode-content[data-show="planning"] { display: block; }
  :global([data-mode="onsite"]) .mode-content[data-show="onsite"] { display: block; }
</style>
```

Both variants are in the DOM (static HTML, no hydration cost). CSS shows the correct one. Mode-switch animation can crossfade between them.

### Pattern 2: Animation Module Separation

Each animation module is a pure function, no component coupling.

```typescript
// src/animations/scroll.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function setupScrollAnimations() {
  // Parallax hero
  gsap.to('[data-parallax]', {
    yPercent: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: '[data-parallax]',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Reveal-on-scroll sections
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}
```

Animation modules target `data-*` attributes, not component class names. Components opt in to animations by adding `data-parallax`, `data-reveal`, etc. This decouples animation logic from component structure.

### Pattern 3: Mode Manager as Event Bus

```typescript
// src/scripts/mode-manager.ts
type Mode = 'planning' | 'onsite';

const STORAGE_KEY = 'kh-mode';
const EVENT_NAME = 'kh:mode-change';

export function getMode(): Mode {
  return (localStorage.getItem(STORAGE_KEY) as Mode) || 'planning';
}

export function setMode(mode: Mode) {
  localStorage.setItem(STORAGE_KEY, mode);
  document.documentElement.dataset.mode = mode;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { mode } }));
}

export function initMode() {
  // Check URL params first (QR code trigger)
  const params = new URLSearchParams(window.location.search);
  const urlMode = params.get('mode') as Mode | null;

  if (urlMode === 'planning' || urlMode === 'onsite') {
    setMode(urlMode);
  } else {
    setMode(getMode()); // restore from localStorage or default
  }
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Framework Components for Interactivity

**What:** Using React/Vue/Svelte islands for the mode toggle or animated sections.
**Why bad:** Adds hydration JS, increases bundle size, complicates GSAP integration. GSAP works on DOM elements directly -- framework abstraction is overhead with no benefit here.
**Instead:** Vanilla JS in `<script>` tags within Astro components. GSAP is already imperative; let it be imperative.

### Anti-Pattern 2: GSAP Timelines in Component Script Tags

**What:** Each component creates its own `gsap.timeline()` independently.
**Why bad:** No coordination between animations, no central cleanup, ScrollTrigger conflicts when components are added/removed.
**Instead:** Central animation modules that scan for `data-*` attributes. Components declare intent, animation modules execute.

### Anti-Pattern 3: Hardcoding Content in Templates

**What:** Writing exhibition titles, descriptions, dates directly in `.astro` files.
**Why bad:** Kills the CMS-ready architecture claim. Content changes require code changes.
**Instead:** All text in JSON files. All images referenced by path in JSON. Templates only contain structure and logic.

### Anti-Pattern 4: Per-Component Mode Checking

**What:** Every component imports mode-manager and checks `getMode()` independently.
**Why bad:** Scattered state reads, potential race conditions, impossible to animate mode transitions cohesively.
**Instead:** One `data-mode` attribute on `<html>`. CSS handles visual changes. Only components with JS-driven mode behavior (like the toggle itself) listen to the custom event.

## Scalability Considerations

| Concern | Prototype (now) | Production (future CMS) |
|---------|-----------------|------------------------|
| Content | JSON files imported at build | CMS API fetched at build (Astro content collections) |
| Pages | Single homepage | Multi-page with dynamic routes (`/exhibitions/[slug]`) |
| Animations | All in one GSAP context | Per-page contexts, code-split animation modules |
| Mode state | localStorage + data attribute | Same, possibly with server-side cookie for SSR |
| i18n | Not needed | Astro i18n routing (`/de/`, `/en/`, `/fr/`) |
| Images | Static in `/public` | Astro Image component with optimization |

The JSON-to-template pattern maps directly to Astro Content Collections. When a CMS is added, the migration path is: replace JSON imports with `getCollection()` calls, keep all templates and components unchanged.

## Suggested Build Order

Dependencies flow top-to-bottom. Each layer requires the ones above it.

```
Phase 1: Foundation (no visible output yet)
├── Project scaffold (Astro init, GSAP install)
├── tokens.css + modes.css + global.css
├── BaseLayout.astro
├── JSON data files (mock content)
└── Mode manager (localStorage + data attribute + URL params)

Phase 2: Static Structure (visible, not animated)
├── Global components (Header, Nav, ModeToggle, Footer)
├── Homepage sections (Hero, Exhibitions, Highlights)
├── UI components (Cards, Buttons, CTAs)
└── Mode-dependent content rendering ([data-show] pattern)

Phase 3: Animation (brings it to life)
├── Animation orchestrator + GSAP context lifecycle
├── Scroll animations (parallax, reveals)
├── Text animations (heading entrances)
├── Hover/cursor effects
└── Mode-switch transition animation

Phase 4: Polish + Edge Cases
├── Geolocation opt-in prompt
├── QR code deep-link handling
├── Responsive breakpoint tuning
├── Performance audit (will-change, GPU layers)
└── Presentation screenshots
```

**Why this order:**
1. Foundation first because everything depends on tokens, layout, and mode state.
2. Static structure second because you need visible components before you can animate them, and the design team can review layout/content fidelity without waiting for animation work.
3. Animation third because it decorates existing structure. Animations target `data-*` attributes on already-rendered DOM.
4. Polish last because geolocation and QR are secondary triggers (manual toggle already works), and responsive tuning is faster once all content is in place.

## Sources

- [Astro Project Structure](https://docs.astro.build/en/basics/project-structure/) -- official docs
- [Astro Components](https://docs.astro.build/en/basics/astro-components/) -- official docs
- [Astro Layouts](https://docs.astro.build/en/basics/layouts/) -- official docs
- [Astro Styles and CSS](https://docs.astro.build/en/guides/styling/) -- official docs
- [GSAP Context API](https://gsap.com/docs/v3/GSAP/gsap.context()) -- official GSAP docs
- [Enhancing Astro View Transitions with GSAP](https://vaskopavic.com/blog/enhancing-astro-view-transitions-with-gsap-animations/) -- GSAP + Astro lifecycle pattern
- [GSAP in Astro Step-by-Step](https://www.launchfa.st/blog/gsap-astro/) -- integration guide
- [Astro + GSAP Portfolio (Codrops)](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/) -- real-world architecture reference
- [Scroll-Driven Animated Grid (Codrops)](https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/) -- ScrollTrigger orchestration patterns
- [GSAP ScrollTrigger + Astro View Transitions](https://gsap.com/community/forums/topic/40950-compatibility-with-gsap-scrolltrigger-astro-view-transitiosn-api/) -- community discussion on cleanup
