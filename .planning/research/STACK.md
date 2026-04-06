# Technology Stack

**Project:** Kunsthaus Zurich Website Redesign Prototype
**Researched:** 2026-04-06
**Overall confidence:** HIGH

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro | 6.1.x | Static site framework | Ships zero JS by default, islands architecture for selective interactivity, built-in View Transitions, content collections for JSON data, Vite 7 under the hood. The museum prototype needs fast static pages with animation islands — Astro is purpose-built for this. Requires Node 22+. | HIGH |
| TypeScript | 5.x (bundled) | Type safety | Astro scripts are TypeScript by default in v6. Free type safety for content schemas and component props with no config. | HIGH |

### Animation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| GSAP | 3.14.x | Core animation engine | Industry standard for web animation. Now 100% free including all plugins (SplitText, ScrollTrigger, Flip, MorphSVG) after Webflow acquisition. Handles scroll-driven animations, text reveals, hover effects, and page transitions the prototype requires. | HIGH |
| GSAP ScrollTrigger | (bundled with GSAP) | Scroll-driven animation | Ties animations to scroll position — parallax, reveals, scaling. Essential for the museum homepage scroll experience. | HIGH |
| GSAP SplitText | (bundled with GSAP) | Text animation | Splits text into chars/words/lines for typographic motion. Required for the "modern, clean typographic motion" spec. Now free. | HIGH |
| GSAP Flip | (bundled with GSAP) | Layout animation | Animates between layout states seamlessly. Useful for Planning/On-site mode transitions where UI elements reposition. | HIGH |
| Lenis | 1.3.x | Smooth scrolling | Lightweight (7KB gzip), performant smooth scroll. Pairs well with GSAP ScrollTrigger without conflict. Simpler than GSAP ScrollSmoother and better for non-standard layouts like dual-mode UI. | HIGH |

### CSS Architecture

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vanilla CSS with Custom Properties | native | Theming and styling | For a headless/CMS-ready prototype, CSS custom properties provide the cleanest theming layer. Define tokens as `--color-primary`, `--space-lg`, etc. Future CMS can override properties without touching component CSS. No build tool dependency. Astro scopes component CSS automatically. | HIGH |
| CSS `@layer` | native | Cascade organization | Organize styles into `reset`, `tokens`, `base`, `components`, `utilities` layers. Prevents specificity wars and makes the cascade predictable when a CMS eventually injects its own styles. | MEDIUM |
| Open Props | 2.x (optional) | Design token starting point | Pre-built CSS custom properties for spacing, colors, easings, animations. Cherry-pick what you need. Saves time on a 3-4 day timeline without adding framework weight. Optional — skip if Figma tokens are sufficient. | MEDIUM |

**Why NOT Tailwind CSS:** For this specific project, Tailwind adds unnecessary abstraction between the design (Figma) and the code. The prototype needs precise, bespoke animations and layout that map directly to Figma specs. CSS custom properties give the CMS-ready theming layer without utility class overhead. On a 3-4 day timeline with one developer, the fewer abstractions the better. If this were a larger team or a production build with many pages, Tailwind v4.2 would be a reasonable choice.

### Content Layer

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro Content Collections | (built-in) | Structured content | Define typed schemas with Zod, load JSON files with `glob()` or `file()` loaders. Query with `getCollection()` / `getEntry()`. Maps directly to a future CMS data model. TypeScript autocomplete for all content fields. | HIGH |
| JSON data files | n/a | Content storage | Store exhibition data, navigation, mode-specific content as `.json` files in `src/content/`. No API complexity. Each file maps to a future CMS content type. | HIGH |
| Zod | (bundled with Astro) | Schema validation | Validates JSON content at build time. Catches missing fields before they break the prototype. Already integrated into Astro content collections. | HIGH |

### Fonts

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro Fonts API | (built-in, v6) | Font loading/optimization | New in Astro 6. Auto-downloads, caches, and self-hosts fonts. Generates optimized fallbacks and preload links. No third-party font requests in production — better privacy and performance. Supports Google, Fontsource, local files. | HIGH |

### Deployment

