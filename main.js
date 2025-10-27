import './style.scss';
import '@carbon/web-components/es/components/button/button.js';
import '@carbon/web-components/es/components/ui-shell/index';
import '@carbon/web-components/es/components/checkbox/index';
import '@carbon/web-components/es/components/content-switcher/index';
import '@carbon/web-components/es/components/skip-to-content/index.js';

const bodyEl = document.querySelector('body');

const handleGlobalActionClick = (ev) => {
  const targetPanelId = ev.currentTarget.getAttribute('panel-id');
  const panels = document.querySelectorAll('cds-header-panel');
  // check to see if other panels are open and close them
  panels.forEach((panel) => {
    if (panel.id !== targetPanelId) {
      panel.expanded = false;
    }
  });
};

document.querySelectorAll('cds-header-global-action').forEach((action) => {
  action.addEventListener('click', handleGlobalActionClick);
});

const handleSwitch = (ev) => {
  // Applies new theme or defers to system preferences by removing theme
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

document
  .querySelector('.theme-selector')
  ?.addEventListener('cds-content-switcher-selected', handleSwitch);

// set initial theme based on preferences
if (matchMedia('(prefers-color-scheme: dark)').matches) {
  bodyEl.classList.add('g100');
} else {
  bodyEl.classList.add('g10');
}

const handleCompliment = (ev) => {
  const headerEl = document.querySelector('header');
  if (ev.target.checked) {
    headerEl.classList.add('compliment');
  } else {
    headerEl.classList.remove('compliment');
  }
};

document
  .querySelector('#header-compliment')
  ?.addEventListener('cds-checkbox-changed', handleCompliment);
