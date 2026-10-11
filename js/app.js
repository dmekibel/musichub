// MusicHub prototype: one piece, many linked lenses.
// Every view shows the same moment (the playhead) and the same focus (whatever you tapped),
// so selecting something in one place lights it up everywhere ("linked views").
import { BWV846 } from "../data/bwv846-analysis.js";
import { BWV846_NOTES } from "../data/bwv846-notes.js";
import { buildModel } from "./model.js";
import { Player } from "./audio.js";
import { pretty, PC_NAMES } from "./theory.js";
import { FN, h, matches, focusLabel, rnHTML } from "./ui.js";
import { JourneyView } from "./views/journey.js";
import { ClockView } from "./views/clock.js";
import { RollView } from "./views/roll.js";
import { SpineView } from "./views/spine.js";

const model = buildModel(BWV846, BWV846_NOTES);
const $ = (sel) => document.querySelector(sel);

const state = { lens: "journey", focus: null, bar: -1, colorBy: "fn", axes: false };
const player = new Player(model.notes, {
  tempo: model.piece.tempo,
  endAt: model.totalLen,
  onEnd: () => setPlaying(false),
});

// ---------- header ----------
$("#composer").textContent = `${model.piece.composer} · ${model.piece.year}`;
$("#title").textContent = model.piece.title;
$("#work").textContent = `${model.piece.work} · ${model.piece.catalog}`;
document.title = `${model.piece.title} · MusicHub`;

// ---------- lenses ----------
const seek = (pos) => { player.seek(pos); frame(true); };
const setFocus = (f) => {
  const same = f && state.focus && JSON.stringify(f) === JSON.stringify(state.focus);
  state.focus = same ? null : f;
  for (const v of [journey, clock, roll, spine]) v.setFocus?.(state.focus);
  renderFocus();
  renderNumbers();
};
const journey = new JourneyView($("#lens-journey"), model, { onFocus: setFocus });
const clock = new ClockView($("#lens-clock"), model, { onFocus: setFocus });
const roll = new RollView($("#lens-roll"), model, { onSeek: seek });
const spine = new SpineView($("#spine"), model, { onSeek: seek });

const LENS_CAPTION = {
  journey: "Press play and follow the light: is the music home, away, or in tension?",
  clock: "The notes of each chord as a shape on the 12-note clock.",
  roll: "Every note as it sounds, low to high.",
};
for (const btn of document.querySelectorAll("[data-lens]")) {
  btn.addEventListener("click", () => setLens(btn.dataset.lens));
}
function setLens(lens) {
  state.lens = lens;
  for (const btn of document.querySelectorAll("[data-lens]")) btn.setAttribute("aria-selected", btn.dataset.lens === lens);
  for (const p of document.querySelectorAll(".lens")) p.hidden = p.id !== `lens-${lens}`;
  $("#lens-caption").textContent = LENS_CAPTION[lens];
  $("#lens-tools").hidden = lens !== "clock";
  $("#colorby").hidden = lens === "journey";
  if (lens === "roll") roll.resize();
}

$("#axes-toggle").addEventListener("click", (e) => {
  state.axes = !state.axes;
  e.currentTarget.setAttribute("aria-pressed", state.axes);
  clock.showAxes(state.axes);
  $("#axes-note").hidden = !state.axes;
});
for (const btn of document.querySelectorAll("[data-colorby]")) {
  btn.addEventListener("click", () => {
    state.colorBy = btn.dataset.colorby;
    for (const b of document.querySelectorAll("[data-colorby]")) b.setAttribute("aria-pressed", b.dataset.colorby === state.colorBy);
    for (const v of [clock, roll, spine]) v.setColorBy(state.colorBy);
    $("#note-legend").hidden = state.colorBy !== "note";
  });
}

// ---------- the "now" readout ----------
function renderNow(b) {
  const c = b.chord;
  const suffix = c.quality.replace("dim7", "°7").replace("m7b5", "ø7");
  const root = pretty(c.rootName);
  $("#now-chord").innerHTML = "";
  $("#now-chord").append(...[
    h("span", { class: `chordchip fn-${b.fn}` },
      h("span", { class: "chordchip-root" }, root),
      suffix ? h("span", { class: "chordchip-flag" }, suffix) : null),
    c.bass !== c.root ? h("span", { class: "chord-bass" }, `/${pretty(c.bassName)}`) : null,
  ].filter(Boolean));
  $("#now-rn").innerHTML = rnHTML(b.rn);
  $("#now-fn").textContent = `${FN[b.fn].word} · ${FN[b.fn].theory}`;
  $("#now-fn").className = `fnbadge fn-${b.fn}`;
  $("#now-key").textContent = b.key === model.piece.home ? `in ${b.key} major` : `visiting ${b.key} major`;
  $("#now-bar").textContent = `Bar ${b.bar} of ${model.nBars}`;
}

