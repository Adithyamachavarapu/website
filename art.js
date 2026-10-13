// ============================================================
// art.js — SVG product illustrations
// Each product has a `type` and a `color`; productArt(p) draws it.
// Pure inline SVG, so the app needs no internet and no image files.
// ============================================================

function shade(hex, pct) {
  // darken/lighten a #rrggbb color by pct (-100..100)
  const n = parseInt(hex.slice(1), 16);
  const f = c => Math.min(255, Math.max(0, Math.round(c + (pct / 100) * 255)));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

const ART = {

  tshirt: c => `
    <path d="M65 52 L88 40 C 93 54 107 54 112 40 L135 52 L162 88 L134 103 L134 200 L66 200 L66 103 L38 88 Z" fill="${c}"/>
    <path d="M65 52 L38 88 L66 103 Z" fill="${shade(c,-14)}"/>
    <path d="M135 52 L162 88 L134 103 Z" fill="${shade(c,-14)}"/>
    <path d="M88 40 C 93 54 107 54 112 40" fill="none" stroke="${shade(c,-25)}" stroke-width="4"/>`,

  shirt: c => `
    <path d="M65 50 L88 40 C 93 52 107 52 112 40 L135 50 L160 86 L133 100 L133 202 L67 202 L67 100 L40 86 Z" fill="${c}"/>
    <path d="M65 50 L40 86 L67 100 Z" fill="${shade(c,-12)}"/>
    <path d="M135 50 L160 86 L133 100 Z" fill="${shade(c,-12)}"/>
    <path d="M88 40 L100 58 L93 66 L85 50 Z" fill="${shade(c,-20)}"/>
    <path d="M112 40 L100 58 L107 66 L115 50 Z" fill="${shade(c,-20)}"/>
    <line x1="100" y1="60" x2="100" y2="200" stroke="${shade(c,-22)}" stroke-width="2"/>
    <circle cx="100" cy="85" r="2.6" fill="${shade(c,-35)}"/>
    <circle cx="100" cy="115" r="2.6" fill="${shade(c,-35)}"/>
    <circle cx="100" cy="145" r="2.6" fill="${shade(c,-35)}"/>
    <circle cx="100" cy="175" r="2.6" fill="${shade(c,-35)}"/>`,

  jacket: c => `
    <path d="M62 52 L88 40 C 93 52 107 52 112 40 L138 52 L164 90 L136 104 L136 202 L64 202 L64 104 L36 90 Z" fill="${c}"/>
    <path d="M62 52 L36 90 L64 104 Z" fill="${shade(c,-14)}"/>
    <path d="M138 52 L164 90 L136 104 Z" fill="${shade(c,-14)}"/>
    <path d="M88 40 L100 62 L84 74 L76 52 Z" fill="${shade(c,-24)}"/>
    <path d="M112 40 L100 62 L116 74 L124 52 Z" fill="${shade(c,-24)}"/>
    <rect x="97" y="60" width="6" height="142" fill="${shade(c,-30)}"/>
    <line x1="100" y1="64" x2="100" y2="198" stroke="${shade(c,18)}" stroke-width="1.6" stroke-dasharray="4 4"/>
    <rect x="70" y="120" width="22" height="7" rx="3" fill="${shade(c,-26)}"/>
    <rect x="108" y="120" width="22" height="7" rx="3" fill="${shade(c,-26)}"/>
    <rect x="64" y="188" width="72" height="14" fill="${shade(c,-18)}"/>`,

  hoodie: c => `
    <path d="M64 58 L84 44 Q100 70 116 44 L136 58 L162 94 L134 108 L134 202 L66 202 L66 108 L38 94 Z" fill="${c}"/>
    <path d="M64 58 L38 94 L66 108 Z" fill="${shade(c,-14)}"/>
    <path d="M136 58 L162 94 L134 108 Z" fill="${shade(c,-14)}"/>
    <path d="M84 44 Q100 18 116 44 Q100 72 84 44 Z" fill="${shade(c,-20)}"/>
    <line x1="93" y1="62" x2="92" y2="84" stroke="${shade(c,-35)}" stroke-width="3" stroke-linecap="round"/>
    <line x1="107" y1="62" x2="108" y2="84" stroke="${shade(c,-35)}" stroke-width="3" stroke-linecap="round"/>
    <path d="M74 150 L126 150 L120 186 L80 186 Z" fill="${shade(c,-14)}"/>`,

  kurta: c => `
    <path d="M68 48 L90 38 C 94 50 106 50 110 38 L132 48 L156 84 L132 96 L132 214 L68 214 L68 96 L44 84 Z" fill="${c}"/>
    <path d="M68 48 L44 84 L68 96 Z" fill="${shade(c,-12)}"/>
    <path d="M132 48 L156 84 L132 96 Z" fill="${shade(c,-12)}"/>
    <path d="M90 38 C 94 50 106 50 110 38" fill="none" stroke="${shade(c,-28)}" stroke-width="3.6"/>
    <line x1="100" y1="50" x2="100" y2="112" stroke="${shade(c,-24)}" stroke-width="2.4"/>
    <circle cx="100" cy="68" r="2.4" fill="${shade(c,-38)}"/>
    <circle cx="100" cy="86" r="2.4" fill="${shade(c,-38)}"/>
    <circle cx="100" cy="104" r="2.4" fill="${shade(c,-38)}"/>
    <line x1="68" y1="176" x2="68" y2="214" stroke="${shade(c,-20)}" stroke-width="3"/>
    <line x1="132" y1="176" x2="132" y2="214" stroke="${shade(c,-20)}" stroke-width="3"/>`,

  dress: c => `
    <path d="M80 42 L120 42 L116 72 L124 112 L76 112 L84 72 Z" fill="${c}"/>
    <line x1="85" y1="42" x2="88" y2="30" stroke="${shade(c,-20)}" stroke-width="3.4" stroke-linecap="round"/>
    <line x1="115" y1="42" x2="112" y2="30" stroke="${shade(c,-20)}" stroke-width="3.4" stroke-linecap="round"/>
    <rect x="76" y="106" width="48" height="9" rx="4" fill="${shade(c,-24)}"/>
    <path d="M76 115 L124 115 L152 206 L48 206 Z" fill="${c}"/>
    <path d="M90 115 L82 204 M100 115 L100 206 M110 115 L118 204" stroke="${shade(c,-16)}" stroke-width="2" fill="none"/>`,

  jeans: c => `
    <rect x="64" y="50" width="72" height="16" rx="3" fill="${shade(c,-16)}"/>
    <circle cx="100" cy="58" r="3" fill="${shade(c,-40)}"/>
    <path d="M64 66 L98 66 L96 208 L66 208 Z" fill="${c}"/>
    <path d="M136 66 L102 66 L104 208 L134 208 Z" fill="${c}"/>
    <path d="M64 66 Q78 84 98 80 L98 66 Z" fill="${shade(c,-10)}"/>
    <path d="M136 66 Q122 84 102 80 L102 66 Z" fill="${shade(c,-10)}"/>
    <line x1="100" y1="66" x2="100" y2="84" stroke="${shade(c,-30)}" stroke-width="2.4"/>
    <rect x="66" y="198" width="30" height="10" fill="${shade(c,-18)}"/>
    <rect x="104" y="198" width="30" height="10" fill="${shade(c,-18)}"/>`,

  sneaker: c => `
    <path d="M34 162 Q38 128 72 124 L104 124 Q112 134 128 142 Q150 152 166 154 Q174 157 172 166 L34 166 Z" fill="${c}"/>
    <path d="M104 124 Q112 134 128 142 L120 150 Q104 142 96 130 Z" fill="${shade(c,-16)}"/>
    <path d="M60 140 L76 132 M68 148 L86 139 M76 156 L96 146" stroke="${shade(c,55)}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M30 166 L176 166 Q180 166 180 172 Q180 182 168 182 L42 182 Q30 182 30 172 Z" fill="${shade(c,-38)}"/>
    <path d="M34 162 Q52 170 74 166 L34 166 Z" fill="${shade(c,-10)}"/>`,

  heel: c => `
    <path d="M46 146 Q78 112 118 120 L150 132 Q160 138 156 148 L112 152 Q80 156 60 152 Z" fill="${c}"/>
    <path d="M118 120 L150 132 Q160 138 156 148 L140 149 Q138 132 118 120 Z" fill="${shade(c,-14)}"/>
    <path d="M140 149 L152 149 L148 196 L138 196 Z" fill="${shade(c,-26)}"/>
    <path d="M46 146 Q60 158 92 154 L60 196 L50 196 Q42 168 46 146 Z" fill="${shade(c,-8)}"/>
    <path d="M60 196 L152 196 L152 202 L56 202 Z" fill="${shade(c,-34)}"/>`,

  watch: c => `
    <rect x="86" y="26" width="28" height="186" rx="10" fill="${shade(c,-18)}"/>
    <line x1="100" y1="42" x2="100" y2="54" stroke="${shade(c,-34)}" stroke-width="2"/>
    <line x1="100" y1="186" x2="100" y2="198" stroke="${shade(c,-34)}" stroke-width="2"/>
    <circle cx="100" cy="120" r="44" fill="${c}"/>
    <circle cx="100" cy="120" r="35" fill="#faf7f2"/>
    <circle cx="100" cy="120" r="2.6" fill="#333"/>
    <line x1="100" y1="120" x2="100" y2="96" stroke="#333" stroke-width="3" stroke-linecap="round"/>
    <line x1="100" y1="120" x2="118" y2="128" stroke="#333" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="146" y="112" width="8" height="16" rx="3" fill="${shade(c,-22)}"/>`,

  backpack: c => `
    <path d="M78 58 Q100 36 122 58" fill="none" stroke="${shade(c,-24)}" stroke-width="8" stroke-linecap="round"/>
    <rect x="54" y="62" width="92" height="128" rx="20" fill="${c}"/>
    <rect x="54" y="62" width="92" height="30" rx="15" fill="${shade(c,-10)}"/>
    <rect x="68" y="128" width="64" height="50" rx="12" fill="${shade(c,-16)}"/>
    <line x1="68" y1="146" x2="132" y2="146" stroke="${shade(c,-32)}" stroke-width="3"/>
    <rect x="96" y="140" width="8" height="14" rx="3" fill="${shade(c,-36)}"/>
    <line x1="60" y1="100" x2="140" y2="100" stroke="${shade(c,-26)}" stroke-width="3" stroke-dasharray="5 4"/>`,

  tote: c => `
    <path d="M70 96 Q82 54 94 96" fill="none" stroke="${shade(c,-24)}" stroke-width="7" stroke-linecap="round"/>
    <path d="M106 96 Q118 54 130 96" fill="none" stroke="${shade(c,-24)}" stroke-width="7" stroke-linecap="round"/>
    <path d="M54 96 L146 96 L136 198 L64 198 Z" fill="${c}"/>
    <path d="M54 96 L146 96 L144 114 L56 114 Z" fill="${shade(c,-12)}"/>
    <line x1="64" y1="188" x2="136" y2="188" stroke="${shade(c,-22)}" stroke-width="2.6" stroke-dasharray="5 4"/>`,

  cap: c => `
    <path d="M52 132 Q100 58 148 132 L52 132 Z" fill="${c}"/>
    <path d="M70 126 Q84 86 100 68 M130 126 Q116 86 100 68" fill="none" stroke="${shade(c,-18)}" stroke-width="2.6"/>
    <circle cx="100" cy="66" r="5" fill="${shade(c,-26)}"/>
    <path d="M52 132 Q100 118 148 132 L164 146 Q100 130 38 148 Z" fill="${shade(c,-20)}"/>`
};

// one product → one framed SVG tile
function productArt(p) {
  const draw = ART[p.type] || ART.tshirt;
  return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">
    ${draw(p.color)}
  </svg>`;
}
