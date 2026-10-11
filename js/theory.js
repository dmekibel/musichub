// Music theory helpers. Pure functions, no DOM.

export const PC_NAMES = ["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// The three diminished seventh chords. Together they use all 12 notes exactly once.
export const DIM_AXES = [
  { id: "C", pcs: [0, 3, 6, 9] },
  { id: "D♭", pcs: [1, 4, 7, 10] },
  { id: "D", pcs: [2, 5, 8, 11] },
];

const QUALITY = {
  "":     { ints: [0, 4, 7],      words: "major triad" },
  m:      { ints: [0, 3, 7],      words: "minor triad" },
  dim:    { ints: [0, 3, 6],      words: "diminished triad" },
  "7":    { ints: [0, 4, 7, 10],  words: "dominant seventh" },
  maj7:   { ints: [0, 4, 7, 11],  words: "major seventh" },
  m7:     { ints: [0, 3, 7, 10],  words: "minor seventh" },
  dim7:   { ints: [0, 3, 6, 9],   words: "diminished seventh" },
  m7b5:   { ints: [0, 3, 6, 10],  words: "half-diminished seventh" },
  "7sus4": { ints: [0, 5, 7, 10], words: "dominant seventh, suspended fourth" },
};

/** "C#" / "Bb" / "C♯" -> pitch class */
export function pcOf(name) {
  const m = /^([A-G])([#♯b♭]*)/.exec(name);
  let pc = LETTER_PC[m[1]];
  for (const c of m[2]) pc += c === "#" || c === "♯" ? 1 : -1;
  return ((pc % 12) + 12) % 12;
}

/** Pretty-print a spelled name: "C#" -> "C♯", "Bb" -> "B♭", dim7 -> °7 */
export function pretty(s) {
  return s.replace(/#/g, "♯").replace(/([A-G])b/g, "$1♭").replace(/dim7/g, "°7").replace(/maj7/g, "maj7");
}

/** Parse "C#dim7/G" -> { root, quality, bass, pcs, words } */
export function parseChord(sym) {
  const [main, bass] = sym.split("/");
  const m = /^([A-G][#b]?)(.*)$/.exec(main);
  const q = QUALITY[m[2]];
  if (!q) throw new Error(`Unknown chord quality "${m[2]}" in ${sym}`);
  const root = pcOf(m[1]);
  return {
    sym, rootName: m[1], root, quality: m[2], words: q.words,
    pcs: q.ints.map((i) => (root + i) % 12),
    bass: bass ? pcOf(bass) : root,
    bassName: bass || m[1],
  };
}

export function inversionWords(chord) {
  if (chord.bass === chord.root) return "root position";
  const i = chord.pcs.indexOf(chord.bass);
  return ["root position", "first inversion", "second inversion", "third inversion"][i] || "";
}

const MAJOR = [0, 2, 4, 5, 7, 9, 11];
export function inKey(pc, keyName) {
  const k = pcOf(keyName);
  return MAJOR.includes((pc - k + 12) % 12);
}

// Interval names above the bass, by semitones
const INTERVAL = ["unison", "minor 2nd", "major 2nd", "minor 3rd", "major 3rd", "perfect 4th",
  "tritone", "perfect 5th", "minor 6th", "major 6th", "minor 7th", "major 7th"];
export const intervalName = (semis) => INTERVAL[((semis % 12) + 12) % 12];

/**
 * Roughness of a set of pitch classes: a simple stand-in for sensory dissonance
 * (Plomp & Levelt). Semitones and tritones clash most, whole tones a little.
 */
export function roughness(pcs) {
  const set = [...new Set(pcs)];
  const w = [0, 1.0, 0.35, 0.1, 0.05, 0.05, 0.8];
  let r = 0;
  for (let i = 0; i < set.length; i++)
    for (let j = i + 1; j < set.length; j++) {
      let d = Math.abs(set[i] - set[j]) % 12;
      if (d > 6) d = 12 - d;
      r += w[d];
    }
  return r;
}

/**
 * Smallest total motion (in semitones) taking one ordered voicing to the next.
 * The prelude keeps five voices in every bar, so voices pair up one to one.
 */
export function voiceMotion(a, b) {
  const n = Math.min(a.length, b.length);
  const moves = [];
  for (let i = 0; i < n; i++) moves.push(b[i] - a[i]);
  return moves;
}
