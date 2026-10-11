// Content for the prototype. Bach's Prelude in C is real (score + checked analysis, measured here).
// Everything else is illustrative content for the design mockup and is labeled as such on screen.
import { BWV846_NOTES } from "../../data/bwv846-notes.js?v=20261011e";
import { BWV846 } from "../../data/bwv846-analysis.js?v=20261011e";

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
const voicing = Array.from({ length: NB }, () => new Set());
for (const [on, len, m] of BWV846_NOTES.notes) { const b = Math.min(NB - 1, Math.floor(on / 16)); barPc[b][m % 12] += len; allPc[m % 12] += len; if (on % 16 < 8) voicing[b].add(m); }

// the Harmony Atlas address of each bar, read in C (bars 5–11 visit G; shown here as their meaning in C)
const ADDR = ["I", "ii", "V", "I", "vi", "V/V", "V", "I", "vi", "V/V", "V", "vii°/ii", "ii", "vii°", "I", "IV", "ii", "V", "I", "V/IV", "IV", "vii°/V", "vii°", "V", "I⁶₄", "V", "V", "vii°/V", "I⁶₄", "V", "V", "I", "IV", "V", "I"];

export const BACH = {
  id: "bach", title: "Prelude in C", composer: "J. S. Bach", year: 1722, h: 0.62,
  work: "The Well-Tempered Clavier, Book I",
  bars: BWV846.bars.map((b, i) => ({ ...b, addr: ADDR[i], dials: dialsOf(barPc[i]), pcs: barPc[i].map((w, pc) => (w ? pc : -1)).filter((pc) => pc >= 0), voicing: [...voicing[i]].sort((a, c) => a - c) })),
  sections: BWV846.sections,
  fns: BWV846.bars.map((b) => b.fn),
  dials: dialsOf(allPc),
  counts: ADDR.reduce((m, a) => ((m[a] = (m[a] || 0) + 1), m), {}),
};
BACH.fnCount = BACH.fns.reduce((m, f) => ((m[f] = (m[f] || 0) + 1), m), {});

// harmonic palette, read three ways
export const kind = (c) => /dim7/.test(c) ? "diminished 7th" : /maj7/.test(c) ? "major 7th" : /m7/.test(c) ? "minor 7th" : /sus4/.test(c) ? "suspended" : /7/.test(c) ? "dominant 7th" : /m/.test(c.split("/")[0]) ? "minor" : "major";
const groups = {};
BACH.bars.forEach((b) => { const k = kind(b.chord); (groups[k] ||= { n: 0, fn: {} }).n++; groups[k].fn[b.fn] = (groups[k].fn[b.fn] || 0) + 1; });
BACH.palette = Object.entries(groups).sort((a, b) => b[1].n - a[1].n).map(([k, g]) => ({ name: k, n: g.n, fn: Object.entries(g.fn).sort((a, b) => b[1] - a[1])[0][0] }));

