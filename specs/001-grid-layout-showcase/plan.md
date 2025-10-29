# Implementation Plan: Grid Layout Showcase

**Branch**: `001-grid-layout-showcase` | **Date**: 2025-10-29 | **Spec**: [spec.md](./spec.md) **Input**: Feature
specification from `/specs/001-grid-layout-showcase/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the
execution workflow.

## Summary

Create three static HTML demonstration pages showcasing Carbon grid layout patterns for developer handoff. Pages
demonstrate: (1) two-column filter panel + data table (4+12 columns), (2) UI Shell with side navigation + content area
(3+13 columns), and (3) single-column landing-style layout. All pages use existing Carbon Web Components and styles with
no custom components or new dependencies. Focuses on proper grid class placement, BEM naming, and responsive behavior at
sm/md/lg breakpoints.

## Technical Context

**Language/Version**: HTML5, JavaScript (ES modules), SCSS  
**Primary Dependencies**: `@carbon/web-components@^2.17.0`, `@carbon/styles@^1.69.0`, `sass@^1.80.4`  
**Storage**: N/A (static demonstration pages, no persistence)  
**Testing**: Manual visual inspection and DOM audit; automated linting (stylelint, ESLint, Prettier, cspell)  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions); served via Vite dev server  
**Project Type**: Web (static demonstration pages within existing single-project structure)  
**Performance Goals**: Instant page load (<500ms); no JavaScript interactivity required  
**Constraints**: Use only existing Carbon packages; no new dependencies; static placeholders only (no backend/API)  
**Scale/Scope**: 3 static HTML pages with minimal CSS/JS for demonstration purposes only

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Framework-First, No Customization**: ✅ PASS

- Using only `@carbon/web-components` and `@carbon/styles`
- No custom components or visual overrides
- Theme selection via body class only

**Theme & Token Fidelity**: ✅ PASS

- All styling via Carbon SCSS mixins and tokens
- No hard-coded values
- Imports `@carbon/styles` for spacing, typography, grid

**Grid Integrity & BEM Alignment**: ✅ PASS (PRIMARY FOCUS)

- Grid classes placed on content container elements (no extra wrappers)
- BEM naming for custom demo classes (e.g., `.filter-panel`, `.filter-panel__heading`)
- Images include width/height attributes

**Import Discipline & Code-Splitting**: ✅ PASS

- Styles imported first in each page's script module
- Page-specific JS modules (e.g., `page-filter-table.js`, `page-shell-side-nav.js`)
- UI Shell index import only where needed (Page B)
- Templates placed after `</body>` tag

**Accessibility, Linting & Quality Gates**: ✅ PASS

- Skip-to-content and `aria-label` attributes included
- All pages pass stylelint, ESLint, Prettier, cspell
- Manual accessibility validation via DOM inspection

**Verdict**: ✅ ALL GATES PASS - No violations. Feature fully aligned with constitution.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

## Project Structure

### Documentation (this feature)

```text
specs/001-grid-layout-showcase/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (N/A for static pages)
├── demo/                # Demonstration HTML pages
│   ├── page-filter-table.html
│   ├── page-filter-table.js
│   ├── page-shell-side-nav.html
│   ├── page-shell-side-nav.js
│   ├── page-single-column.html
│   ├── page-single-column.js
│   └── demo-style.scss
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
carbon-tutorial-web-components/ (existing structure, no changes)
├── index.html
├── main.js
├── style.scss
├── landing.js
├── repos.js
├── repositories.html
├── counter.js
├── public/              # SVGs and assets
├── specs/               # Feature specifications
│   └── 001-grid-layout-showcase/
│       └── demo/        # NEW: Demo pages for this feature
└── package.json         # No changes (using existing dependencies)
```

**Structure Decision**: Demo pages are placed in `specs/001-grid-layout-showcase/demo/` to keep them isolated from the
main application. This follows the pattern of keeping feature artifacts together and avoids polluting the root
directory. Each page has its own HTML and JS module for code-splitting. A shared `demo-style.scss` imports Carbon styles
and defines minimal demo-specific BEM classes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. This feature is fully compliant with all constitution principles.
|-----------|------------|-------------------------------------| | [e.g., 4th project] | [current need] | [why 3
projects insufficient] | | [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
