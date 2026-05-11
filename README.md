# Kunsthaus Zurich — Website Redesign Concept

> **Live Preview:** [https://merlinzuni.github.io/Kunsthaus/](https://merlinzuni.github.io/Kunsthaus/)

## About

While working on a pitch competition as Sr. UX/UI designer for the Agency Liip, I developed this prototype for the Kunsthaus Zurich museum website redesign. My role in the pitch was creative lead. I took initial design concepts from designers and brought them together while aligning the interface design with the digital strategy developed for the pitch. A responsive, interactive homepage demonstrating a dual-mode concept: **Planning mode** (remote visitors exploring what's on offer) and **On-site mode** (visitors physically at the museum diving deeper into exhibits).

The design strategy was created by:
Joël Neugebauer, </br>
Sônia Kewan (https://www.linkedin.com/in/s%C3%B4nia-kewan-23b915177/)

Design concept contributions by: 
Charlotte Burckhardt (https://www.linkedin.com/in/charlotte-burckhardt-976833287/),</br>
Jacqueline Brügger (https://www.linkedin.com/in/jacqueline-br%C3%BCgger-a462471b6/),</br> 
Nadine Schneuwly (https://www.linkedin.com/in/nadineschneuwly/),</br>
Nicolas Lanthemann (https://www.linkedin.com/in/vanderlanth/).

## Current State

**Phase 2 — Static Homepage (Wave 1 complete)**

What's built:
- Hero section with scattered exhibition images, monumental typography, and carousel navigation
- 6 content sections with sticky stacking scroll effect and background rotation
- Footer with marquee, 4-column layout, newsletter, and mode toggle
- Dual-mode switching (Planning / On-site) with full theme adaptation
- DINNextW1G font system across all weights
- 48-column architectural grid overlay (dev mode)
- Responsive layouts across desktop, tablet, and mobile breakpoints

What's next (Wave 2):
- Navigation bar with scroll behavior
- Full hero carousel with auto-play
- Interactive content section components
- Scroll-driven GSAP animations (Phase 3)

## Tech Stack

- **Astro 6** — Static site framework, zero JS by default
- **GSAP + ScrollTrigger** — Animation engine (Phase 3)
- **Lenis** — Smooth scrolling
- **Vanilla CSS** — Custom properties, @layer cascade, headless-ready
- **JSON Content Collections** — CMS-ready data layer

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:4321
