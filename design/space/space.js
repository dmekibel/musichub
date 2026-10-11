// Two 3D views of one piece.
//   Places  chord space (after Dmitri Tymoczko, "The Geometry of Musical Chords", Science 2006). Every three-note chord is
//           a point: sort its notes and read them as coordinates. Chords one small note-move apart are neighbours, so a
//           progression is a path. Only Bach's chords are drawn; the current chord's neighbours appear around it.
//           (7th chords are drawn by their three-note core; the full four-note space is 4D.)
//   Voices  the braid: time rises up the screen, Bach's five voices are five threads. A thread's angle is its note on the
//           12-note circle and its distance from the centre is its register (bass inside). A held note runs straight up;
//           a note that moves bends. Each bar's chord is a soft shape joining the threads.
import * as S from "../app/sound.js?v=20261011e";
import { BACH } from "../app/data.js?v=20261011e";

const THREE = window.THREE;
const PCN = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const MIN = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"];
const FNC = { T: "#f2c14e", S: "#46b3a9", D: "#e8607a" }, FNW = { T: "Home", S: "Away", D: "Tension" };
const TYPES = { maj: { iv: [0, 4, 7], name: (r) => PCN[r] }, min: { iv: [0, 3, 7], name: (r) => MIN[r] + "m" }, dim: { iv: [0, 3, 6], name: (r) => MIN[r] + "°" }, aug: { iv: [0, 4, 8], name: (r) => PCN[r] + "+" }, sus: { iv: [0, 5, 7], name: (r) => PCN[r] + "sus" } };
const mod = (a, n) => ((a % n) + n) % n;
const $ = (id) => document.getElementById(id);
await document.fonts.load("800 60px Archivo"); await document.fonts.load("700 40px Archivo");

// ---------- shared scene
const host = $("gl");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); renderer.setPixelRatio(Math.min(2, devicePixelRatio)); host.appendChild(renderer.domElement);
// isometric: an orthographic camera at a fixed angle (no perspective, nothing swirls, everything stays the same size)
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 500);
let viewH = 13, isoTurn = 0;
const ISO = () => (mode === "voices" ? new THREE.Vector3(0.32 + Math.sin(isoTurn), 0.62, Math.cos(isoTurn)) : new THREE.Vector3(Math.sin(Math.PI / 4 + isoTurn), 0.82, Math.cos(Math.PI / 4 + isoTurn))).normalize();
function resize() { renderer.setSize(innerWidth, innerHeight); const a = innerWidth / innerHeight; camera.left = (-viewH * a) / 2; camera.right = (viewH * a) / 2; camera.top = viewH / 2; camera.bottom = -viewH / 2; camera.updateProjectionMatrix(); }
// swipe sideways to turn the board a quarter at a time; pinch or wheel to zoom
let sx = null; renderer.domElement.addEventListener("pointerdown", (e) => (sx = e.clientX)); renderer.domElement.addEventListener("pointerup", (e) => { if (sx != null && Math.abs(e.clientX - sx) > 50) turnGoal += (e.clientX < sx ? 1 : -1) * Math.PI / 2; sx = null; });
let turnGoal = 0; renderer.domElement.addEventListener("wheel", (e) => { viewH = Math.max(7, Math.min(30, viewH * (e.deltaY > 0 ? 1.08 : 0.93))); resize(); }, { passive: true });
addEventListener("resize", resize); resize();
const disc = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"); g.fillStyle = "#fff"; g.beginPath(); g.arc(64, 64, 56, 0, 7); g.fill(); return new THREE.CanvasTexture(c); })();
const glow = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,248,234,.85)"); gr.addColorStop(0.35, "rgba(255,248,234,.25)"); gr.addColorStop(1, "rgba(255,248,234,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
const dot = (color, size) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: disc, color, transparent: true, depthWrite: false })); s.scale.set(size, size, 1); return s; };
function label(text, color = "#f6f1e7", size = 1, weight = 800) {
  const c = document.createElement("canvas"), g = c.getContext("2d"); c.width = 320; c.height = 110;
  g.font = `${weight} 64px Archivo`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = color; g.fillText(text, 160, 58);
  const tex = new THREE.CanvasTexture(c); tex.minFilter = THREE.LinearFilter; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sp.scale.set(2.2 * size, 0.76 * size, 1); return sp;
}
const line = (pts, color, opacity) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity }));

