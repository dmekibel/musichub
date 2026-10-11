// Today and the Player.
import { sleeve, shell, roomHead, topBar, ICON, acc, hc, dialsRow, DIAL_NAMES, FN_H } from "../ui.js";
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

const FN_WORD = { T: "Home", S: "Away", D: "Tension" };
const FN_LINE = { T: "Settled. This is where the music rests.", S: "A step away from home.", D: "It wants to move: it leans forward." };
const QUAL = { "": "", m: "m", "7": "7", maj7: "maj7", m7: "m7", dim7: "°7", "7sus4": "7sus4" };
const QWORD = { "": "major", m: "minor", "7": "dominant seventh", maj7: "major seventh", m7: "minor seventh", dim7: "diminished seventh", "7sus4": "suspended seventh" };
const ACCS = (n) => n.replace("#", acc("♯")).replace(/([A-G])b/, "$1♭");
function chordHTML(sym) {
  const [main, bass] = sym.split("/"); const m = /^([A-G][#b]?)(.*)$/.exec(main);
  const q = QUAL[m[2]] ?? m[2];
  return `${ACCS(m[1])}${q ? `<span class="sup">${q}</span>` : ""}${bass ? `<span class="over">over ${ACCS(bass)}</span>` : ""}`;
}
function clockSVG(b) {
  const P = (pc, r) => [200 + r * Math.sin((pc / 12) * Math.PI * 2), 200 - r * Math.cos((pc / 12) * Math.PI * 2)];
  const names = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"], col = FILL[b.fn];
  let s = `<svg viewBox="0 0 400 400" class="clk"><circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="2"/>`;
  s += `<polygon points="${b.pcs.map((pc) => P(pc, 140).join(",")).join(" ")}" fill="${col}" fill-opacity=".85" stroke="currentColor" stroke-opacity=".5" stroke-width="1.5" stroke-linejoin="round"/>`;
  for (let pc = 0; pc < 12; pc++) { const on = b.pcs.includes(pc), [x, y] = P(pc, 140), [lx, ly] = P(pc, 172);
    s += on ? `<circle cx="${x}" cy="${y}" r="9" fill="#f7f1e6"/>` : `<circle cx="${x}" cy="${y}" r="3" fill="currentColor" fill-opacity=".35"/>`;
    s += `<text x="${lx}" y="${ly + 6}" text-anchor="middle" font-family="Archivo" font-size="17" font-weight="${on ? 750 : 500}" fill="currentColor" fill-opacity="${on ? 1 : 0.45}">${names[pc]}</text>`; }
  return s + `</svg>`;
}

export function player() {
  const html = `<main class="screen full pl-screen">
    ${topBar("Prelude in C · Bach", ICON.save)}
    <nav class="lenses" id="plens"><a data-l="atlas" class="on">Atlas</a><a data-l="dials">Dials</a><a data-l="clock">Clock</a><a data-l="story">Story</a></nav>
    <div id="stage" class="stage"></div>
    <div class="now">
      <div class="now-chord disp" id="nchord"></div>
      <p class="t-l" id="nline"></p>
      <div class="pills" id="npills"></div>
    </div>
    <div class="ribbon" id="ribbon"></div>
    <div class="scrub"><div class="meter" id="meter"><i id="fill"></i></div><div class="t-xs soft sc-lab"><span id="pbar"></span><span>♩ 66</span></div></div>
    <div class="transport"><button class="tr" id="prev" aria-label="Previous bar">${ICON.prev}</button><button class="tr big" id="pp" aria-label="Play">${ICON.play}</button><button class="tr" id="next" aria-label="Next bar">${ICON.next}</button></div>
  </main>
  <style>
    body { transition: background-color .7s ease; }
    .stage { margin-top: 12px; min-height: 200px; }
    .atlas, .clk { width: 100%; height: auto; border-radius: 10px; color: var(--ink); }
    .atlas .ra { font: 800 26px Archivo; font-stretch: 62%; fill: currentColor; }
    .atlas .rb { font: 600 11.5px Archivo; fill: currentColor; fill-opacity: .6; }
    .atlas .nl { font: 700 14px Archivo; } .atlas .nl.s { font-size: 11px; }
    .now { margin-top: 16px; }
    .now-chord { font-size: 84px; display: flex; align-items: flex-start; min-height: 74px; }
    .now-chord .over { font-size: 22px; letter-spacing: 0; font-stretch: 100%; font-weight: 600; color: var(--soft); align-self: flex-end; margin: 0 0 10px 12px; }
    .pills { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
    .story-card .disp { font-size: 46px; }
    .story-card p { font-size: 18px; margin-top: 10px; line-height: 1.45; }
    .bigdials .dl svg { max-width: 76px; } .bigdials .dl b { font-size: 13.5px; }
    .ribbon { position: relative; display: grid; grid-template-columns: repeat(8, 1fr); gap: 3px; margin-top: 22px; padding-top: 18px; }
    .rb-key { position: absolute; top: 0; font-size: 11.5px; font-weight: 650; color: var(--soft); border-top: 1.5px solid var(--faint); padding-top: 2px; }
    .rb-bar { position: relative; text-align: center; padding: 6px 0 4px; border-radius: 6px; cursor: pointer; }
    .rb-bar.on { box-shadow: inset 0 0 0 1.5px var(--ink); }
    .rb-bar b { display: block; font-size: 13px; font-weight: 700; white-space: nowrap; }
    .rb-bar span { display: block; font-size: 11.5px; color: var(--soft); margin-top: 1px; }
    .rb-bar i { display: block; height: 6px; border-radius: 3px; margin: 6px 4px 0; background: var(--c); }
    .rb-bar em { display: block; font-style: normal; font-size: 11px; color: var(--faint); margin-top: 4px; }
    .scrub { margin-top: 22px; } .scrub .meter { height: 8px; cursor: pointer; } .sc-lab { display: flex; justify-content: space-between; margin-top: 8px; }
    .transport { display: flex; justify-content: center; align-items: center; gap: 40px; margin-top: 16px; }
    .tr { width: 44px; height: 44px; display: grid; place-items: center; color: var(--ink); } .tr svg { width: 24px; height: 24px; }
    .tr.big { width: 72px; height: 72px; border-radius: 50%; background: var(--ink); color: var(--paper); } .tr.big svg { width: 26px; height: 26px; margin-left: 3px; }
    .tr.big.on svg { margin-left: 0; }
  </style>`;
  return {
    html,
    async mount(root) {
      const S = await import("../sound.js");
      const $ = (id) => root.querySelector("#" + id);
      let lens = "atlas", shown = -1;
      const PAUSE = `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>`;
      function stage(i) {
        const b = BACH.bars[i], prev = i > 0 ? BACH.bars[i - 1].addr : null, next = i < 34 ? BACH.bars[i + 1].addr : null;
        if (lens === "atlas") return atlasSVG({ now: b.addr, prev: prev !== b.addr ? prev : null, next: next !== b.addr ? next : null });
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
          const extra = b.pivot ? ` Door chord: ${b.pivot}.` : b.applied ? ` Borrowed: it points at ${b.applied}.` : b.note ? ` ${b.note[0].toUpperCase() + b.note.slice(1)}.` : "";
          $("nline").innerHTML = `<b>${FN_WORD[b.fn]}.</b> ${FN_LINE[b.fn]}${extra}`;
          const sec = BACH.sections.find((s) => b.bar >= s.from && b.bar <= s.to);
          const top = Object.entries(b.dials).sort((x, y) => y[1] - x[1])[0];
          $("npills").innerHTML = `<span class="pill"><span class="dot fn-${b.fn}"></span>${sec.title}</span><span class="pill">${b.rn} in ${b.key} major</span><span class="pill">${DIAL_NAMES[top[0]]} ${top[1].toFixed(2)}</span>`;
          const w0 = Math.max(0, Math.min(27, i - 3)), win = BACH.bars.slice(w0, w0 + 8);
          const g = win.map((x, k) => (x.key === "G" ? k : -1)).filter((k) => k >= 0);
          $("ribbon").innerHTML = (g.length ? `<div class="rb-key" style="left:${(g[0] / 8) * 100}%;width:calc(${(g.length / 8) * 100}% - 3px)">visiting G</div>` : "") +
            win.map((x) => `<div class="rb-bar${x.bar === b.bar ? " on" : ""}" data-b="${x.bar - 1}"><b>${x.chord.split("/")[0].replace("dim7", "°7").replace("maj7", "△7").replace("#", "♯")}</b><span>${x.addr}</span><i class="fn-${x.fn}"></i><em>${x.bar}</em></div>`).join("");
          $("ribbon").querySelectorAll(".rb-bar").forEach((el) => el.addEventListener("click", () => S.seekBar(+el.dataset.b)));
          $("pbar").textContent = `bar ${b.bar} of 35`;
          // the iconic move: while playing, the screen takes the color of the harmony
          if (S.started()) { const c = hc(FN_H[b.fn]); document.body.style.setProperty("--paper", c.deep); document.body.style.setProperty("--card", `color-mix(in oklab, ${c.deep} 90%, #ffffff 10%)`); document.body.style.setProperty("--paper-2", `color-mix(in oklab, ${c.deep} 86%, #ffffff 14%)`); document.querySelector('meta[name="theme-color"]')?.setAttribute("content", c.deep); }
        }
        $("pp").innerHTML = S.playing() ? PAUSE : ICON.play;
        $("pp").classList.toggle("on", S.playing());
        $("fill").style.width = (S.progress() * 100).toFixed(2) + "%";
      }
      root.querySelectorAll("#plens a").forEach((a) => a.addEventListener("click", () => { lens = a.dataset.l; root.querySelectorAll("#plens a").forEach((x) => x.classList.toggle("on", x === a)); shown = -1; draw(); }));
      $("pp").addEventListener("click", () => S.toggle());
      $("prev").addEventListener("click", () => S.seekBar(S.bar() - 1));
      $("next").addEventListener("click", () => S.seekBar(S.bar() + 1));
      $("meter").addEventListener("click", (e) => { const r = e.currentTarget.getBoundingClientRect(); S.seekFrac((e.clientX - r.left) / r.width); });
      const off1 = S.onChange(draw), off2 = S.onTick(() => { $("fill").style.width = (S.progress() * 100).toFixed(2) + "%"; });
      draw();
      return () => { off1(); off2(); };
    },
  };
}
