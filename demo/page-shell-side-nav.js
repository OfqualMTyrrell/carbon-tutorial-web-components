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

// 2. Import Carbon components (only what this page needs)
// UI Shell index import brings in header, side nav, and related components
import '@carbon/web-components/es/components/ui-shell/index';
import '@carbon/web-components/es/components/skip-to-content/index';
