---
phase: 03-dual-mode-routing
plan: 01
subsystem: routing, mode-toggle
tags: [astro, view-transitions, routing, refactor, url-as-state]

requires:
  - phase: 02-static-homepage
    provides: "Mode toggle writers, BaseLayout, working Planning home"

provides:
  - "Astro View Transitions enabled globally via <ClientRouter /> in BaseLayout"
  - "/onsite stub route rendering data-mode='onsite' with the dark palette cascade"
  - "URL-as-state: HamburgerOverlay + FooterColumns mode segments are now <a href> navigation"
  - "Server-rendered active segment derived from Astro.url.pathname (base-path aware)"
  - "All localStorage 'kunsthaus-mode' reads/writes removed"
  - "Removal of unused ModeToggle React island"
  - "Footer mode pill self-contained (no longer driven by StickyCTA script)"

affects: [03-02, 03-03, 03-04]

tech-stack:
  added: []
  patterns:
    - "URL-as-state mode toggle pattern (pathname-based active segment, base-path aware)"
    - "astro:page-load re-init for stateful overlays"
    - "import.meta.env.BASE_URL prefix for both pathname checks and href construction"

key-files:
  created:
    - src/pages/onsite/index.astro
  modified:
    - src/components/ui/StickyCTA.astro
    - src/components/nav/HamburgerOverlay.astro
    - src/components/footer/FooterColumns.astro
    - src/content.config.ts
  deleted:
    - src/components/ui/ModeToggle.tsx

key-decisions:
  - "Base-path-aware pathname check: strip import.meta.env.BASE_URL ('/Kunsthaus') before pattern-matching so active state works on GitHub Pages"
  - "Footer mode pill init moved out of StickyCTA into FooterColumns (StickyCTA no longer owns mode UI)"
  - "Hamburger mode anchors close the overlay before navigation (ClientRouter handles the rest)"
  - "ModeToggle.tsx deleted outright (only consumer was a stale import in StickyCTA, which had no rendered toggle)"
  - "Made footer.social.icon optional in the Zod schema to unblock the pre-existing build break introduced by the Phase 02 text-only social link refactor"

requirements-completed: []

duration: 9 min
completed: 2026-04-14
---

# Phase 03 Plan 01: Routing Foundation Summary

URL-as-state dual-mode routing wired end to end: clicking a mode segment on `/Kunsthaus/` navigates to `/Kunsthaus/onsite` via Astro View Transitions, the active pill reflects the current pathname server-side, and every trace of localStorage-based mode persistence is gone. The pre-existing footer.json schema break that prevented `astro build` from running was fixed inline.

**Duration:** 9 min (resumed session, Task 1 already committed previous session)
**Started:** 2026-04-14T12:48Z
**Ended:** 2026-04-14T12:54Z
**Tasks completed:** 6 (Tasks 2–7; Task 1 was committed in prior session as 98581d8)
**Files touched:** 5 (1 created, 3 modified, 1 deleted) + 1 schema fix

## Tasks

| # | Description | Commit |
|---|---|---|
| 2 | Create `/onsite` stub route with `mode="onsite"` | `073c8b5` |
| 3 | Strip mode/localStorage logic from StickyCTA, drop dead ModeToggle import | `25b0904` |
| 4 | HamburgerOverlay mode segments → `<a href>`, close-before-navigate, kill localStorage | `0e85c50` |
| 5 | FooterColumns mode segments → `<a href>`, own pill init script, kill localStorage | `30efee6` |
| 6 | Delete unused ModeToggle.tsx | `67f1a38` |
| — | Deviation fix: base-path aware pathname + footer schema unblock | `c1f9cb5` |
| 7 | Integration verification (build + dev server + grep gates) | (this commit) |

## Success criteria

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | `/` renders Planning home unchanged | PASS (file-level) | No Planning home files modified; rebuild `dist/index.html` has `data-mode="planning"` |
| 2 | Mode segment from any toggle navigates `/` → `/onsite` with View Transitions | PASS (structural) | `<a href="/Kunsthaus/onsite">` in hamburger + footer; `<ClientRouter />` present in head |
| 3 | Same flow in reverse (`/onsite` → `/`) | PASS (structural) | `<a href="/Kunsthaus/">` rendered in both writers on /onsite/index.html |
| 4 | `html[data-mode]` correct on each page | PASS | `dist/index.html` → `data-mode="planning"`, `dist/onsite/index.html` → `data-mode="onsite"` (verified via grep + curl from dev server) |
| 5 | Semantic token cascade applies dark palette on /onsite | PASS (token wiring) | data-mode attribute present, semantic tokens already cascade from Phase 02 |
| 6 | Active segment reflects pathname | PASS | grep on rendered HTML: planning page has `aria-checked="true"` only on planning; onsite page has it only on onsite (both writers) |
| 7 | localStorage no longer stores `kunsthaus-mode` | PASS | `grep -rn 'kunsthaus-mode' src/` returns zero matches |
| 8 | Browser back/forward navigates between routes | PASS (View Transitions inherent behavior) | `<ClientRouter />` enables native History API integration; no custom history code added |
| 9 | `npm run build` succeeds with no errors | PASS | Build produced `/onsite/index.html` and `/index.html` in 6.34s after schema fix; only warnings are unrelated texture path resolution (pre-existing) |
| 10 | `npm run dev` runs without console errors | PASS (server-side) | Dev server on :4322 served both routes 200 with no error log entries; client-side console errors cannot be confirmed without a browser — flagged below |

