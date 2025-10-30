---
description: 'Task list template for feature implementation'
---

# Tasks: Grid Layout Showcase

**Input**: Design documents from `/specs/001-grid-layout-showcase/` **Prerequisites**: plan.md (required), spec.md
(required for user stories), research.md, data-model.md, quickstart.md

**Tests**: This feature does not require automated tests. Manual visual inspection and DOM audit are sufficient for
static demonstration pages.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Demo pages: `specs/001-grid-layout-showcase/demo/` at repository root
- Paths shown below use absolute paths from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and shared assets for all demo pages

- [x] T001 Create demo directory structure at `specs/001-grid-layout-showcase/demo/`
- [x] T002 [P] Create shared `demo-style.scss` in `specs/001-grid-layout-showcase/demo/demo-style.scss` importing Carbon
      styles
- [x] T003 [P] Add placeholder SVG assets to `public/` directory if needed for demonstrations (optional)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared SCSS configuration that all pages depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Configure `demo-style.scss` with Carbon imports: `@use '@carbon/styles/scss/grid'`,
      `@use '@carbon/styles/scss/spacing' as *`, `@use '@carbon/styles/scss/theme' as *`,
      `@use '@carbon/styles/scss/type' as *`
- [x] T005 [P] Define base BEM class structures in `demo-style.scss` for: `.filter-panel`, `.data-table-demo`,
      `.content-section`, `.content-area`
- [x] T006 [P] Add responsive breakpoint styles in `demo-style.scss` using Carbon's `@include breakpoint-down()` mixin

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Two-column filter + data table (Priority: P1) 🎯 MVP

**Goal**: Create Page A demonstrating two-column layout with filter panel (4 cols) and data table (12 cols)

**Independent Test**: Load `page-filter-table.html` in browser at desktop viewport; verify left panel occupies 4 grid
columns, right table occupies 12 columns; resize to mobile and verify vertical stacking; inspect DOM to confirm grid
classes on content containers.

### Implementation for User Story 1

- [x] T007 [P] [US1] Create HTML structure in `specs/001-grid-layout-showcase/demo/page-filter-table.html` with: header,
      skip-to-content, main landmark, grid container
- [x] T008 [P] [US1] Create JS module `specs/001-grid-layout-showcase/demo/page-filter-table.js` importing styles first,
      then skip-to-content and data-table components
- [x] T009 [US1] Add filter panel markup in `page-filter-table.html` with class
      `filter-panel cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-4`
- [x] T010 [US1] Add 5 sample filter controls inside filter panel (checkboxes, dropdown placeholders, text input
      placeholders) using BEM class `.filter-panel__control`
- [x] T011 [US1] Add data table markup in `page-filter-table.html` using `<cds-table>` component with class
      `cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-12`
- [x] T012 [US1] Add 10 sample table rows in `page-filter-table.html` using `<cds-table-row>` and `<cds-table-cell>`
      (static content: ID, Name, Status, Date columns)
- [x] T013 [US1] Add filter panel styles in `demo-style.scss`: `.filter-panel` block with padding, background-color
      using `$layer-01`, `.filter-panel__heading` using `type-style('heading-compact-02')`, `.filter-panel__control`
      with spacing
- [x] T014 [US1] Run linters and fix issues: `pnpm run lint:style`, `pnpm run lint:es`, `pnpm run lint:format`,
      `pnpm     run lint:spell`
- [x] T015 [US1] Manual validation: Test responsive behavior at sm/md/lg breakpoints; verify grid column spans; check
      skip-to-content functionality

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Page A loads and
demonstrates proper grid layout with filter + table.

---

## Phase 4: User Story 2 - UI Shell with fixed side navigation (Priority: P2)

**Goal**: Create Page B demonstrating UI Shell pattern with side navigation (3 cols) and content area (13 cols)

**Independent Test**: Load `page-shell-side-nav.html` in browser at desktop viewport; verify side navigation occupies 3
grid columns and is fixed, content area occupies 13 columns; resize to mobile and verify navigation behavior; inspect
DOM for grid classes and UI Shell component usage.

