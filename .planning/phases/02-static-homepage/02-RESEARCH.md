# Phase 2: Static Homepage - Research

**Researched:** 2026-04-09
**Domain:** Astro components, GSAP ScrollTrigger pinning/stacking, CSS carousel with progress, CSS clip-path interactions, responsive navigation, content collections
**Confidence:** HIGH

## Summary

Phase 2 transforms the Phase 1 foundation into a complete homepage with approximately 12 distinct components: navigation bar with scroll behavior, hero carousel with scattered images, two reusable immersive storytelling components (Cinematic Reveal Strip and Pinned Narrative Sequence), exhibition cards, sticky CTA + mode toggle, section progress indicator, footer with marquee, search overlay, hamburger menu overlay, and the overall section stacking scroll system. The phase is structurally complex but well-defined by 44 design decisions in CONTEXT.md and a detailed UI-SPEC.

The critical technical challenges are: (1) GSAP ScrollTrigger section pinning with stacking z-index management, (2) the hero carousel with auto-play progress tabs and scattered image layout, (3) velocity-aware navigation reveal/hide, and (4) ensuring all components work across three breakpoints with reduced-motion fallbacks. All animations in this phase are structural (pinning, stacking, carousel cycling) -- decorative scroll animations (parallax, text reveals, hover effects) are deferred to Phase 3.

**Primary recommendation:** Build components bottom-up starting with the section stacking system and content data layer, then individual section components, then navigation and overlays. Every interactive component (carousel, nav, mode toggle, progress indicator) should be a React island or use Astro `<script>` blocks for client-side behavior.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01 through D-06: Hero section with carousel, scattered images, right-aligned monumental typography, auto-play with labeled progress tabs, pause/play toggle, pinned/fixed positioning
- D-07 through D-13: Navigation bar with floating design, #EBEBEB background, specific layout (search | logo | nav+lang), velocity-aware scroll behavior, logo island persistence, mobile hamburger with full-screen overlay
- D-14 through D-17: Interaction states -- clip-path background wipe hover (200ms/350ms asymmetric), scale(0.96) touch pulse, hover media query gating, touch-action: manipulation
- D-18 through D-22: Sticky CTA + mode toggle -- floating buttons desktop, sticky bottom bar mobile, multilingual labels (EN/DE/FR)
- D-23 through D-27: Section composition -- varied asymmetric grid layouts, 128px+ spacing, 3D stacking scroll effect with responsive degradation, background rotation cycle, section progress indicator with fraction counter + progress arc
- D-28 through D-30: Two immersive storytelling components (Cinematic Reveal Strip, Pinned Narrative Sequence) with section mapping
- D-31 through D-34: Exhibition cards -- 60/40 viewport split, 3:2 aspect ratio, crossfade transitions, separate from hero
- D-35 through D-39: Footer -- 4px top border, marquee, four-column layout, dark bottom bar, bilingual content
- D-40 through D-42: Accessibility -- manual reduce-motion toggle, carousel ARIA pattern, skip-nav and landmarks
- D-43 through D-44: Content in both EN and DE, navigation labels specified

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

### Deferred Ideas (OUT OF SCOPE)
- Functional search across JSON content -- backlog item 999.1
- Exhibition detail pages -- future phase (Phase 3+ or new phase)
- Real ticketing integration -- out of scope, prototype uses external link
- Geolocation-based mode switching -- Phase 3 (NAV-05)
- QR code URL parameter for On-site mode -- Phase 3 (NAV-04)
- Mode switching transitions and animations -- Phase 3 (ANIM-04)
- All scroll-driven animations, text animations, hover effects -- Phase 3 (ANIM-01 through ANIM-06)
- Shop overlay panel slide-in behavior -- structural hooks in Phase 2, interaction in Phase 3
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | Hero section with featured exhibition (both mode variants) | Hero carousel component (D-01 through D-06), scattered image layout, auto-play with progress tabs, GSAP timeline for slide cycling, pinned positioning via ScrollTrigger |
| HOME-02 | Current exhibitions listing with mode-dependent detail level | Cinematic Reveal Strip for featured exhibition + Pinned Narrative Sequence for exhibition list (D-28/D-29), exhibition cards (D-31 through D-34), content from planning/homepage.json exhibitions section |
| HOME-03 | Visit information section (hours, location, tickets) | Standard grid layout section (D-29), content from planning/homepage.json key-info section, "Open today" dynamic status in footer (D-37) |
| HOME-04 | Footer with contact, social links, and museum info | Footer component (D-35 through D-39), marquee animation, four-column layout, dark bottom bar, bilingual content |
| NAV-01 | Responsive main navigation with mobile hamburger menu | Navigation bar (D-07 through D-13), velocity-aware scroll behavior, logo island, hamburger full-screen overlay, search shell overlay |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 6.1.x | Static site framework | Already installed, content collections configured |
| GSAP | 3.14.x | Animation engine | ScrollTrigger for pinning/stacking, timeline for carousel |
| Lenis | 1.3.x | Smooth scrolling | Already integrated with GSAP ticker in BaseLayout |
| React | 19.x | Interactive islands | Already installed for GridOverlay pattern |

