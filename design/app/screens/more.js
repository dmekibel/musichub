// Compare, You, First run, Share card.
import { sleeve, shell, page, topBar, roomHead, ICON, hc, dialsRow, dialSVG, DIAL_NAMES, acc } from "../ui.js";
import { BACH } from "../data.js";

const GIANT = { h: 0.96, dials: { key: 0.31, squares: 0.12, triangles: 0.62, hexagons: 0.1, cluster: 0.14 }, tension: 0.7 };

export function compare() {
  const rowsDial = Object.keys(BACH.dials).map((k) => {
    const a = BACH.dials[k], b = GIANT.dials[k];
    return `<div class="cmp"><span class="cl">${dialSVG(k, a)}</span><span class="cm"><b>${DIAL_NAMES[k]}</b><span class="bars"><i style="width:${a * 100}%"></i></span><span class="bars r"><i style="width:${b * 100}%"></i></span></span><span class="cv num">${a.toFixed(2)}<br>${b.toFixed(2)}</span></div>`;
  }).join("");
  return page(`
    ${topBar("Compare", ICON.share)}
    <div class="two-up">
      <div>${sleeve({ h: BACH.h, shape: "wheel", data: { fns: BACH.fns }, name: "Prelude\nin C", size: "xl" })}<b>Prelude in C</b><span>Bach · 1722</span></div>
      <div>${sleeve({ h: GIANT.h, shape: "chord", data: { pcs: [11, 7, 3] }, name: "Giant\nSteps", size: "xl" })}<b>Giant Steps</b><span>Coltrane · 1959</span></div>
    </div>
    <p class="finding">Coltrane lives on the Triangles dial; Bach lives on Key. <span>Same math, two worlds: three keys a major third apart against one home key.</span></p>
    <section class="sec"><div class="sec-h"><h2 class="disp">Five Dials</h2><span class="t-xs soft">top Bach · bottom Coltrane</span></div>${rowsDial}</section>
    <section class="sec"><div class="sec-h"><h2 class="disp">Tension</h2></div>
      <div class="cmp"><span class="cl"></span><span class="cm"><b>Bars in tension</b><span class="bars"><i style="width:${(BACH.fnCount.D / 35) * 100}%"></i></span><span class="bars r"><i style="width:${GIANT.tension * 100}%"></i></span></span><span class="cv num">${Math.round((BACH.fnCount.D / 35) * 100)}%<br>${GIANT.tension * 100}%</span></div>
    </section>
    <p class="illus">Bach values are measured. Giant Steps values are illustrative for this mockup.</p>
    <style>
      .two-up { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
      .two-up b { display: block; font-weight: 650; margin-top: 8px; } .two-up span { font-size: 13px; color: var(--soft); }
      .finding { font: 700 19px/1.3 Archivo; margin-top: 18px; } .finding span { font-weight: 400; color: var(--soft); }
      .cmp { display: grid; grid-template-columns: 44px 1fr 44px; gap: 12px; align-items: center; padding: 10px 0; border-top: 1px solid var(--hair); }
      .cl svg { width: 44px; height: 44px; }
      .cm b { display: block; font-weight: 650; font-size: 14.5px; margin-bottom: 6px; }
      .bars { display: block; height: 8px; border-radius: 4px; background: var(--paper-2); overflow: hidden; margin-top: 4px; }
      .bars i { display: block; height: 100%; background: ${hc(BACH.h).field}; border-radius: 4px; }
      .bars.r i { background: ${hc(GIANT.h).field}; }
      .cv { font-size: 12.5px; color: var(--soft); text-align: right; line-height: 1.6; }
    </style>`);
}

export function you() {
  const ear = [["Intervals", 0.62], ["Chord kinds", 0.48], ["Home · away · tension", 0.71], ["Progressions", 0.2]];
  const saved = [[BACH.h, "wheel", "Prelude\nin C", "#piece"], [0.74, "necklace", "Bossa\nnova", "#style"], [1, "chord", "The\nsquare", "#shape"], [0.88, "necklace", "Art\nBlakey", "#explore"]];
  return shell(null, `
    <header class="roomhead"><h1 class="disp">You</h1><span class="me">D</span></header>
    <section class="sec" style="margin-top:18px"><div class="sec-h"><h2 class="disp">Your ear</h2><a href="#gym">Train</a></div>
      ${ear.map(([n, v]) => `<div class="er"><span>${n}</span><span class="meter"><i style="width:${v * 100}%"></i></span><b class="num">${Math.round(v * 100)}%</b></div>`).join("")}
      <p class="t-xs soft" style="margin-top:8px">Yours means you named it again on a later day.</p></section>
    <section class="sec"><div class="sec-h"><h2 class="disp">Your taste</h2><a>From 64 pieces</a></div>${dialsRow({ key: 0.38, squares: 0.21, triangles: 0.2, hexagons: 0.06, cluster: 0.12 })}
      <p class="t-s soft" style="margin-top:8px">You keep returning to squares: Barry Harris, bebop, Bach's darker bars.</p></section>
    <section class="sec"><div class="sec-h"><h2 class="disp">Saved</h2><a>Boards</a></div>
      <div class="hscroll">${saved.map(([h, s, n, href]) => `<a class="item" href="${href}">${sleeve({ h, shape: s, data: s === "wheel" ? { fns: BACH.fns } : s === "chord" ? { pcs: [0, 3, 6, 9] } : { on: [0, 3, 6, 10, 13], n: 16 }, name: n, size: "m" })}</a>`).join("")}</div></section>
    <p class="illus">Illustrative profile for this mockup.</p>
    <style>.er { display: grid; grid-template-columns: 1.2fr 1fr 44px; gap: 12px; align-items: center; padding: 10px 0; border-top: 1px solid var(--hair); font-size: 15px; } .er b { text-align: right; font-weight: 650; }</style>`);
}

