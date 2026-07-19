// Activity Controls Component
// Provides interactive buttons for pet activities

import { StateManager } from '../state.js?v=local-time';
import { showError, showSuccess } from '../utils/helpers.js';

const ACTIVITY_MESSAGES = {
  feed: 'Fed your pet!',
  walk: 'Took your pet for a walk!',
  play: 'Played with your pet!',
  nap: 'Your pet took a cozy nap!',
  treat: 'Gave your pet a tasty treat!',
  cuddle: 'Cuddled with your pet!'
};

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
        <h3 class="activities-title">What will you do?</h3>
        <div class="activity-buttons">
          ${this.renderActivityButton('feed', 'Feed', '🍖', 'Feed your pet to increase fullness')}
          ${this.renderActivityButton('treat', 'Treat', '🍪', 'Give a treat for fullness and happiness')}
          ${this.renderActivityButton('play', 'Play', '🎾', 'Play to increase happiness')}
          ${this.renderActivityButton('cuddle', 'Cuddle', '💕', 'Cuddle to increase happiness')}
          ${this.renderActivityButton('walk', 'Walk', '🚶', 'Walk for happiness, but it uses energy')}
          ${this.renderActivityButton('nap', 'Nap', '😴', 'Nap to restore energy')}
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
    buttonElement.disabled = true;
    buttonElement.classList.add('processing');

    const result = StateManager.performActivity(type);

    if (result.success) {
      showSuccess(ACTIVITY_MESSAGES[type] || 'Activity completed!');

      buttonElement.classList.add('success');
      setTimeout(() => {
        buttonElement.classList.remove('success');
      }, 500);

      if (this.onActivityPerformed) {
        const pet = StateManager.getCurrentPet();
        this.onActivityPerformed(pet, type);
      }
    } else {
      showError(result.message || 'Failed to perform activity');
    }

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
