// Pet Display Component
// Renders the pet standing in front of its house, plus name and description

import { formatDate } from '../utils/helpers.js';
import { getFallbackIcon, normalizeAppearance } from '../petParts.js?v=react-11';
import PetAvatar from './petAvatar.js?v=react-11';

const ACTIVITY_REACTIONS = {
  cuddle: { emoji: '💕', motion: 'sway', count: 6 },
  nap: { emoji: '💤', motion: 'sleepy', count: 6 },
  walk: { emoji: '🐾', motion: 'walk', count: 0 },
  feed: { emoji: '🍖', motion: 'bounce', count: 0 },
  treat: { emoji: '🍪', motion: 'bounce', count: 0 },
  play: { emoji: '🎾', motion: 'excited', count: 0 }
};

const REACT_CLASSES = [
  'pet-react--bounce',
  'pet-react--sway',
  'pet-react--sleepy',
  'pet-react--walk',
  'pet-react--excited'
];

const PetDisplay = {
  container: null,
  currentPet: null,
  reactionTimer: null,
  reactionTimerSecondary: null,

  init() {
    this.container = document.getElementById('pet-display');
  },

  render(pet) {
    if (!this.container) {
      console.error('Pet display container not found');
      return;
    }

    if (!pet) {
      this.currentPet = null;
      this.container.innerHTML = '<p class="no-pet">No pet found</p>';
      return;
    }

    this.currentPet = pet;
    const appearance = normalizeAppearance(pet.type, pet.appearance);
    const description = pet.description
      ? `<p class="pet-description">${this.escapeHtml(pet.description)}</p>`
      : '';

    this.container.innerHTML = `
      <div class="pet-card">
        <div class="pet-yard">
          <div class="pet-yard-sky"></div>
          <div class="pet-yard-grass"></div>
          <div class="pet-house pet-house--stage" aria-hidden="true">
            <div class="pet-house-roof"></div>
            <div class="pet-house-body">
              <div class="pet-house-door"></div>
            </div>
          </div>
          <div class="pet-paw-trail" id="pet-paw-trail" aria-hidden="true"></div>
          <div class="pet-figure" id="pet-figure-mount"></div>
          <div class="pet-reaction-layer" id="pet-reaction-layer" aria-hidden="true"></div>
          <div class="pet-feed-stage" id="pet-feed-stage" aria-hidden="true"></div>
          <div class="pet-play-stage" id="pet-play-stage" aria-hidden="true"></div>
        </div>
        <div class="pet-info">
          <h2 class="pet-name">${this.escapeHtml(pet.name)}</h2>
          <p class="pet-type-badge">${this.capitalize(pet.type)}</p>
          ${description}
          <p class="pet-created">Created: ${formatDate(pet.createdAt)}</p>
        </div>
      </div>
    `;

    const figureMount = this.container.querySelector('#pet-figure-mount');
    PetAvatar.render(figureMount, {
      type: pet.type,
      appearance,
      sizeClass: 'pet-avatar--stage'
    });

    pet.icon = pet.icon || getFallbackIcon(pet.type);
  },

  update(pet) {
    if (!this.container || !pet) return;

    this.currentPet = pet;
    const nameEl = this.container.querySelector('.pet-name');
    const descriptionEl = this.container.querySelector('.pet-description');
    const figureMount = this.container.querySelector('#pet-figure-mount');

    if (nameEl) nameEl.textContent = pet.name;
    if (descriptionEl) descriptionEl.textContent = pet.description || '';

    if (figureMount) {
      PetAvatar.render(figureMount, {
        type: pet.type,
        appearance: normalizeAppearance(pet.type, pet.appearance),
        sizeClass: 'pet-avatar--stage'
      });
    }
  },

  restoreEyes() {
    if (!this.currentPet || !this.container) return;
    const figure = this.container.querySelector('#pet-figure-mount');
    if (!figure) return;
    const look = normalizeAppearance(this.currentPet.type, this.currentPet.appearance);
    PetAvatar.setEyes(figure, this.currentPet.type, look.eyes);
  },

  clearReactionTimers() {
    if (this.reactionTimer) {
      clearTimeout(this.reactionTimer);
      this.reactionTimer = null;
    }
    if (this.reactionTimerSecondary) {
      clearTimeout(this.reactionTimerSecondary);
      this.reactionTimerSecondary = null;
    }
  },

  spawnParticles(layer, emoji, count) {
    layer.innerHTML = '';
    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'pet-reaction-particle';
      particle.textContent = emoji;
      particle.style.setProperty('--rx', `${(Math.random() * 70 - 35).toFixed(1)}%`);
      particle.style.setProperty('--delay', `${(i * 0.07).toFixed(2)}s`);
      particle.style.setProperty('--drift', `${(Math.random() * 36 - 18).toFixed(1)}px`);
      particle.style.setProperty('--spin', `${(Math.random() * 40 - 20).toFixed(1)}deg`);
      layer.appendChild(particle);
    }
  },

  clearFeedStage() {
    const stage = this.container?.querySelector('#pet-feed-stage');
    if (!stage) return;
    stage.classList.remove('is-active');
    stage.innerHTML = '';
  },

  clearPlayStage() {
    const stage = this.container?.querySelector('#pet-play-stage');
    if (!stage) return;
    stage.classList.remove('is-active');
    stage.innerHTML = '';
  },

  playBallReaction() {
    const stage = this.container.querySelector('#pet-play-stage');
    const figure = this.container.querySelector('#pet-figure-mount');
    if (!stage || !figure) return;

    const balls = [];
    for (let i = 0; i < 10; i += 1) {
      const left = 12 + Math.random() * 76;
      const delay = Math.random() * 0.35;
      const duration = 1.1 + Math.random() * 0.9;
      // Wider sideways travel so paths read as diagonals, not just up/down
      const x1 = (Math.random() * 140 - 70).toFixed(0);
      const x2 = (Math.random() * 160 - 80).toFixed(0);
      const x3 = (Math.random() * 130 - 65).toFixed(0);
      const spin = (720 + Math.random() * 720).toFixed(0);
      const size = (2.2 + Math.random() * 1.4).toFixed(2);
      const variant = (i % 4) + 1;
      balls.push(`
        <span
          class="pet-play-ball pet-play-ball--${variant}"
          style="
            --ball-left: ${left.toFixed(1)}%;
            --delay: ${delay.toFixed(2)}s;
            --duration: ${duration.toFixed(2)}s;
            --x1: ${x1}px;
            --x2: ${x2}px;
            --x3: ${x3}px;
            --spin: ${spin}deg;
            --size: ${size}rem;
          "
        >🎾</span>
      `);
    }

    stage.innerHTML = balls.join('');
    stage.classList.add('is-active');
    figure.classList.add('pet-react--excited');

    this.reactionTimer = setTimeout(() => {
      this.clearPlayStage();
      figure.classList.remove(...REACT_CLASSES);
      this.reactionTimer = null;
    }, 2400);
  },

  playBowlReaction(foodEmoji) {
    const stage = this.container.querySelector('#pet-feed-stage');
    const figure = this.container.querySelector('#pet-figure-mount');
    if (!stage || !figure) return;

    const bite = this.escapeHtml(foodEmoji);
    const shineId = `bowlShine-${Date.now().toString(36)}`;

    stage.innerHTML = `
      <div class="pet-feed-bowl" aria-hidden="true">
        <svg class="pet-feed-bowl-svg" viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="58" rx="48" ry="8" fill="rgba(0,0,0,0.18)"/>
          <ellipse cx="60" cy="42" rx="50" ry="18" fill="#9E9E9E"/>
          <ellipse cx="60" cy="42" rx="50" ry="18" fill="url(#${shineId})"/>
          <ellipse cx="60" cy="36" rx="42" ry="14" fill="#757575"/>
          <ellipse cx="60" cy="34" rx="36" ry="11" fill="#616161"/>
          <ellipse cx="60" cy="32" rx="30" ry="8" fill="#8D6E63"/>
          <ellipse cx="48" cy="38" rx="14" ry="4" fill="#fff" opacity="0.35"/>
          <defs>
            <linearGradient id="${shineId}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#F5F5F5"/>
              <stop offset="35%" stop-color="#BDBDBD"/>
              <stop offset="100%" stop-color="#757575"/>
            </linearGradient>
          </defs>
        </svg>
        <span class="pet-feed-bowl-kibble">${bite}</span>
      </div>
      <span class="pet-feed-bite" style="--delay: 0.35s">${bite}</span>
      <span class="pet-feed-bite" style="--delay: 0.7s">${bite}</span>
      <span class="pet-feed-bite" style="--delay: 1.05s">${bite}</span>
    `;
    stage.classList.add('is-active');
    figure.classList.add('pet-react--bounce');

    this.reactionTimer = setTimeout(() => {
      this.clearFeedStage();
      figure.classList.remove(...REACT_CLASSES);
      this.reactionTimer = null;
    }, 2200);
  },

  // Ground paw prints that appear behind the pet as it walks
  spawnPawTrail(direction) {
    const trail = this.container.querySelector('#pet-paw-trail');
    if (!trail) return;

    if (direction === 'outbound') {
      trail.innerHTML = '';
    }

    const count = 7;
    for (let i = 0; i < count; i += 1) {
      // Outbound: center → left. Inbound: right edge → center.
      const x = direction === 'outbound'
        ? 44 - i * 5.5
        : 94 - i * 6.5;
      const paw = document.createElement('span');
      paw.className = 'pet-paw-print';
      paw.textContent = '🐾';
      paw.style.left = `${x}%`;
      paw.style.bottom = i % 2 === 0 ? '12px' : '4px';
      paw.style.setProperty('--delay', `${(0.04 + i * 0.09).toFixed(2)}s`);
      paw.style.setProperty('--rot', i % 2 === 0 ? '-28deg' : '18deg');
      trail.appendChild(paw);
    }
  },

  playReaction(activityType) {
    const reaction = ACTIVITY_REACTIONS[activityType];
    if (!reaction || !this.container) return;

    const figure = this.container.querySelector('#pet-figure-mount');
    const layer = this.container.querySelector('#pet-reaction-layer');
    const trail = this.container.querySelector('#pet-paw-trail');
    if (!figure || !layer) return;

    this.clearReactionTimers();
    this.restoreEyes();
    layer.innerHTML = '';
    if (trail) trail.innerHTML = '';
    this.clearFeedStage();
    this.clearPlayStage();
    figure.classList.remove(...REACT_CLASSES);

    // Feed / treat: silver bowl appears, bites float into the pet's mouth
    if (activityType === 'feed' || activityType === 'treat') {
      void figure.offsetWidth;
      this.playBowlReaction(reaction.emoji);
      return;
    }

    // Play: tennis balls bounce around while the pet hops with excitement
    if (activityType === 'play') {
      void figure.offsetWidth;
      this.playBallReaction();
      return;
    }

    // Nap: sleepy eyes + floating Zzz for a few seconds
    if (activityType === 'nap') {
      void figure.offsetWidth;
      figure.classList.add('pet-react--sleepy');
      if (this.currentPet) {
        PetAvatar.setEyes(figure, this.currentPet.type, 'eyes-sleepy');
      }
      this.spawnParticles(layer, reaction.emoji, reaction.count);
      this.reactionTimerSecondary = setTimeout(() => {
        this.spawnParticles(layer, reaction.emoji, 5);
      }, 900);

      this.reactionTimer = setTimeout(() => {
        layer.innerHTML = '';
        figure.classList.remove(...REACT_CLASSES);
        this.restoreEyes();
        this.reactionTimer = null;
        this.reactionTimerSecondary = null;
      }, 2600);
      return;
    }

    // Force reflow so the motion class can restart
    void figure.offsetWidth;
    figure.classList.add(`pet-react--${reaction.motion}`);

    // Walk: slide off left, paw trail on the grass, re-enter from the right
    if (activityType === 'walk') {
      this.spawnPawTrail('outbound');

      this.reactionTimerSecondary = setTimeout(() => {
        this.spawnPawTrail('inbound');
      }, 2750);

      this.reactionTimer = setTimeout(() => {
        layer.innerHTML = '';
        if (trail) trail.innerHTML = '';
        figure.classList.remove(...REACT_CLASSES);
        this.reactionTimer = null;
        this.reactionTimerSecondary = null;
      }, 4800);
      return;
    }

    this.spawnParticles(layer, reaction.emoji, reaction.count);

    this.reactionTimer = setTimeout(() => {
      layer.innerHTML = '';
      figure.classList.remove(...REACT_CLASSES);
      this.reactionTimer = null;
    }, 1200);
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  destroy() {
    this.clearReactionTimers();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
};

export default PetDisplay;