// ---------- ideas: every chord kind and every Atlas address in the Prelude gets a page, generated from the bars above
export const KINDS = {
  "major": { id: "maj", iv: [0, 4, 7], plain: "The bright, settled chord. Three notes, and nothing in it wants to move.", theory: "Root, major third, perfect fifth. The tonic triad when it sits on home.", rel: [["min", "lower the middle note by a half step"], ["maj7", "add a note a half step under the top"]] },
  "minor": { id: "min", iv: [0, 3, 7], plain: "The major chord's darker twin: same outline, the middle note one step lower.", theory: "Root, minor third, perfect fifth. In a major key: ii, iii and vi.", rel: [["maj", "raise the middle note by a half step"], ["m7", "add the seventh on top"]] },
  "dominant 7th": { id: "dom7", iv: [0, 4, 7, 10], plain: "The \"go home\" chord. Two of its notes clash (a tritone) and want to pull apart, straight into home.", theory: "Major triad plus a minor seventh. V⁷ resolves to I: the third rises, the seventh falls.", rel: [["dim7", "raise the bottom note by a half step and you get a perfect square"], ["sus", "lift the third to the fourth and the pull hangs in the air"]] },
  "diminished 7th": { id: "dim7", iv: [0, 3, 6, 9], plain: "Four notes evenly spaced: a perfect square on the 12-note clock. It belongs to no single key, so it can lean anywhere.", theory: "Stacked minor thirds; only three exist (Barry Harris's three squares). vii°⁷ acts as a dominant without its root.", rel: [["dom7", "lower any one note by a half step: a dominant seventh"], ["maj", "Barry Harris: alternate it with a major sixth chord and you get the 6th-diminished scale"]] },
  "major 7th": { id: "maj7", iv: [0, 4, 7, 11], plain: "A major chord with a soft blur on top: settled, but dreamy.", theory: "Major triad plus a major seventh, a half step under the octave. Imaj7 and IVmaj7.", rel: [["maj", "take away the top note"], ["min", "its top three notes make a minor chord"]] },
  "minor 7th": { id: "m7", iv: [0, 3, 7, 10], plain: "A minor chord with an extra note on top. Mellow, and it likes to walk toward tension.", theory: "Minor triad plus a minor seventh. ii⁷ is the classic way to approach V.", rel: [["min", "take away the top note"], ["dom7", "ii⁷ usually walks to V⁷: the 2–5"]] },
  "suspended": { id: "sus", iv: [0, 5, 7, 10], plain: "The middle note is held one step too high, so the chord hangs, waiting to land.", theory: "The fourth replaces the third (V⁷sus4). It delays the dominant's resolution.", rel: [["dom7", "let the fourth fall to the third"]] },
};
export const KIND_BY_ID = Object.fromEntries(Object.entries(KINDS).map(([name, k]) => [k.id, { ...k, name }]));
export const ADDRS = {
  "I": { name: "Home", chord: "C", plain: "Where the music rests. Every trip in the piece starts and ends here.", theory: "The tonic, I." },
  "vi": { name: "Soft home", chord: "Am", plain: "Home's minor shadow: restful, but not the end.", theory: "The submediant, vi: tonic function, shares two notes with I." },
  "iii": { name: "Home's other shade", chord: "Em", plain: "Rare here: Bach never uses it in this piece.", theory: "The mediant, iii." },
  "IV": { name: "The four", chord: "F", plain: "A step away from home: open, like a breath out.", theory: "The subdominant, IV." },
  "ii": { name: "The two", chord: "Dm", plain: "Away, and starting to walk toward tension.", theory: "The supertonic, ii: subdominant function, the start of a 2–5–1." },
  "V": { name: "The five", chord: "G", plain: "Tension. It wants to go home, and usually does.", theory: "The dominant, V (often V⁷)." },
  "vii°": { name: "The square", chord: "B°", plain: "Tension without a root: the five chord's shadow, shaped like a square.", theory: "The leading-tone chord, vii°⁷: dominant function." },
  "I⁶₄": { name: "The doorstep", chord: "C/G", plain: "Sounds like home, but it's standing on the five: one step from the door.", theory: "Cadential ⁶₄: dominant function over the fifth in the bass." },
  "V/V": { name: "Leaning on the five", chord: "D7", plain: "Borrowed tension that points at the five chord, making it feel like a new home for a moment.", theory: "Secondary dominant, V/V." },
  "V/IV": { name: "Leaning on the four", chord: "C7", plain: "Home with one note bent: now it points away, toward the four.", theory: "Secondary dominant, V/IV." },
  "vii°/ii": { name: "The square to two", chord: "C♯°7", plain: "A square that points at the two chord.", theory: "Secondary leading-tone chord, vii°⁷/ii." },
  "vii°/V": { name: "The square to five", chord: "F♯°7", plain: "A square that points at the five chord and makes it shine.", theory: "Secondary leading-tone chord, vii°⁷/V." },
};

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
