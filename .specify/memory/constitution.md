<!--
Sync Impact Report

Version change: template → 1.0.0

Modified principles:
- PRINCIPLE_1_NAME (placeholder) → Framework-First, No Customization (NON-NEGOTIABLE)
- PRINCIPLE_2_NAME (placeholder) → Theme & Token Fidelity
- PRINCIPLE_3_NAME (placeholder) → Grid Integrity & BEM Alignment
- PRINCIPLE_4_NAME (placeholder) → Import Discipline & Code-Splitting
- PRINCIPLE_5_NAME (placeholder) → Accessibility, Linting & Quality Gates

Added sections:
- Additional Constraints
- Development Workflow & Quality Gates

Removed sections: none

Templates requiring updates:
- .specify/templates/plan-template.md — ✅ Constitution Check present and aligned
- .specify/templates/spec-template.md — ⚠ pending: ensure mandatory "Constitution" gating language for Carbon-only rules
- .specify/templates/tasks-template.md — ⚠ pending: recommend adding Carbon-specific foundational tasks (styles import, component imports)
- .specify/templates/checklist-template.md — ⚠ pending: adapt to include Carbon-specific checklist items (template placement, image dims, grid rules)
- .specify/templates/agent-file-template.md — ⚠ pending: optionally extract active technologies and enforce Carbon packages

Follow-up TODOs:
- None left in this file. If project maintainers want a different ratification date or semantic version bump, update the header and re-run the constitution amendment process.
-->

# Carbon Web Components Implementation Constitution

## Core Principles

### Framework-First, No Customization (NON-NEGOTIABLE)

All UI MUST be implemented using the official Carbon Design System Web Components (`@carbon/web-components`) and the
official Carbon styles (`@carbon/styles`). Custom components, visual overrides, or bespoke behaviour that replace or
alter the core semantics of Carbon components are PROHIBITED. The only permitted adjustments are:

- choosing an upstream Carbon theme class on the `body` (`white`, `g10`, `g90`, `g100`) or using the documented
  complimenting theme pattern; and
- adding presentational CSS modifiers that do not change component DOM or event contracts (only where a documented
  Carbon extension point exists).

Rationale: Preserving upstream component semantics ensures consistent accessibility, predictable behavior, and
compatibility with Carbon's future releases. This rule is strictly enforced: modifications that change element
contracts, slot names, event names, or expected attributes are disallowed.

### Theme & Token Fidelity

All styling MUST use Carbon design tokens and SCSS mixins from `@carbon/styles`. Hard-coded colors, spacing, font-sizes,
or ad-hoc tokens are NOT permitted. SCSS must import and apply Carbon theme mixins as the primary source of truth. When
theming is required, use the documented theme classes and the compliment pattern in the project's styles.

Rationale: Using Carbon tokens maintains visual parity across pages, enables automatic theme switching, and preserves
token-based accessibility guarantees (contrast, spacing rhythm, etc.).

### Grid Integrity & BEM Alignment

All grid, layout, and BEM conventions documented in the project MUST be followed. In particular:

- Grid classes (e.g., `cds--css-grid-column`, `cds--lg:col-span-N`) MUST be placed on the same element that contains the
  content (no extra wrapper elements). Extra wrapper elements that break grid placement are forbidden.
- Templates and component HTML MUST follow BEM naming conventions used in the repository (Block\_\_Element--Modifier)
  and avoid deeply nested utility classes that break slotting or shadow-DOM expectations.
- Images MUST include explicit `width` and `height` attributes to avoid layout shift.

Rationale: These rules enforce predictable layout, minimize CSS overrides, and avoid common mistakes that break
responsiveness and layout in Carbon.

### Import Discipline & Code‑Splitting

Module imports and style ordering are mandatory:

- Project-level styles (`style.scss`) MUST be imported first in every entry module.
- Import Carbon components on a per-page basis whenever possible (e.g., `landing.js`, `repos.js`), avoiding a single
  global bundle that loads unused components.
- Use the documented component index imports for groups only when the grouping is required (e.g., UI Shell index
  import). Keep data-table or heavy components in page-specific modules.
