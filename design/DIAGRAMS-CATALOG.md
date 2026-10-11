# Diagrams Catalog — chord & key relationship visualizations

Research pass for MusicHub's Harmony Atlas + Key Wheel. Reference style: Brian Callipari's two diagrams (12-key spoke wheel with gray pivot-chord bands; radial major/minor–dominant-seventh–diminished network with cross-center lines). Colors in both: major pink, minor blue, dominant yellow, diminished purple, black background.

Every entry below is a page/image I actually opened. 26 examples across 6 families.

---

## A. Radial key maps

### 1. Brian Callipari — 12-Key Spoke Wheel ("Illustrated Harmony")
- **URL:** https://briancallimusic.com/en/libros , https://briancallimusic.com/en/libro/ai
- **Encodes:** angle = key, positioned around the circle of fifths; radial distance along each spoke = scale-degree position of the key's 7 diatonic chords (I→vii°); color = chord quality (major pink, minor blue, diminished purple); gray horizontal bands = the *same* chord appearing on two adjacent spokes (pivot/common chords between neighboring keys).
- **Steal:** the gray band is a "same chord, different context" cross-reference — it turns 12 separate scales into one connected pivot-chord map without drawing a single extra line type.
- **Weakness:** no resolution direction (no arrows); only tells you a chord is shared, not how it functions in either key.

### 2. Brian Callipari — Radial Network ("Illustrated Harmony" / "The Mandala")
- **URL:** https://briancallimusic.com/en/libro/ai , https://briancallimusic.com/en/libros
- **Encodes:** angle = circle-of-fifths position; outer ring = major key + relative minor pair; middle ring = dominant 7th; inner ring (hub) = diminished chord; color = major pink / minor blue / dominant yellow / diminished purple; arrows = dominant→tonic resolution; straight lines through the center = diminished chords that are enharmonically the same chord, joining otherwise-distant spokes.
- **Steal:** collapsing all 12 keys' diminished chords down to 3 unique diminished-seventh "hubs" (since dim7 chords repeat every minor third) and drawing that identity as a line straight through the center is the single cleverest idea in either diagram — it turns a redundancy into a structural feature.
- **Weakness:** 3-ring radial layout gets visually dense once you add secondary dominants or borrowed chords; doesn't scale past the diatonic set shown.

### 3. Brian Callipari — other diagrams (same site/Patreon)
- **URL:** https://briancallimusic.com/en/libros (also on Patreon: https://www.patreon.com/BrianCalliMusic)
- Catalog of his other books, same visual language (colored circles/arrows/squares, no staff notation): *Illustrated Harmony 2* (advanced chord-connection graphs), *Illustrated Modes* (modal color-mapping), *Illustrated Chord Extensions/Tensions* (tensions mapped over chord types), *Illustrated Arrangements*, *Illustrated Scales*. All ~150–180 pages, built around the same "diagram instead of staff" philosophy — he's a guitarist/industrial designer, and it reads like an industrial-design exploded-diagram applied to harmony.
- **Steal:** treating the whole curriculum as one consistent visual grammar (same colors/shapes mean the same thing book to book) rather than inventing new iconography per topic.
- **Weakness:** no single public "all diagrams" index — they're spread across separate paid PDFs, which is why no comprehensive online gallery of his work exists.

### 4. Generic Circle of Fifths with relative-minor ring (musicca.com / chords.lol / Skoove family)
- **URL:** https://www.musicca.com/circle-of-fifths , https://chordchord.com/circle-of-fifths , https://www.skoove.com/en/tools/circle-of-fifths
- **Encodes:** angle = key, ordered by fifths, sharps clockwise / flats counterclockwise from C at top; outer ring = major keys + key signature; inner ring = relative minor (same angle as its major); diatonic chords shown as Roman numerals, uppercase = major, lowercase = minor, small circle = diminished (vii°).
- **Steal:** nesting the relative-minor ring at the *same angular position* as its major key means one glance at a radius tells you "this is the relative pair," no extra line needed.
- **Weakness:** the diminished vii° and secondary chords (ii, iii) are usually just labeled on the key's wedge, not a separate visual ring — so it answers "what key" but not "what's the diminished chord's identity across keys," which is exactly what Callipari's diagram 2 adds.

