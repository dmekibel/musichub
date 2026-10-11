// The chord map: one full-screen map to explore and play. Three family territories (home, away, tension); inside each, its
// chords (the everyday ones big, the exotic teammates smaller); outside each everyday chord, its variations (6, add9, maj7…),
// which appear as you zoom in. Tap a chord to hear it and see where it wants to go. Drag to explore, pinch to zoom.
import * as H from "../engine/harmony.js?v=1";
import * as S from "../app/sound.js?v=20261011e";
import { BACH } from "../app/data.js?v=20261011e";

const $ = (id) => document.getElementById(id);
const COL = { T: "#f2c14e", S: "#46b3a9", D: "#e8607a" }, WORD = { T: "Home", S: "Away", D: "Tension" };
const FEEL = { T: "feels finished, like arriving", S: "a step away from home", D: "wants to resolve home" };
const FAM = { T: [400, 300], S: [400, 840], D: [400, 1380] }, FR = 238;
const KEYS = [0, 7, 2, 9, 5, 10, 3];
let key = 0;
const pref = () => ([5, 10, 3, 8, 1].includes(key) ? "flat" : key === 0 ? "nice" : "sharp");
const nm = (c) => H.nameOf(c, pref());

// ---------- the nodes (relative to the key)
const LAYOUT = [
  ["T", 0, "maj", "big", -78, -30], ["T", 9, "min", "big", 82, -24], ["T", 3, "maj", "med", -60, 112], ["T", 6, "maj", "med", 62, 116],
  ["S", 5, "maj", "big", -78, -30], ["S", 2, "min", "big", 82, -24], ["S", 8, "maj", "med", -60, 112], ["S", 11, "m7b5", "med", 62, 116],
  ["D", 7, "7", "big", -78, -30], ["D", 10, "7", "med", 82, -40], ["D", 1, "7", "med", -60, 112], ["D", 4, "7", "med", 62, 116], ["D", 11, "dim7", "small", 0, 186],
];
const VARIANTS = { maj: ["6", "add9", "maj7", "add11"], min: ["m7", "madd9", "m6"], "7": ["9", "13", "7sus4", "7b9"] };
let NODES = [];
function build() {
  NODES = [];
  for (const [job, off, q, size, dx, dy] of LAYOUT) {
    const [fx, fy] = FAM[job], c = H.chord(key + off, q), x = fx + dx, y = fy + dy;
    const n = { id: nm(c), c, job, size, x, y, variant: false }; NODES.push(n);
    if (size === "big") {
      // variations fan outward, away from the family's centre (beyond the circle)
      const base = Math.atan2(y - fy, x - fx), vs = VARIANTS[q] || [];
      vs.forEach((vq, k) => { const a = base + (k - (vs.length - 1) / 2) * 0.5, r = 118; const vc = H.chord(key + off, vq); NODES.push({ id: nm(vc), c: vc, job, size: "var", x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, variant: true, parent: n.id }); });
    }
  }
}

// ---------- view (pan and zoom)
const svg = $("map"), NS = "http://www.w3.org/2000/svg";
let W = innerWidth, Hh = innerHeight, view = { s: 1, tx: 0, ty: 0 };
const FIT = () => W / 800;
function fit() { W = innerWidth; Hh = innerHeight; const s = FIT(); view = { s, tx: W / 2 - 400 * s, ty: 78 - 40 * s }; }
addEventListener("resize", () => { fit(); draw(); });
const R = { big: 50, med: 37, small: 30, var: 30 };

