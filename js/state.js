// State Management & localStorage Service
// This module handles all game state and persistence

const STORAGE_KEY = 'mypet_gamestate';
const MAX_STAT_VALUE = 100;
const MIN_STAT_VALUE = 0;

// Global state object
let gameState = {
  currentPet: null,
  activityHistory: [],
  lastPlayed: Date.now()
};

// Event listeners for state changes
const stateListeners = [];

// Storage Service
const StorageService = {
  save(state) {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
      return { success: true };
    } catch (error) {
      console.error('Failed to save game:', error);
      if (error.name === 'QuotaExceededError') {
        return {
          success: false,
          error: 'STORAGE_FULL',
          message: 'Unable to save. Please clear browser data.'
        };
      }
      return {
        success: false,
        error: 'STORAGE_ERROR',
        message: 'Unable to save. Please try again.'
      };
    }
  },

  load() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) return null;

      const parsed = JSON.parse(serialized);

      // Validate data structure
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return { success: true };
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return { success: false };
    }
  }
};

// State Manager
const StateManager = {
  // Initialize state from localStorage or create new
  init() {
    const savedState = StorageService.load();
    if (savedState) {
      gameState = {
        ...gameState,
        ...savedState,
        lastPlayed: Date.now()
      };
    }
    return gameState;
  },

  // Get current state
  getState() {
    return gameState;
  },

  // Get current pet
  getCurrentPet() {
    return gameState.currentPet;
  },

  // Create new pet
  createPet(name, type, description) {
    const petId = Date.now().toString();
    const icon = type === 'cat' ? '🐱' : '🐶';

    const newPet = {
      id: petId,
      name: name.trim(),
      type,
      description: description.trim(),
      icon,
      createdAt: Date.now(),
      stats: {
        hunger: 50,
        happiness: 50,
        energy: 50
      }
    };

    gameState.currentPet = newPet;
    gameState.activityHistory = [];
    gameState.lastPlayed = Date.now();

    const result = StorageService.save(gameState);

    if (result.success) {
      this.notifyListeners();
    }

    return result;
  },

  // Update pet stats
  updateStats(statChanges) {
    if (!gameState.currentPet) {
      return { success: false, error: 'NO_PET' };
    }

    const pet = gameState.currentPet;

    // Apply stat changes with clamping
    Object.keys(statChanges).forEach(stat => {
      if (pet.stats.hasOwnProperty(stat)) {
        const newValue = pet.stats[stat] + statChanges[stat];
        pet.stats[stat] = Math.min(MAX_STAT_VALUE, Math.max(MIN_STAT_VALUE, newValue));
      }
    });

    gameState.lastPlayed = Date.now();

    const result = StorageService.save(gameState);

    if (result.success) {
      this.notifyListeners();
    }

    return result;
  },

  // Record activity
  recordActivity(type, impact) {
    if (!gameState.currentPet) {
      return { success: false, error: 'NO_PET' };
    }

    const activity = {
      id: Date.now().toString(),
      petId: gameState.currentPet.id,
      type,
      timestamp: Date.now(),
      impact
    };

    gameState.activityHistory.unshift(activity);

    // Keep only last 50 activities to prevent storage bloat
    if (gameState.activityHistory.length > 50) {
      gameState.activityHistory = gameState.activityHistory.slice(0, 50);
    }

    return StorageService.save(gameState);
  },

  // Perform activity (updates stats and records activity)
  performActivity(type) {
    const impacts = {
      feed: { hunger: 20 },
      walk: { energy: 20 },
      play: { happiness: 20 }
    };

    const impact = impacts[type];
    if (!impact) {
      return { success: false, error: 'INVALID_ACTIVITY' };
    }

    // Update stats
    const updateResult = this.updateStats(impact);
    if (!updateResult.success) {
      return updateResult;
    }

    // Record activity
    const recordResult = this.recordActivity(type, impact);

    return recordResult;
  },

  // Reset game (create new pet)
  reset() {
    gameState = {
      currentPet: null,
      activityHistory: [],
      lastPlayed: Date.now()
    };

    const result = StorageService.clear();

    if (result.success) {
      this.notifyListeners();
    }

    return result;
  },

  // Subscribe to state changes
  subscribe(listener) {
    stateListeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = stateListeners.indexOf(listener);
      if (index > -1) {
        stateListeners.splice(index, 1);
      }
    };
  },

  // Notify all listeners of state change
  notifyListeners() {
    stateListeners.forEach(listener => {
      try {
        listener(gameState);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }
};

// Export for use in other modules
export { StateManager, MAX_STAT_VALUE, MIN_STAT_VALUE };