### 5. Raul Longoria — "Infographic: Music Theory, Circle of Fifths" (Behance)
- **URL:** https://www.behance.net/gallery/26009917/Infographic-Music-Theory-Circle-of-Fifths
- **Encodes:** angle = key around the circle of fifths; geometric/flat infographic styling (tagged "geometric," "chords," "major," "minor") rather than a chord-quality color code.
- **Steal:** proof that a circle-of-fifths infographic can read as a designed poster, not a textbook diagram — worth citing as a "beautiful poster" precedent even though it's thinner on data than Callipari's.
- **Weakness:** simplified to the point of losing chord-level detail — it's a learning reference, not an analytical tool.

### 6. Jim Fleser — The Chord Wheel (Hal Leonard)
- **URL:** https://www.ejazzlines.com/the-chord-wheel-book-by-jim-fhleser , https://www.amazon.com/Chord-Wheel-Ultimate-Tool-Musicians/dp/0634021427
- **Image:** https://www.halleonard.com/common/item_gif/00695579.gif
- **Encodes:** a physical rotating transparent disc over a printed base — angle = key (circle of fifths); rotating the disc re-maps every chord's function (I, ii, iii...) onto a new key instantly; color-coding distinguishes major/minor/diminished.
- **Steal:** the *rotation as transposition* interaction — physically turning the wheel performs the transposition instead of requiring you to re-read a new static diagram. That's a direct interaction pattern MusicHub could implement as a literal rotate gesture on the Key Wheel.
- **Weakness:** single-key view at a time — you lose the "all 12 keys simultaneously" overview Callipari's spoke wheel gives you; you have to rotate and re-read repeatedly to compare keys.

### 7. John Coltrane — Tone Circle
- **URL:** https://www.openculture.com/2017/10/john-coltrane-draws-a-mysterious-diagram-illustrating-the-mathematical-mystical-qualities-of-music.html , https://jtomschroeder.com/blog/tone-circle/
- **Encodes:** outer large notes = circle of fourths/fifths; between each pair, four smaller chromatic notes climb in alternating inner/outer sub-rings; straight lines across the circle connect notes that form the augmented triads underlying "Giant Steps" (three key centers a major third apart: B, G, Eb).
- **Steal:** using chord lines that cut straight across a circular key-map to expose a *symmetric* harmonic structure (equal division of the octave) that the circular layout itself can't show just from angular position — the cross-lines are doing structural work the ring alone can't.
- **Weakness:** famously ambiguous — Coltrane never explained it in writing, so as a diagram it requires outside interpretation to be legible; not usable as-is as a teaching tool.

---

## B. Network / probability graphs

### 8. Steve Mugglin — Chord Progression Maps ("The Big Map")
- **URL:** https://www.mugglinworks.com/chordmapsArchive/ , https://mugglinworks.com/chordmaps/chartmaps.htm , https://mugglinworks.com/chordmaps/ProgressionMapGm.pdf
- **Encodes:** each chord of a key sits at a fixed spatial location (not circular — a custom layout per key); arrows connect chords to show which progressions "work," colored boxes (blue = primary chords, green = secondary chords per the site) group chords by how central they are to the key; separate maps exist per key (all 12 major, all 12 minor) plus a Roman-numeral "generic" map.
- **Steal:** a *generic* (key-agnostic) version of the same map using Roman numerals, so the spatial logic transfers to any key without redrawing — same principle MusicHub needs if Harmony Atlas is meant to generalize across keys.
- **Weakness:** one static map per key means 24 separate images with no visual link between them — no equivalent of Callipari's gray pivot bands tying the 12 maps together.