- HTML `<template>` elements used as cloning factories MUST be placed after the closing `</body>` tag and before
  `</html>` so they are out of the visible DOM but accessible to scripts.

Rationale: Proper import discipline reduces bundle sizes and preserves component initialization semantics. Template
location and import ordering prevent runtime initialization races and ensure styles cascade as expected.

### Accessibility, Linting & Quality Gates

Accessibility and automated quality checks are REQUIRED for all changes. The project enforces the following as mandatory
gates:

- Accessibility: All interactive components MUST include ARIA attributes and a visible focus style. Include
  skip-to-content in the header and meaningful `aria-label` values for global actions.
- Linting: SCSS/CSS, JS, and markdown MUST pass the configured linters (stylelint with Carbon token checks, ESLint,
  Prettier, and cspell). Style rules converting physical properties to logical properties MUST be used to preserve RTL
  compatibility.
- Testing: Integration or smoke tests that validate component rendering, grid placement, and critical accessibility
  assertions MUST be present for pages that introduce new component combinations (data tables, tabs, UI-shell
  integrations). Tests should be included alongside feature code (page-specific tests in a `tests/` folder or CI
  pipeline).

Rationale: These checks ensure that adherence to Carbon patterns is automated and enforced in CI, preventing regressions
caused by custom workarounds.

## Additional Constraints

- Required packages: `@carbon/web-components`, `@carbon/styles`, `sass`.
- Icon/pictogram usage: Place SVGs in `/public` and prefer CSS mask pattern for theming. Modifier classes MUST follow
  the documented pictogram naming form (e.g., `.info-card__pictogram--advocate`).
- Component import pattern: Styles first, then components. Use index imports only for logically grouped components (UI
  Shell), otherwise import specific components to keep bundles small.
- Templates: Place `<template id="template--...">` after `</body>`.
- Grid rules: Use `cds--sm:col-span-...`, `cds--md:col-span-...`, `cds--lg:col-span-...` on the content container
  element and include all breakpoints (mobile-first practices).
- BEM naming: Use `block__element--modifier`. Do not encode position into modifier names; prefer `:nth-of-type()` where
  necessary.

## Development Workflow & Quality Gates

- Pull Requests MUST include:
  - A checklist mapping changes to the Constitution principles (Framework‑First, Theme & Token Fidelity, Grid Integrity,
    Import Discipline, Accessibility).
  - Test artifacts (unit/integration/accessibility assertions) demonstrating compliance for any changed page or
    component.
  - Lint and format status (CI must pass `pnpm run lint` and `pnpm run format`).
- Test-First expectation for core integration: For any change that affects component composition, write tests that fail
  before implementation, then implement until tests pass.
- CI: Every push to protected branches MUST run linting, formatting, spell checks, and the project's test suite. Merges
  are blocked until pipelines succeed.

## Governance

All project contributors MUST follow this constitution. Amendments follow the procedure below:

1. Draft proposed amendment as a PR against `.specify/memory/constitution.md`.
2. Provide a short migration plan explaining the impact on templates, build/config, and consumer code. Include a
   semantic versioning rationale (MAJOR/MINOR/PATCH) in the PR description.
3. Obtain approval from at least one repository owner and one reviewer with experience in Carbon implementations (two
   approvals total).
4. Merge the PR and update the `Last Amended` date to the merge date.

Versioning policy (applies to constitution versions):

- MAJOR: Backward-incompatible governance changes (remove or rename non-negotiable principles).
- MINOR: New principle or materially expanded guidance.
- PATCH: Clarifications, wording fixes, or non-semantic refinements.

Compliance review expectations:

- The `Constitution Check` in `.specify/templates/plan-template.md` MUST be executed during Phase 0 research; the plan
  author must explicitly mark whether the planned work is compliant or requires an approved exception.
- Approved exceptions must be time-limited and documented with a migration plan to full compliance.

**Version**: 1.0.0 | **Ratified**: 2025-10-29 | **Last Amended**: 2025-10-29
