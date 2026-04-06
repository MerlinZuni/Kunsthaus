# Pitfalls Research

**Domain:** Animated museum website (Astro + GSAP, competition prototype)
**Researched:** 2026-04-06
**Confidence:** HIGH (GSAP/Astro integration), MEDIUM (mobile performance), HIGH (accessibility)

## Critical Pitfalls

### Pitfall 1: GSAP ScrollTrigger Breaks After Astro View Transitions

**What goes wrong:**
ScrollTrigger instances survive Astro's page swap. On the second page visit, scroll positions are wrong, triggers fire at incorrect points, and animations either don't play or play instantly. This is the single most reported GSAP + Astro bug in the GSAP forums.

**Why it happens:**
Astro View Transitions swap DOM content without a full page reload. ScrollTrigger instances hold references to the old DOM elements and old scroll positions. Without explicit cleanup, they accumulate — each navigation creates a new set of triggers on top of zombie triggers from previous pages.

**How to avoid:**
- Wrap all GSAP animations in `gsap.context()` scoped to a container element.
- Listen for `astro:before-swap` to call `ctx.revert()` on every active GSAP context.
- After swap, re-initialize animations on `astro:page-load`.
- Call `ScrollTrigger.refresh()` after new content is in the DOM.
- For this prototype (single homepage), consider skipping View Transitions entirely — they add complexity with minimal benefit for a one-page demo.

**Warning signs:**
- Animations work on first load but break on back-navigation or re-visit.
- ScrollTrigger markers appear in wrong positions after any navigation.
- Console shows "ScrollTrigger: no matching element found" warnings.

**Phase to address:**
Phase 1 (Foundation) — establish the GSAP initialization/cleanup pattern before writing any animations. If skipping View Transitions, decide in Phase 1 so no cleanup infrastructure is needed.

---

### Pitfall 2: Animating Non-Compositable Properties Tanks Mobile Performance

**What goes wrong:**
Animations targeting `width`, `height`, `top`, `left`, `margin`, `padding`, or `border-radius` trigger layout recalculation on every frame. On mobile (especially iOS Safari), this drops frame rate to 15-20fps, causing visible jank during scroll-driven animations.

**Why it happens:**
Under deadline pressure, it is tempting to animate whatever CSS property achieves the visual effect. GSAP makes it easy — you can animate any property. But only `transform` and `opacity` are GPU-composited (skip layout and paint). Everything else forces the browser through the full rendering pipeline 60 times per second.

**How to avoid:**
- Animate ONLY `transform` (translate, scale, rotate) and `opacity`. No exceptions.
- For size changes: animate `scale` and adjust layout with CSS, not `width`/`height`.
- For position changes: use `x`, `y` (GSAP shorthand for translateX/Y), never `top`/`left`.
- For reveals: use `clipPath` animations sparingly (triggers paint but not layout).
- Add `will-change: transform` only to elements that actually animate — do NOT blanket-apply it.
- Test on a real iPhone (not just Chrome DevTools throttling) — iOS Safari is the bottleneck.

**Warning signs:**
- Chrome DevTools Performance tab shows long "Layout" bars during animation.
- Lighthouse flags "Avoid non-composited animations."
- Smooth on desktop, janky on any mobile device.

**Phase to address:**
Phase 2 (Animation Implementation) — enforce compositable-only rule from the first animation. Retrofitting is painful because visual designs may need rethinking.

---

### Pitfall 3: iOS Safari Address Bar Resize Destroys ScrollTrigger Positions

**What goes wrong:**
On iOS Safari, scrolling causes the address bar to collapse/expand, which fires resize events and changes `window.innerHeight`. Every resize triggers `ScrollTrigger.refresh()`, which recalculates all trigger positions. This causes animations to jump, re-trigger, or misfire during normal scrolling. Pinned sections are especially broken — they can flicker or detach.

**Why it happens:**
iOS Safari dynamically resizes the viewport as the address bar animates. This is unique to mobile Safari (and Chrome on iOS, which uses WebKit). ScrollTrigger relies on stable viewport dimensions to calculate trigger points. The resize event spam during the address bar animation creates a cascade of recalculations.

