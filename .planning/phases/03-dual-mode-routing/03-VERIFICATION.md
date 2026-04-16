---
phase: 03-dual-mode-routing
verified: 2026-04-16T11:40:00Z
status: human_needed
score: 8/8 must-haves verified (all plans 03-01 through 03-04)
re_verification:
  previous_status: human_needed
  previous_score: 7/7 automated (plans 03-01/02/03 only; 03-04 was out of scope)
  gaps_closed:
    - "SC5: Headphones -> paywall (logged out) — PaywallOverlay now wired to ArtworkSlider"
    - "SC6: Buy Tickets simulates login; NavProfileButton fades in; hamburger Log in becomes My Account"
    - "SC7: AudioGuideOverlay with Playlist + DetailPlayer bottom-sheet (GSAP translateY, persistent Audio element)"
    - "SC8: ProfileOverlay with QR ticket, 6 secondary nav items, and log out"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Click mode toggle on / — palette flip via View Transitions, not hard reload"
    expected: "Smooth animated transition; URL changes to /Kunsthaus/onsite; dark palette applied without flash"
    why_human: "Visual animation smoothness can only be judged in a browser"
  - test: "Hard refresh /onsite — no flash of light palette on first paint"
    expected: "Dark palette visible from first paint (data-mode='onsite' is server-rendered)"
    why_human: "First-paint flash requires real browser render"
  - test: "KJM hero video autoplays with poster fallback on iOS Safari"
    expected: "Video plays muted on load; poster shows before playback begins"
    why_human: "Mobile autoplay behaviour and poster timing only testable in a real browser"
  - test: "Artwork slider horizontal scroll vs page vertical scroll on mobile"
    expected: "Horizontal swipe scrolls the slider, not the page"
    why_human: "Touch gesture conflict with SectionWrapper pinning needs device testing"
  - test: "Tap headphones button on artwork (logged out) — PaywallOverlay appears with Buy Tickets + Become a Member CTAs"
    expected: "Overlay appears over the page with two CTAs; clicking either triggers simulateLogin()"
    why_human: "Requires browser interaction and DOM overlay rendering"
  - test: "Click Buy Tickets in PaywallOverlay — profile icon fades in, paywall closes, audio guide opens to that track"
    expected: "GSAP back.out fade-in on NavProfileButton; PaywallOverlay dismisses; AudioGuideOverlay opens at pending track"
    why_human: "Requires browser to execute GSAP animations and CustomEvent propagation sequence"
  - test: "AudioGuideOverlay playlist visible; tap a track — DetailPlayer bottom-sheet slides up"
    expected: "10 tracks listed; tapping any slides up bottom-sheet with artwork image, transport controls, and progress bar; audio element plays"
    why_human: "GSAP translateY animation and actual audio playback require a browser"
  - test: "ProfileOverlay — QR ticket visible, 6 nav items listed, Log out reverts to pre-login state"
    expected: "qr_code_2 icon and KUNSTHAUS-DEMO code visible; 6 nav rows; Log out removes profile icon and restores hamburger 'Log in'"
    why_human: "Visual layout and CustomEvent logout chain require browser to verify"
---

# Phase 03: Dual-Mode Routing Verification Report (Full — All 4 Plans)

**Phase Goal:** Transform the dual-mode concept from a CSS palette flip into genuine routing. The mode toggle navigates between `/` (Planning) and `/onsite` (On-site) via Astro View Transitions. From the on-site landing, the user can drill into a single exhibition detail page (`/onsite/kerry-james-marshall`) with an audio guide, a paywall, and a simulated logged-in state.

**Verified:** 2026-04-16T11:40:00Z
**Status:** human_needed (all automated checks PASS)
**Re-verification:** Yes — previous verification covered plans 03-01/02/03 only; this covers the full phase including plan 03-04

## Goal Achievement

