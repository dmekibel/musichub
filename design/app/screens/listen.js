// Today and the Player.
import { sleeve, shell, roomHead, topBar, ICON, acc, hc, dialsRow } from "../ui.js";
import { BACH } from "../data.js";

const bachSleeve = (size, extra = {}) => sleeve({ h: BACH.h, shape: "wheel", data: { fns: BACH.fns }, name: "Prelude\nin C", tag: "J. S. Bach · 1722", size, ...extra });

export function today() {
  const blakey = sleeve({ h: 0.88, shape: "necklace", data: { on: [0, 3, 5, 6, 9, 11], n: 12 }, size: "s" });
  const rio = sleeve({ h: 0.74, shape: "necklace", data: { on: [0, 3, 6, 10, 13], n: 16 }, size: "s" });
  const lesson = sleeve({ h: 1, shape: "path", size: "s" });
  return shell("today", `
    ${roomHead("Today")}
    <p class="kicker" style="margin-top:6px">Sunday, October 11</p>
    <a href="#piece" style="display:block;margin-top:16px">${bachSleeve("xl", { tag: "Piece of the day" })}</a>
    <p class="t-l" style="margin-top:14px">Thirty-five bars, one chord each: the most famous trip from home and back.</p>
    <div class="actions"><a class="btn" href="#player">${ICON.play}Listen · 2 min, guided</a></div>

    <section class="sec">
      <div class="sec-h"><h2 class="disp">Born today</h2></div>
      <a class="row" href="#explore">${blakey}<span class="txt"><b>Art Blakey · 1919, Pittsburgh</b><span>The drummer whose Jazz Messengers were a school for young players for 35 years.</span></span></a>
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">A sound from somewhere</h2></div>
      <a class="row" href="#style">${rio}<span class="txt"><b>Rio de Janeiro, 1958</b><span>"Chega de Saudade": the record where bossa nova begins.</span></span></a>
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">Next lesson</h2><a href="#learn">Path</a></div>
      <a class="row" href="#lesson">${lesson}<span class="txt"><b>Lesson 3 · Hearing tension</b><span>4 minutes · uses the Prelude you just heard</span></span></a>
    </section>
    <p class="illus">Bach data is real. Other entries are illustrative for this mockup.</p>
  `, { mini: false });
}

// ---------- the Harmony Atlas: every function at a fixed address (after mDecks' Mapping Tonal Harmony)
const M = [200, 206];
const NODES = {
  "I": { at: [200, 262], fn: "T" }, "vi": { at: [150, 346], fn: "T" }, "iii": { at: [250, 346], fn: "T" },
  "IV": { at: [146, 180], fn: "S" }, "ii": { at: [46, 180], fn: "S" },
  "V": { at: [254, 180], fn: "D" }, "vii°": { at: [354, 180], fn: "D" }, "I⁶₄": { at: [304, 128], fn: "D", inner: true },
  "vii°/ii": { at: [52, 92], fn: "D", sat: "ii" }, "V/IV": { at: [148, 96], fn: "D", sat: "IV" },
  "V/V": { at: [214, 104], fn: "D", sat: "V" }, "vii°/V": { at: [262, 74], fn: "D", sat: "V" },
};
const FILL = { T: "#f2b135", S: "#00a388", D: "#3a2bdb" };
const INK = { T: "#2e1d07", S: "#f7f1e6", D: "#f7f1e6" };

export function atlasSVG({ now = "vii°/ii", prev = "V", next = "ii", counts = BACH.counts, labels = true } = {}) {
  const r = (a) => 12 + 3.4 * Math.sqrt(counts[a] || 0);
  let s = `<svg viewBox="0 0 400 400" class="atlas" role="img" aria-label="Harmony Atlas">
  <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker>
  <marker id="ahs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor" fill-opacity=".5"/></marker></defs>
  <path d="M0 0H200V${M[1]}L0 400Z" fill="${hc(0.4).field}" fill-opacity=".16"/><path d="M200 0H400V400L200 ${M[1]}Z" fill="${hc(1).field}" fill-opacity=".2"/><path d="M0 400L200 ${M[1]}L400 400Z" fill="${hc(0).field}" fill-opacity=".18"/>
  <path d="M200 0V${M[1]}M200 ${M[1]}L0 400M200 ${M[1]}L400 400" stroke="currentColor" stroke-opacity=".18" stroke-width="1.5" fill="none"/>
  <g fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="1.5"><circle cx="96" cy="150" r="58"/><circle cx="304" cy="150" r="58"/><circle cx="200" cy="318" r="58"/></g>`;
  if (labels) s += `<text x="16" y="34" class="ra">Away</text><text x="16" y="50" class="rb">subdominant</text>
  <text x="384" y="34" class="ra" text-anchor="end">Tension</text><text x="384" y="50" class="rb" text-anchor="end">dominant</text>
  <text x="200" y="396" class="ra" text-anchor="middle">Home</text>`;
  // satellite leader lines
  for (const [k, n] of Object.entries(NODES)) if (n.sat && counts[k]) { const t = NODES[n.sat].at; s += `<line x1="${n.at[0]}" y1="${n.at[1]}" x2="${t[0] + (n.at[0] - t[0]) * 0.32}" y2="${t[1] + (n.at[1] - t[1]) * 0.32}" stroke="currentColor" stroke-opacity=".45" stroke-width="1.2" marker-end="url(#ahs)"/>`; }
  // route: previous -> now -> next
  const cur = (a, b, bend) => { const [x1, y1] = NODES[a].at, [x2, y2] = NODES[b].at; const mx = (x1 + x2) / 2 + (y2 - y1) * bend, my = (y1 + y2) / 2 - (x2 - x1) * bend; const ex = x2 + (mx - x2) * 0.18, ey = y2 + (my - y2) * 0.18; return `M${x1} ${y1} Q${mx} ${my} ${ex} ${ey}`; };
  if (prev) s += `<path d="${cur(prev, now, 0.22)}" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round" marker-end="url(#ah)"/>`;
  if (next) s += `<path d="${cur(now, next, -0.25)}" fill="none" stroke="currentColor" stroke-opacity=".4" stroke-width="1.6" marker-end="url(#ahs)"/>`;
  for (const [k, n] of Object.entries(NODES)) {
    const used = counts[k], [x, y] = n.at, rr = used ? r(k) : 14;
    if (k === now) s += `<circle cx="${x}" cy="${y}" r="${rr + 7}" fill="none" stroke="currentColor" stroke-width="2"/>`;
    s += used ? `<circle cx="${x}" cy="${y}" r="${rr}" fill="${FILL[n.fn]}" ${n.sat ? `stroke="currentColor" stroke-opacity=".9" stroke-width="2"` : ""}/>` : `<circle cx="${x}" cy="${y}" r="${rr}" fill="none" stroke="currentColor" stroke-opacity=".4" stroke-width="1.3" stroke-dasharray="3 3"/>`;
    s += `<text x="${x}" y="${y + 4.5}" text-anchor="middle" class="${n.sat ? "nl s" : "nl"}" ${used ? `fill="${INK[n.fn]}"` : `fill="currentColor" fill-opacity=".5"`}>${k}</text>`;
  }
  return s + `</svg>`;
}

