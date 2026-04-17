# Phase 04: Deploy + Present - Research

**Researched:** 2026-04-17
**Domain:** Deployment (GitHub Pages), visual polish (CSS/JS), audio playback (Web Audio API), screenshot automation (Playwright), language switching (client-side i18n)
**Confidence:** HIGH

## Summary

Phase 04 covers five distinct work streams: (1) visual polish fixes for profile icon/overlay and audio playlist/player, (2) wiring the EN/DE language switcher for client-side content swapping, (3) wiring actual audio playback in the audio guide, (4) automated screenshot capture with Playwright at 2x retina, and (5) device-framed mockup generation. The deployment infrastructure is already complete -- GitHub Pages with GitHub Actions is live and requires no changes.

The codebase is well-structured for all of these tasks. Content JSON already has `de` and `en` fields everywhere. The audio guide overlay already has transport controls and a persistent `<audio>` element -- it just needs the `audioSrc` field wired correctly. The NavBar uses inline SVG for all icons except the profile button, which still uses a Material Symbol glyph. Playwright is available globally (v1.59.1) but needs to be added as a dev dependency.

**Primary recommendation:** Structure work as: (1) visual polish + audio wiring first, (2) language switcher, (3) deploy/verify, (4) screenshot capture + device framing last.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01/D-02:** No Cloudflare migration -- keep GitHub Pages. No changes to astro.config.mjs site/base.
- **D-03/D-04:** Profile icon: 18x18 inline SVG, fix colors (var(--color-text), transparent bg), both modes.
- **D-05/D-06:** Profile overlay close X replaces profile icon in-place. Other nav icons stay visible.
- **D-07 to D-11:** Audio playlist: exhibition title header, increased track spacing, line dividers, circular right-aligned play buttons, polished styling.
- **D-12/D-13:** Wire real audio playback with controls. Detail player must fit mobile 100dvh.
- **D-14 to D-17:** Playwright automated screenshots: 2x retina, desktop 2560x1440, mobile 750x1334, PNG format. Four design moments.
- **D-18/D-19:** Device-framed mockups: browser chrome (desktop), iPhone bezel (mobile).
- **D-20/D-21:** Wire EN/DE language switcher. FR stays placeholder (disabled/"coming soon").

### Claude's Discretion
- Playwright script structure and navigation timing (wait for animations to settle)
- Browser chrome and iPhone frame styling/source
- Exact scroll positions for capturing scroll-driven effects
- Screenshot output directory structure
- Which specific mobile screens to capture (hamburger menu, sticky bar, stacking sections)
- Language switching mechanism (URL parameter, localStorage, or page reload approach)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TECH-05 | Deployed to live prototype (originally Cloudflare, now GitHub Pages per D-01) | Deployment already live via GitHub Actions. Push to master auto-deploys. No work needed beyond ensuring build passes with all changes. |
| PRES-01 | Screenshots of key design highlights for presentation deck | Playwright automation at 2x retina with device framing. Four design moments defined in D-15. |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 6.1.4 | Static site framework | Already installed, builds to GitHub Pages | [VERIFIED: package.json] |
| gsap | 3.14.2 | Animation | Already used for all overlay animations | [VERIFIED: package.json] |

### New Dependencies
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @playwright/test | 1.59.x | Screenshot automation | Dev dependency for screenshot capture script | [VERIFIED: npx playwright --version returns 1.59.1] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Playwright screenshots | Puppeteer | Playwright has better `deviceScaleFactor` support and is already installed globally |
| CSS device frames | BrowserFrame.com / Screely.com | Online tools require manual work; CSS/HTML frames can be automated in the same Playwright script |
| Client-side lang switch | Astro i18n routing (/en/, /de/) | Would require generating duplicate pages and restructuring URLs -- overkill for a competition prototype. Client-side swap is simpler and already partially wired |

**Installation:**
```bash
npm install -D @playwright/test
npx playwright install chromium
```

## Architecture Patterns

### Language Switching Mechanism

**Recommendation: Client-side DOM swap with localStorage persistence.** [ASSUMED]

