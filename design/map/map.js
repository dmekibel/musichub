// The Harmony Map: the home screen. Every chord has a fixed place; the same chords rearrange into three views.
//   Keys      the circle of fifths: majors outside, their relative minors inside, each dominant seventh beside its root.
//   Families  Barry Harris's (and Lendvai's) three diminished squares as hubs. Lower any one note of a square and you
//             get a dominant seventh, so each hub has four children; each child resolves to a major and a minor.
//   Clock     the 12 notes in order, where the squares are real squares.
// Detail adds layers (keys → minor → tension → squares → links). A piece lights its route across the map as it plays.
// Color means harmony relative to home (here C): home saffron, the away side green, the tension side indigo; far keys dim.
import * as S from "../app/sound.js?v=20261011e";
import { BACH } from "../app/data.js?v=20261011e";
import { hc } from "../app/ui.js?v=20261011e";

const MAJ = ["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const MIN = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"];
const SQ = [["C", "E♭", "F♯", "A"], ["C♯", "E", "G", "B♭"], ["D", "F", "A♭", "B"]];
const fi = (r) => (((r * 7) % 12) + 12) % 12;            // position on the circle of fifths
const sgn = (r) => { const f = fi(r); return f > 6 ? f - 12 : f; }; // signed fifths from home (C): F = -1, G = +1
const deg = (d) => (d * Math.PI) / 180;

// ---------- the nodes
const N = [];
for (let r = 0; r < 12; r++) N.push({ id: "M" + r, t: "M", r, label: MAJ[r], lvl: 1 });
for (let r = 0; r < 12; r++) N.push({ id: "m" + r, t: "m", r, label: MIN[r] + "m", lvl: 2 });
for (let r = 0; r < 12; r++) N.push({ id: "D" + r, t: "D", r, label: MAJ[r] + "7", lvl: 3 });
for (let f = 0; f < 3; f++) N.push({ id: "Q" + f, t: "Q", r: f, label: SQ[f][0] + "°", lvl: 4 });
const BY = Object.fromEntries(N.map((n) => [n.id, n]));
const fam = (r) => (r + 1) % 3; // a dominant seventh on r is a square (r+1 family) with one note lowered

// ---------- three layouts (unit coordinates, y down)
const polar = (a, r) => [r * Math.sin(deg(a)), -r * Math.cos(deg(a))];
const LAYOUT = { keys: {}, families: {}, clock: {} };
for (const n of N) {
  const { t, r } = n;
  if (t === "M") LAYOUT.keys[n.id] = polar(fi(r) * 30, 0.8);
  if (t === "m") LAYOUT.keys[n.id] = polar(fi(r + 3) * 30, 0.57);
  if (t === "D") LAYOUT.keys[n.id] = polar(fi(r) * 30 + 15, 1.0);
  if (t === "Q") LAYOUT.keys[n.id] = polar(r * 120, 0.24);
  if (t === "M") LAYOUT.clock[n.id] = polar(r * 30, 0.8);
  if (t === "m") LAYOUT.clock[n.id] = polar(r * 30, 0.6);
  if (t === "D") LAYOUT.clock[n.id] = polar(r * 30 + 15, 1.0);
  if (t === "Q") LAYOUT.clock[n.id] = polar(r * 30 + 15, 0.26);
}
for (let f = 0; f < 3; f++) {
  const hub = f * 120; LAYOUT.families["Q" + f] = polar(hub, 0.27);
  const kids = [0, 1, 2, 3].map((j) => (f + 2 + 3 * j) % 12).sort((a, b) => fi(a) - fi(b));
  kids.forEach((r, j) => {
    const a = hub - 45 + j * 30; LAYOUT.families["D" + r] = polar(a, 0.6);
    LAYOUT.families["M" + ((r + 5) % 12)] = polar(a - 7.5, 0.94);
    LAYOUT.families["m" + ((r + 5) % 12)] = polar(a + 7.5, 0.94);
  });
}

// ---------- links
const E = [];
for (let r = 0; r < 12; r++) {
  E.push({ a: "D" + r, b: "M" + ((r + 5) % 12), k: "res" }, { a: "D" + r, b: "m" + ((r + 5) % 12), k: "res" });
  E.push({ a: "Q" + fam(r), b: "D" + r, k: "one" });
  E.push({ a: "M" + r, b: "m" + ((r + 9) % 12), k: "rel" });
  E.push({ a: "M" + r, b: "M" + ((r + 7) % 12), k: "fifth" });
}

