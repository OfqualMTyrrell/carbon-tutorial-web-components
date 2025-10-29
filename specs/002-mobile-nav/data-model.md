# Data Model

**Feature**: Mobile Navigation Menu Button  
**Date**: 2025-10-29

## State Model

This feature has minimal state complexity - a single boolean toggle.

### Navigation State

```javascript
// Single boolean state managed in JavaScript module scope
let isMobileNavOpen = false;
```

**State Transitions**:

```
[Closed] --button click--> [Open]
[Open] --button click--> [Closed]
[Open] --backdrop click--> [Closed]
[Open] --Escape key--> [Closed]
[Open] --breakpoint resize to lg--> [Closed] (automatic cleanup)
```

### DOM State Representation

The state is reflected in the DOM through classes and ARIA attributes:

**Button Element**:

```html
<!-- Closed state -->
<cds-button class="mobile-nav-toggle" aria-expanded="false" aria-controls="mobile-side-nav">
  <!-- menu icon -->
</cds-button>

<!-- Open state -->
<cds-button class="mobile-nav-toggle" aria-expanded="true" aria-controls="mobile-side-nav">
  <!-- close icon -->
</cds-button>
```

**Side Nav Element**:

```html
<!-- Closed state -->
<cds-side-nav id="mobile-side-nav" expanded></cds-side-nav>

<!-- Open state -->
<cds-side-nav id="mobile-side-nav" expanded class="mobile-nav--open"></cds-side-nav>
```

**Backdrop Element**:

```html
<!-- Closed state -->
<div class="mobile-nav-backdrop"></div>

<!-- Open state -->
<div class="mobile-nav-backdrop mobile-nav-backdrop--visible"></div>
```

**Body Element**:

```html
<!-- Closed state -->
<body></body>

<!-- Open state -->
<body style="overflow: hidden;"></body>
```

## Component Structure

### Element Hierarchy

```
<body>
  └── cds-side-nav#mobile-side-nav (existing)
      └── [existing nav items]

  └── main (existing)
      └── cds-button.mobile-nav-toggle (NEW)
          └── svg[slot="icon"]

  └── div.mobile-nav-backdrop (NEW)
</body>
```

**Notes**:

- Button placement: Inside `<main>` tag, positioned absolute in top-left corner
- Backdrop: Sibling to main/side-nav, positioned fixed full-screen
- Side nav: Existing element, enhanced with mobile-specific CSS classes

### No Data Persistence

This feature requires NO:

- localStorage/sessionStorage (state resets on page navigation)
- API calls (client-side only)
- Form data (no user input beyond clicks)
- URL state (no routing changes)

Navigation state is ephemeral and resets to closed on every page load/refresh.

## Type Definitions (Conceptual)

For documentation purposes (JavaScript implementation, no TypeScript):

```typescript
// Navigation state
type NavigationState = 'open' | 'closed';

// Event handlers
type NavigationHandler = () => void;

// Configuration (all from Carbon tokens, no user config)
interface NavigationConfig {
  breakpoint: '1056px'; // Carbon lg breakpoint
  animationDuration: '240ms'; // $duration-moderate-02
  zIndex: number; // $layer-03
}
```

## Validation Rules

**State Consistency Rules**:

1. If `isMobileNavOpen === true`, then:
   - Body overflow must be 'hidden'
   - Side nav must have `.mobile-nav--open` class
   - Button must have `aria-expanded="true"`
   - Backdrop must have `.mobile-nav-backdrop--visible` class
   - Focus must be within side nav (or button)

2. If `isMobileNavOpen === false`, then:
   - Body overflow must be '' (cleared)
   - Side nav must NOT have `.mobile-nav--open` class
   - Button must have `aria-expanded="false"`
   - Backdrop must NOT have `.mobile-nav-backdrop--visible` class

3. On window resize to ≥1056px:
   - Auto-close navigation (call close handler)
   - Clean up all open-state classes/styles
   - Remove event listeners

**ARIA Attribute Synchronization**:

- Button `aria-expanded` must always match `isMobileNavOpen` state
- Button `aria-controls` must reference side nav ID
- Side nav must have unique ID for `aria-controls` reference

## Summary

This is a stateless UI feature with a single boolean toggle. No data persistence, no API integration, no complex state
management. All state changes are immediate and synchronous. The implementation uses standard DOM manipulation and CSS
classes to reflect state changes visually and accessibly.

**Next**: Generate quickstart.md for developer setup instructions.
