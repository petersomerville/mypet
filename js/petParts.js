// Pet part catalog for the sticker-style avatar builder.
// Body layers use fill="currentColor" so the fur color picker can tint them.

// User-selectable trait slots (shown in the creator UI)
export const APPEARANCE_SLOTS = ['base', 'eyes', 'pattern', 'collar', 'accessory'];

// Paint order: body/head first, collar in front of torso & legs, accessories on top
export const RENDER_ORDER = ['body', 'pattern', 'base', 'eyes', 'collar', 'accessory'];

export const COLOR_SWATCHES = [
  { id: 'brown', label: 'Brown', value: '#C68642' },
  { id: 'orange', label: 'Orange', value: '#E39B48' },
  { id: 'cream', label: 'Cream', value: '#F0D5A8' },
  { id: 'gray', label: 'Gray', value: '#9AA0A6' },
  { id: 'black', label: 'Black', value: '#3C3C3C' },
  { id: 'white', label: 'White', value: '#F5F5F5' },
  { id: 'golden', label: 'Golden', value: '#E6C35C' },
  { id: 'spotty', label: 'Spotty brown', value: '#8B5A2B' }
];

export const DEFAULT_COLOR = '#C68642';

// Shared lighting: white/black overlays keep fur tintable via currentColor
const VOLUME_DEFS = `
  <defs>
    <radialGradient id="furBall" cx="30%" cy="26%" r="78%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.72"/>
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="68%" stop-color="#000000" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.42"/>
    </radialGradient>
    <linearGradient id="furTube" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.45"/>
    </linearGradient>
    <linearGradient id="furSide" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.38"/>
    </linearGradient>
    <radialGradient id="groundShade" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.42"/>
      <stop offset="65%" stop-color="#000000" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="noseShine" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65"/>
      <stop offset="45%" stop-color="#5a4034" stop-opacity="1"/>
      <stop offset="100%" stop-color="#2a1c16" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="legShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.38"/>
    </linearGradient>
    <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.2"/>
    </filter>
  </defs>
`;

const svg = (body) => `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    ${VOLUME_DEFS}
    ${body}
  </svg>
`.trim();

// Side-standing dog: far legs behind torso, near legs tucked into belly
const dogBody = `
  <ellipse cx="115" cy="188" rx="62" ry="10" fill="url(#groundShade)"/>
  <path d="M168 112 Q196 88 192 60 Q174 90 164 108 Z" fill="currentColor"/>
  <path d="M168 112 Q196 88 192 60 Q174 90 164 108 Z" fill="url(#furSide)"/>
  <g>
    <rect x="150" y="118" width="13" height="58" rx="7" fill="currentColor" opacity="0.8"/>
    <rect x="150" y="118" width="13" height="58" rx="7" fill="url(#legShade)" opacity="0.9"/>
    <rect x="64" y="118" width="13" height="58" rx="7" fill="currentColor" opacity="0.8"/>
    <rect x="64" y="118" width="13" height="58" rx="7" fill="url(#legShade)" opacity="0.9"/>
  </g>
  <ellipse cx="156" cy="178" rx="9" ry="5" fill="#3b2a22" opacity="0.9"/>
  <ellipse cx="70" cy="178" rx="9" ry="5" fill="#3b2a22" opacity="0.9"/>
  <ellipse cx="122" cy="122" rx="56" ry="30" fill="currentColor"/>
  <ellipse cx="122" cy="122" rx="56" ry="30" fill="url(#furBall)"/>
  <ellipse cx="122" cy="134" rx="42" ry="16" fill="#000" opacity="0.12"/>
  <ellipse cx="72" cy="140" rx="16" ry="12" fill="currentColor"/>
  <ellipse cx="72" cy="140" rx="16" ry="12" fill="url(#furTube)"/>
  <ellipse cx="158" cy="140" rx="16" ry="12" fill="currentColor"/>
  <ellipse cx="158" cy="140" rx="16" ry="12" fill="url(#furTube)"/>
  <g>
    <rect x="74" y="128" width="15" height="52" rx="7" fill="currentColor"/>
    <rect x="74" y="128" width="15" height="52" rx="7" fill="url(#legShade)"/>
    <rect x="160" y="128" width="15" height="52" rx="7" fill="currentColor"/>
    <rect x="160" y="128" width="15" height="52" rx="7" fill="url(#legShade)"/>
  </g>
  <ellipse cx="81" cy="182" rx="11" ry="6" fill="#2f211a"/>
  <ellipse cx="167" cy="182" rx="11" ry="6" fill="#2f211a"/>
  <ellipse cx="78" cy="179" rx="3" ry="1.5" fill="#fff" opacity="0.25"/>
  <ellipse cx="164" cy="179" rx="3" ry="1.5" fill="#fff" opacity="0.25"/>
`;