let sel = null, lines = [], lit = null, trail = [];
function draw() {
  const z = view.s / FIT(); // 1 = fitted to the screen width
  const varA = Math.max(0, Math.min(1, (z - 0.85) / 0.5)) * 0.6 + 0.4; // variations always present, clearer when zoomed
  let s = `<defs><filter id="gl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="10"/></filter><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="rgba(246,241,231,.45)"/></marker><marker id="ah2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#fff8ea"/></marker></defs>`;
  s += `<g transform="translate(${view.tx} ${view.ty}) scale(${view.s})">`;
  // territories and the cycle between them
  const arc = (a, b, label) => { const [x1, y1] = FAM[a], [x2, y2] = FAM[b], mx = (x1 + x2) / 2, my = (y1 + y2) / 2, cx = 500, cy = 590, ox = mx + (mx - cx) * 0.55, oy = my + (my - cy) * 0.55, d = Math.hypot(x2 - x1, y2 - y1), u = [(x2 - x1) / d, (y2 - y1) / d]; return `<path d="M${x1 + u[0] * (FR + 14)} ${y1 + u[1] * (FR + 14)} Q${ox} ${oy} ${x2 - u[0] * (FR + 20)} ${y2 - u[1] * (FR + 20)}" fill="none" stroke="rgba(246,241,231,.22)" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" marker-end="url(#ah)"/><text x="${ox}" y="${oy + 6}" font-size="22" font-weight="750" fill="rgba(246,241,231,.45)" text-anchor="middle">${label}</text>`; };
  const down = (a, b, label) => { const [x, y1] = FAM[a], y2 = FAM[b][1]; return `<path d="M${x - 300} ${y1 + 120} C${x - 380} ${y1 + 260} ${x - 380} ${y2 - 260} ${x - 300} ${y2 - 130}" fill="none" stroke="rgba(246,241,231,.25)" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round" marker-end="url(#ah)"/><text x="${x - 352}" y="${(y1 + y2) / 2 + 8}" font-size="26" font-weight="750" fill="rgba(246,241,231,.5)" text-anchor="middle" transform="rotate(-90 ${x - 352} ${(y1 + y2) / 2})">${label}</text>`; };
  s += down("T", "S", "leave") + down("S", "D", "build") + `<path d="M${400 + 300} ${1380 - 40} C${400 + 420} ${1100} ${400 + 420} ${560} ${400 + 300} ${300 + 40}" fill="none" stroke="rgba(246,241,231,.25)" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round" marker-end="url(#ah)"/><text x="${400 + 372}" y="${840 + 8}" font-size="26" font-weight="750" fill="rgba(246,241,231,.5)" text-anchor="middle" transform="rotate(90 ${400 + 372} 840)">resolve</text>`;
  for (const job of ["T", "S", "D"]) { const [x, y] = FAM[job], on = lit === job; s += `${on ? `<circle cx="${x}" cy="${y}" r="${FR}" fill="${COL[job]}" opacity=".35" filter="url(#gl)"/>` : ""}<circle cx="${x}" cy="${y}" r="${FR}" fill="${COL[job]}" fill-opacity="${on ? 0.2 : 0.1}" stroke="${COL[job]}" stroke-opacity=".45" stroke-width="2"/><text x="${x}" y="${y - FR + 52}" font-size="30" font-weight="850" fill="${COL[job]}" text-anchor="middle" letter-spacing="3">${WORD[job].toUpperCase()}</text>`; }
  // variation tethers
  for (const n of NODES) if (n.variant) { const p = NODES.find((m) => m.id === n.parent); s += `<line x1="${p.x}" y1="${p.y}" x2="${n.x}" y2="${n.y}" stroke="${COL[n.job]}" stroke-opacity="${0.25 * varA}" stroke-width="1.5"/>`; }
  // the trail of the playing progression
  if (trail.length > 1) { const pts = trail.map((id) => NODES.find((n) => n.id === id)).filter(Boolean); for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], k = i / pts.length; s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#fff8ea" stroke-opacity="${0.15 + 0.55 * k}" stroke-width="${2 + 4 * k}" stroke-linecap="round"/>`; } }
  // where the selected chord wants to go
  for (const L of lines) { const a = NODES.find((n) => n.id === L.from), b = NODES.find((n) => n.id === L.to); if (!a || !b) continue; const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.18, my = (a.y + b.y) / 2 - (b.x - a.x) * 0.18, d = Math.hypot(b.x - a.x, b.y - a.y), rr = R[b.size] + 8; const ex = b.x - ((b.x - mx) / Math.hypot(b.x - mx, b.y - my)) * rr, ey = b.y - ((b.y - my) / Math.hypot(b.x - mx, b.y - my)) * rr; s += `<path d="M${a.x} ${a.y} Q${mx} ${my} ${ex} ${ey}" fill="none" stroke="#fff8ea" stroke-opacity="${0.35 + 0.5 * L.w}" stroke-width="${2 + 5 * L.w}" stroke-linecap="round" marker-end="url(#ah2)"/>`; void d; }
  // chords
  for (const n of NODES) {
    const r = R[n.size], isSel = sel && sel.id === n.id, isLit = trail[trail.length - 1] === n.id, solid = n.size === "big" || isSel || isLit, a = n.variant ? varA : 1;
    const label = n.id, fs = n.size === "big" ? (label.length > 3 ? 32 : 38) : n.size === "var" ? (label.length > 5 ? 15 : 19) : label.length > 4 ? 20 : 25;
    if (isSel || isLit) s += `<circle cx="${n.x}" cy="${n.y}" r="${r + 14}" fill="#fff8ea" opacity=".3" filter="url(#gl)"/>`;
    s += `<g data-id="${n.id}" style="cursor:pointer" opacity="${a}"><circle cx="${n.x}" cy="${n.y}" r="${r + 10}" fill="transparent"/><circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${isSel || isLit ? "#fff8ea" : solid ? COL[n.job] : n.variant ? "rgba(40,42,80,.85)" : "rgba(246,241,231,.12)"}" stroke="${n.variant ? COL[n.job] : solid ? "none" : COL[n.job]}" stroke-width="${n.variant ? 1.5 : 2}"/>`;
    s += `<text x="${n.x}" y="${n.y + fs * 0.35}" font-size="${fs}" font-weight="800" fill="${isSel || isLit || solid ? "#2d2f55" : "#f6f1e7"}" text-anchor="middle">${label.replace(/([♭♯])/g, '<tspan font-size=".85em">$1</tspan>')}</text></g>`;
  }
  svg.innerHTML = s + `</g>`;
}

