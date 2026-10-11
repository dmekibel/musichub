# MusicHub: how everything relates (the deep pass, 2026-10-11)

ColorHub sees the world through color and does its own research with its archive. MusicHub does the
same for music: **become the archive, measure everything the same way, then do research with it**.
This file is the layer under the screens: the one piece of math, the measures, how every view
relates to every other, the data nobody has drawn before, and the research it makes possible.

---

## 1. One idea under everything: music is shapes on a circle, moving through time

- **Pitch is a circle** (the 12-note clock). A chord, a scale or a whole piece's notes form a **shape** on it.
- **Rhythm is a circle too** (one bar of pulses). A groove is a shape on that circle.
- **Time is the path** those shapes take.

So one geometry covers harmony, scales, rhythm and form. Every view in the app is this geometry,
measured and seen at a different **scale**.

### The Five Dials (the math that ties it together)
The discrete Fourier transform of the notes (Quinn, Amiot, Yust: mathematical music theory)
measures how much any collection of notes leans toward each symmetric shape. Each of the five dials
has a **strength** (how much) and a **direction** (which one).

| Dial | Shape | How many directions | Whose world it is |
|---|---|---|---|
| **Key** (5th coefficient) | the circle of fifths | 12, one per key | Bach, pop, folk: diatonic music |
| **Squares** (4th) | diminished seventh | 3: the three diminished squares | **Barry Harris**, Lendvai's axes, octatonic Stravinsky and Messiaen |
| **Triangles** (3rd) | augmented triad | 4: the four major-third cycles | **Coltrane**'s "Giant Steps", Liszt, film music |
| **Hexagons** (6th) | whole-tone scale | 2: the two whole-tone scales | **Debussy**, dream sequences |
| **Cluster** (1st) | notes bunched together | — | chromatic, modern, cluster chords |