// ---------- color: harmony relative to home
function colorOf(n) {
  const s = n.t === "m" ? sgn(n.r + 3) : n.t === "D" ? sgn(n.r + 5) : n.t === "Q" ? 1 : sgn(n.r);
  const h = n.t === "D" || n.t === "Q" ? 1 : s === 0 ? 0 : s < 0 ? 0.4 : s === 1 ? 1 : 0.84;
  const far = n.t === "Q" ? 0 : Math.max(0, Math.abs(s) - 1);
  return { fill: hc(h).field, ink: hc(h).ink, dim: Math.max(0.28, 1 - far * 0.17) };
}
N.forEach((n) => (n.c = colorOf(n)));

// ---------- the piece's route
const ROOT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const nodeOf = (sym) => {
  const main = sym.split("/")[0], r = (ROOT[main[0]] + (main[1] === "#" ? 1 : main[1] === "b" ? -1 : 0) + 12) % 12, q = main.slice(/[#b]/.test(main[1]) ? 2 : 1);
  if (q.startsWith("dim")) return "Q" + (r % 3);
  if (q === "m" || q === "m7") return "m" + r;
  if (q === "7" || q.startsWith("7sus")) return "D" + r;
  return "M" + r;
};
const ROUTE = BACH.bars.map((b) => nodeOf(b.chord));

// ---------- state, canvas
let view = "keys", from = "keys", morph = 1, morphStart = 0, level = 3, sel = null;
const cv = document.getElementById("cv"), ctx = cv.getContext("2d");
let W, H, cx, cy, R;
function resize() {
  const d = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
  const top = document.querySelector(".top").offsetHeight + 24, bot = document.querySelector(".sheet").offsetHeight - 10;
  R = Math.min(W / 2 - 34, (H - top - bot) / 2 - 22); cx = W / 2; cy = top + (H - top - bot) / 2;
}
addEventListener("resize", resize);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function xy(id) {
  const b = LAYOUT[view][id]; let p = b;
  if (morph < 1) { const a = LAYOUT[from][id], t = ease(morph); p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  return [cx + p[0] * R, cy + p[1] * R];
}
const sprite = (rgb) => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, `rgba(${rgb},.9)`); gr.addColorStop(0.3, `rgba(${rgb},.35)`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return c; };
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",");
const GLOW = {}; N.forEach((n) => (GLOW[n.c.fill] ||= sprite(hexRgb(n.c.fill)))); const CREAM = sprite("255,246,228");
const DUST = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.3, s: Math.random() * 0.00004 + 0.00001, a: Math.random() * 0.35 + 0.05 }));
const size = (n) => (n.t === "M" ? 19 : n.t === "m" ? 16 : n.t === "D" ? 14 : 17);
const visible = (n) => n.lvl <= level || ROUTE_LIT.has(n.id);
let ROUTE_LIT = new Set();