The codebase already has the infrastructure:
1. All content JSON uses `{ de: "...", en: "..." }` object format [VERIFIED: all JSON files in src/content/]
2. Pages access content via `content.title[lang]` pattern [VERIFIED: src/pages/index.astro line 92]
3. `lang` is hardcoded to `'en'` at build time in each page [VERIFIED: src/pages/index.astro line 16]
4. LanguageSwitcher already sets `document.documentElement.lang` and saves to localStorage [VERIFIED: LanguageSwitcher.astro]
5. HamburgerOverlay lang buttons do the same [VERIFIED: HamburgerOverlay.astro lines 676-686]

**The gap:** Setting `document.documentElement.lang` does NOT re-render Astro components. Content rendered at build time stays in English. The switcher needs a client-side script that:
1. Finds all elements with localized content
2. Swaps their `textContent` to the selected language
3. Uses data attributes to store both language variants

**Implementation pattern:**
```typescript
// On each page, embed both language variants as data attributes:
// <span data-i18n-de="Willkommen" data-i18n-en="Welcome">Welcome</span>
//
// Then a global script listens for lang changes:
document.documentElement.addEventListener('langchange', () => {
  const lang = document.documentElement.lang;
  document.querySelectorAll('[data-i18n-de]').forEach(el => {
    el.textContent = el.getAttribute(`data-i18n-${lang}`) || el.textContent;
  });
});
```

**Alternative (simpler but coarser):** Page reload after setting localStorage lang, then read `localStorage.getItem('kunsthaus-lang')` at Astro build time in dev mode. This only works in dev, not in static build. For production: embed both languages and swap client-side.

### Profile Icon SVG Pattern

**Source pattern from NavBar.astro:** [VERIFIED: NavBar.astro lines 30-33]
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="2" stroke-linecap="round" 
     stroke-linejoin="round" aria-hidden="true">
  <!-- paths here -->
</svg>
```

The profile icon needs an 18x18 SVG replacing the Material Symbol `account_circle` glyph. A simple user/person outline SVG matching the stroke-based style of search, clock, and hamburger icons.

### Profile Overlay Close-X Positioning

**Reference pattern from HamburgerOverlay.astro:** [VERIFIED: HamburgerOverlay.astro lines 49-54]
- Hamburger overlay has a close X button in its header, positioned where the hamburger icon was
- The overlay header mirrors the nav bar layout exactly
- Close X uses the same stroke-based SVG style (18x18, viewBox 0 0 24 24)

For the profile overlay: the close X must appear at the exact navbar position of the profile button. This means:
1. The profile overlay needs a header that mirrors the navbar right section layout
2. The close X sits in the position where the profile icon was
3. Other nav icons (search, clock, hamburger) remain visible behind the overlay (the overlay is not full-opaque)

**Current state:** ProfileOverlay.astro already has a `profile-overlay__close-x` button in the header, but it's positioned as a generic top-right close, not aligned with the navbar profile icon position. [VERIFIED: ProfileOverlay.astro lines 46-48]

### Audio Playback Architecture

**Current state:** [VERIFIED: AudioGuideOverlay.astro]
- A persistent `<audio>` element is created via `new Audio()` (line 397)
- `audio.src` is set from track data `track.audioSrc` (line 444)
- Transport controls (play/pause/prev/next) are wired (lines 545-555)
- Time updates and seek are wired (lines 558-581)
- The audio file exists: `public/audio/Ballad for Classical Strings.mp3` [VERIFIED: filesystem]
- All tracks point to the same audio file with URL-encoded path [VERIFIED: kerry-james-marshall.json]

**The issue:** The audio source path in JSON is `/audio/Ballad%20for%20Classical%20Strings.mp3` but the base URL prefix needs to be applied. Looking at `loadTrack()` (line 444), `audio.src = track.audioSrc` -- this does NOT prepend the base path. Images use `${base}${track.image}` (line 448) but audio does not.

**Fix needed:** Change `audio.src = track.audioSrc` to `audio.src = \`${base}${track.audioSrc}\`` so the audio file resolves correctly on GitHub Pages where the base is `/Kunsthaus`.

