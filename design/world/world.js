// Harmony World: music as geography. The map is a Tonnetz (Euler, Riemann): notes sit at the corners of a triangle grid,
// neighbors a fifth apart (across) or a third apart (diagonals). Every major or minor chord is a triangle, a "town";
// chords that share two notes share a border. A key's six main chords form one connected patch, a "land" (C major, G major…);
// neighboring lands share towns, so a door chord is a border town. Each diminished chord is a straight road along the
// minor-third diagonal; there are exactly three families of these roads (Barry Harris's three squares, Lendvai's axes).
// Height = distance from home: home is the valley. The piece travels the map as it plays.
import * as S from "../app/sound.js?v=20261011e";
import { BACH } from "../app/data.js?v=20261011e";
import { BWV846_NOTES } from "../../data/bwv846-notes.js?v=20261011e";

const PCN = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const MAJ = ["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"], MIN = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"];
const FN = { T: [255, 192, 74], S: [47, 212, 164], D: [138, 124, 255] };
const LANDS = { C: { k: 0, col: [255, 192, 74], name: "C major" }, G: { k: 1, col: [138, 124, 255], name: "G major" }, F: { k: -1, col: [47, 212, 164], name: "F major" } };
const FAM = [[255, 159, 122], [169, 155, 255], [111, 220, 192]];
const mod = (a, n) => ((a % n) + n) % n;
const pc = (x, y) => mod(7 * x + 4 * y, 12);
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// ---------- the grid
const XR = [-6, 7], YR = [-3, 4];
const TRI = [];
for (let x = XR[0]; x <= XR[1]; x++) for (let y = YR[0]; y <= YR[1]; y++) {
  TRI.push({ id: `M${x},${y}`, mode: "M", root: pc(x, y), v: [[x, y], [x + 1, y], [x, y + 1]] });
  TRI.push({ id: `m${x},${y}`, mode: "m", root: pc(x, y), v: [[x, y], [x + 1, y - 1], [x + 1, y]] });
}
TRI.forEach((t) => { t.c = [(t.v[0][0] + t.v[1][0] + t.v[2][0]) / 3, (t.v[0][1] + t.v[1][1] + t.v[2][1]) / 3]; t.label = t.mode === "M" ? MAJ[t.root] : MIN[t.root] + "m"; });
const TID = Object.fromEntries(TRI.map((t) => [t.id, t]));
for (const L of Object.values(LANDS)) { const k = L.k; L.ids = new Set([`M${k - 1},0`, `M${k},0`, `M${k + 1},0`, `m${k - 2},1`, `m${k - 1},1`, `m${k},1`]); L.visited = false; }
const landsOf = (t) => Object.entries(LANDS).filter(([, L]) => L.ids.has(t.id)).map(([k]) => k);
// perimeter edges of each land (edges used by exactly one of its towns)
for (const L of Object.values(LANDS)) {
  const cnt = new Map();
  for (const id of L.ids) { const t = TID[id]; for (let i = 0; i < 3; i++) { const a = t.v[i], b = t.v[(i + 1) % 3], key = [a, b].map(String).sort().join("|"); cnt.set(key, (cnt.get(key) || []).concat([[id, a, b]])); } }
  L.border = [...cnt.values()].filter((e) => e.length === 1).map((e) => e[0]);
  L.center = [...L.ids].map((id) => TID[id].c).reduce((s, c) => [s[0] + c[0] / 6, s[1] + c[1] / 6], [0, 0]);
}
// height: distance from home (C's centre); home is a flat valley
const HOME = LANDS.C.center;
const elev = ([x, y]) => { const dx = x - HOME[0] + (y - HOME[1]) / 2, dy = (y - HOME[1]) * 0.866, d = Math.hypot(dx, dy); return Math.max(0, Math.min(1, (d - 1.25) * 0.2)); };