### 9. Hooktheory — Trends tool
- **URL:** https://www.hooktheory.com/trends , https://www.hooktheory.com/blog/trends-tool/
- **Encodes:** chords shown as Roman numerals (key-transferable); build a progression and the next-chord options are sized/weighted by real statistical probability, drawn from 75,000+ songs in the TheoryTab database; clicking a chord surfaces actual songs that use that continuation.
- **Steal:** grounding "which chord comes next" in measured corpus frequency instead of theory-only rules, and linking every statistical edge back to real, named songs — turns an abstract probability into a verifiable, explorable fact.
- **Weakness:** it's a sequential builder, not a map you see all at once — you can't eyeball the whole probability landscape for a key in one glance the way a radial diagram lets you.

### 10. DataStrategist — Sankey plot of Hooktheory's chord DB
- **URL:** https://github.com/DataStrategist/Musical-chord-progressions
- **Encodes:** nodes = chords (29 starting chords, normalized to relative Roman-numeral-like identity so "C→G→Am" and "A→E→Fm" are merged); horizontal flow = 4 sequential chord-transition levels; flow width = transition probability (thicker band = more common transition).
- **Steal:** normalizing progressions to a key-independent identity *before* building the graph, so the dataset collapses from "thousands of literal chord pairs" down to a tractable set of functional transitions — directly useful if Harmony Atlas aggregates real song data.
- **Weakness:** a Sankey reads left-to-right only; it can't show that harmony is a cycle (you can return to I), so it can't represent the loop-back nature real progressions have.

### 11. "Visualising Chord Progressions in Music Collections: A Big Data Approach" (academic paper)
- **URL:** https://www.academia.edu/15624494/Visualising_Chord_Progressions_in_Music_Collections_A_Big_Data_Approach
- **Encodes:** chord-transition graph over a 15-symbol scale-degree alphabet, circular layout; node size = PageRank (centrality/importance of that chord across the whole corpus); edge width = transition probability.
- **Steal:** using PageRank-style centrality for node size turns "degree of harmonic importance across a huge corpus" into a single visual variable — a principled alternative to hand-picking which chords look bigger.
- **Weakness:** built for scale, not for teaching — a circular node-link graph with 15 weighted nodes and dozens of edges is analytically rich but visually dense for a learner.

### 12. William R. Thomas — "Tonal Map of Chord Sequences" (Substack)
- **URL:** https://williamrthomas.substack.com/p/tonal-map-of-chord-sequences-harmonic
- **Encodes:** the 7 diatonic chords as nodes in a functional network (tonic/subdominant/dominant clusters); every edge (every possible 2-chord move) is labeled with an emotional descriptor ("Bright resolution," "Alarm," "Darkening," etc.) rather than only a Roman-numeral function.
- **Steal:** labeling transitions with felt/emotional meaning instead of (or alongside) functional labels — reframes the map as a songwriting tool, not just an analysis tool.
- **Weakness:** emotional labels are inherently subjective/author-specific — not a reusable encoding the way color-by-quality is.

### 13. mDecks Music — Mapping Tonal Harmony Pro
- **URL:** https://mdecks.com/mapharmony.phtml
- **Encodes:** chords positioned by harmonic function (tonic, subdominant, dominant, secondary dominants, substitutions) rather than by key/circle angle; arrows and brackets show dominant motion and ii–V chains; each chord is paired with its matching chord-scale; the map highlights which region is "active" in sync with playback as the key center shifts mid-progression.
- **Steal:** live-syncing the map highlight to the actual audio/score position — the map isn't just a static reference, it tracks a real progression in real time and shows modulation as the highlighted region moving.
- **Weakness:** commercial/proprietary software screenshot-only — not an open visual language others can borrow wholesale, and the "why" (functional position) is prioritized over the "where" (key/circle position), so you lose the circle-of-fifths spatial intuition entirely.

---

## C. Lattices (Tonnetz family)

