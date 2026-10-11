// The harmony engine: rules only, no drawing. Works in every key.
//   jobOf     what a chord does in a key: home, away or tension
//   team      the four chords a minor third apart that do the same job (Barry Harris's three squares, Lendvai's axes;
//             the idea Metaharmony teaches with colour)
//   swap      replacements that keep the job, sorted by how smoothly they connect
//   approach  ways to lead into a chord: its own V7, ii–V, tritone sub, diminished approach, backdoor, plagal, minor iv
//   spice     the same chord with one or two added notes, ordered from sweet to spicy by counting clashes
//   next      what usually follows (rules of thumb for now; to be learned from real songs)
// Everything is computed from intervals, so nothing is hard-coded per key.

export const mod = (a, n = 12) => ((a % n) + n) % n;
const SHARP = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const FLAT = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const NICE = ["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
export const noteName = (pc, pref = "nice") => (pref === "sharp" ? SHARP : pref === "flat" ? FLAT : NICE)[mod(pc)];
export const parseNote = (s) => { const L = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[s[0]]; const acc = s.slice(1).replace("#", "♯").replace("b", "♭"); return mod(L + (acc === "♯" ? 1 : acc === "♭" ? -1 : 0)); };

// ---------- chord qualities (intervals above the root)
export const Q = {
  maj: { iv: [0, 4, 7], sym: "", word: "major" },
  min: { iv: [0, 3, 7], sym: "m", word: "minor" },
  "7": { iv: [0, 4, 7, 10], sym: "7", word: "dominant seventh" },
  maj7: { iv: [0, 4, 7, 11], sym: "maj7", word: "major seventh" },
  m7: { iv: [0, 3, 7, 10], sym: "m7", word: "minor seventh" },
  "6": { iv: [0, 4, 7, 9], sym: "6", word: "major sixth" },
  m6: { iv: [0, 3, 7, 9], sym: "m6", word: "minor sixth" },
  add9: { iv: [0, 4, 7, 14], sym: "add9", word: "major add nine" },
  madd9: { iv: [0, 3, 7, 14], sym: "m(add9)", word: "minor add nine" },
  add11: { iv: [0, 4, 7, 17], sym: "add11", word: "major add eleven" },
  madd11: { iv: [0, 3, 7, 17], sym: "m(add11)", word: "minor add eleven" },
  b6: { iv: [0, 4, 7, 8], sym: "(♭6)", word: "major flat six" },
  mb6: { iv: [0, 3, 7, 8], sym: "m(♭6)", word: "minor flat six" },
  mmaj7: { iv: [0, 3, 7, 11], sym: "m(maj7)", word: "minor-major seventh" },
  "9": { iv: [0, 4, 7, 10, 14], sym: "9", word: "dominant ninth" },
  "7b9": { iv: [0, 4, 7, 10, 13], sym: "7♭9", word: "dominant flat nine" },
  "13": { iv: [0, 4, 7, 10, 21], sym: "13", word: "dominant thirteenth" },
  "7sus4": { iv: [0, 5, 7, 10], sym: "7sus4", word: "suspended seventh" },
  sus4: { iv: [0, 5, 7], sym: "sus4", word: "suspended" },
  dim7: { iv: [0, 3, 6, 9], sym: "°7", word: "diminished seventh" },
  m7b5: { iv: [0, 3, 6, 10], sym: "m7♭5", word: "half-diminished" },
  aug: { iv: [0, 4, 8], sym: "+", word: "augmented" },
};
export const chord = (root, q = "maj") => ({ root: mod(root), q });
export const pcs = (c) => [...new Set(Q[c.q].iv.map((i) => mod(c.root + i)))];
export const nameOf = (c, pref) => noteName(c.root, pref) + Q[c.q].sym;
export function parseChord(s) {
  const m = /^([A-G][#b♯♭]?)(.*)$/.exec(s.trim()); if (!m) throw new Error("bad chord " + s);
  const root = parseNote(m[1]), rest = m[2].split("/")[0];
  const map = { "": "maj", m: "min", "7": "7", maj7: "maj7", "△7": "maj7", m7: "m7", "6": "6", m6: "m6", dim7: "dim7", "°7": "dim7", m7b5: "m7b5", "ø": "m7b5", "7sus4": "7sus4", sus4: "sus4", sus: "sus4", "9": "9", "7b9": "7b9", "13": "13", add9: "add9", aug: "aug", "+": "aug", dim: "dim7" };
  return chord(root, map[rest] ?? "maj");
}
const family = (q) => (["7", "9", "7b9", "13", "7sus4"].includes(q) ? "dom" : ["min", "m7", "m6", "madd9", "madd11", "mb6", "mmaj7"].includes(q) ? "min" : q === "dim7" ? "dim" : q === "m7b5" ? "hd" : q === "aug" ? "aug" : "maj");

// ---------- jobs and teams (relative to the key's home note)
export const JOBS = { T: "home", S: "away", D: "tension" };
const TEAM_OFFSET = { T: 0, D: 7, S: 5 };
export const teamRoots = (key, job) => [0, 3, 6, 9].map((k) => mod(key + TEAM_OFFSET[job] + k));
export function jobOf(c, key) {
  const f = family(c.q);
  if (f === "dim" || f === "aug") return "D";
  const r = f === "hd" ? mod(c.root + 3) : c.root; // a half-diminished chord is a minor sixth chord with the sixth in the bass
  return Object.keys(TEAM_OFFSET).find((j) => teamRoots(key, j).includes(r));
}
export const isDiatonic = (c, key) => pcs(c).every((p) => [0, 2, 4, 5, 7, 9, 11].includes(mod(p - key)));

// ---------- voice leading: the smallest total movement between two chords (in half steps)
export function vlDistance(a, b) {
  const A = pcs(a), B = pcs(b); let best = 1e9;
  const perm = (arr) => (arr.length <= 1 ? [arr] : arr.flatMap((x, i) => perm([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p])));
  const [S, L] = A.length <= B.length ? [A, B] : [B, A];
  for (const p of perm(L)) { let d = 0; for (let i = 0; i < L.length; i++) { const x = S[i % S.length], y = p[i]; d += Math.min(mod(x - y), mod(y - x)); } best = Math.min(best, d); }
  return best;
}
export const commonTones = (a, b) => pcs(a).filter((p) => pcs(b).includes(p)).length;

// ---------- swap: same job, different colour
export function swap(c, key) {
  const job = jobOf(c, key), f = family(c.q), out = [];
  for (const r of teamRoots(key, job)) {
    if (r !== c.root) out.push({ c: chord(r, c.q), why: "same team: a minor third away, same job" });
  }
  // same job, other shape: the relative minor/major that shares two notes
  if (f === "maj") out.push({ c: chord(c.root + 9, "min"), why: "its minor twin: shares two notes" });
  if (f === "min") out.push({ c: chord(c.root + 3, "maj"), why: "its major twin: shares two notes" });
  if (f === "dom") { out.push({ c: chord(c.root + 4, "dim7"), why: "the square inside it: the same pull without the root" }); out.push({ c: chord(c.root + 1, "7"), why: "tritone swap: a half step above home, same pull" }); }
  const seen = new Set(), uniq = out.filter((o) => { const k = nameOf(o.c); if (seen.has(k) || k === nameOf(c)) return false; seen.add(k); return true; });
  return uniq.map((o) => ({ ...o, job: jobOf(o.c, key), move: vlDistance(c, o.c), keep: commonTones(c, o.c), inKey: isDiatonic(o.c, key) })).sort((a, b) => a.move - b.move);
}

// ---------- approach: ways to lead into a target chord
export function approach(t, key) {
  const minor = family(t.q) === "min", r = t.root, kit = [
    { seq: [chord(r + 7, "7")], name: "Its own five", why: "the strongest pull: tension that falls a fifth into it" },
    { seq: [chord(r + 2, minor ? "m7b5" : "m7"), chord(r + 7, "7")], name: "Two–five", why: "away, then tension, then arrive: the most common way in" },
    { seq: [chord(r + 1, "7")], name: "Tritone swap", why: "slides down a half step into it: smoother, jazzier" },
    { seq: [chord(r - 1, "dim7")], name: "The square", why: "a diminished chord a half step below: every note leans in" },
    { seq: [chord(r + 10, "7")], name: "Backdoor", why: "arrives from a whole step below: soft, soulful" },
    { seq: [chord(r + 5, "maj")], name: "Plagal (Amen)", why: "from its four chord: a gentle, hymn-like landing" },
    { seq: [chord(r + 5, "min")], name: "Minor four", why: "the four chord turned minor: bittersweet" },
    { seq: [chord(r + 7, "7sus4"), chord(r + 7, "7")], name: "Sus, then five", why: "hangs in the air, then falls in" },
  ];
  return kit.map((k) => ({ ...k, inKey: k.seq.every((c) => isDiatonic(c, key)), move: vlDistance(k.seq[k.seq.length - 1], t) }));
}

// ---------- spice: added notes, ordered by how much they clash
// each added note is scored against the three core notes: a half step above one = harsh, a half step below = a rub,
// a whole step = soft, a tritone = edgy; a hidden augmented triad adds an unstable shimmer
export function clashScore(c) {
  const iv = Q[c.q].iv, core = iv.slice(0, 3).map((i) => mod(c.root + i)), added = [...new Set(iv.slice(3).map((i) => mod(c.root + i)))].filter((p) => !core.includes(p));
  let s = 0;
  for (const a of added) for (const t of core) { const d = mod(a - t); s += d === 1 ? 2.2 : d === 11 ? 1.5 : d === 2 || d === 10 ? 0.6 : d === 6 ? 1 : 0; }
  if (!added.length) for (let i = 0; i < core.length; i++) for (let j = i + 1; j < core.length; j++) { const d = Math.min(mod(core[i] - core[j]), mod(core[j] - core[i])); s += d === 6 ? 1 : d === 1 ? 2 : 0; }
  const P = pcs(c); if (P.some((p) => P.includes(mod(p + 4)) && P.includes(mod(p + 8)))) s += 1;
  return +s.toFixed(2);
}
export function spice(c) {
  const f = family(c.q);
  const ladder = f === "maj" ? ["maj", "add9", "6", "maj7", "add11", "b6"] : f === "min" ? ["min", "madd11", "madd9", "m7", "m6", "mb6", "mmaj7"] : f === "dom" ? ["7", "9", "13", "7sus4", "7b9"] : f === "hd" ? ["m7b5"] : f === "dim" ? ["dim7"] : ["aug"];
  return ladder.map((q) => { const x = chord(c.root, q); return { c: x, clash: clashScore(x), added: Q[q].iv.filter((i) => !Q[f === "min" ? "min" : f === "dom" ? "7" : "maj"].iv.includes(i)).map((i) => noteName(c.root + i)) }; }).sort((a, b) => a.clash - b.clash);
}
export const clashWords = (n) => (n === 0 ? "no clashes" : n < 1 ? "soft" : n < 2.5 ? "one gentle rub" : n < 4 ? "one sharp clash" : "spicy");

// ---------- next: rules of thumb (to be replaced by statistics from the archive)
export function next(c, key) {
  const job = jobOf(c, key), out = [];
  const home = chord(key, "maj"), four = chord(key + 5, "maj"), five7 = chord(key + 7, "7"), six = chord(key + 9, "min"), two = chord(key + 2, "min");
  if (job === "D") out.push({ c: home, w: 0.55, why: "resolves home" }, { c: six, w: 0.2, why: "the fake ending: lands on the soft home" }, { c: four, w: 0.1, why: "steps back away" });
  if (job === "S") out.push({ c: five7, w: 0.45, why: "on to tension" }, { c: home, w: 0.25, why: "straight home (Amen)" }, { c: two, w: 0.1, why: "stays away" });
  if (job === "T") out.push({ c: four, w: 0.3, why: "steps away" }, { c: five7, w: 0.25, why: "straight to tension" }, { c: six, w: 0.2, why: "the soft home" }, { c: two, w: 0.15, why: "away, minor" });
  return out.filter((o) => nameOf(o.c) !== nameOf(c));
}

// ---------- voicing for playback: close position near middle C, moving as little as possible from the last chord
export function voicing(c, prev = null) {
  const base = Q[c.q].iv.map((i) => 48 + mod(c.root - 0) + i).map((m) => (m >= 60 + 12 ? m - 12 : m));
  const bass = 36 + mod(c.root);
  let up = Q[c.q].iv.slice(1).map((i) => 60 + mod(c.root + i - 0)).sort((a, b) => a - b);
  if (prev) { const pu = prev.slice(1), center = pu.reduce((s, m) => s + m, 0) / (pu.length || 1); up = up.map((m) => { let best = m; for (const o of [-12, 0, 12]) if (Math.abs(m + o - center) < Math.abs(best - center)) best = m + o; return best; }).sort((a, b) => a - b); }
  void base; return [bass, ...up];
}
