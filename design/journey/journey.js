// Two screens, one idea. A song is a journey from home and back, and music is built from a vocabulary of named moves.
//   #moves    the home screen: a wall of moves, grouped by what they do (ColorHub's palette of names, for music)
//   #journey  the player: the whole song as one landscape line, its moves named on it, depth from Feel to Why
import * as S from "../app/sound.js?v=20261011e";
import { BACH } from "../app/data.js?v=20261011e";

const C = { T: "#ffc04a", S: "#2fd4a4", D: "#8a7cff" };
const WORD = { T: "Home", S: "Away", D: "Tension" };
const FEEL = { T: "Settled. The music rests here.", S: "A step away from home.", D: "It wants to move, and leans forward." };

// ---------- the Prelude's moves (named spans, true to the checked analysis in data/bwv846-analysis.js)
const MOVES = {
  trip: { name: "The round trip", short: "Round trip", group: "home", line: "Home, a step away, tension, home again: the smallest complete journey in music.", spans: [[1, 4]], shape: "TSDT" },
  "251": { name: "The 2-5-1", short: "2-5-1", group: "home", line: "Away, tension, home: the most common way music comes home. Jazz runs on it.", spans: [[2, 4], [9, 11], [17, 19]], shape: "SDT" },
  newhome: { name: "A new home", short: "New home", group: "leave", line: "A door chord belongs to two keys (A minor is in C and in G), so Bach walks through it and settles in G for a while.", spans: [[5, 11]], shape: "TSDTSSDT", lift: true },
  lean: { name: "The lean", short: "Lean", group: "leave", line: "Home bends one note and turns into tension that points away: C becomes C7 and falls into F.", spans: [[19, 21]], shape: "TDS" },
  square: { name: "The passing square", short: "Squares", group: "tension", line: "A diminished chord, four notes evenly spaced, slips in to lean on the next chord. Barry Harris built a whole method on it.", spans: [[12, 15], [22, 23]], shape: "DSDT" },
  wait: { name: "The long wait", short: "Long wait", group: "tension", line: "The bass holds G for eight bars while the chords above keep pulling. Home is in sight, and you're kept waiting.", spans: [[24, 31]], shape: "SDDDDDDT", rise: true },
  held: { name: "Home, held", short: "Home", group: "home", line: "Now the bass holds home (C) while the chords move once more above it: the ending you've been waiting for.", spans: [[32, 35]], shape: "TSDT" },
};
// the labels drawn along the line (non-overlapping, in time order)
const TIMELINE = [["trip", 1, 4], ["newhome", 5, 11], ["square", 12, 15], ["251", 17, 19], ["lean", 20, 21], ["square", 22, 23], ["wait", 24, 31], ["held", 32, 35]];
// moves that aren't in this piece yet (illustrative until the archive has the songs)
const MORE = {
  four: { name: "The four-chord loop", group: "loop", line: "Home, tension, soft home, away, and around again.", eg: "e.g. Let It Be, Don't Stop Believin'", shape: "TDtS" },
  stairs: { name: "The fifths staircase", group: "loop", line: "Each chord falls a fifth to the next, like stairs down to home.", eg: "e.g. Fly Me to the Moon, Autumn Leaves", shape: "SDTSDT" },
  deceptive: { name: "The fake ending", group: "surprise", line: "Tension promises home, then lands somewhere softer instead.", eg: "everywhere from Bach to ballads", shape: "SDt" },
  borrowed: { name: "The sad four", group: "surprise", line: "The away chord turns minor for a moment, borrowed from the dark side.", eg: "e.g. Creep", shape: "TSsT" },
};
const GROUPS = [["home", "Going home", "how music lands"], ["leave", "Leaving home", "how music travels"], ["tension", "Building tension", "how music makes you wait"], ["surprise", "Surprises", "how music bends what you expect"], ["loop", "Loops", "the engines of songs"]];

