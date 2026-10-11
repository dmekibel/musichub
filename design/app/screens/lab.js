// Lab: the three diminished squares, as a toy. Tap a corner to move that note by a half step.
import { shell, roomHead, hc } from "../ui.js?v=20261011e";
import { SQUARES, PC } from "../data.js?v=20261011e";

export function lab() {
  const html = shell("lab", `
    ${roomHead("Lab")}
    <nav class="lenses"><a>Atlas</a><a class="on">Squares</a><a>Dials</a><a>Scales</a><a>Rhythm</a></nav>
    <div class="sq-pick" id="pick">${SQUARES.map((q, i) => `<button data-i="${i}" class="${i === 1 ? "on" : ""}" style="--f:${hc(q.h).field}"><i></i>${q.id} square</button>`).join("")}</div>
    <svg id="clock" viewBox="-200 -200 400 400" class="sq-clock"></svg>
    <div class="sq-mode" id="mode"><button data-m="down" class="on">Lower a note</button><button data-m="up">Raise a note</button></div>
    <div class="sq-read" id="read"></div>
    <div class="sq-kids" id="kids"></div>
    <p class="t-xs faint" style="margin-top:18px">After Barry Harris's teaching; Lendvai's axis system groups the same notes. See also Metaharmony by Tom (metaharmony.co.uk).</p>
    <style>
      .sq-pick { display: flex; gap: 8px; margin-top: 16px; }
      .sq-pick button { flex: 1; height: 42px; border-radius: 999px; font-weight: 650; font-size: 14px; box-shadow: inset 0 0 0 1.5px var(--hair); background: var(--card); display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
      .sq-pick button i { width: 10px; height: 10px; border-radius: 2px; background: var(--f); transform: rotate(45deg); }
      .sq-pick button.on { box-shadow: inset 0 0 0 2px var(--ink); }
      .sq-clock { width: 100%; height: auto; margin-top: 8px; touch-action: manipulation; }
      .sq-clock { color: var(--ink); } .sq-clock .lbl { font: 700 15px Archivo, "Noto Music"; fill: currentColor; }
      .sq-clock .lbl.off { fill-opacity: .45; font-weight: 500; }
      .sq-clock .hit { cursor: pointer; }
      .sq-mode { display: flex; gap: 8px; } .sq-mode button { flex: 1; height: 40px; border-radius: 999px; font-weight: 650; font-size: 14px; box-shadow: inset 0 0 0 1.5px var(--hair); }
      .sq-mode button.on { background: var(--ink); color: var(--paper); box-shadow: none; }
      .sq-read { margin-top: 18px; }
      .sq-read .disp { font-size: 56px; }
      .sq-kids { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; }
      .sq-kids button { height: 52px; border-radius: 12px; background: var(--card); box-shadow: inset 0 0 0 1.5px var(--hair); font-weight: 700; font-size: 16px; }
      .sq-kids button.on { box-shadow: inset 0 0 0 2px var(--ink); }
    </style>`, { mini: false });

  return {
    html,
    async mount(root) {
      const S = await import("../sound.js?v=20261011e");
      const hear = (pcs) => S.chord(pcs.map((p) => 60 + p));
      const svg = root.querySelector("#clock"), read = root.querySelector("#read"), kidsEl = root.querySelector("#kids");
      let sq = 1, mode = "down", moved = null;
      const R = 140, P = (pc, r = R) => [r * Math.sin((pc / 12) * Math.PI * 2), -r * Math.cos((pc / 12) * Math.PI * 2)];
      const childName = (x) => (mode === "down" ? `${PC[(x + 11) % 12]}7` : `${PC[(x + 6) % 12]}m6`);
      const childWords = () => (mode === "down" ? "dominant seventh" : "minor sixth");
      const current = () => SQUARES[sq].pcs.map((p) => (p === moved ? (mode === "down" ? (p + 11) % 12 : (p + 1) % 12) : p));
      function draw() {
        const q = SQUARES[sq], col = hc(q.h);
        let s = `<circle r="${R}" fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="2"/>`;
        SQUARES.forEach((o, i) => { if (i !== sq) s += `<polygon points="${o.pcs.map((p) => P(p).join(",")).join(" ")}" fill="none" stroke="${hc(o.h).field}" stroke-width="1.5" stroke-dasharray="4 5" opacity=".55"/>`; });
        const pcs = q.pcs.map((p) => (p === moved ? (mode === "down" ? (p + 11) % 12 : (p + 1) % 12) : p));
        const order = [...pcs].sort((a, b) => a - b);
        s += `<polygon points="${order.map((p) => P(p).join(",")).join(" ")}" fill="${col.field}" fill-opacity="${moved == null ? 0.92 : 0.75}" stroke="${col.deep}" stroke-width="2" stroke-linejoin="round"/>`;
        for (let pc = 0; pc < 12; pc++) {
          const on = pcs.includes(pc), [x, y] = P(pc), [lx, ly] = P(pc, R + 30);
          s += `<text x="${lx}" y="${ly + 5}" text-anchor="middle" class="lbl${on ? "" : " off"}">${PC[pc]}</text>`;
          s += on ? `<circle cx="${x}" cy="${y}" r="${pc === (moved == null ? -1 : pcs[q.pcs.indexOf(moved)]) ? 13 : 10}" fill="#fbf8f2" stroke="${col.deep}" stroke-width="3"/>` : `<circle cx="${x}" cy="${y}" r="3" fill="currentColor" fill-opacity=".35"/>`;
        }
        q.pcs.forEach((p) => { const [x, y] = P(p); s += `<circle class="hit" data-p="${p}" cx="${x}" cy="${y}" r="26" fill="transparent"/>`; });
        svg.innerHTML = s;
        svg.querySelectorAll(".hit").forEach((c) => c.addEventListener("click", () => { const p = +c.dataset.p; moved = moved === p ? null : p; draw(); hear(current()); }));
        read.innerHTML = moved == null
          ? `<p class="kicker">${q.axis}</p><div class="disp">${q.names.join(" · ")}</div><p class="t-m soft" style="margin-top:6px">A perfect square: every note a minor third from the next. Tap a corner.</p>`
          : `<p class="kicker">${childWords()} · one note moved</p><div class="disp">${childName(moved)}</div><p class="t-m soft" style="margin-top:6px">${PC[moved]} ${mode === "down" ? "drops" : "rises"} a half step. The other three notes stay put.</p>`;
        kidsEl.innerHTML = q.pcs.map((p) => `<button data-p="${p}" class="${p === moved ? "on" : ""}">${childName(p)}</button>`).join("");
        kidsEl.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { moved = +b.dataset.p; draw(); hear(current()); }));
      }
      root.querySelectorAll("#pick button").forEach((b) => b.addEventListener("click", () => { sq = +b.dataset.i; moved = null; root.querySelectorAll("#pick button").forEach((x) => x.classList.toggle("on", x === b)); draw(); hear(current()); }));
      root.querySelectorAll("#mode button").forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; root.querySelectorAll("#mode button").forEach((x) => x.classList.toggle("on", x === b)); draw(); }));
      moved = 10; // start on a real example: C# square, B♭ lowered → A7
      draw();
    },
  };
}
