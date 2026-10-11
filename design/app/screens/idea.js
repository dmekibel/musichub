// The idea page: one page per chord kind (#idea?k=dim7) and per Atlas address (#idea?a=V), generated from the Prelude's bars.
// Its heart is Moments: every place in the piece where the idea happens, each one opening the Player at that bar.
import { sleeve, page, topBar, ICON, dialsRow, FN_H, acc } from "../ui.js?v=20261011e";
import { BACH, KINDS, KIND_BY_ID, ADDRS, kind, dialsOf } from "../data.js?v=20261011e";
import { plain } from "../prefs.js?v=20261011e";
import { ideaA, ideaK, chordText } from "./listen.js?v=20261011e";

const ROOT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const rootOf = (c) => (ROOT[c[0]] + (c[1] === "#" ? 1 : c[1] === "b" ? -1 : 0) + 12) % 12;
const pcsOf = (c) => KINDS[kind(c)].iv.map((x) => (x + rootOf(c)) % 12).sort((a, b) => a - b);
const FNW = { T: "home", S: "away", D: "tension" };
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const twoLines = (s) => { const w = s.split(" "); return w.length < 2 ? s : w.slice(0, Math.ceil(w.length / 2)).join(" ") + "\n" + w.slice(Math.ceil(w.length / 2)).join(" "); };

