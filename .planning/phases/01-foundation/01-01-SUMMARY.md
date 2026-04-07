---
phase: 01-foundation
plan: 01
subsystem: ui
tags: [astro, gsap, lenis, css-custom-properties, accessibility]

# Dependency graph
requires: []
provides:
  - "Astro 6 project scaffold with React integration"
  - "Three-layer CSS token architecture (primitives, semantic, component)"
  - "Mode-aware theming via data-mode attribute (planning/onsite)"
  - "Lenis + GSAP ScrollTrigger smooth scroll integration"
  - "Typography system with Perfect Fourth modular scale"
  - "Accessibility foundations (skip-nav, focus-visible, reduced-motion, noscript)"
  - "BaseLayout component as root layout for all pages"
affects: [01-02, 01-03, 02-static-homepage, 03-dual-mode]

# Tech tracking
tech-stack:
  added: [astro@6.1.4, gsap@3.14.2, lenis@1.3.21, leva@0.10.1, react@19.2.4, react-dom@19.2.4, prettier@3.8.1, prettier-plugin-astro@0.14.1]
  patterns: [css-layers, three-layer-tokens, data-mode-theming, lenis-gsap-sync, astro-layout-pattern]

key-files:
  created:
    - src/layouts/BaseLayout.astro
    - src/styles/layers.css
    - src/styles/reset.css
    - src/styles/tokens/primitives.css
    - src/styles/tokens/semantic.css
    - src/styles/tokens/components.css
    - src/styles/typography.css
    - src/styles/base.css
    - src/components/SkipNav.astro
    - src/components/Head.astro
    - astro.config.mjs
    - .prettierrc
    - .prettierignore
  modified:
    - src/pages/index.astro
    - package.json
    - tsconfig.json

key-decisions:
  - "Commented out Astro Fonts API config -- local() provider crashes when font files are missing, fallback stack used until .woff2 files are added"
  - "Package name set to kunsthaus-zurich"

patterns-established:
  - "CSS @layer cascade: reset, tokens, base, layout, components, utilities"
  - "Three-layer token architecture: primitives (raw values) -> semantic (mode-aware aliases) -> component (scoped)"
  - "Mode switching via html[data-mode] attribute at semantic token layer"
  - "BaseLayout as single root layout importing all CSS in cascade order"
  - "Lenis + GSAP ticker sync pattern with reduced-motion destruction"

requirements-completed: [TECH-01, TECH-03, TECH-04]

# Metrics
duration: 6min
completed: 2026-04-07
---

# Phase 01 Plan 01: Project Scaffold Summary

**Astro 6 project with three-layer CSS token architecture, Lenis smooth scroll, mode-aware theming via data-mode attribute, and WCAG AA accessibility foundations**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-07T08:38:34Z
- **Completed:** 2026-04-07T08:44:26Z
- **Tasks:** 3
- **Files modified:** 23

## Accomplishments
- Astro 6.1.4 project scaffold with React integration, GSAP, Lenis, and Leva installed
- Three-layer CSS custom property architecture with Planning/On-site mode switching via data-mode attribute
- BaseLayout wiring all CSS imports, Lenis + GSAP ScrollTrigger smooth scroll, skip-nav, and noscript fallback
- Perfect Fourth (1.333) modular type scale with DINNextW1G fallback font stack

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Astro 6 project with dependencies and configuration** - `1469fe0` (feat)
2. **Task 2: Create CSS token architecture, typography, base styles, and a11y foundations** - `d7e72f8` (feat)
3. **Task 3: Wire BaseLayout with CSS imports, Lenis smooth scroll, and index page** - `841a30c` (feat)

## Files Created/Modified
- `astro.config.mjs` - Astro config with React integration, font config commented out pending .woff2 files
- `package.json` - Project dependencies: astro, gsap, lenis, leva, react, prettier
- `tsconfig.json` - TypeScript strict mode with React JSX support
- `.prettierrc` / `.prettierignore` - Prettier config with astro plugin
- `src/layouts/BaseLayout.astro` - Root layout: CSS imports, Lenis init, SkipNav, noscript, data-mode
- `src/pages/index.astro` - Test page verifying tokens, typography, and smooth scroll
- `src/styles/layers.css` - CSS @layer cascade declaration
- `src/styles/reset.css` - Modern CSS reset with prefers-reduced-motion
- `src/styles/tokens/primitives.css` - Raw color and spacing values
- `src/styles/tokens/semantic.css` - Mode-aware semantic token aliases
- `src/styles/tokens/components.css` - Component-level token placeholders
- `src/styles/typography.css` - Type scale and font setup
- `src/styles/base.css` - Global body, heading, link, and focus styles
- `src/components/SkipNav.astro` - Keyboard accessibility skip navigation
- `src/components/Head.astro` - Meta tags, viewport, title
- `src/assets/fonts/DINNextW1G/README.md` - Font file instructions

## Decisions Made
- **Astro Fonts API commented out:** The `fontProviders.local()` provider crashes with `UnknownFilesystemError` when .woff2 files don't exist on disk. Unlike what the plan expected, it does not degrade gracefully. Font config is preserved as comments in astro.config.mjs, ready to uncomment when files are added. Typography.css defines the fallback stack directly.
- **Package name:** Set to `kunsthaus-zurich` (was `--typescript` from scaffolding mishap).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Astro Fonts API crashes without font files**
- **Found during:** Task 1 (project scaffold)
- **Issue:** `fontProviders.local()` throws `ENOENT` when referenced .woff2 files don't exist, crashing the dev server
- **Fix:** Commented out the `fonts:` configuration block in astro.config.mjs, preserved as documentation for when font files are added. Fallback font stack in typography.css handles rendering.
- **Files modified:** astro.config.mjs
- **Verification:** Dev server starts cleanly after commenting out fonts config
- **Committed in:** 1469fe0 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential fix to unblock dev server. Font rendering uses fallback stack until .woff2 files are provided. No scope creep.

## Issues Encountered
- `npm create astro@latest` created project in `--typescript` subdirectory instead of current directory due to argument parsing. Fixed by copying files to project root and reinstalling node_modules.

## Known Stubs
None -- all files contain real implementation, no placeholder data or TODO items that block the plan's goals.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Project skeleton is complete, dev server runs at localhost:4321
- Ready for Plan 02 (grid system with Leva dev overlay)
- Ready for Plan 03 (JSON content collections)
- DINNextW1G .woff2 font files still needed -- add to `src/assets/fonts/DINNextW1G/` and uncomment fonts config in astro.config.mjs

## Self-Check: PASSED

All 15 created files verified present on disk. All 3 task commits (1469fe0, d7e72f8, 841a30c) verified in git log.

---
*Phase: 01-foundation*
*Completed: 2026-04-07*
