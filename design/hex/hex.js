// The honeycomb: the Tonnetz turned inside out (the harmonic-table layout). Each note is a hexagon; a fifth is the
// neighbor to the right, a major third up-right, a minor third down-right. So every major or minor chord is a cluster of
// three touching hexagons, a diminished chord is four in a straight line (one of Barry Harris's three squares), and a key's
// notes form one bright band that slides one step when the music changes key. The camera follows the chord; when the chord
// changes, the notes that stay keep glowing and arrows show the notes that slide.
// Art directions for review: ?theme=paper | poster | soft | night
import * as S from "../app/sound.js?v=20261011e";
import { BACH } from "../app/data.js?v=20261011e";

const THEMES = {
  paper: { bg: "#f3eee4", ink: "#1f1b16", soft: "#6d655a", hair: "rgba(31,27,22,.12)", glass: "rgba(31,27,22,.05)", hex: "#e9e2d5", inKey: "#fbf8f2", out: "#e4ddcf", tIn: "#1f1b16", tOut: "#b3aa9b", stroke: "#d8cfbf", fnInk: "#1f1b16", playBg: "#1f1b16", playInk: "#f3eee4", font: "Fraunces", fam: ["#f4d9cf", "#dcd6ef", "#d3eadf"], arrow: "#1f1b16" },
  poster: { bg: "#ffffff", ink: "#111111", soft: "#666666", hair: "rgba(0,0,0,.12)", glass: "rgba(0,0,0,.04)", hex: "#ffffff", inKey: "#ffffff", out: "#f0f0f0", tIn: "#111", tOut: "#bbbbbb", stroke: "#111111", fnInk: "#111", playBg: "#111", playInk: "#fff", font: "Archivo", fam: ["#ffd9d2", "#d8dcff", "#d4f1e6"], arrow: "#111", strokeW: 0.045 },
  soft: { bg: "#f1eefa", ink: "#2b2550", soft: "#7a74a0", hair: "rgba(43,37,80,.1)", glass: "rgba(43,37,80,.05)", hex: "#e4dff4", inKey: "#ffffff", out: "#e2ddf2", tIn: "#2b2550", tOut: "#aaa3cc", stroke: "none", fnInk: "#2b2550", playBg: "#2b2550", playInk: "#fff", font: "Archivo", fam: ["#ffe1d6", "#e3dcff", "#d6f3e9"], arrow: "#2b2550", gap: 0.1, round: true },
  night: { bg: "#111014", ink: "#f2efe9", soft: "rgba(242,239,233,.6)", hair: "rgba(242,239,233,.12)", glass: "rgba(242,239,233,.06)", hex: "#1b1a20", inKey: "#26252d", out: "#17161b", tIn: "#f2efe9", tOut: "rgba(242,239,233,.28)", stroke: "none", fnInk: "#111014", playBg: "#f2efe9", playInk: "#111014", font: "Archivo", fam: ["#3a2a27", "#2c2a40", "#213530"], arrow: "#f2efe9", gap: 0.08 },
};
// MusicHub's own function colors (not Metaharmony's orange/green/purple): home = sun, away = sea, tension = rose
const FN = { T: "#f2c14e", S: "#3aa6a0", D: "#e2546b" };
const FNW = { T: "Home", S: "Away", D: "Tension" };
const th = THEMES[new URLSearchParams(location.search).get("theme")] || THEMES.soft;
const root = document.documentElement.style;
for (const [k, v] of Object.entries({ "--ink": th.ink, "--soft": th.soft, "--hair": th.hair, "--glass": th.glass })) root.setProperty(k, v);
document.body.style.background = th.bg; document.body.style.color = th.ink;
document.querySelector('meta[name="theme-color"]').content = th.bg;
if (th.font === "Fraunces") { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&display=swap"; document.head.appendChild(l); document.querySelector(".chord").style.fontFamily = "Fraunces"; document.querySelector(".chord").style.fontStretch = "100%"; document.querySelector(".chord").style.fontSize = "54px"; }

const PCN = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const mod = (a, n) => ((a % n) + n) % n;
const pc = (q, r) => mod(7 * q + 4 * r, 12);
const Q = [-7, 9], R = [-5, 5];
const px = (q, r) => [Math.sqrt(3) * (q + r / 2), -1.5 * r];

// ---------- the route (each bar's chord placed as a cluster near the last one, inside its key)
const ROOT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const SCALE = { C: [0, 2, 4, 5, 7, 9, 11], G: [7, 9, 11, 0, 2, 4, 6] };
function parse(sym) { const [main, bass] = sym.split("/"), acc = main[1] === "#" ? 1 : main[1] === "b" ? -1 : 0, r = mod(ROOT[main[0]] + acc, 12), q = main.slice(acc ? 2 : 1); const kind = q.startsWith("dim") ? "dim" : q === "m" || q === "m7" ? "m" : "M"; const iv = kind === "dim" ? [0, 3, 6, 9] : kind === "m" ? [0, 3, 7] : q === "7sus4" ? [0, 5, 7] : [0, 4, 7]; const sev = q === "7" || q === "m7" || q === "7sus4" ? 10 : q === "maj7" ? 11 : null; return { r, q, kind, bass, pcs: iv.map((x) => mod(r + x, 12)).concat(sev != null ? [mod(r + sev, 12)] : []) }; }
const dist = (a, b) => Math.hypot(...[0, 1].map((k) => px(...a)[k] - px(...b)[k]));
const HOMEC = [0.33, 0.33];
const ROUTE = []; let prev = HOMEC;
for (const b of BACH.bars) {
  const p = parse(b.chord); let cells;
  if (p.kind === "dim") {
    let best = null, bd = 1e9;
    for (let q = Q[0]; q <= Q[1] - 3; q++) for (let r = R[0] + 3; r <= R[1]; r++) { const c = [0, 1, 2, 3].map((i) => [q + i, r - i]); if (!c.every(([a, bb]) => p.pcs.includes(pc(a, bb)))) continue; const d = dist([q + 1.5, r - 1.5], prev); if (d < bd) { bd = d; best = c; } }
    cells = best;
  } else {
    // the triad: three mutually touching hexes; then add the seventh at the nearest hex
    const [a, b3, c5] = p.kind === "m" ? [p.r, mod(p.r + 3, 12), mod(p.r + 7, 12)] : [p.r, mod(p.r + (p.q === "7sus4" ? 5 : 4), 12), mod(p.r + 7, 12)];
    let best = null, bd = 1e9;
    for (let q = Q[0]; q <= Q[1]; q++) for (let r = R[0]; r <= R[1]; r++) {
      if (pc(q, r) !== a) continue;
      const tri = p.q === "7sus4" ? [[q, r], [q + 1, r], [q - 1, r]] : p.kind === "m" ? [[q, r], [q + 1, r - 1], [q + 1, r]] : [[q, r], [q, r + 1], [q + 1, r]];
      const inKey = tri.every(([x, y]) => SCALE[b.key].includes(pc(x, y))) ? 0 : 0.6;
      const cen = tri.reduce((s, [x, y]) => [s[0] + x / 3, s[1] + y / 3], [0, 0]), d = dist(cen, prev) + inKey;
      if (d < bd) { bd = d; best = tri; }
    }
    cells = best;
    if (p.pcs.length > 3) { const want = p.pcs[3]; const cen = cells.reduce((s, [x, y]) => [s[0] + x / 3, s[1] + y / 3], [0, 0]); let sv = null, sd = 1e9; for (let q = Q[0]; q <= Q[1]; q++) for (let r = R[0]; r <= R[1]; r++) if (pc(q, r) === want) { const d = dist([q, r], cen); if (d < sd) { sd = d; sv = [q, r]; } } cells = cells.concat([sv]); }
  }
  const cen = cells.reduce((s, [x, y]) => [s[0] + x / cells.length, s[1] + y / cells.length], [0, 0]);
  ROUTE.push({ b, p, cells, cen }); prev = cen;
}

// ---------- the SVG
const svg = document.getElementById("map"), NS = "http://www.w3.org/2000/svg";
const el = (t, a = {}, parent) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (parent) parent.appendChild(e); return e; };
const world = el("g", {}, svg), gHex = el("g", {}, world), gTrail = el("g", {}, world), gArrow = el("g", {}, world), gLab = el("g", {}, world);
const defs = el("defs", {}, svg); const mk = el("marker", { id: "ah", viewBox: "0 0 10 10", refX: "7", refY: "5", markerWidth: "4", markerHeight: "4", orient: "auto" }, defs); el("path", { d: "M0 0L10 5L0 10z", fill: th.arrow }, mk);
const gap = th.gap ?? 0.04, HEX = {};
const corner = (k, s) => { const a = (Math.PI / 180) * (60 * k - 30); return [s * Math.cos(a), s * Math.sin(a)]; };
for (let q = Q[0]; q <= Q[1]; q++) for (let r = R[0]; r <= R[1]; r++) {
  const [x, y] = px(q, r), g = el("g", { class: "hx", transform: `translate(${x.toFixed(3)} ${y.toFixed(3)})` }, gHex);
  const s = 1 - gap, pts = [0, 1, 2, 3, 4, 5].map((k) => corner(k, s).map((v) => v.toFixed(3)).join(",")).join(" ");
  const poly = el("polygon", { points: pts, fill: th.hex, stroke: th.stroke, "stroke-width": th.strokeW ?? 0.02, "stroke-linejoin": "round" }, g);
  if (th.round) poly.setAttribute("style", "stroke: " + th.hex + "; stroke-width: .16px; stroke-linejoin: round");
  const t = el("text", { y: "0.02" }, g); t.textContent = PCN[pc(q, r)];
  HEX[`${q},${r}`] = { g, poly, t, q, r, pc: pc(q, r) };
  g.addEventListener("click", () => S.chord([60 + pc(q, r)], 1.2));
}

