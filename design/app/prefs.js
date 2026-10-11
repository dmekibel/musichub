// Small shared state for the prototype: the words switch and the trail (the way back through pages).
let words = "plain";
try { words = localStorage.getItem("mh-words") || "plain"; } catch (e) {}
export const plain = () => words === "plain";
export function toggleWords() { words = plain() ? "theory" : "plain"; try { localStorage.setItem("mh-words", words); } catch (e) {} }

// The trail: rooms (tabs) reset it; any other page is pushed; going to a page already on it cuts back to there.
export const trail = [];
const ROOMS = new Set(["today", "explore", "learn", "lab", "you"]);
export function visit(hash, id) {
  if (ROOMS.has(id)) { trail.length = 0; return null; }
  const at = trail.findIndex((t) => t.hash === hash);
  if (at >= 0) { trail.length = at + 1; return trail[at]; }
  trail.push({ hash, label: "" });
  return trail[trail.length - 1];
}
