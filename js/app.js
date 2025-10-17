// Main Application Entry Point
// Initializes and coordinates all components

import { StateManager } from './state.js';
import PetCreator from './components/petCreator.js';
import PetDisplay from './components/petDisplay.js';
import StatsDisplay from './components/statsDisplay.js';
import ActivityControls from './components/activityControls.js';

const App = {
  currentView: null,

  init() {
    console.log('MyPet App initializing...');

    // Initialize state
    StateManager.init();

    // Initialize components
    PetCreator.init();
    PetDisplay.init();
    StatsDisplay.init();
    ActivityControls.init((pet) => this.handleActivityPerformed(pet));

    // Set up event listeners
    this.bindEvents();

    // Determine initial view
    this.showInitialView();

    console.log('MyPet App initialized');
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

    // Show main view
    this.showView('main-view');
  },

  handleActivityPerformed(pet) {
    console.log('Activity performed, updating displays');

    if (pet && pet.stats) {
      // Update stats display with animation
      StatsDisplay.update(pet.stats);
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
