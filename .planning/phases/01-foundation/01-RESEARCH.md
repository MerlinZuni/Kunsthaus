# Phase 1: Foundation - Research

**Researched:** 2026-04-06
**Domain:** Astro 6 project scaffold, CSS custom property theming, proportional grid system, JSON content layer, smooth scrolling, dev tooling
**Confidence:** HIGH

## Summary

Phase 1 establishes the entire technical foundation for the Kunsthaus Zurich prototype. The core stack is Astro 6.1.x with GSAP 3.14.x and Lenis 1.3.x for smooth scrolling, using JSON content collections for CMS-ready data, CSS custom properties with `[data-mode]` attribute switching for dual-mode theming (Planning/On-site), and a 48-track proportional grid system with a Leva-powered dev overlay.

All libraries in this stack are stable and well-documented. Astro 6 has built-in content collections with `file()` loader for JSON, built-in Fonts API for self-hosting DINNextW1G, and native TypeScript support. Leva (React GUI) works inside an Astro React island via `@astrojs/react`. The grid system is pure CSS Grid with custom properties -- no library needed.

**Primary recommendation:** Scaffold Astro 6 first, establish CSS token architecture and grid system as the structural base, then layer in content collections, Lenis scroll, and the Leva dev overlay as progressive additions.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Theme depth is colors + mood only -- typography and spacing stay consistent across modes
- **D-02:** Mode switching via `[data-mode]` attribute on HTML element (`html[data-mode='planning']` / `html[data-mode='onsite']`)
- **D-03:** Token architecture: Primitives -> Semantic -> Component. Mode switches at the semantic layer
- **D-04:** Planning mode palette -- Background: #fbf8f7, Text: #272523. Concrete tones: #EBEBEB, #C1BFB2, #A4A197. CSS noise/grain texture on concrete elements
- **D-05:** On-site mode palette -- Background: #272523, Text: #fbf8f7. Warm dark inverse
- **D-06:** Concrete mid-tones only for decorative elements -- won't meet AA contrast
- **D-07:** Single typeface: DINNextW1G. Weights: Light (300), Regular (400), Medium (500), Bold (700)
- **D-08:** Type scale: Perfect Fourth ratio (1.333) modular scale
- **D-09:** 4px base unit spacing system -- tokens at 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- **D-10:** WCAG AA compliance, prefers-reduced-motion, semantic HTML, content visible without JS
- **D-11:** Three content collections: `src/content/planning/`, `src/content/onsite/`, `src/content/shared/`
- **D-12:** i18n-ready JSON: DE + EN active, FR placeholder
- **D-13:** Planning content follows priority hierarchy from brief
- **D-14:** Pull full homepage content from kunsthaus.ch for Planning mock data
- **D-15:** On-site features Kerry James Marshall exhibition
- **D-16:** On-site sections: Artwork highlights, Audio guide teasers, Practical on-site info
- **D-17:** On-site entry via QR code per room/exhibition -- URL parameter triggers mode
- **D-18:** Membership paywall is visual mockup only
- **D-19:** One JSON file per exhibition
- **D-20:** 48-track fine grid. 12 layout columns = every 4th track. Full-bleed
- **D-21:** 8 horizontal rows, sparse, tied to type-scale rhythm
- **D-22:** Grid cells are tall narrow rectangles (height ~ 6x width). Grid area is square (1:1)
- **D-23:** Content placement fully flexible -- grid provides alignment points, not constraints
- **D-24:** Responsive: Desktop 12 cols -> Tablet 8 cols -> Mobile 4 cols
- **D-25:** Grid overlay visible only on base page layer
- **D-26:** Leva (React island) for GUI controls. Panel is sole activation method
- **D-27:** Leva controls: toggle grid, vertical density (12/24/48), full-viewport vs content-area, horizontal rows, color + opacity
- **D-28:** Vertical lines at left edge of each column (start lines only, not filled bands)