### Observable Truths (ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Mode toggle on `/` navigates to `/onsite` with View Transitions palette flip | ✓ VERIFIED | `BaseLayout.astro:13,58` imports + renders `<ClientRouter />`; HamburgerOverlay + FooterColumns use base-prefixed `<a href="/Kunsthaus/onsite">` (03-01); visual smoothness flagged for human |
| 2 | URL is single source of truth; localStorage mode persistence removed | ✓ VERIFIED | `grep -rn 'kunsthaus-mode' src/` returns zero matches across all 90+ source files; `ModeToggle.tsx` deleted (commit `67f1a38`) |
| 3 | `/onsite` produces full landing with hero, cinematic reveal, building-grouped grids, navigator, info box with today's events, and FAQ | ✓ VERIFIED | `dist/onsite/index.html` builds with `data-mode="onsite"`; OnsiteHero, CinematicReveal, 2× OnsiteExhibitionGrid (Chipperfield/Moser), Visitor Essentials grid, FAQAccordion all compose the page; confirmed in 03-02 + post-02 design sweep quick tasks |
| 4 | `/onsite/kerry-james-marshall` produces detail page with hero video, cinematic reveal, artwork slider, artist quote, video testimonials, and shop | ✓ VERIFIED | `dist/onsite/kerry-james-marshall/index.html` exists; KjmHero has `autoplay muted loop playsinline preload="metadata" poster=`; ArtworkSlider at `src/components/sections/ArtworkSlider.astro:138-161` uses scroll-snap-type x mandatory; HorizontalSlider for videos + shop; ArtistQuote present |
| 5 | Tapping artwork headphones button triggers PaywallOverlay (if logged out) with Buy Tickets + Become a Member CTAs | ✓ VERIFIED | `ArtworkSlider.astro:173-175` checks `window.__demoUser` → opens `window.__paywall?.open(trackId)` when falsy; `PaywallOverlay.astro:16-17` defines Buy tickets + Become a member labels; `simulateLogin()` attached to both CTAs at lines 225-226; overlays rendered in built `dist/onsite/kerry-james-marshall/index.html` (25 `paywall` class occurrences confirmed) |
| 6 | Buy Tickets simulates login: profile icon fades into navbar, hamburger "Log in" becomes "My Account" | ✓ VERIFIED | `PaywallOverlay.astro:184-188` `simulateLogin()` sets `localStorage.setItem('kunsthaus-demo-user', 'purchased')`, dispatches `kunsthaus:login`; `NavProfileButton.astro:62` listens for `kunsthaus:login` and shows button (GSAP fade-in); `HamburgerOverlay.astro:712-722` `setLoggedInState()` replaces "Log in" text with "My Account" / "Mein Konto" on `kunsthaus:login`; hamburger "Log in" via `data-login-item` also triggers `simulateLogin()` (second entry point, line 706-708) |
| 7 | Audio guide overlay opens with Playlist view; tapping a track slides up Detail Player bottom-sheet with full transport controls | ✓ VERIFIED | `AudioGuideOverlay.astro:600` exposes `window.__audioGuideOverlay = { open, close }`; `ArtworkSlider.astro:176` calls `__audioGuideOverlay?.open(trackId)` when logged in; `openDetailPlayer()` at line 475 calls `gsap.to(detailEl, { y: '0%', duration: 0.4, ease: 'power3.out' })`; transport controls: skip_previous, play_arrow/pause, skip_next at lines 53-65; `<input type="range">` progress bar at line 65; `new Audio()` at line 397; `keyboard_arrow_down` handle at line 40 for slide-down |
| 8 | Profile overlay shows QR ticket, secondary nav items, and log out | ✓ VERIFIED | `ProfileOverlay.astro:56` has `qr_code_2` icon + "KUNSTHAUS-DEMO-2026-04-22-DAYPASS-001" ticket code; 6 nav items at lines 24-29 (My audio guide history, Favourites, Upcoming visits, Membership, Account settings, Help & contact); `kunsthaus:logout` dispatched at line 368 via `localStorage.removeItem('kunsthaus-demo-user')`; `NavProfileButton.astro:63` listens for `kunsthaus:logout` and hides icon; `HamburgerOverlay.astro:724-729` `setLoggedOutState()` restores "Log in" text on logout |

**Score:** 8/8 truths verified

