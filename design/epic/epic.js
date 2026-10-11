// Light Score: one song, one living picture, three lenses that morph into each other.
// Every note is a point of light placed on the circle of fifths (so a key is a lit arc and a modulation is a rotation),
// at a radius set by its register (bass inside, treble outside). Consecutive notes are joined, so Bach's arpeggio
// draws a new figure every bar. The same lights become a tunnel (time recedes into depth) or a piano roll.
// Sliders: Group (bar → whole piece; drives the shape, the pyramid and the loop), Memory (how long light lingers),
// Key (transpose: the picture rotates, its shapes don't change).
import * as S from "../app/sound.js?v=20261011e";
import { BACH } from "../app/data.js?v=20261011e";
import { hc, FN_H } from "../app/ui.js?v=20261011e";
import { BWV846_NOTES } from "../../data/bwv846-notes.js?v=20261011e";

const NOTES = BWV846_NOTES.notes.map(([on, len, m]) => ({ on, len, m, pc: m % 12 })).sort((a, b) => a.on - b.on);
const NB = 35;
const NAMES = ["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const LIGHT = { T: [255, 192, 74], S: [33, 214, 165], D: [123, 108, 255] };
const CREAM = [255, 246, 228];
const BASE = [12, 10, 32];

// ---------- per-bar pitch-class weight, and groups at five grains
const BW = Array.from({ length: NB }, () => new Array(12).fill(0));
for (const n of NOTES) BW[Math.min(NB - 1, Math.floor(n.on / 16))][n.pc] += n.len;
const GRAINS = [
  { name: "Bar", blocks: [...Array(NB).keys()].map((i) => [i, i]) },
  { name: "2 bars", blocks: Array.from({ length: Math.ceil(NB / 2) }, (_, i) => [i * 2, Math.min(NB - 1, i * 2 + 1)]) },
  { name: "Phrase · 4 bars", blocks: Array.from({ length: Math.ceil(NB / 4) }, (_, i) => [i * 4, Math.min(NB - 1, i * 4 + 3)]) },
  { name: "Section", blocks: BACH.sections.map((s) => [s.from - 1, s.to - 1]) },
  { name: "Whole piece", blocks: [[0, NB - 1]] },
];
const fnAvg = ([a, b]) => { let s = 0; for (let i = a; i <= b; i++) s += FN_H[BACH.bars[i].fn]; return s / (b - a + 1); };
const profile = ([a, b]) => { const w = new Array(12).fill(0); for (let i = a; i <= b; i++) BW[i].forEach((x, pc) => (w[pc] += x)); const mx = Math.max(...w) || 1; return w.map((x) => x / mx); };
const short = (c) => c.split("/")[0].replace("dim7", "°7").replace("maj7", "△7").replace("#", "♯");
const blockLabel = (g, [a, b], k) => (g === 4 ? "Prelude in C" : g === 3 ? BACH.sections[k].title : short(BACH.bars[a].chord));

// ---------- state
let grain = 0, memV = 40, T = 0;
let mode = "clock", from = "clock", morphT = 1, morphStart = 0;
let shownProfile = profile([0, 0]);
const bg = [...BASE];
const origVoice = S.player.voice.bind(S.player);
S.player.voice = (m, w, d) => origVoice(m + T, w, d); // transpose what you hear, too

const cv = document.getElementById("cv"), ctx = cv.getContext("2d");
let W = 0, H = 0, DPR = 1, cx = 0, cy = 0, R = 0;
function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const sheet = document.querySelector(".sheet").offsetHeight, top = 150;
  cy = top + (H - sheet - top) / 2 + 6; R = Math.min(W * 0.4, (H - sheet - top) / 2 - 12); cx = W / 2;
  document.getElementById("hud").style.top = `calc(58px + env(safe-area-inset-top))`;
}
addEventListener("resize", resize);

// glow sprites (drawn once, stamped many times with additive blending)
const sprite = (rgb) => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.25, `rgba(${rgb},.55)`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return c; };
const SP = { T: sprite(LIGHT.T), S: sprite(LIGHT.S), D: sprite(LIGHT.D), C: sprite(CREAM) };

