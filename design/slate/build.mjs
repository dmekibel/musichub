// Builds design/slate/index.html: ten ways to see Bach's Prelude in C through music theory, every drawing computed from
// the real score and the checked analysis. Run: node design/slate/build.mjs
import { writeFileSync } from "node:fs";
import { BACH } from "../app/data.js?v=20261011e";
import { hc } from "../app/ui.js?v=20261011e";
import { BWV846_NOTES } from "../../data/bwv846-notes.js?v=20261011e";

const NB = 35, B = BACH.bars;
const FN = { T: "#ffc04a", S: "#2fd4a4", D: "#8a7cff" };
const FAM = ["#ff9f7a", "#a99bff", "#6fdcc0"];            // the three squares (our own tints, not Metaharmony's primaries)
const FAM_NAME = ["C square (C E♭ F♯ A)", "C♯ square (C♯ E G B♭)", "D square (D F A♭ B)"];
const PCN = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const fi = (p) => (p * 7) % 12;
const W = Array.from({ length: NB }, () => new Array(12).fill(0));
for (const [on, len, m] of BWV846_NOTES.notes) W[Math.min(NB - 1, Math.floor(on / 16))][m % 12] += len;
const short = (c) => c.split("/")[0].replace("dim7", "°7").replace("maj7", "△").replace("7sus4", "sus").replace("#", "♯");
const f = (n) => n.toFixed(1);
const T = (x, y, s, cls = "", extra = "") => `<text x="${f(x)}" y="${f(y)}" class="${cls}" ${extra}>${s}</text>`;

// ---------- 1. the three-families compass (Barry Harris, Lendvai, Metaharmony's foundation)
function compass() {
  const C = [[200, 26], [372, 318], [28, 318]];
  const pt = (w) => { const fam = [0, 0, 0]; w.forEach((x, p) => (fam[p % 3] += x)); const s = fam[0] + fam[1] + fam[2]; return [0, 1].map((k) => (fam[0] * C[0][k] + fam[1] * C[1][k] + fam[2] * C[2][k]) / s); };
  const P = W.map(pt);
  let s = `<svg viewBox="0 0 400 350"><path d="M${C[0]}L${C[1]}L${C[2]}Z" fill="rgba(246,240,228,.03)" stroke="rgba(246,240,228,.18)"/>`;
  const mid = [[(C[0][0] + C[1][0]) / 2, (C[0][1] + C[1][1]) / 2], [(C[1][0] + C[2][0]) / 2, (C[1][1] + C[2][1]) / 2], [(C[0][0] + C[2][0]) / 2, (C[0][1] + C[2][1]) / 2]];
  s += `<path d="M200 214L${mid[0]}M200 214L${mid[1]}M200 214L${mid[2]}" stroke="rgba(246,240,228,.07)"/>`;
  C.forEach(([x, y], k) => { s += `<circle cx="${x}" cy="${y}" r="7" fill="${FAM[k]}"/>`; s += T(x + (k === 0 ? 0 : k === 1 ? -6 : 6), y + (k === 0 ? -12 : 22), FAM_NAME[k].split(" (")[0], "lab", `text-anchor="${k === 0 ? "middle" : k === 1 ? "end" : "start"}" fill="${FAM[k]}"`); });
  s += `<polyline points="${P.map((p) => p.map(f).join(",")).join(" ")}" fill="none" stroke="rgba(246,240,228,.12)" stroke-width="1"/>`;
  const cornerBars = [[], [], []]; P.forEach(([x, y], i) => { if (/dim/.test(B[i].chord)) cornerBars[C.findIndex(([cx2, cy2]) => Math.hypot(cx2 - x, cy2 - y) < 3)]?.push(`${i + 1}`); });
  cornerBars.forEach((bars, k) => { if (!bars.length) return; const [x, y] = C[k]; s += `<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="${FN.D}" stroke-width="2"/>` + T(x + (k === 0 ? 22 : k === 1 ? -22 : 22), y + (k === 0 ? 5 : -14), `${bars.length > 1 ? "bars" : "bar"} ${bars.join(", ")}`, "sm", `text-anchor="${k === 1 ? "end" : "start"}" fill="#f6f0e4"`); });
  P.forEach(([x, y], i) => { const dim = /dim/.test(B[i].chord); s += `<circle cx="${f(x)}" cy="${f(y)}" r="${dim ? 6 : 4}" fill="${FN[B[i].fn]}" stroke="#0c0a20" stroke-width="1.5"/>`; });
  s += T(200, 236, "chords that mix families sit inside", "sm", `text-anchor="middle" fill="rgba(246,240,228,.4)"`);
  return s + `</svg>`;
}