// Side-standing cat: same attach strategy — torso covers far legs, joins hold near legs
const catBody = `
  <ellipse cx="115" cy="188" rx="58" ry="9" fill="url(#groundShade)"/>
  <path d="M166 114 C198 92 204 148 182 176 C168 154 162 132 158 116 Z" fill="currentColor"/>
  <path d="M166 114 C198 92 204 148 182 176 C168 154 162 132 158 116 Z" fill="url(#furSide)"/>
  <g>
    <rect x="150" y="120" width="11" height="54" rx="6" fill="currentColor" opacity="0.8"/>
    <rect x="150" y="120" width="11" height="54" rx="6" fill="url(#legShade)" opacity="0.9"/>
    <rect x="68" y="120" width="11" height="54" rx="6" fill="currentColor" opacity="0.8"/>
    <rect x="68" y="120" width="11" height="54" rx="6" fill="url(#legShade)" opacity="0.9"/>
  </g>
  <ellipse cx="155" cy="176" rx="8" ry="4" fill="#d8899c" opacity="0.95"/>
  <ellipse cx="73" cy="176" rx="8" ry="4" fill="#d8899c" opacity="0.95"/>
  <ellipse cx="122" cy="124" rx="50" ry="26" fill="currentColor"/>
  <ellipse cx="122" cy="124" rx="50" ry="26" fill="url(#furBall)"/>
  <ellipse cx="122" cy="134" rx="34" ry="13" fill="#000" opacity="0.1"/>
  <ellipse cx="76" cy="140" rx="14" ry="11" fill="currentColor"/>
  <ellipse cx="76" cy="140" rx="14" ry="11" fill="url(#furTube)"/>
  <ellipse cx="156" cy="140" rx="14" ry="11" fill="currentColor"/>
  <ellipse cx="156" cy="140" rx="14" ry="11" fill="url(#furTube)"/>
  <g>
    <rect x="76" y="130" width="13" height="50" rx="6" fill="currentColor"/>
    <rect x="76" y="130" width="13" height="50" rx="6" fill="url(#legShade)"/>
    <rect x="156" y="130" width="13" height="50" rx="6" fill="currentColor"/>
    <rect x="156" y="130" width="13" height="50" rx="6" fill="url(#legShade)"/>
  </g>
  <ellipse cx="82" cy="182" rx="9" ry="5" fill="#d8899c"/>
  <ellipse cx="162" cy="182" rx="9" ry="5" fill="#d8899c"/>
  <ellipse cx="79" cy="179" rx="2.5" ry="1.2" fill="#fff" opacity="0.35"/>
  <ellipse cx="159" cy="179" rx="2.5" ry="1.2" fill="#fff" opacity="0.35"/>
`;

// Bodies render as their own layer (under the collar). Heads stay in `base`.
export const PET_BODIES = {
  dog: svg(dogBody),
  cat: svg(catBody)
};

