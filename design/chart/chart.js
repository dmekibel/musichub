// The music chart: one time axis, many analyses, the way a stock chart stacks price, moving averages and indicators.
//   Main chart  tension (how far from home each bar feels; an estimate) with overlays: phrase and section averages
//               (the reduction, as moving averages), form sections, the key change, cadences, named moves.
//   Panes       chords (symbols or Roman numerals), bass line, voices, motion (how far the notes move), squares and
//               key clarity (Fourier dials), the notes grid (chroma).
//   Timeframe   bar / phrase / section regroups everything. Drag across to read every value for one bar; tap to play from there.
import * as S from "../app/sound.js?v=20261011e";
import { BACH } from "../app/data.js?v=20261011e";
import { BWV846_NOTES } from "../../data/bwv846-notes.js?v=20261011e";

const B = BACH.bars, NB = 35;
const FN = { T: "#f2c14e", S: "#3aa6a0", D: "#e2546b" }, FNW = { T: "Home", S: "Away", D: "Tension" };
const INK = "#f6f1e7", SOFT = "rgba(246,241,231,.7)", FAINT = "rgba(246,241,231,.38)", HAIR = "rgba(246,241,231,.14)";
const PCN = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const short = (c) => c.split("/")[0].replace("dim7", "°7").replace("maj7", "△7").replace("7sus4", "sus").replace("#", "♯");

// ---------- the measures (all from the score and the checked analysis)
const BASE = { T: 0.1, S: 0.42, D: 0.7 };
const TENSION = B.map((b) => { let h = BASE[b.fn]; if (b.key === "G") h += b.fn === "T" ? 0.24 : 0.14; if (/dim7/.test(b.chord)) h += 0.12; if (/sus4/.test(b.chord)) h += 0.05; if (b.bar >= 24 && b.bar <= 31) h += (b.bar - 24) * 0.022; if (b.bar === 1) h = 0.06; if (b.bar === 35) h = 0.03; if (b.bar === 32) h = 0.24; return Math.min(0.98, h); });
const ma = (a, w) => a.map((_, i) => { const lo = Math.max(0, i - Math.floor(w / 2)), hi = Math.min(a.length, lo + w); return a.slice(lo, hi).reduce((s, v) => s + v, 0) / (hi - lo); });
const SECTIONS = BACH.sections.map((s) => [s.from - 1, s.to - 1, s.title]);
const secAvg = TENSION.map((_, i) => { const [a, z] = SECTIONS.find(([a, z]) => i >= a && i <= z); return TENSION.slice(a, z + 1).reduce((s, v) => s + v, 0) / (z - a + 1); });
const V5 = B.map((b) => [b.voicing[0], b.voicing[1], ...b.voicing.slice(-3)]);
const MOTION = V5.map((v, i) => (i ? v.reduce((s, m, k) => s + Math.abs(m - V5[i - 1][k]), 0) : 0));
const W12 = Array.from({ length: NB }, () => new Array(12).fill(0));
for (const [on, len, m] of BWV846_NOTES.notes) W12[Math.min(NB - 1, Math.floor(on / 16))][m % 12] += len;
const CAD = [[3, "cadence in C"], [10, "cadence in G"], [18, "cadence in C"], [34, "final cadence"]];
const MOVES = [[0, 3, "Round trip"], [4, 10, "New home"], [11, 14, "Squares"], [16, 18, "2-5-1"], [19, 20, "Lean"], [21, 22, "Squares"], [23, 30, "Long wait"], [31, 34, "Home, held"]];