export function welcome() {
  const opts = [[BACH.h, "wheel", "Hear it deeper", "What's happening in this music?", { fns: BACH.fns }], [0.74, "pin", "Travel", "History and music of the world", {}], [0.3, "path", "Learn to hear", "Ears and theory, step by step", {}], [1, "chord", "Play with theory", "Maps, squares, scales, tools", { pcs: [0, 3, 6, 9] }]];
  return page(`
    <p class="kicker" style="margin-top:20px">MusicHub</p>
    <h1 class="disp" style="font-size:76px;margin-top:6px">Hear what's inside music.</h1>
    <p class="t-l soft" style="margin-top:12px">What brings you here? Pick any; you can change it later.</p>
    <div class="wopts">${opts.map(([h, s, t, d, data], i) => `<a class="wopt${i === 0 ? " on" : ""}">${sleeve({ h, shape: s, data, size: "s" })}<span><b>${t}</b><span>${d}</span></span></a>`).join("")}</div>
    <p class="b" style="margin-top:24px">Do you play?</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">${["Piano", "Guitar", "Voice", "I make beats", "Not yet"].map((x, i) => `<span class="pill" style="${i === 0 ? "background:var(--ink);color:var(--paper)" : ""}">${x}</span>`).join("")}</div>
    <a class="btn" href="#today" style="width:100%;margin-top:28px">Continue</a>
    <style>.wopts { display: grid; gap: 10px; margin-top: 18px; } .wopt { display: flex; align-items: center; gap: 14px; padding: 10px; border-radius: 14px; background: var(--card); box-shadow: inset 0 0 0 1.5px var(--hair); } .wopt.on { box-shadow: inset 0 0 0 2px var(--ink); } .wopt b { display: block; font-weight: 650; } .wopt span span { font-size: 14px; color: var(--soft); }</style>`);
}

export function share() {
  const c = hc(1);
  return page(`
    ${topBar("Share", "")}
    <div class="story" style="--f:${c.field};--d:${c.deep};--i:${c.ink}">
      <span class="badge">MusicHub</span>
      <svg viewBox="0 0 100 100" class="sh">${`<circle cx="50" cy="50" r="38" fill="none" stroke="${c.ink}" stroke-opacity=".35"/>`}<polygon points="${[1, 4, 7, 10].map((p) => `${50 + 38 * Math.sin((p / 12) * Math.PI * 2)},${50 - 38 * Math.cos((p / 12) * Math.PI * 2)}`).join(" ")}" fill="${c.deep}"/></svg>
      <div class="big disp">C${acc("♯")}<span class="sup">°7</span></div>
      <p class="cap"><b>Bar 12 · Prelude in C · Bach</b>The Squares dial hits 1.00 here: a perfect diminished square.</p>
    </div>
    <div class="shbtns"><a class="btn">Save image</a><a class="btn ghost">Copy link</a></div>
    <style>
      .story { position: relative; aspect-ratio: 9 / 16; width: 78%; margin: 6px auto 0; border-radius: 14px; overflow: hidden; background: var(--f); color: var(--i); box-shadow: 0 24px 60px rgba(40,30,80,.25); }
      .badge { position: absolute; left: 7%; top: 5%; font-weight: 700; font-size: 13px; padding: 5px 8px; border-radius: 5px; background: var(--i); color: var(--f); }
      .sh { position: absolute; right: -8%; top: 12%; width: 80%; }
      .big { position: absolute; left: 6%; bottom: 20%; font-size: 140px; color: var(--i); }
      .cap { position: absolute; left: 7%; right: 7%; bottom: 5%; font-size: 13.5px; line-height: 1.35; } .cap b { display: block; font-size: 15px; }
      .shbtns { display: flex; gap: 10px; justify-content: center; margin-top: 22px; }
    </style>`);
}
