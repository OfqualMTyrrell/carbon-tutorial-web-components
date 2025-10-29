/**
 * Page B: UI Shell + Side Navigation Layout
 *
 * Constitution compliance:
 * - Styles imported FIRST (before components)
 * - Page-specific JS module for code-splitting
 * - UI Shell index import for grouped components
 */

// 1. Import styles FIRST (constitution requirement: Import Discipline)
import './demo-style.scss';

// 2. Import Carbon icons for mobile navigation toggle
import Menu from '@carbon/icons/es/menu/20';
import Close from '@carbon/icons/es/close/20';

// 3. Import Carbon components (only what this page needs)
// UI Shell index import brings in header, side nav, and related components
import '@carbon/web-components/es/components/ui-shell/index';
import '@carbon/web-components/es/components/skip-to-content/index';
import '@carbon/web-components/es/components/button/index';

/**
 * Mobile Navigation State Management
 * Constitution: Accessibility & Quality Gates (ARIA state management)
 */

// T013: Navigation state variable
let isMobileNavOpen = false;

// DOM element references (initialized after DOM loads)
let mobileNavToggle;
let mobileNav;
let backdrop;
let firstNavLink;
let focusTrapHandler; // Store handler reference for removal

/**
 * T014: Open mobile navigation
 * - Adds open class to side nav for slide-in animation
 * - Shows backdrop with visible class
 * - Locks body scroll to prevent page scrolling
 * - Updates button ARIA state and icon
 * - Moves focus to first navigation link
 * - T035: Implements focus trap to keep focus within navigation
 */
function openMobileNav() {
  if (isMobileNavOpen) return; // Already open

  isMobileNavOpen = true;

  // Add classes for visual state
  mobileNav.classList.add('mobile-nav--open');
  backdrop.classList.add('mobile-nav-backdrop--visible');

  // Lock body scroll
  document.body.style.overflow = 'hidden';

  // Update button ARIA state
  mobileNavToggle.setAttribute('aria-expanded', 'true');
  mobileNavToggle.setAttribute('aria-label', 'Close navigation menu');

  // Change icon to Close (X)
  const closeIcon = Close();
  mobileNavToggle.innerHTML = typeof closeIcon === 'string' ? closeIcon : closeIcon.strings[0];

  // T035: Add focus trap - keep focus within navigation when open
  focusTrapHandler = (e) => {
    if (e.key === 'Tab') {
      const navLinks = Array.from(mobileNav.querySelectorAll('cds-side-nav-link'));
      const focusableElements = [mobileNavToggle, ...navLinks];
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      // Shift+Tab on first element: go to last
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
      // Tab on last element: go to first
      else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  document.addEventListener('keydown', focusTrapHandler);

  // Move focus to first navigation link for keyboard accessibility
  if (firstNavLink) {
    // Small delay to let animation start
    setTimeout(() => firstNavLink.focus(), 100);
  }
}

/**
 * T015: Close mobile navigation
 * - Removes open class from side nav
 * - Hides backdrop
 * - Unlocks body scroll
 * - Updates button ARIA state and icon
 * - Returns focus to button
 * - T036: Removes focus trap listeners
 */
function closeMobileNav() {
  if (!isMobileNavOpen) return; // Already closed

  isMobileNavOpen = false;

  // Remove classes for visual state
  mobileNav.classList.remove('mobile-nav--open');
  backdrop.classList.remove('mobile-nav-backdrop--visible');

  // Unlock body scroll
  document.body.style.overflow = '';

  // Update button ARIA state
  mobileNavToggle.setAttribute('aria-expanded', 'false');
  mobileNavToggle.setAttribute('aria-label', 'Open navigation menu');

  // Change icon to Menu (hamburger)
  const menuIcon = Menu();
  mobileNavToggle.innerHTML = typeof menuIcon === 'string' ? menuIcon : menuIcon.strings[0];

  // T036: Remove focus trap listener
  if (focusTrapHandler) {
    document.removeEventListener('keydown', focusTrapHandler);
    focusTrapHandler = null;
  }

  // Return focus to button for keyboard accessibility
  mobileNavToggle.focus();
}

/**
 * T016: Toggle mobile navigation
 * Checks current state and calls appropriate function
 */
function toggleMobileNav() {
  if (isMobileNavOpen) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
}

/**
 * Initialize mobile navigation after DOM loads
 * T018: Button click listener
 * T019: Backdrop click listener
 * T024: Navigation link click handlers
 * T027: Window resize listener
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM element references
  mobileNavToggle = document.getElementById('mobile-nav-toggle');
  mobileNav = document.getElementById('mobile-side-nav');
  backdrop = document.querySelector('.mobile-nav-backdrop');
  firstNavLink = mobileNav?.querySelector('cds-side-nav-link');

  // Verify all elements exist
  if (!mobileNavToggle || !mobileNav || !backdrop) {
    console.error('Mobile navigation elements not found');
    return;
  }

  // T018: Add button click listener
  mobileNavToggle.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMobileNav();
  });

  // T019: Add backdrop click listener
  backdrop.addEventListener('click', () => {
    closeMobileNav();
  });

  // T024: Add navigation link click handlers to close nav on mobile
  const navLinks = mobileNav.querySelectorAll('cds-side-nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      // Only close on mobile (< lg breakpoint)
      if (window.innerWidth < 1056 && isMobileNavOpen) {
        closeMobileNav();
      }
    });
  });

  // T027: Add window resize listener for responsive behavior
  let resizeTimeout;
  window.addEventListener('resize', () => {
    // Debounce resize events to avoid excessive function calls
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleBreakpointChange, 150);
  });

  // T033: Add Escape key listener for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileNavOpen) {
      closeMobileNav();
    }
  });

  // Initialize button with Menu icon
  const menuIcon = Menu();
  mobileNavToggle.innerHTML = typeof menuIcon === 'string' ? menuIcon : menuIcon.strings[0];
});

/**
 * T028: Handle breakpoint changes on window resize
 * Detects when viewport crosses the 1056px (lg) threshold
 * Auto-closes navigation if resizing from mobile to desktop while nav is open
 */
function handleBreakpointChange() {
  const isDesktop = window.innerWidth >= 1056; // lg breakpoint

  // If resizing to desktop and nav is open, close it
  if (isDesktop && isMobileNavOpen) {
    // Clean up mobile-specific styles without animation
    mobileNav.classList.remove('mobile-nav--open');
    backdrop.classList.remove('mobile-nav-backdrop--visible');

    // Unlock body scroll
    document.body.style.overflow = '';

    // Reset state
    isMobileNavOpen = false;

    // Reset button ARIA (even though button is hidden at desktop)
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNavToggle.setAttribute('aria-label', 'Open navigation menu');
    const menuIcon = Menu();
    mobileNavToggle.innerHTML = typeof menuIcon === 'string' ? menuIcon : menuIcon.strings[0];
  }
}