// ---------- layout
let W = 400, grain = "1", cursor = null;
const ov = { phrase: true, section: false, form: true, keys: true, cadences: true, moves: false };
const panes = { chords: true, numerals: false, bass: true, voices: false, motion: true, squares: true, clarity: false, notes: false };
const L = 16, Rpad = 16, x = (i) => L + ((i + 0.5) / NB) * (W - L - Rpad), bw = () => (W - L - Rpad) / NB;
const groups = () => grain === "1" ? B.map((_, i) => [i, i]) : grain === "4" ? Array.from({ length: 9 }, (_, k) => [k * 4, Math.min(34, k * 4 + 3)]) : SECTIONS.map(([a, z]) => [a, z]);
const xg = ([a, z]) => [L + (a / NB) * (W - L - Rpad), L + ((z + 1) / NB) * (W - L - Rpad)];
const pathOf = (vals, y) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("");
const smoothPath = (vals, y) => { const p = vals.map((v, i) => [x(i), y(v)]); let d = `M${p[0][0]} ${p[0][1]}`; for (let i = 0; i < p.length - 1; i++) { const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2; d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`; } return d; };

function mainPane() {
  const H = 250, top = 36, bot = 26, y = (v) => H - bot - v * (H - top - bot);
  let s = `<svg width="${W}" height="${H}">`;
  if (ov.form) SECTIONS.forEach(([a, z, t], k) => { const [x1, x2] = xg([a, z]); s += `<rect x="${x1}" y="${top - 6}" width="${x2 - x1}" height="${H - top - bot + 6}" fill="${k % 2 ? "rgba(246,241,231,.035)" : "transparent"}"/><text x="${x1 + 3}" y="${H - 8}" font-size="10" font-weight="650" fill="${FAINT}">${t.length * 5 > x2 - x1 ? t.split(" ").slice(-1)[0] : t}</text>`; });
  if (ov.keys) { const [x1, x2] = xg([4, 10]); s += `<rect x="${x1}" y="${top - 6}" width="${x2 - x1}" height="5" rx="2" fill="${FN.D}" opacity=".8"/><text x="${(x1 + x2) / 2}" y="${top + 9}" font-size="10.5" font-weight="700" fill="${INK}" text-anchor="middle">key: G</text>`; }
  for (const v of [0, 0.5, 1]) s += `<line x1="${L}" x2="${W - Rpad}" y1="${y(v)}" y2="${y(v)}" stroke="${HAIR}"/>`;
  s += `<text x="${W - Rpad}" y="${y(0) - 4}" font-size="10" fill="${FAINT}" text-anchor="end">home</text>`;
  // bars as colored columns (like candles), then the tension line
  const gs = groups();
  gs.forEach((g) => { const [x1, x2] = xg(g), vals = TENSION.slice(g[0], g[1] + 1), v = vals.reduce((a, b) => a + b, 0) / vals.length, fns = B.slice(g[0], g[1] + 1).map((b) => b.fn), fn = ["D", "S", "T"].find((f) => fns.filter((q) => q === f).length >= fns.length / 3) || fns[0]; const hi = Math.max(...vals), lo = Math.min(...vals); s += `<line x1="${(x1 + x2) / 2}" x2="${(x1 + x2) / 2}" y1="${y(hi)}" y2="${y(Math.max(0, lo - 0.04))}" stroke="${FN[fn]}" stroke-width="1.2" opacity=".7"/><rect x="${x1 + 1}" y="${y(v) - 3}" width="${x2 - x1 - 2}" height="${Math.max(6, y(0) - y(v) + 3)}" rx="2" fill="${FN[fn]}" opacity="${grain === "1" ? 0.28 : 0.4}"/>`; });
  s += `<path d="${smoothPath(TENSION, y)}" fill="none" stroke="${INK}" stroke-width="2.2"/>`;
  if (ov.phrase) s += `<path d="${smoothPath(ma(TENSION, 4), y)}" fill="none" stroke="${FN.T}" stroke-width="1.6" stroke-dasharray="1 0"/>`;
  if (ov.section) s += `<path d="${pathOf(secAvg, y)}" fill="none" stroke="${FN.S}" stroke-width="1.6"/>`;
  if (ov.cadences) CAD.forEach(([i, t]) => { s += `<g><circle cx="${x(i)}" cy="${y(TENSION[i]) - 14}" r="7" fill="${INK}"/><text x="${x(i)}" y="${y(TENSION[i]) - 10.5}" font-size="9" font-weight="800" fill="#3a3e68" text-anchor="middle">C</text></g>`; });
  if (ov.moves) MOVES.forEach(([a, z, t], k) => { const [x1, x2] = xg([a, z]), yy = top + 8 + (k % 2) * 13; s += `<line x1="${x1 + 2}" x2="${x2 - 2}" y1="${yy}" y2="${yy}" stroke="${SOFT}"/><text x="${(x1 + x2) / 2}" y="${yy - 3}" font-size="9.5" font-weight="700" fill="${INK}" text-anchor="middle">${t}</text>`; });
  return { h: H, svg: s + `</svg>`, label: "Tension", sub: "how far from home · estimate", value: (i) => TENSION[i].toFixed(2) };
}
const PANES = {
  chords: () => { const H = 46; let s = `<svg width="${W}" height="${H}">`; groups().forEach((g) => { const [x1, x2] = xg(g), b = B[g[0]], w = x2 - x1; const t = short(b.chord); const fs = Math.min(13, (w / Math.max(2, t.length)) * 1.5); const lab = grain === "s" ? BACH.sections[groups().indexOf(g)].title : t; s += `<rect x="${x1 + 0.8}" y="22" width="${w - 1.6}" height="18" rx="3" fill="${FN[b.fn]}" opacity=".9"/>${fs >= 8.5 || grain === "s" ? `<text x="${(x1 + x2) / 2}" y="35" font-size="${grain === "s" ? 10.5 : fs.toFixed(1)}" font-weight="800" fill="#26283f" text-anchor="middle">${lab}</text>` : ""}`; }); return { h: H, svg: s + "</svg>", label: "Chords", sub: grain === "1" ? "lead sheet · Phrase view shows names" : "lead sheet", value: (i) => short(B[i].chord) }; },
  numerals: () => { const H = 40; let s = `<svg width="${W}" height="${H}">`; B.forEach((b, i) => { s += `<text x="${x(i)}" y="32" font-size="${Math.min(10, bw() * 0.62)}" font-weight="700" fill="${b.key === "G" ? FN.D : INK}" text-anchor="middle">${b.rn.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/g, "")}</text>`; }); return { h: H, svg: s + "</svg>", label: "Roman numerals", sub: "what each chord does (key G in rose)", value: (i) => `${B[i].rn} in ${B[i].key}` }; },
  bass: () => { const H = 76, lo = 34, hi = 50, y = (m) => 66 - ((m - lo) / (hi - lo)) * 40; let s = `<svg width="${W}" height="${H}">`; let d = ""; B.forEach((b, i) => { const m = b.voicing[0], [x1, x2] = [x(i) - bw() / 2, x(i) + bw() / 2]; d += `${i ? "L" : "M"}${x1} ${y(m)} L${x2} ${y(m)}`; }); s += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="2"/>`; const [p1, p2] = xg([23, 30]); s += `<rect x="${p1}" y="20" width="${p2 - p1}" height="50" fill="none" stroke="${FN.T}" stroke-dasharray="3 3" rx="4"/><text x="${(p1 + p2) / 2}" y="17" font-size="9.5" font-weight="700" fill="${FN.T}" text-anchor="middle">pedal on G</text>`; return { h: H, svg: s + "</svg>", label: "Bass line", sub: "", value: (i) => PCN[B[i].voicing[0] % 12] + (Math.floor(B[i].voicing[0] / 12) - 1) }; },
  voices: () => { const H = 96, y = (m) => 88 - ((m - 36) / 45) * 66; let s = `<svg width="${W}" height="${H}">`; for (let v = 0; v < 5; v++) s += `<path d="${pathOf(V5.map((q) => q[v]), y)}" fill="none" stroke="${v < 2 ? INK : SOFT}" stroke-width="${v < 2 ? 1.6 : 1.1}"/>`; return { h: H, svg: s + "</svg>", label: "Voices", sub: "five threads", value: (i) => V5[i].map((m) => PCN[m % 12]).join(" ") }; },
  motion: () => { const H = 64, mx = Math.max(...MOTION), y = (v) => 58 - (v / mx) * 34; let s = `<svg width="${W}" height="${H}">`; MOTION.forEach((m, i) => { s += `<rect x="${x(i) - bw() * 0.32}" y="${y(m)}" width="${bw() * 0.64}" height="${58 - y(m)}" rx="1.5" fill="${FN[B[i].fn]}" opacity=".85"/>`; }); return { h: H, svg: s + "</svg>", label: "Motion", sub: "half steps the notes move", value: (i) => MOTION[i] }; },
  squares: () => { const H = 64, y = (v) => 58 - v * 34; let s = `<svg width="${W}" height="${H}"><line x1="${L}" x2="${W - Rpad}" y1="${y(1)}" y2="${y(1)}" stroke="${FN.D}" stroke-dasharray="3 3" opacity=".8"/><text x="${W - Rpad}" y="${y(1) - 3}" font-size="9.5" fill="${FN.D}" text-anchor="end">perfect square</text>`; s += `<path d="${pathOf(B.map((b) => b.dials.squares), y)}" fill="none" stroke="${INK}" stroke-width="1.6"/>`; B.forEach((b, i) => { if (b.dials.squares > 0.99) s += `<circle cx="${x(i)}" cy="${y(1)}" r="3.5" fill="${FN.D}"/>`; }); return { h: H, svg: s + "</svg>", label: "Squares", sub: "Barry Harris's diminished shape", value: (i) => B[i].dials.squares.toFixed(2) }; },
  clarity: () => { const H = 64, y = (v) => 58 - v * 34; let s = `<svg width="${W}" height="${H}">`; s += `<path d="${pathOf(B.map((b) => b.dials.key), y)}" fill="none" stroke="${INK}" stroke-width="1.6"/>`; return { h: H, svg: s + "</svg>", label: "Key clarity", sub: "how much it sounds like one key", value: (i) => B[i].dials.key.toFixed(2) }; },
  notes: () => { const order = [5, 0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10], rh = 8, H = 30 + 12 * rh; let s = `<svg width="${W}" height="${H}">`; W12.forEach((w, i) => { const mx = Math.max(...w); order.forEach((p, r) => { if (!w[p]) return; s += `<rect x="${x(i) - bw() / 2 + 0.6}" y="${24 + r * rh}" width="${bw() - 1.2}" height="${rh - 1.4}" rx="1.5" fill="${FN[B[i].fn]}" opacity="${(0.25 + 0.75 * (w[p] / mx)).toFixed(2)}"/>`; }); }); order.forEach((p, r) => { if (r % 2 === 0) s += `<text x="${W - 4}" y="${24 + r * rh + 6.5}" font-size="8" fill="${FAINT}" text-anchor="end">${PCN[p]}</text>`; }); return { h: H, svg: s + "</svg>", label: "Notes", sub: "every note, every bar", value: (i) => W12[i].map((v, p) => (v ? PCN[p] : "")).filter(Boolean).join(" ") }; },
};
const NAMES = { chords: "Chords", numerals: "Roman numerals", bass: "Bass line", voices: "Voices", motion: "Motion", squares: "Squares", clarity: "Key clarity", notes: "Notes grid" };
const OVN = { phrase: "Phrase average", section: "Section average", form: "Form", keys: "Keys", cadences: "Cadences", moves: "Moves" };

