// === Landing Page JavaScript ===
// Handles landing page-specific components: breadcrumb, tabs, and info cards

// Import landing page components
import '@carbon/web-components/es/components/breadcrumb/index';
import '@carbon/web-components/es/components/tabs/index';

// === Info Card Data ===
// Data for the three principle cards (Open, Modular, Consistent)
const infoCardDetails = [
  {
    strongMsg: 'Open',
    bodyMsg: `It's a distributed effort, guided by the principles of the open-source movement.
Carbon's users are also it's makers, and everyone is encouraged to contribute.`,
    pictogramName: 'advocate',
  },
  {
    strongMsg: 'Modular',
    bodyMsg: `Carbon's modularity ensures maximum flexibility in execution. It's components
are designed to work seamlessly with each other, in whichever combination suits
the needs of the user.`,
    pictogramName: 'accelerating-transformation',
  },
  {
    strongMsg: 'Consistent',
    bodyMsg: `Based on the comprehensive IBM Design Language, every element and component of
Carbon was designed from the ground up to work elegantly together to ensure consistent,
cohesive user experiences.`,
    pictogramName: 'globe',
  },
];

// === Template Population ===
// Clone info card template and populate with data
const updateInfoCard = (here, { strongMsg, bodyMsg, pictogramName }) => {
  const infoCardTemplate = document.querySelector(
    'template#template--info-card',
  );

  if (here && infoCardTemplate) {
    // Clone template content
    const newInfoCard = infoCardTemplate.content.cloneNode(true);

    // Populate strong text (Open, Modular, Consistent)
    const strongEl = newInfoCard.querySelector('.info-card__heading--strong');
    strongEl.innerHTML = strongMsg;

    // Populate body description
    const infoBodyEl = newInfoCard.querySelector('.info-card__body');
    infoBodyEl.innerHTML = bodyMsg;

    // Add pictogram modifier class (e.g., info-card__pictogram--advocate)
    const pictogramEl = newInfoCard.querySelector('.info-card__pictogram');
    pictogramEl.classList.add(`info-card__pictogram--${pictogramName}`);

    // Replace placeholder with populated template
    here.innerHTML = '';
    here.replaceWith(newInfoCard);
  }
};

// === Initialize Info Cards ===
// Find all info card placeholders and populate them with template content
const infoCards = document.querySelectorAll('.info-card');
[...infoCards].forEach((infoCard, index) => {
  updateInfoCard(infoCard, infoCardDetails[index]);
});