### Claude's Discretion
- Exact Leva panel layout and positioning
- Grid line styling details (color defaults, dash patterns)
- Astro Content Collections schema field naming
- Zod validation specifics
- CSS `@layer` organization details
- Lenis smooth scroll configuration
- How to implement CSS noise/grain texture on concrete elements

### Deferred Ideas (OUT OF SCOPE)
- Membership authentication system -- beyond visual mockup
- Exhibition-specific color palette system (ADV-01) -- v2 requirement
- FT Kunst typeface -- DINNextW1G only for this prototype
- After-visit retention mode
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TECH-01 | Astro 6 project with GSAP 3.14 and Lenis smooth scroll | Standard Stack section: Astro 6.1.3, GSAP 3.14.2, Lenis 1.3.21. Architecture Patterns: Lenis+GSAP integration code |
| TECH-02 | JSON content layer for all page text and data (CMS-ready) | Architecture Patterns: Content collections with file() loader, Zod schemas, i18n structure |
| TECH-03 | CSS custom properties architecture with mode-based theming (`[data-mode]` attribute) | Architecture Patterns: 3-layer token system, @layer cascade, mode switching pattern |
| TECH-04 | Accessible -- reduced-motion, semantic HTML, content visible without JS | Common Pitfalls: accessibility patterns, no-JS fallback strategy |
| GRID-01 | Principled grid system based on classical proportional design | Architecture Patterns: 48-track CSS Grid implementation, cell proportions |
| GRID-02 | Responsive breakpoint adaptations (desktop, tablet, mobile) | Architecture Patterns: responsive grid scaling (12/8/4 columns) |
| GRID-03 | Modular composition supporting flexible content arrangement | Architecture Patterns: named grid lines, flexible placement |
| GRID-04 | Dev-mode grid overlay with toggle visibility and GUI controls | Standard Stack: Leva 0.10.1, React island pattern |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 6.1.3 | Static site framework | Ships zero JS by default, islands architecture, built-in content collections, Fonts API, Vite 7. Node 22+ required. |
| gsap | 3.14.2 | Animation engine | Industry standard. All plugins free (ScrollTrigger, SplitText, Flip). Foundation for Phase 3. |
| lenis | 1.3.21 | Smooth scrolling | Lightweight (7KB gzip), pairs with GSAP ScrollTrigger cleanly. |
| typescript | 5.x (bundled) | Type safety | Built into Astro 6 by default. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/react | 5.0.2 | React islands in Astro | Required for Leva GUI controls |
| react | 19.2.4 | React runtime | Peer dependency for @astrojs/react and Leva |
| react-dom | 19.2.4 | React DOM | Peer dependency for @astrojs/react and Leva |
| leva | 0.10.1 | React GUI controls | Dev-mode grid overlay panel |
| prettier | 3.x | Code formatting | Consistent formatting |
| prettier-plugin-astro | latest | Astro formatting | Format .astro files |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Leva | Tweakpane 4.0.5 | Tweakpane is framework-agnostic (no React dependency), but decision D-26 locks Leva. Leva's React-first API is simpler inside an Astro React island. |
| CSS Custom Properties | Open Props 2.x | Open Props provides pre-built tokens but adds indirection. Custom tokens from Figma are more precise for this project. |
| Vanilla CSS | Tailwind CSS 4.x | Decision made in stack research -- direct CSS control better for bespoke museum prototype with precise animation needs. |

