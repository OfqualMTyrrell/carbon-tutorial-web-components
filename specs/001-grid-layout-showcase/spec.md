# Feature Specification: Grid Layout Showcase

**Feature Branch**: `1-grid-layout-showcase` **Created**: 2025-10-29 **Status**: Draft **Input**: Build three new pages
that showcase different page layouts using the Carbon grid to help developers understand grid implementation for
handoff. Pages:

- Page A: Two-column layout — left: on-page filtering panel; right: data table placeholder (functionality not required).
- Page B: Two-column layout — left: UI shell fixed side navigation; right: content area placeholder.
- Page C: Single-column layout similar to the existing landing page, showing layout only.

## Clarifications

### Session 2025-10-29

- Q: What is the ideal column span ratio for the filter panel versus the data table on large (desktop) viewports? → A: 4
  columns (filter) + 12 columns (data table) - Balanced layout
- Q: How many columns should the UI Shell side navigation occupy on large viewports? → A: 3 columns - Standard Carbon
  side nav width
- Q: How many sample items should be included for a realistic layout demonstration? → A: Moderate: 5 filter controls, 10
  table rows, 4 content sections

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Two-column filter + data table (Priority: P1)

As a developer preparing a handoff, I need a page that demonstrates a two-column layout where a left-side filtering
panel and a right-side data table coexist so designers and implementers can inspect markup, spacing, and responsive
behavior.

**Why this priority**: This is the primary layout used for data-heavy pages and is critical for handoff clarity.

**Independent Test**: Visual inspection and DOM audit by a developer or designer comparing the page markup against the
documented Carbon grid conventions.

**Acceptance Scenarios**:

1. Given the page is loaded, When viewed at large (desktop) breakpoint, Then the left panel and right content appear as
   two columns with the filter panel occupying 4 grid columns and the data table occupying 12 grid columns, aligned to
   the Carbon 16-column grid.
2. Given the page is loaded, When viewed at medium/mobile breakpoints, Then the layout stacks vertically according to
   Carbon mobile-first responsive expectations.
3. Given the page is loaded, When inspecting the DOM, Then grid column classes are present on the content container
   elements (content containers hold the grid classes, not extra wrappers).

---

### User Story 2 - UI Shell with fixed side navigation (Priority: P2)

As a developer, I need a page that demonstrates the UI Shell pattern with a fixed side navigation (left) and a content
area (right), so handoff consumers can see how the shell and content compose with the Carbon grid.

**Why this priority**: Frequently used for application frames; shows integration with UI Shell components and layout
considerations.

**Independent Test**: Visual inspection to confirm a fixed navigation column and a flexible content region; DOM
inspection to confirm UI Shell index import usage is suggested in comments.

**Acceptance Scenarios**:

1. Given the page is loaded, When viewed at large breakpoint, Then the side navigation occupies 3 grid columns and is
   fixed, and the main content area occupies the remaining 13 columns.
2. Given the page is loaded, When viewed at smaller breakpoints, Then the side navigation behaves per Carbon patterns
   (collapsible/stackable) and content stacks appropriately.

---

### User Story 3 - Single-column landing-like layout (Priority: P3)

As a developer, I need a single-column page that mimics the existing landing page structure but with simplified content
so layout handoff is clear.

**Why this priority**: Serves as a compact reference for content-first pages and demonstrates how single-column layouts
should be structured using the grid.

**Independent Test**: Visual inspection showing single-column flow, consistent spacing tokens, and correct usage of BEM
naming and grid classes where applicable.

**Acceptance Scenarios**:

1. Given the page is loaded, When viewed at all breakpoints, Then content flows vertically with appropriate spacing and
   typographic rhythm preserved.
2. Given the page is loaded, When inspecting the DOM, Then the page uses a subgrid for wide content areas where
   indicated and follows the template-placement guidance (templates after `</body>`).

---

### Edge Cases

- What happens if the viewport is extremely narrow (<320px)? Ensure content remains readable and vertical stacking
  occurs.
