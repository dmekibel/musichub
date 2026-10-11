// node design/engine/test.mjs — checks the engine against textbook facts
import * as H from "./harmony.js";
const C = 0, n = (x) => H.nameOf(x); let fails = 0;
const eq = (label, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) fails++; console.log(ok ? "ok  " : "FAIL", label, ok ? "" : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); };
const P = H.parseChord;
eq("jobs in C", ["C", "Am", "F", "Dm", "G7", "B°7", "Bm7b5"].map((s) => H.jobOf(P(s), C)), ["T", "T", "S", "S", "D", "D", "S"]);
eq("tension team in C", H.teamRoots(C, "D").map((r) => H.noteName(r)).sort(), ["B♭", "D♭", "E", "G"].sort());
eq("G7 swaps include the other dominants", ["B♭7", "D♭7", "E7"].every((s) => H.swap(P("G7"), C).some((o) => n(o.c) === s)), true);
eq("C approach kit", H.approach(P("C"), C).map((k) => k.seq.map(n).join(" ")), ["G7", "Dm7 G7", "D♭7", "B°7", "B♭7", "F", "Fm", "G7sus4 G7"]);
eq("Am approach uses half-diminished two", H.approach(P("Am"), C)[1].seq.map(n), ["Bm7♭5", "E7"]);
eq("major spice: add9 < maj7 < add11 < b6", H.spice(P("C")).map((x) => H.Q[x.c.q].sym).filter((s) => ["add9", "maj7", "add11", "(♭6)"].includes(s)), ["add9", "maj7", "add11", "(♭6)"]);
eq("minor spice: add11 < add9 < b6 < maj7", H.spice(P("Am")).map((x) => x.c.q).filter((q) => ["madd11", "madd9", "mb6", "mmaj7"].includes(q)), ["madd11", "madd9", "mb6", "mmaj7"]);
eq("works in another key (E♭): B♭7 is tension", H.jobOf(P("Bb7"), 3), "D");
eq("voice leading C→Am is 2 half steps", H.vlDistance(P("C"), P("Am")), 2);
console.log(fails ? `${fails} failed` : "all passed");