// Puppy head with rounded volume shading
const dogBaseRound = svg(`
  <polygon points="28,62 36,14 58,50" fill="currentColor"/>
  <polygon points="28,62 36,14 58,50" fill="url(#furTube)"/>
  <polygon points="62,48 84,12 96,60" fill="currentColor"/>
  <polygon points="62,48 84,12 96,60" fill="url(#furTube)"/>
  <polygon points="34,52 40,24 52,46" fill="#F0C4A8"/>
  <polygon points="68,46 80,22 88,52" fill="#F0C4A8"/>
  <circle cx="58" cy="72" r="34" fill="currentColor"/>
  <circle cx="58" cy="72" r="34" fill="url(#furBall)"/>
  <ellipse cx="58" cy="96" rx="24" ry="18" fill="currentColor"/>
  <ellipse cx="58" cy="96" rx="24" ry="18" fill="url(#furTube)"/>
  <ellipse cx="58" cy="98" rx="18" ry="12" fill="#FFE0C8"/>
  <ellipse cx="52" cy="94" rx="6" ry="4" fill="#fff" opacity="0.35"/>
  <path d="M48 84 Q58 78 68 84 Q71 92 58 96 Q45 92 48 84 Z" fill="url(#noseShine)"/>
  <ellipse cx="53" cy="88" rx="1.5" ry="2.2" fill="#1a120e"/>
  <ellipse cx="63" cy="88" rx="1.5" ry="2.2" fill="#1a120e"/>
  <path d="M58 96 Q52 110 58 113 Q64 110 58 96" fill="#FF8A9A"/>
  <path d="M58 96 Q52 110 58 113 Q64 110 58 96" fill="#fff" opacity="0.2"/>
`);

const dogBaseFloppy = svg(`
  <circle cx="58" cy="70" r="32" fill="currentColor"/>
  <circle cx="58" cy="70" r="32" fill="url(#furBall)"/>
  <path d="M36 56 C18 66 12 104 20 132 C30 138 40 122 42 99 C44 76 46 59 44 54 Z" fill="currentColor"/>
  <path d="M36 56 C18 66 12 104 20 132 C30 138 40 122 42 99 C44 76 46 59 44 54 Z" fill="url(#furTube)"/>
  <path d="M80 54 C98 64 104 104 96 132 C86 138 76 122 74 99 C72 76 70 59 72 54 Z" fill="currentColor"/>
  <path d="M80 54 C98 64 104 104 96 132 C86 138 76 122 74 99 C72 76 70 59 72 54 Z" fill="url(#furTube)"/>
  <path d="M34 70 C24 86 22 112 28 124 C34 118 38 92 40 74 Z" fill="#F0C4A8" opacity="0.9"/>
  <path d="M82 68 C92 84 94 112 88 124 C82 118 78 92 76 72 Z" fill="#F0C4A8" opacity="0.9"/>
  <ellipse cx="58" cy="94" rx="24" ry="18" fill="currentColor"/>
  <ellipse cx="58" cy="94" rx="24" ry="18" fill="url(#furTube)"/>
  <ellipse cx="58" cy="96" rx="18" ry="12" fill="#FFE0C8"/>
  <ellipse cx="52" cy="92" rx="6" ry="4" fill="#fff" opacity="0.35"/>
  <path d="M48 82 Q58 76 68 82 Q71 90 58 94 Q45 90 48 82 Z" fill="url(#noseShine)"/>
  <ellipse cx="53" cy="86" rx="1.5" ry="2.2" fill="#1a120e"/>
  <ellipse cx="63" cy="86" rx="1.5" ry="2.2" fill="#1a120e"/>
  <path d="M48 104 Q58 114 68 104" stroke="#2C211C" stroke-width="2.5" fill="none" stroke-linecap="round"/>
`);

const catBasePointy = svg(`
  <polygon points="28,64 42,16 60,54" fill="currentColor"/>
  <polygon points="28,64 42,16 60,54" fill="url(#furTube)"/>
  <polygon points="64,52 84,14 98,62" fill="currentColor"/>
  <polygon points="64,52 84,14 98,62" fill="url(#furTube)"/>
  <polygon points="36,54 44,26 54,50" fill="#F6B7C6"/>
  <polygon points="70,50 80,24 90,54" fill="#F6B7C6"/>
  <circle cx="60" cy="76" r="34" fill="currentColor"/>
  <circle cx="60" cy="76" r="34" fill="url(#furBall)"/>
  <ellipse cx="60" cy="88" rx="14" ry="10" fill="#F7C4B8" opacity="0.92"/>
  <ellipse cx="56" cy="84" rx="4" ry="3" fill="#fff" opacity="0.35"/>
  <path d="M60 80 L54 88 L66 88 Z" fill="#E891A8"/>
  <ellipse cx="58" cy="82" rx="2" ry="1.2" fill="#fff" opacity="0.45"/>
  <line x1="22" y1="80" x2="46" y2="84" stroke="#3B2A22" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <line x1="24" y1="88" x2="48" y2="88" stroke="#3B2A22" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <line x1="26" y1="96" x2="46" y2="92" stroke="#3B2A22" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <line x1="98" y1="80" x2="74" y2="84" stroke="#3B2A22" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <line x1="96" y1="88" x2="72" y2="88" stroke="#3B2A22" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <line x1="94" y1="96" x2="74" y2="92" stroke="#3B2A22" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
`);

