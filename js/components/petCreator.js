// Pet Creator Component
// Handles pet creation form, appearance builder, and validation

import { StateManager } from '../state.js?v=local-time';
import {
  APPEARANCE_SLOTS,
  COLOR_SWATCHES,
  PET_PARTS,
  getDefaultAppearance,
  normalizeAppearance
} from '../petParts.js?v=local-time';
import PetAvatar from './petAvatar.js?v=local-time';
import { validateName, validateDescription, showError, showSuccess } from '../utils/helpers.js';

const SLOT_LABELS = {
  base: 'Face',
  eyes: 'Eyes',
  pattern: 'Pattern',
  collar: 'Collar',
  accessory: 'Accessory'
};

const PetCreator = {
  selectedType: null,
  appearance: null,

  init() {
    this.appearanceSection = document.getElementById('appearance-builder');
    this.previewMount = document.getElementById('appearance-preview');
    this.slotMenus = document.getElementById('appearance-slot-menus');
    this.colorSwatches = document.getElementById('color-swatches');
    this.colorInput = document.getElementById('pet-color');
    this.bindEvents();
    this.hideAppearanceBuilder();
  },

  bindEvents() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectType(btn.dataset.type);
      });
    });

    const form = document.getElementById('pet-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit(e);
      });
    }

    if (this.colorInput) {
      this.colorInput.addEventListener('input', (e) => {
        this.setColor(e.target.value);
      });
    }
  },

  selectType(type) {
    this.selectedType = type;
    this.appearance = getDefaultAppearance(type);

    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.type === type);
    });

    const typeInput = document.getElementById('pet-type');
    if (typeInput) {
      typeInput.value = type;
    }

    this.showAppearanceBuilder();
    this.renderAppearanceControls();
    this.refreshPreview();
  },

  showAppearanceBuilder() {
    if (this.appearanceSection) {
      this.appearanceSection.classList.remove('hidden');
    }
  },

  hideAppearanceBuilder() {
    if (this.appearanceSection) {
      this.appearanceSection.classList.add('hidden');
    }
  },

  renderAppearanceControls() {
    if (!this.selectedType || !this.slotMenus || !this.colorSwatches) return;

    const catalog = PET_PARTS[this.selectedType];
    this.slotMenus.innerHTML = APPEARANCE_SLOTS.map(slot => {
      const options = catalog[slot]
        .map(part => `
          <button
            type="button"
            class="part-option ${this.appearance[slot] === part.id ? 'selected' : ''}"
            data-slot="${slot}"
            data-part-id="${part.id}"
            aria-label="${SLOT_LABELS[slot]}: ${part.label}"
            aria-pressed="${this.appearance[slot] === part.id}"
          >
            <span class="part-option-preview" data-slot="${slot}" data-part-id="${part.id}"></span>
            <span class="part-option-label">${part.label}</span>
          </button>
        `)
        .join('');

      return `
        <div class="appearance-slot" data-slot-group="${slot}">
          <p class="appearance-slot-label">${SLOT_LABELS[slot]}</p>
          <div class="part-option-row">
            ${options}
          </div>
        </div>
      `;
    }).join('');

    this.slotMenus.querySelectorAll('.part-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectPart(btn.dataset.slot, btn.dataset.partId);
      });
    });

    // Mini previews inside option buttons
    this.slotMenus.querySelectorAll('.part-option-preview').forEach(mount => {
      const slot = mount.dataset.slot;
      const partId = mount.dataset.partId;
      const miniAppearance = {
        ...this.appearance,
        [slot]: partId
      };
      // For non-base slots, still show full stack so choice context is clear
      PetAvatar.render(mount, {
        type: this.selectedType,
        appearance: miniAppearance,
        sizeClass: 'pet-avatar--thumb'
      });
    });

    this.colorSwatches.innerHTML = COLOR_SWATCHES.map(swatch => `
      <button
        type="button"
        class="color-swatch ${this.appearance.color.toLowerCase() === swatch.value.toLowerCase() ? 'selected' : ''}"
        data-color="${swatch.value}"
        aria-label="${swatch.label}"
        title="${swatch.label}"
        style="--swatch-color: ${swatch.value}"
      ></button>
    `).join('');

    this.colorSwatches.querySelectorAll('.color-swatch').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.setColor(btn.dataset.color);
      });
    });

    if (this.colorInput) {
      this.colorInput.value = this.appearance.color;
    }
  },

  selectPart(slot, partId) {
    if (!this.appearance || !slot || !partId) return;
    this.appearance = normalizeAppearance(this.selectedType, {
      ...this.appearance,
      [slot]: partId
    });

    if (this.slotMenus) {
      this.slotMenus.querySelectorAll(`.part-option[data-slot="${slot}"]`).forEach(btn => {
        const selected = btn.dataset.partId === partId;
        btn.classList.toggle('selected', selected);
        btn.setAttribute('aria-pressed', String(selected));
      });
    }

    this.refreshPreview();
  },

  setColor(color) {
    if (!this.appearance) return;
    this.appearance = normalizeAppearance(this.selectedType, {
      ...this.appearance,
      color
    });

    if (this.colorInput) {
      this.colorInput.value = this.appearance.color;
    }

    if (this.colorSwatches) {
      this.colorSwatches.querySelectorAll('.color-swatch').forEach(btn => {
        btn.classList.toggle(
          'selected',
          btn.dataset.color.toLowerCase() === this.appearance.color.toLowerCase()
        );
      });
    }

    this.refreshPreview();
  },

  refreshPreview() {
    if (!this.previewMount || !this.selectedType || !this.appearance) return;
    PetAvatar.render(this.previewMount, {
      type: this.selectedType,
      appearance: this.appearance,
      sizeClass: 'pet-avatar--preview'
    });
  },

  handleSubmit(event) {
    const formData = new FormData(event.target);
    const type = formData.get('type');
    const name = formData.get('name');
    const description = formData.get('description');

    if (!type || (type !== 'cat' && type !== 'dog')) {
      showError('Please select a pet type');
      return;
    }

    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      showError(nameValidation.error);
      return;
    }

    const descriptionValidation = validateDescription(description);
    if (!descriptionValidation.valid) {
      showError(descriptionValidation.error);
      return;
    }

    const appearance = normalizeAppearance(
      type,
      this.appearance || getDefaultAppearance(type)
    );

    const result = StateManager.createPet(
      nameValidation.value,
      type,
      descriptionValidation.value,
      appearance
    );

    if (result.success) {
      showSuccess('Pet created successfully!');

      window.dispatchEvent(new CustomEvent('petCreated', {
        detail: { pet: StateManager.getCurrentPet() }
      }));

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
    this.appearance = null;

    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.classList.remove('selected');
    });

    if (this.slotMenus) this.slotMenus.innerHTML = '';
    if (this.colorSwatches) this.colorSwatches.innerHTML = '';
    if (this.previewMount) this.previewMount.innerHTML = '';
    this.hideAppearanceBuilder();
  },

  destroy() {
    this.selectedType = null;
    this.appearance = null;
  }
};

export default PetCreator;