**Installation:**
```bash
# Create Astro project
npm create astro@latest kunsthaus -- --template minimal --typescript strict

# Core dependencies
npm install gsap lenis

# React island support (for Leva)
npx astro add react
npm install leva

# Dev dependencies
npm install -D prettier prettier-plugin-astro
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── assets/
│   └── fonts/
│       └── DINNextW1G/          # Self-hosted font files (woff2)
├── components/
│   ├── GridOverlay.tsx          # Leva React island (dev only)
│   ├── Head.astro               # Meta, fonts, preloads
│   └── SkipNav.astro            # Accessibility skip-nav
├── content/
│   ├── planning/
│   │   └── homepage.json        # Planning mode homepage data (DE+EN)
│   ├── onsite/
│   │   └── kerry-james-marshall.json  # Exhibition data (DE+EN)
│   └── shared/
│       └── navigation.json      # Shared UI strings (DE+EN)
├── content.config.ts            # Collection definitions + Zod schemas
├── layouts/
│   └── BaseLayout.astro         # html[data-mode], CSS tokens, Lenis init
├── pages/
│   └── index.astro              # Homepage
└── styles/
    ├── layers.css               # @layer declarations
    ├── reset.css                # CSS reset
    ├── tokens/
    │   ├── primitives.css       # Raw color values, spacing values
    │   ├── semantic.css         # Mode-aware aliases (Planning default)
    │   └── components.css       # Component-level tokens
    ├── typography.css           # Type scale, font-face (if not using Fonts API)
    ├── grid.css                 # Grid system definitions
    └── base.css                 # Global base styles
```

### Pattern 1: Three-Layer CSS Token Architecture

**What:** Primitives -> Semantic -> Component token layers with mode switching at the semantic layer.
**When to use:** Always -- this is the theming foundation.

```css
/* src/styles/tokens/primitives.css */
@layer tokens {
  :root {
    /* Palette - raw values, never used directly in components */
    --color-offwhite: #fbf8f7;
    --color-softblack: #272523;
    --color-concrete-light: #EBEBEB;
    --color-concrete-warm: #C1BFB2;
    --color-concrete-shadow: #A4A197;

    /* Spacing - 4px base unit */
    --space-1: 0.25rem;   /* 4px */
    --space-2: 0.5rem;    /* 8px */
    --space-3: 0.75rem;   /* 12px */
    --space-4: 1rem;      /* 16px */
    --space-6: 1.5rem;    /* 24px */
    --space-8: 2rem;      /* 32px */
    --space-12: 3rem;     /* 48px */
    --space-16: 4rem;     /* 64px */
    --space-24: 6rem;     /* 96px */
    --space-32: 8rem;     /* 128px */
  }
}
```

```css
/* src/styles/tokens/semantic.css */
@layer tokens {
  /* Planning mode (default) */
  :root,
  html[data-mode="planning"] {
    --color-surface: var(--color-offwhite);
    --color-text: var(--color-softblack);
    --color-accent: var(--color-concrete-warm);
    --color-decorative: var(--color-concrete-light);
    --color-decorative-shadow: var(--color-concrete-shadow);
  }

  /* On-site mode */
  html[data-mode="onsite"] {
    --color-surface: var(--color-softblack);
    --color-text: var(--color-offwhite);
    --color-accent: var(--color-concrete-warm);
    --color-decorative: var(--color-concrete-shadow);
    --color-decorative-shadow: var(--color-concrete-light);
  }
}
```

### Pattern 2: Astro Content Collections with file() Loader

**What:** JSON-based content collections with Zod schema validation for type-safe data.
**When to use:** All page content -- never hardcode text in templates.

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// i18n text schema -- reusable for all localized strings
const localizedText = z.object({
  de: z.string(),
  en: z.string(),
  fr: z.string().optional(), // placeholder for future
});

const planningHomepage = defineCollection({
  loader: file("src/content/planning/homepage.json"),
  schema: z.object({
    id: z.string(),
    section: z.string(),
    title: localizedText,
    body: localizedText.optional(),
    image: z.string().optional(),
    priority: z.number(), // maps to content priority hierarchy
  }),
});

const onsiteExhibition = defineCollection({
  loader: file("src/content/onsite/kerry-james-marshall.json"),
  schema: z.object({
    id: z.string(),
    title: localizedText,
    artist: z.string(),
    artworks: z.array(z.object({
      id: z.string(),
      title: localizedText,
      description: localizedText,
      image: z.string(),
      room: z.string(),
      audioGuide: z.boolean().default(false),
    })),
  }),
});