// ---------- the piece's route
const ROOT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function parse(sym) { const main = sym.split("/")[0], acc = main[1] === "#" ? 1 : main[1] === "b" ? -1 : 0, r = mod(ROOT[main[0]] + acc, 12), q = main.slice(acc ? 2 : 1); return { r, q, kind: q.startsWith("dim") ? "dim" : q === "m" || q === "m7" ? "m" : "M", seventh: q === "7" || q === "7sus4" ? 10 : q === "maj7" ? 11 : q === "m7" ? 10 : null }; }
const dist = (a, b) => { const dx = a[0] - b[0] + (a[1] - b[1]) / 2, dy = (a[1] - b[1]) * 0.866; return Math.hypot(dx, dy); };
const ROUTE = []; let prev = HOME;
for (const b of BACH.bars) {
  const p = parse(b.chord), land = LANDS[b.key];
  let stop;
  if (p.kind === "dim") {
    // a road: four corners in a row along the minor-third diagonal (1, -1), one of each note of the square
    let best = null, bd = 1e9;
    for (let x = XR[0]; x <= XR[1] - 3; x++) for (let y = YR[0] + 3; y <= YR[1]; y++) { if (mod(x + y, 3) !== p.r % 3) continue; const v = [0, 1, 2, 3].map((i) => [x + i, y - i]), mid = [x + 1.5, y - 1.5], d = dist(mid, prev); if (d < bd) { bd = d; best = { road: v, c: mid }; } }
    stop = { ...best, fam: p.r % 3 };
  } else {
    const cands = TRI.filter((t) => t.mode === p.kind && t.root === p.r);
    const inLand = cands.filter((t) => land.ids.has(t.id));
    const pool = inLand.length ? inLand : cands; let best = null, bd = 1e9;
    for (const t of pool) { const d = dist(t.c, prev); if (d < bd) { bd = d; best = t; } }
    stop = { tri: best.id, c: best.c };
    if (p.seventh != null) { const want = mod(p.r + p.seventh, 12); let sv = null, sd = 1e9; for (let x = XR[0]; x <= XR[1]; x++) for (let y = YR[0]; y <= YR[1]; y++) if (pc(x, y) === want) { const d = dist([x, y], best.c); if (d < sd) { sd = d; sv = [x, y]; } } stop.seventh = sv; }
  }
  stop.p = p; stop.b = b; ROUTE.push(stop); prev = stop.c;
}

// ---------- canvas and camera
const cv = document.getElementById("cv"), ctx = cv.getContext("2d");
let W, H, s, cam = [...HOME], layers = { lands: true, notes: true, roads: false, trail: true };
function resize() { const d = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); s = Math.min(78, W / 5.6); }
addEventListener("resize", resize);
const TILT = 0.58, HGT = () => s * 0.9;
const plane = ([x, y]) => [x * s + (y * s) / 2, y * s * 0.866];
function scr(p, h = 0) { const [px, pd] = plane(p), [cx, cd] = plane(cam); return [W / 2 + (px - cx), H * 0.53 - (pd - cd) * TILT - h * HGT()]; }

const notesNow = (pos) => new Set(BWV846_NOTES.notes.filter(([on, len]) => on <= pos && pos < on + Math.min(len, 1.5)).map((n) => n[2] % 12));
let trav = [...HOME], lift = {};