// ---------- tap to play, drag to pan, pinch to zoom
const ptrs = new Map(); let downAt = null, moved = false, pinch0 = null;
svg.addEventListener("pointerdown", (e) => { ptrs.set(e.pointerId, [e.clientX, e.clientY]); svg.setPointerCapture(e.pointerId); if (ptrs.size === 1) { downAt = [e.clientX, e.clientY, view.tx, view.ty]; moved = false; } else if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s: view.s, cx: (a[0] + b[0]) / 2, cy: (a[1] + b[1]) / 2, tx: view.tx, ty: view.ty }; moved = true; } });
svg.addEventListener("pointermove", (e) => {
  if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (ptrs.size === 2 && pinch0) { const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), s = Math.max(0.25, Math.min(3, pinch0.s * (d / pinch0.d))); view = { s, tx: pinch0.cx - (pinch0.cx - pinch0.tx) * (s / pinch0.s), ty: pinch0.cy - (pinch0.cy - pinch0.ty) * (s / pinch0.s) }; draw(); }
  else if (ptrs.size === 1 && downAt) { const dx = e.clientX - downAt[0], dy = e.clientY - downAt[1]; if (Math.hypot(dx, dy) > 8) moved = true; if (moved) { view.tx = downAt[2] + dx; view.ty = downAt[3] + dy; draw(); } }
});
svg.addEventListener("pointerup", (e) => {
  ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = null;
  if (!moved && ptrs.size === 0) { const el = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-id]"); if (el) tap(NODES.find((n) => n.id === el.dataset.id)); else { sel = null; lines = []; $("card").classList.remove("show"); draw(); } }
  if (ptrs.size === 0) downAt = null;
});
svg.addEventListener("wheel", (e) => { e.preventDefault(); const k = e.deltaY > 0 ? 0.92 : 1.08, s = Math.max(0.25, Math.min(3, view.s * k)); view = { s, tx: e.clientX - (e.clientX - view.tx) * (s / view.s), ty: e.clientY - (e.clientY - view.ty) * (s / view.s) }; draw(); }, { passive: false });