const shared = defineCollection({
  loader: file("src/content/shared/navigation.json"),
  schema: z.object({
    id: z.string(),
    label: localizedText,
    href: z.string().optional(),
  }),
});

export const collections = {
  planning: planningHomepage,
  onsite: onsiteExhibition,
  shared,
};
```

```astro
---
// Usage in a page
import { getCollection } from 'astro:content';

const sections = await getCollection('planning');
const sorted = sections.sort((a, b) => a.data.priority - b.data.priority);
const lang = 'de'; // or from URL/cookie
---
{sorted.map(section => (
  <section>
    <h2>{section.data.title[lang]}</h2>
    {section.data.body && <p>{section.data.body[lang]}</p>}
  </section>
))}
```

### Pattern 3: 48-Track Proportional Grid System

**What:** CSS Grid with 48 vertical tracks and 8 horizontal rows. 12 layout columns = every 4th track.
**When to use:** Page-level layout container. Content aligns to grid lines freely.

```css
/* src/styles/grid.css */
@layer layout {
  .grid-container {
    display: grid;
    grid-template-columns: repeat(48, 1fr);
    grid-template-rows: repeat(8, 1fr);
    aspect-ratio: 1 / 1; /* Square container per spec */
    width: 100%;
    min-height: 100vh;
  }

  /* Layout column helpers -- every 4th track = 1 layout column */
  /* Column 1 = tracks 1-4, Column 2 = tracks 5-8, etc. */
  .col-span-1  { grid-column: span 4; }
  .col-span-2  { grid-column: span 8; }
  .col-span-3  { grid-column: span 12; }
  .col-span-4  { grid-column: span 16; }
  .col-span-6  { grid-column: span 24; }
  .col-span-12 { grid-column: span 48; }

  /* Responsive breakpoints */
  @media (max-width: 1024px) {
    .grid-container {
      grid-template-columns: repeat(32, 1fr); /* 8 layout cols */
    }
  }

  @media (max-width: 640px) {
    .grid-container {
      grid-template-columns: repeat(16, 1fr); /* 4 layout cols */
    }
  }
}
```

**Important:** The 1:1 aspect ratio on the container enforces the cell proportion spec (height ~ 6x width when 48 cols and 8 rows). In practice, content will break out of a strict 1:1 container, so the grid container should NOT constrain page height. Use `aspect-ratio: 1/1` only on the dev overlay visualization, not on the actual content grid. The content grid uses `grid-template-columns: repeat(48, 1fr)` with `grid-auto-rows` based on the row height calculation.

### Pattern 4: Lenis + GSAP Integration in Astro

**What:** Initialize Lenis smooth scroll and sync with GSAP ScrollTrigger.
**When to use:** BaseLayout.astro -- runs on every page.

```astro
<!-- In BaseLayout.astro -->
<script>
  import Lenis from 'lenis';
  import 'lenis/dist/lenis.css';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
</script>
```

### Pattern 5: Leva Dev Grid Overlay as React Island

**What:** React component with Leva GUI for toggling grid visualization.
**When to use:** Dev-only component, conditionally rendered.

```tsx
// src/components/GridOverlay.tsx
import { useControls } from 'leva';

