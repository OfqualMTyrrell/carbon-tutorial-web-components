# Working with IBM Carbon Design System Web Components

This guide documents the patterns, practices, and conventions learned from implementing the IBM Carbon Design System Web
Components Framework. This is intended to help developers and LLM agents understand how to work with Carbon Web
Components as designed by IBM.

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
- [Component Template Pattern](#component-template-pattern)
- [BEM Naming Conventions](#bem-naming-conventions)
- [Linting and Code Quality](#linting-and-code-quality)
- [Accessibility Patterns](#accessibility-patterns)
- [Best Practices](#best-practices)

---

## Overview

Carbon Web Components are standards-based custom elements that can be used in any modern browser with any JavaScript
library or framework, or with no framework at all (Vanilla JS/HTML).

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

Carbon supports "compliment" theming for UI elements that should contrast with the main theme (e.g., dark header on
light page).

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
    <cds-header-menu-button button-label-active="Close menu" button-label-inactive="Open menu">
    </cds-header-menu-button>

    <!-- Brand/Product name -->
    <cds-header-name href="./" prefix="IBM"> Product Name </cds-header-name>

    <!-- Desktop navigation -->
    <cds-header-nav menu-bar-label="Navigation Label">
      <cds-header-nav-item href="./page.html"> Page Name </cds-header-nav-item>
    </cds-header-nav>

    <!-- Mobile navigation (appears in sidebar) -->
    <cds-side-nav is-not-persistent aria-label="Side navigation" collapse-mode="${SIDE_NAV_COLLAPSE_MODE.RESPONSIVE}">
      <cds-side-nav-items>
        <cds-side-nav-link href="./page.html"> Page Name </cds-side-nav-link>
      </cds-side-nav-items>
    </cds-side-nav>

    <!-- Global actions and panels -->
    <div class="cds--header__global">
      <cds-header-global-action aria-label="Action Name" panel-id="panel-id">
        <div slot="icon"><!-- Icon content --></div>
      </cds-header-global-action>
    </div>

    <!-- Panels (slide-out from right) -->
    <cds-header-panel id="panel-id" aria-label="Panel Label"> Panel content </cds-header-panel>
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
  padding: $spacing-05; // 1rem / 16px
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
  grid-template-rows: $spacing-09 1fr; // Header height + flexible content
  height: 100vh;
  overflow: hidden; // Let main handle scrolling
}
```

This creates:

- Fixed header height (48px)
- Flexible content area
- Proper scroll behavior

---

## CSS Grid Deep Dive

Carbon's CSS Grid system is a 16-column grid implemented using native CSS Grid (not flexbox). **Important:** The Carbon
grid does not exist as web components due to shadow DOM traversal difficulties.

### Grid Classes Hierarchy

```html
<!-- Root grid container -->
<div class="cds--css-grid cds--css-grid--full-width">
  <!-- Grid columns -->
  <div class="cds--css-grid-column cds--col-span-100">
    <!-- Subgrid (nested grid) -->
    <div class="cds--subgrid cds--subgrid--full-wide">
      <!-- Columns within subgrid -->
      <div class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-16">Content</div>
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
      <div
        class="page-landing__tab-content cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-4 cds--lg:col-span-7">
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
      <div class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-2 cds--lg:col-span-4">The principles</div>

      <!-- Title 1: starts at column 3 on md, column 5 on lg -->
      <div
        class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-6 cds--md:col-start-3 cds--lg:col-span-4 cds--lg:col-start-5">
        Carbon is open
      </div>

      <!-- Title 2: starts at column 3 on md, column 9 on lg -->
      <div
        class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-6 cds--md:col-start-3 cds--lg:col-span-4 cds--lg:col-start-9">
        Carbon is modular
      </div>

      <!-- Title 3: starts at column 3 on md, column 13 on lg -->
      <div
        class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-6 cds--md:col-start-3 cds--lg:col-span-4 cds--lg:col-start-13">
        Carbon is consistent
      </div>
    </div>
  </div>
</div>
```

### Grid Pattern Rules

1. **Grid column classes belong on content containers** - Do NOT create wrapper divs. Place `cds--css-grid-column`
   classes on the SAME element as your content wrapper classes (e.g., `page-landing__tab-content`). This is critical for
   proper grid layout.

2. **Subgrids inherit parent columns** - Use `cds--subgrid--full-wide` to span full width of parent column

3. **Always include image dimensions** - Specify `width` and `height` attributes on `<img>` tags for performance
   (prevents layout shift) and accessibility

4. **Column math** - On large screens: 7 cols + 8 cols = 15 cols (leaving 1 for gutter spacing)

5. **Mobile-first responsive** - Always specify all breakpoints: `sm:`, `md:`, and `lg:`

6. **Use canonical paths** - For root navigation, use `href="/"` not `href="./"`

### Common Grid Mistakes to Avoid

❌ **WRONG - Extra wrapper div:**

```html
<div class="cds--css-grid-column cds--lg:col-span-7">
  <div class="page-landing__tab-content">Content</div>
</div>
```

✅ **CORRECT - Classes on same element:**

```html
<div class="page-landing__tab-content cds--css-grid-column cds--lg:col-span-7">Content</div>
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
  top: $spacing-09; // Height of header
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
  <cds-table-header-title slot="title"> Carbon Repositories </cds-table-header-title>
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
  <cds-table-body> </cds-table-body>
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
<cds-table-expanded-row> Expanded content shown when row is expanded </cds-table-expanded-row>
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
  <cds-table-expanded-row key="description"> Description </cds-table-expanded-row>
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

## Component Template Pattern

Beyond data tables, HTML templates are a powerful pattern for building reusable, data-driven components in Carbon
applications. Step 4 demonstrates this with the InfoCard component pattern.

### Component Template Architecture

Templates define component structure once and clone it multiple times with different data - a core pattern in modern web
development.

#### Template Definition Pattern

```html
<!-- Place after </body> tag -->
<template id="template--info-card">
  <div
    class="info-card cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-5 cds--xlg:col-span-4 cds--css-grid-column">
    <div class="info-card__upper">
      <h4 class="info-card__heading">Carbon is <strong class="info-card__heading--strong">thing goes here</strong></h4>
      <p class="info-card__body">Body goes here</p>
    </div>
    <div class="info-card__pictogram"></div>
  </div>
</template>
```

**Key Points:**

1. **Template ID**: Use descriptive IDs with `template--` prefix for clarity
2. **Grid Classes in Template**: Include responsive grid column classes in the template itself
3. **Placeholder Content**: Use descriptive placeholders that indicate what will be replaced
4. **Complete Structure**: Template should contain the full component structure including all nested elements

### Page-Specific JavaScript Files

For components that only appear on specific pages, create dedicated JS files:

```javascript
// landing.js - Only loaded on landing page
import '@carbon/web-components/es/components/breadcrumb/index';
import '@carbon/web-components/es/components/tabs/index';

// Component-specific data and logic
const infoCardDetails = [
  {
    strongMsg: 'Open',
    bodyMsg: `It's a distributed effort, guided by the principles of the open-source movement. Carbon's users are also it's makers, and everyone is encouraged to contribute.`,
    pictogramName: 'advocate',
  },
  // More items...
];
```

**Pattern Benefits:**

- **Code Splitting**: Only load code needed for specific pages
- **Maintainability**: Page logic stays separate from global application code
- **Performance**: Smaller bundle sizes for pages that don't need all features

### Component Data Structure

Define data as an array of objects matching the template structure:

```javascript
const infoCardDetails = [
  {
    strongMsg: 'Open', // Maps to <strong> element
    bodyMsg: 'Description...', // Maps to <p> element
    pictogramName: 'advocate', // Maps to CSS class modifier
  },
  // Additional items...
];
```

### Template Cloning and Population

```javascript
const updateInfoCard = (here, { strongMsg, bodyMsg, pictogramName }) => {
  // 1. Get template reference
  const infoCardTemplate = document.querySelector('template#template--info-card');

  if (here && infoCardTemplate) {
    // 2. Clone template content
    const newInfoCard = infoCardTemplate.content.cloneNode(true);

    // 3. Query for specific elements
    const strongEl = newInfoCard.querySelector('.info-card__heading--strong');
    strongEl.innerHTML = strongMsg;

    const infoBodyEl = newInfoCard.querySelector('.info-card__body');
    infoBodyEl.innerHTML = bodyMsg;

    const pictogramEl = newInfoCard.querySelector('.info-card__pictogram');
    pictogramEl.classList.add(`info-card__pictogram--${pictogramName}`);

    // 4. Clear placeholder content and replace
    here.innerHTML = '';
    here.replaceWith(newInfoCard);
  }
};
```

### Template Population Pattern

```javascript
// 1. Query all placeholder elements
const infoCards = document.querySelectorAll('.info-card');

// 2. Convert NodeList to Array for iteration
[...infoCards].forEach((infoCard, index) => {
  // 3. Populate each with corresponding data
  updateInfoCard(infoCard, infoCardDetails[index]);
});
```

### innerHTML vs textContent

**Critical Pattern Choice:**

```javascript
// ✅ Use innerHTML when content may contain HTML entities or formatting
strongEl.innerHTML = strongMsg; // Preserves apostrophes, quotes, etc.

// ❌ Using textContent may escape HTML entities incorrectly
strongEl.textContent = "It's"; // May display as "It&#39;s"
```

**When to use each:**

- `innerHTML`: Content with punctuation, HTML entities, or formatting
- `textContent`: Plain text with no special characters or HTML

### Placeholder Replacement Pattern

Two approaches for replacing placeholder elements:

#### Method 1: Replace Element (Recommended)

```javascript
here.innerHTML = ''; // Clear placeholder content
here.replaceWith(newCard); // Replace entire element
```

#### Method 2: Replace Inner Content

```javascript
here.innerHTML = newCard.innerHTML; // Replace only inner content
```

**Use Method 1 when:**

- Template includes grid column classes
- You want to replace the entire component structure

**Use Method 2 when:**

- Grid classes are on parent container
- You only want to replace content, not structure

### Template Formatting Standards

**Carbon follows specific formatting conventions:**

```html
<!-- ✅ CORRECT - Single-line simple elements -->
<h4 class="info-card__heading">Carbon is <strong class="info-card__heading--strong">thing goes here</strong></h4>

<!-- ❌ WRONG - Unnecessary line breaks -->
<h4 class="info-card__heading">
  Carbon is
  <strong class="info-card__heading--strong">thing goes here</strong>
</h4>

<!-- ✅ CORRECT - Multi-line for complex content -->
<p class="info-card__body">Body goes here</p>
```

**Formatting Rules:**

1. **Simple elements**: Keep on single line if content is short
2. **Complex elements**: Use line breaks for readability
3. **Consistency**: Match Carbon's upstream formatting conventions

### Component Styling with Responsive Breakpoints

```scss
.info-card {
  display: flex;
  height: 300px;
  flex-direction: column;
  justify-content: space-between;
  padding-inline: $spacing-05;
  border-left: 1px solid $border-subtle;

  // Target specific child positions
  @include breakpoint-down(xlg) {
    &:nth-of-type(2) {
      border-left: none;
      padding-left: 0;
    }
  }

  // Complete layout change for mobile
  @include breakpoint-down(lg) {
    flex-direction: row-reverse;
    border-left: none;
    padding-inline: 0;
    gap: $spacing-07;
    padding-top: $spacing-10;
    height: initial;

    &:nth-of-type(2) {
      padding-top: 0;
    }
  }
}
```

**Responsive Pattern Rules:**

1. **Desktop-first base styles**: Define desktop layout first
2. **breakpoint-down()**: Use Carbon's breakpoint mixin for responsive adjustments
3. **nth-of-type()**: Target specific items in a series
4. **height: initial**: Reset fixed heights on mobile for content-driven sizing
5. **Complete restructure**: Mobile may require totally different flex direction

### Dynamic Class Assignment

```javascript
// Add modifier class based on data
pictogramEl.classList.add(`info-card__pictogram--${pictogramName}`);

// Generates classes like:
// .info-card__pictogram--advocate
// .info-card__pictogram--accelerating-transformation
// .info-card__pictogram--globe
```

### Pictogram Pattern (CSS Mask)

```scss
.info-card__pictogram {
  width: $spacing-10;
  height: $spacing-10;
  background-color: $text-primary;
}

// Modifier classes for each pictogram
.info-card__pictogram--accelerating-transformation {
  mask: url('/accelerating-transformation.svg') no-repeat center;
}

.info-card__pictogram--advocate {
  mask: url('/advocate.svg') no-repeat center;
}

.info-card__pictogram--globe {
  mask: url('/globe.svg') no-repeat center;
}
```

**Pictogram Pattern Benefits:**

1. **Theme-aware**: Uses `$text-primary` token so pictograms match theme
2. **Scalable**: SVG-based, scales perfectly
3. **Maintainable**: Add new pictograms by adding modifier classes
4. **Performant**: CSS masks are hardware-accelerated

### Component Template Best Practices

1. **Template Location**: Always place templates after `</body>` tag
2. **ID Naming**: Use `template--component-name` convention
3. **Grid Integration**: Include grid classes in template for self-contained components
4. **Data Mapping**: Design data structure to match template query selectors
5. **Null Checks**: Always check template exists before cloning
6. **innerHTML Usage**: Use `innerHTML` for content with HTML entities
7. **Formatting Consistency**: Match Carbon's formatting standards (compare with upstream branches)
8. **Responsive Design**: Plan for multiple breakpoints in component styles
9. **BEM Naming**: Use Block\_\_Element--Modifier pattern for class names
10. **Placeholder Content**: Use descriptive placeholders that indicate purpose

---

## BEM Naming Conventions

Carbon follows the BEM (Block Element Modifier) methodology for CSS class naming. Understanding this pattern is critical
for working with Carbon components.

### BEM Structure

```
.block__element--modifier
```

- **Block**: Standalone component (e.g., `info-card`)
- **Element**: Part of a block (e.g., `info-card__heading`)
- **Modifier**: Variation of block or element (e.g., `info-card__pictogram--advocate`)

### Carbon BEM Examples

```html
<!-- Block: info-card -->
<div class="info-card">
  <!-- Element: info-card__upper -->
  <div class="info-card__upper">
    <!-- Element: info-card__heading -->
    <h4 class="info-card__heading">
      <!-- Element with Modifier: info-card__heading--strong -->
      <strong class="info-card__heading--strong">Open</strong>
    </h4>

    <!-- Element: info-card__body -->
    <p class="info-card__body">Description text</p>
  </div>

  <!-- Element: info-card__pictogram -->
  <!-- Element with Modifier: info-card__pictogram--advocate -->
  <div class="info-card__pictogram info-card__pictogram--advocate"></div>
</div>
```

### BEM Naming Rules

1. **Double underscores** (`__`) separate block from element
2. **Double hyphens** (`--`) separate element from modifier
3. **Single hyphens** (`-`) separate words within names
4. **No nesting** in class names - always start from block

### Examples from Carbon Tutorial

```scss
// ✅ CORRECT BEM naming
.info-section__heading {
}
.info-card__pictogram {
}
.info-card__pictogram--advocate {
}
.info-card__heading--strong {
}
.page-landing__tab-content {
}

// ❌ WRONG - Too much nesting
.info-section .heading {
} // Use .info-section__heading
.info-card .pictogram.advocate {
} // Use .info-card__pictogram--advocate
```

### BEM with Carbon Grid Classes

When combining BEM with Carbon grid classes, list them together:

```html
<!-- ✅ CORRECT - BEM class first, then grid classes -->
<div class="info-card cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-5"></div>

<!-- ✅ ALSO CORRECT - Content class with grid classes -->
<div class="page-landing__tab-content cds--css-grid-column cds--lg:col-span-7"></div>
```

### BEM Modifier Pattern in JavaScript

```javascript
// Dynamically add modifiers based on data
const blockClass = 'info-card__pictogram';
const modifier = 'advocate';
element.classList.add(`${blockClass}--${modifier}`);
// Results in: info-card__pictogram--advocate
```

### When to Create New Blocks

Create a new block when:

- Component is reusable and standalone
- Component has distinct purpose and structure
- Component could exist independently on different pages

```scss
// Separate blocks for different components
.info-card {
}
.info-section {
}
.page-landing {
}
```

### BEM with Responsive Modifiers

```scss
.info-card {
  // Base styles

  // Use :nth-of-type for positional styling
  &:nth-of-type(2) {
    // Styles for second card
  }

  // Avoid creating position-based modifiers like:
  // .info-card--second (Don't do this)
}
```

**Why avoid position modifiers?**

- Position is context-dependent
- `:nth-of-type()` is more maintainable
- Keeps HTML cleaner

### Carbon's BEM Patterns

```scss
// Block-level responsive behavior
.info-card {
  @include breakpoint-down(xlg) {
    // Responsive adjustments
  }
}

// Element-level styles
.info-card__heading {
  @include type-style('heading-03');
  margin-top: 0;
}

// Element with multiple modifiers
.info-card__pictogram {
  width: $spacing-10;
  height: $spacing-10;
}

.info-card__pictogram--advocate {
  mask: url('/advocate.svg') no-repeat center;
}

.info-card__pictogram--globe {
  mask: url('/globe.svg') no-repeat center;
}
```

---

## Design Tokens

Carbon uses design tokens for consistent theming. Access tokens through SCSS variables.

### Color Tokens

```scss
@use '@carbon/styles/scss/theme' as *;

.element {
  color: $text-primary; // Primary text color
  background-color: $background; // Background color
  border-color: $border-subtle; // Subtle border color
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
  background-color: $text-primary; // Uses theme token
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
document.querySelector('.theme-selector')?.addEventListener('cds-content-switcher-selected', (ev) => {
  const value = ev.detail.item.value;
  // Handle selection
});

// Checkbox
document.querySelector('#checkbox-id')?.addEventListener('cds-checkbox-changed', (ev) => {
  const checked = ev.target.checked;
  // Handle change
});
```

### Event Detail Structure

Custom events include `detail` property:

```javascript
ev.detail.item.value; // For content switcher
ev.target.checked; // For checkbox
ev.currentTarget; // Element that has listener
```

### Optional Chaining Pattern

Use optional chaining (`?.`) when selecting elements that may not exist on all pages:

```javascript
document.querySelector('.element')?.addEventListener('event', handler);
```

---

## Linting and Code Quality

### Why Linting is Critical for Carbon Design System

Linting ensures consistency with Carbon Design System's architectural decisions and best practices:

1. **Carbon Token Enforcement**: Ensures use of Carbon design tokens instead of hard-coded values
2. **Accessibility Compliance**: Catches accessibility violations early in development
3. **RTL/Internationalization**: Enforces logical CSS properties for right-to-left language support
4. **BEM Naming Consistency**: Validates proper Block Element Modifier naming conventions
5. **Code Formatting**: Maintains consistent code style across the team
6. **Spelling**: Prevents typos in code, comments, and documentation

### Linting Tools Configuration

#### 1. Stylelint (SCSS/CSS Linting)

**Purpose**: Enforces Carbon design tokens, accessibility rules, and logical properties for RTL support.

**Installation:**

```bash
pnpm add -D stylelint stylelint-plugin-carbon-tokens
# Extended configuration (recommended):
pnpm add -D @double-great/stylelint-a11y stylelint-config-standard-scss stylelint-use-logical-spec
```

**Configuration (`.stylelintrc.json`):**

```json
{
  "extends": ["stylelint-plugin-carbon-tokens/config/recommended", "stylelint-config-standard-scss"],
  "plugins": ["stylelint-plugin-carbon-tokens", "@double-great/stylelint-a11y", "stylelint-use-logical-spec"],
  "reportDescriptionlessDisables": true,
  "reportInvalidScopeDisables": true,
  "reportNeedlessDisables": true,
  "rules": {
    "selector-class-pattern": "^[a-z][a-z0-9-]*(__[a-z0-9-]+)*(--[a-z0-9-]+)*$",
    "declaration-empty-line-before": null,
    "liberty/use-logical-spec": [
      "always",
      {
        "except": ["top", "bottom"]
      }
    ]
  }
}
```

**Key Features:**

- **Carbon Token Plugin**: Flags hard-coded values that should use Carbon design tokens

  ```scss
  // ❌ Wrong
  font-weight: 600;

  // ✅ Correct
  font-weight: font-weight('semibold');
  ```

- **BEM Pattern Validation**: Ensures proper Block\_\_Element--Modifier naming

  ```scss
  // ✅ Valid BEM patterns
  .page-landing__banner {
  }
  .info-card__heading {
  }
  .theme-selector__icon--dark {
  }
  ```

- **Logical Properties**: Auto-fixes physical properties to logical ones for RTL support

  ```scss
  // Before auto-fix:
  margin-left: $spacing-05;
  padding-right: $spacing-03;
  border-left: 1px solid;

  // After auto-fix:
  margin-inline-start: $spacing-05;
  padding-inline-end: $spacing-03;
  border-inline-start: 1px solid;
  ```

**Package Scripts:**

```json
{
  "scripts": {
    "lint:style": "stylelint \"**/*.scss\"",
    "lint:style:fix": "stylelint \"**/*.scss\" --fix"
  }
}
```

#### 2. ESLint (JavaScript Linting)

**Purpose**: Enforces JavaScript best practices and code quality.

**Installation:**

```bash
pnpm add -D eslint @eslint/js eslint-config-prettier globals
```

**Configuration (`eslint.config.js`):**

```javascript
import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
```

**Package Scripts:**

```json
{
  "scripts": {
    "lint:es": "eslint . main.js --report-unused-disable-directives --max-warnings 0"
  }
}
```

#### 3. Prettier (Code Formatting)

**Purpose**: Maintains consistent code formatting across all file types.

**Installation:**

```bash
pnpm add -D prettier
```

**Configuration (`.prettierrc`):**

```json
{
  "bracketSameLine": true,
  "bracketSpacing": true,
  "printWidth": 120,
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "proseWrap": "always"
}
```

**Key Settings:**

- `printWidth: 120`: Matches Carbon's wider line length for readability
- `singleQuote: true`: Consistent with Carbon's JavaScript style
- `bracketSameLine: true`: JSX-friendly formatting
- `proseWrap: "always"`: Wraps markdown documentation consistently

**Package Scripts:**

```json
{
  "scripts": {
    "lint:format": "prettier ./**/*.{js,jsx,ts,tsx,md,mdx,scss} --write --ignore-unknown --no-error-on-unmatched-pattern --log-level warn"
  }
}
```

#### 4. CSpell (Spell Checker)

**Purpose**: Catches typos in code, comments, and documentation.

**Installation:**

```bash
pnpm add -D cspell
```

**Configuration (`cspell.json`):**

```json
{
  "version": "0.1",
  "language": "en",
  "enabledLanguageIds": [
    "css",
    "git-commit",
    "html",
    "javascript",
    "json",
    "jsonc",
    "markdown",
    "scss",
    "typescript",
    "yaml"
  ],
  "words": ["flexbox", "illo", "subgrid", "Subgrid", "Subgrids"]
}
```

**Package Scripts:**

```json
{
  "scripts": {
    "lint:spell": "cspell lint --quiet \"**/*.{js,css,scss,md}\""
  }
}
```

### Linting Workflow

**1. Run all linters before committing:**

```bash
pnpm run lint:style && pnpm run lint:es && pnpm run lint:spell
```

**2. Auto-fix what can be fixed:**

```bash
pnpm run lint:style -- --fix
pnpm run lint:format
```

**3. Common Issues and Fixes:**

| Issue                   | Tool      | Solution                                                    |
| ----------------------- | --------- | ----------------------------------------------------------- |
| Hard-coded CSS values   | Stylelint | Use Carbon tokens: `font-weight('semibold')`, `$spacing-05` |
| Physical CSS properties | Stylelint | Run `--fix` to convert to logical properties                |
| BEM naming violations   | Stylelint | Follow `block__element--modifier` pattern                   |
| Code formatting         | Prettier  | Run `lint:format` to auto-format                            |
| Typos                   | CSpell    | Fix typo or add to `words` array if intentional             |

### Why Logical Properties Matter for Carbon

Logical properties enable seamless right-to-left (RTL) language support without code changes:

**Physical Properties (❌ RTL-incompatible):**

```scss
.card {
  margin-left: 16px; // Always left margin, even in RTL
  padding-right: 8px; // Always right padding, even in RTL
  border-left: 1px solid; // Always left border, even in RTL
}
```

**Logical Properties (✅ RTL-compatible):**

```scss
.card {
  margin-inline-start: 16px; // Left in LTR, right in RTL
  padding-inline-end: 8px; // Right in LTR, left in RTL
  border-inline-start: 1px solid; // Left in LTR, right in RTL
}
```

**Logical Property Reference:**

| Physical        | Logical               | Meaning                      |
| --------------- | --------------------- | ---------------------------- |
| `left`          | `inline-start`        | Start of reading direction   |
| `right`         | `inline-end`          | End of reading direction     |
| `top`           | `block-start`         | Start of block flow          |
| `bottom`        | `block-end`           | End of block flow            |
| `width`         | `inline-size`         | Size along reading direction |
| `height`        | `block-size`          | Size along block flow        |
| `margin-left`   | `margin-inline-start` | Margin at reading start      |
| `padding-right` | `padding-inline-end`  | Padding at reading end       |

### Carbon Token Enforcement Examples

Stylelint with the Carbon tokens plugin ensures you use design tokens instead of magic numbers:

```scss
// ❌ Flagged by stylelint
.element {
  font-weight: 600; // Use font-weight('semibold')
  padding: 16px; // Use $spacing-05
  color: #161616; // Use $text-primary
  font-size: 14px; // Use type-style mixin
}

// ✅ Passes stylelint
.element {
  font-weight: font-weight('semibold');
  padding: $spacing-05;
  color: $text-primary;
  @include type-style('body-short-01');
}
```

### Accessibility Linting with stylelint-a11y

The `@double-great/stylelint-a11y` plugin catches accessibility violations:

- Insufficient color contrast
- Missing font size units
- Content property misuse
- Outline removal without alternatives
- Media query accessibility issues

**Example:**

```scss
// ❌ Flagged - removing outline without alternative
.button:focus {
  outline: none; // Accessibility violation
}

// ✅ Correct - provide visible focus indicator
.button:focus {
  outline: 2px solid $focus;
  outline-offset: 2px;
}
```

### Integration with CI/CD

Add linting to your CI pipeline to enforce standards:

```yaml
# .github/workflows/lint.yml
name: Lint
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm run lint:style
      - run: pnpm run lint:es
      - run: pnpm run lint:spell
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
const handleEvent = (ev) => {
  /* ... */
};

// 5. Event listener attachments
element.addEventListener('event', handleEvent);

// 6. Initial setup
if (condition) {
  /* setup code */
}
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
:root {
  /* ... */
}

// 6. Custom styles
.my-component {
  /* ... */
}
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
panel.expanded = false; // Close panel
nav.open = true; // Open navigation
```

### 5. Responsive Behavior

Use `collapse-mode` for responsive navigation:

```html
<cds-side-nav is-not-persistent collapse-mode="${SIDE_NAV_COLLAPSE_MODE.RESPONSIVE}">
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

document.querySelector('.theme-selector')?.addEventListener('cds-content-switcher-selected', handleSwitch);

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

document.querySelector('#header-compliment')?.addEventListener('cds-checkbox-changed', handleCompliment);
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
<cds-pagination backward-text="Previous page" forward-text="Next page" items-per-page-text="Items per page:">
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
  firstRowIndex = 0; // Reset to first page
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
  pagination.addEventListener('cds-pagination-changed-current', handlePageChangeCurrent);
  pagination.addEventListener('cds-pagination-changed-page-size', handlePageSizeChange);
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
11. **Grid Classes on Content**: NEVER create wrapper divs - put grid column classes on the same element as content
    classes
12. **Image Dimensions**: Always include width and height attributes on images
13. **Template Placement**: Place templates after `</body>` but before `</html>`
14. **API Integration**: Use async/await with proper error handling and loading states
15. **Skeleton Loaders**: Show skeleton components during data fetch operations
16. **Pagination**: Carbon pagination requires state management and event handlers
17. **Dynamic Links**: Use `cds-link` component for proper Carbon link styling
18. **Event Timing**: Attach event listeners AFTER DOM elements are created (after skeleton replacement)
19. **Data Transformation**: Map API responses to match application data structure
20. **Canonical Paths**: Use `/` for root navigation, not `./`
21. **innerHTML Usage**: Use `innerHTML` instead of `textContent` when content contains HTML entities (apostrophes,
    quotes, etc.)
22. **Template Formatting**: Match Carbon's exact formatting conventions - compare with upstream branches before
    committing
23. **BEM Naming**: Follow Block\_\_Element--Modifier pattern consistently
24. **Responsive Breakpoints**: Use `@include breakpoint-down(breakpoint)` for mobile-first responsive design
25. **CSS Formatting**: Follow Carbon's multi-line formatting for complex properties like box-shadow
26. **Component Files**: Create page-specific JS files (landing.js, repos.js) for components that only appear on certain
    pages
27. **Placeholder Replacement**: Use `element.replaceWith()` when replacing entire components, `innerHTML` for content
    only
28. **Dynamic Class Modifiers**: Use template literals to build BEM modifier classes from data: `${block}--${modifier}`
29. **Pictogram Pattern**: Combine base styles with modifier classes for dynamic icon systems using CSS masks
30. **Linting is Essential**: Set up Stylelint, ESLint, Prettier, and CSpell to enforce Carbon patterns and catch issues
    early
31. **Carbon Token Plugin**: Always use `stylelint-plugin-carbon-tokens` to enforce design token usage instead of
    hard-coded values
32. **Logical CSS Properties**: Use `inline-start`/`inline-end`, `block-start`/`block-end` instead of physical
    directions for RTL support
33. **Extended Stylelint Config**: Combine Carbon tokens, standard SCSS, accessibility, and logical properties plugins
    for comprehensive linting
34. **Auto-fix Workflow**: Run `stylelint --fix` and `prettier --write` to automatically fix many code quality issues
35. **BEM Regex Pattern**: Use `^[a-z][a-z0-9-]*(__[a-z0-9-]+)*(--[a-z0-9-]+)*$` to validate BEM naming with hyphens
36. **Accessibility Linting**: Use `@double-great/stylelint-a11y` to catch accessibility violations in CSS
37. **Internationalization Readiness**: Logical properties ensure your UI works correctly in right-to-left languages
    without code changes
38. **Spell Checking**: Use CSpell across all file types to maintain professional code quality and catch typos in
    documentation

---

## Resources

- [Carbon Web Components Storybook](https://web-components.carbondesignsystem.com/)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Web Components Tutorial](https://carbondesignsystem.com/developing/web-components-tutorial/overview/)
- [Carbon GitHub](https://github.com/carbon-design-system/carbon)
- [Octokit Core Documentation](https://github.com/octokit/core.js)

---

**Document Version**: 5.0  
**Last Updated**: Based on Carbon Web Components 2.x and Steps 1-5 Tutorial  
**Author**: Generated from IBM Carbon Design System Tutorial Implementation

**Version History:**

- **v5.0**: Added comprehensive Linting and Code Quality section (Step 5), documenting Stylelint with Carbon tokens
  plugin, ESLint, Prettier, CSpell, logical CSS properties for RTL support, accessibility linting, and why linting is
  critical for Carbon Design System consistency
- **v4.0**: Added Component Template Pattern (Step 4), BEM naming conventions, innerHTML vs textContent patterns,
  responsive breakpoint patterns, CSS formatting standards
- **v3.0**: Added API Integration section (Step 3), corrected Grid pattern mistakes, added Pagination and Skeleton
  loader patterns, expanded Key Takeaways to 20 items
- **v2.0**: CSS Grid system, Tabs component, Data Tables, HTML Templates pattern
- **v1.0**: Initial release with UI Shell, Theme System, and core patterns

**Critical Corrections in v3.0:**

- Fixed Grid pattern - Grid column classes must be on content containers, NOT wrapper divs
- Added image dimension requirements (width/height attributes)
- Corrected breadcrumb path convention (use `/` not `./`)
- Added comprehensive API integration patterns with Octokit
- Documented skeleton loader and template replacement patterns
- Added pagination component with state management

**Critical Corrections in v4.0:**

- **Template Formatting**: Match Carbon's upstream formatting conventions - simple elements stay single-line, complex
  elements use multiple lines
- **innerHTML vs textContent**: Use `innerHTML` when content contains HTML entities (apostrophes, quotes) to prevent
  escaping issues
- **Responsive Breakpoints**: Added complete mobile-first to desktop responsive pattern with `breakpoint-down()`
- **CSS Formatting**: Multi-line `box-shadow` declarations match Carbon style guide
- **BEM Consistency**: Document the importance of following exact BEM naming conventions from upstream
- **Template Structure**: Match upstream template structure exactly, including proper BEM naming like `info-card__upper`
  for semantic template sections
- **Component Files**: Organize page-specific JavaScript (landing.js, repos.js) separately from global (main.js)

**Critical Learnings in v5.0 (Linting):**

- **Carbon Token Enforcement**: Stylelint with `stylelint-plugin-carbon-tokens` catches hard-coded values (e.g.,
  `font-weight: 600` should be `font-weight('semibold')`)
- **Logical Properties**: Use `inline-start`/`inline-end` instead of `left`/`right` for RTL language support - stylelint
  can auto-fix these
- **Accessibility Linting**: `@double-great/stylelint-a11y` plugin catches accessibility violations like removed
  outlines without alternatives
- **BEM Pattern Validation**: Custom regex pattern validates Block**Element--Modifier naming with hyphens:
  `^[a-z][a-z0-9-]\*(**[a-z0-9-]+)_(--[a-z0-9-]+)_$`
- **Extended Configuration**: Combining multiple Stylelint plugins provides comprehensive code quality checks
- **Auto-fixing**: Many linting issues (logical properties, formatting) can be auto-fixed with `--fix` flag
- **Spelling Matters**: Use CSpell to catch typos early - don't add misspellings to allowed words list, fix them
- **Linting is for Consistency**: Linting enforces Carbon Design System architectural decisions across teams and ensures
  internationalization readiness

```

```
