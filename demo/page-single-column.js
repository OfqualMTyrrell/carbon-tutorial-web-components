/**
 * Page C: Single Column Layout
 *
 * Constitution compliance:
 * - Styles imported FIRST (before components)
 * - Page-specific JS module for code-splitting
 * - Minimal component imports (only skip-to-content needed)
 */

// 1. Import styles FIRST (constitution requirement: Import Discipline)
import './demo-style.scss';

// 2. Import Carbon components (only what this page needs)
import '@carbon/web-components/es/components/skip-to-content/index';
import '@carbon/web-components/es/components/ui-shell/index';
