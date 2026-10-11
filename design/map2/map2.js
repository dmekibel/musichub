// The chord map: quiet on the surface, deep on tap.
// Three family territories (home, away, tension) stacked down the screen; inside each its chords, around each everyday chord
// its colours (6, add9, maj7…). Tap a chord: it plays, and a card shows its Roman numeral and four relationships from the
// harmony engine: Goes to, Comes from (its approach kit), Same job (its team), Colours (spice, sweet to spicy). Tap a
// relationship to see only that one drawn on the map. Famous progressions play as routes across it.
import * as H from "../engine/harmony.js?v=1";
import * as S from "../app/sound.js?v=20261011e";
import { BACH } from "../app/data.js?v=20261011e";

const $ = (id) => document.getElementById(id);
const COL = { T: "#f4c8a0", S: "#b7d4c2", D: "#e9b4bf" };
const WORD = { T: "Home", S: "Away", D: "Tension" }, FEEL = { T: "feels finished, like arriving", S: "a step away from home", D: "wants to resolve home" };
const FAM = { T: [400, 300], S: [400, 850], D: [400, 1400] }, FR = 245;
const KEYS = [0, 7, 2, 9, 5, 10, 3];
let key = 0;
const pref = () => ([5, 10, 3, 8, 1].includes(key) ? "flat" : key === 0 ? "nice" : "sharp");
const nm = (c) => H.nameOf(c, pref());
const tight = (t) => t.replace(/([♭♯])/g, '<tspan font-size=".82em" dx="-1">$1</tspan><tspan dx="-1"></tspan>');

// Roman numeral relative to the key (upper case = major, lower = minor or diminished)
const DEG = ["I", "♭II", "II", "♭III", "III", "IV", "♯IV", "V", "♭VI", "VI", "♭VII", "VII"];
function roman(c) { const d = DEG[H.mod(c.root - key)], low = ["min", "m7", "m6", "madd9", "madd11", "mb6", "mmaj7", "dim7", "m7b5"].includes(c.q); const suf = { "7": "7", maj7: "maj7", m7: "7", m6: "6", "6": "6", dim7: "°7", m7b5: "ø7", "9": "9", "13": "13", "7b9": "7♭9", "7sus4": "7sus4", add9: "add9", madd9: "add9", add11: "add11", madd11: "add11", b6: "♭6", mb6: "♭6", mmaj7: "maj7", sus4: "sus4" }[c.q] || ""; return (low ? d.toLowerCase() : d) + suf; }

// ---------- the map's chords
const LAYOUT = [
  ["T", 0, "maj", "big", -82, -28], ["T", 9, "min", "big", 84, -22], ["T", 3, "maj", "med", -64, 116], ["T", 6, "maj", "med", 64, 120],
  ["S", 5, "maj", "big", -82, -28], ["S", 2, "min", "big", 84, -22], ["S", 8, "maj", "med", -64, 116], ["S", 11, "m7b5", "med", 64, 120], ["S", 2, "7", "small", 0, 196],
  ["D", 7, "7", "big", -82, -28], ["D", 4, "min", "med", 0, -130], ["D", 10, "7", "med", 84, -24], ["D", 1, "7", "med", -64, 116], ["D", 4, "7", "med", 64, 120], ["D", 11, "dim7", "small", 0, 196],
];
const VARIANTS = { maj: ["6", "add9", "maj7", "add11"], min: ["m7", "madd9", "m6"], "7": ["9", "13", "7sus4", "7b9"] };
let NODES = [];
function build() {
  NODES = [];
  for (const [job, off, q, size, dx, dy] of LAYOUT) {
    const [fx, fy] = FAM[job], c = H.chord(key + off, q), x = fx + dx, y = fy + dy, n = { id: nm(c), c, job, size, x, y, variant: false }; NODES.push(n);
    if (size === "big") { const base = Math.atan2(y - fy, x - fx), vs = VARIANTS[q] || []; vs.forEach((vq, k) => { const a = base + (k - (vs.length - 1) / 2) * 0.5, vc = H.chord(key + off, vq); NODES.push({ id: nm(vc), c: vc, job, size: "var", x: x + Math.cos(a) * 120, y: y + Math.sin(a) * 120, variant: true, parent: n.id }); }); }
  }
}
const findNode = (c) => NODES.find((m) => m.id === nm(c)) || NODES.find((m) => !m.variant && m.c.root === c.root && H.jobOf(m.c, key) === H.jobOf(c, key)) || NODES.find((m) => !m.variant && m.c.root === c.root) || null;

