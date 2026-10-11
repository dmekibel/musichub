// Shared data and drawing for the Blue Note variations.
// Three real moments from Bach's Prelude in C, chosen to show the color system changing.

export const SECTIONS = [
  { from: 1, to: 4, title: "Home" },
  { from: 5, to: 11, title: "To G" },
  { from: 12, to: 19, title: "The way back" },
  { from: 20, to: 23, title: "Darker colors" },
  { from: 24, to: 31, title: "The long wait" },
  { from: 32, to: 35, title: "Home, held" },
];

export const BARS = {
  12: { bar: 12, root: "C", acc: "♯", q: "°7", bass: "G", fn: "D", pcs: [1, 4, 7, 10], names: { 1: "C♯", 4: "E", 7: "G", 10: "B♭" },
        word: "Tension", line: "It wants to resolve to D minor.", desc: "C♯ diminished seventh over G", rn: "vii°⁴₃ of ii" },
  13: { bar: 13, root: "D", acc: "", q: "m", bass: "F", fn: "S", pcs: [2, 5, 9], names: { 2: "D", 5: "F", 9: "A" },
        word: "Away", line: "D minor, right where the C♯ was pulling.", desc: "D minor over F", rn: "ii⁶" },
  15: { bar: 15, root: "C", acc: "", q: "", bass: "E", fn: "T", pcs: [0, 4, 7], names: { 0: "C", 4: "E", 7: "G" },
        word: "Home", line: "Home, but not settled yet: the bass is on E.", desc: "C major over E", rn: "I⁶" },
};

// One color per harmonic function, each with the ink that reads on it.
export const THEME = {
  T: { field: "#f2b135", ink: "#121110", shape: "#121110", dot: "#f6f0e5", soft: "rgba(18,17,16,.62)" },
  S: { field: "#1fa67a", ink: "#0f0f0e", shape: "#0f0f0e", dot: "#f6f0e5", soft: "rgba(15,15,14,.62)" },
  D: { field: "#3a2bdb", ink: "#f6f0e5", shape: "#0e0d0c", dot: "#f6f0e5", soft: "rgba(246,240,229,.66)" },
};

export function pickBar() {
  const n = +new URLSearchParams(location.search).get("bar");
  return BARS[n] || BARS[12];
}

export function applyTheme(bar, root = document.documentElement) {
  const t = THEME[bar.fn];
  root.style.setProperty("--field", t.field);
  root.style.setProperty("--ink", t.ink);
  root.style.setProperty("--shape", t.shape);
  root.style.setProperty("--dot", t.dot);
  root.style.setProperty("--soft", t.soft);
}

// A drawn sharp, so it matches the display type instead of falling back to a random font.
const SHARP = `<svg class="sharp" viewBox="0 0 44 100" aria-hidden="true"><path d="M13 4v92M29 2v92" stroke="currentColor" stroke-width="6"/><path d="M2 38 42 27v15L2 53zM2 66 42 55v15L2 81z" fill="currentColor"/></svg>`;

export function chordHTML(b) {
  return `<span class="root">${b.root}</span>${b.acc ? SHARP : ""}${b.q ? `<span class="q">${b.q}</span>` : ""}`;
}

/** The chord on the 12-note clock: hairline ring, the chord as a solid shape, labeled notes, ringed bass. */
export function drawClock(svg, b, { r = 132, labels = true, ring = true } = {}) {
  const NS = "http://www.w3.org/2000/svg";
  const el = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); svg.appendChild(e); return e; };
  const P = (pc, rr = r) => [rr * Math.sin(pc * Math.PI / 6), -rr * Math.cos(pc * Math.PI / 6)];
  const pad = r + 40;
  svg.setAttribute("viewBox", `${-pad} ${-pad} ${pad * 2} ${pad * 2}`);
  if (ring) el("circle", { r, fill: "none", stroke: "var(--ink)", "stroke-width": 1.2, opacity: .35 });
  for (let pc = 0; pc < 12; pc++) { if (b.pcs.includes(pc)) continue; const [x, y] = P(pc); el("circle", { cx: x, cy: y, r: 2.6, fill: "var(--ink)", opacity: .45 }); }
  el("polygon", { points: b.pcs.map((pc) => P(pc).join(",")).join(" "), fill: "var(--shape)" });
  const bassPc = Object.keys(b.names).find((k) => b.names[k] === b.bass);
  for (const pc of b.pcs) {
    const [x, y] = P(pc);
    if (String(pc) === bassPc) el("circle", { cx: x, cy: y, r: 15, fill: "none", stroke: "var(--ink)", "stroke-width": 1.6 });
    el("circle", { cx: x, cy: y, r: 8, fill: "var(--dot)", stroke: "var(--shape)", "stroke-width": 2.5 });
    if (labels) {
      const [lx, ly] = P(pc, r + 27);
      const t = el("text", { x: lx, y: ly + 6, "text-anchor": "middle", fill: "var(--ink)", "font-family": "Archivo", "font-size": 17, "font-weight": 600 });
      t.textContent = b.names[pc];
    }
  }
}

export function sectionOf(n) { return SECTIONS.find((s) => n >= s.from && n <= s.to); }
