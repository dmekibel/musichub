// Chord space (after Dmitri Tymoczko, "The Geometry of Musical Chords", Science 2006; A Geometry of Music, 2011).
// Every three-note chord is a point in 3D. Sort its notes (x1 ≤ x2 ≤ x3, within an octave) and read the triple as a
// point; the long axis is the sum of the notes (moving every note up together slides you along it), and the cross-section
// is the chord's shape: perfectly even chords (augmented) sit on the centre line, major and minor triads wind close around
// it, clusters sit far out at the corners. The space is a twisted prism, so we draw it unrolled: each chord appears again
// every 12 steps along the axis, one third of a turn further round. Distance here = how far the notes have to move (voice
// leading), so chords one small step apart are neighbours, and a progression is a path.
// Bach's 7th chords are drawn by their three-note core (G7 → G B D, C♯°7 → C♯ E G); the full four-note space is 4D.
import * as S from "../app/sound.js?v=20261011e";
import { BACH } from "../app/data.js?v=20261011e";

const THREE = window.THREE;
const PCN = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const MIN = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"];
const FN = { T: 0xf2c14e, S: 0x3aa6a0, D: 0xe2546b }, FNC = { T: "#f2c14e", S: "#3aa6a0", D: "#e2546b" }, FNW = { T: "Home", S: "Away", D: "Tension" };
const TYPES = {
  maj: { iv: [0, 4, 7], name: (r) => PCN[r], col: "#f6f1e7", label: "Major" },
  min: { iv: [0, 3, 7], name: (r) => MIN[r] + "m", col: "#b9b2ff", label: "Minor" },
  dim: { iv: [0, 3, 6], name: (r) => MIN[r] + "°", col: "#ff9fae", label: "Diminished" },
  aug: { iv: [0, 4, 8], name: (r) => PCN[r] + "+", col: "#8fe3d0", label: "Augmented" },
  sus: { iv: [0, 5, 7], name: (r) => PCN[r] + "sus", col: "#ffd27a", label: "Sus" },
};
const mod = (a, n) => ((a % n) + n) % n;

