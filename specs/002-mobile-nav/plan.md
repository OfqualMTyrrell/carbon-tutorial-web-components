# Implementation Plan: Mobile Navigation Menu Button

**Branch**: `002-mobile-nav` | **Date**: 2025-10-29 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/002-mobile-nav/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the
execution workflow.

## Summary

Implement a mobile-responsive navigation menu button for the Carbon Web Components demo application. On viewports below
1056px (small/medium breakpoints), the existing side navigation will be hidden by default, and a menu button will appear
in the top-left corner of the content area. Clicking the button toggles an overlay navigation panel that slides in from
the left, locks body scroll, and can be dismissed by clicking a backdrop, pressing Escape, or selecting a navigation
link. The implementation must use only Carbon Web Components and Carbon styles, with no additional dependencies. All
interactions must be keyboard accessible and follow WCAG standards.

## Technical Context

**Language/Version**: HTML5, JavaScript ES modules, SCSS  
**Primary Dependencies**:

- `@carbon/web-components@^2.17.0` (Carbon Design System web components)
- `@carbon/styles@^1.69.0` (Carbon SCSS tokens, grid, theme mixins)
- `sass@^1.80.4` (SCSS compilation)

**Storage**: N/A (client-side state only - navigation open/closed boolean)  
**Testing**: Manual testing via dev server, responsive viewport testing  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - ESM support required)  
**Project Type**: Web application (demo/showcase) - single HTML page with JS module  
**Performance Goals**:

- Navigation animation 200-300ms (Carbon motion tokens)
- Zero layout shift on button appearance/disappearance
- Smooth 60fps animations

**Constraints**:

- MUST use only Carbon Web Components (no custom components)
- MUST use only Carbon design tokens (no hard-coded values)
- Menu button must NOT be in Carbon UI Shell header
- Body scroll lock when navigation open
- Full keyboard accessibility (Tab, Enter, Space, Escape)
- Screen reader support with ARIA attributes

**Scale/Scope**: Single demo page enhancement (`demo/page-shell-side-nav.html`)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Framework-First, No Customization ✅ COMPLIANT

- **Status**: PASS
- **Verification**: Implementation will use only Carbon Web Components (`cds-button` for menu button, existing
  `cds-side-nav` component). No custom components or visual overrides. Button styling will use Carbon button variants.
  Navigation behavior will leverage Carbon's built-in side nav component with overlay mode.
- **Approach**: Use Carbon button component with appropriate size/kind variants for menu button. Apply Carbon's
  documented overlay pattern for mobile navigation using CSS classes and JavaScript event handlers (standard web APIs
  only).

### Theme & Token Fidelity ✅ COMPLIANT

- **Status**: PASS
- **Verification**: All styling will use Carbon design tokens from `@carbon/styles`:
  - Button positioning: `$spacing-05` or `$spacing-06` (Carbon spacing tokens)
  - Navigation z-index: Carbon layer tokens
  - Animation: `$duration-moderate-01` or `$duration-moderate-02` (Carbon motion tokens)
  - Backdrop: `$overlay` token with appropriate opacity
  - Focus styles: Carbon focus tokens
- **Approach**: Import necessary Carbon SCSS modules in `demo-style.scss`. Use Carbon motion mixins for slide-in
  animation.

### Grid Integrity & BEM Alignment ✅ COMPLIANT

- **Status**: PASS
- **Verification**:
  - Menu button will be positioned within existing grid structure (no wrapper divs)
  - BEM naming: `.mobile-nav-toggle` (block), `.mobile-nav-toggle__icon` (element if needed)
  - Navigation backdrop: `.mobile-nav-backdrop` (separate block)
  - No changes to existing grid column classes
  - No image additions (feature uses icon only)
- **Approach**: Add menu button as direct child of content area with appropriate grid/flex positioning using Carbon
  tokens.

### Import Discipline & Code-Splitting ✅ COMPLIANT

- **Status**: PASS
- **Verification**:
  - Styles imported first in `page-shell-side-nav.js` (already done)
  - Button component import: `import '@carbon/web-components/es/components/button/index'`
  - Side nav already imported via UI Shell index
  - No new page-specific modules needed (enhancement to existing page)
  - No HTML templates required (simple button + backdrop elements)
- **Approach**: Add button import to existing `page-shell-side-nav.js` module after style import, before logic.

### Accessibility, Linting & Quality Gates ✅ COMPLIANT

- **Status**: PASS
- **Verification**:
  - Button will include `aria-label="Open navigation menu"`, `aria-expanded="false"`, `aria-controls="mobile-side-nav"`
  - Keyboard support: Enter/Space to toggle, Escape to close, Tab to navigate
  - Focus management: Focus moves to first nav item on open, returns to button on close
  - Visible focus indicators (Carbon default)
  - Screen reader announcements via aria-expanded state changes
  - All code will pass: `pnpm run lint:style && pnpm run lint:es`
  - Logical properties for any custom positioning (margin-inline-start, etc.)
