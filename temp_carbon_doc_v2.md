# Working with IBM Carbon Design System Web Components

This guide documents the patterns, practices, and conventions learned from implementing the IBM Carbon Design System Web Components Framework. This is intended to help developers and LLM agents understand how to work with Carbon Web Components as designed by IBM.

## Table of Contents
- [Overview](#overview)
- [Installation & Setup](#installation--setup)
- [Theme System](#theme-system)
- [UI Shell Architecture](#ui-shell-architecture)
- [Grid & Layout System](#grid--layout-system)
- [CSS Grid Deep Dive](#css-grid-deep-dive)
- [Design Tokens](#design-tokens)
- [Component Import Patterns](#component-import-patterns)
- [Web Component Slots](#web-component-slots)
- [Icon Integration](#icon-integration)
- [Event Handling](#event-handling)
- [Tabs Component Pattern](#tabs-component-pattern)
- [Data Table Component](#data-table-component)
- [HTML Templates Pattern](#html-templates-pattern)
- [Accessibility Patterns](#accessibility-patterns)
- [Best Practices](#best-practices)

---

## Overview

Carbon Web Components are standards-based custom elements that can be used in any modern browser with any JavaScript library or framework, or with no framework at all (Vanilla JS/HTML).

**Key Philosophy:**
- Web Components behave like native HTML elements
- No framework required (though they work with React, Vue, Angular, etc.)
- Direct DOM manipulation and event handling
- Progressive enhancement approach

---

## Installation & Setup

### Required Dependencies

```json
{
  "dependencies": {
    "@carbon/web-components": "^2.x",
    "@carbon/styles": "^1.x",
    "@carbon/icons": "^11.x",
    "sass": "^1.x"
  }
}
```

Install using:
```bash
pnpm add @carbon/web-components @carbon/styles sass
pnpm add @carbon/icons  # For icon support
```

### File Structure Convention

```
project/
├── index.html
├── main.js          # Component imports and JS logic
├── style.scss       # Carbon styles and custom styles
├── public/          # Static assets (SVG icons, etc.)
└── package.json
```

---

## Theme System

### Carbon Theme Architecture

Carbon uses SCSS mixins to apply themes. Themes control colors, spacing, and other design tokens.

#### Available Themes
- **white** - Pure white background
- **g10** (Light theme) - Light background
- **g90** (Gray 90) - Dark UI on light background
- **g100** (Gray 100/Dark theme) - Dark background

### Theme Implementation Pattern

```scss
@use '@carbon/styles/scss/theme' as *;
@use '@carbon/styles/scss/themes';

// Root level theming with system preference support
:root {
  @include theme(themes.$g10);

  @media (prefers-color-scheme: dark) {
    @include theme(themes.$g100);
  }
}
```

### Dynamic Theme Switching (JavaScript)

```javascript
const bodyEl = document.querySelector('body');

// Apply light theme
bodyEl.classList.remove('g100');
bodyEl.classList.add('g10');

// Apply dark theme
bodyEl.classList.remove('g10');
bodyEl.classList.add('g100');

// System theme (remove explicit theme classes)
bodyEl.classList.remove('g10', 'g100');
```

### Complementary Theming Pattern

Carbon supports "compliment" theming for UI elements that should contrast with the main theme (e.g., dark header on light page).

```scss
// Compliment theme reverses the theme
:root .compliment {
  @include theme(themes.$g100);

  @media (prefers-color-scheme: dark) {
    @include theme(themes.$g10);
  }
}

.g10 .compliment {
  @include theme(themes.$g100);
}

.g100 .compliment {
  @include theme(themes.$g10);
}
```

Usage in HTML:
```html
<cds-header class="compliment">
  <!-- Header will have opposite theme of body -->
</cds-header>
```

---

## UI Shell Architecture

The UI Shell is Carbon's standardized application frame consisting of header, navigation, and global actions.

### Core UI Shell Components

#### 1. Header Structure

```html
<header>
  <cds-header class="compliment">
    <!-- Skip to content MUST be first child -->
    <cds-skip-to-content href="#main-content"></cds-skip-to-content>
    
    <!-- Hamburger menu for responsive navigation -->
    <cds-header-menu-button
      button-label-active="Close menu"
      button-label-inactive="Open menu">
    </cds-header-menu-button>
    
    <!-- Brand/Product name -->
    <cds-header-name href="./" prefix="IBM">
      Product Name
    </cds-header-name>
    
    <!-- Desktop navigation -->
    <cds-header-nav menu-bar-label="Navigation Label">
      <cds-header-nav-item href="./page.html">
        Page Name
      </cds-header-nav-item>
    </cds-header-nav>
    
    <!-- Mobile navigation (appears in sidebar) -->
    <cds-side-nav
      is-not-persistent
      aria-label="Side navigation"
      collapse-mode="${SIDE_NAV_COLLAPSE_MODE.RESPONSIVE}">
      <cds-side-nav-items>
        <cds-side-nav-link href="./page.html">
          Page Name
        </cds-side-nav-link>
      </cds-side-nav-items>
    </cds-side-nav>
    
    <!-- Global actions and panels -->
    <div class="cds--header__global">
      <cds-header-global-action
        aria-label="Action Name"
        panel-id="panel-id">
        <div slot="icon"><!-- Icon content --></div>
      </cds-header-global-action>
    </div>
    
    <!-- Panels (slide-out from right) -->
    <cds-header-panel id="panel-id" aria-label="Panel Label">
      Panel content
    </cds-header-panel>
  </cds-header>
</header>

<main id="main-content">
  <!-- Main content -->
</main>
```

#### 2. Required JavaScript Import

```javascript
import '@carbon/web-components/es/components/ui-shell/index';
```

This single import provides:
- `cds-header`
- `cds-header-name`
- `cds-header-nav`
- `cds-header-nav-item`
- `cds-header-menu-button`
- `cds-side-nav`
- `cds-side-nav-items`
- `cds-side-nav-link`
- `cds-header-global-action`
- `cds-header-panel`

### Panel Management Pattern

Panels should close other panels when opened:

```javascript
const handleGlobalActionClick = (ev) => {
  const targetPanelId = ev.currentTarget.getAttribute('panel-id');
  const panels = document.querySelectorAll('cds-header-panel');
  
  // Close all other panels
  panels.forEach((panel) => {
    if (panel.id !== targetPanelId) {
      panel.expanded = false;
    }
  });
};

// Attach to all global actions
document.querySelectorAll('cds-header-global-action').forEach((action) => {
  action.addEventListener('click', handleGlobalActionClick);
});
```

---

## Grid & Layout System

### Carbon Spacing Tokens

Carbon provides spacing tokens through SCSS:

```scss
@use '@carbon/styles/scss/spacing' as *;

.container {
  padding: $spacing-05;  // 1rem / 16px
  gap: $spacing-05;
  margin-top: $spacing-09; // 3rem / 48px
}
```

### Common Spacing Scale
- `$spacing-01`: 0.125rem (2px)
- `$spacing-02`: 0.25rem (4px)
- `$spacing-03`: 0.5rem (8px)
- `$spacing-04`: 0.75rem (12px)
- `$spacing-05`: 1rem (16px)
- `$spacing-06`: 1.5rem (24px)
- `$spacing-07`: 2rem (32px)
- `$spacing-08`: 2.5rem (40px)
- `$spacing-09`: 3rem (48px)
- `$spacing-10`: 4rem (64px)

### Layout Pattern: Header + Main

```scss
.app {
  display: grid;
  grid-template-rows: $spacing-09 1fr;  // Header height + flexible content
  height: 100vh;
  overflow: hidden;  // Let main handle scrolling
}
```

This creates:
- Fixed header height (48px)
- Flexible content area
- Proper scroll behavior

---

## CSS Grid Deep Dive

Carbon's CSS Grid system is a 16-column grid implemented using native CSS Grid (not flexbox). **Important:** The Carbon grid does not exist as web components due to shadow DOM traversal difficulties.

### Grid Classes Hierarchy

```html
<!-- Root grid container -->
<div class="cds--css-grid cds--css-grid--full-width">
  
  <!-- Grid columns -->
  <div class="cds--css-grid-column cds--col-span-100">
    
    <!-- Subgrid (nested grid) -->
    <div class="cds--subgrid cds--subgrid--full-wide">
      
      <!-- Columns within subgrid -->
      <div class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-16">
        Content
      </div>
      
    </div>
  </div>
</div>
```

### Column Span System

Carbon uses a 16-column grid with responsive breakpoints:

**Breakpoint Classes:**
- `cds--sm:col-span-N` - Small screens (4-column grid)
- `cds--md:col-span-N` - Medium screens (8-column grid)
- `cds--lg:col-span-N` - Large screens (16-column grid)

**Column Starting Position:**
- `cds--lg:col-start-N` - Start at column N (1-16)

**Full-width Column:**
- `cds--col-span-100` - Spans 100% of grid (all columns)

### Grid Implementation Example

```html
<!-- Landing page with 3 rows -->
<div class="page page-landing cds--css-grid cds--css-grid--full-width">
  
  <!-- Row 1: Banner (full width) -->
  <div class="page-landing__banner cds--css-grid-column cds--col-span-100">
    <cds-breadcrumb>...</cds-breadcrumb>
    <h1>Title</h1>
  </div>
  
  <!-- Row 2: Content with subgrid -->
  <div class="page-landing__r2 cds--css-grid-column cds--col-span-100">
    <cds-tabs>...</cds-tabs>
    
    <div class="cds--subgrid cds--subgrid--full-wide">
      <!-- 7 columns on large screens, starts at column 1 -->
      <!-- CRITICAL: Grid column classes AND content classes on SAME div -->
      <div class="page-landing__tab-content cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-4 cds--lg:col-span-7">
        <h3 class="page-landing__subheading">What is Carbon?</h3>
        <p class="page-landing__p">Content text...</p>
        <cds-button>Learn more</cds-button>
      </div>
      
      <!-- 8 columns on large screens, starts at column 9 -->
      <div class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-4 cds--lg:col-span-8 cds--lg:col-start-9">
        <img class="page-landing__illo" src="./tab-illo.png" alt="Carbon illustration" width="640" height="498" />
      </div>
    </div>
  </div>
  
  <!-- Row 3: Principles with offset columns -->
  <div class="page-landing__r3 cds--css-grid-column cds--col-span-100">
    <div class="cds--subgrid cds--subgrid--full-wide">
      
      <!-- Label: 4 cols on lg, 2 cols on md -->
      <div class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-2 cds--lg:col-span-4">
        The principles
      </div>
      
      <!-- Title 1: starts at column 3 on md, column 5 on lg -->
      <div class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-6 cds--md:col-start-3 cds--lg:col-span-4 cds--lg:col-start-5">
        Carbon is open
      </div>
      
      <!-- Title 2: starts at column 3 on md, column 9 on lg -->
      <div class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-6 cds--md:col-start-3 cds--lg:col-span-4 cds--lg:col-start-9">
        Carbon is modular
      </div>
      
      <!-- Title 3: starts at column 3 on md, column 13 on lg -->
      <div class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-6 cds--md:col-start-3 cds--lg:col-span-4 cds--lg:col-start-13">
        Carbon is consistent
      </div>
      
    </div>
  </div>
</div>
```

### Grid Pattern Rules

1. **Grid column classes belong on content containers** - Do NOT create wrapper divs. Place `cds--css-grid-column` classes on the SAME element as your content wrapper classes (e.g., `page-landing__tab-content`). This is critical for proper grid layout.

2. **Subgrids inherit parent columns** - Use `cds--subgrid--full-wide` to span full width of parent column

3. **Always include image dimensions** - Specify `width` and `height` attributes on `<img>` tags for performance (prevents layout shift) and accessibility

4. **Column math** - On large screens: 7 cols + 8 cols = 15 cols (leaving 1 for gutter spacing)

5. **Mobile-first responsive** - Always specify all breakpoints: `sm:`, `md:`, and `lg:`

6. **Use canonical paths** - For root navigation, use `href="/"` not `href="./"`

### Common Grid Mistakes to Avoid

❌ **WRONG - Extra wrapper div:**
```html
<div class="cds--css-grid-column cds--lg:col-span-7">
  <div class="page-landing__tab-content">
    Content
  </div>
</div>
```

✅ **CORRECT - Classes on same element:**
```html
<div class="page-landing__tab-content cds--css-grid-column cds--lg:col-span-7">
  Content
</div>
```

❌ **WRONG - Missing image dimensions:**
```html
<img src="./image.png" alt="Description" />
```

✅ **CORRECT - Include width/height:**
```html
<img src="./image.png" alt="Description" width="640" height="498" />
```

### SCSS Grid Import

```scss
@use '@carbon/styles/scss/grid';
```

This single import enables all grid classes. No additional configuration needed.

---

## Tabs Component Pattern

Carbon Tabs use a target-based system to show/hide tab panels.

### Tab Structure

```html
<cds-tabs value="about" class="page-landing__tabs">
  <cds-tab id="tab-about" value="about" target="panel-about">About</cds-tab>
  <cds-tab id="tab-design" value="design" target="panel-design">Design</cds-tab>
  <cds-tab id="tab-develop" value="develop" target="panel-develop">Develop</cds-tab>
</cds-tabs>

<!-- Tab Panels -->
<div id="panel-about" role="tabpanel" aria-labelledby="tab-about">
  <div class="cds--subgrid cds--subgrid--full-wide">
    <!-- Panel content in grid columns -->
  </div>
</div>

<div id="panel-design" role="tabpanel" aria-labelledby="tab-design">
  <div class="cds--subgrid cds--subgrid--full-wide">
    <!-- Panel content in grid columns -->
  </div>
</div>

<div id="panel-develop" role="tabpanel" aria-labelledby="tab-develop">
  <div class="cds--subgrid cds--subgrid--full-wide">
    <!-- Panel content in grid columns -->
  </div>
</div>
```

### Tab Pattern Rules

1. **value attribute** - Set default active tab on `<cds-tabs value="about">`
2. **target attribute** - Each `<cds-tab>` targets a panel by ID
3. **Accessibility** - Use `role="tabpanel"` and `aria-labelledby` attributes
4. **Panel structure** - Each panel should contain a subgrid for layout consistency
5. **Import** - `import '@carbon/web-components/es/components/tabs/index';`

### Sticky Tab Pattern

```scss
.page-landing__tabs {
  position: sticky;
  top: $spacing-09;  // Height of header
  z-index: 1;
}
```

This keeps tabs visible when scrolling content.

---

## Data Table Component

Carbon provides an expandable data table for displaying tabular data.

### Basic Table Structure

```html
<cds-table expandable>
  <!-- Table header with title and description -->
  <cds-table-header-title slot="title">
    Carbon Repositories
  </cds-table-header-title>
  <cds-table-header-description slot="description">
    A collection of public Carbon repositories.
  </cds-table-header-description>
  
  <!-- Table header row -->
  <cds-table-head>
    <cds-table-header-row>
      <cds-table-header-cell>Name</cds-table-header-cell>
      <cds-table-header-cell>Created</cds-table-header-cell>
      <cds-table-header-cell>Updated</cds-table-header-cell>
      <cds-table-header-cell>Open Issues</cds-table-header-cell>
      <cds-table-header-cell>Stars</cds-table-header-cell>
      <cds-table-header-cell>Links</cds-table-header-cell>
    </cds-table-header-row>
  </cds-table-head>
  
  <!-- Table body (populated by JavaScript) -->
  <cds-table-body>
  </cds-table-body>
</cds-table>
```

### Table Import Pattern

Create a separate JavaScript file for table-specific code:

```javascript
// repos.js
import '@carbon/web-components/es/components/data-table/index.js';

// Data and population logic here
```

Include in HTML:
```html
<script type="module" src="/repos.js"></script>
```

**Why separate?** - Data tables are often page-specific, keeping logic separate improves maintainability.

### Expandable Rows

```html
<cds-table-row>
  <cds-table-cell>Cell content</cds-table-cell>
  <!-- More cells -->
</cds-table-row>
<cds-table-expanded-row>
  Expanded content shown when row is expanded
</cds-table-expanded-row>
```

Each `cds-table-row` can be followed by a `cds-table-expanded-row` for expandable content.

---

## HTML Templates Pattern

Carbon tables work seamlessly with native HTML `<template>` elements for dynamic content generation.

### Template Definition

```html
<!-- Define template outside the table -->
<template id="template--table-row">
  <cds-table-row>
    <cds-table-cell key="name">Placeholder</cds-table-cell>
    <cds-table-cell key="created">Placeholder</cds-table-cell>
    <cds-table-cell key="updated">Placeholder</cds-table-cell>
    <cds-table-cell key="openIssues">0</cds-table-cell>
    <cds-table-cell key="stars">0</cds-table-cell>
    <cds-table-cell key="links">Links</cds-table-cell>
  </cds-table-row>
  <cds-table-expanded-row key="description">
    Description
  </cds-table-expanded-row>
</template>
```

**Key Pattern:** Use `key` attributes to identify which cells should be populated from data.

### Template Cloning Logic

```javascript
// Data array
let data = [
  {
    name: 'Repo A',
    created: 'Date',
    updated: 'Date',
    openIssues: 123,
    stars: 456,
    links: 'Links',
    description: 'Repo description',
  },
  // More items...
];

// Clone and populate
const tableBody = document.querySelector('cds-table-body');
const template = document.querySelector('#template--table-row');

data.forEach((item) => {
  // Clone template content
  const clone = template.content.cloneNode(true);
  
  // Find all cells with key attributes
  const cells = clone.querySelectorAll('cds-table-cell, cds-table-expanded-row');
  
  // Populate cells based on key
  cells.forEach((cell) => {
    const key = cell.getAttribute('key');
    if (key) {
      cell.textContent = item[key];
    }
  });
  
  // Append to table body
  tableBody.appendChild(clone);
});
```

### Template Pattern Benefits

1. **Performance** - Clone DOM nodes instead of creating from scratch
2. **Maintainability** - Template structure lives in HTML, data in JavaScript
3. **Type Safety** - `key` attributes make data mapping explicit
4. **Reusability** - Same template can generate unlimited rows
5. **Standards-based** - Uses native HTML `<template>` element

### Template Location

Place templates **after** the closing `</body>` tag but **before** closing `</html>`:

```html
</body>

<template id="template--table-row">
  <!-- Template content -->
</template>

</html>
```

This keeps templates out of the visible DOM but accessible to JavaScript.

---

## Design Tokens

Carbon uses design tokens for consistent theming. Access tokens through SCSS variables.

### Color Tokens

```scss
@use '@carbon/styles/scss/theme' as *;

.element {
  color: $text-primary;           // Primary text color
  background-color: $background;  // Background color
  border-color: $border-subtle;   // Subtle border color
}
```

### Typography Tokens

```scss
@use '@carbon/styles/scss/type' as *;

.title {
  @include type-style('heading-compact-01');
}

.body-text {
  @include type-style('body-compact-01');
}
```

Common type styles:
- `heading-01` through `heading-07`
- `body-compact-01`, `body-compact-02`
- `label-01`, `label-02`
- `code-01`, `code-02`

---

## Component Import Patterns

### Individual Component Import

```javascript
// Import specific components
import '@carbon/web-components/es/components/button/button.js';
import '@carbon/web-components/es/components/checkbox/index';
import '@carbon/web-components/es/components/content-switcher/index';
```

### Index Imports for Component Groups

```javascript
// UI Shell (imports all shell components)
import '@carbon/web-components/es/components/ui-shell/index';
```

### Style Import (Always First)

```javascript
// Always import styles first
import './style.scss';
// Then component imports
import '@carbon/web-components/es/components/...';
```

---

## Web Component Slots

Carbon Web Components use named slots for flexible content placement.

### Slot Pattern

```html
<cds-component>
  <!-- Default slot (unnamed) -->
  <div>Default content</div>
  
  <!-- Named slot -->
  <div slot="icon">Icon content</div>
  <span slot="tooltip-content">Tooltip text</span>
</cds-component>
```

### Example: Global Action with Icon Slot

```html
<cds-header-global-action aria-label="Notifications" panel-id="notification-panel">
  <div class="action-icon" slot="icon"></div>
</cds-header-global-action>
```

The `slot="icon"` attribute targets the named slot for icons in the component.

---

## Icon Integration

### CSS Mask Pattern (Recommended)

Carbon recommends using CSS masks for SVG icons for themeable, scalable icons.

#### 1. Place SVG files in `/public` folder

```
public/
├── notification.svg
├── user--avatar.svg
└── switcher.svg
```

#### 2. Create Icon Styles

```scss
.action-icon {
  width: 1.25rem;
  height: 1.25rem;
  background-color: $text-primary;  // Uses theme token
}

.notification .action-icon {
  mask: url('/notification.svg') no-repeat center;
}

.user-avatar .action-icon {
  mask: url('/user--avatar.svg') no-repeat center;
}
```

#### 3. Use in HTML

```html
<cds-header-global-action class="notification" aria-label="Notifications">
  <div class="action-icon" slot="icon"></div>
</cds-header-global-action>
```

**Benefits:**
- Icons automatically match theme colors
- Scalable (uses background-color from theme)
- Accessible
- No inline SVG clutter

---

## Event Handling

### Web Component Events

Carbon Web Components emit custom events. Listen like native events:

```javascript
// Content Switcher
document.querySelector('.theme-selector')
  ?.addEventListener('cds-content-switcher-selected', (ev) => {
    const value = ev.detail.item.value;
    // Handle selection
  });

// Checkbox
document.querySelector('#checkbox-id')
  ?.addEventListener('cds-checkbox-changed', (ev) => {
    const checked = ev.target.checked;
    // Handle change
  });
```

### Event Detail Structure

Custom events include `detail` property:

```javascript
ev.detail.item.value      // For content switcher
ev.target.checked         // For checkbox
ev.currentTarget          // Element that has listener
```

### Optional Chaining Pattern

Use optional chaining (`?.`) when selecting elements that may not exist on all pages:

```javascript
document.querySelector('.element')?.addEventListener('event', handler);
```

---

## Accessibility Patterns

### Skip to Content

**Always include skip-to-content as the first child of the header:**

```javascript
import '@carbon/web-components/es/components/skip-to-content/index.js';
```

```html
<cds-header>
  <cds-skip-to-content href="#main-content"></cds-skip-to-content>
  <!-- Other header content -->
</cds-header>

<main id="main-content">
  <!-- Main content -->
</main>
```

### ARIA Labels

All interactive components should have ARIA labels:

```html
<cds-header-global-action aria-label="Notifications">
  <!-- Content -->
</cds-header-global-action>

<cds-side-nav aria-label="Side navigation">
  <!-- Content -->
</cds-side-nav>

<cds-header-panel aria-label="Notification Panel">
  <!-- Content -->
</cds-header-panel>
```

---

## Best Practices

### 1. Component Organization

**main.js structure:**
```javascript
// 1. Styles first
import './style.scss';

// 2. Component imports
import '@carbon/web-components/es/components/...';

// 3. Constants and DOM references
const bodyEl = document.querySelector('body');

// 4. Event handlers
const handleEvent = (ev) => { /* ... */ };

// 5. Event listener attachments
element.addEventListener('event', handleEvent);

// 6. Initial setup
if (condition) { /* setup code */ }
```

### 2. SCSS Import Order

```scss
// 1. Carbon resets
@use '@carbon/styles/scss/reset';

// 2. Theme system
@use '@carbon/styles/scss/theme' as *;
@use '@carbon/styles/scss/themes';

// 3. Layout tokens
@use '@carbon/styles/scss/spacing' as *;

// 4. Typography
@use '@carbon/styles/scss/type' as *;

// 5. Theme definitions
:root { /* ... */ }

// 6. Custom styles
.my-component { /* ... */ }
```

### 3. Theme Detection

```javascript
// Set initial theme based on system preferences
if (matchMedia('(prefers-color-scheme: dark)').matches) {
  bodyEl.classList.add('g100');
} else {
  bodyEl.classList.add('g10');
}
```

### 4. Component Property Access

Web Components expose properties that can be set directly:

```javascript
panel.expanded = false;  // Close panel
nav.open = true;         // Open navigation
```

### 5. Responsive Behavior

Use `collapse-mode` for responsive navigation:

```html
<cds-side-nav
  is-not-persistent
  collapse-mode="${SIDE_NAV_COLLAPSE_MODE.RESPONSIVE}">
  <!-- Navigation items -->
</cds-side-nav>
```

This automatically shows/hides based on viewport width (< 1080px).

### 6. Content Switcher Pattern

```html
<cds-content-switcher value="default" class="selector">
  <cds-content-switcher-item icon value="option1">
    <div class="icon icon--option1"></div>
    <span slot="tooltip-content">Option 1</span>
  </cds-content-switcher-item>
</cds-content-switcher>
```

- Use `value` attribute to identify options
- Use `icon` attribute for icon-only display
- Use `tooltip-content` slot for tooltips

### 7. Panel Content Structure

```html
<cds-header-panel id="panel-id" aria-label="Panel Label">
  <div class="header-panel__content">
    <h2 class="header-panel__title">Title</h2>
    <!-- Panel content -->
  </div>
</cds-header-panel>
```

```scss
.header-panel__content {
  display: flex;
  flex-direction: column;
  gap: $spacing-05;
  padding: $spacing-05;
}

.header-panel__title {
  @include type-style('heading-compact-01');
}
```

---

## Common Patterns Reference

### Full Theme Switcher Implementation

```javascript
const bodyEl = document.querySelector('body');

const handleSwitch = (ev) => {
  switch (ev.detail.item.value) {
    case 'light':
      bodyEl.classList.remove('g100');
      bodyEl.classList.add('g10');
      break;
    case 'dark':
      bodyEl.classList.remove('g10');
      bodyEl.classList.add('g100');
      break;
    case 'system':
    default:
      bodyEl.classList.remove('g10', 'g100');
      break;
  }
};

document.querySelector('.theme-selector')
  ?.addEventListener('cds-content-switcher-selected', handleSwitch);

// Initialize based on system preference
if (matchMedia('(prefers-color-scheme: dark)').matches) {
  bodyEl.classList.add('g100');
} else {
  bodyEl.classList.add('g10');
}
```

### Header Theme Toggle

```javascript
const handleCompliment = (ev) => {
  const headerEl = document.querySelector('header');
  if (ev.target.checked) {
    headerEl.classList.add('compliment');
  } else {
    headerEl.classList.remove('compliment');
  }
};

document.querySelector('#header-compliment')
  ?.addEventListener('cds-checkbox-changed', handleCompliment);
```

---

## API Integration & Dynamic Content (Step 3)

### Octokit GitHub API Integration

Carbon Web Components work seamlessly with external APIs. The tutorial uses GitHub's Octokit library for API access.

#### Installation

```bash
pnpm add @octokit/core
```

#### Basic API Pattern

```javascript
import { Octokit } from '@octokit/core';

const octokit = new Octokit();

const fetchData = async () => {
  const res = await octokit.request('GET /orgs/{org}/repos', {
    org: 'carbon-design-system',
    per_page: 75,
    sort: 'updated',
    direction: 'desc',
  });
  
  // Map API response to application data structure
  data = res.data.map((row) => ({
    name: row.name,
    created: new Date(row.created_at).toLocaleDateString(),
    updated: new Date(row.updated_at).toLocaleDateString(),
    openIssues: row.open_issues_count,
    stars: row.stargazers_count,
    links: {
      url: row.html_url,
      homepage: row.homepage,
    },
    expansion: row.description,
  }));
};
```

### Skeleton Loading Pattern

Carbon provides skeleton components for loading states:

```html
<!-- Initial state: Show skeleton -->
<div class="repo-page__r1">
  <cds-table-skeleton></cds-table-skeleton>
</div>
```

#### Template-Based Content Replacement

```html
<!-- Template with actual content (initially hidden) -->
<template id="template--table">
  <cds-table expandable>
    <!-- Table structure -->
  </cds-table>
  <cds-pagination>
    <!-- Pagination controls -->
  </cds-pagination>
</template>
```

#### JavaScript Skeleton Replacement

```javascript
const replaceSkeleton = () => {
  const skeleton = document.querySelector('cds-table-skeleton');
  const tableTemplate = document.querySelector('template#template--table');
  
  if (skeleton && tableTemplate) {
    // Clone template content
    const newTable = tableTemplate.content.cloneNode(true);
    
    // Replace skeleton with real content
    skeleton.replaceWith(newTable);
    
    // Populate with data
    updateTable();
    updatePagination();
    
    // Attach event listeners
    attachEventListeners();
  }
};
```

### Pagination Component

Carbon's pagination component handles large datasets with customizable page sizes.

#### Pagination HTML Structure

```html
<cds-pagination 
  backward-text="Previous page" 
  forward-text="Next page" 
  items-per-page-text="Items per page:">
  <cds-select-item value="10">10</cds-select-item>
  <cds-select-item value="20">20</cds-select-item>
  <cds-select-item value="30">30</cds-select-item>
  <cds-select-item value="40">40</cds-select-item>
  <cds-select-item value="50">50</cds-select-item>
</cds-pagination>
```

#### Pagination State Management

```javascript
let pageSize = 10;
let firstRowIndex = 0;

// Update pagination component properties
const updatePagination = () => {
  const pagination = document.querySelector('cds-pagination');
  if (pagination) {
    pagination.totalItems = data.length;
    pagination.pageSize = pageSize;
    pagination.page = Math.floor(firstRowIndex / pageSize) + 1;
  }
};

// Handle page navigation
const handlePageChangeCurrent = (e) => {
  const { page, pageSize: newPageSize } = e.detail;
  firstRowIndex = (page - 1) * newPageSize;
  updateTable();
};

// Handle page size changes
const handlePageSizeChange = (e) => {
  const { pageSize: newPageSize } = e.detail;
  pageSize = newPageSize;
  firstRowIndex = 0;  // Reset to first page
  updateTable();
  updatePagination();
};
```

#### Filtering Data for Pagination

```javascript
const updateTable = () => {
  const tableBody = document.querySelector('cds-table-body');
  const tableRowTemplate = document.querySelector('template#template--table-row');
  
  if (tableBody && tableRowTemplate) {
    tableBody.innerHTML = '';
    
    // Filter data for current page
    data
      .filter((v, i) => i >= firstRowIndex && i < firstRowIndex + pageSize)
      .forEach((row) => {
        const newRow = tableRowTemplate.content.cloneNode(true);
        // Populate row...
        tableBody.appendChild(newRow);
      });
  }
};
```

#### Pagination Event Listeners

```javascript
const pagination = document.querySelector('cds-pagination');
if (pagination) {
  pagination.addEventListener(
    'cds-pagination-changed-current',
    handlePageChangeCurrent
  );
  pagination.addEventListener(
    'cds-pagination-changed-page-size',
    handlePageSizeChange
  );
}
```

### Link Component Integration

Render links dynamically with proper Carbon styling:

```javascript
// Import link component
import '@carbon/web-components/es/components/link/index.js';

// Conditional link rendering
if (key === 'links') {
  const url = row[key].url;
  const homepage = row[key].homepage;
  
  let innerHTML = '<ul class="link-list">';
  if (url) {
    innerHTML += `<li><cds-link href="${url}">GitHub</cds-link></li>`;
  }
  if (homepage) {
    innerHTML += `<li><cds-link href="${homepage}">Homepage</cds-link></li>`;
  }
  innerHTML += '</ul>';
  
  keyEl.innerHTML = innerHTML;
}
```

#### Link List Styling

```scss
.link-list {
  display: flex;
  list-style: none;
}

.link-list li:not(:last-child)::after {
  content: '|';
  padding: 0 $spacing-03;
}
```

This creates a horizontal list with pipe separators between links.

### API Integration Best Practices

1. **Async/Await Pattern** - Use async functions for API calls
2. **Data Transformation** - Map API responses to application data structure
3. **Date Formatting** - Use `toLocaleDateString()` for user-friendly dates
4. **Loading States** - Always show skeleton loaders during data fetch
5. **Template Cloning** - Move content to templates for dynamic replacement
6. **Event Listener Timing** - Attach listeners AFTER DOM elements are created
7. **Pagination State** - Reset to page 1 when page size changes
8. **Null Checks** - Always check for null/undefined before accessing properties

---

## Key Takeaways for LLM Agents

1. **No Framework Required**: Carbon Web Components work with vanilla JS/HTML
2. **Import Pattern**: Import components from ES modules, not package root
3. **Theming**: Use SCSS mixins, not CSS variables, for theme application
4. **Slots**: Use named slots for flexible component composition
5. **Events**: Listen for custom events with `cds-` prefix
6. **Tokens**: Use Carbon's design tokens (`$spacing-*`, `$text-*`, etc.) not hardcoded values
7. **Accessibility**: Always include skip-to-content and ARIA labels
8. **Icons**: Use CSS mask pattern for themeable icons
9. **Responsive**: Use built-in responsive modes, not custom media queries
10. **Properties**: Set component properties directly on DOM elements
11. **Grid Classes on Content**: NEVER create wrapper divs - put grid column classes on the same element as content classes
12. **Image Dimensions**: Always include width and height attributes on images
13. **Template Placement**: Place templates after `</body>` but before `</html>`
14. **API Integration**: Use async/await with proper error handling and loading states
15. **Skeleton Loaders**: Show skeleton components during data fetch operations
16. **Pagination**: Carbon pagination requires state management and event handlers
17. **Dynamic Links**: Use `cds-link` component for proper Carbon link styling
18. **Event Timing**: Attach event listeners AFTER DOM elements are created (after skeleton replacement)
19. **Data Transformation**: Map API responses to match application data structure
20. **Canonical Paths**: Use `/` for root navigation, not `./`

---

## Resources

- [Carbon Web Components Storybook](https://web-components.carbondesignsystem.com/)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Web Components Tutorial](https://carbondesignsystem.com/developing/web-components-tutorial/overview/)
- [Carbon GitHub](https://github.com/carbon-design-system/carbon)
- [Octokit Core Documentation](https://github.com/octokit/core.js)

---

**Document Version**: 3.0  
**Last Updated**: Based on Carbon Web Components 2.x and Steps 1-3 Tutorial  
**Author**: Generated from IBM Carbon Design System Tutorial Implementation  

**Version History:**
- **v3.0**: Added API Integration section (Step 3), corrected Grid pattern mistakes, added Pagination and Skeleton loader patterns, expanded Key Takeaways to 20 items
- **v2.0**: CSS Grid system, Tabs component, Data Tables, HTML Templates pattern
- **v1.0**: Initial release with UI Shell, Theme System, and core patterns

**Critical Corrections in v3.0:**
- Fixed Grid pattern - Grid column classes must be on content containers, NOT wrapper divs
- Added image dimension requirements (width/height attributes)
- Corrected breadcrumb path convention (use `/` not `./`)
- Added comprehensive API integration patterns with Octokit
- Documented skeleton loader and template replacement patterns
- Added pagination component with state management

```