// ---------- PLACES: chord space
const places = new THREE.Group();
const OFF = [0, 4, 8], e1 = [1 / Math.SQRT2, -1 / Math.SQRT2, 0], e2 = [1 / Math.sqrt(6), 1 / Math.sqrt(6), -2 / Math.sqrt(6)], ax = [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)];
const dt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const to3 = (t) => { const v = [t[0] - OFF[0], t[1] - OFF[1], t[2] - OFF[2]]; return new THREE.Vector3(dt(v, e1) * 3.2, dt(v, ax) * 0.34, dt(v, e2) * 3.2); };
function images(pcs) { const t = [...pcs].sort((a, b) => a - b); let cur = t; const out = []; for (let n = 0; n < 4; n++) cur = [cur[2] - 12, cur[0], cur[1]]; for (let n = -4; n <= 8; n++) { out.push(cur); cur = [cur[1], cur[2], cur[0] + 12]; } return out; }
const dist3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const ROOT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function core(sym) { const m = sym.split("/")[0], acc = m[1] === "#" ? 1 : m[1] === "b" ? -1 : 0, r = mod(ROOT[m[0]] + acc, 12), q = m.slice(acc ? 2 : 1); const type = q.startsWith("dim") ? "dim" : q === "m" || q === "m7" ? "min" : q.startsWith("7sus") ? "sus" : "maj"; return { r, type, pcs: TYPES[type].iv.map((x) => mod(r + x, 12)), q }; }
const PATH = []; { let prev = [0, 4, 7]; for (const b of BACH.bars) { const c = core(b.chord); let best = null, bd = 1e9; for (const im of images(c.pcs)) { const d = dist3(im, prev); if (d < bd) { bd = d; best = im; } } PATH.push({ b, c, t: best, p: to3(best), step: bd }); prev = best; } }
// the stations: each distinct chord position Bach visits
const STATIONS = new Map(); PATH.forEach((s, i) => { const k = s.t.join(); if (!STATIONS.has(k)) STATIONS.set(k, { s, first: i, d: dot(0xf6f1e7, 0.62), lb: label(TYPES[s.c.type].name(s.c.r), "#f6f1e7", 1.15) }); });
for (const st of STATIONS.values()) { st.d.position.copy(st.s.p); st.lb.position.copy(st.s.p).add(new THREE.Vector3(0, 0.75, 0)); places.add(st.d, st.lb); }
// all neighbour candidates (any chord type, any image) near the path, created hidden
const NB = []; for (const [type, T] of Object.entries(TYPES)) for (let r = 0; r < 12; r++) { if (type === "aug" && r > 3) continue; for (const im of images(T.iv.map((x) => mod(r + x, 12)))) { if (!PATH.some((s) => dist3(s.t, im) < 1.6)) continue; if (STATIONS.has(im.join())) continue; const p = to3(im), d = dot(0xb9b2ff, 0.42), lb = label(T.name(r), "#d9d4ff", 0.95, 700); d.position.copy(p); lb.position.copy(p).add(new THREE.Vector3(0, 0.6, 0)); d.visible = lb.visible = false; places.add(d, lb); NB.push({ t: im, p, d, lb, name: T.name(r) }); } }
const spokes = new THREE.Group(); places.add(spokes);
const ys = PATH.map((s) => s.p.y), axP = to3([0, 4, 8]);
places.add(line([new THREE.Vector3(axP.x, Math.min(...ys) - 4, axP.z), new THREE.Vector3(axP.x, Math.max(...ys) + 4, axP.z)], 0xf6f1e7, 0.18));
const curve = new THREE.CatmullRomCurve3(PATH.map((s) => s.p), false, "centripetal", 0.5);
const SEG = 420;
const tubeGeo = new THREE.TubeGeometry(curve, SEG, 0.085, 8, false); { const cols = [], n = tubeGeo.attributes.position.count; for (let i = 0; i < n; i++) { const u = Math.floor(i / 9) / SEG, c = new THREE.Color(FNC[BACH.bars[Math.min(34, Math.round(u * 34))].fn]); cols.push(c.r, c.g, c.b); } tubeGeo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3)); }
const tube = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ vertexColors: true })); places.add(tube);
places.add(new THREE.Mesh(new THREE.TubeGeometry(curve, SEG, 0.025, 6, false), new THREE.MeshBasicMaterial({ color: 0xf6f1e7, transparent: true, opacity: 0.14 })));

