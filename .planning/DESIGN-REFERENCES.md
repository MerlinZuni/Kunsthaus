# Design References — Kunsthaus Zurich

**Created:** 2026-04-06
**Sources:** Three Figma concept files (Nadine, Nico, Jacqueline) + kunsthaus.ch shop

These references inform Phase 2+ planning. Elements are cherry-picked from each designer's concept to create the final unified design.

---

## Navigation Bar (Phase 2: NAV-01)

**Primary source:** Nadine's design
**Figma:** `5ftqmhGwHCVuDGycFMuv6Y` node `22:1995` (desktop), `19:1864` (mobile)

### Desktop (1440px)
- Layout: `search icon (16px)` | `"KUNSTHAUS ZÜRICH" logotype (200px, mix-blend-exclusion)` | `EN ▾` | `search` | `hamburger (20px, 2-line)`
- Background: `#FFFFFF`
- Padding: 16px horizontal, 12px vertical
- Content height: 44px
- Logotype is an image asset, not text — uses `mix-blend-exclusion` to invert over hero imagery

### Mobile (402px)
- Same 3-element structure, narrower
- Background: `#EBEBEB` (light concrete) — shifts from white on desktop

### Language Switcher (from Nico)
**Figma:** `gMmsF1pFCYBCZhm10LNAjo` node `12:112`
- Frosted glass pill: `backdrop-blur: 97px`, `background: rgba(238, 238, 238, 0.8)`, `border-radius: 161px`
- "EN" in DIN Next W1G Regular 16px uppercase + dropdown arrow
- Padding: 16px left, 12px right, 16px top/bottom
- Placement: right group in nav bar, before search and hamburger icons

### Opening Hours Indicator (from Nico)
**Figma:** `gMmsF1pFCYBCZhm10LNAjo` node `12:102`
- Same frosted glass pill style as language switcher
- Green circle (12px) + "Open today until 20:00" DIN Next W1G Regular 16px + dropdown arrow
- Padding: 8px all around, 6px gap
- Placement: below nav bar, left-aligned

---

## Hero Section (Phase 2: HOME-01)

**Primary source:** Jacqueline's design
**Figma:** `Td307NYhqkEWHzCVXeP2Xr` node `1:418`

### Bold Stacked Typography
- Font: DIN Black, 222px, uppercase
- Color: `#0F0F0F` ("Brutalismus/Anthrazit")
- "KUNST", "HAUS", "ZÜRICH" as three separate text blocks
- Staggered/offset positioning — brutalist typographic composition overlapping hero image
- Right-aligned

### Welcome Marquee
- "WILLKOMMEN WILLKOMMEN WILLKOMMEN" — repeating horizontal scroll text
- Full viewport width

### Hero CTAs (from Nico, adapted)
**Figma:** `gMmsF1pFCYBCZhm10LNAjo` node `12:122`
- "Buy tickets" / "Plan your visit" — side by side, divided by vertical line
- Frosted glass: `backdrop-blur: 17px`, `rgba(248, 253, 254, 0.1)`
- DIN Next W1G Regular 20px, white text
- **User direction:** Blocky, sharp corners (0-2px radius max), NOT rounded

---

## Typography & Text Patterns

### Small Readable Text (from Nico)
**Figma:** `gMmsF1pFCYBCZhm10LNAjo` node `12:129`
- DIN Next W1G Regular, 16px
- Color: `#222222` at 50% opacity
- Uppercase, letterspaced
- Used for: exhibition labels, meta info, secondary navigation links

### Buttons
- **Primary:** Solid fill, sharp corners (0-2px max), DIN Next W1G Regular 20px
- **Secondary:** Outlined or frosted glass, same sharp corners
- **NOT rounded** — user explicitly requested blocky buttons

---

## On-site Mode Layout (Phase 3)

**Primary source:** Jacqueline's design
**Figma:** `Td307NYhqkEWHzCVXeP2Xr` node `50:117`