### Required Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `src/components/nav/PaywallOverlay.astro` | ✓ VERIFIED | Exists; `window.__paywall = { open, close, _pendingTrackId }` at line 234; Buy Tickets + Become a Member CTAs; `simulateLogin()` wired to both; `astro:page-load` dual-init present |
| `src/components/nav/AudioGuideOverlay.astro` | ✓ VERIFIED | Exists; `window.__audioGuideOverlay = { open, close }` at line 600; GSAP translateY(100%) → translateY(0%) bottom-sheet; persistent `new Audio()` at line 397; transport controls and progress bar present; `astro:page-load` dual-init present |
| `src/components/nav/NavProfileButton.astro` | ✓ VERIFIED | Exists; `account_circle` icon; `display: none` default (line 12); listens for `kunsthaus:login` (line 62) and `kunsthaus:logout` (line 63); dual-init present |
| `src/components/nav/ProfileOverlay.astro` | ✓ VERIFIED | Exists; `window.__profileOverlay = { open, close }` at line 378; QR ticket with `qr_code_2` icon and KUNSTHAUS-DEMO code; 6 secondary nav items; `kunsthaus:logout` dispatched at line 368; `astro:page-load` dual-init present |
| `src/components/nav/NavBar.astro` | ✓ VERIFIED | Imports NavProfileButton (line 6); renders `<NavProfileButton />` at line 45 inside `.navbar__right` |
| `src/components/nav/HamburgerOverlay.astro` | ✓ VERIFIED | `data-login-item` on secondary nav item (line 105); `setLoggedInState()` / `setLoggedOutState()` logic; listens for `kunsthaus:login` (line 738) and `kunsthaus:logout` (line 739) |
| `src/layouts/BaseLayout.astro` | ✓ VERIFIED | Imports and renders PaywallOverlay (line 24/82), AudioGuideOverlay (line 25/83), ProfileOverlay (line 26/84); `is:inline` script at line 86 initialises `window.__demoUser` from localStorage |
| `src/components/sections/ArtworkSlider.astro` | ✓ VERIFIED | `data-track-id={art.id}` on each slide (line 48); headphones click handler checks `window.__demoUser` (line 173); `__paywall?.open(trackId)` (line 174); `__audioGuideOverlay?.open(trackId)` (line 176); `kunsthaus:login` listener auto-opens audio guide to pending track (lines 183-189) |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `ArtworkSlider.astro` | `window.__paywall / window.__audioGuideOverlay` | headphones click checks `window.__demoUser` | ✓ WIRED | Lines 173-176: `if (!window.__demoUser) __paywall?.open(trackId) else __audioGuideOverlay?.open(trackId)` |
| `PaywallOverlay.astro` | localStorage `kunsthaus-demo-user` + `kunsthaus:login` event | `simulateLogin()` function | ✓ WIRED | Lines 184-188: `localStorage.setItem`, `window.__demoUser = 'purchased'`, `dispatchEvent(new CustomEvent('kunsthaus:login'))` |
| `NavBar.astro` | `NavProfileButton.astro` | import + render in `.navbar__right` | ✓ WIRED | Line 6: import; Line 45: `<NavProfileButton />`; button listens for `kunsthaus:login` to show |
| `HamburgerOverlay.astro` | `ProfileOverlay` via `data-login-item` | `setLoggedInState()` opens `window.__profileOverlay?.open()` | ✓ WIRED | Lines 717-720; logout listener at line 739 restores "Log in" |
| `BaseLayout.astro` | 3 new overlays | import + render + `is:inline` `__demoUser` init | ✓ WIRED | All 3 overlays rendered on every page; inline script runs synchronously before component scripts |
| `PaywallOverlay._pendingTrackId` | `AudioGuideOverlay.open(trackId)` | `kunsthaus:login` listener in ArtworkSlider | ✓ WIRED | Lines 183-189 in ArtworkSlider: on login, reads `__paywall._pendingTrackId`, calls `__audioGuideOverlay?.open(pendingTrack)` after 400ms delay |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `AudioGuideOverlay.astro` | track list (playlist rows) | `window.__kjmArtworks` exposed via `define:vars` in `kerry-james-marshall.astro` | Yes — populated from `kerry-james-marshall.json` artworks array (10 entries) | ✓ FLOWING |
| `PaywallOverlay.astro` | CTAs and heading labels | Static strings + `lang` prop for localization | Static UI content — no dynamic data needed | ✓ FLOWING |
| `NavProfileButton.astro` | Visibility state | `localStorage.getItem('kunsthaus-demo-user')` on init + `kunsthaus:login` / `kunsthaus:logout` events | localStorage-backed demo state; intentional for prototype | ✓ FLOWING |
| `ProfileOverlay.astro` | QR ticket content, nav items | Static content + `lang` prop | Static demo data — QR ticket, 6 nav labels hardcoded as prototype fidelity | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Check | Result | Status |
|----------|-------|--------|--------|
| Build produces 3 pages | `npm run build` | 3 pages: `/index.html`, `/onsite/index.html`, `/onsite/kerry-james-marshall/index.html` in 6.46s | ✓ PASS |
| Paywall overlay in built HTML | grep for `paywall` classes in `dist/onsite/kerry-james-marshall/index.html` | 25 occurrences | ✓ PASS |
| Audio guide overlay in built HTML | grep for `audio-overlay` classes | 20 occurrences | ✓ PASS |
| Profile overlay in built HTML | grep for `profile-overlay` classes | 38 occurrences | ✓ PASS |
| `window.__paywall` exposed | grep PaywallOverlay source | Line 234: `window.__paywall = { open, close, _pendingTrackId }` | ✓ PASS |
| `window.__audioGuideOverlay` exposed | grep AudioGuideOverlay source | Line 600: `window.__audioGuideOverlay = { open, close }` | ✓ PASS |
| `window.__profileOverlay` exposed | grep ProfileOverlay source | Line 378: `window.__profileOverlay = { open, close }` | ✓ PASS |
| No `kunsthaus-mode` localStorage remaining | grep -r src/ | 0 matches across all source files | ✓ PASS |
| GSAP bottom-sheet animation wired | grep AudioGuideOverlay for gsap.to translateY | Line 480: `gsap.to(detailEl, { y: '0%', duration: 0.4 })`; Line 492: back to `y: '100%'` | ✓ PASS |
| 6 nav items in ProfileOverlay | grep ProfileOverlay nav labels | All 6 present (My audio guide history, Favourites, Upcoming visits, Membership, Account settings, Help & contact) | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| NAV-02 | 03-01, 03-04 | Dual-mode toggle visible in navigation | ✓ SATISFIED | Mode toggle writers refactored to `<a href>` route-aware navigation (03-01); marked `[x]` in REQUIREMENTS.md |
| NAV-03 | 03-02, 03-04 | Mode-aware navigation that changes content/links based on active mode | ✓ SATISFIED | /onsite landing page delivered (03-02); hamburger "Log in" → "My Account" on login (03-04); marked `[x]` in REQUIREMENTS.md |
| ANIM-04 | 03-03 plan | Smooth transitions when switching Planning/On-site modes | ✓ SATISFIED | `<ClientRouter />` in BaseLayout head; mode-toggle writers use `<a href>` navigation; ROADMAP re-scopes ANIM-04 as "View Transitions". REQUIREMENTS.md checkbox shows `[ ]` (doc not updated post-completion) |
| ANIM-06 | 03-03 plan | Stacking/layering scroll effect (sections pin, scale, 3D perspective) | ✓ SATISFIED | `SectionWrapper.astro:3` implements GSAP ScrollTrigger pin + scale + rotate (desktop), scale+opacity (tablet), fade-up (mobile); KJM detail page uses bgStep 1-4 cadence. REQUIREMENTS.md checkbox shows `[ ]` (doc not updated post-completion) |

