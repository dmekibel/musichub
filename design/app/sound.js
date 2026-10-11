// One shared player for the beta: Bach's Prelude in C, plus chords and rhythms on demand.
// Reuses the working synth and scheduler from the v0 prototype (../../js/audio.js).
import { Player } from "../../js/audio.js?v=20261011e";
import { BWV846_NOTES } from "../../data/bwv846-notes.js?v=20261011e";

const END = Math.max(...BWV846_NOTES.notes.map((n) => n[0] + n[1]));
export const NBARS = 35;
export const player = new Player(BWV846_NOTES.notes, { tempo: 66, endAt: END, onEnd: () => emit() });

const subs = new Set(), tickers = new Set();
export const onChange = (f) => (subs.add(f), () => subs.delete(f));
export const onTick = (f) => (tickers.add(f), () => tickers.delete(f));
function emit() { subs.forEach((f) => f()); }

export const started = () => !!player.ctx;
export const playing = () => player.playing;
export const pos = () => player.pos();
export const bar = () => Math.max(0, Math.min(NBARS - 1, Math.floor(player.pos() / 16)));
export const progress = () => Math.min(1, player.pos() / END);

// iPhone mutes Web Audio when the silent switch is on. Playing a silent <audio> element on the first
// tap moves the page into the "playback" audio session, so the synth is heard anyway.
let unlocked = false;
function unlockIOS() {
  if (unlocked) return; unlocked = true;
  const rate = 8000, n = 800, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const w = (o, str) => [...str].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 2, true);
  const a = new Audio(URL.createObjectURL(new Blob([buf], { type: "audio/wav" })));
  a.loop = true; a.setAttribute("playsinline", ""); a.play().catch(() => {});
}
export async function toggle() { unlockIOS(); if (player.playing) player.pause(); else await player.play(); emit(); }
export async function play() { unlockIOS(); if (!player.playing) await player.play(); emit(); }
export function seekBar(i) { player.seek(Math.max(0, Math.min(NBARS - 1, i)) * 16); emit(); }
// study tools: tempo and a bar loop
export const TEMPOS = [66, 52, 40, 80];
export const tempo = () => player.tempo;
export function nextTempo() { const i = TEMPOS.indexOf(player.tempo); player.setTempo(TEMPOS[(i + 1) % TEMPOS.length]); emit(); }
export let loop = null; // { from, to } bar indexes, inclusive
export function setLoop(l) { loop = l; emit(); }
export function seekFrac(f) { player.seek(Math.max(0, Math.min(1, f)) * END); emit(); }

async function ready() { unlockIOS(); player.ensureCtx(); if (player.ctx.state === "suspended") await player.ctx.resume(); return player.ctx.currentTime + 0.03; }
/** Play a chord (MIDI numbers), lightly rolled from the bottom up. */
export async function chord(midis, dur = 1.8) { const t = await ready(); midis.forEach((m, k) => player.voice(m, t + k * 0.035, dur)); }
/** Play a rhythm necklace: onsets out of n steps, looped. */
export async function rhythm(on, n, { loops = 2, step = 0.13, midi = 81 } = {}) {
  const t = await ready();
  for (let l = 0; l < loops; l++) for (let k = 0; k < n; k++) {
    const when = t + (l * n + k) * step;
    if (on.includes(k)) player.voice(midi, when, 0.06);
    else if (k % 4 === 0) player.voice(midi - 24, when, 0.04);
  }
}

let last = -1, lastPlaying = false;
(function frame() {
  requestAnimationFrame(frame);
  if (loop && player.playing && (player.pos() >= (loop.to + 1) * 16 || player.pos() < loop.from * 16 - 0.5)) player.seek(loop.from * 16);
  const b = bar(), p = player.playing;
  if (b !== last || p !== lastPlaying) { last = b; lastPlaying = p; emit(); }
  if (p) tickers.forEach((f) => f());
})();