const catBaseRound = svg(`
  <polygon points="24,66 40,18 62,56" fill="currentColor"/>
  <polygon points="24,66 40,18 62,56" fill="url(#furTube)"/>
  <polygon points="66,54 90,16 104,64" fill="currentColor"/>
  <polygon points="66,54 90,16 104,64" fill="url(#furTube)"/>
  <polygon points="34,56 44,28 56,52" fill="#F6B7C6"/>
  <polygon points="74,52 86,26 96,56" fill="#F6B7C6"/>
  <circle cx="60" cy="78" r="32" fill="currentColor"/>
  <circle cx="60" cy="78" r="32" fill="url(#furBall)"/>
  <ellipse cx="60" cy="90" rx="15" ry="10" fill="#F7C4B8" opacity="0.92"/>
  <ellipse cx="56" cy="86" rx="4" ry="3" fill="#fff" opacity="0.35"/>
  <path d="M60 82 L54 90 L66 90 Z" fill="#E891A8"/>
  <ellipse cx="58" cy="84" rx="2" ry="1.2" fill="#fff" opacity="0.45"/>
  <line x1="22" y1="82" x2="46" y2="86" stroke="#3B2A22" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <line x1="24" y1="90" x2="48" y2="90" stroke="#3B2A22" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <line x1="26" y1="98" x2="46" y2="94" stroke="#3B2A22" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <line x1="98" y1="82" x2="74" y2="86" stroke="#3B2A22" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <line x1="96" y1="90" x2="72" y2="90" stroke="#3B2A22" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <line x1="94" y1="98" x2="74" y2="94" stroke="#3B2A22" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
`);

// Glossy eyes with depth
const dogEyesHappy = svg(`
  <ellipse cx="46" cy="62" rx="8" ry="10" fill="#fff"/>
  <ellipse cx="70" cy="62" rx="8" ry="10" fill="#fff"/>
  <ellipse cx="46" cy="63" rx="7" ry="9" fill="#f3f3f3"/>
  <ellipse cx="70" cy="63" rx="7" ry="9" fill="#f3f3f3"/>
  <circle cx="46" cy="64" r="5" fill="#3E2723"/>
  <circle cx="70" cy="64" r="5" fill="#3E2723"/>
  <circle cx="48" cy="61" r="2.2" fill="#fff"/>
  <circle cx="72" cy="61" r="2.2" fill="#fff"/>
  <circle cx="44" cy="66" r="1" fill="#fff" opacity="0.45"/>
  <circle cx="68" cy="66" r="1" fill="#fff" opacity="0.45"/>
`);

const dogEyesSleepy = svg(`
  <path d="M38 64 Q46 56 54 64" stroke="#3E2723" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M62 64 Q70 56 78 64" stroke="#3E2723" stroke-width="3.5" fill="none" stroke-linecap="round"/>
`);

const dogEyesWide = svg(`
  <circle cx="46" cy="62" r="10" fill="#fff"/>
  <circle cx="70" cy="62" r="10" fill="#fff"/>
  <circle cx="46" cy="63" r="8.5" fill="#f4f4f4"/>
  <circle cx="70" cy="63" r="8.5" fill="#f4f4f4"/>
  <circle cx="46" cy="62" r="5.5" fill="#3E2723"/>
  <circle cx="70" cy="62" r="5.5" fill="#3E2723"/>
  <circle cx="48" cy="59" r="2.2" fill="#fff"/>
  <circle cx="72" cy="59" r="2.2" fill="#fff"/>
`);

