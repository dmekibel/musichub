# The core: what MusicHub shows, for whom, and why it teaches (2026-10-11)

David on the Light Score and Harmony Map experiments: "interesting, but intimidating, overwhelming, not clean. What is the
core way to visualize the song, for whom, and how will that help you see the secret patterns behind what makes songs great?"

## The verdict on the experiments
They were geometry first and meaning second. A picture is worth showing only if a beginner can say what it means in one
sentence. "Lights on a circle of fifths joined by lines" fails that test. Both stay in `design/epic/` and `design/map/` as
labs, not as the product.

## For whom
The core user is **someone who loves music and wants to know why it moves them.** That covers ColorHub's person (curious,
visual, learns names), a piano learner and a student. Theory experts and jazz players are the deep end: they get the
geometry (squares, Atlas, keys) as advanced lenses, not as the front door.

## What actually makes songs great (the secret patterns)
Four things, all of them visible and all of them computable from our data:
1. **Tension and release.** Music leaves home, travels, builds tension and comes back. Greatness is mostly *timing*:
   how far it goes, how long it withholds home, when it pays off. (Bach waits eight bars on a low G before letting you home.)
2. **Moves.** Most music is built from a few dozen named moves: the 2-5-1, going home, the four-chord loop, the borrowed
   minor four, the passing square, the fifths staircase. Songs are recognizable recombinations of them. **This is
   ColorHub's color names, for music:** a vocabulary you can learn, spot and collect.
3. **Expectation and surprise.** Songs set up a pattern, then bend it (the deceptive cadence, the borrowed chord). How
   surprising a moment is can be measured against the archive: what usually comes next here.
4. **Repetition with change.** The same move comes back in a new color; form (verse, chorus, return) is that pattern
   at large scale.

## So the core visualization is one line: the Journey
**A song is a journey from home and back, drawn as a landscape over time.** Home is the ground; height is how far from home
and how tense the music is, and color says which kind (home, away, tension). That's the only thing on the main screen:
- you see the whole song's shape at a glance (where it climbs, where it waits, where it lands);
- the playhead walks the line as it plays;
- **moves are named right on the line**, like labels on a map ("going home", "2-5-1", "the long wait");
- tap a move to see **the same move in other songs**. That's the rabbit hole and the archive's point: you start
  hearing it everywhere.

Anyone gets it in one sentence: *"the song leaves home, climbs, and comes back."* An expert can still read numerals on demand.

## Levels of depth (one song, deeper each time)
1. **Feel:** the Journey: home, away, tension (no words needed).
2. **Moves:** named moves on the line, the vocabulary (the Duolingo loop: learn a move, spot it in songs, collect it).
3. **Chords:** chord names, keys, the Keys lens for hands.
4. **Why:** the math lenses for people who want it: the Atlas, the squares (Barry Harris), the Five Dials.

## The home screen (ColorHub's map, done right)
Not a map of every chord, but **a wall of moves**: each move is a small swatch showing its own little journey line, grouped by
what it does (going home, leaving, surprising, looping). It's clean like a palette and learnable like color names. Tap a
move and you hear it, see it in songs, and learn it.

## What this changes
- The Player becomes the Journey (one line, named moves, playhead); the other lenses move behind a "Look deeper" control.
- The idea pages become move pages (a move, the songs it's in, how it works).
- The analysis data needs a moves layer: a list of named spans per piece (Bach: going home bars 1–4, the trip to G,
  the passing squares, the long wait on G, the final arrival).

## Decision after the labs (2026-10-11, late)
Labs tried and judged: Light Score, Harmony Map, Journey and the wall of moves, the 10-lens slate, Harmony World, the
honeycomb, the music chart, and 3D chord space. David doesn't read theory deeply and asked Claude to decide. The decision:
- **The main screen is one smart chart** (the stock-chart idea), but layered *on top of itself* instead of stacked in
  far-apart panes. One plot: the tension line, the chord blocks along its base, the bass drawn inside, the key and form as
  background bands, cadences and squares as markers on the line. Extra detail appears only on tap or with the crosshair.
- **The honeycomb is the second lens** (where the chord sits and how notes move), shown small beside or under the chart.
- **3D is not the core.** Tymoczko's chord space is real math, but on a phone it reads as chaos. Keep it for a later,
  carefully art-directed showpiece that shows one chord's neighbourhood, not the whole space.
- **Process change:** no more quick rough prototypes. One screen, designed from references, polished as a static
  mockup in the Dusk palette, then made interactive.