export default function GridOverlay() {
  const { visible, density, fullViewport, showRows, color, opacity } = useControls('Grid', {
    visible: { value: false, label: 'Show Grid' },
    density: { value: 12, options: [12, 24, 48], label: 'Column Density' },
    fullViewport: { value: true, label: 'Full Viewport' },
    showRows: { value: false, label: 'Show Rows' },
    color: { value: '#ff0000', label: 'Line Color' },
    opacity: { value: 0.15, min: 0, max: 1, step: 0.01, label: 'Opacity' },
  });

  if (!visible) return null;

  const tracks = density === 12 ? 12 : density === 24 ? 24 : 48;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'grid',
        gridTemplateColumns: `repeat(${tracks}, 1fr)`,
        gridTemplateRows: showRows ? 'repeat(8, 1fr)' : 'none',
        width: fullViewport ? '100vw' : undefined,
        maxWidth: fullViewport ? 'none' : undefined,
      }}
    >
      {Array.from({ length: tracks }).map((_, i) => (
        <div
          key={`col-${i}`}
          style={{
            borderLeft: `1px solid ${color}`,
            opacity,
            gridRow: '1 / -1',
          }}
        />
      ))}
      {showRows && Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`row-${i}`}
          style={{
            borderTop: `1px dashed ${color}`,
            opacity: opacity * 0.7,
            gridColumn: '1 / -1',
            gridRow: i + 1,
          }}
        />
      ))}
    </div>
  );
}
```

```astro
<!-- In BaseLayout.astro -->
---
import GridOverlay from '../components/GridOverlay.tsx';
const isDev = import.meta.env.DEV;
---
{isDev && <GridOverlay client:only="react" />}
```

### Pattern 6: CSS @layer Organization

**What:** Cascade layers for predictable specificity.
**When to use:** Global stylesheet entry point.

```css
/* src/styles/layers.css */
@layer reset, tokens, base, layout, components, utilities;
```

Import order in BaseLayout:
```astro
---
import '../styles/layers.css';
import '../styles/reset.css';
import '../styles/tokens/primitives.css';
import '../styles/tokens/semantic.css';
import '../styles/tokens/components.css';
import '../styles/typography.css';
import '../styles/grid.css';
import '../styles/base.css';
---
```

### Pattern 7: DINNextW1G Font Setup

**What:** Self-host DINNextW1G via Astro Fonts API.
**When to use:** astro.config.mjs setup.

```javascript
// astro.config.mjs
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react()],
  fonts: [{
    provider: fontProviders.local(),
    name: "DINNextW1G",
    cssVariable: "--font-primary",
    options: {
      variants: [
        { src: ['./src/assets/fonts/DINNextW1G/DINNextW1G-Light.woff2'], weight: '300', style: 'normal' },
        { src: ['./src/assets/fonts/DINNextW1G/DINNextW1G-Regular.woff2'], weight: '400', style: 'normal' },
        { src: ['./src/assets/fonts/DINNextW1G/DINNextW1G-Medium.woff2'], weight: '500', style: 'normal' },
        { src: ['./src/assets/fonts/DINNextW1G/DINNextW1G-Bold.woff2'], weight: '700', style: 'normal' },
      ],
    },
  }],
});
```

**Note:** DINNextW1G is a commercial font from Linotype. Font files must be obtained from the project's Figma/font license. Place .woff2 files in `src/assets/fonts/DINNextW1G/`. If font files are not available immediately, use a fallback system font stack and swap in when files arrive.

### Pattern 8: Modular Type Scale (Perfect Fourth 1.333)

**What:** Consistent type sizes using 1.333 ratio.

```css
/* src/styles/typography.css */
@layer base {
  :root {
    --font-primary: 'DINNextW1G', 'DIN Alternate', system-ui, sans-serif;
    --type-base: 1rem;        /* 16px */
    --type-sm: 0.75rem;       /* 12px */
    --type-md: 1rem;          /* 16px */
    --type-lg: 1.333rem;      /* ~21px */
    --type-xl: 1.777rem;      /* ~28px */
    --type-2xl: 2.369rem;     /* ~38px */
    --type-3xl: 3.157rem;     /* ~51px */
    --type-4xl: 4.209rem;     /* ~67px */

    --leading-tight: 1.1;
    --leading-normal: 1.4;
    --leading-relaxed: 1.6;
  }

  body {
    font-family: var(--font-primary);
    font-size: var(--type-base);
    font-weight: 400;
    line-height: var(--leading-normal);
    color: var(--color-text);
    background-color: var(--color-surface);
  }
}
```

### Anti-Patterns to Avoid
- **Hardcoding colors in components:** Always use semantic tokens (`var(--color-surface)`), never primitives (`var(--color-offwhite)`) or hex values directly.
- **Using JS for mode switching colors:** The `[data-mode]` CSS approach means zero JS needed for color changes -- just set the attribute.
- **Fixed grid track sizes:** Use `fr` units, not `px` -- the grid must be fluid.
- **Importing Leva in non-dev builds:** Gate behind `import.meta.env.DEV` to avoid shipping React to production for a dev tool.
- **Nesting content in deep component hierarchies too early:** Keep it flat in Phase 1. Components refine in Phase 2.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth scrolling | Custom scroll hijacking | Lenis 1.3.21 | Handles momentum, touch, accessibility, reduced-motion. Custom scroll hijacking breaks keyboard nav and causes jank. |
| GUI controls panel | Custom HTML controls | Leva 0.10.1 | Handles rendering, state, type inference, keyboard nav. Building a debug panel wastes time. |
| Font loading/optimization | Manual @font-face + preload | Astro Fonts API | Auto-generates font-face, preload links, fallback fonts, HTTP caching. |
| Content schema validation | Manual JSON validation | Astro Content Collections + Zod | Build-time validation, TypeScript autocomplete, reference() for relations. |
| CSS reset | Custom reset | Modern CSS reset (Andy Bell's or similar) | Well-tested, handles edge cases across browsers. |
| Animation framework | Custom requestAnimationFrame loops | GSAP 3.14.2 | Timeline, easing, ScrollTrigger, performance optimizations. Hand-rolling is always worse. |

**Key insight:** This phase is about establishing patterns, not building features. Every hand-rolled solution becomes technical debt that Phase 2-4 must work around.

## Common Pitfalls

### Pitfall 1: Leva Hydration in Astro Islands
**What goes wrong:** Leva renders server-side and causes hydration mismatch errors because it depends on browser APIs (window, document).
**Why it happens:** Astro tries to SSR React components by default.
**How to avoid:** Use `client:only="react"` directive instead of `client:load`. This skips SSR entirely and only renders in the browser.
**Warning signs:** Hydration mismatch warnings in console, Leva panel not appearing.

### Pitfall 2: Lenis Breaking Keyboard/Accessibility Scrolling
**What goes wrong:** Smooth scroll intercepts keyboard navigation (Tab, arrow keys, Page Up/Down), breaking accessibility.
**Why it happens:** Lenis smooths all scroll events by default.
**How to avoid:** Lenis 1.3.x handles keyboard scrolling natively. Ensure `prefers-reduced-motion: reduce` disables smooth scrolling entirely. Test with keyboard-only navigation.
**Warning signs:** Tab key doesn't scroll focused elements into view smoothly.

```javascript
// Respect reduced motion
const lenis = new Lenis({
  duration: 1.2,
  smoothWheel: true,
});