### Implementation for User Story 2

- [x] T016 [P] [US2] Create HTML structure in `specs/001-grid-layout-showcase/demo/page-shell-side-nav.html` with:
      header with UI Shell, skip-to-content, main landmark, grid container
- [x] T017 [P] [US2] Create JS module `specs/001-grid-layout-showcase/demo/page-shell-side-nav.js` importing styles
      first, then UI Shell index and skip-to-content
- [x] T018 [US2] Add `<cds-side-nav>` component in `page-shell-side-nav.html` with wrapper class
      `side-nav-wrapper cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-3`
- [x] T019 [US2] Add 4-6 sample navigation items using `<cds-side-nav-link>` with placeholder hrefs (e.g., "#dashboard",
      "#reports", "#settings")
- [x] T020 [US2] Add content area markup in `page-shell-side-nav.html` with class
      `content-area cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-13`
- [x] T021 [US2] Add 4 content sections inside content area using class `.content-section` with headings and paragraph
      text
- [x] T022 [US2] Add content area styles in `demo-style.scss`: `.content-area` with padding and spacing,
      `.content-section` with margin and typography styles
- [x] T023 [US2] Add inline HTML comments in `page-shell-side-nav.html` pointing out: UI Shell import pattern, grid
      column allocation (3+13), fixed navigation behavior
- [x] T024 [US2] Run linters and fix issues: `pnpm run lint:style`, `pnpm run lint:es`, `pnpm run lint:format`,
      `pnpm run lint:spell`
- [x] T025 [US2] Manual validation: Test responsive behavior; verify side nav fixed positioning; check grid column
      spans; validate UI Shell integration

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Page B demonstrates UI Shell + grid
integration.

---

## Phase 5: User Story 3 - Single-column landing-like layout (Priority: P3)

**Goal**: Create Page C demonstrating single-column layout with full-width content sections and template pattern

**Independent Test**: Load `page-single-column.html` in browser at all viewports; verify content sections span full grid
width; check subgrid usage; inspect DOM for template placement after `</body>` tag; verify BEM naming and responsive
flow.

### Implementation for User Story 3

- [x] T026 [P] [US3] Create HTML structure in `specs/001-grid-layout-showcase/demo/page-single-column.html` with:
      header, skip-to-content, main landmark, grid container
- [x] T027 [P] [US3] Create JS module `specs/001-grid-layout-showcase/demo/page-single-column.js` importing styles
      first, then skip-to-content component
- [x] T028 [US3] Add 4 content sections in `page-single-column.html` with class
      `content-section cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-16` (full-width)
- [x] T029 [US3] Add subgrid example in one content section: `<div class="cds--subgrid cds--subgrid--full-wide">` with
      nested content
- [x] T030 [US3] Add `<template id="template--content-section">` after `</body>` tag demonstrating the template
      placement pattern (optional demonstration, not functional requirement)
- [x] T031 [US3] Add placeholder images in content sections with explicit `width` and `height` attributes (e.g.,
      `<img src="/placeholder.svg" alt="Demo" width="400" height="300" />`)
- [x] T032 [US3] Add single-column layout styles in `demo-style.scss`: responsive typography rhythm, vertical spacing
      using `$spacing-*` tokens
- [x] T033 [US3] Add inline HTML comments in `page-single-column.html` pointing out: full-width column spans, subgrid
      usage, template placement, BEM naming
- [x] T034 [US3] Run linters and fix issues: `pnpm run lint:style`, `pnpm run lint:es`, `pnpm run lint:format`,
      `pnpm run lint:spell`
- [x] T035 [US3] Manual validation: Test responsive flow; verify full-width spans; check subgrid behavior; validate
      template placement; ensure images have dimensions

**Checkpoint**: All user stories should now be independently functional. All three pages demonstrate different grid
patterns.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final documentation

- [x] T036 [P] Verify all pages pass accessibility checks: skip-to-content links work, main landmarks present,
      aria-labels correct
