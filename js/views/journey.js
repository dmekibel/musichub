// Journey lens: where the music is right now — home, away or tension.
// Three chambers stacked like the "harmonic hourglass" (dominant above, tonic in the middle,
// subdominant below). Each chamber holds the chords of the current key as stations; a light
// moves between them and leaves a fading trail.
import { FN, stationKey, matches, svg, reducedMotion } from "../ui.js";

const W = 400, H = 446, CX = 200;
const GEO = {
  D: { shape: "14,34 386,34 290,160 110,160", label: [CX, 22], rows: [74, 124], single: 104, span: (y) => trap(y, 34, 160, 372, 180) },
  T: { shape: "110,170 290,170 290,272 110,272", label: [CX, 194], rows: [238], single: 238, span: () => [110, 290] },
  S: { shape: "110,282 290,282 386,408 14,408", label: [CX, 434], rows: [318, 368], single: 340, span: (y) => trap(y, 282, 408, 180, 372) },
};
function trap(y, y0, y1, w0, w1) {
  const w = w0 + ((y - y0) / (y1 - y0)) * (w1 - w0);
  return [CX - w / 2, CX + w / 2];
}
const pillWidth = (label) => Math.max(46, label.length * 8.5 + 22);

export class JourneyView {
  constructor(root, model, { onFocus }) {
    this.model = model;
    this.onFocus = onFocus;
    this.el = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "journey", role: "img", "aria-label": "Journey map" });
    root.appendChild(this.el);
    this.key = null;
    this.centers = {};
    this.orbAt = null;
    this.build();
  }

  build() {
    const s = this.el;
    const defs = svg("defs", {}, s);
    const glow = svg("filter", { id: "orbGlow", x: "-1", y: "-1", width: "3", height: "3" }, defs);
    svg("feGaussianBlur", { stdDeviation: "5" }, glow);
    this.chambers = {};
    for (const fn of ["D", "T", "S"]) {
      const g = svg("g", { class: `chamber fn-${fn}`, "data-fn": fn }, s);
      svg("polygon", { points: GEO[fn].shape, class: "chamber-shape" }, g);
      const [lx, ly] = GEO[fn].label;
      const t = svg("text", { x: lx, y: ly, class: "chamber-label", "text-anchor": "middle" }, g);
      t.textContent = FN[fn].word;
      const th = svg("tspan", { class: "chamber-theory", dx: "8" }, t);
      th.textContent = FN[fn].theory;
      g.addEventListener("click", (e) => {
        if (e.target.closest(".station")) return;
        this.onFocus({ kind: "fn", fn });
      });
      this.chambers[fn] = g;
    }
    this.trail = svg("g", { class: "trail" }, s);
    this.stations = svg("g", { class: "stations" }, s);
    this.orbHalo = svg("circle", { r: 11, class: "orb-halo", filter: "url(#orbGlow)", cx: -50, cy: -50 }, s);
    this.orb = svg("circle", { r: 4.5, class: "orb", cx: -50, cy: -50 }, s);
  }

  layoutKey(key) {
    this.key = key;
    this.stations.textContent = "";
    this.centers = {};
    const bars = this.model.bars.filter((b) => b.key === key);
    for (const fn of ["D", "T", "S"]) {
      const list = [];
      for (const b of bars) {
        if (b.fn !== fn) continue;
        const st = stationKey(b.rn);
        let e = list.find((x) => x.st === st);
        if (!e) list.push((e = { st, count: 0 }));
        e.count++;
      }
      const geo = GEO[fn];
      const rows = list.length > 3 ? [list.slice(0, Math.ceil(list.length / 2)), list.slice(Math.ceil(list.length / 2))] : [list];
      rows.forEach((row, ri) => {
        const y = rows.length === 1 ? geo.single : geo.rows[ri];
        const [x0, x1] = geo.span(y);
        const widths = row.map((e) => pillWidth(e.st));
        const pad = 12, sum = widths.reduce((a, b) => a + b, 0);
        const gap = Math.max(4, (x1 - x0 - 2 * pad - sum) / (row.length + 1));
        let x = row.length === 1 ? CX - widths[0] / 2 : x0 + pad + gap;
        row.forEach((e, k) => {
          this.drawStation(e, fn, x + widths[k] / 2, y, widths[k]);
          x += widths[k] + gap;
        });
      });
    }
  }

  drawStation(e, fn, x, y, w) {
    const g = svg("g", { class: `station fn-${fn}`, transform: `translate(${x},${y})`, tabindex: "0", role: "button", "aria-label": `${e.st}, ${e.count} bars` }, this.stations);
    svg("rect", { x: -w / 2, y: -15, width: w, height: 30, rx: 15, class: "station-pill" }, g);
    const t = svg("text", { class: "station-label", "text-anchor": "middle", y: 6 }, g);
    t.textContent = e.st;
    const n = Math.min(e.count, 9);
    for (let i = 0; i < n; i++) svg("circle", { cx: (i - (n - 1) / 2) * 6, cy: 24, r: 1.8, class: "station-dot" }, g);
    const pick = () => this.onFocus({ kind: "station", key: this.key, station: e.st });
    g.addEventListener("click", pick);
    g.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); pick(); } });
    this.centers[e.st] = { x, y, g };
  }

  setBar(i) {
    const b = this.model.bars[i];
    if (b.key !== this.key) this.layoutKey(b.key);
    const st = stationKey(b.rn);
    for (const [k, c] of Object.entries(this.centers)) c.g.classList.toggle("is-now", k === st);
    for (const [fn, g] of Object.entries(this.chambers)) g.classList.toggle("is-now", fn === b.fn);
    const target = this.centers[st];
    this.moveOrb(target.x, target.y);
    // trail: the last few chords in this key
    this.trail.textContent = "";
    const pts = [];
    for (let j = i; j >= 0 && pts.length < 4; j--) {
      const bj = this.model.bars[j];
      if (bj.key !== b.key) break;
      const c = this.centers[stationKey(bj.rn)];
      if (c && (!pts.length || pts[pts.length - 1] !== c)) pts.push(c);
    }
    for (let k = 0; k < pts.length - 1; k++) {
      const a = pts[k], c = pts[k + 1];
      const mx = (a.x + c.x) / 2 + (a.y - c.y) * 0.18, my = (a.y + c.y) / 2 + (c.x - a.x) * 0.18;
      svg("path", { d: `M${c.x},${c.y} Q${mx},${my} ${a.x},${a.y}`, class: "trail-seg", style: `opacity:${(0.7 * (1 - k / 3)).toFixed(2)}` }, this.trail);
    }
  }

  moveOrb(x, y) {
    const from = this.orbAt || { x, y };
    this.orbAt = { x, y };
    cancelAnimationFrame(this.raf);
    const t0 = performance.now(), dur = reducedMotion() ? 0 : 320;
    const step = (t) => {
      const k = dur ? Math.min(1, (t - t0) / dur) : 1;
      const e = 1 - Math.pow(1 - k, 3);
      const cx = from.x + (x - from.x) * e, cy = from.y + (y - from.y) * e;
      for (const el of [this.orb, this.orbHalo]) { el.setAttribute("cx", cx); el.setAttribute("cy", cy - 27); }
      if (k < 1) this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  setFocus(focus) {
    const bars = this.model.bars.filter((b) => b.key === this.key);
    for (const [st, c] of Object.entries(this.centers)) {
      const hit = !focus || bars.some((b) => stationKey(b.rn) === st && matches(b, focus));
      c.g.classList.toggle("is-dim", !hit);
    }
    for (const [fn, g] of Object.entries(this.chambers))
      g.classList.toggle("is-dim", !!focus && !bars.some((b) => b.fn === fn && matches(b, focus)));
  }
}