// ---------- 2. keyscape (Craig Sapp): the best-fitting key for every stretch of the piece
function keyscape() {
  const MAJ = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88], MIN = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
  const corr = (a, b) => { const ma = a.reduce((x, y) => x + y) / 12, mb = b.reduce((x, y) => x + y) / 12; let n = 0, da = 0, db = 0; for (let i = 0; i < 12; i++) { n += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; } return n / Math.sqrt(da * db || 1); };
  const best = (w) => { let bk = null, bv = -2; for (let t = 0; t < 12; t++) for (const [prof, mode] of [[MAJ, "M"], [MIN, "m"]]) { const r = corr(w, prof.map((_, i) => prof[(i - t + 12) % 12])); if (r > bv) { bv = r; bk = [t, mode]; } } return bk; };
  const color = ([t, mode]) => { const rel = mode === "m" ? (t + 3) % 12 : t, s0 = fi(rel), s = s0 > 6 ? s0 - 12 : s0; const h = s === 0 ? 0 : s < 0 ? (s === -1 ? 0.4 : 0.3) : s === 1 ? 1 : 0.8; const c = hc(h).field; return mode === "m" ? `color-mix(in oklab, ${c} 55%, #0c0a20)` : c; };
  const cw = 372 / NB, rh = 6.4, used = new Map();
  let s = `<svg viewBox="0 0 400 270">`;
  for (let L = 1; L <= NB; L++) for (let a = 0; a + L <= NB; a++) {
    const w = new Array(12).fill(0); for (let i = a; i < a + L; i++) W[i].forEach((x, p) => (w[p] += x));
    const k = best(w), name = (k[1] === "m" ? PCN[k[0]].toLowerCase() : PCN[k[0]]) + (k[1] === "m" ? " minor" : " major"); used.set(name, color(k));
    s += `<rect x="${f(14 + a * cw + (L - 1) * cw / 2)}" y="${f(240 - L * rh)}" width="${f(cw + 0.3)}" height="${f(rh + 0.3)}" fill="${color(k)}"/>`;
  }
  s += T(14, 258, "bar 1", "sm") + T(386, 258, "bar 35", "sm", `text-anchor="end"`) + T(200, 12, "whole piece", "sm", `text-anchor="middle"`);
  return { svg: s + `</svg>`, legend: [...used.entries()].map(([n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join("") };
}

// ---------- 3. the reduction (Schenker): 35 chords → 5 regions → home, five, home
function reduction() {
  const cw = 372 / NB, x = (bar) => 14 + (bar - 1) * cw;
  let s = `<svg viewBox="0 0 400 250">`;
  B.forEach((b, i) => { s += `<rect x="${f(x(b.bar) + 0.6)}" y="196" width="${f(cw - 1.2)}" height="30" rx="2" fill="${FN[b.fn]}" opacity=".85"/>`; });
  s += T(14, 244, "35 chords, one per bar", "sm");
  const mid = [[1, 4, "I", "home", "T"], [5, 11, "→ V", "a trip to G", "D"], [12, 23, "IV · ii", "back, through squares", "S"], [24, 31, "V", "the long wait", "D"], [32, 35, "I", "home", "T"]];
  mid.forEach(([a, z, rn, w, fn]) => { s += `<rect x="${f(x(a) + 1)}" y="112" width="${f(x(z + 1) - x(a) - 2)}" height="46" rx="6" fill="${FN[fn]}" opacity=".22" stroke="${FN[fn]}" stroke-opacity=".6"/>` + T(x(a) + 6, 132, rn, "rn") + T(x(a) + 6, 150, w, "sm"); s += `<path d="M${f((x(a) + x(z + 1)) / 2)} 158V196" stroke="rgba(246,240,228,.15)" stroke-dasharray="2 3"/>`; });
  const bg = [[1, 23, "I", "T", "E"], [24, 31, "V", "D", "D"], [32, 35, "I", "T", "C"]];
  bg.forEach(([a, z, rn, fn, top]) => { s += `<rect x="${f(x(a) + 1)}" y="40" width="${f(x(z + 1) - x(a) - 2)}" height="40" rx="8" fill="${FN[fn]}" opacity=".35"/>` + T(x(a) + 8, 66, rn, "rn big"); s += `<circle cx="${f((x(a) + x(z + 1)) / 2 + 14)}" cy="22" r="11" fill="#f6f0e4"/>` + T((x(a) + x(z + 1)) / 2 + 14, 26.5, top, "note", `text-anchor="middle"`); s += `<path d="M${f((x(a) + x(z + 1)) / 2)} 80V112" stroke="rgba(246,240,228,.15)" stroke-dasharray="2 3"/>`; });
  s += T(14, 18, "top line falls", "sm");
  return s + `</svg>`;
}

// ---------- 4. voice threads: the five notes of each bar as five threads
const V5 = B.map((b) => [b.voicing[0], b.voicing[1], ...b.voicing.slice(-3)]); // bars 33–34 add a sixth note: keep both bass notes and the top three
function voices() {
  const x = (i) => 18 + (i / (NB - 1)) * 364, y = (m) => 206 - ((m - 36) / 45) * 190;
  let s = `<svg viewBox="0 0 400 220">`;
  for (const m of [36, 48, 60, 72]) s += `<line x1="10" x2="390" y1="${f(y(m))}" y2="${f(y(m))}" stroke="rgba(246,240,228,.07)"/>` + T(390, y(m) - 3, `C${m / 12 - 1}`, "sm", `text-anchor="end"`);
  for (let v = 0; v < 5; v++) {
    let d = ""; B.forEach((b, i) => { d += `${i ? "L" : "M"}${f(x(i))} ${f(y(V5[i][v]))}`; });
    s += `<path d="${d}" fill="none" stroke="rgba(246,240,228,${v < 2 ? 0.5 : 0.3})" stroke-width="${v < 2 ? 1.8 : 1.2}"/>`;
    B.forEach((b, i) => { const moved = i && V5[i][v] !== V5[i - 1][v]; s += `<circle cx="${f(x(i))}" cy="${f(y(V5[i][v]))}" r="${moved ? 3 : 1.8}" fill="${moved ? FN[b.fn] : "rgba(246,240,228,.5)"}"/>`; });
  }
  const moves = V5.map((v, i) => (i ? v.reduce((s, m, k) => s + Math.abs(m - V5[i - 1][k]), 0) : 0));
  return { svg: s + `</svg>`, avg: (moves.slice(1).reduce((a, c) => a + c) / 34).toFixed(1), held: (V5.slice(1).reduce((s, v, i) => s + v.filter((m, k) => m === V5[i][k]).length, 0) / (34 * 5) * 100).toFixed(0) };
}

// ---------- 5. the Tonnetz path (Euler, Riemann; Tymoczko): triads as triangles, common tones as shared edges
function tonnetz() {
  const dx = 46, dy = 40, ox = 112, oy = 150, P = (x, y) => [ox + x * dx + y * dx / 2, oy - y * dy], pc = (x, y) => (((7 * x + 4 * y) % 12) + 12) % 12;
  const X = [-3, 6], Y = [-2, 2]; let s = `<svg viewBox="0 0 400 300">`;
  const inView = (x, y) => { const [px, py] = P(x, y); return px > 12 && px < 388 && py > 20 && py < 285; };
  const tri = (x, y, mode) => (mode === "M" ? [[x, y], [x + 1, y], [x, y + 1]] : [[x, y], [x + 1, y - 1], [x + 1, y]]);
  for (let x = X[0]; x <= X[1]; x++) for (let y = Y[0]; y <= Y[1]; y++) for (const mode of ["M", "m"]) { const t = tri(x, y, mode); if (!t.every(([a, b]) => inView(a, b))) continue; s += `<path d="M${t.map(([a, b]) => P(a, b).map(f).join(" ")).join("L")}Z" fill="none" stroke="rgba(246,240,228,.07)"/>`; }
  const triad = (c) => { const m = /^([A-G][#b]?)(.*)$/.exec(c.split("/")[0]), r = ({ C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 })[m[1][0]] + (m[1][1] === "#" ? 1 : 0); if (/dim/.test(m[2])) return null; return [r % 12, /^m(?!aj)/.test(m[2]) ? "m" : "M"]; };
  let prev = [P(0, 0)[0] + 15, P(0, 0)[1] - 13], path = [], lit = new Map();
  B.forEach((b, i) => {
    const t = triad(b.chord); if (!t) { path.push(null); return; }
    let best = null, bd = 1e9;
    for (let x = X[0]; x <= X[1]; x++) for (let y = Y[0]; y <= Y[1]; y++) { if (pc(x, y) !== t[0]) continue; const tt = tri(x, y, t[1]); if (!tt.every(([a, c]) => inView(a, c))) continue; const cen = tt.map(([a, c]) => P(a, c)).reduce((s2, p) => [s2[0] + p[0] / 3, s2[1] + p[1] / 3], [0, 0]), d = Math.hypot(cen[0] - prev[0], cen[1] - prev[1]); if (d < bd) { bd = d; best = { tt, cen }; } }
    if (!best) { path.push(null); return; }
    prev = best.cen; path.push(best.cen); const key = best.tt.map(String).join(); lit.set(key, { tt: best.tt, fn: b.fn, n: (lit.get(key)?.n || 0) + 1 });
  });
  for (const { tt, fn, n } of lit.values()) s += `<path d="M${tt.map(([a, b]) => P(a, b).map(f).join(" ")).join("L")}Z" fill="${FN[fn]}" fill-opacity="${Math.min(0.75, 0.25 + n * 0.1)}" stroke="${FN[fn]}" stroke-opacity=".8"/>`;
  let d = "", pen = false; path.forEach((p) => { if (!p) { pen = false; return; } d += `${pen ? "L" : "M"}${f(p[0])} ${f(p[1])}`; pen = true; });
  s += `<path d="${d}" fill="none" stroke="#f6f0e4" stroke-width="1.6" stroke-opacity=".75" stroke-linejoin="round"/>`;
  for (let x = X[0]; x <= X[1]; x++) for (let y = Y[0]; y <= Y[1]; y++) { if (!inView(x, y)) continue; const [px, py] = P(x, y); s += `<circle cx="${f(px)}" cy="${f(py)}" r="11" fill="#0c0a20" stroke="rgba(246,240,228,.25)"/>` + T(px, py + 4, PCN[pc(x, y)], "sm", `text-anchor="middle" fill="rgba(246,240,228,.75)"`); }
  return s + `</svg>`;
}

// ---------- 6. the fifths orbit: where the music's centre of gravity sits on the circle of fifths, bar by bar
function orbit() {
  const cx = 200, cy = 158, R = 128; let s = `<svg viewBox="0 0 400 316"><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="rgba(246,240,228,.15)"/><circle cx="${cx}" cy="${cy}" r="${R / 2}" fill="none" stroke="rgba(246,240,228,.06)"/>`;
  for (let p = 0; p < 12; p++) { const a = (fi(p) / 12) * Math.PI * 2; s += T(cx + (R + 16) * Math.sin(a), cy - (R + 16) * Math.cos(a) + 4, PCN[p], "sm", `text-anchor="middle" fill="rgba(246,240,228,${[0, 7, 5, 2, 9, 4, 11].includes(p) ? 0.8 : 0.3})"`); }
  const pt = (w) => { let x = 0, y = 0, t = 0; w.forEach((v, p) => { const a = (fi(p) / 12) * Math.PI * 2; x += v * Math.sin(a); y -= v * Math.cos(a); t += v; }); return [cx + (x / t) * R * 1.35, cy + (y / t) * R * 1.35]; };
  const P = W.map(pt); s += `<polyline points="${P.map((p) => p.map(f).join(",")).join(" ")}" fill="none" stroke="rgba(246,240,228,.3)"/>`;
  P.forEach(([x, y], i) => { s += `<circle cx="${f(x)}" cy="${f(y)}" r="4" fill="${FN[B[i].fn]}" stroke="#0c0a20" stroke-width="1.2"/>`; });
  const sec = (a, z) => { const w = new Array(12).fill(0); for (let i = a - 1; i < z; i++) W[i].forEach((v, p) => (w[p] += v)); return pt(w); };
  BACH.sections.forEach((S, k) => { const [x, y] = sec(S.from, S.to); s += `<circle cx="${f(x)}" cy="${f(y)}" r="9" fill="#0c0a20" stroke="#f6f0e4" stroke-width="1.5"/>` + T(x, y + 4, k + 1, "sm", `text-anchor="middle" fill="#f6f0e4"`); });
  return s + `</svg><div class="legend">${BACH.sections.map((S, k) => `<span>${k + 1} · ${S.title}</span>`).join("")}</div>`;
}

// ---------- 7. family barcode: each bar split by how much of each square it uses
function barcode() {
  const cw = 372 / NB; let s = `<svg viewBox="0 0 400 150">`;
  W.forEach((w, i) => { const fam = [0, 0, 0]; w.forEach((v, p) => (fam[p % 3] += v)); const t = fam.reduce((a, b) => a + b); let y = 120; [0, 1, 2].forEach((k) => { const h = (fam[k] / t) * 104; s += `<rect x="${f(14 + i * cw + 0.6)}" y="${f(y - h)}" width="${f(cw - 1.2)}" height="${f(h)}" fill="${FAM[k]}" opacity="${/dim/.test(B[i].chord) ? 1 : 0.62}"/>`; y -= h; }); });
  let alt = 0; B.forEach((b, i) => { if (/dim/.test(b.chord)) s += T(14 + i * cw + cw / 2, 134 + (alt++ % 2) * 12, i + 1, "sm", `text-anchor="middle" fill="#f6f0e4"`); });
  return s + `</svg>`;
}

// ---------- 8. chroma grid: every pitch class, every bar, with the bass marked
function chroma() {
  const cw = 360 / NB, rh = 15, order = [...Array(12).keys()].sort((a, b) => fi(a) - fi(b));
  let s = `<svg viewBox="0 0 400 ${12 * rh + 30}">`;
  order.forEach((p, r) => { s += T(24, 12 + r * rh + 10, PCN[p], "sm", `text-anchor="end"`); });
  W.forEach((w, i) => { const mx = Math.max(...w), bass = B[i].voicing[0] % 12; order.forEach((p, r) => { if (!w[p]) return; s += `<rect x="${f(30 + i * cw + 0.5)}" y="${12 + r * rh + 1}" width="${f(cw - 1)}" height="${rh - 2}" rx="2" fill="${FN[B[i].fn]}" opacity="${f(0.2 + 0.8 * (w[p] / mx))}" ${p === bass ? `stroke="#f6f0e4" stroke-width="1.6"` : ""}/>`; }); });
  s += `<rect x="${f(30 + 23 * cw)}" y="6" width="${f(8 * cw)}" height="${12 * rh + 8}" fill="none" stroke="rgba(246,240,228,.35)" stroke-dasharray="3 3" rx="4"/>` + T(30 + 27 * cw, 12 * rh + 28, "bass holds G", "sm", `text-anchor="middle"`);
  return s + `</svg>`;
}

// ---------- 9. the Five Dials as streams (Fourier: Amiot, Yust, wavescapes)
function dials() {
  const keys = [["key", "Key: how much it sounds like one key"], ["squares", "Squares: Barry Harris's diminished shape"], ["triangles", "Triangles: augmented, Coltrane"], ["hexagons", "Hexagons: whole tone, Debussy"], ["cluster", "Cluster: notes bunched together"]];
  let s = `<svg viewBox="0 0 400 ${keys.length * 52}">`;
  keys.forEach(([k, lab], r) => { const y0 = r * 52 + 44, x = (i) => 14 + (i / 34) * 372; s += `<line x1="14" x2="386" y1="${y0}" y2="${y0}" stroke="rgba(246,240,228,.1)"/>` + T(14, y0 - 32, lab, "sm"); let d = ""; B.forEach((b, i) => { d += `${i ? "L" : "M"}${f(x(i))} ${f(y0 - b.dials[k] * 26)}`; }); s += `<path d="${d} L386 ${y0} L14 ${y0}Z" fill="rgba(246,240,228,.08)"/><path d="${d}" fill="none" stroke="#f6f0e4" stroke-opacity=".75" stroke-width="1.4"/>`; if (k === "squares") B.forEach((b, i) => { if (b.dials.squares > 0.99) s += `<circle cx="${f(x(i))}" cy="${f(y0 - 26)}" r="3.5" fill="${FN.D}"/>`; }); });
  return s + `</svg>`;
}

// ---------- 10. the Journey (the current mockup), for comparison
function journey() {
  const base = { T: 0.1, S: 0.42, D: 0.7 };
  const h = B.map((b) => { let v = base[b.fn]; if (b.key === "G") v += b.fn === "T" ? 0.24 : 0.14; if (/dim7/.test(b.chord)) v += 0.12; if (b.bar >= 24 && b.bar <= 31) v += (b.bar - 24) * 0.022; return v; });
  const sm = (a) => a.map((v, i) => (2 * v + (a[i - 1] ?? v) + (a[i + 1] ?? v)) / 4), L = sm(sm(h));
  const pts = L.map((v, i) => `${f(14 + (i / 34) * 372)},${f(150 - v * 120)}`).join(" ");
  return `<svg viewBox="0 0 400 165"><line x1="0" x2="400" y1="150" y2="150" stroke="rgba(246,240,228,.2)"/><polyline points="${pts}" fill="none" stroke="#f6f0e4" stroke-width="2.4" stroke-linejoin="round"/>${L.map((v, i) => `<circle cx="${f(14 + (i / 34) * 372)}" cy="${f(150 - v * 120)}" r="2.6" fill="${FN[B[i].fn]}"/>`).join("")}</svg>`;
}

const ks = keyscape(), vo = voices();
const CARDS = [
  ["The three families", "Barry Harris · Lendvai · Metaharmony", compass(), "All 12 notes split into exactly three diminished squares. Every bar is a point inside the triangle, placed by how much of each square it uses. Ordinary chords mix families and stay inside; Bach's diminished chords jump to a corner (bars 12, 14, 22) or right next to one (23 and 28, where a note from the bar before still rings), because each is a single pure square. You see the hidden skeleton Barry Harris taught.", "Jazz players, theory lovers, anyone curious about Metaharmony's idea, now on a real piece.", "Make it live: the dot moves as the music plays; tap a corner to hear the square and its four dominant children."],
  ["The keyscape", "Craig Sapp (Stanford)", ks.svg + `<div class="legend">${ks.legend}</div>`, "Each tiny cell answers: if you listened only to these bars, what key would you hear? Bottom row = bar by bar; top point = the whole piece. Tall columns of one color are solid keys; the G region shows as a mountain of its own inside C. The whole tonal plan in one picture.", "Students, analysts, people comparing pieces. Works as the piece's sleeve.", "Tap a cell to play just those bars. Every piece in the archive gets one, so you can compare at a glance."],
  ["The reduction", "Heinrich Schenker · Lerdahl & Jackendoff", reduction(), "Zoom out and 35 chords become five regions, then just three: home, five, home (I–V–I), with the top line falling E, D, C (Schenker's reading). The deepest pattern in tonal music: everything else decorates one cadence.", "Deep theory students; the 'secret pattern' moment for everyone once it animates.", "This is the grain slider: drag and the chords merge into regions, then into the skeleton, with the music still playing."],
  ["Voice threads", "Voice leading · Tymoczko", vo.svg, `Bach's five notes per bar as five threads. Colored dots are notes that move; grey dots hold. Each voice moves under two half steps per bar on average (${vo.avg} across all five), and about a third of the notes simply stay put. That smoothness is why the piece sounds like one breath.`, "Pianists, arrangers, composers.", "Hover a bar to see which voice carries the change; compare with a pop song's jumpy voicings."],
  ["The Tonnetz path", "Euler · Riemann · neo-Riemannian theory", tonnetz(), "Notes on a grid where neighbors are a fifth or a third apart. Every major or minor chord is a triangle, and chords that share two notes share an edge. The piece's path shows which moves are smooth (one step to a neighbor) and where it leaps. Diminished chords leave the grid, so the line breaks there.", "Theory nerds, film composers (it's how many think about chord colors).", "The path draws itself as it plays; triangles glow while they sound."],
  ["The fifths orbit", "Circle of fifths · Fourier phase (Amiot, Yust)", orbit(), "The circle of fifths, with a dot for the center of gravity of each bar's notes. Near the edge means clearly in one key; toward the center means ambiguous. The trip to G moves the whole cloud one step clockwise; the squares pull toward the middle.", "Everyone: it shows 'where the key is' without any notation.", "Ring labels light up as notes play; a transpose dial rotates the picture without changing its shape."],
  ["Family barcode", "Lendvai's axes as a stripe", barcode(), "Each bar split by how much of each square family it uses. Most bars are a mix; the five diminished bars are a single color. It's a one-line strip you can put under any other view.", "A companion strip for any lens; quick comparison between pieces.", "Sort a playlist by family balance; find songs that live in one square."],
  ["Chroma grid", "Pitch-class profile with bass", chroma(), "Every note name (rows, in fifths order) and every bar (columns), brightness = how long it sounds; the outlined cell is the bass. You can see the long wait: the G row holds for eight bars while everything above it changes.", "Analysts and producers; the 'raw data' view.", "Tap a row to hear that note's part alone."],
  ["The Five Dials", "Fourier components (Amiot, Yust, wavescapes)", dials(), "Five measures for every bar, each one a symmetric shape on the 12-note clock. The Squares dial hits exactly 1.00 on the diminished bars (dots). These are the numbers that let the archive compare any music, from Bach to Coltrane.", "Researchers, the archive, power users.", "The same streams computed for a whole playlist become its fingerprint."],
  ["The Journey", "the current mockup", journey(), "How far from home each bar feels, smoothed into a landscape. Clean and friendly, but it's an estimate and only one dimension.", "Beginners: the front door.", "Keep as the simplest level; every other view above is a deeper lens on the same timeline."],
];

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#0c0a20"><title>Ten Ways to See</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap" rel="stylesheet">
<style>
:root{--ink:#f6f0e4;--soft:rgba(246,240,228,.64);--hair:rgba(246,240,228,.1)}
*{box-sizing:border-box;margin:0}body{background:#0c0a20;color:var(--ink);font:400 16px/1.5 Archivo,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{max-width:560px;margin:0 auto;padding:calc(24px + env(safe-area-inset-top)) 20px 60px}
h1{font:800 60px/.86 Archivo;font-stretch:62%;letter-spacing:-.025em}.lede{margin-top:12px;color:var(--soft);font-size:17px}
.card{margin-top:28px;padding:18px;border-radius:22px;background:rgba(246,240,228,.04);box-shadow:inset 0 0 0 1px var(--hair)}
.n{font-size:12.5px;font-weight:700;color:var(--soft)}h2{font:800 40px/.9 Archivo;font-stretch:62%;letter-spacing:-.02em;margin-top:4px}
.from{font-size:13px;color:var(--soft);margin-top:4px}.card svg{width:100%;height:auto;display:block;margin:16px 0 6px}
.card p{font-size:15.5px;margin-top:10px}.card p.k{color:var(--soft);font-size:14px}.card p.k b{color:var(--ink)}
.legend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12.5px;color:var(--soft)}.legend i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:-1px}
text{font-family:Archivo}.sm{font-size:11px;font-weight:600;fill:rgba(246,240,228,.6)}.lab{font-size:12.5px;font-weight:700}.rn{font-size:15px;font-weight:800;fill:#f6f0e4}.rn.big{font-size:22px}.note{font-size:12px;font-weight:800;fill:#0c0a20}
.key{display:flex;gap:14px;margin-top:14px;font-size:13px;color:var(--soft);flex-wrap:wrap}.key span i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;vertical-align:-1px}
.foot{margin-top:30px;font-size:13px;color:var(--soft)}
</style></head><body><main>
<h1>Ten ways to see one piece</h1>
<p class="lede">Bach's Prelude in C, seen through ten lenses from music theory. Every drawing is computed from the real score and the checked analysis. Ranked by how much each one reveals.</p>
<div class="key"><span><i style="background:${FN.T}"></i>home</span><span><i style="background:${FN.S}"></i>away</span><span><i style="background:${FN.D}"></i>tension</span><span><i style="background:${FAM[0]}"></i><i style="background:${FAM[1]}"></i><i style="background:${FAM[2]}"></i>the three squares</span></div>
${CARDS.map(([name, from, svg, what, who, next], i) => `<section class="card"><div class="n">${String(i + 1).padStart(2, "0")}</div><h2>${name}</h2><div class="from">after ${from}</div>${svg}<p>${what}</p><p class="k"><b>For:</b> ${who}</p><p class="k"><b>Live version:</b> ${next}</p></section>`).join("")}
<p class="foot">Metaharmony (Tom Glazebrook) inspired the three-families view; its math (Barry Harris's three diminished chords, Lendvai's axes) is public. These drawings use our own colors and forms, not his.</p>
</main></body></html>`;
writeFileSync(new URL("./index.html", import.meta.url), html);
console.log("wrote design/slate/index.html", (html.length / 1024).toFixed(0) + "KB");