### 14. Tonnetz (Euler 1739 → Riemann → Lewin/Hyer neo-Riemannian revival)
- **URL:** https://en.wikipedia.org/wiki/Tonnetz , https://commons.wikimedia.org/wiki/File:Neo-Riemannian_Tonnetz.svg
- **Image:** https://upload.wikimedia.org/wikipedia/commons/3/3d/Neo-Riemannian_Tonnetz.svg
- **Encodes:** a triangular lattice where horizontal axis = perfect fifths, one diagonal = major thirds, other diagonal = minor thirds; every triad is a triangle (its 3 notes are its 3 vertices); color = major triads red, minor triads blue (in the common modern rendering); line thickness = interval type (thin = minor third, thicker = major third, thickest = fifth); topologically a torus (12 pitch nodes, 24 triadic faces).
- **Steal:** shared-vertex-between-triangles = shared-pitch-between-chords is the most information-dense single idea here — physical adjacency on the page *is* harmonic closeness (voice-leading distance), with zero extra notation.
- **Weakness:** flat 2D printing of an inherently toroidal (wrap-around) structure always requires an arbitrary edge cut, which hides some adjacencies — any Tonnetz poster lies a little about where the grid actually "ends."

### 15. Cube Dance (Jack Douthett & Peter Steinbach, 1998)
- **URL:** https://www.researchgate.net/figure/Jack-Douthetts-cube-dance_fig5_381616443 , https://viva.pressbooks.pub/openmusictheory/chapter/neo-riemannian-triadic-progressions/
- **Encodes:** vertices = major and minor triads, interspersed with augmented triads at opposite cube corners; edges = single-semitone voice-leading moves (P and L neo-Riemannian transformations); geometric dual of the Tonnetz (triads become points instead of triangles).
- **Steal:** inverting the Tonnetz (triads-as-faces → triads-as-vertices) to make "smooth voice-leading distance" literally equal to "graph-edge distance" — the most efficient voice-leading path between any two chords is just the shortest path in the cube graph.
- **Weakness:** triads only — doesn't extend to sevenths without switching to the separate "Power Towers" graph, so it can't be one unified picture with dominant/diminished sevenths.

### 16. Power Towers (Douthett & Steinbach, 1998)
- **URL:** https://musmat.org/wp-content/uploads/2021/06/06-V5n1-Visconti.pdf
- **Encodes:** the seventh-chord analogue of Cube Dance — vertices = minor-seventh, dominant-seventh, half-diminished, and diminished-seventh chords; edges = minimal-voice-leading moves, organized into "towers" by shared voice-leading zones.
- **Steal:** extending the same parsimonious-voice-leading graph logic from triads to sevenths rather than inventing a new metaphor — consistency of method across chord vocabularies.
- **Weakness:** genuinely hard to read without prior neo-Riemannian training; not a beginner-legible diagram at all.

### 17. Wicki–Hayden / Harmonic Table note layout (isomorphic keyboards)
- **URL:** https://en.wikipedia.org/wiki/Wicki%E2%80%93Hayden_note_layout , https://en.wikipedia.org/wiki/Harmonic_table_note_layout
- **Encodes:** hexagonal grid where vertical = octaves, horizontal = whole tones (Wicki-Hayden) or axes aligned to fifths/major-thirds/minor-thirds (Harmonic Table, a physical-instrument version of the Tonnetz); isomorphism means the same finger-shape plays the same chord-type anywhere on the grid.
- **Steal:** isomorphism as a design constraint — if the same relative shape always means the same relative chord no matter where you start, you get transposition "for free" just by sliding your eye/finger across the grid. That's the lattice version of what Fleser's rotating wheel does mechanically.
- **Weakness:** built for instrument fingering, not visual teaching — optimized for motor consistency, not for showing *why* the shapes mean what they mean.

---

## D. Flowcharts (functional harmony)

