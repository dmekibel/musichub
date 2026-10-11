// Router for the clickable prototype: every screen has a hash address.
const V = "20261011d";
import { today, player } from "./screens/listen.js?v=20261011d";

const ROUTES = { today, player };
const MODULES = {
  piece: "pages", style: "pages", shape: "pages",
  explore: "explore", river: "explore", wall: "explore", trail: "explore", search: "explore",
  learn: "learn", lesson: "learn", gym: "learn",
  lab: "lab", compare: "more", you: "more", welcome: "more", share: "more",
};

import { hc } from "./ui.js";
const THEME = new URLSearchParams(location.search).get("theme") || "adaptive";
if (THEME) document.body.dataset.theme = THEME;
// adaptive: the screen takes the harmonic color of what it shows (like Apple Music's now-playing)
const ROUTE_H = { today: 0.62, piece: 0.62, player: 0.62, style: 0.74, shape: 1, explore: 0.4, river: 0.4, wall: 0.5, trail: 0.74, search: 0.5, learn: 0.3, lesson: 0.3, lab: 1, compare: 0.8, you: 0.5, welcome: 0.62, share: 1 };
function adapt(id) {
  if (THEME !== "adaptive") return;
  const c = hc(ROUTE_H[id] ?? 0.6), b = document.body.style;
  b.setProperty("--paper", c.deep);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", c.deep); b.setProperty("--paper-2", `color-mix(in oklab, ${c.deep} 88%, #ffffff 12%)`); b.setProperty("--card", `color-mix(in oklab, ${c.deep} 91%, #ffffff 9%)`);
}

import * as S from "./sound.js";
import { BACH } from "./data.js";
let cleanup = null;
const PAUSE = `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>`;
const PLAY = `<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>`;
const FNW = { T: "home", S: "away", D: "tension" };
function updateMini() {
  const mini = document.querySelector(".mini"); if (!mini) return;
  mini.hidden = !S.started();
  const b = BACH.bars[S.bar()];
  const sub = document.getElementById("mini-sub"); if (sub) sub.textContent = `bar ${b.bar} · ${b.chord.split("/")[0].replace("dim7", "°7").replace("#", "♯")} · ${FNW[b.fn]}`;
  const pl = mini.querySelector(".pl"); if (pl) pl.innerHTML = S.playing() ? PAUSE : PLAY;
  const pr = document.getElementById("mini-prog"); if (pr) pr.style.width = (S.progress() * 100).toFixed(1) + "%";
}
S.onChange(updateMini); S.onTick(updateMini);

// one handler for every action button in the prototype
document.addEventListener("click", async (e) => {
  const el = e.target.closest("[data-act]"); if (!el) return;
  e.preventDefault(); e.stopPropagation();
  const act = el.dataset.act;
  if (act === "toggle") S.toggle();
  if (act === "listen") { await S.play(); location.hash = "#player"; }
  if (act === "chord") S.chord(el.dataset.notes.split(",").map(Number));
  if (act === "rhythm") S.rhythm(el.dataset.on.split(",").map(Number), +el.dataset.n);
  if (act === "save") { el.classList.toggle("saved"); el.lastChild.textContent = el.classList.contains("saved") ? "Saved" : "Save"; }
  if (act === "share") { try { if (navigator.share) await navigator.share({ title: document.title, url: location.href }); else { await navigator.clipboard.writeText(location.href); el.textContent = "Link copied"; } } catch (err) {} }
}, true);

async function render() {
  if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
  const id = (location.hash.slice(1) || "today").split("?")[0];
  let fn = ROUTES[id];
  if (!fn && MODULES[id]) {
    try { const mod = await import(`./screens/${MODULES[id]}.js?v=${V}`); fn = mod[id]; ROUTES[id] = fn; } catch (e) { console.error(e); }
  }
  if (!fn) fn = today;
  adapt(id);
  const out = await fn();
  const root = document.getElementById("app");
  root.innerHTML = typeof out === "string" ? out : out.html;
  if (out && out.mount) { const c = await out.mount(root); if (typeof c === "function") cleanup = c; }
  updateMini();
  window.scrollTo(0, 0);
  document.title = `${id[0].toUpperCase() + id.slice(1)} · MusicHub`;
}
window.addEventListener("hashchange", render);
render();
