// Verifies every hand-written chord label against the notes that actually sound.
// Run: node tools/check.js   (exit code 1 on any problem)
import { BWV846 } from "../data/bwv846-analysis.js";
import { BWV846_NOTES } from "../data/bwv846-notes.js";
import { parseChord, pcOf, PC_NAMES } from "../js/theory.js";

const pieces = [[BWV846, BWV846_NOTES]];
let problems = 0;

for (const [piece, data] of pieces) {
  if (piece.bars.length !== data.bars.length) {
    console.log(`${piece.id}: ${piece.bars.length} labelled bars but ${data.bars.length} in the score`);
    problems++;
  }
  piece.bars.forEach((a, i) => {
    const ns = data.notes.filter((n) => Math.floor(n[0] / 16) === i);
    const sounding = new Set(ns.map((n) => n[2] % 12));
    const chord = parseChord(a.chord);
    const extra = new Set((a.extra || []).map(pcOf));
    const pedal = a.pedal ? pcOf(a.pedal) : null;
    const say = (msg) => { console.log(`${piece.id} bar ${a.bar} (${a.chord}): ${msg}`); problems++; };

    for (const pc of chord.pcs) if (!sounding.has(pc)) say(`chord tone ${PC_NAMES[pc]} never sounds`);
    for (const pc of sounding)
      if (!chord.pcs.includes(pc) && !extra.has(pc) && pc !== pedal) say(`${PC_NAMES[pc]} sounds but isn't in the chord, extra or pedal`);
    for (const pc of extra) if (!sounding.has(pc)) say(`extra ${PC_NAMES[pc]} listed but never sounds`);

    const lowest = ns.reduce((lo, n) => (n[2] < lo[2] ? n : lo), ns[0]);
    const expectBass = pedal ?? chord.bass;
    if (lowest[2] % 12 !== expectBass) say(`lowest note is ${lowest[3]}, expected ${PC_NAMES[expectBass]}`);
    if (!["T", "S", "D"].includes(a.fn)) say(`bad function ${a.fn}`);
  });
  for (const s of piece.sections) if (s.from > s.to) { console.log(`${piece.id}: section ${s.title} is backwards`); problems++; }
  const covered = new Set(piece.sections.flatMap((s) => Array.from({ length: s.to - s.from + 1 }, (_, k) => s.from + k)));
  if (covered.size !== piece.bars.length) { console.log(`${piece.id}: sections cover ${covered.size} of ${piece.bars.length} bars`); problems++; }
}

console.log(problems ? `${problems} problem(s)` : "All chord labels match the notes.");
process.exit(problems ? 1 : 0);
