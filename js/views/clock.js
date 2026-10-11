// Chords lens: the 12 notes on a clock; every chord is a shape.
// When the chord changes, each note glides from the nearest note of the chord before,
// so smooth voice leading looks smooth (Tymoczko's idea: good voice leading = short motion).
// Optional layer: the three diminished squares (Barry Harris; Lendvai's axes).
import { PC_NAMES, DIM_AXES, pretty, inversionWords, pcOf } from "../theory.js";
import { FN, svg, reducedMotion } from "../ui.js";
import { NOTE_COLORS } from "../color.js";

const S = 400, C = 200, R = 132;
const ang = (pc) => (pc * Math.PI) / 6;
const at = (a, r = R) => [C + r * Math.sin(a), C - r * Math.cos(a)];
const AXIS_COLORS = ["var(--ax1)", "var(--ax2)", "var(--ax3)"];

export class ClockView {
  constructor(root, model, { onFocus }) {
    this.model = model;
    this.onFocus = onFocus;
    this.el = svg("svg", { viewBox: `0 0 ${S} ${S}`, class: "clock", role: "img", "aria-label": "Chord clock" });
    root.appendChild(this.el);
    this.angles = null;     // current vertex angles (for gliding)
    this.colorBy = "fn";
    this.build();
  }

  build() {
    const s = this.el;
    svg("circle", { cx: C, cy: C, r: R, class: "clock-ring" }, s);
    this.axes = svg("g", { class: "axes" }, s);
    DIM_AXES.forEach((ax, i) => {
      const pts = ax.pcs.map((pc) => at(ang(pc)).join(",")).join(" ");
      svg("polygon", { points: pts, class: "axis", style: `stroke:${AXIS_COLORS[i]};fill:${AXIS_COLORS[i]}` }, this.axes);
    });
    this.ghost = svg("polygon", { class: "chord-ghost" }, s);
    this.shape = svg("polygon", { class: "chord-shape" }, s);
    this.ticks = [];
    this.labels = [];
    for (let pc = 0; pc < 12; pc++) {
      const [x, y] = at(ang(pc));
      this.ticks.push(svg("circle", { cx: x, cy: y, r: 2.5, class: "clock-tick" }, s));
      const [lx, ly] = at(ang(pc), R + 26);
      const t = svg("text", { x: lx, y: ly + 5, class: "clock-label", "text-anchor": "middle", tabindex: "0", role: "button" }, s);
      t.textContent = PC_NAMES[pc];
      const pick = () => this.onFocus({ kind: "pc", pc, name: t.textContent });
      t.addEventListener("click", pick);
      t.addEventListener("keydown", (e) => { if (e.key === "Enter") pick(); });
      this.labels.push(t);
    }
    this.dots = svg("g", { class: "dots" }, s);
    this.name = svg("text", { x: C, y: C - 2, class: "clock-name", "text-anchor": "middle" }, s);
    this.words = svg("text", { x: C, y: C + 24, class: "clock-words", "text-anchor": "middle" }, s);
    this.words2 = svg("text", { x: C, y: C + 42, class: "clock-words", "text-anchor": "middle" }, s);
  }

  showAxes(on) { this.el.classList.toggle("show-axes", on); }
  setColorBy(c) { this.colorBy = c; if (this.bar != null) this.setBar(this.bar, true); }

  setBar(i, still = false) {
    this.bar = i;
    const b = this.model.bars[i];
    const prev = i > 0 ? this.model.bars[i - 1] : null;
    const chord = b.chord;
    const color = FN[b.fn].color;
    this.shape.style.setProperty("--c", color);

    // labels: spelled the way this bar spells them
    for (let pc = 0; pc < 12; pc++) {
      const sounding = b.pcs.includes(pc);
      this.labels[pc].textContent = sounding && b.spelled[pc] ? pretty(b.spelled[pc]) : PC_NAMES[pc];
      this.labels[pc].classList.toggle("is-on", sounding);
      this.ticks[pc].classList.toggle("is-on", sounding);
    }

    const target = [...chord.pcs].sort((a, c) => a - c).map(ang);
    const from = this.angles && !reducedMotion() && !still
      ? target.map((a) => nearest(a, this.angles))
      : target;
    this.ghost.setAttribute("points", prev ? [...prev.chord.pcs].sort((a, c) => a - c).map((pc) => at(ang(pc)).join(",")).join(" ") : "");
    this.animate(from, target, b);
    this.angles = target;

    this.name.textContent = pretty(chord.sym);
    this.words.textContent = `${chord.words}, ${inversionWords(chord)}`;
    this.words2.textContent = b.pedal ? `over a held ${pretty(b.pedal)} in the bass` : b.extra ? `plus ${b.extra.map(pretty).join(", ")}` : "";
  }

  animate(from, to, b) {
    cancelAnimationFrame(this.raf);
    const t0 = performance.now(), dur = 300;
    const draw = (k) => {
      const e = 1 - Math.pow(1 - k, 3);
      const angles = to.map((a, j) => from[j] + shortest(from[j], a) * e);
      this.shape.setAttribute("points", angles.map((a) => at(a).join(",")).join(" "));
      this.drawDots(angles, b);
    };
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      draw(k);
      if (k < 1) this.raf = requestAnimationFrame(step);
    };
    if (from === to) draw(1); else this.raf = requestAnimationFrame(step);
  }

  drawDots(angles, b) {
    this.dots.textContent = "";
    const color = FN[b.fn].color;
    const bassPc = b.pedal ? pcOf(b.pedal) : b.chord.bass;
    // voices per pitch class (doublings make a bigger dot)
    const count = {};
    for (const m of b.voicing) count[m % 12] = (count[m % 12] || 0) + 1;
    b.chord.pcs.slice().sort((x, y) => x - y).forEach((pc, j) => {
      const [x, y] = at(angles[j]);
      const r = 6 + 2 * Math.min(2, (count[pc] || 1) - 1);
      const fill = this.colorBy === "note" ? NOTE_COLORS[pc] : color;
      if (pc === bassPc) svg("circle", { cx: x, cy: y, r: r + 6, class: "dot-bass", style: `stroke:${fill}` }, this.dots);
      svg("circle", { cx: x, cy: y, r, class: "dot", style: `fill:${fill}` }, this.dots);
    });
    // notes that sound but aren't chord tones (pedal, held or passing notes)
    for (const pc of b.pcs) {
      if (b.chord.pcs.includes(pc)) continue;
      const [x, y] = at(ang(pc));
      if (pc === bassPc) svg("circle", { cx: x, cy: y, r: 12, class: "dot-bass", style: `stroke:${color}` }, this.dots);
      svg("circle", { cx: x, cy: y, r: 5.5, class: "dot-extra" }, this.dots);
    }
  }
}

function shortest(a, b) {
  let d = (b - a) % (2 * Math.PI);
  if (d > Math.PI) d -= 2 * Math.PI;
  if (d < -Math.PI) d += 2 * Math.PI;
  return d;
}
function nearest(a, list) {
  let best = list[0], bd = Infinity;
  for (const x of list) { const d = Math.abs(shortest(x, a)); if (d < bd) { bd = d; best = x; } }
  return best;
}