// Disable smooth scroll for reduced-motion users
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mediaQuery.matches) {
  lenis.destroy();
}
```

### Pitfall 3: Content Collections Type Errors with file() Loader
**What goes wrong:** JSON file structure doesn't match what file() loader expects -- entries need either an array with `id` fields or an object with string keys.
**Why it happens:** file() loader expects a specific JSON shape, not arbitrary nested objects.
**How to avoid:** JSON files must be either `[{id: "...", ...}, ...]` (array with id) or `{"key1": {...}, "key2": {...}}` (object with keys as IDs).
**Warning signs:** Build errors about missing `id` field or unexpected JSON structure.

### Pitfall 4: CSS @layer Order Matters
**What goes wrong:** Styles don't apply because they're in a lower-priority layer.
**Why it happens:** `@layer` declaration order defines priority -- last declared wins. If `tokens` is declared before `components`, component styles override tokens.
**How to avoid:** Declare layers in ascending priority: `@layer reset, tokens, base, layout, components, utilities;`
**Warning signs:** Styles that should apply get overridden unexpectedly despite no specificity conflicts.

### Pitfall 5: Grid Container Aspect Ratio vs Scrollable Content
**What goes wrong:** Setting `aspect-ratio: 1/1` on the content grid container constrains page height and prevents scrolling.
**Why it happens:** The grid spec says the overall grid is square, but this applies to the mathematical proportion, not the page layout.
**How to avoid:** Use `aspect-ratio: 1/1` only on the dev overlay visualization. The content grid uses the 48-column template but allows `grid-auto-rows` for content flow. Row height should be calculated from column width (row height = column width * 6) via CSS calc or JS.
**Warning signs:** Content gets cut off, page doesn't scroll.

### Pitfall 6: DINNextW1G Font Files Not Available
**What goes wrong:** Font files are commercial and may not be immediately available -- the build breaks or shows system font.
**Why it happens:** DINNextW1G requires a license. Files need to be exported from Figma or obtained from font provider.
**How to avoid:** Define a robust fallback stack: `'DINNextW1G', 'DIN Alternate', 'DIN Next', system-ui, -apple-system, sans-serif`. The Astro Fonts API handles graceful degradation. If font files are missing, the prototype still works with system fonts.
**Warning signs:** Different typography in dev vs production, FOUT on page load.

### Pitfall 7: Concrete Noise/Grain Texture Performance
**What goes wrong:** SVG filter noise textures cause performance issues, especially with large surfaces and animations.
**Why it happens:** `feTurbulence` SVG filter is CPU-intensive and not GPU-accelerated.
**How to avoid:** Use a pre-rendered noise texture as a small (200x200px) PNG with `background-repeat` and a `mix-blend-mode` overlay. Much lighter than runtime SVG filters. Apply only to decorative elements, not full backgrounds.
**Warning signs:** Janky scroll, high CPU usage, choppy GSAP animations.

## Code Examples

### CSS Noise/Grain Texture on Concrete Elements

```css
/* Pre-render a small noise PNG (200x200, subtle grain, ~5KB) */
.concrete-texture {
  position: relative;
}