**Note:** REQUIREMENTS.md traceability table marks ANIM-04 and ANIM-06 as "Pending" for Phase 3, but the ROADMAP notes explicitly re-scope them as delivered by SectionWrapper stacking (already shipped) and View Transitions (ClientRouter wired). The `[ ]` checkbox in REQUIREMENTS.md is a documentation artefact — the implementation is verified present in source.

### Anti-Patterns Found

None. No `TODO` / `FIXME` markers in any of the 4 new overlay components. No empty handler stubs on the critical path. The `ProfileOverlay.astro` secondary nav uses `<a href="#">` stub links — intentional for a prototype with no secondary routes, not a functional gap. The QR code is a placeholder Material Symbol icon — intentional and documented as "out of scope for real QR generation."

### Human Verification Required

All 8 items below require a real browser session:

#### 1. View Transitions palette flip

**Test:** Open `/Kunsthaus/` and click the mode toggle (in StickyCTA, hamburger overlay, or footer)
**Expected:** Smooth cross-fade animation; URL changes to `/Kunsthaus/onsite`; dark background appears without a white flash; no full page reload visible in network tab
**Why human:** Visual animation smoothness and transition timing can only be judged in a browser

#### 2. No-flash-of-light-palette on `/onsite` hard refresh

**Test:** Hard refresh `http://localhost:4321/Kunsthaus/onsite` (Cmd+Shift+R)
**Expected:** Dark background visible from first paint — no flash of the light planning palette
**Why human:** First-paint flash requires real browser render