| Technology | Purpose | Why | Confidence |
|------------|---------|-----|------------|
| Cloudflare Pages | Static hosting | Free tier with unlimited bandwidth, global CDN, zero cold starts. Astro 6 has first-class Cloudflare integration (same company now). `astro dev` runs on actual Cloudflare runtime via Vite Environment API. Deploy with `npx wrangler pages deploy dist/`. Best option for a competition prototype that needs reliable, fast hosting at zero cost. | HIGH |
| Vercel | Alternative hosting | Solid alternative if Cloudflare causes issues. One-click Astro deploy. Generous free tier. | MEDIUM |

### View Transitions

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro View Transitions | (built-in) | Page/mode transitions | Native browser View Transitions API with Astro's client-side router. 85%+ browser support in 2026. Built-in fade, slide, none animations. Can layer GSAP on top for custom transitions. Perfect for Planning/On-site mode switching — elements morph between states. Graceful fallback (normal page load) in unsupported browsers. | HIGH |

### Dev Tooling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vite | 7.x (bundled with Astro 6) | Build tool | Bundled with Astro 6. Fast HMR, native ESM. No separate config needed. | HIGH |
| Prettier | 3.x | Code formatting | Consistent formatting. Use `prettier-plugin-astro` for `.astro` files. | HIGH |
| `prettier-plugin-astro` | latest | Astro file formatting | Official plugin for formatting `.astro` component files. | HIGH |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| Framework | Astro 6 | Next.js 16 | Overkill for a static prototype. React runtime adds unnecessary JS weight. Astro ships zero JS by default — better for a museum site where content matters more than app-like interactivity. |
| CSS | Vanilla + Custom Props | Tailwind CSS 4.2 | Adds abstraction layer between Figma and code. For a bespoke museum prototype with precise animation, direct CSS control is faster and more maintainable on a tight timeline. |
| Smooth scroll | Lenis 1.3 | GSAP ScrollSmoother | ScrollSmoother is powerful but rigid — harder to integrate with dual-mode layout switching. Lenis is lighter, more flexible with non-standard layouts, and composes cleanly with GSAP ScrollTrigger. |
| Content | JSON + Content Collections | Markdown/MDX | Museum content is structured data (exhibitions, artists, dates), not long-form prose. JSON maps directly to CMS content types. MDX adds unnecessary complexity. |
| Animation | GSAP 3.14 | Framer Motion / Motion One | Framework-specific (React). GSAP is framework-agnostic, works with Astro's vanilla JS islands, and has the richest plugin ecosystem (SplitText, Flip, ScrollTrigger). |
| Page transitions | Astro View Transitions | Barba.js / Swup | Astro has built-in View Transitions with a client-side router. Adding Barba.js or Swup is redundant complexity. Layer GSAP on Astro's transitions for custom effects. |
| Font loading | Astro Fonts API | `astro-font` package / manual | Built-in in v6, no extra dependency. Auto-optimizes with preload and fallbacks. |
| Deployment | Cloudflare Pages | Netlify | Cloudflare acquired Astro in Jan 2026. First-class integration, identical dev/prod runtime, unlimited free bandwidth. Netlify is fine but Cloudflare has the edge for Astro projects now. |

## Installation

```bash
# Prerequisites
node --version  # Must be 22+

# Create Astro project
npm create astro@latest kunsthaus-prototype

# Core dependencies
npm install gsap lenis

# Dev dependencies
npm install -D prettier prettier-plugin-astro
```

### Project Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),  // only if using Cloudflare-specific features
  // For pure static, no adapter needed — just deploy dist/
});
```

### CSS Token Architecture (headless-ready)

```css
/* src/styles/tokens.css */
@layer tokens {
  :root {
    /* Mode tokens — switched via JS on mode change */
    --mode-bg: var(--color-stone-50);
    --mode-text: var(--color-stone-900);
    --mode-accent: var(--color-amber-600);
    
    /* Planning mode (default) */
    --color-stone-50: #fafaf9;
    --color-stone-900: #1c1917;
    --color-amber-600: #d97706;
    
    /* Spacing scale */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 2rem;
    --space-xl: 4rem;
    --space-2xl: 8rem;
    
    /* Typography scale */
    --text-sm: clamp(0.875rem, 0.8rem + 0.2vw, 1rem);
    --text-base: clamp(1rem, 0.9rem + 0.3vw, 1.125rem);
    --text-lg: clamp(1.25rem, 1rem + 0.5vw, 1.5rem);
    --text-xl: clamp(1.5rem, 1rem + 1vw, 2.5rem);
    --text-display: clamp(2.5rem, 1.5rem + 2.5vw, 5rem);
    
    /* Animation tokens — consumed by GSAP and CSS */
    --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
    --duration-fast: 0.2s;
    --duration-normal: 0.4s;
    --duration-slow: 0.8s;
  }
  
  /* On-site mode overrides — toggled via [data-mode="onsite"] on <html> */
  [data-mode="onsite"] {
    --mode-bg: var(--color-stone-900);
    --mode-text: var(--color-stone-50);
    --mode-accent: var(--color-amber-400);
  }
}
```

### GSAP Setup Pattern for Astro

```typescript
// src/scripts/animations.ts
// Import GSAP and register plugins once
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