let layers = { key: true, squares: false, trail: true }, zoomV = 18, cam = null;
function paint(i) {
  const started = S.started() || S.pos() > 0, st = ROUTE[i], b = st.b, inKey = new Set(SCALE[b.key]);
  const cur = new Set(started ? st.cells.map(String) : []);
  for (const h of Object.values(HEX)) {
    const fam = th.fam[mod(h.q + h.r, 3)], isCur = cur.has(`${h.q},${h.r}`);
    let fill = layers.squares ? fam : layers.key ? (inKey.has(h.pc) ? th.inKey : th.out) : th.hex;
    if (isCur) fill = FN[b.fn];
    h.poly.setAttribute("fill", fill); if (th.round) h.poly.style.stroke = fill;
    h.t.setAttribute("fill", isCur ? th.fnInk : layers.key && !inKey.has(h.pc) ? th.tOut : th.tIn);
    h.t.setAttribute("font-weight", isCur ? 800 : 700);
  }
  // trail: the last chords as outlines and a thin path
  gTrail.innerHTML = "";
  if (layers.trail && started) {
    const seen = ROUTE.slice(Math.max(0, i - 4), i);
    seen.forEach((r, k) => { const a = 0.18 + 0.16 * k; r.cells.forEach(([q, rr]) => { const [x, y] = px(q, rr); el("polygon", { points: [0, 1, 2, 3, 4, 5].map((n) => corner(n, 0.86).join(",")).join(" "), transform: `translate(${x} ${y})`, fill: "none", stroke: FN[r.b.fn], "stroke-width": 0.09, opacity: a }, gTrail); }); });
    const path = ROUTE.slice(Math.max(0, i - 4), i + 1).map((r) => px(...r.cen));
    el("polyline", { points: path.map((p) => p.join(",")).join(" "), fill: "none", stroke: th.ink, "stroke-width": 0.04, "stroke-dasharray": "0.08 0.12", opacity: 0.45 }, gTrail);
  }
  // voice leading: notes that stay keep glowing; arrows show the notes that slide
  gArrow.innerHTML = ""; gLab.innerHTML = "";
  let caption = "";
  if (started) {
    const pv = i > 0 ? ROUTE[i - 1] : null;
    if (pv && pv.b.chord !== b.chord) {
      const oldP = pv.p.pcs, newP = st.p.pcs, stay = newP.filter((x) => oldP.includes(x)), gone = oldP.filter((x) => !newP.includes(x)), come = newP.filter((x) => !oldP.includes(x));
      const pairs = []; const pool = [...come];
      for (const g of gone) { if (!pool.length) break; let bi = 0, bd = 99; pool.forEach((c, k) => { const d = Math.min(mod(c - g, 12), mod(g - c, 12)); if (d < bd) { bd = d; bi = k; } }); pairs.push([g, pool[bi], bd]); pool.splice(bi, 1); }
      const cellOf = (r, p) => r.cells.find(([q, rr]) => pc(q, rr) === p);
      for (const [g, c] of pairs) { const A = cellOf(pv, g), Bc = cellOf(st, c); if (!A || !Bc) continue; const [x1, y1] = px(...A), [x2, y2] = px(...Bc), dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1; el("line", { x1: x1 + (dx / L) * 0.42, y1: y1 + (dy / L) * 0.42, x2: x2 - (dx / L) * 0.5, y2: y2 - (dy / L) * 0.5, stroke: th.arrow, "stroke-width": 0.07, "marker-end": "url(#ah)", "stroke-linecap": "round" }, gArrow); }
      const word = (d, g, c) => (d === 0 ? "" : `${PCN[g]} ${mod(c - g, 12) <= 6 ? "up" : "down"} to ${PCN[c]}`);
      const moves = pairs.filter(([, , d]) => d > 0).map(([g, c, d]) => word(d, g, c)), added = pool.map((c) => `adds ${PCN[c]}`);
      caption = `${stay.length ? `<b>${stay.map((x) => PCN[x]).join(", ")} ${stay.length === 1 ? "stays" : "stay"}</b>` : "<b>nothing stays</b>"}${moves.length ? `; ${moves.join(", ")}` : ""}${added.length ? `; ${added.join(", ")}` : ""}.`;
      if (st.p.kind === "dim") caption = `<b>One of the three squares:</b> four notes evenly spaced, in a straight line on the map. ` + caption;
    } else caption = i === 0 ? "<b>Home.</b> Three notes that touch: C, E and G." : "The same chord again.";
    // the chord's name on its cluster
    const [cx, cy] = px(...st.cen); el("circle", { cx, cy, r: 0.36, fill: th.bg, opacity: 0.85 }, gLab); const tl = el("text", { x: cx, y: cy + 0.02, class: "lab", fill: th.ink }, gLab); tl.textContent = nameOf(b.chord);
  } else caption = "Every note is a hexagon. Neighbors a fifth apart sit side by side, so chords are little clusters. Press play.";
  document.getElementById("move").innerHTML = caption;
  document.getElementById("chord").innerHTML = started ? chordHTML(b.chord) : "Ready";
  const f = document.getElementById("fn"); f.textContent = FNW[b.fn]; f.style.background = FN[b.fn]; f.style.display = started ? "" : "none";
  const k = document.getElementById("key"); k.textContent = `key: ${b.key} major`;
  document.getElementById("bl").textContent = `bar ${b.bar}`;
  document.querySelectorAll("#strip i").forEach((e, n) => { e.classList.toggle("on", n === i && started); e.classList.toggle("past", n < i); });
}
const nameOf = (c) => { const p = parse(c); return (p.kind === "dim" ? PCN[p.r] + "°7" : PCN[p.r] + (p.kind === "m" ? "m" : "") + (p.q === "7" || p.q === "m7" ? "7" : p.q === "maj7" ? "△7" : p.q === "7sus4" ? "sus" : "")); };
const chordHTML = (c) => { const p = parse(c), q = p.kind === "dim" ? "°7" : p.q === "7sus4" ? "7sus4" : p.q.replace(/^m(?!aj)/, "") ; return `${PCN[p.r]}${p.kind === "m" ? "m" : ""}${q && p.kind !== "m" ? `<sup>${q}</sup>` : p.q === "m7" ? "<sup>7</sup>" : ""}${p.bass ? `<small>over ${p.bass.replace("#", "♯").replace(/^([A-G])b$/, "$1♭")}</small>` : ""}`; };