// ---------- how far from home each bar feels (an estimate: function, key, dissonance, the pedal's build)
const BASE = { T: 0.1, S: 0.42, D: 0.7 };
const HEIGHT = BACH.bars.map((b, i) => {
  let h = BASE[b.fn];
  if (b.key === "G") h += b.fn === "T" ? 0.24 : 0.14;      // settled in G is still far from home
  if (/dim7/.test(b.chord)) h += 0.12;
  if (/sus4/.test(b.chord)) h += 0.05;
  if (b.bar >= 24 && b.bar <= 31) h += (b.bar - 24) * 0.022;
  if (b.bar === 1) h = 0.06; if (b.bar === 35) h = 0.03; if (b.bar === 32) h = 0.24;
  return Math.min(0.98, h);
});

// the landscape: the bar-by-bar estimate smoothed twice, so the shape of the trip shows (detail stays as a faint line)
const smooth1 = (a) => a.map((v, i) => (2 * v + (a[i - 1] ?? v) + (a[i + 1] ?? v)) / 4);
const LAND = smooth1(smooth1(HEIGHT)).map((v, i) => (i === 0 || i === 34 ? HEIGHT[i] : v));

// ---------- drawing
const VW = 400, G = 214, TOP = 64, Hh = G - TOP - 6;
const X = (i) => 14 + ((i + 0.5) / 35) * (VW - 28);
const Y = (h) => G - h * Hh;
function smooth(pts) { // Catmull-Rom to Bezier
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
const PTS = [[0, Y(LAND[0])], ...LAND.map((h, i) => [X(i), Y(h)]), [VW, Y(LAND[34])]];
const LINE = smooth(PTS);
const DETAIL = smooth([[0, Y(HEIGHT[0])], ...HEIGHT.map((h, i) => [X(i), Y(h)]), [VW, Y(HEIGHT[34])]]);
const stops = (id) => `<linearGradient id="${id}" x1="0" x2="${VW}" gradientUnits="userSpaceOnUse">${BACH.bars.map((b, i) => `<stop offset="${(X(i) / VW).toFixed(4)}" stop-color="${C[b.fn]}"/>`).join("")}</linearGradient>`;

function journeySVG(depth) {
  let s = `<svg viewBox="0 0 ${VW} 250" id="jsvg"><defs>${stops("gl")}
    <linearGradient id="fade" x1="0" y1="${TOP}" x2="0" y2="${G}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="am"><path d="${LINE} L${VW} ${G} L0 ${G}Z" fill="url(#fade)"/></mask>
    <clipPath id="past"><rect id="pastr" x="0" y="0" width="0" height="250"/></clipPath>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>`;
  // the ground (home) and the three heights
  s += `<line x1="0" x2="${VW}" y1="${G}" y2="${G}" stroke="rgba(246,240,228,.22)" stroke-width="1"/>`;
  s += `<text x="14" y="${G + 16}" class="axis">home</text><text x="${VW - 14}" y="${G + 16}" class="axis" text-anchor="end">bar 35</text>`;
  // the move brackets (from Moves depth)
  if (depth >= 1) TIMELINE.forEach(([id, a, b], k) => {
    const x1 = X(a - 1) - 5, x2 = X(b - 1) + 5, row = k % 2, y = 16 + row * 20;
    s += `<g class="mv" data-k="${k}"><line x1="${x1}" x2="${x2}" y1="${y + 5}" y2="${y + 5}" stroke="rgba(246,240,228,.28)" stroke-width="1.2"/><line x1="${x1}" x2="${x1}" y1="${y + 2}" y2="${y + 8}" stroke="rgba(246,240,228,.28)"/><line x1="${x2}" x2="${x2}" y1="${y + 2}" y2="${y + 8}" stroke="rgba(246,240,228,.28)"/><text class="mvl" x="${(x1 + x2) / 2}" y="${y}" text-anchor="middle">${MOVES[id].short}</text></g>`;
  });
  // the line: future faint, past bright with a soft glow, the area under it tinted
  s += `<path d="${LINE} L${VW} ${G} L0 ${G}Z" fill="url(#gl)" mask="url(#am)" opacity=".55"/>`;
  s += `<path d="${LINE}" fill="none" stroke="url(#gl)" stroke-width="2" opacity=".32"/>`;
  s += `<g clip-path="url(#past)"><path d="${LINE} L${VW} ${G} L0 ${G}Z" fill="url(#gl)" mask="url(#am)"/><path d="${LINE}" fill="none" stroke="url(#gl)" stroke-width="7" opacity=".45" filter="url(#glow)"/><path d="${LINE}" fill="none" stroke="url(#gl)" stroke-width="3" stroke-linecap="round"/></g>`;
  if (depth >= 2) s += `<path d="${DETAIL}" fill="none" stroke="rgba(246,240,228,.22)" stroke-width="1"/>`;
  // the playhead
  s += `<line id="ph" x1="0" x2="0" y1="${TOP - 8}" y2="${G}" stroke="rgba(246,240,228,.5)" stroke-width="1"/><circle id="phg" r="14" fill="#fff6e4" opacity=".25" filter="url(#glow)"/><circle id="phd" r="5.5" fill="#fff6e4"/>`;
  return s + `</svg>`;
}
function miniSVG(shape, { w = 140, h = 46, lift = false, rise = false } = {}) {
  const lv = { T: 0.1, t: 0.28, S: 0.45, s: 0.55, D: 0.85 }, fnOf = { T: "T", t: "T", S: "S", s: "S", D: "D" };
  const n = shape.length, pts = [...shape].map((c, i) => [6 + (i / (n - 1)) * (w - 12), h - 6 - (lv[c] + (lift && i > 0 && i < n - 1 ? 0.15 : 0) + (rise && c === "D" ? (i - 3) * 0.035 - 0.12 : 0)) * (h - 14)]);
  const id = "m" + Math.random().toString(36).slice(2, 7);
  return `<svg viewBox="0 0 ${w} ${h}" width="100%"><defs><linearGradient id="${id}" x1="0" x2="${w}" gradientUnits="userSpaceOnUse">${[...shape].map((c, i) => `<stop offset="${(pts[i][0] / w).toFixed(3)}" stop-color="${C[fnOf[c]]}"/>`).join("")}</linearGradient></defs>
    <line x1="0" x2="${w}" y1="${h - 4}" y2="${h - 4}" stroke="rgba(246,240,228,.15)"/><path d="${smooth(pts)}" fill="none" stroke="url(#${id})" stroke-width="2.6" stroke-linecap="round"/>${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${C[fnOf[shape[i]]]}"/>`).join("")}</svg>`;
}
const PLAY = `<svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="currentColor"/></svg>`, PAUSE = `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>`;
const short = (c) => c.split("/")[0].replace("dim7", "°7").replace("maj7", "maj7").replace("#", "♯");
const fullMini = () => { const w = 360, h = 56; const pts = LAND.map((v, i) => [4 + (i / 34) * (w - 8), h - 6 - v * (h - 12)]); return `<svg viewBox="0 0 ${w} ${h}" width="100%"><defs><linearGradient id="fm" x1="0" x2="${w}" gradientUnits="userSpaceOnUse">${BACH.bars.map((b, i) => `<stop offset="${(pts[i][0] / w).toFixed(3)}" stop-color="${C[b.fn]}"/>`).join("")}</linearGradient></defs><line x1="0" x2="${w}" y1="${h - 4}" y2="${h - 4}" stroke="rgba(246,240,228,.15)"/><path d="${smooth(pts)}" fill="none" stroke="url(#fm)" stroke-width="2.6" stroke-linecap="round"/></svg>`; };

// ---------- screen 1: the wall of moves
function wall() {
  const tile = (id, m, real) => {
    const n = real ? m.spans.length : 0;
    return `<a class="tile${real ? " here" : ""}" href="${real ? `#journey?move=${id}` : "#moves"}">${miniSVG(m.shape, { lift: m.lift, rise: m.rise })}<div><div class="disp nm">${m.name}</div><div class="in">${real ? `<span class="badge">IN TODAY'S PIECE</span><br>${n} ${n === 1 ? "time" : "times"} in the Prelude` : m.eg}</div></div></a>`;
  };
  return `<main class="screen">
    <header class="wall-h"><h1 class="disp">Moves</h1><span class="me">D</span></header>
    <p class="lede">Music is built from a few dozen moves. Learn their names, and you'll start hearing them everywhere.</p>
    <a class="today" href="#journey"><div class="row1"><span class="kicker">Today's piece</span><span class="kicker">7 moves inside</span></div><h2 class="disp">Prelude in C</h2><div class="mini">${fullMini()}</div><div class="go"><span>J. S. Bach · 1722 · 2 min</span><span class="playchip">${PLAY}Listen</span></div></a>
    ${GROUPS.map(([g, title, sub]) => {
      const more = Object.entries(MORE).filter(([, m]) => m.group === g);
      const realAll = Object.entries(MOVES).filter(([, m]) => m.group === g);
      return `<section class="group"><div class="group-h"><h3 class="disp">${title}</h3><span>${sub}</span></div><div class="tiles">${realAll.map(([id, m]) => tile(id, m, true)).join("")}${more.map(([id, m]) => tile(id, m, false)).join("")}</div></section>`;
    }).join("")}
    <p class="illus">The Prelude's moves come from its checked analysis. Other songs are examples until the archive has them.</p>
  </main>`;
}

