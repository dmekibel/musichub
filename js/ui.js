// Shared bits for the lenses: colors, words, the focus rule, tiny DOM helpers.

export const FN = {
  T: { word: "Home", theory: "tonic", color: "var(--tonic)" },
  S: { word: "Away", theory: "subdominant", color: "var(--sub)" },
  D: { word: "Tension", theory: "dominant", color: "var(--dom)" },
};

/** Station = the Roman numeral without inversion figures: "V⁶₅" -> "V", "vii°7/V" -> "vii°/V". */
export function stationKey(rn) {
  if (rn.startsWith("I⁶₄")) return "I⁶₄";
  return rn.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/g, "").replace(/maj7|sus4|7/g, "");
}

/** Does a bar match the current focus? (null focus matches everything) */
export function matches(b, focus) {
  if (!focus) return true;
  switch (focus.kind) {
    case "fn": return b.fn === focus.fn;
    case "bars": return focus.bars.includes(b.bar);
    case "pc": return b.pcs.includes(focus.pc);
    case "station": return b.key === focus.key && stationKey(b.rn) === focus.station;
    default: return true;
  }
}

export function focusLabel(focus, model) {
  if (!focus) return "";
  const n = model.bars.filter((b) => matches(b, focus)).length;
  const of = `${n} of ${model.nBars} bars`;
  switch (focus.kind) {
    case "fn": return `${FN[focus.fn].word} (${FN[focus.fn].theory}) · ${of}`;
    case "pc": return `Bars with ${focus.name} · ${of}`;
    case "station": return `${focus.station} in ${focus.key} major · ${of}`;
    default: return `${focus.label} · ${of}`;
  }
}

export const SVGNS = "http://www.w3.org/2000/svg";
export function svg(tag, attrs = {}, parent) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (parent) parent.appendChild(el);
  return el;
}
export function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for (const k of kids) if (k != null) el.append(k);
  return el;
}

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Smooth path through points (Catmull-Rom to cubic Bézier). */
export function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", SUB = "₀₁₂₃₄₅₆₇₈₉";
/** Roman numeral with stacked figures as HTML: "V⁶₅" -> V with 6 over 5, "V7/IV" -> V⁷/IV. */
export function rnHTML(rn) {
  const m = /^([ivIV]+°?)([⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]*)(maj7|7sus4|7)?(\/.*)?$/u.exec(rn);
  if (!m) return rn;
  const [, base, figs, seventh, applied] = m;
  const up = [...figs].filter((c) => SUP.includes(c)).map((c) => SUP.indexOf(c)).join("");
  const down = [...figs].filter((c) => SUB.includes(c)).map((c) => SUB.indexOf(c)).join("");
  let out = base;
  if (up || down) out += `<span class="fig"><span>${up}</span><span>${down}</span></span>`;
  if (seventh) out += `<sup class="fig1">${seventh}</sup>`;
  if (applied) out += applied;
  return out;
}
