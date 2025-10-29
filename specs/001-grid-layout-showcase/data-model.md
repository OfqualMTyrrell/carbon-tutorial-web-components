# Data Model: Grid Layout Showcase

**Feature**: Grid Layout Showcase  
**Date**: 2025-10-29  
**Purpose**: Define entities and data structures for demonstration pages

## Overview

This feature consists of static HTML demonstration pages with no backend persistence or dynamic data. The "entities"
below represent the conceptual structure of the demonstration content, not database schemas or API models.

## Entities

### Page

**Description**: A static HTML file demonstrating a specific Carbon grid layout pattern.

**Attributes**:

- `filename`: string (e.g., "page-filter-table.html")
- `title`: string (e.g., "Filter Panel + Data Table Layout")
- `layout_type`: enum("two-column-filter-table", "two-column-shell-nav", "single-column")
- `breakpoints`: array of breakpoint configurations

**Relationships**:

- Has one or more ContentSection entities
- May have one FilterPanel (Page A only)
- May have one DataTable (Page A only)
- May have one SideNavigation (Page B only)

**Lifecycle**:

- Static: No state changes; content is fixed at creation time

---

### FilterPanel

**Description**: A visual placeholder representing a filtering UI panel (left column of Page A).

**Attributes**:

- `column_span_lg`: number = 4 (large viewport)
- `column_span_md`: number = 8 (stacked, full-width on medium)
- `column_span_sm`: number = 4 (stacked, full-width on small)
- `heading_text`: string (e.g., "Filters")
- `controls`: array of FilterControl (count: 5)

**Relationships**:

- Belongs to Page A
- Contains multiple FilterControl entities

**Validation Rules**:

- Must occupy exactly 4 columns on large viewports
- Must include exactly 5 filter controls (per spec clarification)
- Must use BEM class `.filter-panel`

---

### FilterControl

**Description**: A single filter control element (checkbox, dropdown placeholder, text input placeholder).

**Attributes**:

- `type`: enum("checkbox", "dropdown", "text-input") - visual only, non-functional
- `label`: string (e.g., "Category", "Status", "Date Range")
- `placeholder_value`: string (for visual demonstration)

**Relationships**:

- Belongs to FilterPanel

**Validation Rules**:

- Must be non-interactive (static HTML only)
- Must use BEM class `.filter-panel__control`

---

### DataTable

**Description**: A visual placeholder representing a data table with sample rows (right column of Page A).

**Attributes**:

- `column_span_lg`: number = 12 (large viewport)
- `column_span_md`: number = 8 (stacked, full-width on medium)
- `column_span_sm`: number = 4 (stacked, full-width on small)
- `heading_text`: string (e.g., "Data Table Example")
- `column_headers`: array of strings (e.g., ["ID", "Name", "Status", "Date"])
- `rows`: array of TableRow (count: 10)

**Relationships**:

- Belongs to Page A
- Contains multiple TableRow entities

**Validation Rules**:

- Must occupy exactly 12 columns on large viewports
- Must include exactly 10 sample rows (per spec clarification)
- Must use Carbon's `<cds-table>` component structure (static, no expansion/sorting)

---

### TableRow

**Description**: A single row of sample data in the DataTable.

**Attributes**:

- `id`: string (e.g., "001", "002", ...)
- `name`: string (placeholder names)
- `status`: string (e.g., "Active", "Pending", "Complete")
- `date`: string (formatted date placeholder)

**Relationships**:

- Belongs to DataTable

**Validation Rules**:

- Static content only (no data binding)
- Uses `<cds-table-row>` and `<cds-table-cell>` components

---

### SideNavigation

**Description**: Carbon UI Shell side navigation component (left column of Page B).

**Attributes**:

- `column_span_lg`: number = 3 (large viewport)
- `is_fixed`: boolean = true
- `nav_items`: array of NavigationItem (sample links, count: 4-6)

**Relationships**:

- Belongs to Page B
- Contains multiple NavigationItem entities

**Validation Rules**:

- Must occupy exactly 3 columns on large viewports
- Must use `<cds-side-nav>` and related Carbon UI Shell components
- Must import UI Shell index (`@carbon/web-components/es/components/ui-shell/index`)

---

### NavigationItem

**Description**: A single navigation link in the SideNavigation.

**Attributes**:

- `label`: string (e.g., "Dashboard", "Reports", "Settings")
- `href`: string (placeholder, e.g., "#dashboard")
- `is_active`: boolean (one item marked active for demo)

**Relationships**:

- Belongs to SideNavigation

**Validation Rules**:

- Uses `<cds-side-nav-link>` component
- Links are non-functional (href="#" or placeholder)

---

### ContentSection

**Description**: A generic content block used in Page B (right column) and Page C (full-width).

**Attributes**:

- `column_span_lg`: number (13 for Page B, 16 for Page C)
- `column_span_md`: number (8 for both)
- `column_span_sm`: number (4 for both)
- `heading`: string (e.g., "Section Title")
- `body_text`: string (placeholder paragraph text)
- `has_image`: boolean (optional)
- `image_src`: string (if has_image)
- `image_width`: number (required if has_image)
- `image_height`: number (required if has_image)

**Relationships**:

- Belongs to Page (B or C)

**Validation Rules**:

- Must use BEM class `.content-section`
- Images MUST include width and height attributes (constitution requirement)
- Page B: 4 content sections in content area
- Page C: 4 content sections demonstrating single-column flow

---

## Data Relationships Diagram

```
Page
 ├─ FilterPanel (Page A only)
 │   └─ FilterControl[] (count: 5)
 ├─ DataTable (Page A only)
 │   └─ TableRow[] (count: 10)
 ├─ SideNavigation (Page B only)
 │   └─ NavigationItem[] (count: 4-6)
 └─ ContentSection[] (Page B: 4, Page C: 4)
```

---

## State Transitions

**N/A** - All entities are static. No state changes occur. Pages are rendered once and do not respond to user
interactions.

---

## Validation Summary

| Entity         | Key Constraint                                        | Source                                       |
| -------------- | ----------------------------------------------------- | -------------------------------------------- |
| FilterPanel    | Exactly 4 columns (lg), 5 controls                    | Clarification Q1, Q3                         |
| DataTable      | Exactly 12 columns (lg), 10 rows                      | Clarification Q1, Q3                         |
| SideNavigation | Exactly 3 columns (lg)                                | Clarification Q2                             |
| ContentSection | 4 sections per page (B, C)                            | Clarification Q3                             |
| Images         | Must have width/height attributes                     | Constitution (Grid Integrity), FR-006        |
| All Entities   | BEM naming, Carbon grid classes on content containers | Constitution (Grid Integrity, BEM Alignment) |

---

## Notes

- This is a conceptual data model for static content, not a persistent data schema.
- No database, API, or backend storage is involved.
- Entities represent the structure of the HTML/DOM, not runtime objects.
- Validation rules map directly to functional requirements and constitution principles.
