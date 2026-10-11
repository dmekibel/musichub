// One screen, layered like a good stock chart (Robinhood / Apple Stocks): a big readout that follows your finger, one thin
// line for the whole piece (how far from home each bar feels: an estimate), the chords as a strip along its base, and only
// the layers you ask for drawn on top (key, form, bass, cadences and squares). Each chord's icon is its shape on the
// honeycomb: three touching notes for a major or minor chord, four in a line for one of Barry Harris's squares.
import * as S from "../app/sound.js?v=20261011e";
import { BACH } from "../app/data.js?v=20261011e";

const B = BACH.bars, NB = 35;
const FN = { T: "#f2c14e", S: "#46b3a9", D: "#e8607a" }, WORD = { T: "Home", S: "Away", D: "Tension" };
const INK = "#f6f1e7", SOFT = "rgba(246,241,231,.64)", FAINT = "rgba(246,241,231,.32)";
const SECTIONS = BACH.sections.map((s) => [s.from - 1, s.to - 1, s.title]);
const CAD = [3, 10, 18, 34];

const BASE = { T: 0.1, S: 0.42, D: 0.7 };
const RAW = B.map((b) => { let h = BASE[b.fn]; if (b.key === "G") h += b.fn === "T" ? 0.24 : 0.14; if (/dim7/.test(b.chord)) h += 0.12; if (/sus4/.test(b.chord)) h += 0.05; if (b.bar >= 24 && b.bar <= 31) h += (b.bar - 24) * 0.022; if (b.bar === 1) h = 0.06; if (b.bar === 35) h = 0.03; if (b.bar === 32) h = 0.24; return Math.min(0.98, h); });
const soft1 = RAW.map((v, i) => (2 * v + (RAW[i - 1] ?? v) + (RAW[i + 1] ?? v)) / 4).map((v, i) => (i === 0 || i === 34 ? RAW[i] : v));
const GROUPS = { bar: B.map((_, i) => [i, i]), phrase: Array.from({ length: 9 }, (_, k) => [k * 4, Math.min(34, k * 4 + 3)]), section: SECTIONS.map(([a, z]) => [a, z]) };
const mean = (a, z, arr) => arr.slice(a, z + 1).reduce((s, v) => s + v, 0) / (z - a + 1);
const domFn = (a, z) => { const f = B.slice(a, z + 1).map((b) => b.fn); return ["D", "S", "T"].sort((p, q) => f.filter((x) => x === q).length - f.filter((x) => x === p).length)[0]; };

let grain = "bar", cursor = null, layers = { key: true, form: true, bass: false, marks: true };
const svg = document.getElementById("svg"), $ = (id) => document.getElementById(id);
let W = 400, H = 400, x = () => 0, y = () => 0, lineEl = null, LUT = [];

function smooth(p) { let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`; for (let i = 0; i < p.length - 1; i++) { const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2; d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`; } return d; }

