// Pet Display Component
// Renders the pet standing in front of its house, plus name and description

import { formatDate } from '../utils/helpers.js';
import { getFallbackIcon, normalizeAppearance } from '../petParts.js?v=acc-2';
import PetAvatar from './petAvatar.js?v=acc-2';

const PetDisplay = {
  container: null,

  init() {
    this.container = document.getElementById('pet-display');
  },

  render(pet) {
    if (!this.container) {
      console.error('Pet display container not found');
      return;
    }

    if (!pet) {
      this.container.innerHTML = '<p class="no-pet">No pet found</p>';
      return;
    }

    const appearance = normalizeAppearance(pet.type, pet.appearance);
    const description = pet.description
      ? `<p class="pet-description">${this.escapeHtml(pet.description)}</p>`
      : '';

    this.container.innerHTML = `
      <div class="pet-card">
        <div class="pet-yard">
          <div class="pet-yard-sky"></div>
          <div class="pet-yard-grass"></div>
          <div class="pet-house pet-house--stage" aria-hidden="true">
            <div class="pet-house-roof"></div>
            <div class="pet-house-body">
              <div class="pet-house-door"></div>
            </div>
          </div>
          <div class="pet-figure" id="pet-figure-mount"></div>
        </div>
        <div class="pet-info">
          <h2 class="pet-name">${this.escapeHtml(pet.name)}</h2>
          <p class="pet-type-badge">${this.capitalize(pet.type)}</p>
          ${description}
          <p class="pet-created">Created: ${formatDate(pet.createdAt)}</p>
        </div>
      </div>
    `;

    const figureMount = this.container.querySelector('#pet-figure-mount');
    PetAvatar.render(figureMount, {
      type: pet.type,
      appearance,
      sizeClass: 'pet-avatar--stage'
    });

    // Keep emoji fallback on the pet object for older code paths / debugging
    pet.icon = pet.icon || getFallbackIcon(pet.type);
  },

  update(pet) {
    if (!this.container || !pet) return;

    const nameEl = this.container.querySelector('.pet-name');
    const descriptionEl = this.container.querySelector('.pet-description');
    const figureMount = this.container.querySelector('#pet-figure-mount');

    if (nameEl) nameEl.textContent = pet.name;
    if (descriptionEl) descriptionEl.textContent = pet.description || '';

    if (figureMount) {
      PetAvatar.render(figureMount, {
        type: pet.type,
        appearance: normalizeAppearance(pet.type, pet.appearance),
        sizeClass: 'pet-avatar--stage'
      });
    }
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
};

export default PetDisplay;
