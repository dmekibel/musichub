// Today and the Player.
import { sleeve, shell, roomHead, topBar, ICON, acc, hc, dialsRow, DIAL_NAMES, FN_H } from "../ui.js?v=20261011e";
import { BACH, ADDRS, KINDS, kind } from "../data.js?v=20261011e";
import * as S from "../sound.js?v=20261011e";
import { plain } from "../prefs.js?v=20261011e";
import { BWV846_NOTES } from "../../../data/bwv846-notes.js?v=20261011e";

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
    <div class="actions"><button class="btn" data-act="listen">${ICON.play}Listen · 2 min</button></div>

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
export const ideaA = (a) => `#idea?a=${encodeURIComponent(a)}`;
export const ideaK = (c) => `#idea?k=${KINDS[kind(c)].id}`;

/** words: "plain" labels nodes with chord names (C, Dm, G), "theory" with numerals (I, ii, V). links: nodes open their idea page. */
export function atlasSVG({ now = null, prev = null, next = null, counts = BACH.counts, labels = true, words = plain() ? "plain" : "theory", links = false } = {}) {
  const r = (a) => 12 + 3.4 * Math.sqrt(counts[a] || 0);
  let s = `<svg viewBox="0 0 400 400" class="atlas" role="img" aria-label="Harmony Atlas">
  <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker>
  <marker id="ahs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor" fill-opacity=".5"/></marker></defs>
  <path d="M0 0H200V${M[1]}L0 400Z" fill="${hc(0.4).field}" fill-opacity=".16"/><path d="M200 0H400V400L200 ${M[1]}Z" fill="${hc(1).field}" fill-opacity=".2"/><path d="M0 400L200 ${M[1]}L400 400Z" fill="${hc(0).field}" fill-opacity=".18"/>
  <path d="M200 0V${M[1]}M200 ${M[1]}L0 400M200 ${M[1]}L400 400" stroke="currentColor" stroke-opacity=".18" stroke-width="1.5" fill="none"/>
  <g fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="1.5"><circle cx="96" cy="150" r="58"/><circle cx="304" cy="150" r="58"/><circle cx="200" cy="318" r="58"/></g>`;
  if (labels) s += `<text x="16" y="34" class="ra">Away</text>${words === "theory" ? `<text x="16" y="50" class="rb">subdominant</text>` : ""}
  <text x="384" y="34" class="ra" text-anchor="end">Tension</text>${words === "theory" ? `<text x="384" y="50" class="rb" text-anchor="end">dominant</text>` : ""}
  <text x="200" y="396" class="ra" text-anchor="middle">Home</text>`;
  for (const [k, n] of Object.entries(NODES)) if (n.sat && counts[k]) { const t = NODES[n.sat].at; s += `<line x1="${n.at[0]}" y1="${n.at[1]}" x2="${t[0] + (n.at[0] - t[0]) * 0.32}" y2="${t[1] + (n.at[1] - t[1]) * 0.32}" stroke="currentColor" stroke-opacity=".45" stroke-width="1.2" marker-end="url(#ahs)"/>`; }
  const cur = (a, b, bend) => { const [x1, y1] = NODES[a].at, [x2, y2] = NODES[b].at; const mx = (x1 + x2) / 2 + (y2 - y1) * bend, my = (y1 + y2) / 2 - (x2 - x1) * bend; const ex = x2 + (mx - x2) * 0.18, ey = y2 + (my - y2) * 0.18; return `M${x1} ${y1} Q${mx} ${my} ${ex} ${ey}`; };
  if (prev && now) s += `<path d="${cur(prev, now, 0.22)}" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round" marker-end="url(#ah)"/>`;
  if (next && now) s += `<path d="${cur(now, next, -0.25)}" fill="none" stroke="currentColor" stroke-opacity=".4" stroke-width="1.6" marker-end="url(#ahs)"/>`;
  for (const [k, n] of Object.entries(NODES)) {
    const used = counts[k], [x, y] = n.at, rr = used ? r(k) : 14;
    const label = words === "plain" ? ADDRS[k].chord.replace("°7", "°") : k;
    let g = "";
    if (k === now) g += `<circle cx="${x}" cy="${y}" r="${rr + 7}" fill="none" stroke="currentColor" stroke-width="2.5"/>`;
    // every colored mark gets a cream hairline, so tension never melts into a tension-colored screen
    g += used ? `<circle cx="${x}" cy="${y}" r="${rr}" fill="${FILL[n.fn]}" stroke="currentColor" stroke-opacity="${n.sat ? 0.95 : 0.75}" stroke-width="${n.sat ? 2 : 1.5}"/>` : `<circle cx="${x}" cy="${y}" r="${rr}" fill="none" stroke="currentColor" stroke-opacity=".4" stroke-width="1.3" stroke-dasharray="3 3"/>`;
    g += `<text x="${x}" y="${y + 4.5}" text-anchor="middle" class="${n.sat || label.length > 3 ? "nl s" : "nl"}" ${used ? `fill="${INK[n.fn]}"` : `fill="currentColor" fill-opacity=".5"`}>${label}</text>`;
    s += links && used ? `<a href="${ideaA(k)}" aria-label="${ADDRS[k].name}">${g}</a>` : g;
  }
  return s + `</svg>`;
}

