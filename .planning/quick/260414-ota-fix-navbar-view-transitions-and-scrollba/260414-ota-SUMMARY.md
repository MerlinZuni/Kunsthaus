---
task: 260414-ota
type: quick
title: Fix navbar View Transitions dual-init and scrollbar-gutter shift
status: complete
completed: 2026-04-14
files_modified:
  - src/styles/base.css
  - src/components/nav/NavBar.astro
  - src/components/nav/SearchOverlay.astro
  - src/components/nav/HoursOverlay.astro
---

# Quick Task 260414-ota: Navbar Hotfixes — Summary

**One-liner:** Fixed two latent navbar bugs surfaced during interactive review of quick task `260414-npq` (OnsiteHero redesign): the navbar shifted horizontally whenever an overlay opened, and navbar click handlers were dead after any View Transitions navigation.

This task is **retrospective** — the work was done live during a debugging review session, not through a normal `/gsd-quick` discuss → plan → execute cycle. There is no `CONTEXT.md` or `PLAN.md`; this summary documents what changed and why after the fact.

## Bug 1: Navbar Shifts Horizontally When Overlays Open

### Symptom
Opening the hamburger, search, or hours overlay caused the navbar to jump horizontally by roughly 7-8 pixels. The overlay itself stayed put, but the fixed-position navbar visibly re-measured wider, offsetting the centered logo and right-aligned icons.

### Root Cause
All three overlays lock scroll two different ways when opened:

1. `document.body.style.overflow = 'hidden'` (in each overlay's own script)
2. `(window as any).__lenis?.stop?.()` which causes Lenis's stylesheet to apply `html.lenis-stopped { overflow: hidden !important; }` (from `lenis/dist/lenis.css`)

On any system where vertical scrollbars take layout width (macOS "Show scrollbars: Always", Windows, mouse-connected Macs, deployed environments), hiding the scrollbar widens the initial containing block by the scrollbar width. Both the overlay (`position: fixed; inset: 0`) and the navbar (`position: fixed; left: 0; width: 100%`) re-measure — but the user perceives the overlay as stable because it's the focal element, and the navbar as the one that moves.

**This bug has been latent** since overlays were first built (commit `3b5b49e`). It was not introduced by phase 03-02 or by the OnsiteHero quick task — it was simply noticed now because the hero review session put alignment under scrutiny.

### Fix
Added `scrollbar-gutter: stable` to `<html>` in `src/styles/base.css`:

```css
html {
  scrollbar-gutter: stable;
}
```

This permanently reserves the scrollbar's gutter space, so hiding or showing the vertical scrollbar no longer changes layout width. Harmless no-op on systems with overlay scrollbars. Supported in all modern browsers (Chrome 94+, Safari 17+, Firefox 97+).

## Bug 2: Navbar Icons Dead After View Transitions Navigation

### Symptom
Opening the hamburger overlay and clicking the mode toggle (e.g. `AT THE MUSEUM` → `PLAN A VISIT`) successfully navigated to the other mode's route, but on the destination page the search, hours, and hamburger icons in the main navbar were unclickable. Any subsequent View Transitions navigation had the same effect.

### Root Cause
`src/components/nav/NavBar.astro`, `SearchOverlay.astro`, and `HoursOverlay.astro` each only attached their init function to `DOMContentLoaded`:

```js
document.addEventListener('DOMContentLoaded', initNavBar);
```

Astro's `ClientRouter` (enabled in `BaseLayout.astro` via `<ClientRouter />`) swaps DOM on navigation **without** re-firing `DOMContentLoaded`. Instead it fires `astro:page-load`. Because none of these three files listened for `astro:page-load`, the fresh navbar DOM on subsequent pages never had its click handlers (`data-action="search"`, `data-action="hamburger"`, `data-action="hours"`) attached.

`HamburgerOverlay.astro` was already correct — it had dual-init on both `DOMContentLoaded` and `astro:page-load` from a prior phase. This is why the hamburger icon *appeared* to work cross-navigation in some testing scenarios (it doesn't depend on NavBar's init).

### Secondary Concern: Listener Accumulation
`initNavBar` attaches three window-level listeners:

- `window.addEventListener('scroll', onScroll)` — navbar fade-on-scroll
- `window.addEventListener('mousemove', onMouseMove)` — show navbar on cursor near top
- `window.addEventListener('scroll', checkLogoBg)` — sample background behind logo for light/dark toggle

Each of these captures a reference to the `navbar` element in its closure. Naively re-running `initNavBar` on every `astro:page-load` would leak listeners: each navigation would add another set pointing at an orphaned (detached) navbar from the previous page.

`initSearchOverlay` and `initHoursOverlay` each attach a single `document.addEventListener('keydown', ...)` listener for Escape-to-close, which has the same accumulation risk.

### Fix

**`NavBar.astro`:**
- Introduced a module-scoped `navBarCleanup: (() => void) | null = null`.
- At the start of each `initNavBar` call, `navBarCleanup?.()` removes any previously-registered window listeners.
- After attaching the new `onScroll`, `onMouseMove`, and `checkLogoBg` window listeners, `navBarCleanup` is reassigned to a closure that removes exactly those handles.
- Dual-init block at the bottom:
  ```js
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavBar);
  } else {
    initNavBar();
  }
  document.addEventListener('astro:page-load', initNavBar);
  ```

**`SearchOverlay.astro`:**
- Module-scoped `searchOverlayCleanup`.
- The Escape keydown handler is now a named `onKeyDown` so it can be removed on re-init.
- Same dual-init block at the bottom.

**`HoursOverlay.astro`:**
- Identical pattern to `SearchOverlay.astro`.

**`HamburgerOverlay.astro`:** not modified — already correct.

## Verification

**Build:**
```
npm run build → ✓ Completed in 6.33s
2 page(s) built (/index.html, /onsite/index.html)
```

No new warnings or errors. Pre-existing `/Kunsthaus/textures/*.png` runtime-resolved asset warnings remain untouched.

**Manual testing checklist (for user to confirm after hard reload):**
- [ ] `/planning`: click search → opens. Click hours → opens. Click hamburger → opens.
- [ ] Hamburger → click "At the museum" mode toggle → navigates to `/onsite`.
- [ ] `/onsite`: click search → opens. Click hours → opens. Click hamburger → opens.
- [ ] Hamburger → click "Plan a visit" → returns to `/planning`.
- [ ] `/planning` (second time): click all three icons again → all still work.
- [ ] At every step, verify navbar does not visually jump horizontally when an overlay opens or closes.

## Out of Scope

- `HamburgerOverlay.astro` has an unstaged 1-line cosmetic edit (`text-decoration: none` on mode toggle anchors) from pre-existing user WIP — left alone.
- Pre-existing Phase 02 bug: `HamburgerOverlay` secondary/logo anchors (lines 46, 100, 106, 112, 118, 124) are not base-path-prefixed. Flagged in `03-VERIFICATION.md` for a future quick task. Not addressed here.

## Commits

- Code fix: `fix(nav): scrollbar-gutter and View Transitions dual-init`
- Docs: `docs(quick-260414-ota): retrospective summary`

## Deviations

None. This task was retrospective debugging — no prior plan to deviate from.

## Self-Check

- `src/styles/base.css` contains `scrollbar-gutter: stable` on `html` — to verify
- `src/components/nav/NavBar.astro` listens for `astro:page-load` and has `navBarCleanup` module scope — to verify
- `src/components/nav/SearchOverlay.astro` listens for `astro:page-load` and removes old keydown listener on re-init — to verify
- `src/components/nav/HoursOverlay.astro` same as SearchOverlay — to verify
- Build status: PASS
