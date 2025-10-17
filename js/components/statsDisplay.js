// Stats Display Component
// Shows pet stats with visual progress bars

import { getStatPercentage, getStatLevel, getStatColor } from '../utils/helpers.js';
import { MAX_STAT_VALUE } from '../state.js';

const StatsDisplay = {
  container: null,

  init() {
    this.container = document.getElementById('stats-display');
  },

  render(stats) {
    if (!this.container) {
      console.error('Stats display container not found');
      return;
    }

    if (!stats) {
      this.container.innerHTML = '<p class="no-stats">No stats available</p>';
      return;
    }

    this.container.innerHTML = `
      <div class="stats-container">
        <h3 class="stats-title">Pet Stats</h3>
        <div class="stats-list">
          ${this.renderStat('hunger', 'Hunger', stats.hunger, '🍖')}
          ${this.renderStat('happiness', 'Happiness', stats.happiness, '😊')}
          ${this.renderStat('energy', 'Energy', stats.energy, '⚡')}
        </div>
      </div>
    `;
  },

  renderStat(key, label, value, icon) {
    const percentage = getStatPercentage(value, MAX_STAT_VALUE);
    const level = getStatLevel(value);
    const colorClass = getStatColor(value);

    return `
      <div class="stat-item" data-stat="${key}">
        <div class="stat-header">
          <span class="stat-icon">${icon}</span>
          <span class="stat-label">${label}</span>
          <span class="stat-value">${value}/${MAX_STAT_VALUE}</span>
        </div>
        <div class="stat-bar-container">
          <div class="stat-bar ${colorClass}" style="width: ${percentage}%">
            <span class="stat-bar-label">${level}</span>
          </div>
        </div>
      </div>
    `;
  },

  update(stats) {
    if (!this.container || !stats) return;

    // Update each stat individually with animation
    Object.keys(stats).forEach(key => {
      this.updateStat(key, stats[key]);
    });
  },

  updateStat(statName, newValue) {
    const statItem = this.container.querySelector(`[data-stat="${statName}"]`);
    if (!statItem) return;

    const valueEl = statItem.querySelector('.stat-value');
    const barEl = statItem.querySelector('.stat-bar');
    const levelEl = statItem.querySelector('.stat-bar-label');

    if (valueEl) {
      valueEl.textContent = `${newValue}/${MAX_STAT_VALUE}`;
    }

    if (barEl) {
      const percentage = getStatPercentage(newValue, MAX_STAT_VALUE);
      const level = getStatLevel(newValue);
      const colorClass = getStatColor(newValue);

      // Update width with transition
      barEl.style.width = `${percentage}%`;

      // Update color class
      barEl.className = `stat-bar ${colorClass}`;

      // Update level text
      if (levelEl) {
        levelEl.textContent = level;
      }

      // Add pulse animation for feedback
      barEl.classList.add('stat-updated');
      setTimeout(() => {
        barEl.classList.remove('stat-updated');
      }, 300);
    }
  },

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
};

export default StatsDisplay;