// ---------- tapping a chord
let lastV = null;
function tap(n) {
  sel = n; const v = H.voicing(n.c, lastV); S.chord(v, 1.6); lastV = v;
  const nx = H.next(n.c, key).map((o) => ({ to: findNode(o.c), w: o.w })).filter((o) => o.to);
  lines = nx.map((o) => ({ from: n.id, to: o.to.id, w: o.w }));
  const word = H.Q[n.c.q].word;
  $("cnm").innerHTML = n.id; $("ctx").innerHTML = `<b style="color:${COL[n.job]}">${WORD[n.job]}</b> · ${word}, ${FEEL[n.job]}.${nx.length ? `<br>Likes to go to <b>${nx.map((o) => o.to.id).join(", ")}</b>.` : ""}`;
  $("card").classList.add("show"); draw();
  glideTo(n);
}
// keep the tapped chord above the info card: glide the map up (or down) smoothly
function glideTo(n) {
  const sy = view.ty + n.y * view.s, safe = [120, Hh - 250];
  if (sy >= safe[0] && sy <= safe[1]) return;
  const goal = view.ty + ((safe[0] + safe[1]) / 2 - sy), start = view.ty, t0 = performance.now();
  const anim = (t) => { const k = Math.min(1, (t - t0) / 380), e = 1 - Math.pow(1 - k, 3); view.ty = start + (goal - start) * e; draw(); if (k < 1) requestAnimationFrame(anim); };
  requestAnimationFrame(anim);
}
function findNode(c) { const name = nm(c); let n = NODES.find((m) => m.id === name); if (n) return n; const plain = NODES.find((m) => !m.variant && m.c.root === c.root); return plain || null; }

// ---------- the progression
let prog = [], playing = false, pi = -1, timer = null;
function drawProg() {
  $("prog").innerHTML = prog.length ? prog.map((n, i) => `<button class="pc${i === pi ? " now" : ""}" data-i="${i}" style="background:${COL[n.job]}">${n.id}</button>`).join("") + `<button class="btn ghost" id="clr" style="height:34px">Clear</button>` : `<span class="hint">Tap a chord, then + Add to build a progression</span>`;
  $("prog").querySelectorAll(".pc").forEach((b) => b.addEventListener("click", () => tap(prog[+b.dataset.i])));
  const c = $("clr"); if (c) c.addEventListener("click", () => { stopAll(); prog = []; trail = []; drawProg(); draw(); });
  $("pp").innerHTML = playing ? `<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>` : `<svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="currentColor"/></svg>`;
}
$("cadd").addEventListener("click", () => { if (!sel) return; prog.push(sel); drawProg(); });
function step() { pi = (pi + 1) % prog.length; const n = prog[pi]; const v = H.voicing(n.c, lastV); S.chord(v, 1.15); lastV = v; trail = [...trail.slice(-5), n.id]; lit = n.job; draw(); drawProg(); }
function stopAll() { playing = false; clearInterval(timer); pi = -1; lit = null; trail = []; if (S.playing()) S.toggle(); draw(); drawProg(); }
$("pp").addEventListener("click", () => { if (playing || S.playing()) return stopAll(); if (!prog.length) { prog = ["C", "Am", "F", "G7"].map((s) => findNode(H.parseChord(s)).id).map((id) => NODES.find((n) => n.id === id)); } playing = true; step(); timer = setInterval(step, 1250); drawProg(); });

// ---------- Bach: the Prelude travels the map
$("bach").addEventListener("click", () => { if (playing) stopAll(); if (key !== 0) { key = 0; build(); $("key").textContent = "Key of C"; } S.toggle(); });
let lastBar = -1;
S.onChange(() => { if (!S.playing()) { if (!playing) { lit = null; draw(); } $("bach").textContent = "Bach"; return; } $("bach").textContent = "❚❚ Bach"; const i = S.bar(); if (i === lastBar) return; lastBar = i; const b = BACH.bars[i], c = H.parseChord(b.chord), n = findNode(c) || NODES.find((m) => m.job === H.jobOf(c, 0) && m.size === "big"); if (!n) return; trail = [...trail.slice(-5), n.id]; lit = n.job; sel = null; lines = []; $("cnm").textContent = H.nameOf(c); $("ctx").innerHTML = `<b style="color:${COL[n.job]}">${WORD[n.job]}</b> · Bach, bar ${b.bar}`; $("card").classList.add("show"); draw(); });

// ---------- key
$("key").addEventListener("click", () => { stopAll(); key = KEYS[(KEYS.indexOf(key) + 1) % KEYS.length]; build(); prog = []; sel = null; lines = []; $("card").classList.remove("show"); $("key").textContent = `Key of ${H.noteName(key, pref())}`; draw(); drawProg(); });

build(); fit(); draw(); drawProg();
