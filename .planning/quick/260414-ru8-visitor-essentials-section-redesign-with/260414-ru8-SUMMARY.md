---
task: 260414-ru8
type: quick
title: Visitor Essentials section redesign with card grid and venue cards
status: complete
completed: 2026-04-14
files_modified:
  - src/pages/onsite/index.astro
  - src/content/onsite/home.json
  - src/content.config.ts
  - src/components/sections/OnsiteExhibitionGrid.astro
files_added:
  - src/components/sections/EssentialsCard.astro
files_deleted:
  - src/components/sections/InfoBox.astro
  - src/components/sections/MuseumNavigatorTeaser.astro
supersedes_partial:
  - Phase 03-02 InfoBox component
  - Phase 03-02 MuseumNavigatorTeaser component
---

# Quick Task 260414-ru8: Visitor Essentials Section Redesign — Summary

**One-liner:** Restructured the `/onsite` "Museum Navigator + Info Box" pairing into a full "Visitor Essentials" section — a responsive grid of nine same-styled cards covering orientation, events, Wi-Fi, all five venues with live open/closed status, and accessibility. Also unified the building-grid headings with the planning page's `.sub-heading` typography.

This task is **retrospective** — the work was done as an interactive design review session on top of phase 03-02, not as a planned `/gsd-quick` cycle. It partially supersedes the 03-02 InfoBox and MuseumNavigatorTeaser components, which have been retired.

## Why

