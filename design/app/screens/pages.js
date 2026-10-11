// The one page template, shown for three nouns: a piece, a style and a shape.
// 1 sleeve · 2 one line + listen · 3 fingerprint with lenses · 4 because… · 5 compared to · 6 read · 7 learn it / try it
import { sleeve, page, topBar, ICON, dialsRow, hc, SHAPES } from "../ui.js";
import { BACH, BOSSA, SQUARES } from "../data.js";
import { atlasSVG } from "./listen.js";

const css = `<style>
  .lead { margin-top: 16px; }
  .facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 14px; }
  .fact b { display: block; font: 800 34px/0.9 Archivo; font-stretch: 62%; }
  .fact span { display: block; font-size: 13px; color: var(--soft); margin-top: 4px; line-height: 1.3; }
  .palette { display: flex; gap: 3px; height: 58px; margin-top: 10px; }
  .chipx { border-radius: 6px; display: flex; flex-direction: column; justify-content: flex-end; padding: 6px 7px; font-size: 12px; line-height: 1.15; overflow: hidden; color: #f7f1e6; background: var(--c); min-width: 0; }
  .chipx.fn-T { color: #2e1d07; }
  .chipx b { font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .tile { display: block; padding: 14px; border-radius: 14px; background: var(--card); box-shadow: inset 0 0 0 1px var(--hair); }
  .tile b { display: block; font-weight: 650; margin-top: 10px; }
  .tile span { display: block; font-size: 13.5px; color: var(--soft); }
  .read { font-size: 16.5px; line-height: 1.55; }
  .tree { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; }
  .tree .col { display: grid; gap: 10px; }
  .tnode { display: flex; align-items: center; gap: 10px; font-size: 14px; }
  .tnode b { display: block; font-weight: 650; font-size: 14.5px; }
  .tnode span { display: block; font-size: 12.5px; color: var(--soft); }
  .tmid { text-align: center; }
  .tmid .sleeve { margin: 0 auto; }
  .tmid b { display: block; font-weight: 650; font-size: 14px; margin-top: 6px; }
  .three .sleeve { width: 100%; }
  .big-neck svg { width: 100%; max-width: 230px; margin: 0 auto; display: block; }
</style>`;

const rowLink = (href, sl, title, sub, why = "") => `<a class="row" href="${href}">${sl}<span class="txt"><b>${title}</b><span>${sub}</span></span>${why ? `<span class="why">${why}</span>` : ""}</a>`;

