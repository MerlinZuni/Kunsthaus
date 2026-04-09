# Design Presentation Arguments — Kunsthaus Zurich Homepage

> Key design decisions and their rationale. Use as source material for the competition slide deck.

---

## 1. Hero — Typographic Layered Carousel

**What:** "KUNST / HAUS / ZURICH" in the largest typeface, right-aligned, on the topmost z-index. Exhibition images appear underneath as scattered, grid-aligned layers — fading in and scaling down to stack on top of each other. A carousel auto-plays through featured exhibitions with labeled progress tabs.

**Why this is the right choice:**
- The museum's name becomes architecture, not just branding. The oversized typography mirrors the physical presence of the Chipperfield building — monumental, confident, impossible to miss.
- Scattered image layering creates visual tension and curiosity. Unlike a static hero image, this composition invites exploration — the eye moves between overlapping images, discovering each exhibition.
- Labeled progress tabs (not dots) show exhibition titles directly in the navigation. Research from MoMA, Tate, and Rijksmuseum confirms that labeled navigation outperforms anonymous dots because it communicates content before interaction.
- Auto-play with a visible progress bar and pause/play toggle follows WCAG 2.2 SC 2.2.2 — auto-moving content must be pausable. The progress bar doubles as a timing indicator, reducing user anxiety about missing content.

---

## 2. Navigation — Logo Island with Velocity-Aware Reveal

**What:** A floating navigation bar with search (left), centered Kunsthaus logo with mix-blend-exclusion, navigation links + language switcher (right). On scroll, the full nav dissolves but the logo persists as a floating island. Fast scroll = instant hide; slow scroll or pause = nav fades back in.

**Why this is the right choice:**
- Inspired by Fondation Louis Vuitton, Burberry, and Bottega Veneta — luxury brands that treat navigation as part of the brand experience, not just utility chrome. The logo floating freely above content reads as intentional design authority.
- Velocity-aware reveal responds to user intent, not just scroll direction. This is a key differentiator from binary show/hide navs. Fast scrolling = the user is browsing content, don't interrupt. Pausing = the user wants navigation, provide it. The interface feels alive and responsive.
- The centered logo is always visible — on scroll, in the mobile menu, at every state. This ensures brand presence is constant without consuming screen space. Museum visitors should always know where they are.
- Language switcher (EN/DE/FR) with dropdown supports the international visitor base that Kunsthaus Zurich serves. Positioned at the far right following established convention (Swiss government sites, UN, international museum networks).

---

## 3. Interaction Design — Unified Cross-Device Language

**What:** All interactive elements site-wide share one interaction pattern: clip-path background wipe on desktop hover (200ms in, 350ms out), scale(0.96) press pulse on touch devices, focus-visible outline for keyboard users. `@media (hover: hover)` gates hover effects to real hover devices.

**Why this is the right choice:**
- One interaction language across all elements (nav links, CTAs, cards, footer links) creates a sense of intentional craft. Inconsistent hover states are one of the first things that breaks the "polished" feeling on museum websites.
- Asymmetric timing (faster in, slower out) is the single most impactful micro-animation technique for perceived quality. The slower exit feels luxurious — the interface doesn't snap away, it lingers. This is documented across Awwwards-winning sites from Fondation Louis Vuitton to Serpentine Galleries.
- The `@media (hover: hover)` query prevents sticky hover states on touch devices — a common museum site bug where tapped links stay "hovered" until the user taps elsewhere. This is a technical detail that dramatically improves mobile quality.
- Touch feedback via scale pulse (not Material ripple) respects the Swiss-modernist restraint of the design. Material Design ripples belong to Google's design language, not to a European cultural institution.

---

## 4. Section Stacking — 3D Parallax Card Layers

**What:** As the user scrolls, each new section slides over the previous one. The section being covered scales down to ~90%, rotates slightly (2-3deg, varied per section), and fades in opacity — creating the illusion of physical layers receding into depth.

**Why this is the right choice:**
- The metaphor is architectural — layers of content stacked like the floors of the Chipperfield extension. The museum experience is about moving through spaces, and this scroll behavior translates that physical journey into a digital one.
- Subtle parameters (90% scale, 2-3deg rotation) keep it sophisticated rather than gimmicky. The effect is felt more than seen — visitors sense depth without being distracted from content.
- Responsive degradation is research-backed:
  - **Desktop:** Full effect — reads clearly at 1024px+ viewports
  - **Tablet:** Scale + opacity retained, rotation dropped — effect still reads at 768px
  - **Mobile:** Pinning removed entirely, replaced with native-scroll fade-up transitions. Research shows scroll-hijacking on mobile is a UX antipattern: it fights native iOS/Android touch momentum, causes stutter on mid-range devices, and the visual payoff at 375px (19px difference) doesn't justify the cost
  - **Reduced motion:** All transforms disabled, static layout only

