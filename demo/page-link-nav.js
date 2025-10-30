/**
 * Link Navigation Layout Page
 *
 * Constitution compliance:
 * - Styles imported FIRST (before components)
 * - Page-specific JS module for code-splitting
 * - Component imports only what this page needs
 */

// 1. Import styles FIRST (constitution requirement: Import Discipline)
import './demo-style.scss';

// 2. Import Carbon components (only what this page needs)
// UI Shell index import brings in header, side nav, and related components
import '@carbon/web-components/es/components/ui-shell/index';
import '@carbon/web-components/es/components/skip-to-content/index';

// Link component for navigation pattern
import '@carbon/web-components/es/components/link/index';

// Stack component for vertical layout
import '@carbon/web-components/es/components/stack/index';

// Tile component for content sections
import '@carbon/web-components/es/components/tile/index';

/**
 * Link Navigation Interaction
 *
 * Handles active state management for link navigation pattern.
 * Updates aria-current and visual indicator when links are clicked.
 */

const linkNavItems = document.querySelectorAll('.link-nav__item');
const links = document.querySelectorAll('.link-nav__item cds-link');

links.forEach((link, index) => {
  link.addEventListener('click', (event) => {
    // Prevent default navigation for demo purposes
    event.preventDefault();

    // Remove active state from all items
    linkNavItems.forEach((item) => {
      item.classList.remove('link-nav__item--active');
      const linkEl = item.querySelector('cds-link');
      if (linkEl) {
        linkEl.removeAttribute('aria-current');
      }
    });

    // Add active state to clicked item
    linkNavItems[index].classList.add('link-nav__item--active');
    link.setAttribute('aria-current', 'page');
  });
});