- What happens when images or placeholders have no explicit dimensions? Ensure placeholder elements include
  `width`/`height` attributes to avoid layout shift.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Provide Page A (two-column: filter panel + data table placeholder) with clear container elements
  demonstrating Carbon grid column usage and BEM naming. On large viewports, the filter panel MUST occupy 4 columns
  (cds--lg:col-span-4) and the data table MUST occupy 12 columns (cds--lg:col-span-12).
- **FR-002**: Provide Page B (UI Shell with fixed side navigation + content area) demonstrating how shell and content
  integrate with the grid. On large viewports, the side navigation MUST occupy 3 columns (cds--lg:col-span-3) and the
  content area MUST occupy 13 columns (cds--lg:col-span-13).
- **FR-003**: Provide Page C (single-column landing-like layout) documenting content flow and spacing.
- **FR-004**: All pages MUST use Carbon grid classes on the content container elements (no extra wrapper divs that break
  the grid).
- **FR-005**: All pages MUST import styles before component imports in their entry modules (note: this is a
  developer-facing guidance included as a comment in the delivered files).
- **FR-006**: All image placeholders and illustrative assets MUST include `width` and `height` attributes to prevent
  layout shift.
- **FR-007**: Each page MUST include a `main` landmark and a skip-to-content link in the header area for accessibility
  testing.
- **FR-008**: Provide minimal placeholder content only — interactive functionality (filters, table sorting/expansion) is
  NOT required and should be omitted. Page A MUST include 5 sample filter controls and 10 data table rows. Page B MUST
  include 4 content sections in the main area. Page C MUST include 4 content sections demonstrating single-column flow.

### Assumptions

- The goal is a visual and structural handoff for developers; no backend or interactive logic is required.
- The project will reuse existing Carbon components and CSS tokens from `@carbon/web-components` and `@carbon/styles`
  (implementation guidance appears in the constitution and project docs).
- Visual QA will be done by designers/developers via manual inspection and DOM audits.

## Success Criteria _(mandatory)_

- **SC-001**: Three pages are present under `specs/1-grid-layout-showcase/demo/` and load without interactive errors in
  a browser (static placeholders only).
- **SC-002**: For each page, at least the three breakpoints (small/medium/large) are visually validated: columns
  stack/expand per expectations and no grid-breaking wrappers are present.
- **SC-003**: The left filter panel and right data-table placeholder on Page A maintain column relationships on large
  viewports (developer-visible via grid classes on container elements).
- **SC-004**: The UI Shell demonstration on Page B shows a fixed navigation column and a flexible content region; DOM
  inspection confirms grid classes are on content containers.
- **SC-005**: A short handoff README (`specs/1-grid-layout-showcase/README.md`) is included with pointers to which
  elements demonstrate each rule (grid placement, BEM usage, template placement), enabling another developer to
  reproduce the layout without guessing.

## Key Entities _(include if feature involves data)_

- Page: A static HTML page used for layout demonstration.
- Filter Panel (placeholder): Visual panel box with heading and 5 sample form controls (non-functional).
- Data Table (placeholder): Visual table layout with 10 sample rows (static, no data binding).
- UI Shell Side Navigation: Fixed navigation column (3 columns) demonstrating shell composition.
- Content Area: Flexible page content area (13 columns for Page B, full-width for Page C) with 4 content sections
  demonstrating grid behavior.

## Delivery & File Layout

- `specs/1-grid-layout-showcase/`
  - `spec.md` (this file)
  - `README.md` (handoff notes, where to look for asserts)
  - `demo/`
    - `page-filter-table.html` (Page A)
    - `page-shell-side-nav.html` (Page B)
    - `page-single-column.html` (Page C)
    - `style.scss` (demo-only styles importing Carbon tokens; minimal notes only)
  - `checklists/requirements.md` (spec quality checklist)

## Notes

- This specification focuses exclusively on layout and markup used for handoff. It intentionally excludes interactive
  implementations (no JavaScript behavior necessary beyond script tags to import web components where helpful). The demo
  pages should include inline comments that point to which DOM elements show the required grid usage and BEM
  conventions.

---

_End of specification._