const catEyesHappy = svg(`
  <ellipse cx="46" cy="72" rx="9" ry="7" fill="#F6E39B"/>
  <ellipse cx="72" cy="72" rx="9" ry="7" fill="#F6E39B"/>
  <ellipse cx="46" cy="72" rx="9" ry="7" fill="url(#furBall)" opacity="0.35"/>
  <ellipse cx="72" cy="72" rx="9" ry="7" fill="url(#furBall)" opacity="0.35"/>
  <ellipse cx="46" cy="72" rx="3" ry="6" fill="#222"/>
  <ellipse cx="72" cy="72" rx="3" ry="6" fill="#222"/>
  <ellipse cx="47" cy="69" rx="1.2" ry="1.8" fill="#fff" opacity="0.8"/>
  <ellipse cx="73" cy="69" rx="1.2" ry="1.8" fill="#fff" opacity="0.8"/>
  <path d="M54 94 Q60 99 66 94" stroke="#3B2A22" stroke-width="2.5" fill="none" stroke-linecap="round"/>
`);

const catEyesSleepy = svg(`
  <path d="M38 74 Q46 66 54 74" stroke="#222" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M64 74 Q72 66 80 74" stroke="#222" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M54 94 Q60 98 66 94" stroke="#3B2A22" stroke-width="2" fill="none" stroke-linecap="round"/>
`);

const catEyesWide = svg(`
  <ellipse cx="46" cy="72" rx="10" ry="11" fill="#F6E39B"/>
  <ellipse cx="72" cy="72" rx="10" ry="11" fill="#F6E39B"/>
  <ellipse cx="46" cy="72" rx="10" ry="11" fill="url(#furBall)" opacity="0.3"/>
  <ellipse cx="72" cy="72" rx="10" ry="11" fill="url(#furBall)" opacity="0.3"/>
  <circle cx="46" cy="72" r="4.5" fill="#222"/>
  <circle cx="72" cy="72" r="4.5" fill="#222"/>
  <circle cx="48" cy="69" r="2" fill="#fff"/>
  <circle cx="74" cy="69" r="2" fill="#fff"/>
`);

const patternNone = '';

const patternSpots = svg(`
  <circle cx="48" cy="50" r="6" fill="#000" opacity="0.14"/>
  <circle cx="72" cy="56" r="7" fill="#000" opacity="0.12"/>
  <circle cx="100" cy="120" r="9" fill="#000" opacity="0.11"/>
  <circle cx="140" cy="125" r="10" fill="#000" opacity="0.11"/>
  <circle cx="120" cy="140" r="7" fill="#000" opacity="0.09"/>
`);

const patternStripes = svg(`
  <path d="M48 30 Q52 55 46 82" stroke="#000" stroke-width="4" opacity="0.12" fill="none" stroke-linecap="round"/>
  <path d="M66 26 Q68 55 66 84" stroke="#000" stroke-width="4" opacity="0.1" fill="none" stroke-linecap="round"/>
  <path d="M96 112 Q100 132 96 152" stroke="#000" stroke-width="5" opacity="0.1" fill="none" stroke-linecap="round"/>
  <path d="M128 110 Q132 132 128 154" stroke="#000" stroke-width="5" opacity="0.1" fill="none" stroke-linecap="round"/>
`);

const accessoryNone = '';

// Collar: short band centered on the face, tucked just under the chin.
const makeCollar = (faceCx, faceBottom, bandColor, tagFill = '#FFD54F', tagStroke = '#F9A825') => {
  const stroke = 10;
  // Sit the top of the stroke against the chin line
  const y = faceBottom + stroke / 2;
  const half = 22;
  const depth = 7;
  const left = faceCx - half;
  const right = faceCx + half;
  const tagY = y + depth + 2;
  return svg(`
  <path d="M${left} ${y} Q${faceCx} ${y + depth} ${right} ${y}" stroke="${bandColor}" stroke-width="${stroke}" fill="none" stroke-linecap="round"/>
  <path d="M${left} ${y} Q${faceCx} ${y + depth} ${right} ${y}" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.28"/>
  <circle cx="${faceCx}" cy="${tagY}" r="4.5" fill="${tagFill}" stroke="${tagStroke}" stroke-width="1.4"/>
  <circle cx="${faceCx - 1.2}" cy="${tagY - 1.2}" r="1.2" fill="#fff" opacity="0.55"/>
`);
};

