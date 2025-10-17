// Utility helper functions

// Sanitize user input for safe display
export function sanitizeText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Validate pet name
export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Name cannot be empty' };
  }

  if (trimmed.length > 20) {
    return { valid: false, error: 'Name must be 20 characters or less' };
  }

  return { valid: true, value: trimmed };
}

// Validate pet description
export function validateDescription(description) {
  if (!description || typeof description !== 'string') {
    return { valid: false, error: 'Description is required' };
  }

  const trimmed = description.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Description cannot be empty' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Description must be 100 characters or less' };
  }

  return { valid: true, value: trimmed };
}

// Format timestamp to readable date
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format timestamp to readable time
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Calculate stat percentage for visual display
export function getStatPercentage(value, max = 100) {
  return Math.min(100, Math.max(0, (value / max) * 100));
}

// Get stat level description
export function getStatLevel(value) {
  if (value >= 80) return 'Great';
  if (value >= 60) return 'Good';
  if (value >= 40) return 'OK';
  if (value >= 20) return 'Low';
  return 'Critical';
}

// Get stat color based on value
export function getStatColor(value) {
  if (value >= 80) return 'stat-high';
  if (value >= 60) return 'stat-medium';
  if (value >= 40) return 'stat-low';
  return 'stat-critical';
}

// Debounce function for performance
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Show error message to user
export function showError(message, duration = 3000) {
  // Create error element if it doesn't exist
  let errorEl = document.getElementById('error-message');

  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.id = 'error-message';
    errorEl.className = 'error-message';
    document.body.appendChild(errorEl);
  }

  errorEl.textContent = message;
  errorEl.classList.add('show');

  // Auto-hide after duration
  setTimeout(() => {
    errorEl.classList.remove('show');
  }, duration);
}

// Show success message to user
export function showSuccess(message, duration = 2000) {
  // Create success element if it doesn't exist
  let successEl = document.getElementById('success-message');

  if (!successEl) {
    successEl = document.createElement('div');
    successEl.id = 'success-message';
    successEl.className = 'success-message';
    document.body.appendChild(successEl);
  }

  successEl.textContent = message;
  successEl.classList.add('show');

  // Auto-hide after duration
  setTimeout(() => {
    successEl.classList.remove('show');
  }, duration);
}

// Create DOM element with attributes
export function createElement(tag, className, attributes = {}) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  Object.keys(attributes).forEach(key => {
    if (key === 'textContent') {
      element.textContent = attributes[key];
    } else if (key === 'innerHTML') {
      element.innerHTML = attributes[key];
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });

  return element;
}
