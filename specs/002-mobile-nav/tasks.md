# Tasks: Mobile Navigation Menu Button

**Input**: Design documents from `/specs/002-mobile-nav/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md  
**Branch**: `002-mobile-nav`  
**Feature**: Mobile-responsive navigation menu button for Carbon Web Components demo

**Tests**: Not requested in specification - manual testing only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Repository root: `c:\Users\michael.tyrrell\carbon-tutorial-web-components\`
- Demo files: `demo/` (page-shell-side-nav.html, page-shell-side-nav.js, demo-style.scss)
- Public assets: `public/` (optional icon files)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify development environment and dependencies

- [x] T001 Verify feature branch `002-mobile-nav` is checked out and up to date
- [x] T002 Verify `@carbon/icons@^11.52.0` is installed in package.json dependencies
- [x] T003 Verify dev server runs successfully with `pnpm run dev`
- [x] T004 Verify existing demo page `demo/page-shell-side-nav.html` loads at localhost

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core styling infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Add mobile navigation SCSS variables and mixins to `demo/demo-style.scss` (breakpoint mixins, z-index layers
      from Carbon tokens)
- [x] T006 Add backdrop base styles to `demo/demo-style.scss` using Carbon `$overlay` token and Carbon layer tokens for
      z-index
- [x] T007 Add mobile menu button base styles to `demo/demo-style.scss` (positioning with Carbon spacing tokens, display
      logic for breakpoints)
- [x] T008 Import Carbon icons (`Menu`, `Close`) at top of `demo/page-shell-side-nav.js` from `@carbon/icons/es/menu/20`
      and `@carbon/icons/es/close/20`
- [x] T009 Import Carbon button component in `demo/page-shell-side-nav.js` with
      `import '@carbon/web-components/es/components/button/index'`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel ✅

---

## Phase 3: User Story 1 - Access Navigation on Mobile Devices (Priority: P1) 🎯 MVP

**Goal**: Enable mobile users (viewport <672px) to access the side navigation menu via a toggle button that shows/hides
the navigation panel

**Independent Test**: Load demo page on mobile viewport (375px width), verify menu button appears in top-left corner,
click button to open navigation, verify navigation slides in and is accessible, click button again to close navigation

### Implementation for User Story 1

- [x] T010 [US1] Add mobile menu button element to `demo/page-shell-side-nav.html` inside `<main>` tag with `cds-button`
      component (kind="ghost", size="lg", aria-label, aria-expanded="false", aria-controls="mobile-side-nav")
- [x] T011 [US1] Add backdrop element to `demo/page-shell-side-nav.html` as sibling to `<main>` with class
      `.mobile-nav-backdrop`
- [x] T012 [US1] Add unique ID `id="mobile-side-nav"` to existing `cds-side-nav` element in
      `demo/page-shell-side-nav.html`
- [x] T013 [US1] Implement navigation state variable and initialization in `demo/page-shell-side-nav.js` (let
      isMobileNavOpen = false)
- [x] T014 [US1] Implement `openMobileNav()` function in `demo/page-shell-side-nav.js` (add `.mobile-nav--open` class to
      side nav, show backdrop, lock body scroll, update button aria-expanded, change icon to Close, move focus to first
      nav item)
- [x] T015 [US1] Implement `closeMobileNav()` function in `demo/page-shell-side-nav.js` (remove `.mobile-nav--open`
      class, hide backdrop, unlock body scroll, update button aria-expanded, change icon to Menu, return focus to
      button)
- [x] T016 [US1] Implement `toggleMobileNav()` function in `demo/page-shell-side-nav.js` (check current state, call open
      or close function, update state variable)
- [x] T017 [US1] Verify animation state handling in `demo/page-shell-side-nav.js` to prevent rapid toggle issues (ensure
      animations complete or are interrupted gracefully)
- [x] T018 [US1] Add button click event listener in `demo/page-shell-side-nav.js` that calls `toggleMobileNav()`
- [x] T019 [US1] Add backdrop click event listener in `demo/page-shell-side-nav.js` that calls `closeMobileNav()`
- [x] T020 [US1] Add mobile-specific side nav styles to `demo/demo-style.scss` (position fixed, transform for slide
      animation using Carbon `$duration-moderate-02`, z-index using Carbon `$layer-03`, hidden by default at mobile
      breakpoint)
- [x] T021 [US1] Add `.mobile-nav--open` class styles to `demo/demo-style.scss` (translateX transform to slide in
      navigation)
- [x] T022 [US1] Add `.mobile-nav-backdrop--visible` class styles to `demo/demo-style.scss` (display block)
- [x] T023 [US1] Add mobile menu button positioning styles to `demo/demo-style.scss` (position absolute, top-left corner
      using Carbon spacing tokens, visible only at sm/md breakpoints)
- [x] T024 [US1] Add navigation link click handlers in `demo/page-shell-side-nav.js` to close navigation on mobile after
      link selection
- [ ] T025 [US1] Test mobile navigation on viewport <672px: button appears, click opens navigation, navigation slides
      in, click button or backdrop closes navigation
- [x] T026 [US1] Run `pnpm run lint:style && pnpm run lint:es` to verify code quality

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - mobile users can
access navigation via button toggle

---

## Phase 4: User Story 2 - Seamless Responsive Behavior (Priority: P2)

**Goal**: Enable smooth transitions between mobile (menu button) and desktop (always-visible) navigation modes when
viewport size changes

**Independent Test**: Load demo page at desktop width (1200px), resize to mobile width (375px), verify button appears
and navigation behavior changes; open navigation on mobile, resize to desktop, verify navigation stays visible and
button disappears

### Implementation for User Story 2

- [x] T027 [US2] Implement window resize listener in `demo/page-shell-side-nav.js` that detects breakpoint changes
- [x] T028 [US2] Implement `handleBreakpointChange()` function in `demo/page-shell-side-nav.js` (check if viewport
      crosses 1056px threshold, auto-close navigation if resizing from mobile to desktop while nav is open, clean up
      mobile-specific styles)
- [x] T029 [US2] Add desktop-specific side nav styles to `demo/demo-style.scss` (static positioning at lg breakpoint,
      always visible, no transform)
- [x] T030 [US2] Add responsive display styles for menu button in `demo/demo-style.scss` (display none at lg breakpoint
      using `@include breakpoint-up('lg')`)
- [ ] T031 [US2] Test responsive behavior: resize from desktop to mobile and verify button appears, resize from mobile
      (with nav open) to desktop and verify nav stays visible and button disappears
- [x] T032 [US2] Run `pnpm run lint:style && pnpm run lint:es` to verify code quality

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - navigation adapts seamlessly to
viewport changes

---

## Phase 5: User Story 3 - Accessible Navigation Control (Priority: P2)

**Goal**: Enable keyboard and screen reader users to access mobile navigation through accessible controls that meet WCAG
standards

**Independent Test**: Load demo page on mobile viewport, navigate using only keyboard (Tab to button, Enter to open, Tab
through nav items, Escape to close), verify all interactions work; test with screen reader and verify announcements are
correct

### Implementation for User Story 3

- [x] T033 [P] [US3] Implement Escape key handler in `demo/page-shell-side-nav.js` that closes navigation when pressed
- [x] T034 [P] [US3] Add `prefers-reduced-motion` media query styles to `demo/demo-style.scss` (disable transitions for
      users with motion sensitivity, instant show/hide)
- [x] T035 [US3] Implement focus trap logic in `openMobileNav()` function in `demo/page-shell-side-nav.js` (add keydown
      listener for Tab key, keep focus within navigation when open)
- [x] T036 [US3] Update `closeMobileNav()` function in `demo/page-shell-side-nav.js` to remove focus trap listeners
- [ ] T037 [US3] Test keyboard navigation: Tab to button, Enter opens navigation and moves focus to first nav item, Tab
      through nav items stays within navigation, Escape closes and returns focus to button
- [ ] T038 [US3] Test with screen reader (NVDA): verify button announces "Open navigation menu, button, collapsed",
      opening announces "expanded", closing announces "collapsed"
- [ ] T039 [US3] Test reduced motion: enable Windows accessibility setting, verify navigation shows/hides instantly
      without animation
- [x] T040 [US3] Run `pnpm run lint:style && pnpm run lint:es` to verify code quality

**Checkpoint**: All user stories should now be independently functional - navigation is fully accessible to keyboard and
screen reader users

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [x] T041 Add code comments to `demo/page-shell-side-nav.js` documenting state management and event handler logic
- [x] T042 Add inline comments to `demo/demo-style.scss` documenting Carbon token usage and BEM class structure
- [ ] T043 Test all three close methods (button click, backdrop click, Escape key) on multiple mobile viewport sizes
      (375px, 428px, 768px)
- [ ] T044 Test desktop view (≥1056px) to verify button is hidden and navigation is always visible
- [ ] T045 Test animation performance in DevTools: verify 60fps during slide animation, verify ~240ms duration matches
      Carbon token
- [ ] T046 Test theme compatibility: verify navigation works correctly in both white and g100 themes
- [ ] T047 Verify body scroll lock: open navigation on mobile, attempt to scroll page content, verify scrolling is
      prevented
- [ ] T048 Verify navigation panel independent scroll: open navigation with long nav list, verify navigation itself can
      scroll while body is locked
- [x] T049 Run full linting suite:
      `pnpm run lint:style && pnpm run lint:es && pnpm run lint:format && pnpm run lint:spell`
- [ ] T050 Run through quickstart.md testing checklist to validate all acceptance criteria
- [ ] T051 Commit changes with descriptive message following project conventions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1): MUST complete first - provides base functionality
  - User Story 2 (P2): Depends on User Story 1 completion (extends responsive behavior)
  - User Story 3 (P2): Depends on User Story 1 completion (adds accessibility to base functionality)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - FOUNDATIONAL FOR
  OTHER STORIES
- **User Story 2 (P2)**: Depends on User Story 1 completion (extends mobile navigation with responsive behavior)
- **User Story 3 (P2)**: Depends on User Story 1 completion (adds accessibility features to existing navigation)

### Within Each User Story

**User Story 1**:

- HTML elements (T010, T011, T012) can run in parallel
- State and functions (T013-T016) must be sequential
- Animation state handling (T017) depends on toggle function (T016)
- Event listeners (T018, T019) depend on functions being complete
- Styles (T020-T023) can run in parallel with JavaScript implementation
- Testing (T025, T026) must be last

**User Story 2**:

- JavaScript (T027, T028) and SCSS (T029, T030) can run in parallel
- Testing (T031, T032) must be last

**User Story 3**:

- Escape handler (T033) and reduced motion styles (T034) can run in parallel [P]
- Focus trap logic (T035, T036) must be sequential
- Testing (T037, T038, T039, T040) must be last

### Parallel Opportunities

- Phase 1: All tasks can run in sequence (verification tasks)
- Phase 2: Tasks T005-T007 (SCSS) can run in parallel, Tasks T008-T009 (JS imports) can run in parallel
- User Story 1: HTML elements (T010-T012) in parallel, styles (T019-T022) in parallel
- User Story 2: JavaScript (T026-T027) parallel with SCSS (T028-T029)
- User Story 3: T032 and T033 can run in parallel [P]
- Phase 6: Visual testing tasks (T043-T048) can run in parallel after code is complete

---

## Parallel Example: User Story 1 HTML Elements

```bash
# Launch all HTML element additions for User Story 1 together:
Task: "Add mobile menu button element to demo/page-shell-side-nav.html"
Task: "Add backdrop element to demo/page-shell-side-nav.html"
Task: "Add unique ID to existing cds-side-nav element in demo/page-shell-side-nav.html"
```

## Parallel Example: User Story 1 SCSS Styles

```bash
# Launch all SCSS style additions for User Story 1 together:
Task: "Add mobile-specific side nav styles to demo/demo-style.scss"
Task: "Add .mobile-nav--open class styles to demo/demo-style.scss"
Task: "Add .mobile-nav-backdrop--visible class styles to demo/demo-style.scss"
Task: "Add mobile menu button positioning styles to demo/demo-style.scss"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify environment)
2. Complete Phase 2: Foundational (CRITICAL - SCSS foundation and imports)
3. Complete Phase 3: User Story 1 (core mobile navigation functionality)
4. **STOP and VALIDATE**: Test User Story 1 independently using quickstart.md
5. Deploy/demo if ready - mobile users can now access navigation

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **MVP READY** (mobile navigation works)
3. Add User Story 2 → Test independently → Responsive behavior added
4. Add User Story 3 → Test independently → Full accessibility compliance
5. Polish phase → Production ready

