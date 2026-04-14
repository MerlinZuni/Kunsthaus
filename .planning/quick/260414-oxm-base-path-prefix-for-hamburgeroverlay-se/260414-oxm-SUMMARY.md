---
phase: quick-260414-oxm
plan: 01
subsystem: nav
tags: [bugfix, routing, base-path, github-pages]
requirements: [QUICK-260414-OXM]
key-files:
  modified:
    - src/components/nav/HamburgerOverlay.astro
commits:
  - 4b289e4
---

# Quick 260414-oxm: Base Path Prefix for HamburgerOverlay Secondary Links

**One-liner:** Prefixed 5 hardcoded root-absolute anchor hrefs in `HamburgerOverlay.astro` with the existing `base` const so logo and secondary nav resolve correctly under the `/Kunsthaus/` GitHub Pages base path.

## Changes

All 5 edits in `src/components/nav/HamburgerOverlay.astro`, reusing the `base` const already declared at line 19 (`import.meta.env.BASE_URL.replace(/\/$/, '')`):

| Line | Before                | After                            |
| ---- | --------------------- | -------------------------------- |
| 46   | `href="/"`            | `` href={`${base}/`} ``          |
| 100  | `href="/membership"`  | `` href={`${base}/membership`} ``|
| 106  | `href="/login"`       | `` href={`${base}/login`} ``     |
| 112  | `href="/shop"`        | `` href={`${base}/shop`} ``      |
| 124  | `href="/press"`       | `` href={`${base}/press`} ``     |

Untouched (per plan constraints):
- Line 118 — external `https://visitorguide.kunsthaus.ch/` URL.
- Line 47 — `<img src="/Kunsthaus/images/logo.png">`.

## Verification

**Build:** `npm run build` — exit 0, 2 pages built in 6.07s. No new warnings (the 3 pre-existing `textures/*.png` runtime-resolve warnings are unrelated and preexisted this change).

**Built HTML inspection (`dist/index.html`):**
```
href="/Kunsthaus/login"
href="/Kunsthaus/membership"
href="/Kunsthaus/press"
href="/Kunsthaus/shop"
```
External URL `visitorguide.kunsthaus.ch` still present and unchanged.

## Deviations from Plan

None — plan executed exactly as written.

## Commit

- `4b289e4` fix(hamburger-overlay): prefix secondary and logo hrefs with base path

## Self-Check: PASSED

- FOUND: src/components/nav/HamburgerOverlay.astro (modified)
- FOUND: commit 4b289e4
- FOUND: /Kunsthaus/{membership,login,shop,press} in dist/index.html
- FOUND: visitorguide.kunsthaus.ch preserved in dist/index.html
