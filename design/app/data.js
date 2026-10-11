// Content for the prototype. Bach's Prelude in C is real (score + checked analysis, measured here).
// Everything else is illustrative content for the design mockup and is labeled as such on screen.
import { BWV846_NOTES } from "../../data/bwv846-notes.js";
import { BWV846 } from "../../data/bwv846-analysis.js";

// ---------- measures computed from the real score
function dft(v, k) {
  const s = v.reduce((a, b) => a + b, 0) || 1; let re = 0, im = 0;
  v.forEach((x, p) => { re += x * Math.cos((2 * Math.PI * k * p) / 12); im -= x * Math.sin((2 * Math.PI * k * p) / 12); });
  return Math.hypot(re, im) / s;
}
export const dialsOf = (v) => ({ key: dft(v, 5), squares: dft(v, 4), triangles: dft(v, 3), hexagons: dft(v, 6), cluster: dft(v, 1) });

const NB = BWV846.bars.length;
const barPc = Array.from({ length: NB }, () => new Array(12).fill(0));
const allPc = new Array(12).fill(0);
for (const [on, len, m] of BWV846_NOTES.notes) { const b = Math.min(NB - 1, Math.floor(on / 16)); barPc[b][m % 12] += len; allPc[m % 12] += len; }

// the Harmony Atlas address of each bar, read in C (bars 5–11 visit G; shown here as their meaning in C)
const ADDR = ["I", "ii", "V", "I", "vi", "V/V", "V", "I", "vi", "V/V", "V", "vii°/ii", "ii", "vii°", "I", "IV", "ii", "V", "I", "V/IV", "IV", "vii°/V", "vii°", "V", "I⁶₄", "V", "V", "vii°/V", "I⁶₄", "V", "V", "I", "IV", "V", "I"];

export const BACH = {
  id: "bach", title: "Prelude in C", composer: "J. S. Bach", year: 1722, h: 0.62,
  work: "The Well-Tempered Clavier, Book I",
  bars: BWV846.bars.map((b, i) => ({ ...b, addr: ADDR[i], dials: dialsOf(barPc[i]) })),
  sections: BWV846.sections,
  fns: BWV846.bars.map((b) => b.fn),
  dials: dialsOf(allPc),
  counts: ADDR.reduce((m, a) => ((m[a] = (m[a] || 0) + 1), m), {}),
};
BACH.fnCount = BACH.fns.reduce((m, f) => ((m[f] = (m[f] || 0) + 1), m), {});

// harmonic palette, read three ways
const kind = (c) => /dim7/.test(c) ? "diminished 7th" : /maj7/.test(c) ? "major 7th" : /m7/.test(c) ? "minor 7th" : /sus4/.test(c) ? "suspended" : /7/.test(c) ? "dominant 7th" : /m/.test(c.split("/")[0]) ? "minor" : "major";
const groups = {};
BACH.bars.forEach((b) => { const k = kind(b.chord); (groups[k] ||= { n: 0, fn: {} }).n++; groups[k].fn[b.fn] = (groups[k].fn[b.fn] || 0) + 1; });
BACH.palette = Object.entries(groups).sort((a, b) => b[1].n - a[1].n).map(([k, g]) => ({ name: k, n: g.n, fn: Object.entries(g.fn).sort((a, b) => b[1] - a[1])[0][0] }));

// ---------- illustrative content (shape of the real app, values for the mockup)
export const BOSSA = {
  id: "bossa", name: "Bossa nova", h: 0.74, place: "Rio de Janeiro", when: "late 1950s",
  line: "Samba slowed down and sung softly, with the chords of cool jazz.",
  clave: [0, 3, 6, 10, 13],
  roots: [["Samba", "Rio, 1910s–1930s", 0.3], ["Cool jazz", "US West Coast, 1950s", 0.78]],
  became: [["MPB", "Brazil, 1960s", 0.55], ["Jazz bossa", "New York, 1960s", 0.8]],
  people: [["João Gilberto", "the voice and the guitar beat"], ["Antônio Carlos Jobim", "the songs"], ["Vinícius de Moraes", "the words"]],
  pieces: [["Chega de Saudade", 1958, 0.72], ["Desafinado", 1959, 0.8], ["Garota de Ipanema", 1962, 0.7], ["Getz/Gilberto", 1964, 0.76]],
  dials: { key: 0.41, squares: 0.12, triangles: 0.18, hexagons: 0.07, cluster: 0.16 },
};

export const PLACES_1950s = [
  ["Havana", 23.1, -82.4, "cha-cha-chá and mambo", 0.32], ["Rio de Janeiro", -22.9, -43.2, "bossa nova is born", 0.74],
  ["New York", 40.7, -74.0, "hard bop", 0.88], ["Chicago", 41.9, -87.6, "electric blues", 0.22],
  ["Memphis", 35.1, -90.0, "rock and roll", 0.14], ["Kingston", 18.0, -76.8, "ska begins", 0.2],
  ["Lagos", 6.5, 3.4, "highlife", 0.26], ["Accra", 5.6, -0.2, "highlife", 0.24],
  ["Cairo", 30.0, 31.2, "Umm Kulthum's long songs", 0.5], ["Paris", 48.9, 2.35, "chanson", 0.46],
  ["Mumbai", 19.1, 72.9, "film songs", 0.42], ["Tokyo", 35.7, 139.7, "kayōkyoku", 0.38],
  ["Buenos Aires", -34.6, -58.4, "tango", 0.6], ["Johannesburg", -26.2, 28.0, "kwela", 0.18],
  ["Seville", 37.4, -6.0, "flamenco", 0.56],
];

export const SQUARES = [
  { id: "C", pcs: [0, 3, 6, 9], names: ["C", "E♭", "F♯", "A"], h: 0.0, axis: "Lendvai's tonic axis" },
  { id: "C♯", pcs: [1, 4, 7, 10], names: ["C♯", "E", "G", "B♭"], h: 1.0, axis: "Lendvai's dominant axis" },
  { id: "D", pcs: [2, 5, 8, 11], names: ["D", "F", "A♭", "B"], h: 0.4, axis: "Lendvai's subdominant axis" },
];
export const PC = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