### No New Dependencies Needed

Phase 2 requires zero additional npm packages. Everything is built with:
- GSAP ScrollTrigger (already registered in BaseLayout.astro)
- GSAP core timeline (for carousel auto-play)
- CSS animations (for marquee, clip-path hover effects)
- Vanilla CSS custom properties (for theming, section backgrounds)
- Astro content collections (for JSON data)
- React islands (for interactive components needing state)

## Architecture Patterns

### Recommended Component Structure
```
src/
  components/
    nav/
      NavBar.astro            # Desktop nav bar container
      NavLinks.astro          # Nav link items (reusable in mobile overlay)
      LogoIsland.astro        # Persistent floating logo
      SearchOverlay.astro     # Search shell overlay
      HamburgerOverlay.astro  # Mobile full-screen menu
      LanguageSwitcher.astro  # EN/DE/FR dropdown
    hero/
      HeroCarousel.astro      # Hero section wrapper (pinned)
      HeroSlide.astro         # Individual slide with scattered images
      CarouselTabs.astro      # Progress tabs with fill animation
    sections/
      SectionWrapper.astro    # Stacking section container (z-index, bg rotation)
      CinematicReveal.astro   # Full-bleed image reveal strip (D-28)
      PinnedNarrative.astro   # Pinned scrolling card sequence (D-28)
      ExhibitionCard.astro    # Image-dominant card (D-31)
      StandardGrid.astro      # Key-info, events, planning-details layout
    footer/
      Footer.astro            # Footer wrapper
      FooterMarquee.astro     # Infinite scroll marquee
      FooterColumns.astro     # Four-column content area
      FooterBottomBar.astro   # Dark bottom bar with social + legal
    ui/
      StickyCTA.astro         # Desktop floating buttons + mobile sticky bar
      ModeToggle.tsx          # React island: two-state mode switch (needs state)
      SectionProgress.tsx     # React island: fraction counter + progress arc (needs scroll state)
      ReduceMotionToggle.astro # Manual motion preference toggle
  content/
    planning/
      homepage.json           # Needs expansion: more exhibitions, richer section data
    shared/
      navigation.json         # Needs update: remove mode-toggle, update labels per D-44
      footer.json             # NEW: footer content (address, hours, links, legal)
      ui-strings.json         # NEW: CTA labels, mode toggle labels, a11y strings (EN/DE/FR)
  layouts/
    BaseLayout.astro          # Existing -- needs header/footer slots, nav integration
  pages/
    index.astro               # Complete rebuild with section composition
```