### Sequential Team Strategy (Single Developer)

1. Complete Setup + Foundational (T001-T009)
2. Implement User Story 1 (T010-T025) - Core functionality
3. Implement User Story 2 (T026-T031) - Responsive enhancements
4. Implement User Story 3 (T032-T040) - Accessibility features
5. Polish and validate (T041-T051)

### Parallel Team Strategy (Multiple Developers)

Not recommended for this feature due to:

- Single HTML file (page-shell-side-nav.html) - merge conflicts likely
- Single JS file (page-shell-side-nav.js) - merge conflicts likely
- Single SCSS file (demo-style.scss) - merge conflicts likely
- Small feature scope - parallel work overhead exceeds benefits

**Recommended**: Single developer, sequential implementation by user story priority

---

## Notes

- [P] tasks = different file sections, minimal dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability (US1, US2, US3)
- Each user story should be independently completable and testable
- No automated tests - manual testing per quickstart.md
- Commit after completing each user story phase
- Stop at each checkpoint to validate story independently per quickstart.md
- All Carbon token usage will be validated by stylelint (pnpm run lint:style)
- All ARIA attributes will be validated by accessibility linters
- Focus on completing User Story 1 first - it provides immediate value and unblocks mobile users

---

## Task Count Summary

- **Total Tasks**: 51
- **Setup Phase**: 4 tasks
- **Foundational Phase**: 5 tasks (BLOCKING)
- **User Story 1 (P1)**: 17 tasks (MVP - core functionality, includes rapid toggle handling)
- **User Story 2 (P2)**: 6 tasks (responsive enhancements)
- **User Story 3 (P2)**: 8 tasks (accessibility features)
- **Polish Phase**: 11 tasks (validation and cleanup)

**Parallel Opportunities Identified**: 12 tasks marked [P] across all phases

**Suggested MVP Scope**: Complete through User Story 1 (Phase 3) - Provides core mobile navigation functionality

**Independent Test Criteria**:

- User Story 1: Mobile users can open/close navigation via button toggle
- User Story 2: Navigation adapts correctly when viewport size changes
- User Story 3: All navigation functions accessible via keyboard and screen reader
