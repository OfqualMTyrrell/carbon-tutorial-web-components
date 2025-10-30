/**
 * Page A: Filter Panel + Data Table Layout
 *
 * Constitution compliance:
 * - Styles imported FIRST (before components)
 * - Page-specific JS module for code-splitting
 * - Components imported on-demand
 */

// 1. Import styles FIRST (constitution requirement: Import Discipline)
import './demo-style.scss';

// 2. Import Carbon components (only what this page needs)
import '@carbon/web-components/es/components/skip-to-content/index';
import '@carbon/web-components/es/components/data-table/index';
import '@carbon/web-components/es/components/ui-shell/index';
import '@carbon/web-components/es/components/checkbox/index';
import '@carbon/web-components/es/components/dropdown/index';
import '@carbon/web-components/es/components/text-input/index';
