# Grid Layout Showcase - Handoff Documentation

**Feature**: Grid Layout Showcase  
**Branch**: `001-grid-layout-showcase`  
**Purpose**: Demonstrate Carbon grid implementation patterns for developer handoff

## Overview

This feature provides three static HTML pages that showcase proper Carbon Design System grid usage. These pages serve as
reference implementations for developers learning Carbon's 16-column CSS Grid system.

## Demo Pages

### Page A: Filter Panel + Data Table Layout

**File**: `demo/page-filter-table.html`

**Layout**:

- Two-column responsive layout
- Left: Filter panel (4 columns on large viewports)
- Right: Data table (12 columns on large viewports)
- Stacks vertically on small/medium breakpoints

**Key Implementation Points**:

- Filter panel:
  `<div class="filter-panel cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-4">`
- Data table:
  `<div class="data-table-demo cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-12">`
- 5 sample filter controls (non-functional)
- 10 sample table rows (static content)

**What to Look For**:

- Grid classes on content containers (no wrapper divs)
- BEM naming: `.filter-panel`, `.filter-panel__heading`, `.filter-panel__control`
- All three breakpoints specified (sm/md/lg)
- Column math: 4 + 12 = 16 columns (full grid width)

---

### Page B: UI Shell with Side Navigation

**File**: `demo/page-shell-side-nav.html`

**Layout**:

- Two-column responsive layout with Carbon UI Shell
- Left: Fixed side navigation (3 columns on large viewports)
- Right: Content area (13 columns on large viewports)
- Navigation collapses/stacks on small/medium breakpoints

**Key Implementation Points**:

- Side nav: `<cds-side-nav>` component (3 columns)
- Content area:
  `<div class="content-area cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-13">`
- UI Shell index import: `import '@carbon/web-components/es/components/ui-shell/index'`
- 4 content sections in main area

**What to Look For**:

- UI Shell components properly integrated with grid
- Navigation column fixed positioning
- Content area grid classes on main content container
- Column math: 3 + 13 = 16 columns (full grid width)
- Component import strategy (UI Shell index for grouped components)

---

### Page C: Single-Column Landing Layout

**File**: `demo/page-single-column.html`

**Layout**:

- Single-column full-width responsive layout
- Content sections span full grid width
- Demonstrates subgrid usage for nested layouts

**Key Implementation Points**:

- Content sections:
  `<div class="content-section cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-16">`
- 4 content sections demonstrating single-column flow
- Template pattern example (template placed after `</body>` tag)
- Subgrid for nested layouts: `<div class="cds--subgrid cds--subgrid--full-wide">`

**What to Look For**:

- Full-width column spans (all 16 columns on large)
- Subgrid usage for nested content
- Template placement after `</body>` tag, before `</html>`
- Responsive stacking at all breakpoints

---

## Carbon Grid Rules Reference

### Core Principles

1. **Grid Classes on Content Containers**
   - ❌ WRONG: Extra wrapper div
     ```html
     <div class="cds--css-grid-column cds--lg:col-span-4">
       <div class="filter-panel">Content</div>
     </div>
     ```
   - ✅ CORRECT: Grid class on content element
     ```html
     <div class="filter-panel cds--css-grid-column cds--lg:col-span-4">Content</div>
     ```

2. **Specify All Breakpoints**
   - Always include sm, md, and lg column spans
   - Mobile-first approach (sm is base, md/lg override)

3. **Column Math**
   - Carbon uses 16-column grid on large viewports
   - 8-column grid on medium
   - 4-column grid on small
   - Columns in a row should sum to total grid width (or less for gaps)

4. **BEM Naming for Custom Classes**
   - Block: `.filter-panel`
   - Element: `.filter-panel__heading`
   - Modifier: `.filter-panel__control--active`
   - No position-based modifiers (use `:nth-of-type()` in CSS)