.concrete-texture::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/textures/noise-grain.png');
  background-repeat: repeat;
  opacity: 0.08;
  mix-blend-mode: multiply;
  pointer-events: none;
}

/* In on-site (dark) mode, invert the blend */
html[data-mode="onsite"] .concrete-texture::after {
  mix-blend-mode: soft-light;
  opacity: 0.12;
}
```

### No-JS Fallback Strategy

```astro
<!-- BaseLayout.astro -->
<html data-mode="planning" lang="de">
<head>
  <noscript>
    <style>
      /* Ensure all content is visible without JS */
      [data-js-only] { display: none !important; }
      /* Remove smooth scroll dependency */
      html { scroll-behavior: auto; }
    </style>
  </noscript>
</head>
<body>
  <a href="#main" class="skip-nav">Skip to content</a>
  <main id="main">
    <!-- Content renders from Astro (SSG) -- visible without JS -->
    <slot />
  </main>
  <!-- Leva only loads in dev + with JS -->
  {isDev && <GridOverlay client:only="react" />}
</body>
</html>
```

### i18n JSON Content Structure

```json
// src/content/planning/homepage.json
[
  {
    "id": "hero",
    "section": "hero",
    "priority": 1,
    "title": {
      "de": "Willkommen im Kunsthaus Zurich",
      "en": "Welcome to Kunsthaus Zurich"
    },
    "body": {
      "de": "Entdecken Sie unsere aktuelle Ausstellungen...",
      "en": "Discover our current exhibitions..."
    },
    "image": "/images/hero-kunsthaus.jpg"
  },
  {
    "id": "key-info",
    "section": "info",
    "priority": 2,
    "title": {
      "de": "Besucherinformationen",
      "en": "Visitor Information"
    },
    "body": {
      "de": "Offen Dienstag bis Sonntag, 10-18 Uhr",
      "en": "Open Tuesday to Sunday, 10am-6pm"
    }
  }
]
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Astro Content Collections v2 (glob pattern) | Content Collections v3 with `file()` / `glob()` loaders | Astro 5.0 (Dec 2024) | Cleaner API, typed loaders, better JSON support |
| GSAP paid plugins (SplitText, etc.) | All GSAP plugins free | GSAP 3.12+ (2024, Webflow acquisition) | No license barriers for ScrollTrigger, SplitText, Flip |
| Manual @font-face + preload | Astro Fonts API | Astro 6.0 (Jan 2026) | Auto-optimization, local provider, zero config |
| CSS-in-JS theming (Styled Components) | CSS Custom Properties + @layer | 2024-2026 trend | Native, no runtime cost, works with SSG |
| Lenis scrollerProxy | Lenis native GSAP ticker sync | Lenis 1.1+ | Simpler integration, no proxy needed |