**How to avoid:**
- Use `ScrollTrigger.normalizeScroll(true)` — this intercepts native scroll and uses JS-driven scroll instead, preventing address bar jank.
- Use CSS `dvh` (dynamic viewport height) units sparingly or not at all for ScrollTrigger containers. Use `svh` (small viewport height) for consistent sizing.
- Avoid `100vh` for any scroll-triggered section heights — use `100svh` or fixed pixel values.
- Debounce or guard any custom resize handlers to ignore address-bar-only resizes.
- Test on a real iPhone early and often. The iOS simulator does NOT reproduce this.

**Warning signs:**
- Animations jump or replay when scrolling slowly on iPhone.
- Pinned sections flicker or show wrong content after address bar change.
- Works perfectly in Chrome DevTools mobile simulation but breaks on real device.

**Phase to address:**
Phase 1 (Foundation) — configure `normalizeScroll` and viewport units before any ScrollTrigger-dependent layout is built.

---

### Pitfall 4: No Reduced-Motion Fallback = Accessibility Failure and Bad Jury Impression

**What goes wrong:**
The entire experience relies on animation. Users with `prefers-reduced-motion: reduce` enabled see either: (a) broken layouts because animations set final positions, (b) a completely static page with no content reveals, or (c) nothing at all because content is hidden waiting for animation triggers that never fire. For a public institution website pitch, this is a competition-losing oversight.

**Why it happens:**
Animation-first development treats motion as the default and static as an afterthought. GSAP animations often set initial states (opacity: 0, y: 100) in JavaScript, so without the animation running, content is invisible. Developers test with motion enabled and never check the reduced-motion path.

**How to avoid:**
- Build content-first: all content must be visible and properly laid out WITHOUT any JavaScript running. GSAP enhances, never gates.
- Check `prefers-reduced-motion` before initializing GSAP animations:
  ```javascript
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) { initAnimations(); }
  ```
- For reduced-motion users, provide subtle crossfade transitions (opacity only, short duration) instead of full animation removal.
- Add a visible "reduce motion" toggle in the UI — shows the jury you considered accessibility.
- Never set initial animation states (opacity: 0) in CSS — set them in GSAP's `from`/`set` calls so they only apply when JS runs.

**Warning signs:**
- Content invisible when JavaScript is disabled.
- Enabling "Reduce motion" in macOS System Settings breaks the page.
- No explicit reduced-motion check anywhere in the codebase.

**Phase to address:**
Phase 1 (Foundation) — establish the content-first baseline and reduced-motion detection utility. Every animation added in Phase 2+ must respect this.

---

### Pitfall 5: Scope Creep on Animation Polish Blows the 3-Day Deadline

**What goes wrong:**
With GSAP, every animation can always be "a little better." Developers spend 6+ hours tweaking easing curves, timing offsets, and parallax ratios on one section while other sections remain static placeholders. The prototype ships 70% polished on 30% of the page instead of 90% consistent across the whole page.

**Why it happens:**
Animation work has no natural stopping point. Each adjustment reveals new opportunities. GSAP's API makes micro-adjustments feel quick ("just one more tweak"), but they compound. A 3-4 day timeline has roughly 24-30 productive hours — spending 8 hours on hero section polish leaves nothing for mode switching, the core differentiator.

**How to avoid:**
- Time-box each section's animation work: 2-3 hours maximum, then move on.
- Establish animation presets early (easing, duration, stagger timing) and reuse them. Do not custom-tune every element.
- Build the dual-mode switching FIRST — it is the competition differentiator. Animations without mode switching is a generic portfolio site. Mode switching with basic animations is a compelling concept.
- Use GSAP timelines with labels so animations can be globally adjusted later without per-element tweaking.
- Define "good enough" criteria before starting: elements animate in/out smoothly, timing feels natural, done.

**Warning signs:**
- More than 3 hours spent on a single section's animations.
- Mode switching feature not started by end of day 2.
- Conversations about "what if we added..." instead of "what's left to finish."

**Phase to address:**
All phases — but especially Phase 2 (Animation) and Phase 3 (Mode Switching). Strict time-boxing must be enforced by the roadmap.

