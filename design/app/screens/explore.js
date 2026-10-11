// Explore: the world Atlas, the River of history, the Wall, a Trail, and Search.
import { sleeve, shell, page, roomHead, topBar, ICON, hc } from "../ui.js?v=20261011e";
import { BACH, BOSSA, PLACES_1950s } from "../data.js?v=20261011e";
import { WORLD_DOTS, PINS } from "../world.js?v=20261011e";

const lenses = (on) => `<nav class="lenses">${[["explore", "Atlas"], ["river", "River"], ["wall", "Wall"], ["trail", "Trails"], ["search", "Search"]].map(([id, l]) => `<a href="#${id}" class="${id === on ? "on" : ""}">${l}</a>`).join("")}</nav>`;
const illus = `<p class="illus">Illustrative content and values for this mockup.</p>`;

// ---------- Atlas: the world map with a decade dial
export function explore() {
  const decades = ["1900s", "1910s", "1920s", "1930s", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
  const dial = decades.map((d) => `<span class="dec${d === "1950s" ? " on" : ""}">${d}</span>`).join("");
  const others = PLACES_1950s.filter((p) => ["Havana", "New York", "Lagos", "Cairo"].includes(p[0]));
  const html = shell("explore", `
    ${roomHead("Explore")}
    ${lenses("explore")}
    <div class="map" id="map"><svg id="world" viewBox="0 0 400 230"></svg></div>
    <div class="dial-wrap"><div class="decades">${dial}</div></div>
    <a class="row sel" href="#style">${sleeve({ h: 0.74, shape: "necklace", data: { on: BOSSA.clave, n: 16 }, size: "s" })}
      <span class="txt"><b>Rio de Janeiro · 1950s</b><span>Bossa nova is born: samba slowed down, with jazz chords.</span></span><span class="why">Open</span></a>
    <section class="sec"><div class="sec-h"><h2 class="disp">Lit up in the 1950s</h2><a>15 places</a></div>
      ${others.map(([n, , , what, h]) => `<a class="row" href="#style">${sleeve({ h, shape: "pin", size: "s" })}<span class="txt"><b>${n}</b><span>${what}</span></span></a>`).join("")}
    </section>
    ${illus}
    <style>
      .map { margin-top: 14px; border-radius: 12px; background: var(--card); box-shadow: inset 0 0 0 1px var(--hair); padding: 8px 4px; }
      .map svg { width: 100%; height: auto; }
      .dial-wrap { position: relative; margin: 14px calc(-1 * var(--gut)) 0; overflow: hidden; }
      .decades { display: flex; gap: 18px; align-items: baseline; padding: 0 var(--gut); transform: translateX(-170px); }
      .dec { font: 700 15px Archivo; color: var(--faint); white-space: nowrap; }
      .dec.on { font: 800 46px/1 Archivo; font-stretch: 62%; color: var(--ink); }
      .sel { margin-top: 10px; border-top: 0; background: var(--card); border-radius: 14px; padding: 10px; box-shadow: inset 0 0 0 1px var(--hair); }
    </style>`);
  return {
    html,
    mount(root) {
      const svg = root.querySelector("#world");
      let out = WORLD_DOTS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.25" fill="currentColor" fill-opacity=".28"/>`).join("");
      for (const [name, , , , h] of PLACES_1950s) {
        const [x, y] = PINS[name], sel = name === "Rio de Janeiro";
        out += `${sel ? `<circle cx="${x}" cy="${y}" r="11" fill="none" stroke="currentColor" stroke-width="1.5"/>` : ""}<circle cx="${x}" cy="${y}" r="${sel ? 6.5 : 4.5}" fill="${hc(h).field}" stroke="currentColor" stroke-opacity=".9" stroke-width="1.5"/>`;
        if (sel) out += `<text x="${x + 15}" y="${y + 4}" font-family="Archivo" font-size="11" font-weight="700" fill="currentColor">Rio, 1958</text>`;
      }
      svg.innerHTML = out;
    },
  };
}

// ---------- River: all of music history, styles branching and merging (time flows down)
const STREAMS = [
  ["Blues", 1900, 46, [], 0.18], ["Gospel", 1925, 96, [], 0.22], ["Jazz", 1910, 150, [], 0.6], ["Samba", 1917, 300, [], 0.3], ["Son", 1920, 360, [], 0.3],
  ["Swing", 1932, 196, ["Jazz"], 0.62], ["R&B", 1945, 70, ["Blues", "Swing", "Gospel"], 0.24], ["Bebop", 1944, 232, ["Swing"], 0.92],
  ["Mambo", 1949, 362, ["Son"], 0.34], ["Cool jazz", 1950, 268, ["Bebop"], 0.78], ["Rock and roll", 1954, 30, ["R&B"], 0.14],
  ["Hard bop", 1955, 200, ["Bebop", "Gospel"], 0.88], ["Bossa nova", 1958, 312, ["Samba", "Cool jazz"], 0.74], ["Ska", 1959, 112, ["R&B"], 0.2],
  ["Soul", 1960, 84, ["Gospel", "R&B"], 0.3], ["Rock", 1965, 22, ["Rock and roll", "Blues"], 0.2], ["Funk", 1966, 130, ["Soul"], 0.28],
  ["Reggae", 1968, 156, ["Ska"], 0.18], ["Salsa", 1970, 370, ["Mambo"], 0.36], ["Hip hop", 1973, 176, ["Funk", "Reggae"], 0.2],
  ["Disco", 1974, 104, ["Funk", "Soul"], 0.26], ["House", 1984, 120, ["Disco"], 0.3],
];
export function river() {
  const y = (yr) => 44 + (yr - 1900) * 6.4, END = 2025;
  const byName = Object.fromEntries(STREAMS.map((s) => [s[0], s]));
  const lineage = new Set(["Bossa nova"]);
  const up = (n) => byName[n][3].forEach((p) => { lineage.add(p); up(p); });
  up("Bossa nova");
  let links = "", lines = "", labels = "";
  for (const [n, start, x, parents, h] of STREAMS) {
    const on = lineage.has(n), col = hc(h).field, op = on ? 1 : 0.28;
    lines += `<line x1="${x}" y1="${y(start)}" x2="${x}" y2="${y(END)}" stroke="${col}" stroke-width="${on ? 7 : 5}" stroke-linecap="round" opacity="${op}"/>`;
    for (const p of parents) { const px = byName[p][2]; const linkOn = on && lineage.has(p); links += `<path d="M${px} ${y(start) - 26} C${px} ${y(start) - 6} ${x} ${y(start) - 20} ${x} ${y(start)}" fill="none" stroke="${col}" stroke-width="${linkOn ? 3 : 2}" opacity="${linkOn ? 1 : 0.25}"/>`; }
    labels += `<text x="${x + (x > 330 ? -8 : 8)}" y="${y(start) + 4}" text-anchor="${x > 330 ? "end" : "start"}" font-family="Archivo" font-size="${on ? 13 : 11.5}" font-weight="${on ? 750 : 600}" fill="currentColor" opacity="${on ? 1 : 0.5}">${n} <tspan fill-opacity=".6" font-weight="500">${start}</tspan></text>`;
  }
  let years = "";
  for (let yr = 1900; yr <= 2020; yr += 20) years += `<text x="400" y="${y(yr) + 4}" text-anchor="end" font-family="Archivo" font-size="11" fill="currentColor" fill-opacity=".45">${yr}</text><line x1="0" x2="372" y1="${y(yr)}" y2="${y(yr)}" stroke="currentColor" stroke-opacity=".15" stroke-dasharray="2 6"/>`;
  return shell("explore", `
    ${roomHead("Explore")}
    ${lenses("river")}
    <p class="t-s soft" style="margin-top:12px">All of music history as one river. Showing where bossa nova came from; tap any stream to follow it.</p>
    <div class="card" style="margin-top:12px;padding:10px 8px"><svg viewBox="0 0 404 ${y(END) + 16}" style="width:100%;height:auto">${years}${links}${lines}${labels}</svg></div>
    ${illus}`);
}

// ---------- Wall: every sleeve in the archive, sorted by harmonic color
const WALL = [
  ["Twinkle,\nTwinkle", 0.04, "wheel"], ["Rock and\nroll", 0.14, "tree"], ["Delta\nblues", 0.18, "tree"], ["Kwela", 0.18, "pin"], ["Ska", 0.2, "necklace"], ["Highlife", 0.26, "pin"],
  ["Samba", 0.3, "necklace"], ["Cha-cha\n-chá", 0.32, "necklace"], ["Film\nsongs", 0.42, "pin"], ["Chanson", 0.46, "pin"], ["Umm\nKulthum", 0.5, "wheel"], ["Flamenco", 0.56, "necklace"],
  ["Tango", 0.6, "necklace"], ["Prelude\nin C", BACH.h, "wheel", "#piece"], ["Chega de\nSaudade", 0.72, "wheel"], ["Bossa\nnova", 0.74, "necklace", "#style"], ["Cool\njazz", 0.78, "tree"], ["Desafinado", 0.8, "wheel"],
  ["Hard\nbop", 0.88, "tree"], ["Art\nBlakey", 0.88, "necklace"], ["Bebop", 0.92, "tree"], ["Giant\nSteps", 0.96, "chord"], ["Rite of\nSpring", 0.97, "wheel"], ["The\nsquare", 1, "chord", "#shape"],
];
export function wall() {
  const cell = ([n, h, shp, href]) => {
    const data = shp === "wheel" ? { fns: (h > 0.6 ? "TDSDDTDSDDDT" : "TSTDTSTDTTST").split("") } : shp === "necklace" ? { on: [0, 3, 6, 10, 13], n: 16 } : shp === "chord" ? { pcs: n.startsWith("Giant") ? [3, 7, 11] : [0, 3, 6, 9] } : {};
    return `<a href="${href || "#style"}">${sleeve({ h, shape: shp, data, name: n, size: "m" })}</a>`;
  };
  return shell("explore", `
    ${roomHead("Explore")}
    ${lenses("wall")}
    <div style="display:flex;gap:8px;margin-top:14px;overflow-x:auto"><span class="pill" style="background:var(--ink);color:var(--paper)">Harmonic color</span><span class="pill">Era</span><span class="pill">Place</span><span class="pill">Squares</span><span class="pill">Tempo</span></div>
    <p class="t-s soft" style="margin-top:10px">From home-heavy and plain to tension-heavy and chromatic. Every sleeve is a piece, artist, style, place or shape.</p>
    <div class="wallgrid">${WALL.map(cell).join("")}</div>
    ${illus}
    <style>.wallgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 14px; } .wallgrid .sleeve { width: 100%; }</style>`);
}

// ---------- Trail: a curated journey
export function trail() {
  const stops = [
    ["Samba · Rio, 1917", '"Pelo Telefone", often called the first recorded samba.', 0.3, "necklace"],
    ["Cool jazz · Los Angeles, 1950s", "Chet Baker's soft trumpet and softer voice, heard all the way in Rio.", 0.78, "tree"],
    ['"Chega de Saudade" · Rio, 1958', "João Gilberto's guitar beat: samba, quietly, with jazz chords.", 0.72, "wheel"],
    ['"Desafinado" · 1959', "A song about singing out of tune, with melody notes that sound off on purpose.", 0.8, "wheel"],
    ["Getz/Gilberto · New York, 1964", "Won the Grammy for Album of the Year; bossa nova goes global.", 0.76, "wheel"],
  ];
  return page(`
    ${topBar("Trail", ICON.save)}
    ${sleeve({ h: 0.74, shape: "path", name: "From Rio\nto the world", tag: "Trail · 5 stops · 12 minutes", size: "xl" })}
    <p class="t-l" style="margin-top:14px">How a quiet way of playing samba became one of the most recorded sounds on earth.</p>
    <div class="actions"><a class="btn">${ICON.play}Start the trail</a></div>
    <section class="sec">${stops.map(([t, d, h, shp], i) => `<a class="row" href="#style"><span class="stopn disp">${i + 1}</span>${sleeve({ h, shape: shp, data: shp === "necklace" ? { on: [0, 3, 6, 10, 13], n: 16 } : { fns: "TSDTDTSDT".split("") }, size: "s" })}<span class="txt"><b>${t}</b><span>${d}</span></span></a>`).join("")}</section>
    ${illus}
    <style>.stopn { font-size: 34px; width: 22px; color: var(--faint); }</style>`);
}

// ---------- Search
export function search() {
  const group = (title, rows) => `<section class="sec" style="margin-top:22px"><div class="sec-h"><h2 class="disp" style="font-size:24px">${title}</h2></div>${rows.join("")}</section>`;
  const r = (href, sl, t, s) => `<a class="row" href="${href}">${sl}<span class="txt"><b>${t}</b><span>${s}</span></span></a>`;
  return shell("explore", `
    ${roomHead("Explore")}
    ${lenses("search")}
    <div class="searchbox">${ICON.search}<span>dimin</span><i></i></div>
    ${group("Shapes and ideas", [r("#shape", sleeve({ h: 1, shape: "chord", data: { pcs: [0, 3, 6, 9] }, size: "s" }), "The square (diminished seventh)", "Shape · 4 notes in 12, perfectly even"), r("#shape", sleeve({ h: 1, shape: "necklace", data: { on: [0, 1, 3, 4, 6, 7, 9, 10], n: 12 }, size: "s" }), "Diminished scale", "Scale · two squares woven together")])}
    ${group("Systems", [r("#learn", sleeve({ h: 1, shape: "necklace", data: { on: [0, 2, 4, 5, 7, 8, 9, 11], n: 12 }, size: "s" }), "Barry Harris's 6th-diminished scale", "System · a sixth chord and a square, taking turns")])}
    ${group("Moments", [r("#player", sleeve({ h: BACH.h, shape: "wheel", data: { fns: BACH.fns }, size: "s" }), "Prelude in C · bar 12", "C♯ diminished seventh over G · Squares 1.00"), r("#player", sleeve({ h: BACH.h, shape: "wheel", data: { fns: BACH.fns }, size: "s" }), "Prelude in C · bar 23", "B diminished seventh, the bass slides A♭ to G")])}
    ${group("Lessons", [r("#lesson", sleeve({ h: 1, shape: "path", size: "s" }), "Lesson 6 · The three squares", "Learn · 5 minutes")])}
    <style>.searchbox { display: flex; align-items: center; gap: 10px; height: 50px; padding: 0 16px; margin-top: 14px; border-radius: 999px; background: var(--card); box-shadow: inset 0 0 0 1.5px var(--ink); font-size: 17px; font-weight: 600; } .searchbox svg { width: 20px; height: 20px; } .searchbox i { width: 2px; height: 22px; background: var(--ink); margin-left: -8px; }</style>`);
}