const FN_WORD = { T: "Home", S: "Away", D: "Tension" };
const FN_TERM = { T: "Tonic", S: "Subdominant", D: "Dominant" };
const FN_LINE = { T: "Settled. This is where the music rests.", S: "A step away from home.", D: "It wants to move: it leans forward." };
const QUAL = { "": "", m: "m", "7": "7", maj7: "maj7", m7: "m7", dim7: "°7", "7sus4": "7sus4" };
const ACCS = (n) => n.replace("#", acc("♯")).replace(/([A-G])b/, "$1♭");
export const chordText = (c) => c.split("/")[0].replace("dim7", "°7").replace("#", "♯");
function chordHTML(sym) {
  const [main, bass] = sym.split("/"); const m = /^([A-G][#b]?)(.*)$/.exec(main);
  const q = QUAL[m[2]] ?? m[2];
  return `${ACCS(m[1])}${q ? `<span class="sup">${q}</span>` : ""}${bass ? `<span class="over">over ${ACCS(bass)}</span>` : ""}`;
}
const NAMES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
function clockSVG(b) {
  const P = (pc, r) => [200 + r * Math.sin((pc / 12) * Math.PI * 2), 200 - r * Math.cos((pc / 12) * Math.PI * 2)];
  const col = FILL[b.fn];
  let s = `<svg viewBox="0 0 400 400" class="clk"><circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="2"/>`;
  s += `<polygon points="${b.pcs.map((pc) => P(pc, 140).join(",")).join(" ")}" fill="${col}" fill-opacity=".85" stroke="currentColor" stroke-opacity=".75" stroke-width="1.5" stroke-linejoin="round"/>`;
  for (let pc = 0; pc < 12; pc++) { const on = b.pcs.includes(pc), [x, y] = P(pc, 140), [lx, ly] = P(pc, 172);
    s += on ? `<circle cx="${x}" cy="${y}" r="9" fill="#f7f1e6"/>` : `<circle cx="${x}" cy="${y}" r="3" fill="currentColor" fill-opacity=".35"/>`;
    s += `<text x="${lx}" y="${ly + 6}" text-anchor="middle" font-family="Archivo" font-size="17" font-weight="${on ? 750 : 500}" fill="currentColor" fill-opacity="${on ? 1 : 0.45}">${NAMES[pc]}</text>`; }
  return s + `</svg>`;
}

// ---------- the Keys lens: the bar's notes on a piano, left hand and right hand, the sounding note flashing
const LO = 36, HI = 84, BLACK = new Set([1, 3, 6, 8, 10]);
const BAR_NOTES = Array.from({ length: 35 }, () => []);
for (const n of BWV846_NOTES.notes) BAR_NOTES[Math.min(34, Math.floor(n[0] / 16))].push(n);
function keysSVG(b) {
  const lit = new Set(b.voicing), lh = b.voicing.slice(0, 2), col = FILL[b.fn];
  const whites = []; for (let m = LO; m <= HI; m++) if (!BLACK.has(m % 12)) whites.push(m);
  const W = 400 / whites.length, xOf = (m) => whites.indexOf(m) * W;
  let s = `<svg viewBox="0 0 400 150" class="keys">`;
  for (const m of whites) {
    const on = lit.has(m);
    s += `<rect data-m="${m}" x="${xOf(m) + 0.6}" y="0" width="${W - 1.2}" height="140" rx="3" fill="${on ? col : "#f7f1e6"}" fill-opacity="${on ? 1 : 0.92}" stroke="${on ? "#f7f1e6" : "none"}" stroke-width="1.5"/>`;
    if (m % 12 === 0) s += `<text x="${xOf(m) + W / 2}" y="132" text-anchor="middle" font-size="9" font-family="Archivo" font-weight="600" fill="#2e1d07" fill-opacity=".55">C${m / 12 - 1}</text>`;
    if (on) s += `<circle cx="${xOf(m) + W / 2}" cy="118" r="3.5" fill="${b.fn === "T" ? "#2e1d07" : "#f7f1e6"}"/>`;
  }
  for (let m = LO; m <= HI; m++) if (BLACK.has(m % 12)) {
    const on = lit.has(m), x = xOf(m - 1) + W * 0.66;
    s += `<rect data-m="${m}" x="${x}" y="0" width="${W * 0.68}" height="88" rx="2" fill="${on ? col : "#26221c"}" stroke="${on ? "#f7f1e6" : "none"}" stroke-width="1.5"/>`;
  }
  s += `</svg>`;
  const nm = (m) => NAMES[m % 12];
  return `<div class="keyswrap">${s}<div class="hands"><div><span class="kicker">Left hand · held</span><b>${acc(lh.map(nm).join("  "))}</b></div><div><span class="kicker">Right hand · rolling</span><b>${acc(b.voicing.slice(2).map(nm).join("  "))}</b></div></div></div>`;
}

export function player(params) {
  const html = `<main class="screen full pl-screen">
    ${topBar("Prelude in C · Bach", ICON.save, { aa: true })}
    <nav class="lenses" id="plens">${[["atlas", "Atlas"], ["keys", "Keys"], ["dials", "Dials"], ["clock", "Clock"], ["story", "Story"]].map(([k, l]) => `<a data-l="${k}" class="${k === lens ? "on" : ""}">${l}</a>`).join("")}</nav>
    <div id="stage" class="stage"></div>
    <div class="now">
      <div class="now-top"><div class="now-chord disp" id="nchord"></div><div class="then t-s soft" id="nthen"></div></div>
      <p class="t-l" id="nline"></p>
      <div class="golinks" id="nlinks"></div>
    </div>
    <div class="strip-h t-xs"><span id="psec"></span><span class="soft" id="pbar"></span></div>
    <div class="strip" id="strip">${BACH.bars.map((x, i) => `<i class="fn-${x.fn}${i && BACH.sections.some((s) => s.from === x.bar) ? " sec0" : ""}" data-b="${i}"></i>`).join("")}</div>
    <div class="transport">
      <button class="tool" id="loop" aria-label="Loop">Loop</button>
      <button class="tr" id="prev" aria-label="Previous bar">${ICON.prev}</button><button class="tr big" id="pp" aria-label="Play">${ICON.play}</button><button class="tr" id="next" aria-label="Next bar">${ICON.next}</button>
      <button class="tool" id="tempo" aria-label="Tempo">♩ 66</button>
    </div>
  </main>
  <style>
    body { transition: background-color .7s ease; }
    .stage { margin-top: 12px; min-height: 200px; }
    .now { margin-top: 14px; }
    .now-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
    .now-chord { font-size: 84px; display: flex; align-items: flex-start; min-height: 74px; }
    .now-chord .over { font-size: 22px; letter-spacing: 0; font-stretch: 100%; font-weight: 600; color: var(--soft); align-self: flex-end; margin: 0 0 10px 12px; }
    .then { text-align: right; padding-top: 10px; white-space: nowrap; } .then b { display: block; color: var(--ink); font-size: 20px; font-weight: 700; }
    .golinks { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 10px; font-size: 16px; }
    .story-card .disp { font-size: 46px; }
    .story-card p { font-size: 18px; margin-top: 10px; line-height: 1.45; }
    .bigdials .dl svg { max-width: 76px; } .bigdials .dl b { font-size: 13.5px; }
    .keys { width: 100%; height: auto; } .keys rect { transition: fill .08s; } .keys rect.snd { fill: #fffdf6 !important; filter: drop-shadow(0 0 6px #fffdf6); }
    .hands { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; } .hands b { display: block; font: 800 34px/1 Archivo; font-stretch: 62%; margin-top: 4px; white-space: pre; }
    .strip-h { display: flex; justify-content: space-between; margin-top: 22px; font-weight: 650; }
    .strip { position: relative; display: grid; grid-template-columns: repeat(35, 1fr); gap: 2px; align-items: end; height: 40px; margin-top: 8px; cursor: pointer; }
    .strip i { height: 26px; border-radius: 3px; background: var(--c); box-shadow: inset 0 0 0 1px rgba(247,241,230,.45); opacity: .5; transition: opacity .3s, height .2s; }
    .strip i.sec0 { margin-left: 3px; }
    .strip i.past { opacity: 1; }
    .strip i.on { height: 38px; opacity: 1; box-shadow: 0 0 0 2px var(--ink); }
    .strip i.lp { border-bottom: 3px solid var(--ink); }
    .transport { display: grid; grid-template-columns: 1fr auto auto auto 1fr; justify-items: center; align-items: center; gap: 18px; margin-top: 20px; }
    .tool { font-weight: 650; font-size: 14.5px; height: 36px; padding: 0 14px; border-radius: 999px; box-shadow: inset 0 0 0 1px var(--hair); color: var(--soft); white-space: nowrap; }
    .tool.on { box-shadow: inset 0 0 0 1.5px var(--ink); color: var(--ink); }
    .tr { width: 44px; height: 44px; display: grid; place-items: center; color: var(--ink); } .tr svg { width: 24px; height: 24px; }
    .tr.big { width: 72px; height: 72px; border-radius: 50%; background: var(--ink); color: var(--paper); } .tr.big svg { width: 26px; height: 26px; margin-left: 3px; }
    .tr.big.on svg { margin-left: 0; }
  </style>`;
  return {
    html,
    h: S.started() ? FN_H[BACH.bars[S.bar()].fn] : undefined,
    crumb: () => `Playing · bar ${S.bar() + 1}`,
    async mount(root) {
      const $ = (id) => root.querySelector("#" + id);
      // a Moment link (#player?bar=12) jumps there and plays; the address then settles back to #player so Back never re-seeks
      if (params && params.get("bar")) { S.seekBar(+params.get("bar") - 1); S.play(); history.replaceState(null, "", "#player"); }
      let shown = -1;
      const PAUSE = `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>`;
      const P = plain();
      function stage(i) {
        const b = BACH.bars[i], prev = i > 0 ? BACH.bars[i - 1].addr : null, next = i < 34 ? BACH.bars[i + 1].addr : null;
        if (lens === "atlas") return atlasSVG({ now: b.addr, prev: prev !== b.addr ? prev : null, next: next !== b.addr ? next : null, links: true });
        if (lens === "keys") return keysSVG(b);
        if (lens === "clock") return clockSVG(b);
        if (lens === "dials") { const top = Object.entries(b.dials).sort((x, y) => y[1] - x[1])[0][0]; return `<div class="card bigdials">${dialsRow(b.dials)}<p class="t-m" style="margin-top:14px">This bar leans most toward <b>${DIAL_NAMES[top].toLowerCase()}</b>. Whole piece: Key ${BACH.dials.key.toFixed(2)}, Squares ${BACH.dials.squares.toFixed(2)}.</p></div>`; }
        const sec = BACH.sections.find((s) => b.bar >= s.from && b.bar <= s.to);
        return `<div class="card story-card"><p class="kicker">Bars ${sec.from}–${sec.to}</p><h2 class="disp">${sec.title}</h2><p>${sec.story}</p></div>`;
      }
      function draw() {
        const i = S.bar(), b = BACH.bars[i];
        if (i !== shown) {
          shown = i;
          $("stage").innerHTML = stage(i);
          $("nchord").innerHTML = chordHTML(b.chord);
          const nx = BACH.bars.slice(i + 1).find((x) => x.chord !== b.chord);
          $("nthen").innerHTML = nx ? `then<b>${acc(chordText(nx.chord))}</b>` : "";
          const extra = b.pivot ? ` Door chord: ${b.pivot}.` : b.applied ? ` Borrowed: it points at ${b.applied}.` : b.note ? ` ${b.note[0].toUpperCase() + b.note.slice(1)}.` : "";
          $("nline").innerHTML = P ? `<b>${FN_WORD[b.fn]}.</b> ${FN_LINE[b.fn]}${extra}` : `<b>${FN_TERM[b.fn]}.</b> ${b.rn} in ${b.key} major.${extra}`;
          const k = kind(b.chord), a = ADDRS[b.addr];
          $("nlinks").innerHTML = `<a class="go lnk" href="${ideaK(b.chord)}">${k[0].toUpperCase() + k.slice(1).replace("7th", "seventh")}</a><a class="go lnk" href="${ideaA(b.addr)}">${P ? a.name : b.addr + " · " + a.name.toLowerCase()}</a>`;
          const sec = BACH.sections.find((s) => b.bar >= s.from && b.bar <= s.to);
          $("psec").textContent = `${sec.title} · bars ${sec.from}–${sec.to}`;
          $("pbar").textContent = `bar ${b.bar} of 35`;
          const tb = root.querySelector(".trail b"); if (tb) tb.textContent = `Playing · bar ${b.bar}`;
          if (S.started()) { const c = hc(FN_H[b.fn]); document.body.style.setProperty("--paper", c.deep); document.body.style.setProperty("--card", `color-mix(in oklab, ${c.deep} 90%, #ffffff 10%)`); document.body.style.setProperty("--paper-2", `color-mix(in oklab, ${c.deep} 86%, #ffffff 14%)`); document.querySelector('meta[name="theme-color"]')?.setAttribute("content", c.deep); }
        }
        const L = S.loop;
        root.querySelectorAll("#strip i").forEach((el, k) => { el.classList.toggle("on", k === i); el.classList.toggle("past", k < i); el.classList.toggle("lp", !!L && k >= L.from && k <= L.to); });
        $("loop").classList.toggle("on", !!L); $("loop").textContent = L ? (L.from === L.to ? `Loop ${L.from + 1}` : `Loop ${L.from + 1}–${L.to + 1}`) : "Loop";
        $("tempo").textContent = `♩ ${S.tempo()}`; $("tempo").classList.toggle("on", S.tempo() !== 66);
        $("pp").innerHTML = S.playing() ? PAUSE : ICON.play;
        $("pp").classList.toggle("on", S.playing());
      }
      function sounding() {
        if (lens !== "keys") return;
        const p = S.pos(), on = new Set(BAR_NOTES[S.bar()].filter((n) => n[0] <= p && p < n[0] + Math.min(n[1], 1.2)).map((n) => n[2]));
        root.querySelectorAll(".keys rect").forEach((r) => r.classList.toggle("snd", on.has(+r.dataset.m)));
      }
      root.querySelectorAll("#plens a").forEach((a) => a.addEventListener("click", () => { lens = a.dataset.l; root.querySelectorAll("#plens a").forEach((x) => x.classList.toggle("on", x === a)); shown = -1; draw(); }));
      $("pp").addEventListener("click", () => S.toggle());
      $("prev").addEventListener("click", () => S.seekBar(S.bar() - 1));
      $("next").addEventListener("click", () => S.seekBar(S.bar() + 1));
      $("tempo").addEventListener("click", () => S.nextTempo());
      $("loop").addEventListener("click", () => S.setLoop(S.loop ? null : { from: S.bar(), to: S.bar() }));
      // the strip: tap a bar to go there; with Loop on, tapping stretches the loop to include that bar
      $("strip").addEventListener("click", (e) => {
        const r = e.currentTarget.getBoundingClientRect(), k = Math.max(0, Math.min(34, Math.floor(((e.clientX - r.left) / r.width) * 35)));
        if (S.loop) { S.setLoop(k < S.loop.from ? { from: k, to: S.loop.to } : { from: S.loop.from, to: k }); S.seekBar(S.loop.from); }
        else S.seekBar(k);
      });
      const off1 = S.onChange(draw), off2 = S.onTick(sounding);
      draw();
      return () => { off1(); off2(); };
    },
  };
}
let lens = "atlas";
