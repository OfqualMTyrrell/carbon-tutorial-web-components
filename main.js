// === Global Application JavaScript ===
// Imports Carbon styles and components used across all pages

// Import Carbon styles (must be first)
import './style.scss';

// Import Carbon Web Components
import '@carbon/web-components/es/components/button/button.js';
import '@carbon/web-components/es/components/ui-shell/index';
import '@carbon/web-components/es/components/checkbox/index';
import '@carbon/web-components/es/components/content-switcher/index';
import '@carbon/web-components/es/components/skip-to-content/index.js';

// Get body element for theme management
const bodyEl = document.querySelector('body');

// === Panel Management ===
// Close other panels when one is opened
const handleGlobalActionClick = (ev) => {
  const targetPanelId = ev.currentTarget.getAttribute('panel-id');
  const panels = document.querySelectorAll('cds-header-panel');

  panels.forEach((panel) => {
    if (panel.id !== targetPanelId) {
      panel.expanded = false;
    }
  });
};

// Attach click handlers to all global actions
const globalActions = document.querySelectorAll('cds-header-global-action');
[...globalActions].forEach((action) => action.addEventListener('click', handleGlobalActionClick));

// === Theme Switching ===
// Handle theme selection: light, dark, or system preference
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
    default:
      // System theme: remove explicit theme classes
      bodyEl.classList.remove('g10');
      bodyEl.classList.remove('g100');
  }
};

document.querySelector('.theme-selector').addEventListener('cds-content-switcher-selected', handleSwitch);

// === Header Compliment Theme ===
// Toggle header theme (inverts header color relative to body)
const handleHeaderCompliment = (ev) => {
  document.querySelector('cds-header').classList.toggle('compliment', ev.target.checked);
};

document.querySelector('.theme-header__compliment').addEventListener('cds-checkbox-changed', handleHeaderCompliment);