// Use GSAP Context for cleanup with View Transitions
export function initAnimations(container: HTMLElement) {
  const ctx = gsap.context(() => {
    // All animations scoped to container
    // ScrollTrigger, SplitText, etc. here
  }, container);
  
  return ctx; // Call ctx.revert() on cleanup
}
```

```astro
---
// In an Astro component
---
<section id="hero" data-animate>
  <h1 class="hero-title">Kunsthaus Zurich</h1>
</section>

<script>
  import { initAnimations } from '../scripts/animations';
  
  // Initialize on page load
  const section = document.getElementById('hero');
  let ctx = initAnimations(section);
  
  // Re-initialize after View Transition navigation
  document.addEventListener('astro:after-swap', () => {
    ctx?.revert();
    const newSection = document.getElementById('hero');
    if (newSection) ctx = initAnimations(newSection);
  });
</script>
```

### Lenis + GSAP Integration

```typescript
// src/scripts/smooth-scroll.ts
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const lenis = new Lenis();

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

## Version Summary

| Package | Version | Node Requirement |
|---------|---------|-----------------|
| astro | ^6.1.0 | Node 22+ |
| gsap | ^3.14.0 | -- |
| lenis | ^1.3.0 | -- |
| prettier | ^3.0.0 | -- |
| prettier-plugin-astro | latest | -- |
| @tailwindcss/vite | NOT USED | -- |
| @astrojs/cloudflare | latest | -- |

## Sources

- [Astro 6.0 Release Blog](https://astro.build/blog/astro-6/) — HIGH confidence
- [Astro 6 Beta Announcement](https://astro.build/blog/astro-6-beta/) — HIGH confidence
- [Astro Whats New March 2026](https://astro.build/blog/whats-new-march-2026/) — HIGH confidence
- [GSAP npm](https://www.npmjs.com/package/gsap) — v3.14.2, HIGH confidence
- [GSAP Installation Docs](https://gsap.com/docs/v3/Installation/) — HIGH confidence
- [Lenis npm](https://www.npmjs.com/package/lenis) — v1.3.21, HIGH confidence
- [Lenis Official Site](https://lenis.darkroom.engineering/) — HIGH confidence
- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/) — HIGH confidence
- [Astro View Transitions Docs](https://docs.astro.build/en/guides/view-transitions/) — HIGH confidence
- [Astro Fonts API Docs](https://docs.astro.build/en/guides/fonts/) — HIGH confidence
- [Astro + GSAP Integration Guide (LaunchFast)](https://www.launchfa.st/blog/gsap-astro/) — MEDIUM confidence
- [Astro + GSAP View Transitions Guide](https://www.launchfa.st/blog/gsap-astro-view-transitions) — MEDIUM confidence
- [Codrops: Astro + GSAP Portfolio Build](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/) — MEDIUM confidence
- [Cloudflare Pages Astro Deploy Guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) — HIGH confidence
- [Tailwind CSS v4.0 Blog](https://tailwindcss.com/blog/tailwindcss-v4) — HIGH confidence (considered but not recommended)
- [ScrollSmoother vs Lenis Comparison](https://zuncreative.com/en/blog/smooth_scroll_meditation/) — MEDIUM confidence
- [Smooth Scrolling Libraries Comparison](https://www.borndigital.be/blog/our-smooth-scrolling-libraries) — MEDIUM confidence