const COLLAR_COLORS = [
  { id: 'collar-green', label: 'Green', color: '#2E7D32' },
  { id: 'collar-red', label: 'Red', color: '#C62828' },
  { id: 'collar-blue', label: 'Blue', color: '#1565C0' },
  { id: 'collar-pink', label: 'Pink', color: '#D81B60' },
  { id: 'collar-purple', label: 'Purple', color: '#6A1B9A' },
  { id: 'collar-black', label: 'Black', color: '#212121', tagFill: '#B0BEC5', tagStroke: '#78909C' }
];

// Legacy accessory ids → new collar slot ids
const LEGACY_COLLAR_MAP = {
  'acc-collar': 'collar-green',
  'acc-collar-red': 'collar-red',
  'acc-collar-blue': 'collar-blue',
  'acc-collar-pink': 'collar-pink',
  'acc-collar-purple': 'collar-purple',
  'acc-collar-black': 'collar-black'
};

function buildCollars(faceCx, faceBottom) {
  return [
    { id: 'collar-none', label: 'None', svg: accessoryNone },
    ...COLLAR_COLORS.map(({ id, label, color, tagFill, tagStroke }) => ({
      id,
      label,
      svg: makeCollar(faceCx, faceBottom, color, tagFill, tagStroke)
    }))
  ];
}

const accessoryBow = svg(`
  <circle cx="58" cy="30" r="5" fill="#E85D7A"/>
  <circle cx="58" cy="30" r="5" fill="url(#furBall)" opacity="0.35"/>
  <polygon points="38,30 54,22 54,38" fill="#E85D7A"/>
  <polygon points="78,30 62,22 62,38" fill="#E85D7A"/>
  <polygon points="38,30 54,22 54,38" fill="#fff" opacity="0.18"/>
  <polygon points="78,30 62,22 62,38" fill="#000" opacity="0.12"/>
`);

const accessoryHat = svg(`
  <ellipse cx="58" cy="30" rx="28" ry="6" fill="#5D4037"/>
  <ellipse cx="58" cy="28" rx="22" ry="3" fill="#fff" opacity="0.15"/>
  <rect x="42" y="8" width="32" height="22" rx="5" fill="#6D4C41"/>
  <rect x="42" y="8" width="32" height="22" rx="5" fill="url(#furTube)" opacity="0.55"/>
  <rect x="42" y="22" width="32" height="6" fill="#FFD54F"/>
  <rect x="44" y="23" width="12" height="2" rx="1" fill="#fff" opacity="0.35"/>
`);

const accessorySunglasses = svg(`
  <rect x="34" y="56" width="22" height="18" rx="5" fill="#212121"/>
  <rect x="60" y="56" width="22" height="18" rx="5" fill="#212121"/>
  <rect x="54" y="61" width="8" height="3" rx="1.5" fill="#212121"/>
  <path d="M34 61 H28" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
  <path d="M82 61 H88" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
  <rect x="37" y="59" width="10" height="7" rx="2" fill="#4FC3F7" opacity="0.55"/>
  <rect x="63" y="59" width="10" height="7" rx="2" fill="#4FC3F7" opacity="0.55"/>
  <rect x="38" y="58" width="5" height="2" rx="1" fill="#fff" opacity="0.45"/>
  <rect x="64" y="58" width="5" height="2" rx="1" fill="#fff" opacity="0.45"/>
`);

const accessoryFlower = svg(`
  <circle cx="86" cy="42" r="7" fill="#F48FB1"/>
  <circle cx="78" cy="48" r="7" fill="#F48FB1"/>
  <circle cx="94" cy="48" r="7" fill="#F48FB1"/>
  <circle cx="80" cy="56" r="7" fill="#F48FB1"/>
  <circle cx="92" cy="56" r="7" fill="#F48FB1"/>
  <circle cx="86" cy="42" r="7" fill="#fff" opacity="0.18"/>
  <circle cx="86" cy="50" r="5" fill="#FFD54F"/>
  <circle cx="86" cy="50" r="5" fill="url(#furBall)" opacity="0.35"/>
  <circle cx="84.5" cy="48.5" r="1.4" fill="#fff" opacity="0.55"/>
`);

