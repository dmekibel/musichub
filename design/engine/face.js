// The face of the harmony engine: three teams on a ring (home → away → tension → home), and for any chord the four
// menus a songwriter needs: Approach, Swap, Spice, Next. Every option plays. Build a progression in the dock and loop it.
import * as H from "./harmony.js?v=1";
import * as S from "../app/sound.js?v=20261011e";
import { BACH } from "../app/data.js?v=20261011e";

const $ = (id) => document.getElementById(id);
const COL = { T: "#f2c14e", S: "#46b3a9", D: "#e8607a" }, WORD = { T: "Home", S: "Away", D: "Tension" };
const DESC = { T: "Feels finished, like arriving.", S: "A step away from home: open, moving.", D: "Wants to resolve home, now." };
let key = 0, tab = "approach";
let prog = ["C", "Am", "F", "G"].map(H.parseChord), selIdx = 0, sel = prog[0];
const pref = () => ([5, 10, 3, 8, 1].includes(key) ? "flat" : key === 0 ? "nice" : "sharp");
const nm = (c) => H.nameOf(c, pref());

// ---------- the teams as a songwriter would meet them in this key
function team(job) {
  const order = { T: [0, 9, 3, 6], S: [5, 2, 8, 11], D: [7, 4, 10, 1] }[job];
  return order.map((o) => { const r = key + o; if (job === "D") return H.chord(r, "7"); if ((job === "T" && o === 9) || (job === "S" && o === 2)) return H.chord(r, "min"); if (job === "S" && o === 11) return H.chord(r, "m7b5"); return H.chord(r, "maj"); });
}

// accidentals in SVG text: pull them in so "B♭7" doesn't read as "B ♭ 7"
const tight = (t) => t.replace(/([♭♯])/g, '<tspan dx="-1.5" font-size="0.86em">$1</tspan><tspan dx="-1"></tspan>');
// ---------- the ring
const POS = { T: [200, 86], S: [92, 250], D: [308, 250] }, RAD = 74;
let lit = null;
function drawRing() {
  const arc = (a, b, label, bend = 0.32) => { const [x1, y1] = POS[a], [x2, y2] = POS[b], mx = (x1 + x2) / 2, my = (y1 + y2) / 2, cx = 200, cy = 196, ox = mx + (mx - cx) * bend, oy = my + (my - cy) * bend, d = Math.hypot(x2 - x1, y2 - y1), sx = x1 + ((x2 - x1) / d) * (RAD + 6), sy = y1 + ((y2 - y1) / d) * (RAD + 6), ex = x2 - ((x2 - x1) / d) * (RAD + 10), ey = y2 - ((y2 - y1) / d) * (RAD + 10); return `<path d="M${sx} ${sy} Q${ox} ${oy} ${ex} ${ey}" fill="none" stroke="rgba(246,241,231,.32)" stroke-width="1.6" marker-end="url(#ah)"/><text x="${ox}" y="${oy + 4}" font-size="11.5" font-weight="700" fill="rgba(246,241,231,.55)" text-anchor="middle">${label}</text>`; };
  let s = `<defs><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="rgba(246,241,231,.5)"/></marker><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>`;
  s += arc("T", "S", "leave") + arc("S", "D", "build") + arc("D", "T", "resolve");
  for (const job of ["T", "S", "D"]) {
    const [cx, cy] = POS[job], on = lit === job, mem = team(job);
    s += `<g class="bub" data-job="${job}">${on ? `<circle cx="${cx}" cy="${cy}" r="${RAD}" fill="${COL[job]}" opacity=".45" filter="url(#gl)"/>` : ""}<circle cx="${cx}" cy="${cy}" r="${RAD}" fill="${COL[job]}" fill-opacity="${on ? 0.32 : 0.16}" stroke="${COL[job]}" stroke-width="${on ? 3 : 1.6}"/>`;
    s += `<text x="${cx}" y="${cy - 40}" font-size="14" font-weight="800" fill="${COL[job]}" text-anchor="middle" letter-spacing=".04em">${WORD[job].toUpperCase()}</text>`;
    mem.forEach((c, k) => { const x = cx + (k % 2 ? 4 : -60), y = cy - 26 + Math.floor(k / 2) * 38, isSel = nm(c) === nm(sel), main = k < 2; s += `<g class="chip" data-c="${c.root},${c.q}"><rect x="${x}" y="${y}" width="56" height="32" rx="10" fill="${isSel ? "#f6f1e7" : main ? "rgba(246,241,231,.16)" : "rgba(246,241,231,.07)"}"/><text x="${x + 28}" y="${y + 21.5}" font-size="${nm(c).length > 5 ? 12.5 : 15}" font-weight="800" fill="${isSel ? "#2d2f55" : main ? "#f6f1e7" : "rgba(246,241,231,.75)"}" text-anchor="middle">${tight(nm(c))}</text></g>`; });
    s += `</g>`;
  }
  s += `<text id="bachl" x="200" y="322" font-size="12.5" font-weight="700" fill="rgba(246,241,231,.75)" text-anchor="middle"></text>`;
  $("ring").innerHTML = s;
  $("ring").querySelectorAll(".chip").forEach((g) => g.addEventListener("click", () => { const [r, q] = g.dataset.c.split(","); select(H.chord(+r, q), -1); }));
}