// ---------- view
const svg = $("map");
let W = innerWidth, Hh = innerHeight, view = { s: 1, tx: 0, ty: 0 };
const FIT = () => W / 800;
function fit() { W = innerWidth; Hh = innerHeight; const s = FIT(); view = { s, tx: W / 2 - 400 * s, ty: 104 - 40 * s }; }
addEventListener("resize", () => { fit(); draw(); });
const R = { big: 50, med: 37, small: 31, var: 29 };

let sel = null, lens = "next", rel = [], route = [], cur = null, ripples = [];
function draw() {
  let s = `<defs><filter id="sh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#1e1a2d" flood-opacity=".22"/></filter>
    <marker id="ah" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#faf5ee" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker>
    <marker id="am" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="rgba(250,245,238,.5)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>`;
  s += `<g transform="translate(${view.tx} ${view.ty}) scale(${view.s})">`;
  // the journey between territories: quiet lines down the left, "resolve" back up the right
  const side = (y1, y2, x, label, up) => `<path d="M${x} ${y1} C${x + (up ? 70 : -70)} ${y1 + (y2 - y1) * 0.3} ${x + (up ? 70 : -70)} ${y1 + (y2 - y1) * 0.7} ${x} ${y2}" fill="none" stroke="rgba(250,245,238,.28)" stroke-width="2" marker-end="url(#am)"/><text x="${x + (up ? 64 : -64)}" y="${(y1 + y2) / 2}" font-size="21" font-weight="650" fill="rgba(250,245,238,.5)" text-anchor="middle" transform="rotate(${up ? 90 : -90} ${x + (up ? 64 : -64)} ${(y1 + y2) / 2})">${label}</text>`;
  s += side(FAM.T[1] + 150, FAM.S[1] - 150, 108, "leave", false) + side(FAM.S[1] + 150, FAM.D[1] - 150, 108, "build", false) + side(FAM.D[1] - 60, FAM.T[1] + 60, 712, "resolve", true);
  for (const job of ["T", "S", "D"]) { const [x, y] = FAM[job]; s += `<circle cx="${x}" cy="${y}" r="${FR}" fill="${COL[job]}" fill-opacity=".13" stroke="${COL[job]}" stroke-opacity=".38" stroke-width="1.5"/><text x="${x}" y="${y - FR + 50}" font-size="25" font-weight="800" fill="${COL[job]}" text-anchor="middle" letter-spacing="4">${WORD[job].toUpperCase()}</text>`; }
  for (const n of NODES) if (n.variant) { const p = NODES.find((m) => m.id === n.parent); s += `<line x1="${p.x}" y1="${p.y}" x2="${n.x}" y2="${n.y}" stroke="${COL[n.job]}" stroke-opacity=".28" stroke-width="1.2"/>`; }
  // the route of a playing progression
  if (route.length > 1) { const pts = route.map((id) => NODES.find((n) => n.id === id)).filter(Boolean); s += `<path d="${pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join("")}" fill="none" stroke="#faf5ee" stroke-opacity=".55" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`; }
  // the chosen relationship: arrows (goes to, comes from) or dashed rings (same job, colours)
  const ring = new Set();
  for (const L of rel) {
    if (L.ring) { ring.add(L.to); continue; }
    const a = NODES.find((n) => n.id === L.from), b = NODES.find((n) => n.id === L.to); if (!a || !b || a === b) continue;
    const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.16, my = (a.y + b.y) / 2 - (b.x - a.x) * 0.16, hh = Math.hypot(b.x - mx, b.y - my), rr = R[b.size] + 7, ex = b.x - ((b.x - mx) / hh) * rr, ey = b.y - ((b.y - my) / hh) * rr, ha = Math.hypot(a.x - mx, a.y - my), ra = R[a.size] + 4, sx = a.x + ((mx - a.x) / ha) * ra, sy = a.y + ((my - a.y) / ha) * ra;
    s += `<path d="M${sx} ${sy} Q${mx} ${my} ${ex} ${ey}" fill="none" stroke="#faf5ee" stroke-opacity="${0.45 + 0.4 * L.w}" stroke-width="${1.6 + 2.6 * L.w}" stroke-linecap="round" marker-end="url(#ah)"/>`;
  }
  // ripples: one thin ring when a chord sounds
  const now = performance.now(); ripples = ripples.filter((r) => now - r.t < 900);
  for (const r of ripples) { const n = NODES.find((m) => m.id === r.id); if (!n) continue; const k = (now - r.t) / 900; s += `<circle cx="${n.x}" cy="${n.y}" r="${R[n.size] + 10 + k * 70}" fill="none" stroke="#faf5ee" stroke-opacity="${0.5 * (1 - k)}" stroke-width="2"/>`; }
  for (const n of NODES) {
    const r = R[n.size], isSel = sel && sel.id === n.id, isCur = cur === n.id, big = n.size === "big";
    const fill = isSel || isCur ? "#faf5ee" : big ? COL[n.job] : n.variant ? "rgba(250,245,238,.07)" : "rgba(250,245,238,.13)";
    const fs = big ? (n.id.length > 3 ? 31 : 37) : n.variant ? (n.id.length > 5 ? 14.5 : 18) : n.id.length > 4 ? 19 : 24;
    s += `<g data-id="${n.id}" style="cursor:pointer"><circle cx="${n.x}" cy="${n.y}" r="${r + 10}" fill="transparent"/>`;
    if (ring.has(n.id)) s += `<circle cx="${n.x}" cy="${n.y}" r="${r + 9}" fill="none" stroke="#faf5ee" stroke-width="2" stroke-dasharray="3 5"/>`;
    s += `<circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${fill}" stroke="${big || isSel || isCur ? "none" : COL[n.job]}" stroke-opacity="${n.variant ? 0.55 : 0.8}" stroke-width="1.5" ${big || isSel || isCur ? 'filter="url(#sh)"' : ""}/>`;
    s += `<text x="${n.x}" y="${n.y + fs * 0.35}" font-size="${fs}" font-weight="${big ? 800 : 700}" fill="${isSel || isCur || big ? "#3a3346" : "rgba(250,245,238,.9)"}" text-anchor="middle">${tight(n.id)}</text></g>`;
  }
  svg.innerHTML = s + `</g>`;
  if (ripples.length) requestAnimationFrame(draw);
}