// ---------- geometry: a sorted triple → 3D
const OFF = [0, 4, 8];
const e1 = [1 / Math.SQRT2, -1 / Math.SQRT2, 0], e2 = [1 / Math.sqrt(6), 1 / Math.sqrt(6), -2 / Math.sqrt(6)], ax = [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const SPREAD = 3.2, LIFT = 0.32;
function to3(t) { const v = [t[0] - OFF[0], t[1] - OFF[1], t[2] - OFF[2]]; return new THREE.Vector3(dot(v, e1) * SPREAD, dot(v, ax) * LIFT, dot(v, e2) * SPREAD); }
// all images of a chord along the unrolled prism: (a,b,c) → (b,c,a+12) → …
function images(pcs, n0 = -3, n1 = 6) { const t = [...pcs].sort((a, b) => a - b); let cur = t; const out = []; for (let n = 0; n < -n0; n++) cur = [cur[2] - 12, cur[0], cur[1]]; for (let n = n0; n <= n1; n++) { out.push(cur); cur = [cur[1], cur[2], cur[0] + 12]; } return out; }
const dist3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

// ---------- the piece's path: each chord's nearest image to the last one (the smallest total movement of the notes)
const ROOT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function core(sym) { const m = sym.split("/")[0], acc = m[1] === "#" ? 1 : m[1] === "b" ? -1 : 0, r = mod(ROOT[m[0]] + acc, 12), q = m.slice(acc ? 2 : 1); const type = q.startsWith("dim") ? "dim" : q === "m" || q === "m7" ? "min" : q.startsWith("7sus") ? "sus" : "maj"; return { r, type, pcs: TYPES[type].iv.map((x) => mod(r + x, 12)), q }; }
const PATH = []; let prev = [0, 4, 7];
for (const b of BACH.bars) { const c = core(b.chord); let best = null, bd = 1e9; for (const im of images(c.pcs, -4, 8)) { const d = dist3(im, prev); if (d < bd) { bd = d; best = im; } } PATH.push({ b, c, t: best, p: null, step: bd }); prev = best; }

// ---------- scene
const host = document.getElementById("gl");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); renderer.setPixelRatio(Math.min(2, devicePixelRatio)); host.appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0x2c2f55, 30, 90);
const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 400);
const controls = new THREE.OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.autoRotate = true; controls.autoRotateSpeed = 0.6; controls.enablePan = false;
function resize() { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener("resize", resize); resize();
scene.add(new THREE.AmbientLight(0xffffff, 0.75)); const dl = new THREE.DirectionalLight(0xffffff, 0.6); dl.position.set(5, 10, 7); scene.add(dl);

// the centre line (perfectly even chords) and faint rings to show the axis
const ySpan = [PATH.reduce((m, p) => Math.min(m, to3(p.t).y), 1e9) - 6, PATH.reduce((m, p) => Math.max(m, to3(p.t).y), -1e9) + 6];
const axisG = new THREE.BufferGeometry().setFromPoints([to3([0, 4, 8]).clone().setY(ySpan[0]), to3([0, 4, 8]).clone().setY(ySpan[1])]);
const axP = to3([0, 4, 8]); axisG.setFromPoints([new THREE.Vector3(axP.x, ySpan[0], axP.z), new THREE.Vector3(axP.x, ySpan[1], axP.z)]);
scene.add(new THREE.Line(axisG, new THREE.LineBasicMaterial({ color: 0xf6f1e7, transparent: true, opacity: 0.25 })));
for (let y = Math.ceil(ySpan[0] / 3) * 3; y < ySpan[1]; y += 3) { const ring = new THREE.Mesh(new THREE.RingGeometry(3.2, 3.24, 64), new THREE.MeshBasicMaterial({ color: 0xf6f1e7, transparent: true, opacity: 0.06, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.set(axP.x, y, axP.z); scene.add(ring); }

// text sprites
function label(text, color, size = 1) {
  const c = document.createElement("canvas"), g = c.getContext("2d"); c.width = 256; c.height = 96;
  g.font = "800 60px Archivo"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = color; g.fillText(text, 128, 50);
  const tex = new THREE.CanvasTexture(c); tex.minFilter = THREE.LinearFilter; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sp.scale.set(2.4 * size, 0.9 * size, 1); return sp;
}
// every chord of every type, each image within the path's height
const NODES = [], show = { maj: true, min: true, dim: true, aug: true, sus: false };
for (const [type, T] of Object.entries(TYPES)) for (let r = 0; r < 12; r++) {
  if (type === "aug" && r > 3) continue;
  const pcs = T.iv.map((x) => mod(r + x, 12));
  for (const im of images(pcs, -4, 8)) {
    const p = to3(im); if (p.y < ySpan[0] || p.y > ySpan[1]) continue;
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), new THREE.MeshStandardMaterial({ color: T.col, roughness: 0.5, transparent: true, opacity: 0.28 }));
    m.position.copy(p); scene.add(m);
    const lb = label(T.name(r), T.col, 0.75); lb.position.copy(p).add(new THREE.Vector3(0, 0.45, 0)); lb.visible = false; scene.add(lb);
    NODES.push({ type, r, t: im, p, m, lb, name: T.name(r), pcs });
  }
}
// the path: a glowing tube through Bach's chords, coloured by function, drawn up to the playhead
PATH.forEach((s) => (s.p = to3(s.t)));
const curve = new THREE.CatmullRomCurve3(PATH.map((s) => s.p), false, "centripetal", 0.4);
const tubeGeo = new THREE.TubeGeometry(curve, 420, 0.07, 8, false);
const cols = []; const pos = tubeGeo.attributes.position; for (let i = 0; i < pos.count; i++) { const ring = Math.floor(i / 9), u = ring / 420, bar = Math.min(34, Math.floor(u * 34 + 0.5)); const c = new THREE.Color(FN[BACH.bars[bar].fn]); cols.push(c.r, c.g, c.b); }
tubeGeo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
const tube = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 })); scene.add(tube);
const ghost = new THREE.Mesh(new THREE.TubeGeometry(curve, 420, 0.03, 6, false), new THREE.MeshBasicMaterial({ color: 0xf6f1e7, transparent: true, opacity: 0.12 })); scene.add(ghost);
const trav = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff6e4 })); scene.add(trav);
const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,246,228,.9)"); gr.addColorStop(0.3, "rgba(255,246,228,.35)"); gr.addColorStop(1, "rgba(255,246,228,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); halo.scale.set(3.4, 3.4, 1); scene.add(halo);

camera.position.copy(PATH[0].p).add(new THREE.Vector3(13, 6, 16)); controls.target.copy(PATH[0].p);