// ---------- piece
export function piece() {
  const palette = BACH.palette.map((p) => `<div class="chipx fn-${p.fn}" style="flex:${p.n}"><b>${p.name}</b>${p.n}</div>`).join("");
  return page(`${css}
    ${topBar("", ICON.share)}
    ${sleeve({ h: BACH.h, shape: "wheel", data: { fns: BACH.fns }, name: "Prelude\nin C", tag: "J. S. Bach · 1722", size: "xl" })}
    <p class="kicker lead">Piece · The Well-Tempered Clavier, Book I</p>
    <p class="t-l" style="margin-top:4px">Thirty-five bars, one chord each: the most famous trip from home and back.</p>
    <div class="actions"><a class="btn" href="#player">${ICON.play}Listen</a><a class="btn ghost">${ICON.save}Save</a><a class="btn ghost" href="#share">${ICON.share}</a></div>

    <nav class="lenses"><a class="on">Harmony</a><a>Shape</a><a>Rhythm</a><a>Form</a><a>Story</a></nav>
    <section class="sec" style="margin-top:18px">
      <div class="sec-h"><h2 class="disp">Its footprint</h2><a href="#player">Open the Atlas</a></div>
      ${atlasSVG({ now: null, prev: null, next: null })}
      <div class="facts">
        <div class="fact"><b>${BACH.fnCount.D} of 35</b><span>bars in tension</span></div>
        <div class="fact"><b>3 of 3</b><span>diminished squares used</span></div>
        <div class="fact"><b>8 bars</b><span>waiting on a low G</span></div>
      </div>
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">Five Dials</h2><a href="#shape">What's this?</a></div>
      ${dialsRow(BACH.dials, { squares: "all 3 cancel" })}
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">Harmonic palette</h2><a>By time · skeleton · spice</a></div>
      <div class="palette">${palette}</div>
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">Because…</h2></div>
      ${rowLink("#shape", sleeve({ h: 1, shape: "chord", data: { pcs: [0, 3, 6, 9] }, size: "s" }), "The diminished square", "Barry Harris's building block", "bars 12, 14, 22, 23, 28")}
      ${rowLink("#piece", sleeve({ h: 0.45, shape: "wheel", data: { fns: BACH.fns }, size: "s" }), "Ave Maria · Gounod, 1859", "a melody laid over this prelude", "uses it as the accompaniment")}
      ${rowLink("#piece", sleeve({ h: 0.7, shape: "wheel", data: { fns: "TSDTDSDTDDTSDTSDDT".split("") }, size: "s" }), "Prelude in C minor", "the next prelude in the book", "another one-pattern prelude")}
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">Read</h2></div>
      <p class="read">Bach finished Book I of <i>The Well-Tempered Clavier</i> in 1722: a prelude and fugue in every major and minor key. This first prelude is one pattern, a broken chord, played on a different chord in every bar. Nothing distracts from the harmony, which is why it teaches so well.</p>
    </section>
    <section class="sec two">
      <a class="tile" href="#lesson">${sleeve({ h: 1, shape: "path", size: "s" })}<b>Learn it</b><span>Lesson 3 · Hearing tension</span></a>
      <a class="tile" href="#lab">${sleeve({ h: 1, shape: "chord", data: { pcs: [1, 4, 7, 10] }, size: "s" })}<b>Try it</b><span>The three squares, in the Lab</span></a>
    </section>
  `);
}

// ---------- style
export function style() {
  const S = BOSSA;
  const neck = SHAPES.necklace({ on: S.clave, n: 16 }, hc(S.h)).replace(/fill="#f7f1e6"/g, 'fill="#23201c"');
  const nodes = (arr, href) => arr.map(([n, sub, h]) => `<a class="tnode" href="${href}">${sleeve({ h, shape: "tree", size: "xs" })}<span><b>${n}</b><span>${sub}</span></span></a>`).join("");
  return page(`${css}
    ${topBar("", ICON.share)}
    ${sleeve({ h: S.h, shape: "necklace", data: { on: S.clave, n: 16 }, name: "Bossa\nnova", tag: "Style · Rio de Janeiro, late 1950s", size: "xl" })}
    <p class="t-l lead">${S.line}</p>
    <div class="actions"><a class="btn">${ICON.play}Listen · 12 pieces</a><a class="btn ghost">${ICON.save}Save</a></div>

    <nav class="lenses"><a class="on">Rhythm</a><a>Harmony</a><a>Shape</a><a>People</a><a>Story</a></nav>
    <section class="sec" style="margin-top:18px">
      <div class="card big-neck"><svg viewBox="0 0 100 100" style="background:${hc(S.h).tint};border-radius:12px">${neck}</svg>
      <p style="margin-top:12px"><b>The bossa clave.</b> Five hits spread as evenly as possible over sixteen pulses: samba's pulse, slowed down and spread across the bar.</p>
      <p class="t-s soft" style="margin-top:6px">Shape twin: the same "most even" idea that shapes the pentatonic scale.</p></div>
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">Family</h2><a href="#river">See the river</a></div>
      <div class="tree"><div class="col">${nodes(S.roots, "#river")}</div>
        <div class="tmid">${sleeve({ h: S.h, shape: "necklace", data: { on: S.clave, n: 16 }, size: "s" })}<b>Bossa nova</b></div>
        <div class="col">${nodes(S.became, "#river")}</div></div>
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">People</h2></div>
      ${S.people.map(([n, r]) => rowLink("#style", sleeve({ h: S.h, shape: "necklace", data: { on: S.clave, n: 16 }, size: "s" }), n, r)).join("")}
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">Key pieces</h2></div>
      <div class="hscroll">${S.pieces.map(([n, y, h]) => `<a class="item" href="#piece">${sleeve({ h, shape: "wheel", data: { fns: "TSDTSDDTTSDT".split("") }, name: n.split(" ").slice(0, 2).join("\n"), size: "m" })}<b>${n}</b><span>${y}</span></a>`).join("")}</div>
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">Five Dials</h2><a href="#compare">Compare with Bach</a></div>
      ${dialsRow(S.dials)}
    </section>
    <section class="sec two">
      <a class="tile" href="#learn">${sleeve({ h: S.h, shape: "path", size: "s" })}<b>Learn it</b><span>The five things that make it bossa nova</span></a>
      <a class="tile" href="#explore">${sleeve({ h: S.h, shape: "pin", size: "s" })}<b>Go there</b><span>Rio de Janeiro on the Atlas, 1950s</span></a>
    </section>
    <p class="illus">Illustrative content and values for this mockup.</p>
  `);
}