### Screenshot Automation Architecture

**Recommended structure:**
```
scripts/
  screenshots/
    capture.ts          # Main Playwright script
    device-frames.ts    # Post-processing: wrap in device frames
    config.ts           # Viewport sizes, URLs, scroll positions
screenshots/
  raw/                  # Raw Playwright captures
  framed/               # Device-framed versions for deck
```

**Playwright script pattern:** [VERIFIED: Playwright docs support this via deviceScaleFactor]
```typescript
import { chromium } from 'playwright';

const browser = await chromium.launch();

// Desktop 2x retina: 2560x1440 viewport -> 5120x2880 pixel image
const desktopCtx = await browser.newContext({
  viewport: { width: 2560, height: 1440 },
  deviceScaleFactor: 2,
});

// Mobile 2x retina: 375x667 viewport -> 750x1334 pixel image
const mobileCtx = await browser.newContext({
  viewport: { width: 375, height: 667 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
```

### Device Frame Mockups

**Recommendation: HTML/CSS frames rendered by Playwright itself.** [ASSUMED]

Instead of using external tools, create simple HTML templates:
1. `frames/browser-chrome.html` -- minimal browser chrome with address bar showing the GitHub Pages URL
2. `frames/iphone-bezel.html` -- iPhone outline with notch and rounded corners

Then use Playwright to render these HTML templates with the screenshot embedded as an `<img>`, capturing the framed result. This keeps the entire pipeline automated and reproducible.

**Browser chrome elements:**
- Light gray title bar with traffic light dots (red/yellow/green)
- Address bar showing `merlinzuni.github.io/Kunsthaus`
- Minimal chrome -- no tabs, no bookmark bar

**iPhone bezel elements:**
- Black rounded rectangle frame
- Dynamic Island notch at top
- Home indicator bar at bottom

### Anti-Patterns to Avoid
- **Do NOT add Cloudflare adapter or change deployment:** D-01 explicitly locks GitHub Pages.
- **Do NOT build a full i18n routing system:** Client-side swap is sufficient for the prototype.
- **Do NOT use Material Symbols for the profile icon:** D-03 requires inline SVG.
- **Do NOT use PSD/Figma for device frames:** Must be automated in the pipeline.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Screenshot capture | Manual browser screenshots | Playwright script with `deviceScaleFactor: 2` | Reproducible, exact dimensions, scriptable scroll positions |
| Audio playback | Custom audio engine | Native `<audio>` element (already in place) | Already wired in AudioGuideOverlay, just needs correct src path |
| Device frames | Photoshop/manual frame overlay | HTML/CSS templates rendered by Playwright | Automated, reproducible, no design tool dependency |
| Language detection | Complex i18n library | `localStorage` + `document.documentElement.lang` | Already partially implemented in LanguageSwitcher and HamburgerOverlay |

## Common Pitfalls

### Pitfall 1: Audio Path Not Resolving on GitHub Pages
**What goes wrong:** Audio file fails to load because `audioSrc` in JSON is an absolute path without the `/Kunsthaus` base prefix.
**Why it happens:** The JSON stores `/audio/Ballad%20for%20Classical%20Strings.mp3` but GitHub Pages serves from `/Kunsthaus/`. The current code sets `audio.src = track.audioSrc` without base prefix.
**How to avoid:** Prepend `base` to `audio.src` the same way images are handled: `audio.src = \`${base}${track.audioSrc}\``.
**Warning signs:** Silent audio, no errors in console (browser just 404s the audio request).

### Pitfall 2: Playwright Screenshots Capturing Loading States
**What goes wrong:** Screenshots capture spinner/blank states before GSAP animations complete.
**Why it happens:** GSAP animations fire on scroll and on page load with delays. Playwright captures too early.
**How to avoid:** Use `page.waitForTimeout(2000)` after navigation and after scroll actions. Check for specific CSS classes that indicate animation completion. Use `page.waitForLoadState('networkidle')` for initial load.
**Warning signs:** Blank sections, partially visible text, missing images.

