# carbon-tutorial-web-components Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-29

## Active Technologies

- HTML5, JavaScript (ES modules), SCSS + `@carbon/web-components@^2.17.0`, `@carbon/styles@^1.69.0`, `sass@^1.80.4`
  (001-grid-layout-showcase)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test; npm run lint

## Code Style

HTML5, JavaScript (ES modules), SCSS: Follow standard conventions

## Recent Changes

- 001-grid-layout-showcase: Added HTML5, JavaScript (ES modules), SCSS + `@carbon/web-components@^2.17.0`,
  `@carbon/styles@^1.69.0`, `sass@^1.80.4`

<!-- MANUAL ADDITIONS START -->

## Carbon Web Components Guidelines

This project uses IBM Carbon Design System Web Components. All implementation must follow Carbon patterns and best
practices.

### Required Reading

Before making any changes to Carbon-related code, review:

1. **WORKING_WITH_CARBON.md** - Comprehensive guide to Carbon Web Components patterns, including:
   - Theme system and dynamic theming
   - UI Shell architecture
   - CSS Grid system (16-column responsive grid)
   - BEM naming conventions
   - Component import patterns
   - HTML template patterns
   - Icon integration with CSS masks
   - Design tokens (spacing, typography, colors)
   - Event handling
   - Linting and code quality

2. **.specify/memory/constitution.md** - Project governance and architectural rules, including:
   - Framework-First principle (use Carbon components, not native HTML)
   - Theme & Token Fidelity (no hard-coded values)
   - Grid Integrity (grid classes on content containers)
   - Import Discipline (styles first, then components)
   - Accessibility & Quality Gates (logical properties for RTL support)

### Carbon Implementation Rules

1. **Always use Carbon design tokens** - No hard-coded values (colors, spacing, typography)
2. **Grid classes on content containers** - Never create wrapper divs for grid classes
3. **BEM naming for custom classes** - Follow `block__element--modifier` pattern
4. **Logical CSS properties** - Use `inline-start`/`inline-end` instead of `left`/`right` for RTL support
5. **Import order matters** - Styles first, then component imports
6. **CSS mask pattern for icons** - Use `/public` SVG files with CSS masks for theme-aware icons
7. **Template pattern for dynamic content** - Use HTML `<template>` elements after `</body>` tag
8. **Responsive mobile-first** - Always specify `sm:`, `md:`, and `lg:` breakpoints
9. **Accessibility** - Include ARIA labels, roles, and proper semantic HTML
10. **Linting is mandatory** - Run `pnpm run lint:style && pnpm run lint:es` before committing

### Common Mistakes to Avoid

- ❌ Creating wrapper divs for grid classes
- ❌ Using physical CSS properties (`left`, `right`, `margin-left`)
- ❌ Hard-coding colors, spacing, or typography values
- ❌ Importing components before styles
- ❌ Using native HTML form elements instead of Carbon components
- ❌ Missing responsive breakpoint classes
- ❌ Inline SVGs instead of CSS mask pattern

### Linting Commands

- `pnpm run lint:style` - Check SCSS for Carbon token usage, logical properties, BEM naming
- `pnpm run lint:style -- --fix` - Auto-fix logical properties and formatting
- `pnpm run lint:es` - Check JavaScript code quality
- `pnpm run lint:format` - Format all code with Prettier
- `pnpm run lint:spell` - Check for typos in code and documentation

<!-- MANUAL ADDITIONS END -->
