// Router for the clickable prototype: every screen has a hash address.
import { today, player } from "./screens/listen.js";

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
  b.setProperty("--paper", c.deep); b.setProperty("--paper-2", `color-mix(in oklab, ${c.deep} 88%, #ffffff 12%)`); b.setProperty("--card", `color-mix(in oklab, ${c.deep} 91%, #ffffff 9%)`);
}

async function render() {
  const id = (location.hash.slice(1) || "today").split("?")[0];
  let fn = ROUTES[id];
  if (!fn && MODULES[id]) {
    try { const mod = await import(`./screens/${MODULES[id]}.js`); fn = mod[id]; ROUTES[id] = fn; } catch (e) { console.error(e); }
  }
  if (!fn) fn = today;
  adapt(id);
  const out = await fn();
  const root = document.getElementById("app");
  root.innerHTML = typeof out === "string" ? out : out.html;
  if (out && out.mount) out.mount(root);
  window.scrollTo(0, 0);
  document.title = `${id[0].toUpperCase() + id.slice(1)} · MusicHub`;
}
window.addEventListener("hashchange", render);
render();
