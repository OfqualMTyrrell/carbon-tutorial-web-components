# Quickstart: Grid Layout Showcase

**Feature**: Grid Layout Showcase  
**Date**: 2025-10-29  
**Prerequisites**: Node.js 18+, pnpm installed, repository cloned

## Quick Start (5 minutes)

### 1. Switch to Feature Branch

```powershell
git checkout 001-grid-layout-showcase
```

### 2. Install Dependencies (if not already installed)

```powershell
pnpm install
```

### 3. Start Development Server

```powershell
pnpm run dev
```

Server will start at `http://localhost:5173`

### 4. View Demo Pages

Open in browser:

- **Page A (Filter + Table)**: `http://localhost:5173/specs/001-grid-layout-showcase/demo/page-filter-table.html`
- **Page B (UI Shell + Nav)**: `http://localhost:5173/specs/001-grid-layout-showcase/demo/page-shell-side-nav.html`
- **Page C (Single Column)**: `http://localhost:5173/specs/001-grid-layout-showcase/demo/page-single-column.html`

### 5. Inspect Grid Implementation

Open browser DevTools (F12) and:

- Select the Elements/Inspector tab
- Find elements with classes starting with `cds--css-grid-column`
- Verify column span classes: `cds--lg:col-span-4`, `cds--lg:col-span-12`, etc.
- Resize browser window to see responsive behavior at breakpoints

---

## File Structure

```
specs/001-grid-layout-showcase/
├── demo/
│   ├── page-filter-table.html         # Page A: Filter + Table layout
│   ├── page-filter-table.js           # Page A: Component imports
│   ├── page-shell-side-nav.html       # Page B: UI Shell layout
│   ├── page-shell-side-nav.js         # Page B: Component imports
│   ├── page-single-column.html        # Page C: Single column layout
│   ├── page-single-column.js          # Page C: Component imports
│   └── demo-style.scss                # Shared demo styles
├── spec.md                            # Feature specification
├── plan.md                            # Implementation plan
├── research.md                        # Technical decisions
├── data-model.md                      # Entity structure
├── quickstart.md                      # This file
└── README.md                          # Handoff documentation
```

---

## Development Workflow

### Create New Demo Page

1. Create HTML file in `specs/001-grid-layout-showcase/demo/`
2. Create corresponding JS file for component imports
3. Follow pattern:

```javascript
// page-example.js
import './demo-style.scss'; // Styles first (required by constitution)
import '@carbon/web-components/es/components/skip-to-content/index';
// Import other components as needed
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Title</title>
    <script type="module" src="./page-example.js"></script>
  </head>
  <body>
    <header>
      <cds-header>
        <cds-skip-to-content href="#main-content"></cds-skip-to-content>
      </cds-header>
    </header>

    <main id="main-content">
      <div class="cds--css-grid cds--css-grid--full-width">
        <!-- Grid content here -->
      </div>
    </main>
  </body>
</html>
```

### Add Custom Demo Styles

Edit `demo-style.scss`:

```scss
@use '@carbon/styles/scss/spacing' as *;
@use '@carbon/styles/scss/theme' as *;
@use '@carbon/styles/scss/type' as *;

// BEM-style custom classes
.filter-panel {
  padding: $spacing-05;
  background-color: $layer-01;

  &__heading {
    @include type-style('heading-compact-02');
    margin-bottom: $spacing-05;
  }

  &__control {
    margin-bottom: $spacing-03;
  }
}
```

### Validate Grid Classes

Check that:

- Grid classes are on content container elements (not wrapper divs)
- All breakpoints specified: `cds--sm:col-span-*`, `cds--md:col-span-*`, `cds--lg:col-span-*`
- Parent uses `cds--css-grid` and optionally `cds--css-grid--full-width`
- Children use `cds--css-grid-column`

---

## Linting & Quality Checks

### Run All Linters

```powershell
pnpm run lint:style
pnpm run lint:es
pnpm run lint:format
pnpm run lint:spell
```

### Fix Auto-Fixable Issues

