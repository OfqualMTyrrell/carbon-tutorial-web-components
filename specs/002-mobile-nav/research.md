# Phase 0: Research & Technical Decisions

**Feature**: Mobile Navigation Menu Button  
**Date**: 2025-10-29

## Research Questions

### 1. Carbon Button Component Selection for Menu Toggle

**Decision**: Use `cds-button` with `kind="ghost"` and `size="lg"` for the mobile menu toggle button.

**Rationale**:

- Ghost button provides minimal visual weight, appropriate for an always-visible UI control
- Large size ensures touch target accessibility (44x44px minimum)
- Carbon button includes built-in accessibility (focus styles, keyboard support)
- Supports icon-only variant with proper ARIA labeling

**Alternatives Considered**:

- **Icon button component**: Carbon has `cds-icon-button` but `cds-button` with icon slot is more flexible
- **Custom button element**: Rejected - violates Framework-First principle
- **Header menu button**: Carbon UI Shell has header menu button, but spec requires button NOT in header

**Implementation Pattern**:

```html
<cds-button
  kind="ghost"
  size="lg"
  aria-label="Open navigation menu"
  aria-expanded="false"
  aria-controls="mobile-side-nav">
  <svg slot="icon"><!-- menu icon --></svg>
</cds-button>
```

### 2. Carbon Side Navigation Overlay Mode

**Decision**: Use existing `cds-side-nav` component with CSS-based overlay positioning and JavaScript state management.

**Rationale**:

- Carbon side nav supports overlay mode through CSS positioning (position: fixed, transform for slide animation)
- No need for custom component - use standard web API JavaScript to toggle classes
- Maintains Carbon component semantics and accessibility features
- Slide-in animation achieved with Carbon motion tokens and CSS transitions

**Alternatives Considered**:

- **Carbon Modal component**: Not semantic for navigation, modals are for dialogs
- **Custom overlay component**: Rejected - violates Framework-First principle
- **Carbon Drawer component**: Not available in Carbon Web Components v2.17.0

**Implementation Pattern**:

```scss
cds-side-nav {
  // Desktop: static positioning (default)
  @include breakpoint-down('lg') {
    // Mobile: overlay mode
    position: fixed;
    inset-inline-start: -100%; // Hidden by default
    transition: transform $duration-moderate-02 motion(entrance, productive);
    z-index: $layer-03; // Carbon layer token

    &.mobile-nav--open {
      transform: translateX(100%); // Slide in
    }
  }
}
```

### 3. Body Scroll Lock Implementation

**Decision**: Use CSS `overflow: hidden` on body element when navigation is open, restored on close.

**Rationale**:

- Standard web pattern, no library needed
- Preserves scroll position (unlike JavaScript-based solutions that may jump)
- Works with Carbon's existing styling without conflicts
- Supports logical properties for RTL layouts

**Alternatives Considered**:

- **body-scroll-lock library**: Rejected - adds dependency, violates "no added dependencies" requirement
- **JavaScript-based scroll prevention**: More complex, potential conflicts with Carbon components
- **Backdrop pointer-events only**: Doesn't prevent keyboard scroll or touch gestures

**Implementation Pattern**:

```javascript
function toggleMobileNav(open) {
  const body = document.body;
  if (open) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = '';
  }
}
```

### 4. Backdrop/Overlay Implementation

**Decision**: Create backdrop element as sibling to side nav, styled with Carbon overlay tokens, dismissed on click.

**Rationale**:

- Provides visual separation between nav and page content
- Click target for dismissing navigation (standard mobile UX)
- Uses Carbon `$overlay` token for consistent theming
- BEM naming: `.mobile-nav-backdrop` (separate block from navigation)

**Alternatives Considered**:

- **CSS ::before pseudo-element**: Rejected - harder to manage z-index and click events
- **Carbon Layer component**: Not available as standalone component in Web Components
- **No backdrop**: Rejected - spec clarification confirmed backdrop click should close menu

**Implementation Pattern**:

```scss
.mobile-nav-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background-color: $overlay;
  z-index: calc($layer-03 - 1); // Below nav, above content

  @include breakpoint-down('lg') {
    &.mobile-nav-backdrop--visible {
      display: block;
    }
  }
}
```

### 5. Icon Strategy for Menu Button

**Decision**: Use Carbon Icons package (`@carbon/icons`) with SVG imports directly in the button's icon slot, ensuring
consistency with Carbon's design system.

**Rationale**:

- `@carbon/icons@^11.52.0` is already a project dependency (no new dependency added)
- Ensures design consistency using Carbon's official icon set
- Menu icon: `Menu` (hamburger icon) - standard mobile nav pattern
- Close icon: `Close` (X icon) - standard close/dismiss pattern
- Icons render inline with proper sizing (16px or 20px standard Carbon sizes)
- Automatically theme-aware through Carbon Web Components integration
- More maintainable than custom SVG files