function frame(now) {
  requestAnimationFrame(frame);
  const started = S.started() || S.pos() > 0, bar = S.bar(), stop = ROUTE[bar], pos = S.pos();
  if (started) { for (let i = 0; i <= bar; i++) LANDS[ROUTE[i].b.key].visited = true; if (ROUTE.slice(0, bar + 1).some((r) => r.tri && LANDS.F.ids.has(r.tri))) LANDS.F.visited = true; }
  const target = started ? stop.c : HOME;
  trav = [trav[0] + (target[0] - trav[0]) * 0.09, trav[1] + (target[1] - trav[1]) * 0.09];
  cam = [cam[0] + (trav[0] - cam[0]) * 0.035, cam[1] + (trav[1] - cam[1]) * 0.035];
  for (const t of TRI) { const goal = started && stop.tri === t.id ? 1 : 0; lift[t.id] = (lift[t.id] || 0) + (goal - (lift[t.id] || 0)) * 0.12; }

  ctx.fillStyle = "#0e0b26"; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H * 0.55, 0, W / 2, H * 0.55, W); g.addColorStop(0, "rgba(60,48,140,.28)"); g.addColorStop(1, "rgba(14,11,38,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  const visitedT = new Set(started ? ROUTE.slice(0, bar + 1).filter((r) => r.tri).map((r) => r.tri) : []);
  const curFn = started ? FN[stop.b.fn] : FN.T;
  // tiles, far to near, each a small prism (painter's order)
  const order = TRI.map((t) => ({ t, d: plane(t.c)[1] })).sort((a, b) => b.d - a.d);
  for (const { t } of order) {
    const e = elev(t.c) + lift[t.id] * 0.32, shrink = 0.06;
    const vv = t.v.map(([x, y]) => [x + (t.c[0] - x) * shrink, y + (t.c[1] - y) * shrink]);
    const top = vv.map((v) => scr(v, e)), base = vv.map((v) => scr(v, 0)), thick = 5 + e * HGT();
    if (top.every(([x, y]) => x < -60 || x > W + 60 || y < -60 || y > H + 80)) continue;
    const lands = landsOf(t), isCur = started && stop.tri === t.id, vis = visitedT.has(t.id);
    // front-facing sides
    for (let i = 0; i < 3; i++) { const a = i, b = (i + 1) % 3, c = (i + 2) % 3; if (plane(vv[a])[1] + plane(vv[b])[1] > 2 * plane(vv[c])[1]) continue; ctx.beginPath(); ctx.moveTo(...top[a]); ctx.lineTo(...top[b]); ctx.lineTo(top[b][0], top[b][1] + thick); ctx.lineTo(top[a][0], top[a][1] + thick); ctx.closePath(); ctx.fillStyle = isCur ? rgba(curFn.map((v) => v * 0.55), 1) : "#130f33"; ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(...top[0]); ctx.lineTo(...top[1]); ctx.lineTo(...top[2]); ctx.closePath();
    ctx.fillStyle = isCur ? rgba(curFn, 1) : vis ? "#2a2560" : "#1d1946"; ctx.fill();
    if (layers.lands && !isCur) for (const k of lands) { ctx.fillStyle = rgba(LANDS[k].col, LANDS[k].visited || k === "C" ? 0.2 : 0.07); ctx.fill(); }
    ctx.strokeStyle = isCur ? "rgba(255,246,228,.9)" : "rgba(246,240,228,.06)"; ctx.lineWidth = isCur ? 2 : 1; ctx.stroke();
    t._top = top;
    // the town's name
    const inAny = lands.length > 0, [lx, ly] = scr(t.c, e);
    const a = isCur ? 1 : vis ? 0.85 : inAny && layers.lands ? 0.7 : 0.2;
    ctx.fillStyle = isCur ? (stop.b.fn === "T" ? "#2e1d07" : "#fff6e4") : `rgba(246,240,228,${a})`;
    ctx.font = `${isCur ? 800 : 700} ${Math.round(s * (isCur ? 0.24 : 0.19))}px Archivo`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(t.label + (isCur && stop.p.seventh != null ? (stop.p.q === "maj7" ? "maj7" : "7") : ""), lx, ly + 1);
  }
  // land borders and names
  if (layers.lands) for (const [k, L] of Object.entries(LANDS)) {
    const a = L.visited || k === "C" ? 0.75 : 0.25;
    ctx.strokeStyle = rgba(L.col, a); ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
    for (const [id, p, q] of L.border) { const e = elev(TID[id].c) + lift[id] * 0.32; ctx.beginPath(); ctx.moveTo(...scr(p, e)); ctx.lineTo(...scr(q, e)); ctx.stroke(); }
    ctx.setLineDash([]);
    const [nx, ny] = scr([L.center[0] + (k === "G" ? 0.9 : k === "F" ? -0.9 : 0), L.center[1] + 1.25], elev(L.center) + 0.1);
    ctx.font = `800 ${Math.round(s * 0.34)}px Archivo`; ctx.fillStyle = rgba(L.col, a); ctx.fillText(L.name, nx, ny);
  }
  // the three square roads
  const lineFam = (x, y) => mod(x + y, 3);
  if (layers.roads) for (let x0 = XR[0] - 8; x0 <= XR[1] + 8; x0++) {
    const pts = []; for (let i = 0; i < 14; i++) { const x = x0 + i, y = YR[1] - i; if (x >= XR[0] && x <= XR[1] + 1 && y >= YR[0] && y <= YR[1] + 1) pts.push([x, y]); }
    if (pts.length < 2) continue; ctx.strokeStyle = rgba(FAM[lineFam(...pts[0])], 0.45); ctx.lineWidth = 3; ctx.beginPath(); pts.forEach((p, i) => { const q = scr(p, elev(p)); i ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.stroke();
  }
  if (started && stop.road) { ctx.strokeStyle = rgba(FAM[stop.fam], 1); ctx.lineWidth = 6; ctx.shadowColor = rgba(FAM[stop.fam], 1); ctx.shadowBlur = 16; ctx.beginPath(); stop.road.forEach((p, i) => { const q = scr(p, elev(p) + 0.08); i ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.stroke(); ctx.shadowBlur = 0; }
  // the trail
  if (layers.trail && started && bar > 0) {
    ctx.strokeStyle = "rgba(255,246,228,.55)"; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.beginPath();
    ROUTE.slice(Math.max(0, bar - 12), bar + 1).forEach((r, i) => { const q = scr(r.c, elev(r.c) + 0.12); i ? ctx.lineTo(...q) : ctx.moveTo(...q); });
    const tq = scr(trav, elev(trav) + 0.12); ctx.lineTo(...tq); ctx.stroke();
  }
  // the notes at the corners: the chord's corners light up, the note sounding right now flashes
  const lit = new Map();
  if (started) { const corners = stop.road || TID[stop.tri].v.concat(stop.seventh ? [stop.seventh] : []); const snd = notesNow(pos); corners.forEach((v) => lit.set(String(v), snd.has(pc(...v)) ? 2 : 1)); }
  for (let x = XR[0]; x <= XR[1] + 1; x++) for (let y = YR[0]; y <= YR[1] + 1; y++) {
    const L = lit.get(String([x, y])); if (!layers.notes && !L) continue;
    const [sx, sy] = scr([x, y], elev([x, y]) + (L ? 0.2 : 0.02)); if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) continue;
    const r = s * (L ? 0.17 : 0.12);
    if (L === 2) { ctx.fillStyle = "rgba(255,246,228,.25)"; ctx.beginPath(); ctx.arc(sx, sy, r * 2.2, 0, 7); ctx.fill(); }
    ctx.fillStyle = L ? "#fff6e4" : "#0e0b26"; ctx.beginPath(); ctx.arc(sx, sy, r, 0, 7); ctx.fill();
    ctx.strokeStyle = L ? "#fff6e4" : "rgba(246,240,228,.25)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = L ? "#17132f" : "rgba(246,240,228,.6)"; ctx.font = `700 ${Math.round(s * (L ? 0.15 : 0.12))}px Archivo`; ctx.fillText(PCN[pc(x, y)], sx, sy + 0.5);
  }
  // the traveller
  if (started) { const [tx, ty] = scr(trav, elev(trav) + 0.5); const gl = ctx.createRadialGradient(tx, ty, 0, tx, ty, 22); gl.addColorStop(0, "rgba(255,246,228,1)"); gl.addColorStop(0.3, "rgba(255,246,228,.5)"); gl.addColorStop(1, "rgba(255,246,228,0)"); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(tx, ty, 22, 0, 7); ctx.fill(); }
}

// ---------- the story, in plain words
const $ = (id) => document.getElementById(id);
const nm = (sym) => { const p = parse(sym); return (p.kind === "m" ? MIN[p.r] + "m" : p.kind === "dim" ? MIN[p.r] + "°7" : MAJ[p.r]) + (p.q === "7" ? "7" : p.q === "maj7" ? "maj7" : p.q === "m7" ? "7" : p.q === "7sus4" ? "7sus4" : ""); };
function story(i) {
  const r = ROUTE[i], b = r.b, prevB = BACH.bars[i - 1], next = BACH.bars[i + 1], name = nm(b.chord);
  const both = r.tri && LANDS.C.ids.has(r.tri) && LANDS.G.ids.has(r.tri);
  if (b.pivot) return `<b>${name}</b> is a border town: it belongs to both C and G. Bach walks through it into <b>G major</b>.`;
  if (prevB && prevB.key !== b.key) return `Back over the border into <b>C major</b>, home land.`;
  if (r.road) return `<b>${name}</b> isn't a town but a road: one of the three squares. Bach takes this shortcut to <b>${next ? nm(next.chord) : "home"}</b>.`;
  if (b.bar >= 24 && b.bar <= 31) return `<b>${name}</b>. The bass waits on G: the long wait at the edge of home.`;
  if (b.bar >= 32) return `<b>${name}</b>. Home, held: the bass stays on C while the last chords move above it.`;
  if (r.p.q === "7" && b.applied) return `<b>${name}</b>: home bends into tension that points at <b>${nm(next.chord)}</b>.`;
  if (b.fn === "D") return `<b>${name}</b>: tension, a step from ${b.key === "G" ? "G" : "home"}.${both ? " A town in both lands." : ""}`;
  if (b.fn === "T") return b.key === "G" ? `<b>${name}</b>: G feels like home for now.` : `<b>${name}</b>: home.`;
  return `<b>${name}</b>: a step away from ${b.key === "G" ? "G" : "home"}.${both ? " A town in both lands." : ""}`;
}
let shown = -1;
const PLAY = `<svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="currentColor"/></svg>`, PAUSE = `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>`;
function hud() {
  const started = S.started() || S.pos() > 0, i = S.bar(), b = BACH.bars[i];
  $("pp").innerHTML = S.playing() ? PAUSE : PLAY;
  if (!started) { $("where").innerHTML = `<span style="color:rgb(255,192,74)">Home: C major</span>`; $("story").innerHTML = "Keys are lands, chords are towns, and neighbors share a border. Press play and follow the journey."; return; }
  if (i === shown) return; shown = i;
  const L = LANDS[b.key]; $("where").innerHTML = `<span style="color:${rgba(L.col, 1)}">In ${L.name}</span>`;
  $("story").innerHTML = story(i); $("bl").textContent = `bar ${b.bar}`;
}
S.onChange(hud); S.onTick(() => { $("bf").style.width = (S.progress() * 100).toFixed(1) + "%"; });
$("pp").addEventListener("click", () => S.toggle());
$("bar").addEventListener("click", (e) => { const r = e.currentTarget.getBoundingClientRect(); S.seekBar(Math.floor(((e.clientX - r.left) / r.width) * 35)); });
document.querySelectorAll("#layers .chip").forEach((c) => c.addEventListener("click", () => { layers[c.dataset.l] = !layers[c.dataset.l]; c.classList.toggle("on", layers[c.dataset.l]); }));
// tap a town to hear it
const inTri = (p, [a, b, c]) => { const d = (p1, p2, p3) => (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]); const d1 = d(p, a, b), d2 = d(p, b, c), d3 = d(p, c, a); return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0)); };
cv.addEventListener("click", (e) => {
  const p = [e.clientX, e.clientY]; const hit = [...TRI].reverse().find((t) => t._top && inTri(p, t._top)); if (!hit) return;
  const iv = hit.mode === "M" ? [0, 4, 7] : [0, 3, 7]; S.chord(iv.map((x) => 55 + mod(hit.root - 7 + x, 12) + (x ? 0 : 0)).map((m, k, a) => (k && m <= a[k - 1] ? m + 12 : m)));
});
resize(); hud(); requestAnimationFrame(frame);
const q = new URLSearchParams(location.search); if (q.get("bar")) S.seekBar(+q.get("bar") - 1); if (q.get("roads")) { layers.roads = true; document.querySelector('[data-l="roads"]').classList.add("on"); }