export function idea(params) {
  const P = plain();
  const k = params.get("k"), a = params.get("a");
  let name, kicker, lead, sub, bars, related, more;
  if (k && KIND_BY_ID[k]) {
    const K = KIND_BY_ID[k];
    bars = BACH.bars.filter((b) => kind(b.chord) === K.name);
    name = K.name.replace("7th", "seventh");
    kicker = "Chord kind";
    [lead, sub] = P ? [K.plain, K.theory] : [K.theory, K.plain];
    related = K.rel.map(([id, why]) => ({ href: `#idea?k=${id}`, h: hOf(BACH.bars.filter((b) => kind(b.chord) === KIND_BY_ID[id].name)), pcs: KIND_BY_ID[id].iv, title: cap(KIND_BY_ID[id].name.replace("7th", "seventh")), why: cap(why) }));
    more = Object.values(KIND_BY_ID).filter((x) => x.id !== k).map((x) => { const bs = BACH.bars.filter((b) => kind(b.chord) === x.name); return { href: `#idea?k=${x.id}`, h: hOf(bs), pcs: x.iv, title: cap(x.name.replace("7th", "seventh")), sub: `${bs.length} in the Prelude` }; });
  } else {
    const key = ADDRS[a] ? a : "V", A = ADDRS[key];
    bars = BACH.bars.filter((b) => b.addr === key);
    name = P ? A.name : key;
    kicker = P ? `Atlas address · ${key}` : `Atlas address · ${A.name.toLowerCase()}`;
    [lead, sub] = P ? [A.plain, A.theory] : [A.theory, A.plain];
    const kinds = [...new Set(bars.map((b) => kind(b.chord)))];
    related = kinds.map((kn) => ({ href: `#idea?k=${KINDS[kn].id}`, h: hOf(BACH.bars.filter((b) => kind(b.chord) === kn)), pcs: KINDS[kn].iv, title: cap(kn.replace("7th", "seventh")), why: "The kind of chord Bach puts here" }));
    const target = key.includes("/") ? key.split("/")[1] : null;
    if (target) related.unshift({ href: ideaA(target), h: hOf(BACH.bars.filter((b) => b.addr === target)), pcs: pcsOf(BACH.bars.find((b) => b.addr === target).chord), title: P ? ADDRS[target].name : target, why: "Where it points: it makes this chord feel like home for a moment" });
    more = Object.keys(ADDRS).filter((x) => x !== key && BACH.counts[x]).map((x) => { const bs = BACH.bars.filter((b) => b.addr === x); return { href: ideaA(x), h: hOf(bs), pcs: pcsOf(bs[0].chord), title: P ? ADDRS[x].name : x, sub: `${bs.length} in the Prelude` }; });
  }
  const first = bars[0], h = hOf(bars), pcs = pcsOf(first.chord);
  const fc = bars.reduce((m, b) => ((m[b.fn] = (m[b.fn] || 0) + 1), m), {});
  const topFn = Object.entries(fc).sort((x, y) => y[1] - x[1])[0];
  const v = new Array(12).fill(0); pcs.forEach((pc) => (v[pc] = 1));
  const d = dialsOf(v), topDial = Object.entries(d).sort((x, y) => y[1] - x[1])[0];

  const moment = (b) => `<a class="mo" href="#player?bar=${b.bar}"><span class="mo-n disp">${b.bar}</span><b>${acc(chordText(b.chord))}</b><span>${P ? FNW[b.fn] : b.rn}</span><i class="fn-${b.fn}"></i></a>`;
  const tile = (x, line) => `<a class="it" href="${x.href}">${sleeve({ h: x.h, shape: "chord", data: { pcs: x.pcs }, size: "m" })}<b>${x.title}</b><span>${line}</span></a>`;

  const html = page(`
    ${topBar("", ICON.share, { aa: true })}
    <div style="margin-top:8px">${sleeve({ h, shape: "chord", data: { pcs }, name: twoLines(cap(name)), tag: kicker, size: "xl", nameSize: fit(twoLines(cap(name))) })}</div>
    <div class="actions"><button class="btn" data-act="chord" data-notes="${first.voicing.join(",")}">${ICON.play}Hear it · Bach's bar ${first.bar}</button></div>
    <p class="t-l" style="margin-top:18px">${lead}</p>
    <p class="t-s soft" style="margin-top:8px">${sub}</p>

    <section class="sec">
      <div class="sec-h"><h2 class="disp">Where it happens</h2><span class="t-s soft">${bars.length} ${bars.length === 1 ? "moment" : "moments"} in the Prelude</span></div>
      <div class="hscroll mos">${bars.map(moment).join("")}</div>
    </section>

    <section class="sec">
      <div class="sec-h"><h2 class="disp">What it does here</h2></div>
      <div class="split">${["T", "S", "D"].filter((f) => fc[f]).map((f) => `<i class="fn-${f}" style="flex:${fc[f]}"></i>`).join("")}</div>
      <p class="t-m" style="margin-top:10px"><b>${topFn[1]} of ${bars.length}</b> times it's ${P ? FNW[topFn[0]] : { T: "tonic", S: "subdominant", D: "dominant" }[topFn[0]]}.</p>
    </section>

    <section class="sec">
      <div class="sec-h"><h2 class="disp">Its shape</h2><a href="#shape" class="lnk">The Five Dials</a></div>
      ${dialsRow(d)}
      <p class="t-s soft" style="margin-top:10px">Strongest dial: <b style="color:var(--ink)">${topDial[0][0].toUpperCase() + topDial[0].slice(1)} ${topDial[1].toFixed(2)}</b>${topDial[0] === "squares" && topDial[1] > 0.99 ? ": a perfect square, the shape Barry Harris builds on." : "."}</p>
    </section>

    <section class="sec">
      <div class="sec-h"><h2 class="disp">Relatives</h2></div>
      ${related.map((x) => `<a class="row" href="${x.href}">${sleeve({ h: x.h, shape: "chord", data: { pcs: x.pcs }, size: "s" })}<span class="txt"><b class="lnk">${x.title}</b><span>${x.why}</span></span></a>`).join("")}
    </section>

    <section class="sec">
      <div class="sec-h"><h2 class="disp">More like this</h2></div>
      <div class="hscroll">${more.map((x) => tile(x, x.sub)).join("")}</div>
    </section>
    <style>
      .mos { gap: 10px; }
      .mo { flex: none; width: 104px; padding: 12px 12px 0; border-radius: 12px; background: var(--card); box-shadow: inset 0 0 0 1px var(--hair); overflow: hidden; display: flex; flex-direction: column; }
      .mo .mo-n { font-size: 54px; line-height: .9; color: var(--ink); }
      .mo b { font-weight: 700; font-size: 16px; margin-top: 6px; }
      .mo span { font-size: 13px; color: var(--soft); }
      .mo i { display: block; height: 8px; margin: 12px -12px 0; background: var(--c); }
      .split { display: flex; gap: 3px; height: 18px; } .split i { border-radius: 4px; background: var(--c); box-shadow: inset 0 0 0 1px rgba(247,241,230,.45); }
      .it { flex: none; width: 132px; } .it b { display: block; font-weight: 650; font-size: 14.5px; margin-top: 8px; line-height: 1.2; } .it span { display: block; font-size: 13px; color: var(--soft); }
      .it .sleeve { box-shadow: 0 0 0 1px rgba(247,241,230,.22); }
    </style>
  `);
  return { html, h, crumb: cap(name) };
}

/** Long names get smaller type so they still fit the sleeve. */
function fit(n) { const L = Math.max(...n.split("\n").map((l) => l.length)); return L > 7 ? `${Math.round((27 * 7.2) / L)}cqw` : undefined; }
/** A sleeve's color is what the idea usually does here: the average of its moments' functions. */
function hOf(bars) { return bars.length ? bars.reduce((s, b) => s + FN_H[b.fn], 0) / bars.length : 0.5; }
