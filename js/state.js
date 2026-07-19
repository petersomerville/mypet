// State Management & localStorage Service
// This module handles all game state and persistence

import { getDefaultAppearance, getFallbackIcon, normalizeAppearance } from './petParts.js?v=local-time';

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
      this.migrateLegacyPet();
    }
    return gameState;
  },

  // Upgrade older saved pets (hunger → fullness, add appearance)
  migrateLegacyPet() {
    const pet = gameState.currentPet;
    if (!pet) return;

    let changed = false;

    if (pet.stats && pet.stats.fullness === undefined && pet.stats.hunger !== undefined) {
      pet.stats.fullness = pet.stats.hunger;
      delete pet.stats.hunger;

      gameState.activityHistory = (gameState.activityHistory || []).map(activity => {
        if (!activity.impact || activity.impact.hunger === undefined) {
          return activity;
        }
        const { hunger, ...restImpact } = activity.impact;
        return {
          ...activity,
          impact: { ...restImpact, fullness: hunger }
        };
      });
      changed = true;
    }

    if (!pet.appearance) {
      pet.appearance = getDefaultAppearance(pet.type);
      pet.icon = pet.icon || getFallbackIcon(pet.type);
      changed = true;
    } else {
      const normalized = normalizeAppearance(pet.type, pet.appearance);
      if (JSON.stringify(normalized) !== JSON.stringify(pet.appearance)) {
        pet.appearance = normalized;
        changed = true;
      }
    }

    if (changed) {
      StorageService.save(gameState);
    }
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
  createPet(name, type, description, appearance = null) {
    const petId = Date.now().toString();
    const icon = getFallbackIcon(type);
    const look = normalizeAppearance(type, appearance || getDefaultAppearance(type));

    const newPet = {
      id: petId,
      name: name.trim(),
      type,
      description: (description || '').trim(),
      icon,
      appearance: look,
      createdAt: Date.now(),
      stats: {
        fullness: 50,
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
      feed: { fullness: 20 },
      walk: { happiness: 15, energy: -15 },
      play: { happiness: 20 },
      nap: { energy: 25 },
      treat: { fullness: 10, happiness: 10 },
      cuddle: { happiness: 15 }
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