// ---------- VOICES: five ridgelines (time runs left to right; each voice is one ridge; bass in front, soprano at the back)
const voices = new THREE.Group();
const V5 = BACH.bars.map((b) => [b.voicing[0], b.voicing[1], ...b.voicing.slice(-3)]);
const STEP = 1.0, LANE = 1.7, vy = (m, v) => ((m - 36) / 45) * 5 - v * 0.0, vz = (v) => (4 - v) * LANE - 3.4;
const vPos = (m, v, x) => new THREE.Vector3(x, vy(m, v), vz(v));
const VCOL = ["#f2c14e", "#e8b04a", "#9fb7ff", "#b9a8ff", "#e9a3ff"];
for (let v = 0; v < 5; v++) {
  // a stepped profile: flat while the note holds, a short ramp when it moves
  const prof = []; V5.forEach((ch, i) => { const x0 = i * STEP, m = ch[v]; prof.push([x0 + 0.12, m], [x0 + STEP - 0.12, m]); });
  const path = new THREE.CurvePath(); for (let k = 0; k < prof.length - 1; k++) path.add(new THREE.LineCurve3(vPos(prof[k][1], v, prof[k][0]), vPos(prof[k + 1][1], v, prof[k + 1][0])));
  voices.add(new THREE.Mesh(new THREE.TubeGeometry(path, prof.length * 6, 0.06, 6, false), new THREE.MeshBasicMaterial({ color: "#fff8ea" })));
  // the ridge's body: a soft curtain down to the floor
  const pos = []; for (let k = 0; k < prof.length - 1; k++) { const [x1, m1] = prof[k], [x2, m2] = prof[k + 1], z = vz(v), y1 = vy(m1, v), y2 = vy(m2, v), f = -1.2; pos.push(x1, y1, z, x2, y2, z, x2, f, z, x1, y1, z, x2, f, z, x1, f, z); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  voices.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: VCOL[v], transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false })));
}
// the current bar: a glowing slice across all five ridges
const sliceMat = new THREE.MeshBasicMaterial({ color: "#fff8ea", transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false });
const slice = new THREE.Mesh(new THREE.PlaneGeometry(STEP, 9), sliceMat); slice.rotation.y = Math.PI / 2; voices.add(slice);
const slice2 = new THREE.Mesh(new THREE.BoxGeometry(STEP * 0.98, 7.2, LANE * 5), new THREE.MeshBasicMaterial({ color: "#fff8ea", transparent: true, opacity: 0.06, depthWrite: false })); voices.add(slice2);
const noteLbls = [0, 1, 2, 3, 4].map(() => { const l = label("", "#fff8ea", 1.0); voices.add(l); return l; });
const voiceNames = ["bass", "left hand", "right hand", "", "top"]; voiceNames.forEach((n, v) => { if (!n) return; const l = label(n, "rgba(246,241,231,.55)", 0.8, 700); l.position.set(-1.6, vy(V5[0][v], v) + 0.2, vz(v)); voices.add(l); });
const setText = (sp, text, color) => { const c = sp.material.map.image, g = c.getContext("2d"); g.clearRect(0, 0, c.width, c.height); g.font = "800 64px Archivo"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = color; g.fillText(text, 160, 58); sp.material.map.needsUpdate = true; };
let lastLbl = -1;
const slices = [];

// ---------- the traveller (shared)
const trav = dot(0xfff8ea, 0.62), halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); halo.scale.set(3.2, 3.2, 1);
const scene = new THREE.Scene(); scene.add(places, voices, trav, halo);
let mode = "places"; voices.visible = false;
function setMode(m) { mode = m; places.visible = m === "places"; voices.visible = m === "voices"; document.querySelectorAll("#modes button").forEach((b) => b.classList.toggle("on", b.dataset.m === m)); viewH = m === "places" ? 13 : 14; resize(); shown = -1; hud(); }

// ---------- frame
const target = PATH[0].p.clone(); let shown = -1;

function frame() {
  requestAnimationFrame(frame);
  const started = S.started() || S.pos() > 0, q = started ? S.pos() / 16 : 0, i = Math.min(34, Math.floor(q)), f = q - i;
  let pt;
  if (mode === "places") { const u = Math.min(1, (i + Math.min(1, f * 2.5)) / 34); pt = curve.getPoint(u); const u0 = Math.max(0, u - 7 / 34); tube.geometry.setDrawRange(Math.floor(u0 * SEG) * 8 * 6, Math.max(0, Math.floor(u * SEG) - Math.floor(u0 * SEG)) * 8 * 6); }
  else { pt = new THREE.Vector3(q * STEP, 1.2, 0); slice2.position.set(i * STEP + STEP / 2, 2.2, 0); slice.position.set(i * STEP + STEP / 2, 2.2, 0); if (i !== lastLbl) { lastLbl = i; V5[i].forEach((m, v) => { const moved = i && m !== V5[i - 1][v]; setText(noteLbls[v], PCN[m % 12], moved ? "#f2c14e" : "#fff8ea"); noteLbls[v].position.copy(vPos(m, v, i * STEP + STEP / 2)).add(new THREE.Vector3(0, 0.6, 0)); }); } }
  trav.position.copy(pt); halo.position.copy(pt); trav.visible = halo.visible = mode === "places";
  target.lerp(pt, 0.06); isoTurn += (turnGoal - isoTurn) * 0.1;
  camera.position.copy(target).addScaledVector(ISO(), 60); camera.lookAt(target); renderer.render(scene, camera);
  if (i !== shown && started) { shown = i; hud(); }
}