## Deviations from Plan

### [Rule 1 - Bug] Base-path aware pathname matching
- **Found during:** Task 7 verification (the rendered `aria-checked` was wrong on `/onsite`)
- **Issue:** The plan's pathname check `Astro.url.pathname.startsWith('/onsite')` doesn't fire on this project because `astro.config.mjs` sets `base: '/Kunsthaus'`. `Astro.url.pathname` is `/Kunsthaus/onsite/`, so `startsWith('/onsite')` is false on every page. Same problem applied to the bare `<a href="/">` and `<a href="/onsite">` anchors — they would have routed to `/` and `/onsite` outside the project base.
- **Fix:** In both `HamburgerOverlay.astro` and `FooterColumns.astro`, derive `base` from `import.meta.env.BASE_URL`, strip it from `Astro.url.pathname` before the `startsWith('/onsite')` check, and prefix all anchor `href`s with `${base}`.
- **Files modified:** `src/components/nav/HamburgerOverlay.astro`, `src/components/footer/FooterColumns.astro`
- **Verification:** Rebuilt + grepped — `/onsite/index.html` now has `aria-checked="true"` on the onsite segment; `/index.html` has it on the planning segment. Both anchors render `href="/Kunsthaus/..."`.
- **Commit:** `c1f9cb5`

### [Rule 3 - Blocking] Pre-existing footer.json schema mismatch
- **Found during:** Task 7 verification (`npm run build` and `npm run dev` both failed)
- **Issue:** `src/content.config.ts` requires `footer.social[].icon: z.string()`, but `src/content/shared/footer.json` lost the `icon` field when Phase 02's footer was redesigned to use text-only social links. Confirmed pre-existing by checking out commit `98581d8` (Task 1) — same error reproduces. Without this fix, plan success criteria #9 (`npm run build` succeeds) and #10 (`npm run dev` no errors) cannot be satisfied.
- **Fix:** Made `icon` optional in the schema (`z.string().optional()`). Did not touch the JSON data — minimal change, preserves the text-only social pattern shipped in Phase 02.
- **Files modified:** `src/content.config.ts`
- **Verification:** `npm run build` now completes in ~6s with both routes generated; `npm run dev` serves 200 on `/Kunsthaus/` and `/Kunsthaus/onsite`.
- **Commit:** `c1f9cb5` (combined with the base-path fix)

**Total deviations:** 2 auto-fixed (1 Rule 1 - Bug, 1 Rule 3 - Blocking).
**Impact:** Both fixes were necessary to satisfy plan-defined success criteria. The base-path fix is a correctness fix that would have caused the demo to be broken on the deployed `/Kunsthaus` GitHub Pages base. The schema fix unblocked a pre-existing build break unrelated to this plan but discovered during its verification gate.

## Authentication Gates

None.

## Needs human verification

The following four items require an actual browser session and could not be verified from a headless environment:

1. **Visual smoothness of the View Transitions animation** between `/` and `/onsite` (palette flip + element morph timing).
2. **Browser console** is clean during navigation — server-side rendering and dev server logs are clean, but client-side runtime errors from any of the GSAP/Lenis/overlay scripts can only be observed in the browser devtools.
3. **No flash of light palette** on hard refresh of `/onsite` — the rendered HTML has the correct `data-mode="onsite"` from server-side, so the cascade should apply on first paint, but actual rendering needs a browser.
4. **Pill-slide animation correctness** in the hamburger overlay after a View Transitions navigation — the script re-inits on `astro:page-load` but the GSAP timing should be eyeballed.

If any of these fail under human eyes, the most likely culprits are: (a) pill-slide layout-thrashing because the overlay is not yet measured when `requestAnimationFrame` fires after `astro:page-load`; (b) the `kunsthaus-reduce-motion` toggle script emitting a benign warning. Both are easy fixes.

## Known Stubs

- `src/pages/onsite/index.astro` — entire page is a placeholder. The "On-site mode — coming in 03-02" heading is intentional; the real on-site landing page is the deliverable of Phase 03-02. This stub exists solely to prove the routing foundation works end to end.

## Self-Check: PASSED

- File `src/pages/onsite/index.astro` exists.
- Commits `073c8b5`, `25b0904`, `0e85c50`, `30efee6`, `67f1a38`, `c1f9cb5` all reachable from HEAD.
- ModeToggle.tsx removal verified — file no longer in tree, zero remaining references in `src/`.
- `grep -rn 'kunsthaus-mode' src/` returns zero matches.
- `npm run build` produces `dist/index.html` and `dist/onsite/index.html` with correct `data-mode` attributes.
- Dev server serves both routes 200 with correct active segments.