// ---------- screen 2: the Journey
let depth = 1;
function journey(params) {
  const html = `<main class="screen">
    <div class="bar"><a href="#moves" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a><div class="t">Prelude in C<span>J. S. Bach · 1722</span></div><span class="r"></span></div>
    <div class="state"><div class="big disp" id="big"></div><p id="feel"></p></div>
    <div class="jw" id="jw">${journeySVG(depth)}<div class="tap" id="tap"></div></div>
    <div id="movecard"></div>
    <div class="depth"><div class="lab"><span>Look deeper</span><span id="dlab"></span></div><div class="stops" id="stops"><i></i>${["Feel", "Moves", "Chords", "Why"].map((l, i) => `<button data-d="${i}" class="${i === depth ? "on" : ""}">${l}</button>`).join("")}</div></div>
    <div class="transport"><span class="t" id="tl"></span><button class="play" id="pp" aria-label="Play">${PLAY}</button><span class="t r" id="tr"></span></div>
  </main>`;
  return {
    html,
    mount(root) {
      const $ = (id) => root.querySelector("#" + id);
      const svg = $("jsvg");
      const lineEl = svg.querySelector("path[stroke-width='3']");
      // x → y lookup along the drawn curve, so the playhead rides the line exactly
      const LUT = []; { const L = lineEl.getTotalLength(); for (let i = 0; i <= 600; i++) { const p = lineEl.getPointAtLength((i / 600) * L); LUT.push([p.x, p.y]); } }
      const yAt = (x) => { let lo = 0, hi = LUT.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (LUT[m][0] < x) lo = m; else hi = m; } const [x0, y0] = LUT[lo], [x1, y1] = LUT[hi]; return y0 + (y1 - y0) * ((x - x0) / (x1 - x0 || 1)); };
      $("stops").querySelector("i").style.transform = `translateX(${depth * 100}%)`;
      let pinned = params.get("move"), shownBar = -1, shownK = -1;
      if (pinned) { const k = TIMELINE.findIndex(([id]) => id === pinned); if (k >= 0) S.seekBar(TIMELINE[k][1] - 1); history.replaceState(null, "", "#journey"); }
      function tick() {
        const pos = S.started() || S.pos() > 0 ? S.pos() : 0, x = 14 + Math.min(1, pos / (35 * 16)) * (VW - 28), y = yAt(x);
        svg.querySelector("#pastr").setAttribute("width", x);
        svg.querySelector("#ph").setAttribute("x1", x); svg.querySelector("#ph").setAttribute("x2", x);
        ["phd", "phg"].forEach((id) => { const c = svg.querySelector("#" + id); c.setAttribute("cx", x); c.setAttribute("cy", y); });
      }
      function draw() {
        const i = S.bar(), b = BACH.bars[i], k = TIMELINE.findIndex(([, a, z]) => b.bar >= a && b.bar <= z);
        if (i !== shownBar) {
          shownBar = i;
          const bass = b.chord.split("/")[1];
          $("big").innerHTML = depth >= 2 ? `${short(b.chord).replace(/(maj7|m7|°7|7sus4|7)$/, "<sup>$1</sup>")}${bass ? `<span class="over">over ${bass.replace("#", "♯").replace(/^([A-G])b$/, "$1♭")}</span>` : ""}` : `${WORD[b.fn]}.`;
          $("big").style.color = depth >= 2 ? "var(--ink)" : C[b.fn];
          $("feel").innerHTML = depth >= 2 ? `<b>${WORD[b.fn]}.</b> ${FEEL[b.fn]}${depth >= 3 ? ` <span style="color:var(--faint)">${b.rn} in ${b.key}</span>` : ""}` : FEEL[b.fn];
          $("tl").textContent = `bar ${b.bar}`; $("tr").textContent = `of 35`;
          svg.querySelectorAll(".mv").forEach((g) => g.querySelector("text").classList.toggle("on", +g.dataset.k === k));
        }
        if (k !== shownK || i === shownBar) {
          shownK = k; const [id, a, z] = TIMELINE[k], m = MOVES[id];
          const chords = BACH.bars.slice(a - 1, z).map((x) => `<span class="${x.bar === b.bar ? "on" : ""}">${short(x.chord)}${depth >= 3 ? `<small>${x.rn}</small>` : ""}</span>`).join("");
          const elsewhere = m.spans.filter(([p]) => p !== a).map(([p, q]) => `bars ${p}–${q}`);
          $("movecard").innerHTML = depth >= 1 ? `<div class="move"><div class="k">Now · bars ${a}–${z}</div><h3 class="disp">${m.name}</h3><p>${m.line}</p>${depth >= 2 ? `<div class="chords">${chords}</div>` : ""}${depth >= 3 ? `<p class="why">Height is an estimate of how far from home each bar feels (its function, its key, its dissonance). <a href="../app/index.html#player">Open the harmony map</a> for the full analysis.</p>` : ""}<div class="more"><a href="#moves">See this move in other songs ›</a><span>${elsewhere.length ? `also ${elsewhere.join(", ")}` : ""}</span></div></div>` : "";
        }
        $("pp").innerHTML = S.playing() ? PAUSE : PLAY;
        tick();
      }
      root.querySelectorAll("#stops button").forEach((btn) => btn.addEventListener("click", () => { depth = +btn.dataset.d; render(); }));
      $("pp").addEventListener("click", () => S.toggle());
      $("tap").addEventListener("click", (e) => { const r = e.currentTarget.getBoundingClientRect(), f = (e.clientX - r.left) / r.width, vx = f * VW; const bar = Math.max(0, Math.min(34, Math.round(((vx - 14) / (VW - 28)) * 35 - 0.5))); S.seekBar(bar); });
      $("dlab").textContent = ["just the feeling", "the named moves", "+ the chords", "+ the theory"][depth];
      const off1 = S.onChange(draw), off2 = S.onTick(tick);
      draw();
      return () => { off1(); off2(); };
    },
  };
}

// ---------- router
let cleanup = null;
function render() {
  if (cleanup) { cleanup(); cleanup = null; }
  const [id, qs] = (location.hash.slice(1) || "moves").split("?"), params = new URLSearchParams(qs || "");
  const app = document.getElementById("app");
  if (id === "journey") { const j = journey(params); app.innerHTML = j.html; cleanup = j.mount(app); }
  else { app.innerHTML = wall(); window.scrollTo(0, 0); }
}
addEventListener("hashchange", render);
render();