// ---------- readout
function hud() {
  const started = S.started() || S.pos() > 0; if (!started) return;
  const i = S.bar(), s = PATH[i], b = s.b;
  $("ch").innerHTML = `${TYPES[s.c.type].name(s.c.r)}<small style="background:${FNC[b.fn]}">${FNW[b.fn]}</small>`;
  if (mode === "places") {
    const near = NB.map((n) => ({ n, d: dist3(n.t, s.t) })).filter((x) => x.d < 1.5).sort((a, c) => a.d - c.d), seen = new Set(), list = near.filter(({ n }) => (seen.has(n.name) ? false : seen.add(n.name))).slice(0, 5);
    NB.forEach((n) => (n.d.visible = n.lb.visible = false)); spokes.clear();
    list.forEach(({ n }) => { n.d.visible = n.lb.visible = true; spokes.add(line([s.p, n.p], 0xd9d4ff, 0.4)); });
    for (const st of STATIONS.values()) { const seenSt = st.first <= i, cur = st.s.t.join() === s.t.join(); st.d.material.color.set(seenSt ? FNC[PATH.slice(0, i + 1).reverse().find((p) => p.t.join() === st.s.t.join()).b.fn] : "#f6f1e7"); st.d.material.opacity = cur ? 1 : seenSt ? 0.9 : 0.25; st.d.scale.setScalar(cur ? 0.9 : 0.5); const near = Math.abs(st.s.p.y - s.p.y) < 5.5 || dist3(st.s.t, s.t) < 4; st.d.visible = seenSt ? near || cur : near; st.lb.visible = (seenSt && near) || cur; st.lb.material.opacity = cur ? 1 : 0.6; st.lb.scale.set(cur ? 2.8 : 1.8, cur ? 0.97 : 0.62, 1); }
    $("near").innerHTML = `${i ? `This step moves the notes <b>${s.step < 0.01 ? "not at all" : s.step.toFixed(1) + " half steps"}</b>. ` : ""}Next door: ${list.map(({ n }) => `<b>${n.name}</b>`).join(", ")}.`;
  } else {
    const prevV = i ? V5[i - 1] : null, held = prevV ? V5[i].filter((m, k) => m === prevV[k]).length : 5;
    $("near").innerHTML = i ? `<b>${held} of 5 voices hold still</b>; ${5 - held} ${5 - held === 1 ? "moves" : "move"}${5 - held ? ` (${V5[i].map((m, k) => (m !== prevV[k] ? `${PCN[prevV[k] % 12]}→${PCN[m % 12]}` : "")).filter(Boolean).join(", ")})` : ""}.` : "Five voices: two in the left hand, three in the right.";
  }
  $("t").innerHTML = `<b>bar ${b.bar} · ${b.chord.replace("#", "♯")}</b>${mode === "places" ? "drag to turn the space" : "time runs left to right · gold = a note that moved"}`;
}
document.querySelectorAll("#modes button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.m)));
const PLAY = `<svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="currentColor"/></svg>`, PAUSE = `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>`;
$("pp").addEventListener("click", () => S.toggle());
S.onChange(() => { $("pp").innerHTML = S.playing() ? PAUSE : PLAY; });
$("pp").innerHTML = PLAY; $("ch").textContent = "Chord space";
$("near").innerHTML = "Places: every chord is a point, and neighbours are one small note-move apart. Voices: Bach's five voices as threads. Press play.";
$("t").innerHTML = "<b>35 bars</b>Bach's path lights up as it plays";
const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
renderer.domElement.addEventListener("click", (e) => { if (mode !== "places") return; mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(mouse, camera); const pool = [...[...STATIONS.values()].map((s) => ({ t: s.s.t, d: s.d })), ...NB.filter((n) => n.d.visible)]; const hit = ray.intersectObjects(pool.map((p) => p.d))[0]; if (!hit) return; const n = pool.find((p) => p.d === hit.object); S.chord(n.t.map((v) => 48 + mod(v, 12)).sort((a, c) => a - c)); });
requestAnimationFrame(frame);
const qs = new URLSearchParams(location.search); if (qs.get("bar")) S.seekBar(+qs.get("bar") - 1); if (qs.get("mode")) setMode(qs.get("mode"));
