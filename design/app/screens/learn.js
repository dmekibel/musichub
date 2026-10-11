// Learn: the Path, a lesson step, and the Ear gym.
// Rule for tests: color means harmony, so nothing that's being tested wears its color until the answer.
import { sleeve, shell, page, roomHead, ICON, hc } from "../ui.js?v=20261011e";
import { BACH } from "../data.js?v=20261011e";

const lenses = (on) => `<nav class="lenses">${[["learn", "Path"], ["gym", "Ear gym"], ["learn", "Masters"]].map(([id, l], i) => `<a href="#${id}" class="${(on === "path" && i === 0) || (on === "gym" && i === 1) ? "on" : ""}">${l}</a>`).join("")}</nav>`;

export function learn() {
  const unit1 = [["Home", "done", 0], ["Away", "done", 0.4], ["Tension", "now", 1], ["Coming home", "", 0], ["Review", "", 0.6]];
  const unit2 = [["The square", "", 1], ["Four children", "", 1], ["Bach's three squares", "", 1], ["Review", "", 1]];
  const node = ([t, st, h], i) => {
    const off = [0, 1, 2, 1, 0][i % 5] * 64;
    const col = st ? sleeve({ h, shape: st === "done" ? "chord" : "path", data: { pcs: [0, 4, 7] }, size: "s" }) : `<span class="lock">${ICON.lock}</span>`;
    return `<a class="pnode ${st}" href="${st === "now" ? "#lesson" : "#learn"}" style="margin-left:${off}px"><span class="disc">${col}${st === "done" ? `<em>${ICON.check}</em>` : ""}</span><span class="pl"><b>${t}</b>${st === "now" ? `<span class="btn sm">Start</span>` : ""}</span></a>`;
  };
  return shell("learn", `
    ${roomHead("Learn")}
    ${lenses("path")}
    <div class="unit"><span class="kicker">Unit 1</span><h2 class="disp d-m">Home, away and tension</h2><p class="t-s soft">Hear what every chord is doing, with real pieces.</p></div>
    <div class="path">${unit1.map(node).join("")}</div>
    <div class="unit"><span class="kicker">Unit 2</span><h2 class="disp d-m">The three squares</h2><p class="t-s soft">Barry Harris's building block, and why a G7 is almost a square.</p></div>
    <div class="path">${unit2.map(node).join("")}</div>
    <style>
      .unit { margin-top: 26px; padding: 16px; border-radius: 14px; background: var(--card); box-shadow: inset 0 0 0 1px var(--hair); }
      .unit .disp { margin-top: 4px; }
      .path { display: grid; gap: 14px; margin: 18px 0 0 24px; }
      .pnode { display: flex; align-items: center; gap: 14px; }
      .disc { position: relative; width: 64px; height: 64px; border-radius: 50%; overflow: hidden; display: grid; place-items: center; background: var(--paper-2); box-shadow: inset 0 0 0 1.5px var(--hair); flex: none; }
      .disc .sleeve { width: 64px; border-radius: 50%; }
      .pnode.now .disc { width: 76px; height: 76px; box-shadow: 0 0 0 4px var(--paper), 0 0 0 6px var(--ink); }
      .pnode.now .disc .sleeve { width: 76px; }
      .disc em { position: absolute; inset: 0; display: grid; place-items: center; color: #f7f1e6; background: rgba(35,32,28,.18); }
      .disc em svg { width: 26px; height: 26px; }
      .lock { color: var(--faint); } .lock svg { width: 22px; height: 22px; }
      .pl b { display: block; font-weight: 650; }
      .pl .btn { margin-top: 6px; }
      .pnode:not(.done):not(.now) .pl b { color: var(--faint); }
    </style>`);
}