// ---------- story ----------
function renderStory(b) {
  const sec = model.sectionOf(b.bar);
  $("#story-title").textContent = sec.title;
  $("#story-bars").textContent = `Bars ${sec.from}–${sec.to}`;
  $("#story-text").textContent = sec.story;
  const lines = [];
  if (b.pivot) lines.push(`Door chord: ${b.pivot}.`);
  if (b.applied) lines.push(`Borrowed chord: it points at ${b.applied}.`);
  if (b.note) lines.push(cap(b.note) + ".");
  if (b.pedal && !b.note) lines.push(`Held bass: ${pretty(b.pedal)}.`);
  $("#story-bar").textContent = lines.join(" ");
  $("#story-bar").hidden = !lines.length;
}
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// ---------- by the numbers ----------
function renderNumbers() {
  const s = model.stats, n = model.nBars;
  const root = $("#numbers-list");
  root.textContent = "";
  const fnBar = h("div", { class: "fnbar", role: "group", "aria-label": "Share of bars by function" });
  for (const fn of ["T", "S", "D"]) {
    const k = s.fnCount[fn];
    const on = state.focus?.kind === "fn" && state.focus.fn === fn;
    fnBar.append(h("button", {
      class: `fnbar-seg fn-${fn}${on ? " is-on" : ""}`, style: `flex:${k}`,
      "aria-pressed": on, onclick: () => setFocus({ kind: "fn", fn }),
    }, h("span", { class: "fnbar-word" }, FN[fn].word), h("span", { class: "mono" }, `${k}`)));
  }
  root.append(row("Home · away · tension", `${Math.round((s.fnCount.D / n) * 100)}% of the bars are tension`, fnBar));

  const outside = { kind: "bars", bars: s.outsideBars, label: "Bars with notes outside C major" };
  root.append(row("Notes from outside C major",
    `The first is ${pretty(s.firstOutsideName)} in bar ${s.firstOutside}. ${s.outsideBars.length} of ${n} bars use them.`,
    focusBtn(outside, "Show them")));

  const ped = s.pedalRuns.find((r) => r.value === "G");
  const pedF = { kind: "bars", bars: range(ped.from, ped.to), label: `Held ${ped.value} in the bass` };
  root.append(row("Longest held bass", `${pretty(ped.value)} for ${ped.to - ped.from + 1} bars (${ped.from}–${ped.to}).`, focusBtn(pedF, "Show it")));

  root.append(row("Smooth voices",
    `From bar to bar, the five voices move ${s.avgMove.toFixed(1)} semitones in total on average. ${Math.round(s.stepShare * 100)}% of moves are a step or less.`));
  root.append(row("Different chords", `${s.chordsUsed} chords across ${n} bars.`));
}
function row(label, text, extra) {
  return h("div", { class: "num-row" }, h("div", { class: "num-label" }, label), h("div", { class: "num-text" }, text), extra || null);
}
function focusBtn(f, word) {
  const on = state.focus && JSON.stringify(state.focus) === JSON.stringify(f);
  return h("button", { class: `ghostbtn${on ? " is-on" : ""}`, "aria-pressed": on, onclick: () => setFocus(f) }, on ? "Showing" : word);
}
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, k) => a + k);

function renderFocus() {
  const el = $("#focus");
  el.hidden = !state.focus;
  if (state.focus) $("#focus-text").textContent = focusLabel(state.focus, model);
}
$("#focus-clear").addEventListener("click", () => setFocus(null));

// ---------- transport ----------
const playBtn = $("#play");
playBtn.addEventListener("click", () => (player.playing ? pause() : play()));
$("#restart").addEventListener("click", () => { player.seek(0); frame(true); });
const tempo = $("#tempo");
tempo.value = model.piece.tempo;
const showTempo = () => ($("#tempo-val").textContent = tempo.value);
tempo.addEventListener("input", () => { player.setTempo(+tempo.value); showTempo(); });
showTempo();

async function play() { await player.play(); setPlaying(true); }
function pause() { player.pause(); setPlaying(false); }
function setPlaying(on) {
  playBtn.setAttribute("aria-label", on ? "Pause" : "Play");
  playBtn.classList.toggle("is-playing", on);
  document.body.classList.toggle("is-playing", on);
}

document.addEventListener("keydown", (e) => {
  if (e.target.closest("input, button, [role=button], [role=slider]") && e.key !== " ") return;
  if (e.key === " ") { e.preventDefault(); player.playing ? pause() : play(); }
  if (e.key === "1") setLens("journey");
  if (e.key === "2") setLens("clock");
  if (e.key === "3") setLens("roll");
  if (e.key === "Escape") setFocus(null);
  if (e.key === "ArrowRight") seek((state.bar + 1) * 16);
  if (e.key === "ArrowLeft") seek(Math.max(0, state.bar - 1) * 16);
});

// ---------- the loop ----------
function frame(force) {
  const pos = player.pos();
  const i = Math.max(0, Math.min(model.nBars - 1, Math.floor(pos / 16)));
  if (i !== state.bar || force === true) {
    state.bar = i;
    const b = model.bars[i];
    journey.setBar(i); clock.setBar(i); spine.setBar(i);
    renderNow(b); renderStory(b);
  }
  if (state.lens === "roll") roll.tick(pos); else roll.pos = pos;
  spine.tick(pos);
  $("#scrub-bar").textContent = state.bar + 1;
}
function loop() {
  requestAnimationFrame(loop);
  try { frame(); } catch (e) { console.error(e); }
}

// legend for note colors
import("./color.js").then(({ NOTE_COLORS }) => {
  const order = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];
  const lg = $("#note-legend");
  for (const pc of order) lg.append(h("span", { class: "legend-chip", style: `--c:${NOTE_COLORS[pc]}` }, PC_NAMES[pc]));
});

setLens("journey");
renderNumbers();
frame(true);
loop();