### 18. Dimitri Tymoczko's functional-harmony flowchart (via Art of Composing)
- **URL:** https://www.artofcomposing.com/08-diatonic-harmony
- **Encodes:** horizontal flow, left to right = Tonic (I, vi) → Pre-dominant (ii, IV) → Dominant (V, vii°) → back to Tonic; color = red for dominant, blue/green/brown distinguishing chord positions and secondary ("V/") dominants; arrows only point rightward along the main chain, with explicit leftward arrows as the sole permitted exceptions.
- **Steal:** the rule stated directly on the diagram — "move rightward freely; move leftward only along a drawn arrow" — turns the whole chart into a one-sentence usage instruction. The constraint is legible without separate text.
- **Weakness:** purely linear (T→PD→D→T) — can't represent modulation, borrowed chords, or any chromatic motion outside the diatonic set.

### 19. CMUSE — Chord Progression Flow Chart
- **URL:** https://www.cmuse.org/chord-progression-flow-chart/
- **Encodes:** interactive chord "chips" grouped into 3 functional columns (tonic/pre-dominant/dominant); arrows show the normal T→PD→D→T flow; a dashed line represents the "resolve home" shortcut back to tonic from anywhere; clicking plays audio and highlights the path in sequence.
- **Steal:** letting a preset progression "light up" step by step along the arrows — turns a static flowchart into a playback visualization, same principle as mDecks' live-sync but much simpler to build.
- **Weakness:** no attribution/creator credited, and it's web-widget-only — no portable static image, so it can't be cited/reused outside its own page.

### 20. Piano Roadmap — Major Chord Flow Chart
- **URL:** https://www.pianoroadmap.com/blog/Major_Chord_Flow_Chart
- **Image:** https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/blogs/2147707179/images/57636b5-b718-2677-4126-81d0580755a7_Chord_Flow_Chart_-_MAJOR.png
- **Encodes:** I sits center as "home base"; V and vii° shown with strong pull back to I; ii and IV shown leading toward V/vii°; vi and iii given looser, multi-directional arrows.
- **Steal:** varying the *visual weight/centrality* of chords by how strongly they pull toward tonic (I is literally more central) rather than giving every chord equal visual importance — importance-by-function, not just by scale degree number.
- **Weakness:** single static image, no interactivity, no indication of probability/frequency — the arrows represent "theoretically allowed," not "commonly used."

---

## E. Region charts

### 21. Schoenberg — Chart of the Regions (*Structural Functions of Harmony*)
- **URL:** https://www.researchgate.net/figure/The-chart-of-regions-from-Schoenbergs-Structural-functions-of-harmony_fig2_387767119
- **Encodes:** vertical axis = circle of fifths (T, D, SD stacked); horizontal axis = relative/parallel minor relationships — relative minors (sm, m, dor) to the left of tonic, parallel minors (v, t, sd) to the right; everything is framed as *regions within one tonality*, not modulations to new keys.
- **Steal:** the explicit theoretical claim embedded in the layout — that moving around the chart is "staying home" (monotonality) rather than leaving — reframes what a key-relationship diagram is *for*: showing how far you can roam without truly changing key.
- **Weakness:** dense notation-heavy grid (T/D/SD/sm/m/dor/v/t/sd) that assumes you already know Schoenberg's functional vocabulary; not approachable cold.

### 22. Weber — Table of Key Relations (1817 tonal grid)
- **URL:** https://link.springer.com/chapter/10.1007/978-3-642-39587-1_13 (secondary source on Weber's grid), https://en.wikipedia.org/wiki/Chordal_space
- **Encodes:** a square-lattice grid centered on C major; vertical axis = descend/ascend by fifths; horizontal axis = parallel major/minor key pairs; up/down neighbors = fifth-related triads; left/right neighbors = parallel and relative triads.
- **Steal:** the earliest known example of putting *two different relationship types on two independent orthogonal axes* (fifths vertically, parallel/relative horizontally) — this is the direct ancestor of treating "angle" and "radius" (or x and y) as two separable encodings, which is exactly the move a Key Wheel needs to make deliberately.
- **Weakness:** 200+ years old and never visually modernized with color or chord-quality encoding — purely a grid of letter names.