### Overall
- Dark background — but **NOT as dark as Jacqueline's pure black**. Use CONTEXT.md warm dark: `#272523` background, `#fbf8f7` text
- Exhibition-focused deep-dive layout

### Artist Quote
- DIN Regular 40px, line-height 50px, white
- Guillemets «» for quotation marks
- Attribution below: DIN Regular 19px, "— Artist Name"

### Section Heading
- DIN Bold 20px, uppercase, white

### Body Text
- DIN Regular 19px, line-height 26px, white
- Good readable paragraph treatment

### Artwork Number Badges
- 56x56px square, 1px white border
- DIN Regular 19px centered
- Numbered markers on artwork images (1, 2, 3...)

### Image Gallery
- Mixed sizes, masonry-style staggered layout
- Artwork images at various scales

### Exhibition Title
- DIN Regular 24px, uppercase, white
- Title + subtitle on separate lines

---

## Shop & Upselling (Phase 2+)

**Source:** kunsthaus.ch/en/besuch-planen/museums-shops/

### Shop Data
| Location | Building | Hours | Phone |
|----------|----------|-------|-------|
| Design Shop | Chipperfield | Tue-Wed, Fri-Sun 10-18, Thu 10-20, Mon closed | +41 44 253 84 84 |
| Art Shop | Moser | Same hours | Same phone |

### Product Categories
**Design Shop:** Handmade ceramics (Ursula Vogel, Linck), home accessories/vases (Serax), wool blankets (ZigZag Zürich), writing tools/journals (Traveler's Company), jewellery (Macon & Lesquoy, Theresa Brar, Helena Rohner), artworks (Roof), art/architecture/design books

**Art Shop:** Art books on collection, reproductions/cards, signed/numbered editions, exhibition merchandise (prints, pins, tote bags), children's gifts (OMY), coloring wallpaper, bags (LOQI), socks (DillySocks), Joan Miró jewelry (Joidart)

### Featured Products
| Product | Price |
|---------|-------|
| Lithograph edition by Monster Chetwynd | CHF 750.– |
| Candleholder by Bela Silva for Serax | CHF 76.– |
| Scented candle by Bela Silva for Serax | CHF 91.– |

### Key Features
- Member discount: 10% off
- Exclusive collaborations: Qwstion, Soeder, Zig Zag
- In-store purchase only — no online sales

### Shop Images Downloaded
12 images saved to `.planning/assets/shop/`:
- `shop-01-ceramics.png` through `shop-09-gifts.png` (500x500 category images)
- `shop-10-lithograph.jpg`, `shop-11-candleholder.jpg`, `shop-12-candle.jpg` (670x780 product images)

### Upselling Overlay Panel
- Slide-in overlay (not full page), triggered by contextual links
- Contents: shop hours, phone, curated items related to current exhibition
- CTA: "Visit our shop" linking to kunsthaus.ch shop page
- Touchpoints: after exhibition descriptions, near artwork images, visit info, On-site mode
- No online purchase — drives physical foot traffic

---

## Design System Summary

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Display / Hero | DIN Black | — | 222px stacked hero titles |
| Headings | DIN Next W1G | Bold (700) | Section headings, 20px uppercase |
| Body | DIN Next W1G / DIN Regular | Regular (400) | 16-20px paragraph text |
| UI / Labels | DIN Next W1G | Regular (400) | 16px, muted opacity, uppercase |
| Navigation | DIN Next W1G | Regular (400) | Nav links, buttons |

| Element | Style |
|---------|-------|
| Buttons | Blocky, sharp corners (0-2px max), NOT rounded |
| Frosted glass | `backdrop-blur: 97px`, `rgba(238,238,238,0.8)`, pill shape — for status indicators only |
| Planning mode | `#fbf8f7` bg, `#272523` text, concrete tones |
| On-site mode | `#272523` bg (warm dark, not black), `#fbf8f7` text |

---

*References collected: 2026-04-06*
*Figma files: Nadine, Nico, Jacqueline*