// ---------- the selected chord and its four menus
function select(c, idx) { sel = c; selIdx = idx; hear(c); render(); }
const hear = (c) => S.chord(H.voicing(c), 1.6);
async function playSeq(seq) { let prev = null; for (const c of seq) { const v = H.voicing(c, prev); S.chord(v, 1.0); prev = v; await new Promise((r) => setTimeout(r, 650)); } }
function render() {
  const job = H.jobOf(sel, key);
  $("nm").textContent = nm(sel); $("job").textContent = WORD[job]; $("job").style.background = COL[job];
  const mates = H.teamRoots(key, job).map((r) => H.noteName(r, pref())).join(", ");
  $("explain").innerHTML = `${DESC[job]} Its team: <b style="color:var(--ink)">${mates}</b> — same job, different colour.`;
  drawRing(); drawList(); drawProg();
}
const metaVL = (o) => `moves ${o.move} half step${o.move === 1 ? "" : "s"} · keeps ${o.keep} note${o.keep === 1 ? "" : "s"}${o.inKey ? " · in the key" : " · borrowed colour"}`;
function drawList() {
  let rows = [];
  if (tab === "approach") rows = H.approach(sel, key).map((k) => ({ title: `${k.seq.map(nm).join(" → ")} <small>→ ${nm(sel)}</small>`, why: `<b style="color:var(--ink)">${k.name}.</b> ${k.why}`, meta: k.inKey ? "in the key" : "borrowed colour", col: COL[H.jobOf(k.seq[0], key)], play: () => playSeq([...k.seq, sel]), add: () => insertBefore(k.seq) }));
  if (tab === "swap") rows = H.swap(sel, key).map((o) => ({ title: nm(o.c), why: o.why, meta: metaVL(o), col: COL[o.job], play: () => { const p = selIdx > 0 ? prog[selIdx - 1] : null, n = selIdx >= 0 && selIdx < prog.length - 1 ? prog[selIdx + 1] : null; playSeq([p, o.c, n].filter(Boolean)); }, add: () => replace(o.c) }));
  if (tab === "spice") rows = H.spice(sel).map((o) => ({ title: nm(o.c), why: `${H.clashWords(o.clash)}${o.added.length ? ` · adds ${o.added.join(", ")}` : " · the plain chord"}`, meta: `spice ${"●".repeat(Math.min(5, Math.round(o.clash) + 1))}${"○".repeat(Math.max(0, 5 - Math.min(5, Math.round(o.clash) + 1)))}`, col: COL[job], play: () => hear(o.c), add: () => replace(o.c) }));
  if (tab === "next") rows = H.next(sel, key).map((o) => ({ title: nm(o.c), why: o.why, meta: `${Math.round(o.w * 100)}% of the time, as a rule of thumb`, col: COL[H.jobOf(o.c, key)], play: () => playSeq([sel, o.c]), add: () => insertAfter(o.c) }));
  $("list").innerHTML = rows.map((r, i) => `<div class="opt" data-i="${i}"><span class="bar" style="background:${r.col}"></span><div class="txt"><div class="t">${r.title}</div><div class="w">${r.why}</div><div class="meta">${r.meta}</div></div><button class="add" data-a="${i}" aria-label="Add to progression">+</button></div>`).join("");
  $("list").querySelectorAll(".opt").forEach((el) => el.addEventListener("click", (e) => { const i = +el.dataset.i; if (e.target.closest(".add")) { rows[i].add(); return; } rows[i].play(); }));
}
function insertBefore(seq) { const at = selIdx >= 0 ? selIdx : prog.length; if (selIdx < 0) prog.push(...seq, sel); else prog.splice(at, 0, ...seq); selIdx = selIdx < 0 ? prog.length - 1 : at + seq.length; render(); }
function insertAfter(c) { const at = selIdx >= 0 ? selIdx + 1 : prog.length; prog.splice(at, 0, c); select(c, at); }
function replace(c) { if (selIdx >= 0) { prog[selIdx] = c; sel = c; } else { prog.push(c); selIdx = prog.length - 1; sel = c; } hear(c); render(); }