**Deprecated/outdated:**
- `astro:content` define/glob API from Astro 4.x -- replaced by loader-based API in Astro 5+
- GSAP Club membership for plugin access -- all plugins now free

## Open Questions

1. **DINNextW1G font file availability**
   - What we know: It's a commercial Linotype font specified in decision D-07
   - What's unclear: Whether the project has licensed .woff2 files ready, or if they need to be extracted from Figma
   - Recommendation: Start with system font fallback, swap in DINNextW1G files when available. Do not block Phase 1 on font files.

2. **Content scraping from kunsthaus.ch (D-14)**
   - What we know: Decision says to pull full homepage content from kunsthaus.ch
   - What's unclear: How much content to scrape, exact structure mapping
   - Recommendation: Manually copy key content from the live site into JSON files. Structure by section (hero, exhibitions, info) with priority field matching D-13 hierarchy. Do not automate scraping -- manual curation is faster for a prototype.

3. **Grid aspect-ratio enforcement in scrollable page**
   - What we know: Grid spec says 1:1 overall, cells height ~ 6x width
   - What's unclear: How to maintain cell proportions in a scrolling page (the grid can't literally be a fixed square)
   - Recommendation: The content grid uses 48 columns freely. The 1:1 / 6:1 proportions apply to the dev overlay visualization and to spacing tokens derived from column width. Content flows naturally with grid-auto-rows.

## Sources

### Primary (HIGH confidence)
- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/) - file() loader, schema, querying
- [Astro Fonts API Docs](https://docs.astro.build/en/guides/fonts/) - local provider, Font component
- [Lenis GitHub](https://github.com/darkroomengineering/lenis) - v1.3.21, GSAP integration
- [GSAP npm](https://www.npmjs.com/package/gsap) - v3.14.2, plugin availability
- [Leva GitHub](https://github.com/pmndrs/leva) - v0.10.1, useControls API
- npm registry version checks (astro 6.1.3, gsap 3.14.2, lenis 1.3.21, leva 0.10.1, react 19.2.4)

### Secondary (MEDIUM confidence)
- [helm78/astro-gsap-lenis](https://github.com/helm78/astro-gsap-lenis) - Reference implementation of Astro + GSAP + Lenis
- [Lenis + GSAP GSAP Forum](https://gsap.com/community/forums/topic/34814-scrolltrigger-with-lenis-smooth-scroll-problem-with-the-scrollerproxy-setup/) - Integration patterns
- [CSS Custom Properties theming patterns](https://www.frontendtools.tech/blog/css-variables-guide-design-tokens-theming-2025) - data-attribute mode switching

### Tertiary (LOW confidence)
- DINNextW1G font setup -- based on general self-hosting patterns, no DINNextW1G-specific docs found

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified against npm registry on 2026-04-06
- Architecture: HIGH - Patterns verified against official Astro 6, Lenis, Leva docs
- Grid system: MEDIUM - CSS Grid implementation is standard, but 48-track proportional system with 1:1 constraint is custom and needs validation in practice
- Pitfalls: HIGH - Based on documented issues in GSAP forums, Astro docs, and known CSS @layer behavior

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable stack, 30-day validity)