**Checked on our own data (Bach's Prelude, per bar):**
- Squares strength is **1.00 exactly in the pure diminished bars (12, 14, 22)** and 0.86 in bar 23.
- A plain G7 (bar 3) reads **0.86 square**: Barry Harris's "a dominant is a diminished chord with one note
  moved", measured.
- Over the whole piece, Squares falls to 0.01 because Bach uses **all three** squares and their directions
  cancel. Key reads 0.54, pointing at C.

So the dials connect the Lab (squares, triangles, hexagons), the Player (the moment's dials), the Atlas
(the key dial is the key) and the archive (dials for any piece, artist, style, place or decade).

## 2. The measures: one record for every moment, rolled up everywhere
Every piece is analyzed into the same record per beat or bar. Every bigger thing (piece, artist, album,
style, place-and-time, decade, the world) is the same record rolled up. That's what makes every page
comparable to every other page, and research possible.

| Family | Measure | Meaning in plain words |
|---|---|---|
| Harmony | chord, function, key area, applied/borrowed, pedal | what's sounding and what it does |
| Shape | the Five Dials (strength + direction) | which symmetric world the music lives in |
| Motion | voice-leading size per change | how smoothly the voices move |
| Tension | roughness, distance from home, surprise | how tense, and why |
| Gravity | how often and how strongly it comes home | how far it dares to wander |
| Rhythm | syncopation, evenness, swing, density | how it moves the body |
| Form | sections, repeats, the story shape of the tension | the plot |
| Vocabulary | the harmonic palette (see §5) | which chords it uses, read many ways |
| Context | place, date, people, instruments, lineage | where it comes from |

## 3. How every view relates: one ladder, six rows
Each view sits at one **scale** and one **dimension**. Moving right is zooming out: the same math, rolled up.

| Dimension | Moment | Phrase | Piece | Artist / album | Style / place-time | History / world |
|---|---|---|---|---|---|---|
| **Harmony** | chord clock | route on the Harmony Atlas | Atlas footprint + harmonic palette | signature moves | the style's chord grammar (flow of what follows what) | the harmonic color of the world map by decade |
| **Shape** | the chord's polygon | the key compass's trace | the Five Dials | an artist's dials | a style's dials + its shape twins | the shape of a century (when squares rose) |
| **Rhythm** | the bar's necklace | groove | rhythm print | a drummer's swing | the clave family | the world rhythm family tree |
| **Tension and form** | the tension braid | section | story shape + form arcs | an artist's favorite story shapes | the story shapes a style prefers | how shocking it was then (surprise against its own era) |
| **Sound** | instruments now | texture | sound print | timbre habits | the instruments of a scene | instruments of the world |
| **Meaning** | a note on a moment | what a verse says | themes | themes across a career | themes of a scene | the topics of an age |

**Four kinds of link between views:**
1. **Zoom:** the same measure at the next scale (a polygon → the piece's dials → the century's dials).
2. **Twin:** the same shape in another dimension or culture (§4).
3. **Drill:** every number opens what made it (Squares 0.86 → the bars and notes behind it).
4. **Focus:** tap anything, and everything that shares it lights up: notes, functions, bars, place, time, shape.

The Compare screen sets any two things side by side on the same measures.

## 4. Shape twins: the same shape, in pitch and in rhythm, across the world
Because scales and rhythms are both shapes on a circle, the same shape turns up in different places:
- **The major scale and the West African bembé bell pattern are the same shape:** 7 points out of 12, spread
  as evenly as possible (Jeff Pressing, 1983).
- **The bossa nova clave is a "Euclidean" rhythm:** 5 hits spread as evenly as possible over 16 (Toussaint).
  The pentatonic scale is the pitch version of that kind of evenness.
- **Shapes get their own pages.** "7 in 12, most even" links the major scale, the bembé bell, and every
  piece and tradition that uses either.

These cross-links ring true for musicians and surprise listeners, and they connect the Lab, world
music and Explore.

## 5. The harmonic palette (ColorHub's palettes, in music)

| ColorHub | MusicHub |
|---|---|
| A painting has many palettes (by area, accents, lights vs shadows, hidden colors) | A piece has many **harmonic palettes**: by time spent, by structural weight (the skeleton vs the ornaments), by surprise, by section, and **hidden harmonies** (passing chords you don't consciously notice) |
| Harmonies (complementary, triadic) up front | **Relations** up front: dominant of, tritone sub, relative, parallel, and the shape family (square, triangle) |
| A painter has hundreds of colors and several palettes | An artist has a **collection**: signature moves, favorite voicings, rhythms and periods |
| Clever sampling, so a painter isn't a few random colors | **Distinctiveness weighting:** what's characteristic of the artist compared with everyone else, not just what's common (a ii–V–I isn't "Coltrane"; a major-third cycle is) |
| Capture (Adobe Capture, but more powerful) for artists and designers, the paying users | **Capture** for musicians, producers and songwriters: save a progression, voicing or groove from any piece to your collection and export MIDI. The paying users (the Scaler and Captain Chords market) |
| Color in context (the Albers strip) | **Chord in context:** the same C♯°7 heard as vii° of ii in Bach, as a passing chord in Barry Harris, as one of Lendvai's axes |

**Bach's Prelude in C, palette by time spent** (from our data): major triads 10 bars · dominant sevenths 10 ·
diminished sevenths 5 · minor sevenths 3 · major sevenths 3 · minor triads 2 · suspended 2.

## 6. Data nobody has drawn before (the research the archive makes possible)
Each becomes a **Finding**: a page with a chart, the n, the method one tap away, and the pieces behind every dot.
1. **The shape of a century:** the Five Dials of every decade. When did squares rise (Stravinsky, bebop)? When did hexagons peak (Debussy)?
2. **The most square composer:** Barry Harris's world ranked by measure (Bach? Bud Powell? Messiaen?).
3. **Shape twins across cultures:** every pitch shape that's also a rhythm somewhere.
4. **Signature moves:** each artist's most characteristic chord moves, by distinctiveness.
5. **Story shapes of music:** cluster every tension curve into a few archetypes ("slow burn", "the long wait", "two summits"), like the six emotional arcs found in novels (Reagan et al.).
6. **How shocking was it then:** surprise measured against music of its own time (the *Rite of Spring* in 1913 against 1913).
7. **Voice-leading economy:** who moves the voices least (our Bach number: 82% of voice moves are a step or less, or a held note).
8. **The harmonic color of the world:** the Atlas map colored by harmony, decade by decade.
9. **Progression migration:** follow the ii–V–I, the Andalusian cadence or the "four chords" across places and decades on the map.
10. **Gravity:** how far each style dares to wander from home, and how often it returns.
11. **Instrument keys:** guitar music lives in E and A, horn music in B♭ and E♭; the keys reveal the instrument.
12. **Sad words in major keys:** lyrics against harmony (once lyrics are licensed).

The method follows ColorHub's honesty rules: every finding shows its n, its corpus, its caveats and its method.

## 7. What this changes in the scope
- **New page type: Shape** ("7 in 12, most even", "the diminished square"). Tier 1.
- **Five Dials** as a lens on every page, plus a **key compass** in the Player. Tier 1, and cheap: it's arithmetic on notes we already have.
- **Harmonic palette** with its readings on every piece and artist. Tier 1.
- **Capture + MIDI export:** the paying feature for producers and songwriters. Tier 2.
- **Findings** as a first-class part of Explore, with a research pipeline over the archive. Tier 2.
- **Phase torus** (Yust): pieces as paths on a donut of key × triad direction, a Lab showpiece. Tier 3.

## 8. Learned from Brian Callipari's chord webs (David's references, 2026-10-11)
- **Diagram 1, keys × chords:** angle = key on the circle of fifths, radius = scale degree. Bands join the same
  chord across keys, which makes pivot chords (the doors between keys) visible.
- **Diagram 2, function rings:** outer ring = each key with its relative minor, middle = dominants, inner =
  diminished chords. Lines across the centre join diminished chords that are the same chord, so the three
  squares show up as hubs connecting keys.
- **What MusicHub takes (designed, not built yet; David: defer builds):**
  - A **Key Wheel**, the all-keys zoom-out of the Harmony Atlas. Angle = key, rings = function, and the
    **three squares sit at the centre as hubs**. A piece's modulation draws as a route around the wheel; the
    Bach Prelude lights all three hubs.
  - Pivot bands, drawn when a piece changes key ("Am belongs to both C and G").
  - Chord quality as the node's **shape** (its polygon on the clock), so hue stays reserved for harmony
    (function).
- **More examples:** being collected in `DIAGRAMS-CATALOG.md`.