### Pitfall 3: Client-Side Language Switch Misses Astro-Rendered Content
**What goes wrong:** Only JS-controlled text changes language; Astro-rendered server text stays in English.
**Why it happens:** Astro components render at build time with `const lang = 'en'`. Setting `document.documentElement.lang` doesn't trigger re-render.
**How to avoid:** For key content visible in screenshots, embed both language variants as data attributes. The switcher script swaps textContent based on data attributes.
**Warning signs:** Mixed-language UI after switching.

### Pitfall 4: Profile Overlay Close X Misaligned with Nav Icon
**What goes wrong:** Close X appears at a different position than the profile icon, breaking the visual continuity.
**Why it happens:** Profile overlay header uses different padding/layout than the navbar.
**How to avoid:** Match the profile overlay header layout exactly to the navbar `__right` section. Reference HamburgerOverlay's header which already mirrors the navbar correctly.
**Warning signs:** Visual jump when opening/closing profile overlay.

### Pitfall 5: Large Audio File Blocking GitHub Pages Deploy
**What goes wrong:** Build or deploy fails or is very slow due to the MP3 file.
**Why it happens:** GitHub Pages has a 1GB repo size soft limit and individual files up to 100MB.
**How to avoid:** The MP3 file should be reasonably sized. Check: `ls -lh public/audio/` -- if over 10MB, consider a shorter clip.
**Warning signs:** Slow `git push`, GitHub warnings about repo size.

### Pitfall 6: Screenshots at Wrong DPI
**What goes wrong:** Screenshots look blurry or are wrong dimensions in the presentation deck.
**Why it happens:** Forgetting `deviceScaleFactor: 2` or using wrong viewport dimensions.
**How to avoid:** Desktop: viewport 2560x1440 with scale 2 = 5120x2880 pixel output. Mobile: viewport 375x667 with scale 2 = 750x1334 pixel output. Verify output dimensions after first run.
**Warning signs:** File dimensions half of expected, text looks soft.

## Code Examples

### Profile Icon SVG (18x18 stroke-based user icon)
```html
<!-- Matches search/clock/hamburger icon style in NavBar.astro -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="2" stroke-linecap="round" 
     stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="8" r="4"/>
  <path d="M20 21c0-3.87-3.58-7-8-7s-8 3.13-8 7"/>
</svg>
```
[ASSUMED -- SVG path needs visual verification, but matches Feather/Lucide user icon style used by the other nav icons]

### Playwright 2x Retina Screenshot
```typescript
// Source: Playwright docs (deviceScaleFactor)
import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 2560, height: 1440 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.goto('http://localhost:4321/Kunsthaus/');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2000); // Let GSAP animations settle
await page.screenshot({ path: 'screenshots/raw/hero-desktop.png', fullPage: false });
```
[VERIFIED: Playwright API supports deviceScaleFactor in browser context]

### Audio Path Fix
```typescript
// Current (broken on GitHub Pages):
audio.src = track.audioSrc;

// Fixed:
audio.src = `${base}${track.audioSrc}`;
```
[VERIFIED: AudioGuideOverlay.astro line 444 vs line 448 image pattern]

### Client-Side Language Swap Pattern
```typescript
// Global script to swap text content when language changes
function applyLanguage(lang: string) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translations = JSON.parse(el.getAttribute('data-i18n-values') || '{}');
    if (translations[lang]) {
      el.textContent = translations[lang];
    }
  });
}

// Listen for language changes from LanguageSwitcher or HamburgerOverlay
const observer = new MutationObserver(() => {
  applyLanguage(document.documentElement.lang);
});
observer.observe(document.documentElement, { attributeFilter: ['lang'] });
```
[ASSUMED -- pattern design, not from official source]