---

### Pitfall 6: Geolocation Permission Prompt Without Context Kills Trust

**What goes wrong:**
The browser's geolocation permission dialog appears immediately or without clear user-initiated context. Users deny it reflexively. Once denied, the permission is sticky — the user never sees the prompt again unless they manually dig into browser settings. The on-site mode feature becomes permanently inaccessible for that user.

**Why it happens:**
Developers trigger `navigator.geolocation.getCurrentPosition()` on page load or on a vague "enhance your experience" prompt. Users in 2026 are trained to deny permission requests they don't understand. Browser UX studies confirm that geolocation prompts on page load have 80%+ denial rates.

**How to avoid:**
- NEVER request geolocation on page load.
- Show a custom UI explaining what will happen: "Are you at Kunsthaus right now? We can show you exhibit-specific content." with a clear button.
- Only call the Geolocation API AFTER the user clicks the custom prompt button.
- Always provide manual alternatives: a toggle switch, QR code instructions, or URL parameter (`?mode=onsite`).
- Check `navigator.permissions.query({ name: 'geolocation' })` first — if already denied, skip the prompt and show the manual toggle instead.
- For the competition demo, the QR code and manual toggle paths may be more impressive than geolocation anyway — they are more reliable and demonstrable.

**Warning signs:**
- Geolocation request fires before any user interaction.
- No fallback UI when permission is denied.
- Testing only on localhost (which auto-grants some permissions).

**Phase to address:**
Phase 3 (Mode Switching) — implement geolocation as the last mode-switching method, after manual toggle and QR codes are working.

---

### Pitfall 7: Heavy Images Without Optimization Ruin First Load and Scroll Performance

**What goes wrong:**
Museum websites are image-heavy by nature. Unoptimized hero images (2-5MB each), exhibition photos loaded eagerly, and missing responsive image sizing combine to create 15-30 second first loads on mobile. Scroll-driven animations with unloaded images cause layout shifts that break ScrollTrigger positions.

**Why it happens:**
Prototype mindset: "I'll optimize later." But Astro has image optimization built in — skipping it costs more time in debugging layout shifts than using it from the start. Mock content often uses full-resolution exports from Figma or source photography.

**How to avoid:**
- Use Astro's `<Image />` component from day one — it handles WebP/AVIF conversion, responsive sizes, and lazy loading automatically.
- Set explicit `width` and `height` on all images to prevent layout shifts (CLS).
- Lazy-load everything below the fold. Only the hero image should be eagerly loaded.
- For the prototype, use 3-5 carefully chosen high-quality images rather than 20 mediocre ones. Quality over quantity for competition presentation.
- Call `ScrollTrigger.refresh()` after images in a section have loaded (use the `load` event or Intersection Observer).

**Warning signs:**
- Page weight exceeds 5MB.
- Visible content jumps/shifts during scrolling as images load.
- ScrollTrigger positions are wrong until you manually scroll up and down.

