// The spine: the whole piece in one strip. Sections on top, one chip per bar (colored by
// function), held basses underneath, and the tension curve. Always visible; drag to scrub.
import { FN, matches, svg, smoothPath, h, rnHTML } from "../ui.js";
import { pretty } from "../theory.js";
import { NOTE_COLORS } from "../color.js";

export class SpineView {
  constructor(root, model, { onSeek }) {
    this.model = model;
    this.onSeek = onSeek;
    this.wrap = h("div", { class: "spine-wrap" });
    this.el = svg("svg", { class: "spine-svg", role: "slider", "aria-label": "Position in the piece", tabindex: "0" });
    this.tip = h("div", { class: "spine-tip", "aria-hidden": "true" });
    this.wrap.append(this.el, this.tip);
    root.appendChild(this.wrap);
    this.focus = null;
    this.bar = 0;
    this.colorBy = "fn";
    new ResizeObserver(() => requestAnimationFrame(() => this.render())).observe(this.wrap);
    let dragging = false;
    const at = (e) => {
      const r = this.el.getBoundingClientRect();
      const x = Math.max(0, Math.min(r.width - 1, e.clientX - r.left));
      return Math.floor((x / r.width) * model.nBars);
    };
    this.el.addEventListener("pointerdown", (e) => { dragging = true; this.el.setPointerCapture(e.pointerId); this.onSeek(at(e) * 16); });
    this.el.addEventListener("pointermove", (e) => {
      const i = at(e);
      if (dragging) this.onSeek(i * 16);
      this.showTip(i, e);
    });
    this.el.addEventListener("pointerup", () => (dragging = false));
    this.el.addEventListener("pointerleave", () => this.tip.classList.remove("on"));
    this.el.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") this.onSeek(Math.min(model.nBars - 1, this.bar + 1) * 16);
      if (e.key === "ArrowLeft") this.onSeek(Math.max(0, this.bar - 1) * 16);
    });
  }

  showTip(i, e) {
    const b = this.model.bars[i];
    if (!b || e.pointerType === "touch") return;
    this.tip.innerHTML = `<b>Bar ${b.bar}</b> · ${pretty(b.chord.sym)} <span class="rn-sm">${rnHTML(b.rn)}</span><br>${FN[b.fn].word} · tension ${Math.round(b.tension * 100)}`;
    const r = this.wrap.getBoundingClientRect();
    this.tip.style.left = `${Math.min(r.width - 170, Math.max(0, e.clientX - r.left - 80))}px`;
    this.tip.classList.add("on");
  }

  render() {
    const m = this.model, s = this.el;
    const W = this.wrap.clientWidth;
    if (!W) return;
    const H = 132;
    s.setAttribute("viewBox", `0 0 ${W} ${H}`);
    s.setAttribute("width", W); s.setAttribute("height", H);
    s.textContent = "";
    const bw = W / m.nBars;
    this.bw = bw;
    const yChip = 22, chipH = 22, yCurveTop = 60, yCurveBot = 116;

    // sections
    for (const sec of m.piece.sections) {
      const x0 = (sec.from - 1) * bw, x1 = sec.to * bw;
      svg("line", { x1: x0 + 1, x2: x1 - 1, y1: 15, y2: 15, class: "sec-line" }, s);
      const t = svg("text", { x: x0 + 2, y: 10, class: "sec-label" }, s);
      t.textContent = bw * (sec.to - sec.from + 1) > 64 ? sec.title : "";
    }
    // chips
    this.chips = m.bars.map((b, i) => svg("rect", {
      x: i * bw + 1, y: yChip, width: Math.max(1, bw - 2), height: chipH, rx: Math.min(4, bw / 4),
      class: `chip fn-${b.fn}`,
      style: this.colorBy === "note" ? `fill:${NOTE_COLORS[b.chord.root]}` : "",
    }, s));
    // held bass
    for (const r of m.stats.pedalRuns) {
      const x0 = (r.from - 1) * bw + 1, x1 = r.to * bw - 1;
      svg("rect", { x: x0, y: yChip + chipH + 5, width: x1 - x0, height: 3, rx: 1.5, class: "pedal-bar" }, s);
      const t = svg("text", { x: x0, y: yChip + chipH + 18, class: "pedal-label" }, s);
      t.textContent = x1 - x0 > 70 ? `held ${pretty(r.value)}` : "";
    }
    // tension curve
    const pts = m.bars.map((b, i) => [i * bw + bw / 2, yCurveBot - b.tension * (yCurveBot - yCurveTop)]);
    const line = smoothPath(pts);
    svg("path", { d: `${line} L${pts[pts.length - 1][0]},${yCurveBot} L${pts[0][0]},${yCurveBot} Z`, class: "tension-area" }, s);
    svg("path", { d: line, class: "tension-line" }, s);
    const lab = svg("text", { x: W - 2, y: yCurveTop - 4, class: "axis-label", "text-anchor": "end" }, s);
    lab.textContent = "tension";
    // bar numbers
    for (const n of [1, 5, 10, 15, 20, 25, 30, 35]) {
      if (n > m.nBars) continue;
      const t = svg("text", { x: (n - 0.5) * bw, y: H - 2, class: "bar-num", "text-anchor": "middle" }, s);
      t.textContent = n;
    }
    this.head = svg("line", { y1: yChip - 4, y2: yCurveBot + 2, class: "spine-head" }, s);
    this.dot = svg("circle", { r: 4, class: "spine-dot" }, s);
    this.pts = pts;
    this.setFocus(this.focus);
    this.setBar(this.bar);
    this.tick(this.pos || 0);
  }

  tick(pos) {
    this.pos = pos;
    if (!this.head) return;
    const x = (pos / 16) * this.bw;
    this.head.setAttribute("x1", x); this.head.setAttribute("x2", x);
    const i = Math.max(0, Math.min(this.model.nBars - 1, Math.floor(pos / 16)));
    this.dot.setAttribute("cx", this.pts[i][0]); this.dot.setAttribute("cy", this.pts[i][1]);
  }

  setBar(i) {
    this.bar = i;
    this.el.setAttribute("aria-valuenow", i + 1);
    if (!this.chips) return;
    this.chips.forEach((c, k) => c.classList.toggle("is-now", k === i));
  }

  setColorBy(c) { this.colorBy = c; this.render(); }

  setFocus(f) {
    this.focus = f;
    if (!this.chips) return;
    this.model.bars.forEach((b, k) => this.chips[k].classList.toggle("is-dim", !!f && !matches(b, f)));
  }
}