- [x] T037 [P] Verify all images across all pages have width/height attributes (constitution requirement)
- [x] T038 [P] Review and ensure consistent BEM naming across all custom classes in all pages
- [x] T039 [P] Add HTML comments across all pages documenting grid class placement rules and constitution compliance
- [x] T040 Cross-browser testing: Verify all pages in Chrome, Firefox, Safari, Edge (latest 2 versions)
- [x] T041 Performance check: Verify all pages load in <500ms (no JavaScript interactivity should keep them fast)
- [x] T042 [P] Update `README.md` with final handoff notes: exact file paths, key learning points, common patterns to
      avoid
- [x] T043 Run final lint check on all files:
      `pnpm run lint:style && pnpm run lint:es && pnpm run lint:format && pnpm run lint:spell`
- [x] T044 Run `quickstart.md` validation: Follow quickstart steps to ensure they work for a new developer

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3, 4, 5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories

**Key Point**: All three user stories are fully independent and can be implemented in parallel once the Foundational
phase completes.

### Within Each User Story

- HTML structure before JS module creation (HTML defines what to import)
- JS module before component usage in HTML (imports must be defined)
- Markup before styling (styles target markup)
- Implementation before linting (lint after code is written)
- Linting before manual validation (automated checks first, then manual)

### Parallel Opportunities

- All Setup tasks (T001-T003) can run in parallel
- All Foundational tasks marked [P] (T005-T006) can run in parallel after T004
- Once Foundational completes, all user stories can start in parallel (if team capacity allows)
- Within User Story 1: T007-T008 can run in parallel, T009-T012 can run in parallel after HTML structure exists
- Within User Story 2: T016-T017 can run in parallel, T018-T021 can run in parallel after HTML structure exists
- Within User Story 3: T026-T027 can run in parallel, T028-T031 can run in parallel after HTML structure exists
- All Polish tasks marked [P] (T036-T039, T042) can run in parallel

---

## Parallel Example: User Story 1 (Page A)

```bash
# After Foundational phase completes:

# Launch HTML and JS file creation together:
Task T007: "Create HTML structure in page-filter-table.html"
Task T008: "Create JS module page-filter-table.js"

# After HTML structure exists, add markup in parallel:
Task T009: "Add filter panel markup"
Task T010: "Add filter controls"
Task T011: "Add data table markup"
Task T012: "Add table rows"

# Styles can be added independently:
Task T013: "Add filter panel styles in demo-style.scss"

# Sequential completion:
Task T014: "Run linters"
Task T015: "Manual validation"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Page A)
4. **STOP and VALIDATE**: Test Page A independently
5. Deploy/demo if ready (single-page demonstration)

This delivers a working filter + table grid demonstration that can be handed off immediately.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo Page A (MVP!)
3. Add User Story 2 → Test independently → Demo Page B
4. Add User Story 3 → Test independently → Demo Page C
5. Polish phase → Final handoff
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Page A - Filter + Table)
   - Developer B: User Story 2 (Page B - UI Shell + Nav)
   - Developer C: User Story 3 (Page C - Single Column)
3. Stories complete and integrate independently
4. Team collaborates on Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability (US1, US2, US3)
- Each user story should be independently completable and testable
- No automated tests required - manual visual inspection and DOM audit sufficient for static demo pages
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All pages use existing Carbon packages only - no new dependencies
- Grid classes MUST be on content containers (no wrapper divs) - constitution requirement
- Images MUST have width/height attributes - constitution requirement
- Import order: styles first, then components - constitution requirement

---

## Task Summary

- **Total Tasks**: 44
- **Setup Tasks**: 3
- **Foundational Tasks**: 3
- **User Story 1 Tasks**: 9 (T007-T015)
- **User Story 2 Tasks**: 10 (T016-T025)
- **User Story 3 Tasks**: 10 (T026-T035)
- **Polish Tasks**: 9 (T036-T044)
- **Parallel Opportunities**: 21 tasks can run in parallel within their phase
- **Independent Stories**: All 3 user stories are fully independent