### Pattern 1: Astro Component with Client-Side GSAP
**What:** Astro components render static HTML/CSS, then a `<script>` tag initializes GSAP animations on mount.
**When to use:** Components needing scroll-driven animation but no React state (hero carousel, section stacking, cinematic reveal, pinned narrative).
**Example:**
```astro
---
// SectionWrapper.astro
interface Props {
  index: number;
  bgStep: 1 | 2 | 3 | 4;
  sectionName: string;
}
const { index, bgStep, sectionName } = Astro.props;
const bgClasses = ['bg-offwhite', 'bg-white', 'bg-concrete-light', 'bg-concrete-warm'];
---
<section
  class:list={['stacking-section', bgClasses[bgStep - 1]]}
  data-section-index={index}
  data-section-name={sectionName}
  style={`z-index: ${20 + index};`}
>
  <slot />
</section>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  // Each stacking section pins and scales down as the next section scrolls over it
  document.querySelectorAll('.stacking-section').forEach((section, i, sections) => {
    if (i === sections.length - 1) return; // Last section doesn't pin

    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const isTablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      pin: isDesktop || isTablet,
      pinSpacing: false,
      onUpdate: (self) => {
        if (!motionOk) return;
        const progress = self.progress;
        if (isDesktop) {
          gsap.set(section, {
            scale: 1 - (progress * 0.1),
            rotation: progress * (i % 2 === 0 ? 2 : -3),
            opacity: 1 - (progress * 0.6),
          });
        } else if (isTablet) {
          gsap.set(section, {
            scale: 1 - (progress * 0.1),
            opacity: 1 - (progress * 0.6),
          });
        }
      },
    });
  });
</script>
```

### Pattern 2: React Island for Stateful UI
**What:** React component rendered as Astro island with `client:load` or `client:visible` for components needing internal state management.
**When to use:** Mode toggle (needs state for active mode), section progress indicator (needs scroll-driven state updates), language switcher (needs dropdown state).
**Example:**
```tsx
// ModeToggle.tsx -- React island
import { useState, useEffect } from 'react';

interface Props {
  labels: {
    planning: { en: string; de: string };
    onsite: { en: string; de: string };
  };
  lang: 'en' | 'de';
}

export default function ModeToggle({ labels, lang }: Props) {
  const [mode, setMode] = useState<'planning' | 'onsite'>('planning');

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  const toggle = () => setMode(m => m === 'planning' ? 'onsite' : 'planning');
  const label = mode === 'planning' ? labels.planning[lang] : labels.onsite[lang];

  return (
    <button onClick={toggle} aria-pressed={mode === 'onsite'}>
      {label}
    </button>
  );
}
```

### Pattern 3: Content Collection Expansion
**What:** Expand existing JSON content and add new collections for footer, UI strings, and richer exhibition data.
**When to use:** All content must come from JSON -- no hardcoded text in templates (project constraint).
**Key insight:** The existing `homepage.json` schema is too flat for Phase 2 requirements. The hero needs multiple featured exhibitions with images, the exhibitions section needs richer metadata, and the footer needs its own dedicated content file.

### Pattern 4: CSS Background Rotation via Data Attributes
**What:** Each section receives a `data-bg-step` attribute (1-4) and CSS maps it to the correct background color + texture.
**When to use:** Section background cycling per D-26.
**Example:**
```css
@layer components {
  .stacking-section[data-bg-step="1"] { background-color: #fbf8f7; }
  .stacking-section[data-bg-step="2"] { background-color: #ffffff; }
  .stacking-section[data-bg-step="3"] {
    background-color: #EBEBEB;
    background-image: url(/textures/concrete-wall.png);
    background-repeat: repeat;
  }
  .stacking-section[data-bg-step="4"] {
    background-color: #C1BFB2;
    background-image: url(/textures/asfalt-dark.png);
    background-repeat: repeat;
  }
}
```

