// Activity Controls Component
// Provides interactive buttons for pet activities

import { StateManager } from '../state.js';
import { showError, showSuccess } from '../utils/helpers.js';

const ActivityControls = {
  container: null,
  onActivityPerformed: null,

  init(onActivityCallback) {
    this.container = document.getElementById('activity-controls');
    this.onActivityPerformed = onActivityCallback;
  },

  render() {
    if (!this.container) {
      console.error('Activity controls container not found');
      return;
    }

    this.container.innerHTML = `
      <div class="activities-container">
        <h3 class="activities-title">Activities</h3>
        <div class="activity-buttons">
          ${this.renderActivityButton('feed', 'Feed', '🍖', 'Increase hunger by 20')}
          ${this.renderActivityButton('walk', 'Walk', '🚶', 'Increase energy by 20')}
          ${this.renderActivityButton('play', 'Play', '🎾', 'Increase happiness by 20')}
        </div>
      </div>
    `;

    this.bindEvents();
  },

  renderActivityButton(type, label, icon, description) {
    return `
      <button
        class="activity-btn"
        data-activity="${type}"
        aria-label="${description}"
      >
        <span class="activity-icon">${icon}</span>
        <span class="activity-label">${label}</span>
      </button>
    `;
  },

  bindEvents() {
    const buttons = this.container.querySelectorAll('.activity-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const activityType = btn.dataset.activity;
        this.handleActivity(activityType, btn);
      });
    });
  },

  handleActivity(type, buttonElement) {
    // Disable button during processing
    buttonElement.disabled = true;
    buttonElement.classList.add('processing');

    // Perform activity
    const result = StateManager.performActivity(type);

    if (result.success) {
      // Show success feedback
      const messages = {
        feed: 'Fed your pet!',
        walk: 'Took your pet for a walk!',
        play: 'Played with your pet!'
      };

      showSuccess(messages[type] || 'Activity completed!');

      // Add visual feedback
      buttonElement.classList.add('success');
      setTimeout(() => {
        buttonElement.classList.remove('success');
      }, 500);

      // Notify parent component
      if (this.onActivityPerformed) {
        const pet = StateManager.getCurrentPet();
        this.onActivityPerformed(pet);
      }
    } else {
      showError(result.message || 'Failed to perform activity');
    }

    // Re-enable button
    setTimeout(() => {
      buttonElement.disabled = false;
      buttonElement.classList.remove('processing');
    }, 300);
  },

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.onActivityPerformed = null;
  }
};

export default ActivityControls;