**Alternatives Considered**:

- **CSS mask pattern with custom SVG files**: Works but requires maintaining custom SVG files when Carbon provides
  official icons
- **Inline SVG in HTML**: Creates maintenance burden, inconsistent with Carbon's icon design intentions
- **Icon web font**: Rejected - accessibility concerns, not Carbon's recommended approach

**Implementation Pattern**:

```javascript
// Import Carbon icons in JavaScript module
import Menu from '@carbon/icons/es/menu/20';
import Close from '@carbon/icons/es/close/20';

// Use in button icon slot
const button = document.querySelector('.mobile-nav-toggle');
const iconSlot = button.querySelector('[slot="icon"]');

// Toggle icon based on state
function updateButtonIcon(isOpen) {
  iconSlot.innerHTML = isOpen ? Close.content : Menu.content;
}
```

**Alternative: Direct SVG in HTML**:

```html
<cds-button kind="ghost" size="lg" aria-label="Open navigation menu">
  <svg slot="icon" width="20" height="20" viewBox="0 0 32 32">
    <!-- Menu icon path from @carbon/icons -->
    <path d="M4 6h24v2H4zm0 8h24v2H4zm0 8h24v2H4z" />
  </svg>
</cds-button>
```

### 6. Responsive Breakpoint Strategy

**Decision**: Show menu button at `sm` and `md` breakpoints (<1056px), hide at `lg` breakpoint (≥1056px).

**Rationale**:

- Matches Carbon's breakpoint system (sm: 0-671px, md: 672-1055px, lg: 1056px+)
- Aligns with spec requirement (<1056px)
- Desktop users see always-visible nav (no button needed)
- Mobile/tablet users see button to toggle nav

**Implementation Pattern**:

```scss
.mobile-nav-toggle {
  display: block;

  @include breakpoint-up('lg') {
    display: none; // Hide on desktop
  }
}
```

### 7. Focus Management Pattern

**Decision**: Implement focus trap when navigation is open, return focus to button on close, move focus to first nav
item on open.

**Rationale**:

- WCAG 2.1 requirement for modal-like overlays
- Prevents keyboard focus from leaving navigation when open
- Standard accessibility pattern for overlays
- Uses only standard DOM APIs (no focus-trap library)

**Alternatives Considered**:

- **focus-trap library**: Rejected - adds dependency
- **No focus management**: Rejected - fails accessibility requirements
- **Carbon's built-in focus management**: Side nav doesn't have built-in focus trap for overlay mode

**Implementation Pattern**:

```javascript
function openMobileNav() {
  const sideNav = document.querySelector('cds-side-nav');
  const firstNavLink = sideNav.querySelector('cds-side-nav-link');

  // Store current focus to return to
  navToggleButton.dataset.returnFocus = 'true';

  // Move focus to first nav item
  firstNavLink?.focus();

  // Add Escape key listener
  document.addEventListener('keydown', handleEscapeKey);
}

function closeMobileNav() {
  // Return focus to button
  if (navToggleButton.dataset.returnFocus) {
    navToggleButton.focus();
    delete navToggleButton.dataset.returnFocus;
  }

  // Remove Escape key listener
  document.removeEventListener('keydown', handleEscapeKey);
}
```

### 8. Animation Performance

**Decision**: Use CSS `transform` for slide animation (not `left`/`margin`), with Carbon motion tokens for duration.

**Rationale**:

- `transform` is GPU-accelerated, ensures 60fps animation
- Carbon motion tokens: `$duration-moderate-02` (240ms) for slide in/out
- Respects `prefers-reduced-motion` media query (instant transition)
- Logical property compatible (works with RTL)

**Implementation Pattern**:

```scss
@media (prefers-reduced-motion: reduce) {
  cds-side-nav {
    transition: none !important; // Instant transitions
  }
}

cds-side-nav {
  transition: transform $duration-moderate-02 motion(entrance, productive);

  &.mobile-nav--open {
    transform: translateX(100%);
  }
}
```

## Summary

All research questions resolved with pure Carbon Web Components solutions. No additional dependencies required.
Implementation will use:

- Standard Carbon button component (`cds-button`)
- Existing Carbon side nav component (`cds-side-nav`)
- **Carbon Icons package (`@carbon/icons`)** - already a project dependency
- Carbon design tokens for all styling
- Standard web APIs for JavaScript behavior
- Carbon motion tokens for animations
- BEM naming conventions for custom classes

**Next Phase**: Phase 1 - Data Model (minimal for this feature) and Quickstart documentation.