// ---------- geometry for the three lenses
const ang = (pc) => ((((pc * 7) % 12) + 12) % 12) / 12 * Math.PI * 2;     // circle of fifths, C at the top
const reg = (m) => 0.4 + 0.6 * Math.max(0, Math.min(1, (m - 36) / 45));   // bass inside, treble outside
const memBars = () => 0.25 + Math.pow(memV / 100, 1.6) * 8;
function place(lens, n, age) {
  const a = ang(n.pc + T);
  if (lens === "clock") { const r = R * reg(n.m); return [cx + r * Math.sin(a), cy - r * Math.cos(a), 1]; }
  if (lens === "tunnel") { const z = Math.max(0, age) / 16, s = 1 / (1 + z * 0.75), r = R * 1.08 * reg(n.m) * s; return [cx + r * Math.sin(a), cy - R * 0.32 * (1 - s) - r * Math.cos(a), s]; }
  const px = (W * 0.64) / (memBars() * 16 + 6), y0 = cy - R, h = 2 * R;
  return [W * 0.74 - age * px, y0 + (1 - (n.m - 36) / 45) * h, 1];
}
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function at(n, age) {
  const b = place(mode, n, age); if (morphT >= 1) return b;
  const a = place(from, n, age), t = ease(morphT);
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
const weight = (lens) => (morphT >= 1 ? (mode === lens ? 1 : 0) : (mode === lens ? ease(morphT) : 0) + (from === lens ? 1 - ease(morphT) : 0));

// a closed smooth shape through 12 radii on the circle of fifths (the "shape" of the current group)
function blob(prof, scale, ox, oy, rot = 0) {
  const pts = prof.map((w, pc) => { const a = ang(pc + T) + rot, r = R * scale * (0.16 + 0.64 * w); return [ox + r * Math.sin(a), oy - r * Math.cos(a)]; });
  const ordered = [...pts.keys()].sort((i, j) => ((i * 7) % 12) - ((j * 7) % 12)).map((i) => pts[i]);
  ctx.beginPath();
  for (let i = 0; i < 12; i++) { const p = ordered[i], q = ordered[(i + 1) % 12], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; if (i === 0) ctx.moveTo(mx, my); else ctx.quadraticCurveTo(p[0], p[1], mx, my); }
  const p = ordered[0], q = ordered[1]; ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
  ctx.closePath();
}
const centroid = (prof) => { let x = 0, y = 0, s = 0; prof.forEach((w, pc) => { const a = ang(pc + T); x += w * Math.sin(a); y -= w * Math.cos(a); s += w; }); return [x / s, y / s]; };
const BAR_C = BW.map((w) => { const mx = Math.max(...w) || 1; return w.map((x) => x / mx); });

function first(onMin) { let lo = 0, hi = NOTES.length; while (lo < hi) { const m = (lo + hi) >> 1; if (NOTES[m].on < onMin) lo = m + 1; else hi = m; } return lo; }
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// ---------- one frame
function frame(now) {
  requestAnimationFrame(frame);
  if (morphT < 1) morphT = Math.min(1, (now - morphStart) / 900);
  const pos = S.started() || S.pos() > 0 ? Math.max(S.pos(), 15.5) : 15.5, bar = Math.max(0, Math.min(NB - 1, Math.floor(pos / 16))), fn = BACH.bars[bar].fn;
  const blocks = GRAINS[grain].blocks, bk = blocks.findIndex(([a, b]) => bar >= a && bar <= b);
  const target = profile(blocks[bk]); shownProfile = shownProfile.map((v, i) => v + (target[i] - v) * 0.08);
  const deep = hexRgb(hc(fnAvg(blocks[bk])).deep);
  for (let i = 0; i < 3; i++) bg[i] += (BASE[i] * 0.62 + deep[i] * 0.38 - bg[i]) * 0.04;
  ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = rgba(bg.map(Math.round), 1); ctx.fillRect(0, 0, W, H);
  const wc = weight("clock"), wt = weight("tunnel"), wr = weight("roll"), mem = memBars() * 16, L = LIGHT[fn];

  // guides: the fifths ring with note names (Light), the depth rings (Tunnel), octave lines (Roll)
  ctx.lineWidth = 1;
  if (wc > 0.01) {
    ctx.strokeStyle = rgba(CREAM, 0.1 * wc); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.4, 0, Math.PI * 2); ctx.stroke();
    ctx.font = "600 12px Archivo"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let pc = 0; pc < 12; pc++) { const a = ang(pc), r = R + 18, lit = shownProfile[(pc - T + 12) % 12]; ctx.fillStyle = rgba(CREAM, (0.22 + 0.6 * lit) * wc); ctx.fillText(NAMES[pc], cx + r * Math.sin(a), cy - r * Math.cos(a)); }
  }
  if (wt > 0.01) for (let z = 0; z < 7; z++) { const s = 1 / (1 + ((z + ((pos / 16) % 1)) * 0.75)); ctx.strokeStyle = rgba(CREAM, 0.07 * wt * s); ctx.beginPath(); ctx.arc(cx, cy - R * 0.32 * (1 - s), R * 1.08 * s, 0, Math.PI * 2); ctx.stroke(); }
  if (wr > 0.01) { for (let m = 36; m <= 84; m += 12) { const y = cy - R + (1 - (m - 36) / 45) * 2 * R; ctx.strokeStyle = rgba(CREAM, 0.07 * wr); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.strokeStyle = rgba(CREAM, 0.5 * wr); ctx.beginPath(); ctx.moveTo(W * 0.74, cy - R - 10); ctx.lineTo(W * 0.74, cy + R + 10); ctx.stroke(); }

  ctx.globalCompositeOperation = "lighter";
  // the shape of the current group, and in the Tunnel the shapes of the groups behind it
  if (wc + wt > 0.01) {
    const fc = LIGHT[fn];
    blob(shownProfile, 1, cx, cy); ctx.fillStyle = rgba(fc, 0.13 * (wc + wt)); ctx.fill(); ctx.strokeStyle = rgba(fc, 0.55 * (wc + wt)); ctx.lineWidth = 1.5; ctx.stroke();
    if (wt > 0.01) for (let b = bar - 1; b >= 0 && b > bar - 9; b--) { const z = (pos - b * 16) / 16, s = 1 / (1 + z * 0.75); blob(BAR_C[b], s * 1.08, cx, cy - R * 0.32 * (1 - s)); ctx.strokeStyle = rgba(LIGHT[BACH.bars[b].fn], 0.5 * wt * s); ctx.lineWidth = 1.2; ctx.stroke(); }
  }
  // the key's path: where the music sits on the circle of fifths, bar by bar (the piece draws its own signature)
  if (wc > 0.01) {
    ctx.beginPath();
    for (let b = 0; b <= bar; b++) { const [x, y] = centroid(BAR_C[b]), k = b === bar ? (pos / 16) % 1 : 1; const px = cx + x * R * 1.4, py = cy + y * R * 1.4; if (!b) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
    ctx.strokeStyle = rgba(CREAM, 0.28 * wc); ctx.lineWidth = 1.2; ctx.stroke();
    const [x, y] = centroid(shownProfile); ctx.drawImage(SP.C, cx + x * R * 1.4 - 9, cy + y * R * 1.4 - 9, 18, 18);
  }
  // the notes: light, and threads between consecutive notes (the arpeggio's figure)
  const i0 = first(pos - mem - 40); let prev = null;
  for (let i = i0; i < NOTES.length; i++) {
    const n = NOTES[i], age = pos - n.on;
    if (age < (wr > 0.01 ? -mem * 0.45 : 0)) break;
    const sounding = age >= 0 && age < n.len, fade = age < 0 ? 0.35 * wr : sounding ? 1 : Math.max(0, 1 - (age - n.len) / mem);
    if (fade <= 0.01) { prev = null; continue; }
    const [x, y, s] = at(n, age), nfn = BACH.bars[Math.min(NB - 1, Math.floor(n.on / 16))].fn;
    if (prev && prev.n.on !== n.on) { ctx.strokeStyle = rgba(LIGHT[nfn], 0.42 * Math.min(fade, prev.fade)); ctx.lineWidth = 1.1 * s; ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(x, y); ctx.stroke(); }
    const sz = (sounding ? 34 : 18) * (0.5 + 0.5 * s) * (0.6 + 0.4 * fade);
    ctx.globalAlpha = fade * 0.75; ctx.drawImage(SP[nfn], x - sz, y - sz, sz * 2, sz * 2);
    if (sounding) { ctx.globalAlpha = 1; ctx.drawImage(SP.C, x - sz * 0.42, y - sz * 0.42, sz * 0.84, sz * 0.84); }
    ctx.globalAlpha = 1;
    prev = { n, x, y, fade };
  }
  hud(bar, bk);
}
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// ---------- HUD, pyramid and controls
const $ = (id) => document.getElementById(id);
const FNW = { T: ["Home.", "Settled: the music rests here."], S: ["Away.", "A step away from home."], D: ["Tension.", "It wants to move."] };
const QUAL = { "": "", m: "m", "7": "7", maj7: "maj7", m7: "m7", dim7: "°7", "7sus4": "7sus4" };
// accidentals drawn as SVG so they match the condensed display type
const ACC = { "♯": `<svg class="acc" viewBox="0 0 44 100"><path d="M13 4v92M29 2v92" stroke="currentColor" stroke-width="6"/><path d="M2 38 42 27v15L2 53zM2 66 42 55v15L2 81z" fill="currentColor"/></svg>`, "♭": `<svg class="acc" viewBox="0 0 44 100"><path d="M8 2v94" stroke="currentColor" stroke-width="7"/><path d="M8 96C30 84 40 72 40 60c0-12-14-16-32-4" fill="none" stroke="currentColor" stroke-width="7"/></svg>` };
const accs = (s) => s.replace(/[♯♭]/g, (c) => ACC[c]);
const tr0 = (name) => { if (!T) return name.replace("#", "♯").replace(/^([A-G])b$/, "$1♭"); return tr(name); };
const tr = (name) => { const i = NAMES.findIndex((x) => x === name.replace("#", "♯").replace(/^([A-G])b$/, "$1♭")); const map = { "C♯": 1, "D♯": 3, "F♯": 6, "G♯": 8, "A♯": 10 }; const pc = i >= 0 ? i : map[name.replace("#", "♯")]; return NAMES[(pc + T + 12) % 12]; };
let lastBar = -1, lastBk = -1, lastT = 0, lastPlaying = null;
function hud(bar, bk) {
  if (bar !== lastBar || T !== lastT) {
    const b = BACH.bars[bar], [main, bass] = b.chord.split("/"), m = /^([A-G][#b]?)(.*)$/.exec(main);
    $("chord").innerHTML = `${accs(tr0(m[1]))}${QUAL[m[2]] ? `<sup>${QUAL[m[2]]}</sup>` : ""}${bass ? `<small>over ${accs(tr0(bass))}</small>` : ""}`;
    $("fnline").innerHTML = `<b>${FNW[b.fn][0]}</b> ${FNW[b.fn][1]}`;
    $("barlab").textContent = `bar ${bar + 1} of 35`;
    document.querySelector('meta[name="theme-color"]').content = `rgb(${bg.map(Math.round).join(",")})`;
  }
  if (bar !== lastBar || bk !== lastBk) {
    document.querySelectorAll(".row").forEach((row) => { const g = +row.dataset.g; GRAINS[g].blocks.forEach(([a, b2], k) => { const el = row.children[k]; el.classList.toggle("now", g === grain && bar >= a && bar <= b2); el.classList.toggle("in", bar >= a && bar <= b2); el.classList.toggle("past", b2 < bar); }); });
  }
  if (S.playing() !== lastPlaying) { lastPlaying = S.playing(); $("pp").innerHTML = lastPlaying ? `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>` : `<svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="currentColor"/></svg>`; }
  lastBar = bar; lastBk = bk; lastT = T;
}
function buildPyramid() {
  $("pyr").innerHTML = [4, 3, 2, 1, 0].map((g) => `<div class="row${g === grain ? " sel" : ""}" data-g="${g}">${GRAINS[g].blocks.map((bl, k) => { const c = hc(fnAvg(bl)); return `<div class="blk" data-k="${k}" style="flex:${bl[1] - bl[0] + 1};--c:${c.field};--t:${c.ink}">${g === grain && (bl[1] - bl[0] + 1) * (W / 35) > 34 ? `<span>${blockLabel(g, bl, k)}</span>` : ""}</div>`; }).join("")}</div>`).join("");
  $("grainlab").innerHTML = `Grouped by <b>${GRAINS[grain].name.toLowerCase()}</b>`;
  $("gv").textContent = GRAINS[grain].name.split(" ·")[0];
  lastBar = -1;
}
$("pyr").addEventListener("click", (e) => {
  const row = e.target.closest(".row"); if (!row) return; const g = +row.dataset.g;
  if (g !== grain) { setGrain(g); return; }
  const blk = e.target.closest(".blk"); if (blk) { S.seekBar(GRAINS[g].blocks[+blk.dataset.k][0]); if (S.loop) S.setLoop({ from: GRAINS[g].blocks[+blk.dataset.k][0], to: GRAINS[g].blocks[+blk.dataset.k][1] }); }
});
function setGrain(g) { grain = g; $("grain").value = g; paint($("grain")); buildPyramid(); if (S.loop) loopHere(); }
const paint = (el) => el.style.setProperty("--p", ((el.value - el.min) / (el.max - el.min)) * 100 + "%");
$("grain").addEventListener("input", (e) => setGrain(+e.target.value));
$("mem").addEventListener("input", (e) => { memV = +e.target.value; paint(e.target); $("mv").textContent = memBars() < 1 ? `${Math.round(memBars() * 4)} beats` : `${memBars().toFixed(1)} bars`; });
$("tr").addEventListener("input", (e) => { T = +e.target.value; paint(e.target); $("kv").textContent = NAMES[(T + 12) % 12]; });
function setMode(m) { if (m === mode) return; from = mode; mode = m; morphT = 0; morphStart = performance.now(); const ks = ["clock", "tunnel", "roll"]; document.querySelectorAll("#seg button").forEach((b) => b.classList.toggle("on", b.dataset.m === m)); document.querySelector("#seg i").style.transform = `translateX(${ks.indexOf(m) * 100}%)`; }
document.querySelectorAll("#seg button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.m)));
// tap the picture to play; swipe it sideways to change lens
let sx = null; const tap = $("tap");
tap.addEventListener("pointerdown", (e) => (sx = e.clientX));
tap.addEventListener("pointerup", (e) => { if (sx == null) return; const dx = e.clientX - sx; sx = null; const ks = ["clock", "tunnel", "roll"], i = ks.indexOf(mode); if (Math.abs(dx) > 40) setMode(ks[Math.max(0, Math.min(2, i + (dx < 0 ? 1 : -1)))]); else S.toggle(); });
$("pp").addEventListener("click", () => S.toggle());
const curBlock = () => { const bar = S.bar(), bl = GRAINS[grain].blocks; return bl.findIndex(([a, b]) => bar >= a && bar <= b); };
$("prev").addEventListener("click", () => { const bl = GRAINS[grain].blocks, k = curBlock(); S.seekBar(bl[Math.max(0, k - (S.pos() - bl[k][0] * 16 < 4 ? 1 : 0))][0]); });
$("next").addEventListener("click", () => { const bl = GRAINS[grain].blocks, k = curBlock(); if (k < bl.length - 1) S.seekBar(bl[k + 1][0]); });
function loopHere() { const [a, b] = GRAINS[grain].blocks[curBlock()]; S.setLoop({ from: a, to: b }); }
$("loop").addEventListener("click", () => { if (S.loop) S.setLoop(null); else loopHere(); $("loop").classList.toggle("on", !!S.loop); });
$("tempo").addEventListener("click", () => { S.nextTempo(); $("tempo").textContent = S.tempo(); $("tempo").classList.toggle("on", S.tempo() !== 66); });

resize(); buildPyramid();
["grain", "mem", "tr"].forEach((id) => $(id).dispatchEvent(new Event("input")));
requestAnimationFrame(frame);
// ?mode=tunnel&bar=12 for screenshots and links
const q = new URLSearchParams(location.search);
if (q.get("bar")) S.seekBar(+q.get("bar") - 1);
if (q.get("mode")) { setMode(q.get("mode")); morphT = 1; }
if (q.get("grain")) setGrain(+q.get("grain"));