function draw() {
  W = svg.clientWidth; H = svg.clientHeight; svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const L = 22, R = 22, top = 40, base = H - 66, stripY = H - 50;
  x = (i) => L + ((i + 0.5) / NB) * (W - L - R); y = (v) => base - v * (base - top);
  const xg = ([a, z]) => [L + (a / NB) * (W - L - R), L + ((z + 1) / NB) * (W - L - R)];
  const gs = GROUPS[grain];
  const pts = grain === "bar" ? soft1.map((v, i) => [x(i), y(v)]) : gs.map(([a, z]) => [(xg([a, z])[0] + xg([a, z])[1]) / 2, y(mean(a, z, RAW))]);
  const P = [[L - 6, pts[0][1]], ...pts, [W - R + 6, pts[pts.length - 1][1]]], D = smooth(P);
  const stops = (grain === "bar" ? B.map((b, i) => [x(i), b.fn]) : gs.map(([a, z]) => [(xg([a, z])[0] + xg([a, z])[1]) / 2, domFn(a, z)])).map(([px, f]) => `<stop offset="${(px / W).toFixed(4)}" stop-color="${FN[f]}"/>`).join("");
  let s = `<defs><linearGradient id="g" x1="0" x2="${W}" gradientUnits="userSpaceOnUse">${stops}</linearGradient>
    <linearGradient id="fade" x1="0" y1="${top}" x2="0" y2="${base}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="m"><path d="${D} L${W - R + 6} ${base} L${L - 6} ${base}Z" fill="url(#fade)"/></mask>
    <clipPath id="past"><rect id="pr" x="0" y="0" width="0" height="${H}"/></clipPath><clipPath id="fut"><rect id="fr" x="0" y="0" width="${W}" height="${H}"/></clipPath>
    <filter id="blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="4"/></filter></defs>`;
  // key: one quiet pill over the bars in G
  if (layers.key) { const [x1, x2] = xg([4, 10]); s += `<line x1="${x1 + 2}" x2="${x2 - 2}" y1="16" y2="16" stroke="${FN.D}" stroke-width="2" stroke-linecap="round" opacity=".9"/><text x="${(x1 + x2) / 2}" y="10" font-size="11" font-weight="700" fill="${INK}" text-anchor="middle">in G</text><text x="${L}" y="10" font-size="11" font-weight="650" fill="${FAINT}">in C</text>`; }
  // form: hairline dividers and names along the bottom
  if (layers.form) SECTIONS.forEach(([a, z, t], k) => { const [x1, x2] = xg([a, z]); if (k) s += `<line x1="${x1}" x2="${x1}" y1="${top - 6}" y2="${base}" stroke="rgba(246,241,231,.08)"/>`; const w = x2 - x1, label = t.length * 5.6 > w ? t.split(" ").filter((p) => p.length > 2).pop() : t; s += `<text x="${(x1 + x2) / 2}" y="${H - 6}" font-size="10.5" font-weight="650" fill="${FAINT}" text-anchor="middle">${label}</text>`; });
  // home baseline
  s += `<line x1="${L}" x2="${W - R}" y1="${base}" y2="${base}" stroke="rgba(246,241,231,.18)" stroke-dasharray="2 4"/><text x="${W - R}" y="${base - 6}" font-size="10.5" font-weight="650" fill="${FAINT}" text-anchor="end">home</text>`;
  // bass: a thin dashed line living in the lower part of the plot
  if (layers.bass) { const by = (m) => base - 8 - ((m - 34) / 18) * 70; let d = ""; B.forEach((b, i) => { const m = b.voicing[0], a = x(i) - (W - L - R) / NB / 2, z = x(i) + (W - L - R) / NB / 2; d += `${i ? "L" : "M"}${a.toFixed(1)} ${by(m).toFixed(1)} L${z.toFixed(1)} ${by(m).toFixed(1)}`; }); s += `<path d="${d}" fill="none" stroke="${SOFT}" stroke-width="1.3" stroke-dasharray="4 3"/><text x="${xg([23, 30])[0] + 4}" y="${by(43) - 6}" font-size="10.5" font-weight="700" fill="${INK}">bass holds G</text>`; }
  // the line: future quiet, past bright with a soft glow and a whisper of fill
  s += `<g clip-path="url(#fut)"><path d="${D}" fill="none" stroke="url(#g)" stroke-width="2" opacity=".3"/></g>`;
  s += `<g clip-path="url(#past)"><path d="${D} L${W - R + 6} ${base} L${L - 6} ${base}Z" fill="url(#g)" mask="url(#m)"/><path d="${D}" fill="none" stroke="url(#g)" stroke-width="6" opacity=".35" filter="url(#blur)"/><path id="ln" d="${D}" fill="none" stroke="url(#g)" stroke-width="2.6" stroke-linecap="round"/></g>`;
  s += `<path id="lnFull" d="${D}" fill="none" stroke="none"/>`;
  // marks on the line: cadences (rings) and the squares (diamonds)
  if (layers.marks && grain === "bar") { CAD.forEach((i) => { s += `<circle cx="${x(i)}" cy="${y(soft1[i]) - 12}" r="3.4" fill="none" stroke="${INK}" stroke-width="1.6"/>`; }); B.forEach((b, i) => { if (/dim7/.test(b.chord)) { const cx = x(i), cy = y(soft1[i]) - 12; s += `<path d="M${cx} ${cy - 4.5}L${cx + 4.5} ${cy}L${cx} ${cy + 4.5}L${cx - 4.5} ${cy}Z" fill="${FN.D}"/>`; } }); }
  // the chord strip along the base
  gs.forEach(([a, z], k) => { const [x1, x2] = xg([a, z]), f = grain === "bar" ? B[a].fn : domFn(a, z); s += `<rect class="blk" data-k="${k}" x="${(x1 + 1).toFixed(1)}" y="${stripY}" width="${(x2 - x1 - 2).toFixed(1)}" height="10" rx="3" fill="${FN[f]}" opacity=".55"/>`; if (grain !== "bar") { const lab = grain === "section" ? SECTIONS[k][2] : short(B[a].chord); const w = x2 - x1; if (lab.length * 6 < w) s += `<text x="${(x1 + x2) / 2}" y="${stripY + 26}" font-size="11" font-weight="700" fill="${SOFT}" text-anchor="middle">${lab}</text>`; } });
  s += `<text id="clab" x="0" y="${stripY + 27}" font-size="12" font-weight="800" fill="${INK}" text-anchor="middle"></text>`;
  // playhead and crosshair
  s += `<line id="ch" x1="0" x2="0" y1="${top - 10}" y2="${stripY - 4}" stroke="${INK}" stroke-width="1" opacity="0"/><circle id="hg" r="12" fill="#fff8ea" opacity=".22" filter="url(#blur)"/><circle id="hd" r="5" fill="#fff8ea"/>`;
  svg.innerHTML = s;
  const full = svg.querySelector("#lnFull"), len = full.getTotalLength(); LUT = []; for (let k = 0; k <= 500; k++) { const p = full.getPointAtLength((k / 500) * len); LUT.push([p.x, p.y]); }
  update();
}
const yAt = (px) => { let lo = 0, hi = LUT.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (LUT[m][0] < px) lo = m; else hi = m; } const [x0, y0] = LUT[lo], [x1, y1] = LUT[hi]; return y0 + (y1 - y0) * ((px - x0) / (x1 - x0 || 1)); };
const short = (c) => c.split("/")[0].replace("dim7", "°7").replace("maj7", "△7").replace("7sus4", "7sus").replace("#", "♯");

