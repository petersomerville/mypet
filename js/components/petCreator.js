// Pet Creator Component
// Handles pet creation form and validation

import { StateManager } from '../state.js';
import { validateName, validateDescription, showError, showSuccess } from '../utils/helpers.js';

const PetCreator = {
  selectedType: null,

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Type selection buttons
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectType(btn.dataset.type);
      });
    });

    // Form submission
    const form = document.getElementById('pet-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit(e);
      });
    }
  },

  selectType(type) {
    this.selectedType = type;

    // Update UI to show selection
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
      if (btn.dataset.type === type) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });

    // Set hidden input value
    const typeInput = document.getElementById('pet-type');
    if (typeInput) {
      typeInput.value = type;
    }
  },

  handleSubmit(event) {
    const formData = new FormData(event.target);
    const type = formData.get('type');
    const name = formData.get('name');
    const description = formData.get('description');

    // Validate type
    if (!type || (type !== 'cat' && type !== 'dog')) {
      showError('Please select a pet type');
      return;
    }

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      showError(nameValidation.error);
      return;
    }

    // Validate description
    const descriptionValidation = validateDescription(description);
    if (!descriptionValidation.valid) {
      showError(descriptionValidation.error);
      return;
    }

    // Create pet
    const result = StateManager.createPet(
      nameValidation.value,
      type,
      descriptionValidation.value
    );

    if (result.success) {
      showSuccess('Pet created successfully!');

      // Trigger custom event for app to handle view switch
      const event = new CustomEvent('petCreated', {
        detail: { pet: StateManager.getCurrentPet() }
      });
      window.dispatchEvent(event);

      // Reset form
      this.reset();
    } else {
      showError(result.message || 'Failed to create pet');
    }
  },

  reset() {
    const form = document.getElementById('pet-form');
    if (form) {
      form.reset();
    }

    this.selectedType = null;

    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
      btn.classList.remove('selected');
    });
  },

  destroy() {
    // Cleanup if needed
    this.selectedType = null;
  }
};

export default PetCreator;