### Anti-Patterns to Avoid
- **Using IntersectionObserver for section tracking with pinned elements:** ScrollTrigger callbacks are required (D-27 explicitly calls this out). IntersectionObserver is unreliable with `position: fixed` pinned sections.
- **Hardcoding any text in Astro templates:** All content must come from JSON content collections. Even UI strings like "Tickets" and "Plan a visit" must be in a JSON file for i18n.
- **Using `client:only` for all interactive components:** Only use `client:only` when SSR is impossible (like GridOverlay with Leva). Prefer `client:load` or `client:visible` so HTML renders server-side first.
- **Single monolithic page component:** The index.astro page should compose small, focused section components. Each section is its own Astro component with its own scoped styles.
- **Mixing GSAP and CSS transitions on the same properties:** Choose one animation system per property. GSAP for scroll-driven transforms, CSS for hover/focus states.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Carousel auto-play with progress | Custom setInterval + DOM manipulation | GSAP timeline with `repeat: -1` + `onUpdate` for progress | GSAP handles pausing, resuming, progress tracking, and cleanup. setInterval drift causes timing issues. |
| Section scroll pinning | Custom scroll event + position:fixed toggling | GSAP ScrollTrigger `pin: true` | ScrollTrigger handles pin spacing, refresh on resize, and coordinates with Lenis. Manual pinning breaks smooth scroll. |
| Smooth scroll integration | Separate scroll listeners | Lenis already synced with GSAP ticker in BaseLayout | The Lenis-GSAP integration is already set up. Adding separate scroll listeners will fight with it. |
| Responsive animation differences | JS window.resize + breakpoint checks | ScrollTrigger.matchMedia() | Built-in responsive API that creates/destroys ScrollTriggers at breakpoints. Handles cleanup automatically. |
| Marquee infinite loop | Complex JS animation loop | Pure CSS `@keyframes` with `translateX` on duplicated content | GPU-accelerated, zero JS overhead, works with `prefers-reduced-motion` media query to pause. |
| Velocity-aware nav show/hide | Manual scroll delta calculation | GSAP ScrollTrigger `onUpdate` with `self.getVelocity()` | ScrollTrigger provides normalized velocity values. Manual scroll delta is unreliable across browsers and with smooth scrolling. |

**Key insight:** GSAP ScrollTrigger is the Swiss Army knife for this phase. Nearly every complex interaction (section stacking, carousel, nav behavior, progress indicator, cinematic reveal, pinned narrative) should be driven by ScrollTrigger. Resist the urge to use IntersectionObserver or raw scroll events.

## Common Pitfalls