// accidentals drawn to match the condensed display type
const SHARP = `<svg class="acc" viewBox="0 0 44 100" style="width:.27em;height:.6em;margin:.06em .03em 0"><path d="M13 4v92M29 2v92" stroke="currentColor" stroke-width="6"/><path d="M2 38 42 27v15L2 53zM2 66 42 55v15L2 81z" fill="currentColor"/></svg>`;
const FLAT = `<svg class="acc" viewBox="0 0 44 100" style="width:.27em;height:.6em;margin:.06em .03em 0"><path d="M8 2v94" stroke="currentColor" stroke-width="7"/><path d="M8 96C30 84 40 72 40 60c0-12-14-16-32-4" fill="none" stroke="currentColor" stroke-width="7"/></svg>`;
// the chord's icon: its shape on the honeycomb
function glyph(sym, fn) {
  const m = sym.split("/")[0], q = m.slice(m[1] === "#" || m[1] === "b" ? 2 : 1);
  const hx = (a, b) => [Math.sqrt(3) * (a + b / 2), -1.5 * b];
  let cells = q.startsWith("dim") ? [[0, 0], [1, -1], [2, -2], [3, -3]] : q === "m" || q === "m7" ? [[0, 0], [1, -1], [1, 0]] : q.startsWith("7sus") ? [[-1, 0], [0, 0], [1, 0]] : [[0, 0], [0, 1], [1, 0]];
  if (q === "7" || q === "m7" || q === "maj7") cells = cells.concat([q === "maj7" ? [1, 1] : [2, -1]]);
  if (q === "7sus4") cells.push([2, -1]);
  const pts = cells.map(([a, b]) => hx(a, b)), cx = pts.reduce((s2, p) => s2 + p[0], 0) / pts.length, cy = pts.reduce((s2, p) => s2 + p[1], 0) / pts.length;
  const ext = Math.max(...pts.map(([px, py]) => Math.hypot(px - cx, py - cy))) + 1, k = 2 / ext;
  const hex = (px, py) => [0, 1, 2, 3, 4, 5].map((n) => { const a = (Math.PI / 180) * (60 * n - 30); return `${((px - cx + 0.9 * Math.cos(a)) * k).toFixed(3)},${((py - cy + 0.9 * Math.sin(a)) * k).toFixed(3)}`; }).join(" ");
  return pts.map(([px, py], n) => `<polygon points="${hex(px, py)}" fill="${FN[fn]}" opacity="${n === 3 ? 0.55 : 1}" stroke="${FN[fn]}" stroke-width="${0.12 * k}" stroke-linejoin="round"/>`).join("");
}