- **Approach**: Use Carbon button's built-in accessibility features. Add ARIA attributes in HTML. Implement focus trap
  pattern for open navigation. Test with keyboard-only navigation and screen reader.

**GATE RESULT**: ✅ ALL CHECKS PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/002-mobile-nav/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command) - minimal for this feature
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
demo/
├── page-shell-side-nav.html    # Enhanced with menu button and mobile nav logic
├── page-shell-side-nav.js      # Enhanced with button import and toggle logic
└── demo-style.scss             # Enhanced with mobile nav styles

public/
└── menu.svg                     # Menu icon (hamburger) - optional, may use Carbon icon
└── close.svg                    # Close icon (X) - optional, may use Carbon icon
```

**Structure Decision**: Single-page enhancement to existing `demo/page-shell-side-nav.html`. This is a UI enhancement,
not a data-driven feature, so no separate backend/frontend split needed. All code additions will be in the existing demo
folder structure following the established patterns from the grid layout showcase feature.

## Complexity Tracking

> **No violations** - This feature is fully compliant with all constitution principles. No complexity justification
> required.

---

## Phase 0: Research & Technical Decisions

**Output**: [research.md](./research.md)

**Status**: ✅ COMPLETE

**Summary**: All research questions resolved with pure Carbon Web Components solutions. Key decisions:

- Carbon `cds-button` component with `kind="ghost"` for menu toggle
- Existing `cds-side-nav` with CSS overlay positioning and transform animation
- CSS `overflow: hidden` for body scroll lock (no library needed)
- Backdrop element styled with Carbon `$overlay` token
- **Carbon Icons package (`@carbon/icons`)** for Menu and Close icons (already a project dependency)
- Carbon motion tokens (`$duration-moderate-02`) for 240ms slide animation
- Standard DOM APIs for focus management (no focus-trap library)
- `prefers-reduced-motion` support for accessibility

**Key Findings**: No additional dependencies required. All functionality achievable with Carbon components, Carbon
tokens, Carbon icons, and standard web APIs.

---

## Phase 1: Design & Contracts

### Data Model

**Output**: [data-model.md](./data-model.md)

**Status**: ✅ COMPLETE

**Summary**: Minimal state complexity - single boolean (`isMobileNavOpen`). State reflected in DOM through classes and
ARIA attributes. No data persistence, no API integration. State transitions: button click, backdrop click, Escape key,
responsive breakpoint resize. Validation rules ensure consistency between JavaScript state, CSS classes, and ARIA
attributes.

**Key Entities**:

- Navigation State: `open | closed` (boolean)
- DOM State: Button (`aria-expanded`), Side Nav (`.mobile-nav--open` class), Backdrop (`.mobile-nav-backdrop--visible`
  class), Body (`overflow` style)

### Developer Quickstart

**Output**: [quickstart.md](./quickstart.md)

**Status**: ✅ COMPLETE

**Summary**: Comprehensive developer guide for testing the feature. Covers desktop/mobile viewport testing, three close
methods (button, backdrop, Escape), keyboard navigation, screen reader testing, linting commands, visual regression
checks, reduced motion testing, and performance benchmarks. Expected performance: 240ms animation, 60fps, <50ms click
response.

**Testing Checklist**:

- ✅ Desktop view (button hidden)
- ✅ Mobile view (button visible)
- ✅ Three close methods (button, backdrop, Escape)
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader (NVDA/JAWS)
- ✅ Responsive behavior (resize from mobile to desktop)
- ✅ Reduced motion preference
- ✅ All linters pass

---

## Phase 2: Task Breakdown

**Output**: [tasks.md](./tasks.md)

**Status**: ✅ COMPLETE

**Summary**: Generated 51 atomic tasks organized by user story with clear acceptance criteria. Tasks follow strict
checklist format with IDs, parallel markers, story labels, and file paths.

**Task Breakdown**:

- **Setup Phase**: 4 tasks (environment verification)
- **Foundational Phase**: 5 tasks (SCSS foundation and imports - BLOCKING)
- **User Story 1 (P1)**: 17 tasks (MVP - core mobile navigation functionality, includes rapid toggle handling)
- **User Story 2 (P2)**: 6 tasks (responsive behavior enhancements)
- **User Story 3 (P2)**: 8 tasks (accessibility features)
- **Polish Phase**: 11 tasks (validation and cleanup)

**Parallel Opportunities**: 12 tasks marked [P] across all phases

**MVP Scope**: Complete through User Story 1 (Phase 3) - Provides core mobile navigation functionality for immediate
value

**Implementation Strategy**: Sequential by single developer (recommended due to single-file edits). User Story 1 must
complete first, then User Story 2 and 3 can proceed in priority order.

**Next Step**: Begin implementation starting with Phase 1 (Setup) tasks.