### 23. Lendvai — Axis System (Bartók tonal poles)
- **URL:** https://www.mi.sanu.ac.rs/vismath/lends/ch1.htm , https://en.wikipedia.org/wiki/Axis_system
- **Encodes:** each of the 12 pitch classes assigned a function (tonic/subdominant/dominant axis) based on interval from an assigned tonic; each function splits into a principal and secondary pole a tritone apart; "counterpoles" (e.g., C and F#) treated as functionally interchangeable — a much stronger substitution claim than classical relative-key theory.
- **Steal:** grouping four pitch classes (tonic + its tritone + their respective relative-minor-equivalents) into one single functional "axis" is a genuinely different substitution logic than anything else in this catalog — worth a dedicated toggle/lens in Harmony Atlas ("show tritone substitutes") rather than baking it into the default view.
- **Weakness:** controversial among theorists as an analytical claim (it's a strong, debated reading of Bartók's practice) — good as an optional overlay, risky as a default truth-claim in a teaching tool.

---

## F. Posters / color systems

### 24. Metaharmony — Colour Wheel
- **URL:** https://www.metaharmony.co.uk/colours/complimentary.html
- **Encodes:** 6 colors arranged as 3 complementary pairs (blue↔orange, purple↔yellow, green↔red); each color = a key/chord family; complementary-pair opposition = melodic/harmonic tension-and-resolution (e.g., a diminished "blue" chord resolves into its complementary "orange" major chord); worked example: C major 6 chord = orange, D diminished 7 (the chromatic passing chord in "Barry's scale") = blue.
- **Steal:** borrowing the *complementary-color-wheel* relationship (opposite = highest contrast) and mapping it directly onto *harmonic tension* (dissonance resolving to consonance) — color opposition and musical tension become the same geometric fact, not just a coincidental color choice.
- **Weakness:** a personal/independent theory (not peer-reviewed or widely adopted) — six colors for the whole tonal system is a much coarser palette than the 4-way quality coding (major/minor/dominant/diminished) Callipari and MusicHub use, so it answers a different question (which key-family) rather than chord quality.

### 25. mDecks Music — Mapping Tonal Harmony canvas poster (physical product)
- **URL:** https://mdecks-music.myshopify.com/products/mapping-tonal-harmony-canvas-poster , https://mdecks-music.myshopify.com/products/mapping-tonal-harmony-pro-in-c-canvas-60x40-wall-art-poster
- **Encodes:** the same functional tonal map as #13 above, printed as a 24x18" (or 60x40") classroom wall poster, with a separate "Fundamentals" edition specifically laying out Jazz, Blues, Classical, and Rock/Pop as four parallel harmonic styles side by side.
- **Steal:** publishing the *same underlying map* as both an interactive app and a static printable poster — one dataset/diagram, two delivery formats (screen for exploration, print for ambient/reference learning). MusicHub's Harmony Atlas could ship the same way.
- **Weakness:** at poster scale and static, the live-sync/highlight feature (the app's best feature) is necessarily lost — the print version is a strictly reduced experience.

### 26. Etsy — Circle of Fifths / Chord Wheel poster marketplace
- **URL:** https://www.etsy.com/listing/512276551/chord-wheel-music-theory-circle-of , https://www.etsy.com/listing/1286790514/circle-of-fifths-poster-music-theory
- **Encodes:** typical listing combines the circle-of-fifths ring, key signatures on the outer edge, relative minors on an inner ring, and a small chord-formula/Roman-numeral legend in a corner — design treatments range from vintage cream-and-serif to bright flat-color-coded infographic style.
- **Steal:** across dozens of these independently-designed listings, the *minimum viable* content that recurs every time is: key ring + key signature + relative minor ring. That's the irreducible "first thing people want on the wall" — a useful floor to design above for Harmony Atlas's default/simple view.
- **Weakness:** none go beyond the diatonic triads/key signatures into dominant-7th or diminished-chord relationships — the marketplace's visual language has a ceiling that Callipari's diagrams clearly exceed.

---

## Patterns across all of them

Recurring encoding ideas, counted across the 26 examples above:

1. **Angle = position on the circle of fifths.** Near-universal for any radial diagram (#1, #2, #4, #5, #6, #7, #14-as-lattice-equivalent). The single most reused spatial convention in the whole catalog — if a diagram is circular at all, fifths almost always own the angle.
2. **Color = chord quality/function**, not pitch. Major/minor/dominant/diminished (Callipari, #4, #18's T/PD/D palette, #26) or tonic/subdominant/dominant region (#18, #21) are the two competing color grammars — nobody uses color for pitch class itself in this catalog; it's always reserved for *role*.
3. **Radius or ring-layer = structural role, not distance.** Callipari's #2 uses radius for chord-type layering (major/minor outer → dominant 7th middle → diminished inner); #4's two-ring major/relative-minor pairing does the same with just 2 layers. Radius is "which category" far more often than it's "how far."
4. **Shared vertex / shared line / cross-center line = identity or common tone, not similarity.** The Tonnetz's shared triangle vertex (#14), Cube Dance's shared edge (#15), and Callipari's gray pivot bands (#1) and cross-center diminished lines (#2) are all doing the same job: declaring "these two things drawn in different places are actually the same note/chord." This is the rarest device outside the Callipari/Tonnetz lineage and arguably the most information-dense one available.
5. **Arrows = directional resolution**, used in nearly every network/flowchart (#8, #9, #13, #18, #19, #20) but almost *never* in the purely radial diagrams (#1, #4, #6, #7, #14) — radial layouts tend to encode *position* well and *direction* poorly, which is the clearest gap between the two major families.
6. **Line thickness/band width is overloaded across the catalog** — it means transition probability in data-driven graphs (#9, #10, #11), interval type in the Tonnetz (#14), and nothing at all (pure connectivity) in flowcharts (#18, #19). MusicHub should pick exactly one meaning for line weight and hold it constant across every view, rather than letting different modules silently redefine it.
7. **Live-sync to an actual playing progression** is rare but clearly the most "wow" feature when present (mDecks #13, CMUSE #19) — a map that highlights your actual, current position beats a map you have to manually trace.
8. **One canonical node vs. repeated-per-context node** is a real tradeoff, not a settled question: lattices/graphs (#14-#17) draw each chord once and show all its relationships via adjacency; spoke/per-key diagrams (#1, #8) redraw the same chord once per key and link the copies (gray bands, generic maps). Redrawing is more legible for beginners scanning "my key"; a single canonical node is more honest about the chord's actual uniqueness.

### What Harmony Atlas (single key, deep view) should adopt
- Color = chord quality (major/minor/dominant/diminished), held constant everywhere — pattern 2.
- Radius/ring = functional role (tonic outer → pre-dominant/subdominant → dominant, or Callipari's major→dominant7→diminished layering) — pattern 3.
- Arrows for dominant→tonic and secondary-dominant resolution, explicitly stated as a rule on the diagram itself the way Tymoczko's chart does ("move forward freely, backward only on an arrow") — patterns 5 and 18's instruction-on-the-diagram trick.
- Live highlight synced to whatever progression the user is actually building/playing — pattern 7, from mDecks/CMUSE.

### What the all-keys Key Wheel should adopt
- Angle = circle of fifths, non-negotiable — pattern 1.
- Per-key spokes carrying that key's diatonic chords, Callipari-style, so every key is visible at once rather than requiring rotation through one key at a time (the weakness of Fleser's wheel) — pattern 8, redrawn-per-context side.
- Gray/neutral pivot bands joining the same chord across adjacent spokes, plus a cross-center line convention reserved specifically for enharmonic/identical diminished-seventh chords — pattern 4, the rarest and most valuable device in the whole catalog.
- Reserve line thickness for exactly one meaning (recommend: pivot strength, i.e. how many keys share that exact chord) and never reuse it elsewhere in the same view — pattern 6's warning, applied directly.