5. **Import Order**
   - Styles MUST be imported first in JS modules
   - Then import Carbon Web Components
   - Example:
     ```javascript
     import './demo-style.scss'; // First
     import '@carbon/web-components/es/components/skip-to-content/index'; // Then components
     ```

6. **Accessibility Requirements**
   - Skip-to-content link in header (first focusable element)
   - `main` landmark with id (skip-to-content target)
   - Images with width and height attributes
   - Meaningful aria-label attributes

---

## File Organization

```
specs/001-grid-layout-showcase/
├── demo/
│   ├── page-filter-table.html         # Page A
│   ├── page-filter-table.js           # Page A imports
│   ├── page-shell-side-nav.html       # Page B
│   ├── page-shell-side-nav.js         # Page B imports
│   ├── page-single-column.html        # Page C
│   ├── page-single-column.js          # Page C imports
│   └── demo-style.scss                # Shared styles
├── spec.md                            # Feature specification
├── plan.md                            # Implementation plan
├── research.md                        # Technical decisions
├── data-model.md                      # Entity structure
├── quickstart.md                      # Developer setup guide
├── README.md                          # This file
└── checklists/
    └── requirements.md                # Quality checklist
```

---

## Constitution Compliance

This feature is fully compliant with the project constitution (v1.0.0):

- ✅ **Framework-First, No Customization**: Uses only `@carbon/web-components` and `@carbon/styles`
- ✅ **Theme & Token Fidelity**: All styling uses Carbon tokens and SCSS mixins
- ✅ **Grid Integrity & BEM Alignment**: Grid classes on content containers, BEM naming, image dimensions
- ✅ **Import Discipline & Code-Splitting**: Styles first, page-specific JS modules, templates after `</body>`
- ✅ **Accessibility, Linting & Quality Gates**: Skip-to-content, aria-labels, all linters passing

---

## Developer Handoff Checklist

Use this checklist when creating new pages based on these patterns:

- [ ] Grid parent has `cds--css-grid` class
- [ ] Grid children have `cds--css-grid-column` class
- [ ] All three breakpoints specified (sm/md/lg)
- [ ] Grid classes on content containers (no wrapper divs)
- [ ] BEM naming for custom classes
- [ ] Images include width and height attributes
- [ ] Skip-to-content link in header
- [ ] Main landmark with id="main-content"
- [ ] Styles imported first in JS module
- [ ] Templates (if any) placed after `</body>`
- [ ] All linters passing (stylelint, ESLint, Prettier, cspell)
- [ ] Responsive behavior validated at sm/md/lg breakpoints

---

## Common Patterns

### Grid Container Setup

```html
<div class="cds--css-grid cds--css-grid--full-width">
  <!-- Grid columns here -->
</div>
```

### Grid Column with All Breakpoints

```html
<div class="content cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-4 cds--lg:col-span-8">
  <!-- Content -->
</div>
```

### BEM Class Structure

```scss
.filter-panel {
  // Block styles

  &__heading {
    // Element styles
  }

  &__control {
    // Element styles

    &--active {
      // Modifier styles
    }
  }
}
```

### Subgrid for Nested Layouts

```html
<div class="cds--css-grid-column cds--lg:col-span-16">
  <div class="cds--subgrid cds--subgrid--full-wide">
    <!-- Nested grid content -->
  </div>
</div>
```

---

## Resources

- **Project Constitution**: `.specify/memory/constitution.md`
- **Working with Carbon Guide**: `WORKING_WITH_CARBON.md`
- **Carbon Web Components**: https://web-components.carbondesignsystem.com/
- **Carbon Design System**: https://carbondesignsystem.com/
- **Quickstart Guide**: `quickstart.md`

---

## Questions?

For questions or clarifications about grid implementation:

1. Review the constitution (`.specify/memory/constitution.md`)
2. Check `WORKING_WITH_CARBON.md` for detailed patterns
3. Inspect demo page markup and CSS for examples
4. Refer to `research.md` for technical decision rationale