// ---------- frame
const target = PATH[0].p.clone(); let shown = -1;
function frame() {
  requestAnimationFrame(frame);
  const started = S.started() || S.pos() > 0, posQ = started ? S.pos() / 16 : 0, i = Math.min(34, Math.floor(posQ)), f = posQ - i;
  const u = Math.min(1, (i + Math.min(1, f * 2.5)) / 34);
  const pt = curve.getPointAt ? curve.getPoint(u) : PATH[i].p;
  trav.position.copy(pt); halo.position.copy(pt);
  tube.geometry.setDrawRange(0, Math.floor(u * 420) * 8 * 6);
  target.lerp(pt, 0.05); controls.target.copy(target);
  controls.update(); renderer.render(scene, camera);
  if (i !== shown && started) { shown = i; hud(i); }
}
// ---------- the readout: the chord, and its neighbours in the space ("variations next to each other")
const $ = (id) => document.getElementById(id);
function hud(i) {
  const s = PATH[i], b = s.b;
  $("ch").innerHTML = `${TYPES[s.c.type].name(s.c.r)}<small style="background:${FNC[b.fn]}">${FNW[b.fn]}</small>`;
  const near = NODES.filter((n) => !(n.type === s.c.type && n.r === s.c.r)).map((n) => ({ n, d: dist3(n.t, s.t) })).filter((x) => x.d < 1.5).sort((a, b) => a.d - b.d);
  const seen = new Set(); const list = near.filter(({ n }) => (seen.has(n.name) ? false : seen.add(n.name))).slice(0, 5);
  const moved = i ? `Bach's step here moves the notes <b>${s.step < 0.01 ? "not at all" : s.step.toFixed(1)}</b>${s.step < 0.01 ? "" : " (in half steps)"}. ` : "";
  $("near").innerHTML = `${moved}Next door: ${list.map(({ n }) => `<b>${n.name}</b>`).join(", ")}, each one small note move away.`;
  $("t").innerHTML = `<b>bar ${b.bar} · ${b.chord.replace("#", "♯")}</b>${s.c.q && s.c.q !== "m" && s.c.q !== "" ? "shown by its three-note core" : "drawn as itself"}`;
  const nb = new Set(list.map(({ n }) => n));
  NODES.forEach((n) => { const on = PATH.slice(0, i + 1).some((p) => p.t.join() === n.t.join()), isN = nb.has(n), cur = p_is(n, s); n.m.material.opacity = cur || on ? 1 : isN ? 0.85 : 0.22; n.m.scale.setScalar(cur ? 2.4 : on ? 1.5 : isN ? 1.3 : 1); n.m.material.color.set(on ? FNC[PATH.slice(0, i + 1).reverse().find((p) => p.t.join() === n.t.join()).b.fn] : TYPES[n.type].col); n.lb.visible = (cur || isN || (on && Math.abs(n.p.y - s.p.y) < 6)) && (show[n.type] || on); n.lb.material.opacity = cur ? 1 : isN ? 0.95 : 0.7; n.lb.scale.set(cur ? 3 : 2, cur ? 1.12 : 0.75, 1); });
}
const p_is = (n, s) => n.t.join() === s.t.join();
$("chips").innerHTML = Object.entries(TYPES).map(([k, T]) => `<button class="chip${show[k] ? "" : " off"}" data-k="${k}"><i style="background:${T.col}"></i>${T.label}</button>`).join("");
const applyShow = () => NODES.forEach((n) => { n.m.visible = show[n.type] || PATH.some((p) => p.t.join() === n.t.join()); if (!n.m.visible) n.lb.visible = false; });
document.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => { show[c.dataset.k] = !show[c.dataset.k]; c.classList.toggle("off", !show[c.dataset.k]); applyShow(); }));
applyShow();
const PLAY = `<svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="currentColor"/></svg>`, PAUSE = `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>`;
$("pp").addEventListener("click", () => S.toggle());
S.onChange(() => { $("pp").innerHTML = S.playing() ? PAUSE : PLAY; });
NODES.forEach((n) => { if (dist3(n.t, PATH[0].t) < 1.5 || p_is(n, PATH[0])) { n.lb.visible = show[n.type]; n.m.material.opacity = 0.9; } });
$("pp").innerHTML = PLAY; $("ch").textContent = "Chord space"; $("near").innerHTML = "Every chord is a place. Chords one small note-move apart are neighbours, so a progression is a journey. Press play.";
$("t").innerHTML = "<b>35 bars</b>Bach's path lights up as it plays";
// tap a chord to hear it
const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
renderer.domElement.addEventListener("click", (e) => { mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(mouse, camera); const hit = ray.intersectObjects(NODES.filter((n) => n.m.visible).map((n) => n.m))[0]; if (!hit) return; const n = NODES.find((x) => x.m === hit.object); S.chord(n.t.map((x) => 48 + x).map((m) => (m < 48 ? m + 12 : m)).sort((a, b) => a - b)); });
requestAnimationFrame(frame);
const q = new URLSearchParams(location.search); if (q.get("bar")) S.seekBar(+q.get("bar") - 1);
