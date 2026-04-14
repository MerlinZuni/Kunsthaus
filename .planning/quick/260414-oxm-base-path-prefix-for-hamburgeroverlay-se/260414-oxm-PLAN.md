---
phase: quick-260414-oxm
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/nav/HamburgerOverlay.astro
autonomous: true
requirements:
  - QUICK-260414-OXM
must_haves:
  truths:
    - "Logo link in hamburger overlay navigates to /Kunsthaus/ (not /) when deployed under base path"
    - "Membership, Login, Shop, and Press links resolve to /Kunsthaus/{slug} under base path"
    - "External visitor guide link (line 118) remains unchanged"
    - "Production build (`npm run build`) succeeds with no new warnings"
  artifacts:
    - path: "src/components/nav/HamburgerOverlay.astro"
      provides: "Base-path-aware secondary and logo anchors"
      contains: "${base}/membership"
  key_links:
    - from: "src/components/nav/HamburgerOverlay.astro"
      to: "import.meta.env.BASE_URL"
      via: "existing `base` frontmatter const (line 19)"
      pattern: "\\$\\{base\\}/"
---

<objective>
Fix 5 hardcoded root-absolute anchor hrefs in `HamburgerOverlay.astro` that break navigation under the `/Kunsthaus/` GitHub Pages base path. Reuse the existing `base` constant already computed in the component frontmatter.

Purpose: Close the verification gap flagged in phase 03 — hamburger overlay secondary links and logo must route correctly when the site is served from a subdirectory.
Output: Updated `HamburgerOverlay.astro` with base-aware hrefs; passing build.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@CLAUDE.md
@src/components/nav/HamburgerOverlay.astro
@.planning/phases/03-dual-mode-routing/03-VERIFICATION.md

<interfaces>
<!-- The component already exposes a base path helper in its frontmatter: -->

From src/components/nav/HamburgerOverlay.astro (line 19):
```astro
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
```

Used on line 24 for `planningHref`:
```astro
const planningHref = `${base}/`;
```

Pattern to follow for new hrefs: `` href={`${base}/membership`} ``
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Prefix hamburger overlay anchors with base path</name>
  <files>src/components/nav/HamburgerOverlay.astro</files>
  <action>
Edit `src/components/nav/HamburgerOverlay.astro` to make 5 anchor hrefs base-path-aware. Reuse the existing `base` const declared at line 19 — do NOT recompute it.

Exact changes (target lines are 1-indexed, current state per file read):

1. Line 46 — logo anchor:
   - Before: `<a href="/" class="hamburger-overlay__logo">`
   - After:  `` <a href={`${base}/`} class="hamburger-overlay__logo"> ``
   - Rationale: Matches existing `planningHref` pattern on line 24 (trailing slash preserved).

2. Line 100 — membership:
   - Before: `<a href="/membership" ...>`
   - After:  `` <a href={`${base}/membership`} ...> ``

3. Line 106 — login:
   - Before: `<a href="/login" ...>`
   - After:  `` <a href={`${base}/login`} ...> ``

4. Line 112 — shop:
   - Before: `<a href="/shop" ...>`
   - After:  `` <a href={`${base}/shop`} ...> ``

5. Line 124 — press:
   - Before: `<a href="/press" ...>`
   - After:  `` <a href={`${base}/press`} ...> ``

DO NOT touch:
- Line 118 `https://visitorguide.kunsthaus.ch/` — external URL, correctly unprefixed.
- Lines 65/74 `planningHref`/`onsiteHref` — already base-aware.
- Line 87 `item.href` from navItems prop — base-aware upstream.
- Line 47 `<img src="/Kunsthaus/images/logo.png" ...>` — out of scope (verifier flagged anchors only).

Preserve all other attributes on each anchor exactly (class names, data attributes, etc.).
  </action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>
- All 5 target hrefs use `` `${base}/...` `` template literals
- External URL on line 118 unchanged
- Img src on line 47 unchanged
- `npm run build` exits 0 with no new warnings
- Built HTML in `dist/` (or equivalent) contains `/Kunsthaus/membership`, `/Kunsthaus/login`, `/Kunsthaus/shop`, `/Kunsthaus/press`, and `/Kunsthaus/` for the logo anchor
  </done>
</task>

</tasks>

<verification>
After task completion:

1. Run `npm run build` — must succeed.
2. Grep the built output for correctness:
   - `grep -r 'href="/membership"' dist/` → should return NOTHING
   - `grep -r 'href="/Kunsthaus/membership"' dist/` → should match
   - `grep -r 'visitorguide.kunsthaus.ch' dist/` → external URL still present, unchanged
3. Visually inspect diff: only 5 lines changed in `HamburgerOverlay.astro`.
</verification>

<success_criteria>
- 5 anchor hrefs in `HamburgerOverlay.astro` are base-path-aware via `${base}` template literals
- No other files modified
- External visitor guide link preserved
- `npm run build` succeeds
- Built HTML emits `/Kunsthaus/`-prefixed URLs for the logo and 4 secondary links
</success_criteria>

<output>
After completion, create `.planning/quick/260414-oxm-base-path-prefix-for-hamburgeroverlay-se/260414-oxm-SUMMARY.md` documenting the fix and confirming build verification.
</output>