#### 3. KJM hero video autoplay on iOS Safari

**Test:** Open `/Kunsthaus/onsite/kerry-james-marshall` on an iPhone or iPad in Safari
**Expected:** Hero video plays muted immediately; poster frame visible before video starts
**Why human:** iOS autoplay behaviour requires a real device or Simulator

#### 4. Artwork slider horizontal scroll on mobile (nested in stacking pin)

**Test:** On mobile, swipe horizontally on the artwork slider within the KJM detail page while the stacking section is pinned
**Expected:** Horizontal swipe scrolls the artwork slider; vertical swipe scrolls the page out of the pinned section
**Why human:** Touch gesture disambiguation with SectionWrapper pinning needs device testing

#### 5. Paywall -> login flow (visual + event chain)

**Test:** On `/Kunsthaus/onsite/kerry-james-marshall`, ensure logged out (clear localStorage), tap the headphones icon on any artwork
**Expected:** PaywallOverlay appears over the page with "Buy tickets" and "Become a member" CTAs; clicking either CTA dismisses the paywall, triggers GSAP profile icon fade-in in the navbar, and auto-opens AudioGuideOverlay to the correct track
**Why human:** Requires browser to execute the full CustomEvent chain (kunsthaus:login) and GSAP animations across 3 components simultaneously

#### 6. AudioGuideOverlay bottom-sheet slide animation

**Test:** In AudioGuideOverlay (after login), tap any track row
**Expected:** DetailPlayer bottom-sheet slides up smoothly from below (GSAP y: 100% → 0%, 0.4s power3.out); transport controls (prev/play/next), progress bar, and audio element are all functional; tapping keyboard_arrow_down slides it back down
**Why human:** GSAP animation timing, audio playback, and progress bar sync require a browser

#### 7. ProfileOverlay visual layout and logout chain

**Test:** Click the profile icon (account_circle) in the navbar while logged in
**Expected:** ProfileOverlay opens showing the QR ticket card (qr_code_2 icon, KUNSTHAUS-DEMO code), 6 secondary nav rows with arrow_forward icons, and "Log out" button; clicking Log out removes the profile icon from navbar and restores "Log in" in the hamburger overlay
**Why human:** Visual layout and the multi-component CustomEvent logout chain (NavProfileButton hide + HamburgerOverlay setLoggedOutState) require browser observation

#### 8. HamburgerOverlay Log in entry point

**Test:** While logged out, open the hamburger menu and tap "Log in" in the secondary navigation
**Expected:** Triggers simulateLogin() — profile icon appears in navbar, hamburger menu closes, "Log in" text becomes "My Account" on next open
**Why human:** Requires browser interaction; second login entry point distinct from the PaywallOverlay CTA path

### Gaps Summary

No automated gaps. All 8 ROADMAP success criteria are verified at the code level:

- All 4 new components exist (`PaywallOverlay`, `AudioGuideOverlay`, `NavProfileButton`, `ProfileOverlay`)
- All `window.__*` globals are exposed correctly
- The full event chain (`kunsthaus:login` → NavProfileButton show + HamburgerOverlay "My Account" + AudioGuideOverlay auto-open via pending track) is wired
- The logout chain (`kunsthaus:logout` → NavProfileButton hide + HamburgerOverlay restore "Log in" + ProfileOverlay dispatch) is wired
- All 4 overlays follow the dual-init pattern (`DOMContentLoaded + astro:page-load`)
- All overlays are rendered in BaseLayout and confirmed present in built HTML for the KJM detail page
- Build succeeds with 3 pages; no Zod schema errors; only pre-existing texture-path warning
- `kunsthaus-mode` localStorage has zero occurrences across all source files (SC2 regression clean)

Verification status is `human_needed` solely because the visual and interaction behaviours (animation smoothness, touch gesture handling, audio playback, multi-component event chain) cannot be confirmed headlessly.

---

_Verified: 2026-04-16T11:40:00Z_
_Verifier: Claude (gsd-verifier)_
_Re-verification: Yes — extends previous 03-VERIFICATION.md (2026-04-14) to include plan 03-04_