function update() {
  const started = S.started() || S.pos() > 0, i = cursor ?? (started ? S.bar() : 0), b = B[i];
  const [main, bass] = b.chord.split("/"), mm = /^([A-G])([#b]?)(.*)$/.exec(main), qq = mm[3].replace("dim7", "°7").replace("maj7", "maj7").replace("7sus4", "7sus4");
  $("name").innerHTML = `${mm[1]}${mm[2] ? (mm[2] === "#" ? SHARP : FLAT) : ""}${qq.startsWith("m") && !qq.startsWith("maj") ? "m" : ""}${qq.replace(/^m(?!aj)/, "") ? `<sup>${qq.replace(/^m(?!aj)/, "")}</sup>` : ""}`;
  $("glyph").innerHTML = glyph(b.chord, b.fn);
  const sec = SECTIONS.find(([a, z]) => i >= a && i <= z);
  $("line2").innerHTML = `<b style="color:${FN[b.fn]}">${WORD[b.fn]}</b> · bar ${b.bar}${bass ? ` · over ${bass.replace("#", "♯")}` : ""} · ${sec[2]}`;
  // playhead / crosshair
  const px = cursor != null ? x(cursor) : started ? 22 + S.progress() * (W - 44) : x(0), py = yAt(px);
  const pr = svg.querySelector("#pr"), fr = svg.querySelector("#fr"); if (!pr) return;
  const playX = started ? 22 + S.progress() * (W - 44) : 0; pr.setAttribute("width", playX); fr.setAttribute("x", playX);
  ["hd", "hg"].forEach((id) => { const c = svg.querySelector("#" + id); c.setAttribute("cx", px); c.setAttribute("cy", py); c.style.opacity = started || cursor != null ? "" : "0"; });
  const ch = svg.querySelector("#ch"); ch.setAttribute("x1", px); ch.setAttribute("x2", px); ch.setAttribute("opacity", cursor != null ? 0.55 : 0);
  const gs = GROUPS[grain], k = gs.findIndex(([a, z]) => i >= a && i <= z);
  svg.querySelectorAll(".blk").forEach((r) => { const on = +r.dataset.k === k; r.setAttribute("opacity", on ? 1 : +r.dataset.k < k ? 0.8 : 0.4); r.setAttribute("height", on ? 16 : 10); r.setAttribute("y", on ? H - 53 : H - 50); });
  const cl = svg.querySelector("#clab"); if (grain === "bar") { cl.textContent = short(b.chord); cl.setAttribute("x", Math.max(30, Math.min(W - 30, x(i)))); } else cl.textContent = "";
  $("pp").innerHTML = S.playing() ? `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>` : `<svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="currentColor"/></svg>`;
  $("dt").innerHTML = cursor != null ? `<b>Reading bar ${b.bar}</b>Let go to keep listening` : started ? `<b>${S.playing() ? "Playing" : "Paused"} · bar ${B[S.bar()].bar} of 35</b>Drag the chart to read any bar` : `<b>Press play</b>Or drag the chart to read any bar`;
}

// ---------- interaction
const t = $("touch"); let down = null, moved = false;
const idx = (e) => { const r = t.getBoundingClientRect(); return Math.max(0, Math.min(34, Math.floor(((e.clientX - r.left - 22) / (r.width - 44)) * NB))); };
t.addEventListener("pointerdown", (e) => { down = e.clientX; moved = false; cursor = idx(e); update(); });
t.addEventListener("pointermove", (e) => { if (down != null || e.pointerType === "mouse") { if (down != null && Math.abs(e.clientX - down) > 6) moved = true; cursor = idx(e); update(); } });
t.addEventListener("pointerup", (e) => { if (!moved) { S.seekBar(idx(e)); if (!S.playing()) S.play(); } down = null; cursor = null; update(); });
t.addEventListener("pointerleave", () => { down = null; cursor = null; update(); });
document.querySelectorAll("#tf button").forEach((bt) => bt.addEventListener("click", () => { grain = bt.dataset.g; document.querySelectorAll("#tf button").forEach((o) => o.classList.toggle("on", o === bt)); draw(); }));
document.querySelectorAll("#layers button").forEach((bt) => bt.addEventListener("click", () => { layers[bt.dataset.l] = !layers[bt.dataset.l]; bt.classList.toggle("on", layers[bt.dataset.l]); draw(); }));
$("pp").addEventListener("click", () => S.toggle());
S.onChange(update); S.onTick(update);
addEventListener("resize", draw);
draw();
const qs = new URLSearchParams(location.search); if (qs.get("bar")) S.seekBar(+qs.get("bar") - 1);
if (qs.get("grain")) document.querySelector(`#tf [data-g="${qs.get("grain")}"]`).click(); if (qs.get("bass")) document.querySelector('[data-l="bass"]').click();