// ---------- camera: follows the chord when zoomed in, shows the whole map zoomed out
function frame() {
  requestAnimationFrame(frame);
  const W = svg.clientWidth, H = svg.clientHeight; svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const started = S.started() || S.pos() > 0, st = ROUTE[S.bar()], t = zoomV / 100;
  const focus = started ? px(...st.cen) : px(...HOMEC), home = px(...HOMEC);
  const target = [focus[0] + (home[0] - focus[0]) * t, focus[1] + (home[1] - focus[1]) * t], scale = Math.min(W, H * 1.2) / (5.2 + t * 18);
  if (!cam) cam = [...target, scale];
  cam = [cam[0] + (target[0] - cam[0]) * 0.07, cam[1] + (target[1] - cam[1]) * 0.07, cam[2] + (scale - cam[2]) * 0.12];
  world.setAttribute("transform", `translate(${W / 2} ${H / 2}) scale(${cam[2]}) translate(${-cam[0]} ${-cam[1]})`);
}

// ---------- controls
const $ = (id) => document.getElementById(id);
$("strip").innerHTML = BACH.bars.map((b) => `<i style="--c:${FN[b.fn]}"></i>`).join("");
$("strip").addEventListener("click", (e) => { const r = e.currentTarget.getBoundingClientRect(); S.seekBar(Math.floor(((e.clientX - r.left) / r.width) * 35)); });
const zp = (e) => e.style.setProperty("--p", e.value + "%");
$("zoom").addEventListener("input", (e) => { zoomV = +e.target.value; zp(e.target); }); zp($("zoom"));
document.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => { layers[c.dataset.l] = !layers[c.dataset.l]; c.classList.toggle("on", layers[c.dataset.l]); shown = -1; }));
const PLAY = `<svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="currentColor"/></svg>`, PAUSE = `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>`;
const pp = $("pp"); pp.style.background = th.playBg; pp.style.color = th.playInk; pp.addEventListener("click", () => S.toggle());
let shown = -1;
function sync() { const i = S.bar(), key = `${i}|${S.started()}|${S.pos() > 0}`; if (key !== shown) { shown = key; paint(i); } pp.innerHTML = S.playing() ? PAUSE : PLAY; }
S.onChange(sync); setInterval(sync, 250); sync();
requestAnimationFrame(frame);
const q = new URLSearchParams(location.search); if (q.get("bar")) S.seekBar(+q.get("bar") - 1); if (q.get("zoom")) { $("zoom").value = q.get("zoom"); $("zoom").dispatchEvent(new Event("input")); } if (q.get("squares")) document.querySelector('[data-l="squares"]').click();