### Pitfall 1: ScrollTrigger Pin Spacing with Lenis
**What goes wrong:** When ScrollTrigger pins a section, it adds padding to maintain scroll length. With Lenis smooth scrolling, this can cause jumps or miscalculated scroll positions.
**Why it happens:** Lenis recalculates total scroll height. ScrollTrigger's pin spacing changes the DOM layout after Lenis initialized.
**How to avoid:** Call `ScrollTrigger.refresh()` after all pins are set up. Use `pinSpacing: false` for the stacking effect (sections overlap, they don't push content down). Ensure Lenis and ScrollTrigger are synced (already done in BaseLayout).
**Warning signs:** Sections jump when scrolling through pinned areas, or total scroll distance seems wrong.

### Pitfall 2: Z-Index Stacking Context with Fixed/Pinned Elements
**What goes wrong:** ScrollTrigger's pin creates a new stacking context (uses `position: fixed`). Z-index values between pinned and non-pinned elements don't interact as expected.
**Why it happens:** `position: fixed` creates a new stacking context. Elements inside it can't be z-indexed relative to elements outside it.
**How to avoid:** Use the z-index scale from UI-SPEC (hero: 10, sections: 20-27, CTA: 50, nav: 60, overlays: 80). Ensure each pinned section has its own incrementing z-index. The hero (z-index: 10) must be below all stacking sections (20+).
**Warning signs:** Sections appear behind the hero instead of stacking over it, or the nav disappears behind content.

### Pitfall 3: Carousel Accessibility with Auto-Play
**What goes wrong:** Auto-playing carousels violate WCAG 2.2 SC 2.2.2 unless users can pause them. Screen readers announce every slide change if `aria-live` is set to "assertive".
**Why it happens:** Developers implement auto-play without the pause mechanism, or use `aria-live="assertive"` which interrupts the user.
**How to avoid:** Always include pause/play toggle (D-05). Use `aria-live="polite"` (not "assertive") so slide changes are announced at the next idle moment. Disable auto-play when `prefers-reduced-motion` is active. Pause on keyboard focus within the carousel.
**Warning signs:** Screen reader announces every slide change aggressively, no visible way to stop auto-play.

### Pitfall 4: Content Collection Schema Mismatch on Expansion
**What goes wrong:** Expanding `homepage.json` with new fields breaks existing Zod validation, or new content files aren't picked up by the collection.
**Why it happens:** Astro content collections validate at build time. Adding new fields requires schema updates. New JSON files need their own collection definitions.
**How to avoid:** Update `content.config.ts` schemas BEFORE modifying JSON files. Add new collections for footer, UI strings. Test with `astro build` after schema changes.
**Warning signs:** Build errors referencing Zod validation failures, missing collection entries.

### Pitfall 5: Texture Files Not in Public Directory
**What goes wrong:** Texture images referenced in CSS (`url(/textures/concrete-wall.png)`) return 404.
**Why it happens:** Textures exist in `.planning/assets/textures/` but haven't been copied to `public/textures/`.
**How to avoid:** First task should copy texture files from `.planning/assets/textures/` to `public/textures/`. This was noted in Phase 1 CONTEXT.md D-35 as needed during build.
**Warning signs:** Concrete-textured sections show solid color without grain texture.

### Pitfall 6: Mobile Hamburger Overlay and Body Scroll Lock
**What goes wrong:** Opening the hamburger menu allows the page to scroll behind the overlay.
**Why it happens:** The overlay is `position: fixed` but the body still scrolls.
**How to avoid:** When hamburger opens: `document.body.style.overflow = 'hidden'` and `lenis.stop()`. On close: reverse both. This prevents both native and Lenis smooth scrolling while the overlay is open.
**Warning signs:** Page scrolls visibly behind the open hamburger menu.

### Pitfall 7: Hero Pinned Section Height Calculation
**What goes wrong:** The pinned hero section either clips content or creates too much empty scroll space.
**Why it happens:** The hero is `position: fixed` (stays in place), but ScrollTrigger needs to know how much scroll distance to allocate before sections start stacking over it.
**How to avoid:** Set the hero wrapper to `min-height: 100vh` and use a spacer div with the same height. The spacer pushes subsequent sections down while the hero stays fixed. ScrollTrigger pins are on the subsequent sections, not the hero itself.
**Warning signs:** Stacking sections start immediately with no room to view the hero, or there's excessive empty space before the first section appears.

## Code Examples

### Carousel Auto-Play with Progress Tabs
```typescript
// Source: GSAP timeline pattern for carousel with progress indicators
import { gsap } from 'gsap';

function initCarousel(container: HTMLElement) {
  const slides = container.querySelectorAll('[data-slide]');
  const tabs = container.querySelectorAll('[data-tab]');
  const playPauseBtn = container.querySelector('[data-carousel-toggle]');
  const SLIDE_DURATION = 5; // seconds per slide
  let isPaused = false;

  const tl = gsap.timeline({
    repeat: -1,
    defaults: { duration: SLIDE_DURATION },
  });

  slides.forEach((slide, i) => {
    const tab = tabs[i] as HTMLElement;
    const fillBar = tab.querySelector('.tab-fill') as HTMLElement;

    // Each slide: show, progress fill, then hide
    tl.to(fillBar, {
      scaleX: 1,
      duration: SLIDE_DURATION,
      ease: 'none',
      onStart: () => {
        // Activate this slide
        slides.forEach(s => s.classList.remove('active'));
        tabs.forEach(t => t.classList.remove('active'));
        slide.classList.add('active');
        tab.classList.add('active');
      },
    });

    // Reset fill for next cycle
    if (i < slides.length - 1) {
      tl.set(fillBar, { scaleX: 0 });
    }
  });

  // Pause/play toggle (D-05, WCAG 2.2.2)
  playPauseBtn?.addEventListener('click', () => {
    isPaused = !isPaused;
    isPaused ? tl.pause() : tl.resume();
    playPauseBtn.setAttribute('aria-label',
      isPaused ? 'Play slideshow' : 'Pause slideshow'
    );
  });

  // Pause on reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tl.pause();
    isPaused = true;
  }

  return tl;
}
```

### Clip-Path Background Wipe Hover (D-14)
```css
/* Source: CSS clip-path hover technique */
@layer components {
  .hover-wipe {
    position: relative;
    overflow: hidden;
  }

  .hover-wipe::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color-text);
    clip-path: inset(0 100% 0 0); /* hidden: clipped from right */
    transition: clip-path 200ms ease-in; /* faster in */
  }

  @media (hover: hover) {
    .hover-wipe:hover::before {
      clip-path: inset(0 0 0 0); /* revealed: full coverage */
    }

    .hover-wipe:not(:hover)::before {
      transition: clip-path 350ms ease-out; /* slower out */
    }
  }

  /* Inverse wipe for filled CTAs (D-16) */
  .hover-wipe-inverse::before {
    background: var(--color-surface);
    clip-path: inset(0 100% 0 0);
  }
}
```

### CSS Marquee Infinite Loop (D-36)
```css
/* Source: Modern CSS marquee pattern */
@layer components {
  .footer-marquee {
    overflow: hidden;
    white-space: nowrap;
  }

  .footer-marquee__track {
    display: inline-flex;
    animation: marquee-scroll 20s linear infinite;
    will-change: transform;
  }

  .footer-marquee:hover .footer-marquee__track {
    animation-play-state: paused; /* Accessibility: pause on hover */
  }

  @keyframes marquee-scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); } /* -50% because content is duplicated */
  }

  @media (prefers-reduced-motion: reduce) {
    .footer-marquee__track {
      animation: none;
    }
  }
}
```

### ScrollTrigger matchMedia for Responsive Pinning (D-25)
```typescript
// Source: GSAP ScrollTrigger.matchMedia() for responsive behavior
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

ScrollTrigger.matchMedia({
  // Desktop: full stacking effect
  '(min-width: 1024px)': function() {
    document.querySelectorAll('.stacking-section').forEach((section, i, all) => {
      if (i === all.length - 1) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        onUpdate: (self) => {
          gsap.set(section, {
            scale: 1 - (self.progress * 0.1),
            rotation: self.progress * (i % 2 === 0 ? 2 : -3),
            opacity: 1 - (self.progress * 0.6),
          });
        },
      });
    });
  },

  // Tablet: scale + opacity only, no rotation
  '(min-width: 768px) and (max-width: 1023px)': function() {
    document.querySelectorAll('.stacking-section').forEach((section, i, all) => {
      if (i === all.length - 1) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        onUpdate: (self) => {
          gsap.set(section, {
            scale: 1 - (self.progress * 0.1),
            opacity: 1 - (self.progress * 0.6),
          });
        },
      });
    });
  },

  // Mobile: no pinning, simple fade-up
  '(max-width: 767px)': function() {
    document.querySelectorAll('.stacking-section').forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 40,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 40%',
          scrub: true,
        },
      });
    });
  },

  // Reduced motion: no transforms at all
  '(prefers-reduced-motion: reduce)': function() {
    // Kill all ScrollTrigger instances -- sections just stack naturally
    ScrollTrigger.getAll().forEach(st => st.kill());
  },
});
```

### Velocity-Aware Nav Reveal (D-10)
```typescript
// Source: GSAP ScrollTrigger velocity detection pattern
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function initNavScrollBehavior(navEl: HTMLElement, logoIsland: HTMLElement) {
  let isNavVisible = true;

  ScrollTrigger.create({
    start: 'top -100',  // After scrolling 100px
    end: 'max',
    onUpdate: (self) => {
      const velocity = Math.abs(self.getVelocity());
      const direction = self.direction; // 1 = down, -1 = up

      if (velocity > 1500) {
        // Fast scroll: instant hide nav
        if (isNavVisible) {
          gsap.to(navEl, { opacity: 0, duration: 0.15, pointerEvents: 'none' });
          gsap.to(logoIsland, { opacity: 1, duration: 0.3 });
          isNavVisible = false;
        }
      } else if (velocity < 300 && direction === -1) {
        // Slow scroll up or pause: reveal nav with blur-expand
        if (!isNavVisible) {
          gsap.to(navEl, {
            opacity: 1,
            duration: 0.4,
            pointerEvents: 'auto',
            filter: 'blur(0px)',
          });
          gsap.to(logoIsland, { opacity: 0, duration: 0.2 });
          isNavVisible = true;
        }
      }
    },
  });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| GSAP Club plugins (paid) | All GSAP plugins free | Late 2024 (Webflow acquisition) | SplitText, ScrollTrigger, Flip, etc. all free -- no license concerns |
| IntersectionObserver for scroll effects | ScrollTrigger for scroll-driven animations | Ongoing | ScrollTrigger handles pinned elements correctly; IO does not |
| CSS scroll-driven animations API | GSAP ScrollTrigger | 2025-2026 | CSS `animation-timeline: scroll()` has growing browser support but cannot handle the complexity of stacking, pinning, and velocity detection needed here. GSAP remains the right choice. |
| Separate smooth scroll + animation libs | Lenis + GSAP unified ticker | 2024+ | The Lenis-GSAP ticker sync (already in BaseLayout) is the standard approach |

## Open Questions

1. **Exhibition placeholder images**
   - What we know: D-02 requires scattered exhibition images in the hero. The content JSON currently has `/images/hero-kunsthaus.jpg` and `/images/exhibitions/kerry-james-marshall.jpg` as paths.
   - What's unclear: These image files don't exist in `public/images/`. Need to source or create placeholder images.
   - Recommendation: Use placeholder images from Kunsthaus image database (https://www.kunsthaus.ch/en/medien-bereich/image-database/) or high-quality placeholder services. Create `public/images/` directory with properly sized images during implementation.

2. **Navigation JSON structure update**
   - What we know: Current `navigation.json` has 6 items including "Home" and "mode-toggle". D-08 specifies: "Visit us", "Collection", "Exhibitions", "About" as nav links. D-44 confirms these labels.
   - What's unclear: Whether to update existing JSON or create new nav JSON file.
   - Recommendation: Update `navigation.json` to match D-08/D-44 labels and remove mode-toggle entry (D-09 says mode toggle is NOT in navigation).

3. **Homepage JSON structure for hero carousel**
   - What we know: Current homepage.json has a single hero entry with one image. D-01 through D-04 require a carousel with multiple featured exhibitions, each with multiple scattered images.
   - What's unclear: Exact data structure needed for the hero carousel (multiple exhibitions, each with multiple images for the scattered layout).
   - Recommendation: Restructure hero section in homepage.json to contain an array of featured exhibitions, each with title, description, CTA href, and an array of image objects with position hints for the scattered layout.

4. **DINNextW1G font files**
   - What we know: Phase 1 noted that Astro Fonts API local() provider was commented out because it crashes without .woff2 files. The fallback font stack is used.
   - What's unclear: Whether font files will be available for Phase 2. The prototype may render with system-ui fallback.
   - Recommendation: Proceed with fallback font stack. If .woff2 files become available, they can be added without code changes (just uncomment the font provider).

## Sources

### Primary (HIGH confidence)
- Phase 2 CONTEXT.md (02-CONTEXT.md) -- 44 design decisions, all locked
- Phase 2 UI-SPEC (02-UI-SPEC.md) -- typography, colors, spacing, z-index, interaction states
- Phase 1 CONTEXT.md (01-CONTEXT.md) -- foundation decisions, token architecture, grid system
- Existing codebase (`src/`) -- BaseLayout.astro, content.config.ts, grid.css, typography.css, semantic.css

### Secondary (MEDIUM confidence)
- [GSAP ScrollTrigger stacking patterns](https://gsap.com/community/forums/topic/42186-stacked-pinning-scroll-trigger/) -- community patterns for section stacking
- [Codrops: Mastering Carousels with GSAP](https://tympanus.net/codrops/2025/04/21/mastering-carousels-with-gsap-from-basics-to-advanced-animation/) -- carousel implementation patterns
- [CSS clip-path hover effects](https://dev.to/crayoncode/how-to-build-5-clip-path-hover-effects-5460) -- clip-path wipe technique
- [Frontend Masters: Infinite Marquee with Modern CSS](https://frontendmasters.com/blog/infinite-marquee-animation-using-modern-css/) -- marquee implementation
- [GreenSock CodePen: Variable height stacked pinning](https://codepen.io/GreenSock/pen/KKpLdWW) -- official GSAP stacking demo

### Tertiary (LOW confidence)
- None -- all findings verified against GSAP official docs or established community patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed and configured in Phase 1
- Architecture: HIGH -- component structure follows established Astro patterns and project conventions
- Pitfalls: HIGH -- well-documented issues in GSAP community forums, verified against official docs
- Content model: MEDIUM -- JSON expansion strategy is straightforward but exact schema shapes need validation during implementation

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable stack, no fast-moving dependencies)
