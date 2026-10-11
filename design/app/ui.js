// MusicHub design system: harmonic color, the sleeve, small drawing helpers.
// Rule: color always means harmony. 0 = home-heavy and plain (saffron), 1 = tension-heavy and
// chromatic (indigo), through green. Nothing else in the app gets a hue.

const STOPS = [
  { at: 0.0, field: "#f2b135", deep: "#8a5410" },
  { at: 0.36, field: "#2ba57a", deep: "#0d5a41" },
  { at: 0.68, field: "#2f6fd0", deep: "#16397d" },
  { at: 1.0, field: "#3a2bdb", deep: "#1c1484" },
];
export const FN_H = { T: 0, S: 0.4, D: 1 };

const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function hexToLab(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => toLin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function labToHex([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return "#" + rgb.map((v) => Math.round(Math.max(0, Math.min(1, toGam(v))) * 255).toString(16).padStart(2, "0")).join("");
}
const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
// interpolate in OKLCH (keeps colors vivid between stops instead of going muddy)
function lerpLch(A, B, t) {
  const toLch = ([L, a, b]) => [L, Math.hypot(a, b), Math.atan2(b, a)];
  const [L1, C1, H1] = toLch(A), [L2, C2, H2] = toLch(B);
  let dH = H2 - H1; if (dH > Math.PI) dH -= 2 * Math.PI; if (dH < -Math.PI) dH += 2 * Math.PI;
  const L = L1 + (L2 - L1) * t, C = C1 + (C2 - C1) * t, H = H1 + dH * t;
  return [L, C * Math.cos(H), C * Math.sin(H)];
}

/** Harmonic color for a value 0..1: { field, deep, ink, soft } */
export function hc(h) {
  h = Math.max(0, Math.min(1, h));
  let i = 0;
  while (i < STOPS.length - 2 && h > STOPS[i + 1].at) i++;
  const A = STOPS[i], B = STOPS[i + 1], t = (h - A.at) / (B.at - A.at);
  const fieldLab = lerpLch(hexToLab(A.field), hexToLab(B.field), t);
  const field = labToHex(fieldLab), deep = labToHex(lerpLch(hexToLab(A.deep), hexToLab(B.deep), t));
  const light = fieldLab[0] > 0.66;
  return { field, deep, ink: light ? "#2e1d07" : "#f7f1e6", soft: light ? "rgba(46,29,7,.62)" : "rgba(247,241,230,.72)", tint: labToHex(lerp(fieldLab, hexToLab("#f4efe6"), 0.86)) };
}

// ---------- shapes drawn on sleeves (all in the sleeve's own deep tone and cream; never black)
const P = (i, n, r, c = 50) => [c + r * Math.sin((i / n) * Math.PI * 2), c - r * Math.cos((i / n) * Math.PI * 2)];
export const SHAPES = {
  chord: ({ pcs }, col) => {
    const pts = pcs.map((pc) => P(pc, 12, 34).join(",")).join(" ");
    return `<circle cx="50" cy="50" r="34" fill="none" stroke="${col.ink}" stroke-opacity=".35" stroke-width="1"/>
      <polygon points="${pts}" fill="${col.deep}"/>${pcs.map((pc) => { const [x, y] = P(pc, 12, 34); return `<circle cx="${x}" cy="${y}" r="3.6" fill="${col.ink}"/>`; }).join("")}`;
  },
  necklace: ({ on, n }, col) => {
    const pts = on.map((k) => P(k, n, 34).join(",")).join(" ");
    let ticks = "";
    for (let k = 0; k < n; k++) { const [x, y] = P(k, n, 34); ticks += `<circle cx="${x}" cy="${y}" r="${on.includes(k) ? 4 : 1.5}" fill="${col.ink}" ${on.includes(k) ? "" : 'fill-opacity=".45"'}/>`; }
    return `<polygon points="${pts}" fill="${col.deep}"/>${ticks}`;
  },
  wheel: ({ fns }, col) => {
    const n = fns.length; let s = "";
    fns.forEach((f, i) => {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + 0.82) / n) * Math.PI * 2;
      const r0 = 20, r1 = f === "D" ? 40 : f === "S" ? 33 : 27;
      const pt = (a, r) => `${50 + r * Math.sin(a)},${50 - r * Math.cos(a)}`;
      s += `<path d="M${pt(a0, r0)} L${pt(a0, r1)} A${r1} ${r1} 0 0 1 ${pt(a1, r1)} L${pt(a1, r0)} A${r0} ${r0} 0 0 0 ${pt(a0, r0)}Z" fill="${f === "T" ? col.ink : col.deep}" fill-opacity="${f === "S" ? 0.55 : 1}"/>`;
    });
    return s + `<circle cx="50" cy="50" r="12" fill="${col.deep}"/>`;
  },
  pin: (_, col) => `<circle cx="50" cy="50" r="34" fill="none" stroke="${col.deep}" stroke-width="2"/><circle cx="50" cy="50" r="22" fill="none" stroke="${col.deep}" stroke-width="2"/><circle cx="50" cy="50" r="9" fill="${col.ink}"/>`,
  tree: (_, col) => `<path d="M24 22 C24 50 50 46 50 70 M76 22 C76 50 50 46 50 70 M50 70 V86" fill="none" stroke="${col.deep}" stroke-width="7" stroke-linecap="round"/><circle cx="24" cy="20" r="6" fill="${col.ink}"/><circle cx="76" cy="20" r="6" fill="${col.ink}"/><circle cx="50" cy="88" r="7" fill="${col.ink}"/>`,
  path: (_, col) => `<path d="M28 84 C28 62 72 62 72 44 C72 28 36 30 36 16" fill="none" stroke="${col.deep}" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 12"/><circle cx="28" cy="84" r="8" fill="${col.ink}"/><circle cx="72" cy="46" r="8" fill="${col.deep}"/><circle cx="36" cy="16" r="8" fill="${col.deep}" fill-opacity=".5"/>`,
};