const SHARED_ACCESSORIES = [
  { id: 'acc-none', label: 'None', svg: accessoryNone },
  { id: 'acc-bow', label: 'Bow', svg: accessoryBow },
  { id: 'acc-hat', label: 'Hat', svg: accessoryHat },
  { id: 'acc-sunglasses', label: 'Sunglasses', svg: accessorySunglasses },
  { id: 'acc-flower', label: 'Flower', svg: accessoryFlower }
];

export const PET_PARTS = {
  dog: {
    base: [
      { id: 'dog-base-round', label: 'Pointy ears', svg: dogBaseRound },
      { id: 'dog-base-floppy', label: 'Floppy ears', svg: dogBaseFloppy }
    ],
    eyes: [
      { id: 'eyes-happy', label: 'Happy', svg: dogEyesHappy },
      { id: 'eyes-sleepy', label: 'Sleepy', svg: dogEyesSleepy },
      { id: 'eyes-wide', label: 'Wide eyes', svg: dogEyesWide }
    ],
    pattern: [
      { id: 'pattern-none', label: 'Solid', svg: patternNone },
      { id: 'pattern-spots', label: 'Spots', svg: patternSpots },
      { id: 'pattern-stripes', label: 'Stripes', svg: patternStripes }
    ],
    // Face center x=58; snout chin ~112 so band sits flush under face
    collar: buildCollars(58, 112),
    accessory: SHARED_ACCESSORIES
  },
  cat: {
    base: [
      { id: 'cat-base-pointy', label: 'Pointy ears', svg: catBasePointy },
      { id: 'cat-base-round', label: 'Wide ears', svg: catBaseRound }
    ],
    eyes: [
      { id: 'eyes-happy', label: 'Happy', svg: catEyesHappy },
      { id: 'eyes-sleepy', label: 'Sleepy', svg: catEyesSleepy },
      { id: 'eyes-wide', label: 'Wide eyes', svg: catEyesWide }
    ],
    pattern: [
      { id: 'pattern-none', label: 'Solid', svg: patternNone },
      { id: 'pattern-spots', label: 'Spots', svg: patternSpots },
      { id: 'pattern-stripes', label: 'Stripes', svg: patternStripes }
    ],
    // Face center x=60; head circle bottom ~110
    collar: buildCollars(60, 108),
    accessory: SHARED_ACCESSORIES
  }
};

export const DEFAULT_APPEARANCE = {
  dog: {
    base: 'dog-base-round',
    eyes: 'eyes-happy',
    pattern: 'pattern-none',
    collar: 'collar-none',
    accessory: 'acc-none',
    color: DEFAULT_COLOR
  },
  cat: {
    base: 'cat-base-pointy',
    eyes: 'eyes-happy',
    pattern: 'pattern-none',
    collar: 'collar-none',
    accessory: 'acc-none',
    color: '#E39B48'
  }
};

export function getDefaultAppearance(type) {
  const defaults = DEFAULT_APPEARANCE[type] || DEFAULT_APPEARANCE.dog;
  return { ...defaults };
}

export function getPart(type, slot, partId) {
  const catalog = PET_PARTS[type];
  if (!catalog || !catalog[slot]) return null;
  return catalog[slot].find(part => part.id === partId) || catalog[slot][0] || null;
}

export function normalizeAppearance(type, appearance = {}) {
  const defaults = getDefaultAppearance(type);
  const incoming = { ...appearance };

  // Collars used to live in the accessory slot — move them over.
  if (LEGACY_COLLAR_MAP[incoming.accessory] && !incoming.collar) {
    incoming.collar = LEGACY_COLLAR_MAP[incoming.accessory];
    incoming.accessory = 'acc-none';
  }

  const normalized = { ...defaults, ...incoming };

  APPEARANCE_SLOTS.forEach(slot => {
    const part = getPart(type, slot, normalized[slot]);
    normalized[slot] = part ? part.id : defaults[slot];
  });

  if (typeof normalized.color !== 'string' || !/^#([0-9A-Fa-f]{6})$/.test(normalized.color)) {
    normalized.color = defaults.color;
  }

  return normalized;
}

export function getFallbackIcon(type) {
  return type === 'cat' ? '🐱' : '🐶';
}
