// Builds the analysis model of a piece: one record per bar with every number the lenses need.
import { parseChord, pcOf, inKey, roughness, voiceMotion } from "./theory.js";

const FN_WEIGHT = { T: 0.12, S: 0.42, D: 0.72 };

export function buildModel(piece, noteData) {
  const { notes } = noteData;
  const barLen = 16;
  const nBars = piece.bars.length;

  // notes grouped by bar (by onset)
  const byBar = Array.from({ length: nBars }, () => []);
  for (const n of notes) {
    const b = Math.min(nBars - 1, Math.floor(n[0] / barLen));
    byBar[b].push(n);
  }

  const bars = piece.bars.map((a, i) => {
    const chord = parseChord(a.chord);
    const ns = byBar[i];
    // the voicing = the distinct pitches struck in the first half-bar, low to high
    const firstHalf = ns.filter((n) => n[0] % barLen < 8);
    const voicing = [...new Set(firstHalf.map((n) => n[2]))].sort((x, y) => x - y);
    const pcs = [...new Set(ns.map((n) => n[2] % 12))];
    const outside = pcs.filter((pc) => !inKey(pc, piece.home));
    const outsideLocal = pcs.filter((pc) => !inKey(pc, a.key));
    const spelled = {};
    for (const n of ns) spelled[n[2] % 12] = n[3].replace(/\d+$/, "");
    return {
      ...a, i, chord, voicing, pcs, spelled, notes: ns,
      outside, outsideLocal,
      rough: roughness(chord.pcs.concat(a.pedal ? [pcOf(a.pedal)] : [])),
      start: i * barLen,
    };
  });

  // tension: function + roughness + distance from home + applied/pedal colour.
  // An honest estimate, not a measurement; the method is shown in the UI.
  const maxRough = Math.max(...bars.map((b) => b.rough));
  for (const b of bars) {
    let t = FN_WEIGHT[b.fn] + 0.28 * (b.rough / maxRough);
    if (b.key !== piece.home) t += 0.08;
    if (b.applied) t += 0.06;
    t += 0.05 * b.outside.length;
    b.tension = Math.min(1, t);
  }

  // voice motion bar to bar
  let totalMoves = 0, stepOrHold = 0, moveCount = 0;
  for (let i = 1; i < bars.length; i++) {
    const a = bars[i - 1].voicing, c = bars[i].voicing;
    if (a.length !== 5 || c.length !== 5) { bars[i].motion = null; continue; }
    const moves = voiceMotion(a, c);
    bars[i].motion = moves;
    for (const m of moves) {
      moveCount++;
      totalMoves += Math.abs(m);
      if (Math.abs(m) <= 2) stepOrHold++;
    }
  }

  const sectionOf = (barNo) => piece.sections.find((s) => barNo >= s.from && barNo <= s.to);
  const fnCount = { T: 0, S: 0, D: 0 };
  for (const b of bars) fnCount[b.fn]++;
  const firstOutside = bars.find((b) => b.outside.length);
  const pedalRuns = runs(bars, (b) => b.pedal);
  const chordsUsed = new Set(bars.map((b) => b.chord.sym)).size;

  return {
    piece, bars, barLen, nBars,
    totalLen: Math.max(...notes.map((n) => n[0] + n[1])),
    notes,
    sectionOf,
    stats: {
      fnCount,
      chordsUsed,
      avgMove: moveCount ? totalMoves / (moveCount / 5) : 0,   // semitones per bar change, all voices
      stepShare: moveCount ? stepOrHold / moveCount : 0,
      firstOutside: firstOutside ? firstOutside.bar : null,
      firstOutsideName: firstOutside ? firstOutside.spelled[firstOutside.outside[0]] : null,
      outsideBars: bars.filter((b) => b.outside.length).map((b) => b.bar),
      pedalRuns,
    },
  };
}

function runs(bars, keyFn) {
  const out = [];
  let cur = null;
  for (const b of bars) {
    const k = keyFn(b);
    if (k && cur && cur.value === k) cur.to = b.bar;
    else if (k) { cur = { value: k, from: b.bar, to: b.bar }; out.push(cur); }
    else cur = null;
  }
  return out;
}
