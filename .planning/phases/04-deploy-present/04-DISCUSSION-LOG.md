# Phase 4: Deploy + Present - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-17
**Phase:** 04-deploy-present
**Areas discussed:** Screenshot capture, Pre-presentation polish, Presentation deck assets

---

## Deployment Target

User clarified before formal discussion: GitHub Pages is already live and working. No need for Cloudflare Pages migration. The prototype can be demonstrated via the existing URL.

---

## Screenshot Capture

| Option | Description | Selected |
|--------|-------------|----------|
| Hero + carousel (Planning) | Main hero with scattered exhibition images and bold typography | ✓ |
| Mode switch transition | Planning → On-site switch showing URL routing and palette change | ✓ |
| On-site KJM detail page | Exhibition detail with artwork slider, audio guide overlay | ✓ |
| Mobile responsive views | Key screens at mobile breakpoint | ✓ |

**User's choice:** All four design moments selected

### Capture Method

| Option | Description | Selected |
|--------|-------------|----------|
| Automated (Playwright) | Scripted capture, reproducible, consistent framing | ✓ |
| Manual browser screenshots | User takes them in Chrome DevTools | |
| You decide | Claude picks approach | |

### Resolution

| Option | Description | Selected |
|--------|-------------|----------|
| 2x retina PNG (2560×1440 desktop, 750×1334 mobile) | High-res for print-quality deck slides | ✓ |
| 1x standard PNG | Lighter files, screen-only | |

### Breakpoints

| Option | Description | Selected |
|--------|-------------|----------|
| Desktop + mobile only | Two breakpoints per moment | ✓ |
| Desktop + tablet + mobile | Three breakpoints | |

**Notes:** User specifically requested both mobile and desktop breakpoints for each design moment.

---

## Pre-presentation Polish

### Nav Profile Button
User identified: profile icon uses Material Symbol at 24px while all other nav icons use inline SVGs at 18px.

| Option | Description | Selected |
|--------|-------------|----------|
| Convert profile to inline SVG (match nav icons) | Replace Material Symbol with 18x18 SVG | ✓ |
| Convert all nav icons to Material Symbols | Unify on font icons | |
| Keep Material Symbol but fix size to 18px | Quick fix, still rendering mismatch | |

User also noted: profile button has wrong colors in dark mode — white background and black icon regardless of mode. Must use same transparent bg + `var(--color-text)` as other nav buttons.

### Profile Overlay Navigation
User noted: when profile overlay opens, close button doesn't appear where profile icon was. Other nav icons should stay visible and unmoved. Must match hamburger overlay behavior pattern exactly.

### Audio Playlist Overlay
User described multiple issues with the playlist view:
- Missing exhibition title header
- Track items too close together vertically (touch target issue)
- No line dividers between tracks
- Play buttons not circular or right-aligned
- Overall styling too plain compared to Figma reference

### Audio Detail Player
User noted: the demo audio file (`Ballad for Classical Strings.mp3`) is not wired to the player controls. Play, pause, and skip should produce real audio. Also: detail player must fit within mobile viewport height — no scrolling.

---

## Presentation Deck Assets

| Option | Description | Selected |
|--------|-------------|----------|
| Raw screenshots only | User frames in their own tool | |
| Device-framed mockups | Screenshots in browser chrome / iPhone frames | ✓ |
| Annotated screenshots | Callout labels on features | |

### Device Frames

| Option | Description | Selected |
|--------|-------------|----------|
| Browser chrome (desktop) | Minimal browser window with GitHub Pages URL | ✓ |
| iPhone frame (mobile) | iPhone bezel wrapping mobile screenshots | ✓ |

---

## Claude's Discretion

- Playwright script structure and timing
- Browser chrome and iPhone frame source/styling
- Scroll positions for capturing effects
- Screenshot output directory
- Specific mobile screens to capture

## Deferred Ideas

None
