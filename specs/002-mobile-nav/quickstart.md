# Quickstart Guide

**Feature**: Mobile Navigation Menu Button  
**Date**: 2025-10-29

## Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)
- VS Code (recommended for debugging)

## Initial Setup

```powershell
# 1. Ensure you're on the feature branch
git checkout 002-mobile-nav

# 2. Install dependencies (if not already done)
pnpm install

# 3. Start development server
pnpm run dev
```

## Testing the Feature

### Desktop View (≥1056px)

1. Open browser to `http://localhost:5173/repositories.html`
2. **Expected**: Menu button is NOT visible
3. **Expected**: Side navigation is always visible (static positioning)
4. Resize browser to wide viewport (>1056px) to verify button disappears

### Mobile View (<1056px)

1. Open browser to `http://localhost:5173/repositories.html`
2. Open DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar mobile device
4. **Expected**: Menu button visible in top-left corner
5. **Expected**: Side navigation hidden by default

### Feature Interactions

**Opening Navigation**:

1. Click menu button
2. **Expected**: Side nav slides in from left (240ms animation)
3. **Expected**: Backdrop appears behind nav
4. **Expected**: Page content behind cannot scroll (body overflow hidden)
5. **Expected**: Focus moves to first nav item
6. **Expected**: Button icon changes to "close" icon
7. **Expected**: Button `aria-expanded` changes to "true"

**Closing Navigation** (3 methods):

1. **Method 1 - Button click**:
   - Click close button
   - **Expected**: Nav slides out, backdrop disappears, focus returns to button

2. **Method 2 - Backdrop click**:
   - Click dark backdrop area
   - **Expected**: Nav slides out, backdrop disappears, focus returns to button

3. **Method 3 - Escape key**:
   - Press Escape key
   - **Expected**: Nav slides out, backdrop disappears, focus returns to button

**Responsive Behavior**:

1. Open navigation on mobile viewport (<1056px)
2. Resize browser to desktop (≥1056px)
3. **Expected**: Navigation auto-closes
4. **Expected**: Button disappears
5. **Expected**: Side nav returns to static desktop layout

## Testing Accessibility

### Keyboard Navigation

```powershell
# 1. Open mobile viewport
# 2. Tab to menu button
# 3. Press Enter to open
# Expected: Nav opens, focus moves to first nav item

# 4. Tab through nav items
# Expected: Focus stays within navigation (focus trap)

# 5. Press Escape
# Expected: Nav closes, focus returns to button

# 6. Tab past button
# Expected: Focus moves to page content
```

### Screen Reader Testing (Windows + NVDA)

```powershell
# 1. Start NVDA (Insert+Ctrl+N)
# 2. Navigate to menu button
# Expected: "Open navigation menu, button, collapsed"

# 3. Press Enter to open
# Expected: "Open navigation menu, button, expanded"

# 4. Navigate through side nav items
# Expected: Each link announced correctly

# 5. Press Escape to close
# Expected: Focus returns to button, "collapsed" announced
```

## Linting & Validation

```powershell
# Check SCSS styles
pnpm run lint:style

# Check JavaScript code quality
pnpm run lint:es

# Format all code
pnpm run lint:format

# Check for typos
pnpm run lint:spell
```

**Expected Results**: All linters should pass with no errors related to mobile nav code.

## Visual Regression Testing

### Manual Visual Checks

1. **Button placement**: Top-left corner, no overlap with page content
2. **Button styling**: Ghost button appearance, 44x44px minimum touch target
3. **Nav overlay**: Slides from left edge, no gaps
4. **Backdrop**: Covers entire viewport, semi-transparent
5. **Animation smoothness**: 60fps slide animation, no jank
6. **Theme compatibility**: Test both white and g100 themes

### Reduced Motion

```powershell
# Windows: Settings > Accessibility > Visual effects > Animation effects (OFF)
# Then refresh page and test navigation
# Expected: Instant transitions (no slide animation)
```

## Common Issues & Debugging

### Issue: Button not visible on mobile

**Check**:

```javascript
// In browser DevTools Console
window.innerWidth < 1056; // Should be true
document.querySelector('.mobile-nav-toggle'); // Should return button element
```

**Fix**: Verify breakpoint logic in CSS, ensure button has correct display style.

### Issue: Navigation doesn't open

**Check**:

```javascript
// In browser DevTools Console
const button = document.querySelector('.mobile-nav-toggle');
button.getAttribute('aria-expanded'); // Should be 'false' initially
button.click(); // Manually trigger
```

**Fix**: Check JavaScript event listener registration, verify handler function is called.

### Issue: Body still scrolls when nav is open

**Check**:

```javascript
// In browser DevTools Console
document.body.style.overflow; // Should be 'hidden' when open
```

**Fix**: Verify scroll lock logic in open handler, check for CSS conflicts.

### Issue: Focus trap not working

**Check**:

```javascript
// In browser DevTools Console
document.activeElement; // Should be within side nav when open
```

**Fix**: Verify focus management logic, check tab event listener is registered.

## File Locations

After implementation, modified files will be:

```
demo/
  page-shell-side-nav.html    # Added button, backdrop elements
  page-shell-side-nav.js      # Added toggle logic, event handlers
  demo-style.scss             # Added mobile nav styles

public/
  menu.svg                    # Menu icon (if not exists)
  close.svg                   # Close icon (if not exists)
```

## Next Steps After Implementation

1. Run full linting suite: `pnpm run lint:style && pnpm run lint:es`
2. Test all three close methods (button, backdrop, Escape)
3. Test keyboard navigation with Tab and Escape keys
4. Test responsive behavior (resize from mobile to desktop)
5. Test reduced motion preference
6. Test with screen reader (NVDA/JAWS on Windows)
7. Commit changes with descriptive message
8. Push branch and open PR

## Performance Benchmarks

**Expected Performance**:

- Animation duration: 240ms (Carbon $duration-moderate-02)
- Frame rate: 60fps during slide animation
- Button click response: <50ms
- No layout shift (CLS = 0)
- No impact on page load time (feature is enhancement only)

**Measuring Performance**:

```javascript
// In browser DevTools Console
performance.mark('nav-open-start');
// Click button to open
performance.mark('nav-open-end');
performance.measure('nav-open', 'nav-open-start', 'nav-open-end');
performance.getEntriesByName('nav-open')[0].duration; // Should be ~240ms
```

## Summary

This feature is a client-side UI enhancement with no server dependencies, no data persistence, and no complex state
management. Testing focuses on responsive behavior, accessibility, and animation performance. All interactions should
follow Carbon Design System patterns and meet WCAG 2.1 Level AA accessibility standards.