function frame(now) {
  requestAnimationFrame(frame);
  if (morph < 1) morph = Math.min(1, (now - morphStart) / 1000);
  ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = "#0c0a20"; ctx.fillRect(0, 0, W, H);
  for (const d of DUST) { d.y -= d.s * 16; if (d.y < 0) d.y = 1; ctx.fillStyle = `rgba(246,240,228,${d.a})`; ctx.beginPath(); ctx.arc(d.x * W, d.y * H, d.r, 0, 7); ctx.fill(); }

  const playing = S.started(), bar = S.bar(), cur = playing ? ROUTE[bar] : null;
  ROUTE_LIT = new Set(playing ? ROUTE.slice(0, bar + 1) : []);
  const focus = sel ? new Set([sel, ...E.filter((e) => e.a === sel || e.b === sel).flatMap((e) => [e.a, e.b])]) : null;

  // guide rings, and in Clock view the three squares drawn as squares through their notes
  ctx.lineWidth = 1; ctx.strokeStyle = "rgba(246,240,228,.07)";
  for (const r of [0.8, 1.0]) { ctx.beginPath(); ctx.arc(cx, cy, r * R, 0, 7); ctx.stroke(); }
  const wClock = view === "clock" ? ease(morph) : from === "clock" ? 1 - ease(morph) : 0;
  if (wClock > 0.01 && level >= 4) for (let f = 0; f < 3; f++) { ctx.beginPath(); [0, 3, 6, 9].forEach((k, i) => { const [x, y] = xy("M" + ((f + k) % 12)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); ctx.strokeStyle = `rgba(160,150,255,${0.28 * wClock})`; ctx.lineWidth = 1.4; ctx.stroke(); }

  // links: all of them at the top detail level, or just the selected chord's
  for (const e of E) {
    const A = BY[e.a], B = BY[e.b]; if (!visible(A) || !visible(B)) continue;
    const on = focus ? focus.has(e.a) && focus.has(e.b) && (e.a === sel || e.b === sel) : level >= 5;
    if (!on) continue;
    const [x1, y1] = xy(e.a), [x2, y2] = xy(e.b);
    ctx.strokeStyle = e.k === "res" ? "rgba(140,128,255,.55)" : e.k === "one" ? "rgba(200,190,255,.4)" : e.k === "rel" ? "rgba(246,240,228,.22)" : "rgba(246,240,228,.12)";
    ctx.lineWidth = focus ? 1.8 : 1; ctx.setLineDash(e.k === "one" ? [2, 4] : []);
    ctx.beginPath(); ctx.moveTo(x1, y1); const mx = (x1 + x2) / 2 + (cy - (y1 + y2) / 2) * 0.12, my = (y1 + y2) / 2 - (cx - (x1 + x2) / 2) * 0.12; ctx.quadraticCurveTo(mx, my, x2, y2); ctx.stroke();
  }
  ctx.setLineDash([]);

  // the piece's route: a glowing thread through every chord so far
  if (playing) {
    ctx.globalCompositeOperation = "lighter";
    const pts = ROUTE.slice(0, bar + 1).map(xy), frac = (S.pos() / 16) % 1;
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i - 1], [x2, y2] = pts[i]; if (x1 === x2 && y1 === y2) continue;
      const age = bar - i, a = Math.max(0.1, 1 - age / 14), mx = (x1 + x2) / 2 + (cy - (y1 + y2) / 2) * 0.35, my = (y1 + y2) / 2 - (cx - (x1 + x2) / 2) * 0.35;
      ctx.strokeStyle = `rgba(255,246,228,${0.55 * a})`; ctx.lineWidth = 1 + 1.6 * a; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, x2, y2); ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  // the nodes
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  for (const n of N) {
    if (!visible(n)) continue;
    const [x, y] = xy(n.id), s = size(n), isCur = n.id === cur, lit = ROUTE_LIT.has(n.id);
    let a = n.c.dim; if (focus && !focus.has(n.id)) a *= 0.22; if (playing && !lit) a *= 0.45;
    if (isCur || n.id === sel) { ctx.globalCompositeOperation = "lighter"; const g = s * (isCur ? 4.2 + Math.sin(now / 160) * 0.4 : 3.2); ctx.drawImage(GLOW[n.c.fill], x - g, y - g, g * 2, g * 2); ctx.globalCompositeOperation = "source-over"; }
    ctx.globalAlpha = a; ctx.fillStyle = n.c.fill;
    ctx.beginPath();
    if (n.t === "Q") { ctx.moveTo(x, y - s * 1.15); ctx.lineTo(x + s * 1.15, y); ctx.lineTo(x, y + s * 1.15); ctx.lineTo(x - s * 1.15, y); ctx.closePath(); }
    else ctx.arc(x, y, s, 0, 7);
    ctx.fill();
    ctx.lineWidth = isCur ? 2.5 : 1.2; ctx.strokeStyle = isCur || lit ? "rgba(255,246,228,.95)" : "rgba(255,246,228,.35)"; ctx.stroke();
    ctx.fillStyle = n.c.ink; ctx.font = `700 ${n.t === "M" ? 13 : 11}px Archivo`; ctx.fillText(n.label, x, y + 0.5);
    ctx.globalAlpha = 1;
  }
}

// ---------- interaction
const $ = (id) => document.getElementById(id);
const LEVELS = ["", "12 keys", "+ their minor twins", "+ the tension chords", "+ the three squares", "+ every link"];
const paint = (el) => el.style.setProperty("--p", ((el.value - el.min) / (el.max - el.min)) * 100 + "%");
$("level").addEventListener("input", (e) => { level = +e.target.value; paint(e.target); $("lvl").textContent = LEVELS[level]; [...$("ticks").children].forEach((t, i) => t.classList.toggle("on", i < level)); });
const SUB = { keys: "The circle of fifths: neighbors share all but one note. Majors outside, their minor twins inside.", families: "Barry Harris's three squares. Lower one note of a square and you get a tension chord; each one resolves outward.", clock: "The 12 notes in order. Here the squares look like squares." };
function setView(v) { if (v === view) return; from = view; view = v; morph = 0; morphStart = performance.now(); const ks = ["keys", "families", "clock"]; document.querySelectorAll("#seg button").forEach((b) => b.classList.toggle("on", b.dataset.v === v)); document.querySelector("#seg i").style.transform = `translateX(${ks.indexOf(v) * 100}%)`; $("sub").textContent = SUB[v]; }
document.querySelectorAll("#seg button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.v)));

const KIND = { M: "Major chord", m: "Minor chord", D: "Dominant seventh · tension", Q: "Diminished seventh · a square" };
const IV = { M: [0, 4, 7], m: [0, 3, 7], D: [0, 4, 7, 10], Q: [0, 3, 6, 9] };
const voicing = (n) => IV[n.t].map((x) => 48 + ((n.r + x) % 12) + (x >= 12 - n.r ? 0 : 12) - 12 + 12);
function line(n) {
  if (n.t === "D") return `Resolves to <b>${MAJ[(n.r + 5) % 12]}</b> or <b>${MIN[(n.r + 5) % 12]}m</b>. Raise its root a half step and it becomes the <b>${SQ[fam(n.r)][0]}° square</b>.`;
  if (n.t === "Q") { const kids = [0, 1, 2, 3].map((j) => MAJ[(n.r + 2 + 3 * j) % 12] + "7"); return `Notes ${SQ[n.r].join(" ")}. Lower any one of them and you get <b>${kids.join(", ")}</b>: four tension chords that can stand in for each other.`; }
  if (n.t === "M") return `Its minor twin is <b>${MIN[(n.r + 9) % 12]}m</b> (same notes but one). Its neighbors on the circle: <b>${MAJ[(n.r + 5) % 12]}</b> and <b>${MAJ[(n.r + 7) % 12]}</b>. Arrives from <b>${MAJ[(n.r + 7) % 12]}7</b>.`;
  return `The darker twin of <b>${MAJ[(n.r + 3) % 12]}</b>. Arrives from <b>${MAJ[(n.r + 7) % 12]}7</b>.`;
}
const count = (id) => ROUTE.filter((x) => x === id).length;
const PAGE = { M: "maj", m: "min", D: "dom7", Q: "dim7" };
function showCard(n) {
  const c = $("card"); if (!n) { c.classList.remove("show"); return; }
  const k = count(n.id);
  c.innerHTML = `<div class="kind">${KIND[n.t]}${k ? ` · ${k} ${k === 1 ? "bar" : "bars"} in the Prelude` : ""}</div><h2>${n.t === "Q" ? SQ[n.r].join(" ") : n.label}</h2><p>${line(n)}</p>
    <div class="acts"><button class="pillbtn" id="hear"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>Hear it</button><a class="pillbtn ghost" href="../app/index.html#idea?k=${PAGE[n.t]}">${n.t === "Q" ? "Diminished seventh" : KIND[n.t].split(" ·")[0]} page ›</a></div>`;
  c.classList.add("show");
  $("hear").addEventListener("click", () => S.chord(voicing(n)));
}
cv.addEventListener("click", (e) => {
  let best = null, bd = 1e9;
  for (const n of N) { if (!visible(n)) continue; const [x, y] = xy(n.id), d = Math.hypot(e.clientX - x, e.clientY - y); if (d < size(n) + 10 && d < bd) { bd = d; best = n; } }
  sel = best && best.id !== sel ? best.id : null; showCard(sel && BY[sel]);
  if (best) S.chord(voicing(best));
});
const PLAY = `<svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="currentColor"/></svg>`, PAUSE = `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>`;
$("pp").addEventListener("click", () => S.toggle());
S.onChange(() => { $("pp").innerHTML = S.playing() ? PAUSE : PLAY; if (S.started()) { const b = BACH.bars[S.bar()]; $("songsub").textContent = `bar ${b.bar} · ${BY[ROUTE[S.bar()]].label} · ${{ T: "home", S: "away", D: "tension" }[b.fn]}`; } });
$("pp").innerHTML = PLAY;
resize(); $("level").dispatchEvent(new Event("input"));
requestAnimationFrame(frame);
const q = new URLSearchParams(location.search);
if (q.get("view")) { setView(q.get("view")); morph = 1; }
if (q.get("level")) { $("level").value = q.get("level"); $("level").dispatchEvent(new Event("input")); }
if (q.get("bar")) S.seekBar(+q.get("bar") - 1);