export function player() {
  const b = BACH.bars[11];
  const win = BACH.bars.slice(8, 16);
  const arrows = { 10: 11, 12: 13, 14: 15 };
  const ribbon = win.map((x) => `<div class="rb-bar${x.bar === 12 ? " on" : ""}">
      <b>${x.chord.split("/")[0].replace("dim7", "°7").replace("maj7", "△7").replace("#", "♯")}</b>
      <span>${x.addr}</span><i class="fn-${x.fn}"></i><em>${x.bar}</em>${arrows[x.bar] ? `<s></s>` : ""}</div>`).join("");
  return `<main class="screen full">
    ${topBar("Prelude in C · Bach", ICON.save)}
    <nav class="lenses"><a class="on">Atlas</a><a href="#piece">Dials</a><a>Clock</a><a>Score</a><a>Story</a></nav>
    <div style="margin-top:12px">${atlasSVG()}</div>
    <div class="now">
      <div class="now-chord disp">C${acc("♯")}<span class="sup">°7</span><span class="over">over G</span></div>
      <p class="t-l"><b>Tension.</b> vii° of ii: it leans into D minor.</p>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><span class="pill"><span class="dot fn-D"></span>The way back · bars 12–19</span><span class="pill">Squares 1.00</span></div>
    </div>
    <div class="ribbon"><div class="rb-key">in G</div>${ribbon}</div>
    <div class="scrub"><div class="meter"><i style="width:33%"></i></div><div class="t-xs soft" style="display:flex;justify-content:space-between;margin-top:8px"><span>bar 12 of 35</span><span>♩ 66</span></div></div>
    <div class="transport"><a class="tr">${ICON.prev}</a><a class="tr big">${ICON.play}</a><a class="tr">${ICON.next}</a></div>
  </main>
  <style>
    .atlas { width: 100%; height: auto; border-radius: 10px; color: var(--ink); }
    .atlas .ra { font: 800 26px Archivo; font-stretch: 62%; fill: currentColor; }
    .atlas .rb { font: 600 11.5px Archivo; fill: currentColor; fill-opacity: .6; }
    .atlas .nl { font: 700 14px Archivo; } .atlas .nl.s { font-size: 11px; }
    .now { margin-top: 16px; }
    .now-chord { font-size: 84px; display: flex; align-items: flex-start; }
    .now-chord .over { font-size: 22px; letter-spacing: 0; font-stretch: 100%; font-weight: 600; color: var(--soft); align-self: flex-end; margin: 0 0 10px 12px; }
    .ribbon { position: relative; display: grid; grid-template-columns: repeat(8, 1fr); gap: 3px; margin-top: 22px; padding-top: 18px; }
    .rb-key { position: absolute; left: 0; top: 0; width: calc(37.5% - 2px); font-size: 11.5px; font-weight: 650; color: var(--soft); border-top: 1.5px solid var(--faint); padding-top: 2px; }
    .rb-bar { position: relative; text-align: center; padding: 6px 0 4px; border-radius: 6px; }
    .rb-bar.on { box-shadow: inset 0 0 0 1.5px var(--ink); }
    .rb-bar b { display: block; font-size: 13px; font-weight: 700; white-space: nowrap; }
    .rb-bar span { display: block; font-size: 11.5px; color: var(--soft); margin-top: 1px; }
    .rb-bar i { display: block; height: 6px; border-radius: 3px; margin: 6px 4px 0; background: var(--c); }
    .rb-bar em { display: block; font-style: normal; font-size: 11px; color: var(--faint); margin-top: 4px; }
    .rb-bar s { position: absolute; right: -9px; top: 34px; width: 16px; height: 8px; border-top: 1.5px solid var(--ink); border-right: 1.5px solid var(--ink); border-radius: 0 8px 0 0; z-index: 1; }
    .scrub { margin-top: 22px; }
    .transport { display: flex; justify-content: center; align-items: center; gap: 40px; margin-top: 16px; }
    .tr { width: 44px; height: 44px; display: grid; place-items: center; } .tr svg { width: 24px; height: 24px; }
    .tr.big { width: 72px; height: 72px; border-radius: 50%; background: var(--ink); color: var(--paper); } .tr.big svg { width: 26px; height: 26px; margin-left: 3px; }
  </style>`;
}