### Minimal Browser Chrome Frame (HTML/CSS)
```html
<div class="browser-frame">
  <div class="browser-frame__titlebar">
    <div class="browser-frame__dots">
      <span class="dot dot--red"></span>
      <span class="dot dot--yellow"></span>
      <span class="dot dot--green"></span>
    </div>
    <div class="browser-frame__address">
      merlinzuni.github.io/Kunsthaus
    </div>
  </div>
  <div class="browser-frame__viewport">
    <img src="screenshot.png" alt="Screenshot" />
  </div>
</div>
```
[ASSUMED -- standard browser chrome mockup pattern]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build + Playwright | Yes | v25.8.1 | -- |
| npm | Package management | Yes | 11.11.0 | -- |
| Playwright | Screenshots (D-14 to D-17) | Yes (global) | 1.59.1 | -- |
| Chromium (for Playwright) | Screenshots | Needs install | -- | `npx playwright install chromium` |
| GitHub Actions | Deployment (D-01) | Yes | deploy.yml exists | -- |
| Audio file | D-12 | Yes | `public/audio/Ballad for Classical Strings.mp3` | -- |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:**
- Playwright Chromium browser needs download: `npx playwright install chromium` (one-time, ~150MB)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual screenshots | Playwright automation | Standard since 2023+ | Reproducible, version-controlled screenshot pipeline |
| PSD device mockups | HTML/CSS frame templates | 2024+ | No design tool dependency, automated in pipeline |
| Server-side i18n routing | Client-side content swap | N/A (prototype choice) | Simpler for static Astro sites, no URL structure change |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Client-side DOM swap is the best language switching approach for this prototype | Architecture Patterns | Low -- alternative is page reload which also works but is less smooth |
| A2 | HTML/CSS device frames rendered by Playwright is better than using an online tool | Architecture Patterns | Low -- online tools are a viable alternative if HTML frames prove complex |
| A3 | Profile icon SVG path (circle head + arc body) matches the visual style | Code Examples | Low -- easy to adjust path data to match exact design intent |
| A4 | 2 second timeout is sufficient for GSAP animations to settle before screenshot | Code Examples | Medium -- may need tuning per page; some scroll-triggered animations need scroll simulation first |

## Open Questions

1. **Audio file size on GitHub Pages**
   - What we know: The MP3 exists in `public/audio/`
   - What's unclear: File size and whether it's appropriate for a Git repo
   - Recommendation: Check file size; if over 5MB, consider Git LFS or a shorter audio clip

2. **FR language option behavior**
   - What we know: D-21 says FR stays placeholder, visually disabled or "coming soon"
   - What's unclear: Exact UX for the disabled state
   - Recommendation: Gray out FR button, show tooltip "Coming soon" on hover, prevent click

3. **Exact scroll positions for screenshot moments**
   - What we know: Four design moments defined (hero, mode switch, KJM detail, mobile)
   - What's unclear: Precise scroll offsets to capture each moment at its best
   - Recommendation: Build script iteratively, tune scroll positions visually

## Sources

### Primary (HIGH confidence)
- Project codebase files: NavBar.astro, NavProfileButton.astro, ProfileOverlay.astro, HamburgerOverlay.astro, AudioGuideOverlay.astro, LanguageSwitcher.astro -- all verified via Read tool
- package.json -- verified dependency versions
- astro.config.mjs -- verified site/base configuration
- .github/workflows/deploy.yml -- verified GitHub Pages deployment pipeline
- kerry-james-marshall.json -- verified content structure and audio paths
- [Playwright TestOptions docs](https://playwright.dev/docs/api/class-testoptions) -- deviceScaleFactor API

### Secondary (MEDIUM confidence)
- [BrowserFrame.com](https://browserframe.com/) -- browser frame generation tool
- [ScreenshotFrames CSS library](https://github.com/olets/ScreenshotFrames) -- responsive device frames in CSS

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all dependencies verified in project, Playwright verified globally
- Architecture: HIGH for audio/profile fixes (codebase fully mapped), MEDIUM for language switching (approach is sound but implementation details are assumed)
- Pitfalls: HIGH -- all identified from codebase analysis (especially the audio base path bug)
- Screenshots: HIGH for Playwright API, MEDIUM for animation timing tuning

**Research date:** 2026-04-17
**Valid until:** 2026-05-17 (stable -- no fast-moving dependencies)
