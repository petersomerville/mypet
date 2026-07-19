// Renders a sticker-style pet from layered SVG parts + fur color

import {
  PET_BODIES,
  RENDER_ORDER,
  getPart,
  normalizeAppearance
} from '../petParts.js?v=acc-2';

let avatarUid = 0;

function uniquifySvgIds(svgMarkup) {
  if (!svgMarkup) return svgMarkup;
  const prefix = `a${Date.now().toString(36)}${(avatarUid++).toString(36)}`;
  return svgMarkup
    .replace(/id="([^"]+)"/g, `id="${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`);
}

const PetAvatar = {
  render(container, { type, appearance, sizeClass = '' } = {}) {
    if (!container) return;

    const safeType = type === 'cat' || type === 'dog' ? type : 'dog';
    const look = normalizeAppearance(safeType, appearance);
    const classes = ['pet-avatar'];
    if (sizeClass) classes.push(sizeClass);

    container.innerHTML = `
      <div
        class="${classes.join(' ')}"
        style="--pet-color: ${look.color}"
        role="img"
        aria-label="${safeType} avatar"
      >
        ${RENDER_ORDER.map(slot => this.renderLayer(safeType, slot, look[slot])).join('')}
      </div>
    `;
  },

  renderLayer(type, slot, partId) {
    if (slot === 'body') {
      const bodySvg = PET_BODIES[type];
      if (!bodySvg) {
        return `<div class="pet-avatar-layer pet-avatar-layer--body" data-slot="body"></div>`;
      }
      return `
      <div class="pet-avatar-layer pet-avatar-layer--body" data-slot="body">
        ${uniquifySvgIds(bodySvg)}
      </div>
    `;
    }

    const part = getPart(type, slot, partId);
    if (!part || !part.svg) {
      return `<div class="pet-avatar-layer pet-avatar-layer--${slot}" data-slot="${slot}"></div>`;
    }

    return `
      <div class="pet-avatar-layer pet-avatar-layer--${slot}" data-slot="${slot}">
        ${uniquifySvgIds(part.svg)}
      </div>
    `;
  },

  update(container, options) {
    this.render(container, options);
  }
};

export default PetAvatar;
