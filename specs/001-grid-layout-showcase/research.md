# Research: Grid Layout Showcase

**Feature**: Grid Layout Showcase  
**Date**: 2025-10-29  
**Purpose**: Resolve technical decisions and validate Carbon grid patterns for three demonstration pages

## Research Areas

### 1. Carbon Grid System Implementation

**Decision**: Use Carbon's CSS Grid system with responsive column spans

**Rationale**:

- Carbon provides a 16-column grid at large breakpoints (`cds--lg`)
- 8-column grid at medium (`cds--md`)
- 4-column grid at small (`cds--sm`)
- Grid classes must be placed directly on content containers (no wrapper divs)
- Uses native CSS Grid (not flexbox)

**Alternatives Considered**:

- Custom CSS Grid implementation: Rejected - violates constitution (Framework-First principle)
- Flexbox-based layout: Rejected - Carbon's documented grid uses CSS Grid
- Bootstrap or other grid systems: Rejected - must use Carbon only

**Implementation Pattern**:

```html
<div class="cds--css-grid cds--css-grid--full-width">
  <div class="content-element cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-4 cds--lg:col-span-4">
    <!-- Filter panel: 4 columns on large -->
  </div>
  <div class="content-element cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-12">
    <!-- Data table: 12 columns on large -->
  </div>
</div>
```

**Key Rules**:

- Always specify all three breakpoints (sm/md/lg)
- Grid classes belong on the same element as content (not wrapper divs)
- Use `cds--css-grid` on parent, `cds--css-grid-column` on children
- Full-width grids use `cds--css-grid--full-width`

---

### 2. Carbon Web Components for Demonstration Pages

**Decision**: Use minimal Carbon components; focus on grid structure not interactivity

**Rationale**:

- Pages are for layout demonstration, not functional application
- Primary components needed:
  - `cds-header` with `cds-skip-to-content` (accessibility requirement)
  - `cds-side-nav` for Page B (UI Shell demonstration)
  - `cds-table` (placeholder structure, no interactive features)
  - Static HTML for filter controls (no Carbon form components needed for non-functional demo)

**Alternatives Considered**:

- Full interactive Carbon form components: Rejected - adds unnecessary complexity for static demo
- No Carbon components at all: Rejected - need header/skip-to-content for accessibility compliance
- Full UI Shell implementation: Partially adopted (Page B only, simplified for demo purposes)

**Component Import Strategy**:

```javascript
// page-shell-side-nav.js
import './demo-style.scss'; // Styles first (constitution requirement)
import '@carbon/web-components/es/components/ui-shell/index'; // UI Shell group
import '@carbon/web-components/es/components/skip-to-content/index';
```

**For Page A (filter + table)**:

```javascript
// page-filter-table.js
import './demo-style.scss';
import '@carbon/web-components/es/components/skip-to-content/index';
import '@carbon/web-components/es/components/data-table/index';
```

**For Page C (single column)**:

```javascript
// page-single-column.js
import './demo-style.scss';
import '@carbon/web-components/es/components/skip-to-content/index';
```

---

### 3. BEM Naming Conventions for Demo Classes

**Decision**: Use BEM (Block\_\_Element--Modifier) for custom demo classes

**Rationale**:

- Constitution requires BEM alignment
- Project documentation (WORKING_WITH_CARBON.md) shows existing BEM patterns
- Keeps demo classes consistent with project conventions

**Demo Class Structure**:

- `.filter-panel` (block)
- `.filter-panel__heading` (element)
- `.filter-panel__control` (element)
- `.data-table-demo` (block)
- `.content-section` (block)
- `.content-section__heading` (element)

**Alternatives Considered**:

- Utility-first classes (Tailwind-style): Rejected - not Carbon's documented pattern
- Nested class selectors: Rejected - BEM explicitly avoids nesting in class names
- No custom classes: Rejected - need minimal styling for demo visual structure

**Key Rules**:

- Double underscores (`__`) separate block from element
- Double hyphens (`--`) separate element/block from modifier
- Single hyphens (`-`) separate words within names
- No position-based modifiers (use `:nth-of-type()` in CSS instead)

---

### 4. Responsive Breakpoint Behavior

**Decision**: Follow Carbon's documented breakpoint values and mobile-first approach

**Rationale**:

- Carbon defines specific breakpoint ranges:
  - Small (sm): up to 671px (4-column grid)
  - Medium (md): 672px to 1055px (8-column grid)
  - Large (lg): 1056px to 1311px (16-column grid)
  - X-large (xlg): 1312px to 1583px (16-column grid)
  - Max (max): 1584px+ (16-column grid)
- Mobile-first means small breakpoint styles are base, then override for larger screens
- All pages must stack vertically on small/medium, expand to columns on large

**Column Allocation by Breakpoint**:

**Page A (Filter + Table)**:

- sm: Full-width stacking (both 4 cols span full)
- md: Full-width stacking (both 8 cols span full)
- lg: Filter 4 cols, Table 12 cols (side by side)

**Page B (Side Nav + Content)**:

- sm: Stacking or collapsible nav (Carbon UI Shell handles this)
- md: Stacking or collapsible nav
- lg: Side nav 3 cols, Content 13 cols

**Page C (Single Column)**:

- sm/md/lg: Full-width content sections (spans all columns)

**Alternatives Considered**:

- Desktop-first approach: Rejected - Carbon and modern web standards favor mobile-first
- Fixed pixel widths: Rejected - Carbon uses responsive column spans, not fixed widths
- Custom breakpoint values: Rejected - must use Carbon's documented breakpoints

---

### 5. Accessibility Requirements for Static Demos

**Decision**: Include minimal accessibility features required by constitution

**Rationale**:

- Constitution requires skip-to-content link in header
- All interactive elements need `aria-label` attributes
- `main` landmark required for skip-to-content target
- Images need width/height attributes (prevents layout shift)

**Required Accessibility Features**:

```html
<header>
  <cds-header>
    <cds-skip-to-content href="#main-content"></cds-skip-to-content>
    <!-- Other header content -->
  </cds-header>
</header>

<main id="main-content">
  <!-- Page content -->
</main>
```

**For Images/Placeholders**:

```html
<img src="placeholder.svg" alt="Description" width="200" height="150" />
```

**Alternatives Considered**:

- Skip accessibility for demos: Rejected - constitution explicitly requires it
- Full WCAG 2.1 AA compliance testing: Deferred - manual inspection sufficient for static demo
- Screen reader testing: Deferred - DOM inspection validates structure, full testing not required for handoff demo

---

### 6. Template Placement Pattern

**Decision**: Place `<template>` elements after `</body>` tag, before `</html>`

**Rationale**:

- Constitution and WORKING_WITH_CARBON.md document this pattern
- Keeps templates out of visible DOM but accessible to JavaScript
- Used for cloning pattern (if needed for demonstrating component template usage)

**Example**:

```html
</body>

<template id="template--content-section">
  <div class="content-section cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-16">
    <h3 class="content-section__heading">Heading</h3>
    <p class="content-section__body">Content</p>
  </div>
</template>

</html>
```

**Note**: For these demo pages, templates may not be necessary since content is static. Decision: Include at least one
example on Page C to demonstrate the pattern.

**Alternatives Considered**:

- Templates in `<head>`: Rejected - not documented Carbon pattern
- Templates inside `<body>`: Rejected - pollutes visible DOM
- No templates: Partially adopted (use only where demonstrating the pattern adds value)

---

## Summary of Technical Decisions

| Decision Area     | Choice                                                                  | Rationale                                    |
| ----------------- | ----------------------------------------------------------------------- | -------------------------------------------- |
| Grid System       | Carbon CSS Grid (16-col)                                                | Constitution-compliant, documented pattern   |
| Component Usage   | Minimal (header, skip-to-content, table structure, UI Shell for Page B) | Focus on layout, not interactivity           |
| Custom Styling    | BEM classes with Carbon tokens                                          | Constitution requires BEM + token fidelity   |
| Breakpoints       | Carbon's sm/md/lg (mobile-first)                                        | Standard Carbon responsive approach          |
| Accessibility     | Skip-to-content, aria-labels, main landmark, image dimensions           | Constitution requirements                    |
| Template Pattern  | After `</body>` (demonstrate on Page C)                                 | Documented Carbon/project convention         |
| File Organization | Pages in `specs/001-grid-layout-showcase/demo/`                         | Keep feature artifacts together              |
| Import Order      | Styles first, then components                                           | Constitution requirement (Import Discipline) |

---

## Open Questions / Deferred Decisions

None. All technical decisions resolved. Ready for Phase 1 (Design & Contracts).