// ---------- render
const $ = (id) => document.getElementById(id);
let built = [];
function render() {
  W = Math.min(innerWidth, 640);
  const list = [mainPane(), ...Object.keys(PANES).filter((k) => panes[k]).map((k) => PANES[k]())];
  built = list;
  $("chart").innerHTML = list.map((p, k) => `<div class="pane${k ? "" : " main"}"><span class="pl">${p.label}<span>${p.sub}</span></span><span class="pv" data-k="${k}"></span>${p.svg}</div>`).join("") + `<div class="phead" id="ph"></div><div class="vline" id="vl"></div><div class="touch" id="touch"></div>`;
  $("ov").innerHTML = Object.keys(ov).map((k) => `<button class="chip${ov[k] ? " on" : ""}" data-o="${k}">${OVN[k]}</button>`).join("");
  $("ad").innerHTML = Object.keys(panes).map((k) => `<button class="chip${panes[k] ? " on" : ""}" data-p="${k}">${NAMES[k]}</button>`).join("");
  const t = $("touch"); let down = null, moved = false;
  const idx = (e) => { const r = t.getBoundingClientRect(); return Math.max(0, Math.min(34, Math.floor(((e.clientX - r.left - L) / (r.width - L - Rpad)) * NB))); };
  t.addEventListener("pointerdown", (e) => { down = e.clientX; moved = false; cursor = idx(e); show(); });
  t.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" || down != null) { if (down != null && Math.abs(e.clientX - down) > 6) moved = true; cursor = idx(e); show(); } });
  t.addEventListener("pointerup", (e) => { if (!moved) { S.seekBar(idx(e)); if (!S.playing()) S.play(); } down = null; cursor = null; show(); });
  t.addEventListener("pointerleave", () => { down = null; cursor = null; show(); });
  show();
}
const PLAY = `<svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="currentColor"/></svg>`, PAUSE = `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>`;
function show() {
  const started = S.started() || S.pos() > 0, play = started ? S.bar() : 0, i = cursor ?? play, b = B[i];
  $("rb").textContent = `bar ${b.bar} of 35${cursor != null ? " · reading" : ""}`;
  const q = short(b.chord).match(/^([A-G]♯?b?m?)(.*)$/); $("rc").innerHTML = `${q[1].replace("♯", '<span style="font-size:.6em;vertical-align:.5em">♯</span>')}${q[2] ? `<sup>${q[2]}</sup>` : ""}`;
  const sec = BACH.sections.find((s) => b.bar >= s.from && b.bar <= s.to), mv = MOVES.find(([a, z]) => i >= a && i <= z);
  $("rm").innerHTML = `<span class="fnp" style="background:${FN[b.fn]}">${FNW[b.fn]}</span><b>${b.rn}</b> in ${b.key}<br>${sec.title}${mv && mv[2] !== sec.title ? ` · ${mv[2]}` : ""}`;
  document.querySelectorAll(".pv").forEach((e) => { e.textContent = built[+e.dataset.k].value(i); });
  const ph = $("ph"), vl = $("vl"), px = (S.progress() * (W - L - Rpad) + L);
  ph.style.left = `${started ? px : L}px`; vl.style.display = cursor != null ? "block" : "none"; if (cursor != null) vl.style.left = `${x(cursor)}px`;
  $("pp").innerHTML = S.playing() ? PAUSE : PLAY;
  $("dt").innerHTML = `<b>${started ? `Playing bar ${B[play].bar}` : "Tap the chart to play from any bar"}</b>Drag across to read every analysis at once`;
}
document.addEventListener("click", (e) => {
  const tfb = e.target.closest("#tf button"); if (tfb) { grain = tfb.dataset.g; document.querySelectorAll("#tf button").forEach((x2) => x2.classList.toggle("on", x2 === tfb)); render(); }
  const o = e.target.closest("[data-o]"); if (o) { ov[o.dataset.o] = !ov[o.dataset.o]; render(); }
  const p = e.target.closest("[data-p]"); if (p) { panes[p.dataset.p] = !panes[p.dataset.p]; render(); }
});
$("pp").addEventListener("click", () => S.toggle());
S.onChange(show); S.onTick(show);
addEventListener("resize", render);
render();
const qs = new URLSearchParams(location.search); if (qs.get("bar")) S.seekBar(+qs.get("bar") - 1); if (qs.get("all")) { Object.keys(panes).forEach((k) => (panes[k] = true)); ov.moves = true; render(); }
