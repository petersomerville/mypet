// Pet Display Component
// Renders the pet with icon, name, and description

import { formatDate } from '../utils/helpers.js';

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

    this.container.innerHTML = `
      <div class="pet-card">
        <div class="pet-icon-container">
          <span class="pet-icon" aria-label="${pet.type}">${pet.icon}</span>
        </div>
        <div class="pet-info">
          <h2 class="pet-name">${this.escapeHtml(pet.name)}</h2>
          <p class="pet-type-badge">${this.capitalize(pet.type)}</p>
          <p class="pet-description">${this.escapeHtml(pet.description)}</p>
          <p class="pet-created">Created: ${formatDate(pet.createdAt)}</p>
        </div>
      </div>
    `;
  },

  update(pet) {
    if (!this.container || !pet) return;

    const iconEl = this.container.querySelector('.pet-icon');
    const nameEl = this.container.querySelector('.pet-name');
    const descriptionEl = this.container.querySelector('.pet-description');

    if (iconEl) iconEl.textContent = pet.icon;
    if (nameEl) nameEl.textContent = pet.name;
    if (descriptionEl) descriptionEl.textContent = pet.description;
  },

  // Helper to escape HTML and prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Helper to capitalize first letter
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
