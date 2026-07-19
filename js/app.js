// Main Application Entry Point
// Initializes and coordinates all components

import { StateManager } from './state.js?v=local-time';
import PetCreator from './components/petCreator.js?v=local-time';
import PetDisplay from './components/petDisplay.js?v=local-time';
import StatsDisplay from './components/statsDisplay.js?v=local-time';
import ActivityControls from './components/activityControls.js?v=local-time';

// Recheck periodically so day/night updates if the tab stays open past 7am/7pm
const DAY_NIGHT_CHECK_MS = 60000;
const DAY_START_HOUR = 7;  // 7:00 a.m.
const NIGHT_START_HOUR = 19; // 7:00 p.m.

const App = {
  currentView: null,
  dayNightTimerId: null,
  isNight: false,

  init() {
    console.log('MyPet App initializing...');

    // Initialize state
    StateManager.init();

    // Initialize components
    PetCreator.init();
    PetDisplay.init();
    StatsDisplay.init();
    ActivityControls.init((pet, activityType) => this.handleActivityPerformed(pet, activityType));

    // Set up event listeners
    this.bindEvents();

    // Determine initial view
    this.showInitialView();

    console.log('MyPet App initialized');
  },

  // Night from 7:00 p.m. until 7:00 a.m.; day from 7:00 a.m. until 7:00 p.m.
  shouldBeNight(date = new Date()) {
    const hour = date.getHours();
    return hour >= NIGHT_START_HOUR || hour < DAY_START_HOUR;
  },

  applySceneForLocalTime() {
    this.isNight = this.shouldBeNight();
    document.body.classList.toggle('scene--night', this.isNight);
  },

  startDayNightCycle() {
    this.stopDayNightCycle();
    this.applySceneForLocalTime();

    this.dayNightTimerId = window.setInterval(() => {
      this.applySceneForLocalTime();
    }, DAY_NIGHT_CHECK_MS);
  },

  stopDayNightCycle() {
    if (this.dayNightTimerId !== null) {
      window.clearInterval(this.dayNightTimerId);
      this.dayNightTimerId = null;
    }
    this.isNight = false;
    document.body.classList.remove('scene--night');
  },

  bindEvents() {
    // Listen for pet creation
    window.addEventListener('petCreated', () => {
      this.showMainView();
    });

    // Listen for reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.handleReset();
      });
    }

    // Refresh scene when returning to the tab (covers crossing 7am/7pm while away)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.currentView === 'main-view') {
        this.applySceneForLocalTime();
      }
    });

    // Subscribe to state changes
    StateManager.subscribe((state) => {
      this.handleStateChange(state);
    });
  },

  showInitialView() {
    const pet = StateManager.getCurrentPet();

    if (pet) {
      this.showMainView();
    } else {
      this.showCreatorView();
    }
  },

  showView(viewId) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
      view.classList.add('hidden');
    });

    // Show target view
    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.remove('hidden');
      this.currentView = viewId;
    }
  },

  showCreatorView() {
    console.log('Showing creator view');
    this.stopDayNightCycle();
    this.showView('creator-view');
  },

  showMainView() {
    console.log('Showing main view');

    const pet = StateManager.getCurrentPet();

    if (!pet) {
      console.error('No pet found, returning to creator');
      this.showCreatorView();
      return;
    }

    // Render components
    PetDisplay.render(pet);
    StatsDisplay.render(pet.stats);
    ActivityControls.render();

    // Show main view and match day/night to the user's local time
    this.showView('main-view');
    this.startDayNightCycle();
  },

  handleActivityPerformed(pet, activityType) {
    console.log('Activity performed, updating displays');

    if (pet && pet.stats) {
      StatsDisplay.update(pet.stats);
    }

    if (activityType) {
      PetDisplay.playReaction(activityType);
    }
  },

  handleStateChange(state) {
    console.log('State changed:', state);

    // Update displays if on main view
    if (this.currentView === 'main-view' && state.currentPet) {
      PetDisplay.update(state.currentPet);
      StatsDisplay.update(state.currentPet.stats);
    }
  },

  handleReset() {
    const confirmed = confirm('Are you sure you want to create a new pet? Your current pet will be lost.');

    if (confirmed) {
      const result = StateManager.reset();

      if (result.success) {
        console.log('Game reset');
        this.showCreatorView();
      } else {
        console.error('Failed to reset game');
      }
    }
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
} else {
  App.init();
}

// Export for debugging
window.MyPetApp = App;
window.MyPetState = StateManager;