```powershell
pnpm run lint:style -- --fix
pnpm run lint:format
```

### Common Lint Issues

**Stylelint**:

- Hard-coded values instead of Carbon tokens → Use `$spacing-*`, `$layer-*`, etc.
- Physical properties instead of logical → Run `--fix` to auto-convert (e.g., `margin-left` → `margin-inline-start`)

**ESLint**:

- Missing semicolons, unused variables → Follow Prettier formatting

**CSpell**:

- Technical terms flagged → Add to `cspell.json` `words` array if intentional

---

## Testing & Validation

### Manual Visual Testing

1. **Breakpoint Testing**:
   - Desktop (>1056px): Verify side-by-side column layouts
   - Tablet (672-1055px): Verify stacking or intermediate layouts
   - Mobile (<672px): Verify full-width stacking

2. **Grid Inspection**:
   - Use browser DevTools to verify grid column spans
   - Check that no extra wrapper divs break grid placement
   - Confirm grid classes are on content containers

3. **Accessibility Testing**:
   - Tab through page: Skip-to-content link should be first focusable element
   - Verify `main` landmark present
   - Check images have width/height attributes

### DOM Audit Checklist

- [ ] Grid parent has `cds--css-grid` class
- [ ] Grid children have `cds--css-grid-column` class
- [ ] Column spans present for all breakpoints (sm/md/lg)
- [ ] No extra wrapper divs between grid parent and content
- [ ] BEM naming used for custom classes
- [ ] Images include `width` and `height` attributes
- [ ] Skip-to-content link present in header
- [ ] `main` landmark with `id="main-content"`
- [ ] Templates (if any) placed after `</body>` tag

---

## Troubleshooting

### Pages Not Loading

**Issue**: 404 when accessing demo pages

**Solution**:

- Verify Vite dev server is running (`pnpm run dev`)
- Check file paths are correct relative to repository root
- Ensure files are in `specs/001-grid-layout-showcase/demo/` directory

### Styles Not Applied

**Issue**: Pages appear unstyled

**Solution**:

- Verify `demo-style.scss` imports Carbon styles:
  ```scss
  @use '@carbon/styles/scss/grid';
  @use '@carbon/styles/scss/spacing' as *;
  ```
- Check that JS file imports styles first:
  ```javascript
  import './demo-style.scss'; // Must be first
  ```
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Grid Layout Broken

**Issue**: Elements not aligning to grid

**Solution**:

- Inspect element: Verify `cds--css-grid-column` class present
- Check parent has `cds--css-grid` class
- Ensure no wrapper divs between grid container and content
- Verify column span classes: `cds--lg:col-span-*`

### Components Not Rendering

**Issue**: Carbon Web Components not displaying

**Solution**:

- Check browser console for errors
- Verify component imports in JS file
- Ensure script tag has `type="module"` attribute
- Check component is defined in imports (e.g., `import '@carbon/web-components/es/components/ui-shell/index'`)

---

## Next Steps

1. **Review Implementation**: See [README.md](./README.md) for handoff notes and grid implementation details
2. **Run Tasks**: When implementation phase begins, see `tasks.md` (generated by `/speckit.tasks`)
3. **Add More Pages**: Follow patterns in existing pages to create additional grid demonstrations

---

## Useful Commands

| Command                | Purpose                         |
| ---------------------- | ------------------------------- |
| `pnpm run dev`         | Start Vite development server   |
| `pnpm run build`       | Build for production            |
| `pnpm run preview`     | Preview production build        |
| `pnpm run lint:style`  | Lint SCSS files                 |
| `pnpm run lint:es`     | Lint JavaScript files           |
| `pnpm run lint:format` | Format all files with Prettier  |
| `pnpm run lint:spell`  | Check spelling in code and docs |

---

## Resources

- [Carbon Web Components Docs](https://web-components.carbondesignsystem.com/)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Project Constitution](../../../.specify/memory/constitution.md)
- [Working with Carbon Guide](../../../WORKING_WITH_CARBON.md)