export function lesson() {
  const opt = (k) => `<div class="opt" data-k="${k}"><span class="lbl disp">${k}</span><span class="wave">${Array.from({ length: 22 }, (_, i) => `<i style="height:${8 + Math.round(20 * Math.abs(Math.sin(i * (k === "A" ? 0.9 : 0.55))))}px"></i>`).join("")}</span><button class="play" data-k="${k}" aria-label="Play ${k}">${ICON.play}</button><span class="rev"></span></div>`;
  const html = page(`
    <div class="lhead"><a href="#learn" class="x">✕</a><div class="segs">${[1, 1, 1, 0, 0, 0, 0, 0].map((d, i) => `<i class="${d ? "d" : i === 3 ? "c" : ""}"></i>`).join("")}</div></div>
    <p class="kicker" style="margin-top:26px">Lesson 3 · Hearing tension · from the Prelude in C</p>
    <h1 class="disp" style="font-size:52px;margin-top:8px">Which one wants to move?</h1>
    <p class="t-m soft" style="margin-top:10px">Two chords from bars 11 and 12. One is settled, one leans forward. Play both, then pick.</p>
    <div class="opts">${opt("A")}${opt("B")}</div>
    <p class="t-s soft" id="hint" style="text-align:center;margin-top:18px">Guess before you check: a wrong guess still helps you remember.</p>
    <div class="lfoot"><button class="btn" id="check" style="width:100%" disabled>Check</button></div>
    <style>
      .lhead { display: flex; align-items: center; gap: 14px; height: 44px; }
      .x { font-size: 20px; color: var(--soft); width: 28px; }
      .segs { flex: 1; display: flex; gap: 4px; } .segs i { flex: 1; height: 6px; border-radius: 3px; background: var(--paper-2); } .segs i.d { background: var(--ink); } .segs i.c { background: var(--faint); }
      .opts { display: grid; gap: 12px; margin-top: 26px; }
      .opt { position: relative; display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 16px; background: var(--card); box-shadow: inset 0 0 0 1.5px var(--hair); cursor: pointer; transition: background .5s, box-shadow .2s; }
      .opt.on { box-shadow: inset 0 0 0 2.5px var(--ink); }
      .opt .lbl { font-size: 40px; width: 30px; }
      .wave { flex: 1; display: flex; align-items: center; gap: 3px; height: 40px; } .wave i { flex: 1; border-radius: 2px; background: var(--faint); }
      .opt.on .wave i { background: var(--ink); }
      .play { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; box-shadow: inset 0 0 0 1.5px var(--ink); color: var(--ink); flex: none; } .play svg { width: 18px; height: 18px; margin-left: 2px; }
      .rev { position: absolute; left: 62px; bottom: 6px; font-size: 13px; font-weight: 650; }
      .opt.shown { color: var(--i); } .opt.shown .wave i, .opt.shown .lbl { color: var(--i); background: currentColor; } .opt.shown .lbl { background: none; }
      .lfoot { margin-top: 40px; } .btn[disabled] { opacity: .4; }
    </style>`);
  return {
    html,
    async mount(root) {
      const S = await import("../sound.js?v=20261011e");
      const V = { A: BACH.bars[10], B: BACH.bars[11] };
      let pick = null, done = false;
      root.querySelectorAll(".play").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); S.chord(V[b.dataset.k].voicing, 2); }));
      root.querySelectorAll(".opt").forEach((o) => o.addEventListener("click", () => { if (done) return; pick = o.dataset.k; root.querySelectorAll(".opt").forEach((x) => x.classList.toggle("on", x === o)); root.querySelector("#check").disabled = false; S.chord(V[pick].voicing, 1.6); }));
      root.querySelector("#check").addEventListener("click", () => {
        if (!pick) return;
        if (done) { location.hash = "#learn"; return; }
        done = true;
        const right = pick === "B";
        root.querySelectorAll(".opt").forEach((o) => {
          const k = o.dataset.k, c = hc(k === "A" ? 0 : 1);
          o.classList.add("shown"); o.style.background = c.field; o.style.setProperty("--i", c.ink);
          o.querySelector(".rev").textContent = k === "A" ? "G major · settled (home in G)" : "C♯°7 · tension, leans to D minor";
        });
        root.querySelector("#hint").innerHTML = right ? "<b>Right.</b> The square (C♯°7) wants to move; G is settled." : "<b>Not this time.</b> Listen again: the square (C♯°7) is the one that leans forward.";
        root.querySelector("#check").textContent = "Continue";
      });
    },
  };
}

export function gym() {
  const opts = ["Major", "Minor", "Dominant seventh", "Diminished seventh"];
  return shell("learn", `
    ${roomHead("Learn")}
    ${lenses("gym")}
    <div class="gtop"><span class="pill">For you · level 4</span><span class="pill">Choose</span><span class="t-s soft" style="margin-left:auto">7 in a row</span></div>
    <h2 class="disp" style="font-size:44px;margin-top:22px">Name the chord</h2>
    <p class="t-s soft" style="margin-top:6px">Four kinds today. The look-alikes come together: dominant and diminished share three notes.</p>
    <div class="bigplay"><span>${ICON.play}</span></div>
    <div class="gopts">${opts.map((o) => `<a class="gopt">${o}</a>`).join("")}</div>
    <div class="dots">${Array.from({ length: 10 }, (_, i) => `<i class="${i < 6 ? "ok" : i === 6 ? "now" : ""}"></i>`).join("")}</div>
    <style>
      .gtop { display: flex; align-items: center; gap: 8px; margin-top: 16px; }
      .bigplay { display: grid; place-items: center; margin: 30px 0; }
      .bigplay span { width: 132px; height: 132px; border-radius: 50%; background: var(--ink); color: var(--paper); display: grid; place-items: center; box-shadow: 0 0 0 10px var(--paper-2); }
      .bigplay svg { width: 44px; height: 44px; margin-left: 6px; }
      .gopts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .gopt { display: grid; place-items: center; text-align: center; height: 72px; padding: 0 10px; border-radius: 14px; background: var(--card); box-shadow: inset 0 0 0 1.5px var(--hair); font-weight: 650; font-size: 16px; }
      .dots { display: flex; justify-content: center; gap: 8px; margin-top: 22px; }
      .dots i { width: 10px; height: 10px; border-radius: 50%; background: var(--paper-2); } .dots i.ok { background: var(--ink); } .dots i.now { box-shadow: 0 0 0 2px var(--ink); background: var(--paper); }
    </style>`);
}