**Phase to address:**
Phase 1 (Foundation) — configure Astro image pipeline and establish image component patterns before content is added.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding content in Astro templates | Faster initial build | Cannot swap to CMS, cannot reuse components across modes | Never — JSON data files are equally fast and project requirement |
| Using `gsap.to()` everywhere instead of timelines | Simpler per-animation | Cannot coordinate sequences, cannot pause/reverse mode transitions | Only for standalone micro-interactions (hover effects) |
| Skipping GSAP context scoping | Less boilerplate | Memory leaks, zombie triggers on any navigation | Acceptable only if strictly single-page with zero navigation |
| Inline styles for animation initial states | Quick visual result | Content invisible without JS, breaks reduced-motion, breaks SSR | Never — use GSAP `.set()` calls in initialization |
| Using ScrollSmoother for "smooth scroll" | Feels premium | Breaks native scroll, conflicts with iOS, accessibility issues, heavy library | Never for a 3-day prototype — native scroll is fine |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GSAP + Astro Islands | Initializing GSAP inside a React/Svelte island that renders client-side, causing hydration flash | Use vanilla `<script>` tags in Astro components for GSAP — no framework islands needed for animation |
| GSAP + Astro SSR | Referencing `window` or `document` at module scope causing build errors | Guard with `if (typeof window !== 'undefined')` or use `client:only` directive |
| Figma MCP + Content | Extracting pixel-perfect values from Figma and hardcoding them | Extract design tokens (colors, spacing, typography) into CSS custom properties; use Figma as reference, not specification |
| Geolocation + HTTPS | Testing geolocation on `http://localhost` works but deploying to HTTP fails | Astro dev server supports HTTPS; deploy target must be HTTPS. Non-issue for most hosting (Netlify, Vercel) |
| QR Code + URL Params | Generating QR codes pointing to localhost or hardcoded URLs | Use relative URL params (`?mode=onsite&exhibit=xyz`) that work on any domain |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Too many simultaneous ScrollTriggers | Frame drops during rapid scroll, especially mid-page where triggers overlap | Limit to 5-8 ScrollTriggers per viewport. Use a single timeline with scroll-scrubbing instead of per-element triggers | 15+ active ScrollTriggers on screen at once |
| Parallax on every element | GPU memory pressure, compositing layer explosion | Parallax on 2-3 hero elements only. Use CSS-only reveals (opacity + transform with IntersectionObserver) for smaller elements | 10+ parallax layers simultaneously |
| Large GSAP bundle with unused plugins | Initial JS parse time delays Time to Interactive | Import only what you use: `import { gsap } from 'gsap'` + `import { ScrollTrigger } from 'gsap/ScrollTrigger'`. Do not import the full GSAP bundle | Any mobile device on 3G connection |
| Font loading causes layout shift | Text reflows after fonts load, breaking ScrollTrigger positions | Use `font-display: swap` with explicit size fallbacks, or preload key fonts. Call `ScrollTrigger.refresh()` on `document.fonts.ready` | Every first visit without cached fonts |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Mode switch without clear current-mode indicator | Users don't know which mode they're in; "Planning" vs "On-site" is meaningless without visual context | Persistent, visible mode indicator with distinct color schemes per mode. The switch itself should be prominent, not buried in a menu |
| Scroll-jacking (taking over native scroll) | Users lose control of scroll speed and direction; disorienting on mobile | Use scroll-linked animations (ScrollTrigger with `scrub`) that enhance native scroll, never replace it. No smooth-scroll libraries |
| Animation blocks content reading | Text animates in letter-by-letter or with long delays; users wait to read | Text should be readable within 0.3s of entering viewport. Decorative animation can continue, but content must land fast |
| No loading state for mode transition | Clicking mode switch feels broken while content swaps | Show immediate visual feedback (color shift, icon change) within 100ms. Content can load progressively after |
| Hover effects with no touch fallback | Touch users on tablets see no interaction feedback | Use `:hover` for desktop, add tap/active states for touch. GSAP hover animations should check for touch: `'ontouchstart' in window` |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Scroll animations:** Often missing `ScrollTrigger.refresh()` call after dynamic content/images load — verify triggers fire at correct scroll positions with cold cache
- [ ] **Mode switching:** Often missing state persistence — verify mode survives page reload (use `localStorage` or URL param)
- [ ] **Responsive layout:** Often missing tablet breakpoint — verify at 768px and 1024px, not just phone and desktop
- [ ] **Text animations:** Often missing actual content readability — verify all text is readable within 0.5s of scroll position, not just visually impressive
- [ ] **Geolocation:** Often missing the "denied" state UI — verify graceful fallback when user denies location permission
- [ ] **JSON content layer:** Often missing image paths / alt text in data files — verify all content (including images, links, metadata) comes from JSON, not templates
- [ ] **Dark/light mode colors per mode:** Often missing contrast ratios — verify WCAG AA contrast (4.5:1 for text) in both Planning and On-site color schemes
- [ ] **Mobile navigation:** Often missing hamburger menu close-on-click — verify navigation closes after selecting a section on mobile
- [ ] **Competition demo:** Often missing offline resilience — verify the prototype works without network (no CDN dependencies for fonts/scripts)

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| ScrollTrigger positions wrong | LOW | Call `ScrollTrigger.refresh()` after all content/images load. Add a `setTimeout(() => ScrollTrigger.refresh(), 1000)` as a safety net. |
| Animations janky on mobile | MEDIUM | Identify non-composited properties in DevTools Performance tab. Replace with transform/opacity equivalents. May require layout restructuring. |
| iOS address bar breaking layout | MEDIUM | Add `ScrollTrigger.normalizeScroll(true)`. Switch all `vh` units to `svh`. Test on real device to confirm. |
| Content invisible without JS | LOW | Move initial styles from GSAP `.set()` to CSS defaults (visible, positioned). Let GSAP override on init. |
| Deadline blown on polish | HIGH | Cut animations to essentials: hero entrance, section reveals (opacity+y), mode transition. Ship consistent basics over inconsistent excellence. |
| Geolocation permanently denied | LOW | Check permission state on load. If denied, hide geolocation option entirely, show manual toggle prominently. |
| Layout shifts from images | LOW | Add explicit width/height to all `<img>` tags. Use Astro `<Image />` component. Call `ScrollTrigger.refresh()` on image load. |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| ScrollTrigger + View Transitions cleanup | Phase 1: Foundation | Navigate between pages (if applicable), verify no console warnings and correct trigger positions |
| Non-composited animation properties | Phase 2: Animation | Chrome DevTools Performance recording shows zero Layout events during scroll |
| iOS address bar resize | Phase 1: Foundation | Test on real iPhone, scroll through entire page, no animation jumps |
| No reduced-motion fallback | Phase 1: Foundation | Enable "Reduce motion" in OS settings, verify all content visible and page usable |
| Scope creep on animation polish | Phase 2: Animation | Time-box enforced, mode switching started by end of day 2 |
| Geolocation permission UX | Phase 3: Mode Switching | Permission only requested after explicit user action, denial has graceful fallback |
| Unoptimized images | Phase 1: Foundation | All images use Astro `<Image />`, page weight under 3MB, no CLS on load |
| Font-triggered layout shift | Phase 1: Foundation | `document.fonts.ready` triggers `ScrollTrigger.refresh()`, no text reflow visible |