/**
 * The sleeve: a square record cover generated from data.
 * size: "xl" (full width, name huge and cropped), "l", "m" (name small), "s"/"xs" (shape only).
 */
export function sleeve({ h, shape, data = {}, name = "", tag = "", size = "m", nameSize }) {
  const col = hc(h);
  const svg = `<svg class="sl-shape" viewBox="0 0 100 100" aria-hidden="true">${SHAPES[shape](data, col)}</svg>`;
  const showName = size === "xl" || size === "l" || size === "m";
  return `<div class="sleeve sl-${size}" style="--f:${col.field};--d:${col.deep};--i:${col.ink};--s:${col.soft}">
    ${tag && (size === "xl" || size === "l") ? `<span class="sl-tag">${tag}</span>` : ""}
    ${svg}
    ${showName && name ? `<span class="sl-name" ${nameSize ? `style="font-size:${nameSize}"` : ""}>${name}</span>` : ""}
  </div>`;
}

// drawn sharp and flat so they match the display type
export const SHARP = `<svg class="acc" viewBox="0 0 44 100" aria-hidden="true"><path d="M13 4v92M29 2v92" stroke="currentColor" stroke-width="6"/><path d="M2 38 42 27v15L2 53zM2 66 42 55v15L2 81z" fill="currentColor"/></svg>`;
export const acc = (s) => s.replace(/♯/g, SHARP);

export const ICON = {
  back: `<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  play: `<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>`,
  prev: `<svg viewBox="0 0 24 24"><path d="M6 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 5.5v13L9 12z" fill="currentColor"/></svg>`,
  next: `<svg viewBox="0 0 24 24"><path d="M18 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 5.5v13L15 12z" fill="currentColor"/></svg>`,
  share: `<svg viewBox="0 0 24 24"><path d="M12 3v12M7 8l5-5 5 5M5 13v6h14v-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  save: `<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  check: `<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  lock: `<svg viewBox="0 0 24 24"><rect x="6" y="11" width="12" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 11V8a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
};

// ---------- shell: the four rooms + the mini-player
const ROOMS = [["today", "Today"], ["explore", "Explore"], ["learn", "Learn"], ["lab", "Lab"]];
export function shell(room, body, { mini = true } = {}) {
  const tabs = ROOMS.map(([id, label]) => `<a href="#${id}" class="${id === room ? "on" : ""}">${label}</a>`).join("");
  const miniHTML = mini ? `<a class="mini" href="#player">
      ${sleeve({ h: 0.62, shape: "wheel", data: { fns: "TSDTSDTSSDTDSDTSSDTDSDDDDDDDDDDTSDT".split("") }, size: "xs" })}
      <span class="txt"><b>Prelude in C · Bach</b><span>bar 12 · C♯°7 · tension</span></span>
      <span class="pl">${ICON.play}</span><span class="prog"><i style="width:33%"></i></span></a>` : "";
  return `<main class="screen">${body}</main>${miniHTML}<nav class="tabbar">${tabs}</nav>`;
}
export const page = (body) => `<main class="screen full">${body}</main>`;

export function roomHead(title) {
  return `<header class="roomhead"><h1 class="disp">${title}</h1><a class="me" href="#you" aria-label="You">D</a></header>`;
}
export function topBar(title = "", right = ICON.share) {
  return `<div class="topbar"><a class="ic" href="javascript:history.back()" aria-label="Back">${ICON.back}</a><span class="ttl">${title}</span><span class="ic">${right}</span></div>`;
}

// ---------- the Five Dials glyph: five symmetric shapes, each sized by strength
const DIAL_SHAPES = { key: [0, 2, 4, 5, 7, 9, 11], squares: [0, 3, 6, 9], triangles: [0, 4, 8], hexagons: [0, 2, 4, 6, 8, 10], cluster: [11, 0, 1] };
export const DIAL_NAMES = { key: "Key", squares: "Squares", triangles: "Triangles", hexagons: "Hexagons", cluster: "Cluster" };
export function dialSVG(kind, v, color = "var(--ink)") {
  const r = 14 + 22 * Math.sqrt(Math.max(0, Math.min(1, v)));
  const pts = DIAL_SHAPES[kind].map((pc) => { const a = (pc / 12) * Math.PI * 2; return `${(50 + r * Math.sin(a)).toFixed(1)},${(50 - r * Math.cos(a)).toFixed(1)}`; }).join(" ");
  return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="none" stroke="var(--hair)" stroke-width="2"/><polygon points="${pts}" fill="${color}" fill-opacity="${(0.25 + 0.75 * v).toFixed(2)}"/></svg>`;
}
export function dialsRow(d, notes = {}) {
  return `<div class="dials">${Object.keys(DIAL_SHAPES).map((k) => `<div class="dl">${dialSVG(k, d[k])}<b>${DIAL_NAMES[k]}</b><span class="num">${d[k].toFixed(2)}${notes[k] ? ` · ${notes[k]}` : ""}</span></div>`).join("")}</div>`;
}