---

## 5. Background Texture Rotation — Material Identity

**What:** Sections cycle through four backgrounds: off-white (#fbf8f7), pure white (#ffffff), concrete light (#EBEBEB with concrete-wall.png), concrete warm (#C1BFB2 with asfalt-dark.png). The cycle repeats through the page.

**Why this is the right choice:**
- The concrete textures connect the digital experience to the physical museum. The Chipperfield extension is defined by its concrete materiality — bringing that texture into the website creates a sensory bridge between the physical and digital spaces.
- The four-step rotation ensures adjacent sections always have different backgrounds, creating visual separation without borders or dividers. This is cleaner than alternating two colors and more rhythmic than random assignment.
- Textures are transparent PNG overlays on base colors — subtle enough to be felt, not seen. They add tactile warmth without interfering with content readability.

---

## 6. In-Page Navigation — Fraction Counter with Progress Arc

**What:** A small "03 / 07" counter with a thin circular progress arc, fixed in the bottom-right corner. Updates as the user scrolls between sections.

**Why this is the right choice:**
- Zero spatial conflict with the floating logo island at top-center. The counter occupies the opposite axis (bottom vs. top), creating a balanced frame around the content.
- Identical on all viewports — no responsive adaptation needed. The same counter works on desktop, tablet, and mobile without any layout changes.
- Purely positional, never reads as "UI chrome." Hermès and Rijksmuseum use this pattern for their editorial microsites because it provides wayfinding without adding visual weight. The user always knows where they are in the page without a visible navigation bar competing for attention.
- Accessible: `aria-label="Section X of 7: [name]"`, keyboard-focusable, `aria-live="polite"` announces section changes to screen readers.

---

## 7. Footer — Marquee Identity + Institutional Completeness

**What:** Continuous right-to-left scrolling "KUNSTHAUS ZURICH" marquee in bold large type at the top of the footer. Below: four-column layout with address, hours, quick links, and newsletter. Dark bottom bar with social icons, legal links, and copyright.

**Why this is the right choice:**
- The marquee is a kinetic brand statement — the museum's name in constant motion creates energy and modernity at the bottom of the page, counterbalancing the monumental static typography at the top (hero). Together they bookend the experience.
- Four-column institutional layout follows the proven museum footer pattern (MoMA, Tate, Guggenheim) that visitors expect: contact, hours, navigation shortcuts, engagement. Nothing is missing, nothing is superfluous.
- "Open today from 10:00" as a dynamic status is a small but impactful detail — it answers the #1 visitor question ("Are you open right now?") without requiring them to search.

---

## 8. Accessibility — Beyond Compliance

**What:** Manual reduce-motion toggle in both the footer and the collapsed navigation, with localStorage persistence. Respects OS-level `prefers-reduced-motion` as default but allows manual override.

**Why this is the right choice:**
- Museums serve one of the broadest demographic ranges of any public institution — from children to elderly visitors, from able-bodied to visitors with vestibular disorders, cognitive differences, or motion sensitivity.
- Not everyone who needs reduced motion has configured it at the OS level. Some users are fine with motion generally but struggle with heavy parallax/3D scroll effects. A manual toggle empowers them without requiring OS changes.
- Shared devices (museum kiosks, loaner tablets) won't have individual accessibility settings. The in-site toggle covers this gap.
- WCAG 2.1 SC 2.3.3 (AAA level) explicitly recommends in-interface motion controls beyond OS detection. By including this, the Kunsthaus prototype demonstrates accessibility leadership — not just compliance, but genuine care for visitor experience.
- This is a competition differentiator: most museum website prototypes ignore accessibility entirely. Showing a thoughtful reduce-motion system signals that the design team understands digital accessibility as part of the museum's public mission.

---

## 9. Mobile Navigation — Full-Screen Typographic Overlay

**What:** Hamburger menu opens a full-viewport overlay. Kunsthaus logo stays centered at top. Navigation links in large DINNextW1G typography stacked vertically. Language options (EN / DE / FR) below nav links. Search field at bottom.

**Why this is the right choice:**
- The full-screen takeover matches the boldness of the desktop experience — the mobile menu is not a compromise, it's its own design moment. Large typography on a full viewport feels confident and museum-worthy.
- Logo persistence during menu open maintains brand awareness and orientation. The user always knows they're at Kunsthaus, even in a navigation state.
- Language options visible without a dropdown makes language switching a first-class action on mobile — important for Zurich's multilingual visitor base (German, English, French).

---

## 10. Sticky CTA + Mode Toggle — Persistent Conversion & Core Concept

**What:** Two floating buttons paired together in the bottom-right on desktop: a mode toggle ("Plan a visit" ↔ "I'm here") and a "Tickets" button. On mobile/tablet, these move to a sticky bottom bar — Tickets on the left, mode toggle on the right.

**Why this is the right choice:**
- The dual-mode concept is the competition's key differentiator. Making the mode toggle always visible — never hidden in a menu — signals that this isn't a feature buried in settings, it's the core experience. The visitor chooses their journey at any moment.
- Separating the mode toggle from the main navigation is intentional: navigation says "where do I go?", the mode toggle says "who am I right now?" These are different cognitive actions and deserve different placement.
- "Plan a visit" ↔ "I'm here" uses first-person language that puts the visitor at the center. It's not a technical label ("Planning mode / On-site mode") — it's an invitation. The visitor identifies themselves, and the museum responds.
- The mobile sticky bottom bar follows native app conventions (iOS tab bar, Android bottom navigation) that users interact with hundreds of times daily. There's zero learning curve.
- "Tickets" as a persistent CTA ensures the museum's primary conversion goal is always one tap away, regardless of where the visitor is on the page.
- Language-tested labels (EN: "Plan a visit" / "I'm here", DE: "Besuch planen" / "Ich bin da", FR: "Planifier" / "Je suis ici") are compact enough for all breakpoints while remaining immediately understandable.

---

## 11. Immersive Storytelling Components — Content as Experience

**What:** Two reusable component patterns replace standard text-image layouts for key sections: (1) Cinematic Reveal Strip — a masked image expands on scroll while title and editorial text enter from opposite sides. (2) Pinned Narrative Sequence — the section pins in the viewport while content cards scroll through one at a time, each offset alternately left and right.

**Why this is the right choice:**
- The structural difference between information and storytelling is sequence and pacing. Information displays everything at once; storytelling reveals it progressively. A museum website should tell stories — each exhibition, each offering, each program has a narrative that deserves to unfold.
- The Cinematic Reveal Strip treats the artwork image as the primary experience — the text arrives to contextualize what you've already seen. This mirrors the physical museum experience: you see the art first, then read the wall label.
- The Pinned Narrative Sequence creates a focused reading experience — one idea per screen, no distraction from adjacent content. Louisiana Museum (Denmark) uses this pattern to present collection stories, and it transforms a list into a journey.
- Both patterns are technically reusable: they accept a `contentType` prop and a `data` array from JSON. The same component renders exhibitions, shop items, restaurant atmosphere, and educational programs. This means the design system scales without creating new components for each content type.
- On mobile, both patterns degrade gracefully: Cinematic Reveal becomes a vertical wipe with text below, Pinned Narrative unpins to a standard scroll stack. The storytelling intent is preserved even when the mechanism simplifies.

---

## 12. Responsive Degradation — Intentional, Not Compromised

**What:** Every interactive and animated element has a defined behavior per viewport (desktop, tablet, mobile) and for users with reduced-motion preferences. Nothing is left to chance or "it probably works on mobile."

**Why this is the right choice:**
- The museum's audience spans every device type, every age group, every ability level. A prototype that only impresses on a 27-inch monitor fails the brief. Explicit responsive strategies demonstrate that the design team has thought about every visitor.
- Mobile simplification is research-backed, not lazy: scroll-hijacking on touch devices fights native iOS/Android momentum, causes stutter on mid-range devices, and the visual payoff of 3D transforms on a 375px screen is negligible (19px difference at scale 0.9). Replacing it with native-scroll fade-up transitions is the right call — it preserves the layered feel without the UX debt.
- `prefers-reduced-motion` support with a manual toggle goes beyond compliance. It signals that the museum's digital experience is as inclusive as its physical spaces — ramps, elevators, audio guides, and now, motion sensitivity.
- This level of responsive consideration is rare in competition prototypes. It's a differentiator that shows the design team builds for real visitors, not just presentation screens.

---

*Document generated from Phase 2 discuss-phase session, April 2026.*
*For integration into competition presentation deck.*