## Sources

- [GSAP + Astro View Transitions Guide](https://vaskopavic.com/blog/enhancing-astro-view-transitions-with-gsap-animations/)
- [GSAP + Astro Forum Discussions](https://gsap.com/community/forums/topic/40524-gsap-with-astro-view-transitions-integration/)
- [ScrollTrigger Mobile Stuck/Jump Issues](https://gsap.com/community/forums/topic/45110-scrolltrigger-mobile-stuckjump-low-power-mode-lag/)
- [iPhone ScrollTrigger Performance](https://gsap.com/community/forums/topic/45355-iphone-scroll-performance-issues-%E2%80%93-pinned-scrolltrigger-motionpath-heavy-images)
- [ScrollTrigger Resize Performance](https://gsap.com/community/forums/topic/44874-scrolltrigger-refresh-on-resize-slow-my-whole-page-to-get-rerendered-and-cause-major-performance-lag/)
- [WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [Accessible Web Animation (CSS-Tricks)](https://css-tricks.com/accessible-web-animation-the-wcag-on-animation-explained/)
- [Web Permissions Best Practices (web.dev)](https://web.dev/articles/permissions-best-practices)
- [High-Performance GSAP Animation Guide](https://dev.to/kolonatalie/high-performance-web-animation-gsap-webgl-and-the-secret-to-60fps-2l1g)
- [iOS Safari Viewport Resize Issues](https://github.com/nolimits4web/swiper/issues/5091)
- [ScrollTrigger Memory Leak Discussions](https://gsap.com/community/forums/topic/29002-memory-leak-in-scrolltrigger-scrub/)
- [GSAP Context Cleanup in SPAs](https://gsap.com/community/forums/topic/40561-single-page-cannot-completely-destroy-scrolltrigger/)

---
*Pitfalls research for: Animated museum website (Astro + GSAP, competition prototype)*
*Researched: 2026-04-06*