// ---------- shape
export function shape() {
  const kids = SQUARES.map((q) => `<a class="tile" href="#lab" style="text-align:center">${sleeve({ h: q.h, shape: "chord", data: { pcs: q.pcs }, size: "m" })}<b>${q.names.join(" ")}</b><span>${q.axis}</span></a>`).join("");
  return page(`${css}
    ${topBar("", ICON.share)}
    ${sleeve({ h: 1, shape: "chord", data: { pcs: [0, 3, 6, 9] }, name: "The\nsquare", tag: "Shape · 4 notes in 12, perfectly even", size: "xl" })}
    <p class="t-l lead">Four notes, each a minor third apart: a perfect square on the 12-note clock. Musicians call it the diminished seventh. There are only three.</p>
    <div class="actions"><a class="btn">${ICON.play}Hear it</a><a class="btn ghost" href="#lab">Try it in the Lab</a></div>

    <section class="sec">
      <div class="sec-h"><h2 class="disp">The only three</h2></div>
      <div class="three" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">${kids}</div>
      <p class="t-s soft" style="margin-top:10px">Together they use all twelve notes exactly once.</p>
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">Move one note</h2></div>
      <div class="card"><p><b>Lower any note by a half step</b> and the square becomes a dominant seventh. <b>Raise one</b> and it becomes a minor sixth. Every square has eight children, and a plain G7 already measures 0.86 square.</p></div>
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">Where it lives</h2></div>
      ${rowLink("#piece", sleeve({ h: BACH.h, shape: "wheel", data: { fns: BACH.fns }, size: "s" }), "Prelude in C · Bach", "all three squares", "bars 12, 14, 22, 23, 28")}
      ${rowLink("#learn", sleeve({ h: 1, shape: "necklace", data: { on: [0, 2, 4, 5, 7, 8, 9, 11], n: 12 }, size: "s" }), "Barry Harris's 6th-diminished scale", "a sixth chord and a square, taking turns")}
      ${rowLink("#learn", sleeve({ h: 0.4, shape: "chord", data: { pcs: [2, 5, 8, 11] }, size: "s" }), "Lendvai's axis system", "Bartók's music, grouped by the same three")}
      ${rowLink("https://www.metaharmony.co.uk/", sleeve({ h: 0.0, shape: "chord", data: { pcs: [0, 3, 6, 9] }, size: "s" }), "Metaharmony · Tom", "a colour wheel built on the three squares", "external")}
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">Shape twin</h2></div>
      <div class="card" style="display:flex;gap:14px;align-items:center">${sleeve({ h: 0.2, shape: "necklace", data: { on: [0, 3, 6, 9], n: 12 }, size: "s" })}<p><b>The four beats of a 12/8 bar</b> are the same shape: four pulses out of twelve, perfectly even. A slow blues walks on a square.</p></div>
    </section>
    <section class="sec">
      <div class="sec-h"><h2 class="disp">Five Dials</h2></div>
      ${dialsRow({ key: 0, squares: 1, triangles: 0, hexagons: 0, cluster: 0 })}
      <p class="t-s soft" style="margin-top:8px">The square is the purest reading on the Squares dial. Every piece's Squares number measures how close it comes to this.</p>
    </section>
  `);
}
