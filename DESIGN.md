# MusicHub design (v0, 2026-10-11)

ColorHub sees the world through color. MusicHub hears every piece as a dataset: notes, chords,
functions, keys, tension, form, rhythm, era. The job is to compute all of it honestly and show
a calm, beautiful summary first, with every deeper layer one tap away.

## Who it's for, and what each person asks

| User | Their question | Front door | Lens that answers it |
|---|---|---|---|
| Curious listener (biggest group) | "What's happening in this music? Why does it feel like that?" | Press play | Journey (home / away / tension), the story card, the tension line |
| Learner | "What chord is that? Why does it work?" | Tap a chord | Chords (the 12-note clock), Roman numerals, voice motion |
| Musician / theory nerd | "Show me the structure. Let me play with it." | Lab (later) | Diminished squares (Barry Harris), Tonnetz, spiral, reharmonizing |
| Digger / collector | "Find music I'd love. Show me the landscape." | Archive (later) | Wall of piece fingerprints, map × decade, rhythm shapes |

## The one rule: one moment, many lenses
Every view answers "what is happening right now?" from a different angle, and they share three
things: **time** (one playhead), **focus** (tap anything and it lights up everywhere: "linked
views", Becker and Cleveland 1987) and **color grammar** (below). The archive applies the same rule
at a larger scale: a piece is a moment in history.

## Which visualizations are worth it (ROI)
Ranked by value × how many people it serves ÷ cost to build and to read.

1. **The whole-piece strip** (sections, a chip per bar, tension line). Anyone reads it in two
   seconds; it's the scrubber too. Always visible, at the top.
2. **Journey** (three chambers: Tension / Home / Away). The meaning layer for everyone; three
   categories you learn in one glance. Front view of the 3D "harmonic hourglass".
3. **Chords clock.** Chord types become shapes; voice leading becomes motion; the Barry Harris
   squares live here.
4. **Piano roll.** Familiar (Synthesia, Malinowski), grounding, little insight on its own. A lens,
   not the hero.
5. **Keyscape / fingerprint poster.** Needs many pieces to compare. Archive phase.
6. **Tonnetz, spiral array, voice-leading space.** Nerd depth. Lab phase.
7. **Surprise from style statistics** (Huron, Temperley). Needs a corpus of 50+ pieces first.

## Color grammar (decide once, keep everywhere)
After Bertin's visual variables: hue for categories, lightness for amounts.
- **Hue = harmonic function** by default: Home amber, Away green, Tension violet (after the
  orange / green / purple of a Barry Harris "harmonic hourglass" video David shared).
- **"Color by Note"** (Chords and Notes lenses): each of the 12 notes gets a hue placed around
  the circle of fifths, so related notes look related (the idea behind Scriabin's and Malinowski's
  color keyboards). The hues share one OKLCH lightness and chroma, so no note looks louder than
  another. That's ColorHub's color science.
- **Never two hue meanings on screen at once.** Journey is always function.
- Amounts (tension, how often) use brightness, size, height or dots, never a new hue.
- The three diminished axes have their own colors, used only in the diminished-squares layer.

## 2D first, 3D where the math really is 3D
3D costs a lot: things hide behind each other, it has to rotate, it's hard on a phone, and
depth distorts how big things look. So reading happens in 2D. 3D comes in only where the math
itself is 3D, as an explorable showpiece:
- **The harmonic hourglass** is a ring folded into a solid: its edges are the three diminished
  chords, and the blue one shows at both top and bottom because it joins Tension back to Away.
  Journey is its front view. A rotating 3D version can come later as a showpiece.
- **Chew's spiral array** (fifths around, thirds up) shows a whole piece's key journey in 3D.
- **Tymoczko's chord spaces** (three-note chords live in a twisted prism).

## v0 (this prototype)
One piece: Bach's Prelude in C major (35 bars, one chord per bar: the cleanest possible test).
- Spine, Journey, Chords (with diminished squares), Notes, the "now" readout, a story card per
  section, and "By the numbers" (each number is a button that highlights its bars everywhere).
- Sound is synthesized in the browser. Tempo slider. Drag the strip to scrub.
- Analysis is hand-written and machine-checked against every note (`node tools/check.js`).

## Next, in order
1. David's eye on his phone → fix what he flags.
2. Piece 2 with key changes (a Bach chorale, or a Chopin prelude) to stress-test Journey.
3. Lab: the three diminished squares as a toy (nudge a note: the 8 children of each square).
4. Archive seed: 20 public-domain pieces, a fingerprint per piece, a wall sorted by fingerprint.
5. A 3D showpiece (hourglass or spiral) once 2D reading works.

## Sources behind the decisions
Becker & Cleveland (brushing and linking) · Bertin, *Semiology of Graphics* (visual variables) ·
Tufte (small multiples, sparklines) · Malinowski, Music Animation Machine (colored piano roll) ·
Lendvai's axis system and Barry Harris's 6th-diminished method (the three squares) · Tymoczko,
*A Geometry of Music* (voice leading as motion) · Plomp & Levelt (roughness → tension estimate) ·
Chew, spiral array and MuSA_RT (live tonal maps) · Sapp, keyscapes (fingerprint posters) ·
ColorHub DESIGN.md (one primary action, feature tiers, OKLCH even hues).