// ---------- gestures: tap plays, drag explores, pinch zooms
const ptrs = new Map(); let downAt = null, moved = false, pinch0 = null;
svg.addEventListener("pointerdown", (e) => { ptrs.set(e.pointerId, [e.clientX, e.clientY]); svg.setPointerCapture(e.pointerId); if (ptrs.size === 1) { downAt = [e.clientX, e.clientY, view.tx, view.ty]; moved = false; } else if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s: view.s, cx: (a[0] + b[0]) / 2, cy: (a[1] + b[1]) / 2, tx: view.tx, ty: view.ty }; moved = true; } });
svg.addEventListener("pointermove", (e) => { if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]); if (ptrs.size === 2 && pinch0) { const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), s = Math.max(0.3, Math.min(2.6, pinch0.s * (d / pinch0.d))); view = { s, tx: pinch0.cx - (pinch0.cx - pinch0.tx) * (s / pinch0.s), ty: pinch0.cy - (pinch0.cy - pinch0.ty) * (s / pinch0.s) }; draw(); } else if (ptrs.size === 1 && downAt) { const dx = e.clientX - downAt[0], dy = e.clientY - downAt[1]; if (Math.hypot(dx, dy) > 8) moved = true; if (moved) { view.tx = downAt[2] + dx; view.ty = downAt[3] + dy; draw(); } } });
svg.addEventListener("pointerup", (e) => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = null; if (!moved && ptrs.size === 0) { const el = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-id]"); if (el) select(NODES.find((n) => n.id === el.dataset.id)); else { sel = null; rel = []; $("card").classList.remove("show"); draw(); } } if (!ptrs.size) downAt = null; });
svg.addEventListener("wheel", (e) => { e.preventDefault(); const k = e.deltaY > 0 ? 0.92 : 1.08, s = Math.max(0.3, Math.min(2.6, view.s * k)); view = { s, tx: e.clientX - (e.clientX - view.tx) * (s / view.s), ty: e.clientY - (e.clientY - view.ty) * (s / view.s) }; draw(); }, { passive: false });

// ---------- sound
let lastV = null;
function sound(c, id, dur = 1.5) { const v = H.voicing(c, lastV); S.chord(v, dur); lastV = v; if (id) { ripples.push({ id, t: performance.now() }); draw(); } }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function playSeq(seq) { for (const c of seq) { const n = findNode(c); sound(c, n && n.id, 1.0); await wait(620); } }

// ---------- the card: Roman numeral, feel, and four relationships (each one a lens on the map)
function relations(n) {
  return {
    next: H.next(n.c, key).map((o) => ({ c: o.c, w: o.w, label: nm(o.c), sub: "" })),
    from: H.approach(n.c, key).map((k) => ({ seq: k.seq, c: k.seq[k.seq.length - 1], label: k.seq.map(nm).join(" → "), sub: k.name.toLowerCase().replace("its own five", "five").replace("plagal (amen)", "amen").replace("sus, then five", "sus") })),
    team: H.swap(n.c, key).map((o) => ({ c: o.c, label: nm(o.c), sub: "" })),
    colours: H.spice(n.c).filter((o) => o.c.q !== n.c.q).map((o) => ({ c: o.c, label: nm(o.c), sub: "·".repeat(Math.max(1, Math.round(o.clash))) })),
  };
}
function select(n) {
  sel = n; sound(n.c, n.id);
  const job = n.job, Rl = relations(n);
  const chip = (o, k, kind) => `<button data-k="${kind}" data-i="${k}" style="background:${COL[H.jobOf(o.c, key)] || "#eee"}">${o.label}${o.sub ? ` <span style="opacity:.55;font-weight:650">${o.sub}</span>` : ""}</button>`;
  const row = (kind, label, list) => (list.length ? `<span class="k" data-lens="${kind}" style="${lens === kind ? "color:#3a3346;text-decoration:underline;text-underline-offset:3px" : ""}">${label}</span><div class="v">${list.map((o, k) => chip(o, k, kind)).join("")}</div>` : "");
  $("card").innerHTML = `<div class="hd"><span class="nm">${n.id}</span><span class="job" style="background:${COL[job]}">${WORD[job]} · ${roman(n.c)}</span><button class="add" id="add">+ Add</button></div>
    <p class="feel">${H.Q[n.c.q].word[0].toUpperCase() + H.Q[n.c.q].word.slice(1)}, ${FEEL[job]}.</p>
    <div class="rel">${row("next", "Goes to", Rl.next)}${row("from", "Comes from", Rl.from)}${row("team", "Same job", Rl.team)}${row("colours", "Colours", Rl.colours)}</div>`;
  $("card").classList.add("show");
  $("add").onclick = () => { prog.push(n); drawProg(); };
  $("card").querySelectorAll("[data-lens]").forEach((el) => (el.onclick = () => { lens = el.dataset.lens; select(n); }));
  $("card").querySelectorAll(".v button").forEach((b) => (b.onclick = () => { const o = Rl[b.dataset.k][+b.dataset.i]; if (o.seq) playSeq([...o.seq, n.c]); else if (b.dataset.k === "next") playSeq([n.c, o.c]); else { const t = findNode(o.c); sound(o.c, t && t.id); } }));
  // draw only the chosen relationship
  const list = Rl[lens] || [];
  rel = lens === "next" ? list.map((o) => ({ from: n.id, to: findNode(o.c)?.id, w: o.w }))
    : lens === "from" ? list.map((o) => ({ from: findNode(o.c)?.id, to: n.id, w: 0.5 }))
    : list.map((o) => ({ to: findNode(o.c)?.id, ring: true }));
  draw(); glide(n);
}
function glide(n) { const sy = view.ty + n.y * view.s, safe = [130, Hh - 340]; if (sy >= safe[0] && sy <= safe[1]) return; const goal = view.ty + ((safe[0] + safe[1]) / 2 - sy), start0 = view.ty, t0 = performance.now(); const an = (t) => { const k = Math.min(1, (t - t0) / 380), e = 1 - Math.pow(1 - k, 3); view.ty = start0 + (goal - start0) * e; draw(); if (k < 1) requestAnimationFrame(an); }; requestAnimationFrame(an); }

// ---------- famous routes
const ROUTES = [["Let It Be", "C G Am F"], ["Pachelbel", "C G Am Em F C F G"], ["Two–five–one", "Dm7 G7 Cmaj7"], ["Jazz turnaround", "C Am7 Dm7 G7"], ["Andalusian", "Am G F E7"], ["Bach", ""]];
$("routes").innerHTML = `<span class="lab">Hear</span>` + ROUTES.map(([n2], i) => `<button data-r="${i}">${n2}</button>`).join("");
$("routes").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
  const [name, chords] = ROUTES[+b.dataset.r]; stopAll(); $("routes").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
  if (name === "Bach") { if (key) { key = 0; build(); $("key").textContent = "Key of C"; } S.toggle(); return; }
  const tr = (s2) => { const c = H.parseChord(s2); return H.chord(c.root + key, c.q); };
  prog = chords.split(" ").map((s2) => findNode(tr(s2))).filter(Boolean); drawProg(); start();
}));

