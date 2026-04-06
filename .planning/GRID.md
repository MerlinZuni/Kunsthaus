# Layout grid — reference specification

Planning-phase contract for the **underlying layout grid** used when building Kunsthaus UI. Derived from the reference blueprint image (minimal black lines on white).

## Visual reference

- **File in repo:** [.planning/assets/grid-reference.png](assets/grid-reference.png)  
- **Original capture (Cursor assets):** `kusthaus_grid_example-b29afff3-cea9-4234-888e-131d4aad0602.png`

## Grid structure

| Property | Value |
|----------|--------|
| **Columns** | 48 equal-width vertical tracks |
| **Rows** | 8 equal-height horizontal tracks |
| **Cells** | 384 total (48 × 8) |
| **Uniformity** | All cells identical; lines consistent hairline thickness (≈ 1px at 1×) |
| **Edges** | Grid extends to the frame edge (full-bleed layout intent) |

## Cell proportions

- Each cell is a **tall, narrow rectangle**.
- **Height ≈ 6 × width** (per-cell aspect target).

### Overall canvas ratio (from cell math)

If one cell has width `w` and height `6w`:

- Total width = `48w`
- Total height = `8 × 6w` = `48w`

So the **full grid area is square (1:1)** when cell height is exactly six times cell width. Use this to lock `aspect-ratio` on a grid container or to derive row/column `fr` sizing so the layout matches the blueprint.

## Implementation notes (CSS)

- **Grid definition:** `display: grid` with `grid-template-columns: repeat(48, 1fr)` and `grid-template-rows: repeat(8, 1fr)` (or equivalent with subgrid / named lines if you split regions later).
- **Proportions:** To match the reference, the **container** must enforce the square overall ratio **or** enforce row height relative to column width (e.g. row track size tied to column width so each cell keeps ~1:6 width:height).
- **Lines:** Neutral functional strokes — Swiss / modernist planning aesthetic; grid is structural, not decorative.

## Design intent

The grid reads as an **architectural planning grid** (blueprint-style), not a decorative pattern. Components and sections should align to this structure where the design system calls for it; spacing tokens can be expressed as multiples of one column or one row where helpful.