// ---------- the progression dock
let playing = false, pi = -1, timer = null;
function drawProg() {
  $("prog").innerHTML = prog.map((c, i) => `<button class="pc${i === selIdx ? " sel2" : ""}${i === pi ? " now" : ""}" data-i="${i}" style="background:${COL[H.jobOf(c, key)]}">${nm(c)}<span class="x" data-x="${i}">×</span></button>`).join("");
  $("prog").querySelectorAll(".pc").forEach((b) => b.addEventListener("click", (e) => { const i = +b.dataset.i; if (e.target.dataset.x != null) { prog.splice(i, 1); selIdx = Math.min(selIdx, prog.length - 1); sel = prog[selIdx] || H.chord(key); render(); return; } select(prog[i], i); }));
  $("pp").innerHTML = playing ? `<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>` : `<svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="currentColor"/></svg>`;
}
function step() { if (!prog.length) return stop(); pi = (pi + 1) % prog.length; const c = prog[pi]; S.chord(H.voicing(c, pi ? H.voicing(prog[pi - 1]) : null), 1.15); lit = H.jobOf(c, key); drawRing(); drawProg(); }
function stop() { playing = false; clearInterval(timer); pi = -1; lit = null; drawRing(); drawProg(); }
$("pp").addEventListener("click", () => { if (playing) return stop(); if (S.playing()) S.toggle(); playing = true; step(); timer = setInterval(step, 1250); });

// ---------- keys
$("keys").innerHTML = `<span class="lab">Key</span>` + [0, 7, 2, 9, 4, 5, 10, 3, 8, 1, 6, 11].map((k) => `<button data-k="${k}" class="${k === key ? "on" : ""}">${H.noteName(k, [5, 10, 3, 8, 1].includes(k) ? "flat" : "sharp")}</button>`).join("");
$("keys").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
  const d = +b.dataset.k - key; key = +b.dataset.k; prog = prog.map((c) => H.chord(c.root + d, c.q)); sel = H.chord(sel.root + d, sel.q);
  $("keys").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); render();
}));
$("tabs").querySelectorAll("button").forEach((b, i) => b.addEventListener("click", () => { tab = b.dataset.t; $("tabs").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); $("tabs").querySelector("i").style.transform = `translateX(${i * 100}%)`; drawList(); }));
$("hear").addEventListener("click", () => hear(sel));

// ---------- Bach on the ring: the Prelude's chords light up their team as it plays
$("demo").addEventListener("click", () => { if (playing) stop(); S.toggle(); });
S.onChange(() => {
  const on = S.playing(); $("demo").classList.toggle("on", on); $("demo").textContent = on ? "❚❚ Bach on the ring" : "▶ Bach on the ring";
  if (!on && !playing) { lit = null; drawRing(); return; }
  if (!on) return;
  const b = BACH.bars[S.bar()], c = H.parseChord(b.chord), j = H.jobOf(c, 0);
  lit = j; drawRing(); const l = $("bachl"); if (l) l.textContent = `Bach · bar ${b.bar} · ${nm(c)} · ${WORD[j].toLowerCase()}${b.key === "G" ? " (heard in G here)" : ""}`;
});
render();