// ---------- the progression dock
let prog = [], playing = false, pi = -1, timer = null;
function drawProg() {
  $("prog").innerHTML = prog.length ? prog.map((n, i) => `<button class="pc${i === pi ? " now" : ""}" data-i="${i}" style="background:${COL[n.job]}">${n.id}</button>`).join("") + `<button class="btn ghost" id="clr">Clear</button>` : `<span class="hint">Tap a chord to hear it · + Add to build a progression</span>`;
  $("prog").querySelectorAll(".pc").forEach((b) => (b.onclick = () => select(prog[+b.dataset.i])));
  const c = $("clr"); if (c) c.onclick = () => { stopAll(); prog = []; drawProg(); };
  $("pp").innerHTML = playing || S.playing() ? `<svg viewBox="0 0 24 24"><rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor"/></svg>` : `<svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="currentColor"/></svg>`;
}
function step() { pi = (pi + 1) % prog.length; const n = prog[pi]; sound(n.c, n.id, 1.1); cur = n.id; route = [...route.slice(-7), n.id]; draw(); drawProg(); }
function start() { if (!prog.length) return; sel = null; rel = []; $("card").classList.remove("show"); playing = true; route = []; step(); timer = setInterval(step, 1150); drawProg(); }
function stopAll() { playing = false; clearInterval(timer); pi = -1; cur = null; route = []; if (S.playing()) S.toggle(); draw(); drawProg(); }
$("pp").addEventListener("click", () => { if (playing || S.playing()) { stopAll(); $("routes").querySelectorAll("button").forEach((x) => x.classList.remove("on")); return; } if (!prog.length) prog = ["C", "Am", "F", "G7"].map((s2) => findNode(H.parseChord(s2))); start(); });

// Bach travels the map
let lastBar = -1;
S.onChange(() => { drawProg(); if (!S.playing()) { lastBar = -1; return; } const i = S.bar(); if (i === lastBar) return; lastBar = i; const b = BACH.bars[i], c = H.parseChord(b.chord), n = findNode(c); if (!n) return; cur = n.id; route = [...route.slice(-7), n.id]; ripples.push({ id: n.id, t: performance.now() }); draw(); });

// key
$("key").addEventListener("click", () => { stopAll(); key = KEYS[(KEYS.indexOf(key) + 1) % KEYS.length]; build(); prog = []; sel = null; rel = []; $("card").classList.remove("show"); $("key").textContent = `Key of ${H.noteName(key, pref())}`; draw(); drawProg(); });

build(); fit(); draw(); drawProg();