The original 03-02 implementation placed the InfoBox (Wi-Fi + today's events) as its own short stacking section that scrolled out of view almost immediately. The MuseumNavigatorTeaser was a separate standalone block with duplicate structural weight. The building-group exhibition grids used the building name as both the section label AND the grid heading, which was redundant. And the visual language of headings across `/onsite` drifted from what was already established on `/planning`.

Five concerns surfaced during review:

1. **InfoBox scroll life too short.** The Wi-Fi + today's events panel had its own section that was visible for maybe two seconds before the next stacking section scrolled over it — useless for a useful panel.
2. **Redundant exhibition grid labels.** "Chipperfield Building" appeared as both the section label and the grid heading above the cards. The grid heading should describe *what* the items are, not repeat *where* they are.
3. **Drifted heading typography.** The onsite grid used `font-size: var(--type-2xl)` at regular weight — nothing matched the planning page's small-caps `.sub-heading` utility used by "Current Exhibitions", "Upcoming Exhibitions", and "Collection".
4. **Museum Navigator too narrow as a section theme.** The single teaser was only one piece of "stuff a visitor needs on-site". Renaming the section to **Visitor Essentials** and grouping more tools under it matches how people actually think about the information.
5. **Wi-Fi card too technical.** Showing `SSID: Kunsthaus-Guest` and `Password: welcome` reads like a router admin panel. Visitors just need the network name and to know it's free.

## What Changed

### 1. Building exhibition grid headings

`src/components/sections/OnsiteExhibitionGrid.astro`:

- **Renamed prop `buildingName` → `heading`** and matching CSS class `onsite-grid__building` → `onsite-grid__heading`.
- **Added global `.sub-heading` utility class** to the `<h2>` so it picks up the shared small-caps typography from `src/styles/base.css` (type-md, medium weight, uppercase, 0.06em letter-spacing).
- **Stripped the custom typography from `.onsite-grid__heading`**, keeping only `margin: 0` to override the browser-default h2 margin.

`src/content/onsite/home.json` + `src/content.config.ts`:

- **Added `specialExhibitionsLabel: localizedText`** to the onsite home schema and data. Values: `{de: "Sonderausstellungen", en: "Special Exhibitions"}` — the precise Kunsthaus Zürich term for ticketed temporary shows.

`src/pages/onsite/index.astro`:

- Both building grids now receive `heading={onsiteHome.specialExhibitionsLabel}` instead of the building name. The SectionWrapper still provides the building name as the section label — so "where" comes from the section, "what type" from the grid heading, and "which specific show" from each card's title. No redundancy.

### 2. Visitor Essentials section rename

`src/content/onsite/home.json` + `src/content.config.ts`:

- **Added `visitorEssentialsLabel: localizedText`** — `{de: "Besucherinfos", en: "Visitor Essentials"}`.

`src/pages/onsite/index.astro`:

- **SectionWrapper `sectionName`** changed from `onsiteHome.navigatorTeaser.title[lang]` (which was "Museum Navigator") to `onsiteHome.visitorEssentialsLabel[lang]`.
- **sectionId** changed from `navigator-teaser` to `visitor-essentials` for semantic clarity.
- The MuseumNavigatorTeaser's internal h2 ("Museum Navigator") was left intact at the time because it's a product name — but see section 3, the component itself was later replaced.

### 3. EssentialsCard component + 9-card grid

A new reusable component **`src/components/sections/EssentialsCard.astro`** takes `title`, `description`, `lang` and renders a unified card layout with a slot for body content. Typography matches the rest of the section (title uses `.sub-heading`, description is type-md at 0.75 opacity). Background and border tuned for the dark onsite cascade.

`src/pages/onsite/index.astro`:

- **Deleted** `<InfoBox>` and `<MuseumNavigatorTeaser>` usages entirely.
- **Added** a `<div class="visitor-essentials-grid">` containing **nine** `<EssentialsCard>` instances inside the Visitor Essentials SectionWrapper.
- Grid layout: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` — wraps from 3 cols on wide desktop down to 1 col on mobile without media-query branching.

`src/components/sections/InfoBox.astro` and `src/components/sections/MuseumNavigatorTeaser.astro`: **deleted**. Their responsibilities moved into `EssentialsCard` children.

### 4. visitorEssentials data structure

`src/content/onsite/home.json` + `src/content.config.ts`:

The old `navigatorTeaser` and `infoBox` top-level keys were replaced with a single `visitorEssentials` object containing:

- **gettingAround** — `{title, description, linkLabel, linkHref}` — renamed from "Museum Navigator" to "Getting Around" as a friendlier umbrella label. External link still points at `kunsthaus.ch/en/visit/museum-navigator/`.
- **todaysEvents** — `{title, description}` — metadata for the card that wraps `TodaysEventsAccordion`.
- **wifi** — `{title, description, networkName}` — simplified: the description doubles as the "no password required" note, the body is just the network name `Kunsthaus-Guest`. No `SSID`/`Password` labels, no explicit note field.
- **venueCards** — a `z.record(z.string(), ...)` map keyed by the planning homepage's offering IDs (`bar`, `restaurant`, `cafe`, `art-shop`, `design-shop`). Each entry has `{title, description}` — the schedule itself is not duplicated here; it's looked up from `src/content/planning/homepage.json` at render time.
- **accessibility** — `{title, description, placeholder}` — placeholder card for the "Accessibility & Comfort" tile until content is written.

### 5. Venue card wiring with StatusAccordion

`src/pages/onsite/index.astro`:

- Imports `StatusAccordion` and `planningHomepageJson`.
- Finds the `id === 'offerings'` section in the planning homepage JSON and builds a `Map` by venue id.
- `venueCardOrder` const defines display order: `['cafe', 'restaurant', 'bar', 'art-shop', 'design-shop']`.
- `venueCards` is built as `venueCardOrder.map(id => {card, planningVenue})`, filtering out any missing entries.
- Each card renders `<StatusAccordion>` in its body slot with the schedule from the matching planning venue, localized label strings, and the `closedLabel` string.
- The StatusAccordion was left **unmodified** — it already supports onsite mode cascade and was fixed during the 03-02 validation session (commit `7dd0727` added dual-init for View Transitions).

### 6. Final card order, descriptions, CTA

The user iterated on ordering and visual balance:

**Final order (9 cards):**

1. Wi-Fi at the Kunsthaus
2. Getting Around
3. Today at the Museum
4. Café & Miro Garden
5. Restaurant Bei Moudi
6. Kunsthaus Bar
7. Art Shop
8. Design Shop
9. Accessibility & Comfort

**Descriptions equalized to 50-64 characters** in English (and similar range in German) so every card wraps to the same number of description lines and the bodies line up across the grid. Longest was the Café card at 64 chars; shortest was Wi-Fi and Today at the Museum at 50 chars each.

**Getting Around CTA:** the external link was promoted from a plain text link to a primary CTA button using the same `class="btn brushed-brass touch-pulse touch-target"` combination as the Sticky "Buy Tickets" CTA. Aligned to `flex-start` so it doesn't stretch to fill the card body's flex column.

## Verification

**Build:**
```
npm run build → ✓ Completed in 6.25s
2 page(s) built (/index.html, /onsite/index.html)
```
No new errors or warnings. Only the pre-existing `/Kunsthaus/textures/*.png` runtime-resolved asset warnings remain.

**Manual testing (user-verified during the session):**
- ✓ SectionWrapper sticky title column shows "VISITOR ESSENTIALS" in the same small-caps style as the other sections
- ✓ All 9 cards render with consistent typography, descriptions, and body content
- ✓ Grid wraps cleanly from 3 cols → 2 cols → 1 col as viewport narrows
- ✓ Wi-Fi card shows description + monospace network name, no SSID/Password labels
- ✓ Getting Around CTA button renders as a brushed-brass pill and navigates to the external visitor guide
- ✓ Today at the Museum accordion still works (4-state headline + live-row highlight verified earlier in 260414-npq follow-up work)
- ✓ All 5 venue StatusAccordions show today's computed open/closed status and expand to show the full week schedule
- ✓ `/onsite` page builds and loads without errors

## Out of Scope / Follow-ups

- The StatusAccordion inside the EssentialsCard visually works but its internal spacing and background were not tuned specifically for the card context. If the user notices it feels too busy inside a card, that's a follow-up cosmetic pass on `StatusAccordion.astro` CSS.
- The Accessibility & Comfort card is still a placeholder with "Content coming soon." copy. Real content will come later.
- The `gettingAround.linkLabel` still reads "Open Interactive Visitor Guide" / "Interactive Visitor Guide öffnen" — that's the product name for the button label and was intentionally preserved.

## Commits

- Code: `feat(onsite): visitor essentials section redesign with card grid and venue cards`
- Docs: `docs(quick-260414-ru8): retrospective summary for visitor essentials redesign`

## Deviations

None from explicit user direction. Every major decision (card order, description length, CTA button style, venue list, Wi-Fi simplification, section name, building heading typography) was discussed and approved interactively during the session.

## Self-Check

- `src/components/sections/EssentialsCard.astro` exists — to verify
- `src/components/sections/InfoBox.astro` deleted — to verify
- `src/components/sections/MuseumNavigatorTeaser.astro` deleted — to verify
- `visitorEssentials` key present in `src/content/onsite/home.json` with expected shape — to verify
- `src/content.config.ts` onsiteHome schema has `visitorEssentials` (not `navigatorTeaser` or `infoBox`) — to verify
- Build status: PASS
