// Notes lens: a scrolling piano roll (after Stephen Malinowski's Music Animation Machine).
// Each note is a bar of light, colored by the harmonic function of its chord.
import { FN, matches } from "../ui.js";
import { NOTE_COLORS } from "../color.js";

const VAR = { T: "--tonic", S: "--sub", D: "--dom" };

export class RollView {
  constructor(root, model, { onSeek }) {
    this.model = model;
    this.onSeek = onSeek;
    this.canvas = document.createElement("canvas");
    this.canvas.className = "roll";
    this.canvas.setAttribute("aria-label", "Piano roll");
    root.appendChild(this.canvas);
    const ms = model.notes.map((n) => n[2]);
    this.lo = Math.min(...ms) - 2;
    this.hi = Math.max(...ms) + 2;
    this.pos = 0;
    this.focus = null;
    this.colorBy = "fn";
    this.colors = {};
    new ResizeObserver(() => requestAnimationFrame(() => this.resize())).observe(this.canvas);
    this.canvas.addEventListener("pointerdown", (e) => this.seekAt(e));
  }

  readColors() {
    const cs = getComputedStyle(this.canvas);
    for (const [fn, v] of Object.entries(VAR)) this.colors[fn] = cs.getPropertyValue(v).trim();
    this.colors.line = cs.getPropertyValue("--line").trim();
    this.colors.muted = cs.getPropertyValue("--muted").trim();
    this.colors.text = cs.getPropertyValue("--text").trim();
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    if (!r.width) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(r.width * dpr);
    this.canvas.height = Math.round(r.height * dpr);
    this.w = r.width; this.h = r.height; this.dpr = dpr;
    this.readColors();
    this.draw();
  }

  get px() { return Math.max(8, this.w / 44); }       // pixels per sixteenth: under 3 bars on screen
  get headX() { return this.w * 0.28; }

  seekAt(e) {
    const r = this.canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    this.onSeek(Math.max(0, this.pos + (x - this.headX) / this.px));
  }

  tick(pos) { this.pos = pos; this.draw(); }
  setFocus(f) { this.focus = f; this.draw(); }
  setColorBy(c) { this.colorBy = c; this.draw(); }

  draw() {
    if (!this.w) return;
    const ctx = this.canvas.getContext("2d");
    const { w, h, dpr, px, headX, pos, model } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const top = 22, bottom = h - 8;
    const rowH = (bottom - top) / (this.hi - this.lo);
    const xOf = (t) => headX + (t - pos) * px;
    const yOf = (m) => bottom - (m - this.lo + 1) * rowH;

    // octave guides
    ctx.font = "11px 'JetBrains Mono', monospace";
    for (let m = Math.ceil(this.lo / 12) * 12; m <= this.hi; m += 12) {
      const y = yOf(m) + rowH;
      ctx.strokeStyle = this.colors.line; ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      ctx.globalAlpha = 0.55; ctx.fillStyle = this.colors.muted;
      ctx.fillText(`C${m / 12 - 1}`, 6, y - 3);
    }
    ctx.globalAlpha = 1;

    // bar lines and numbers
    const first = Math.max(0, Math.floor((pos - headX / px) / 16));
    const last = Math.min(model.nBars, Math.ceil((pos + (w - headX) / px) / 16));
    for (let b = first; b <= last; b++) {
      const x = xOf(b * 16);
      ctx.strokeStyle = this.colors.line; ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.moveTo(x, top - 6); ctx.lineTo(x, bottom); ctx.stroke();
      if (b < model.nBars) { ctx.globalAlpha = 0.6; ctx.fillStyle = this.colors.muted; ctx.fillText(String(b + 1), x + 4, 13); }
    }
    ctx.globalAlpha = 1;

    // notes
    const lo = pos - headX / px - 16, hi = pos + (w - headX) / px;
    for (const [on, len, midi] of model.notes) {
      if (on + len < lo || on > hi) continue;
      const bar = model.bars[Math.min(model.nBars - 1, Math.floor(on / 16))];
      const sounding = on <= pos && pos < on + len;
      const dim = this.focus && !matches(bar, this.focus);
      const x = xOf(on), y = yOf(midi), ww = Math.max(2, len * px - 1.5), hh = Math.max(2, rowH - 1.5);
      const col = this.colorBy === "note" ? NOTE_COLORS[midi % 12] : this.colors[bar.fn];
      ctx.fillStyle = col;
      ctx.globalAlpha = dim ? 0.12 : on + len < pos ? 0.42 : sounding ? 1 : 0.7;
      if (sounding && !dim) { ctx.shadowColor = col; ctx.shadowBlur = 14; }
      roundRect(ctx, x, y, ww, hh, Math.min(3, hh / 2));
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;

    // playhead
    ctx.strokeStyle = this.colors.text; ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.moveTo(headX, top - 8); ctx.lineTo(headX, bottom); ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
