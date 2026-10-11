# MusicHub: how the best tools picture harmony and music (research brief)

*2026-10-11. Written for David as product owner. It answers his note that the v0 views are "way too basic". Every claim comes from a page, PDF or screenshot I actually opened. Claims I couldn't confirm are marked **[uncertain]**. Quotes are kept to a few words.*

---

## 0. The short version

The v0 prototype shows *categories* (three function chambers), *sets* (a polygon on a 12-note clock) and *events* (a piano roll). The best tools add three things v0 doesn't have:

1. **Fixed addresses.** Every function has a permanent place, so a progression becomes a route you can recognize. The ii–V–I route has the same shape in every key and every song. mDecks is built on this.
2. **Recursion.** Every chord can be a temporary home with its own small orbit of chords that point at it (V/x, ii/x, subV/x, vii°/x). mDecks draws these as satellite clusters. The Jazz Harmony Treebank draws them as trees.
3. **More than one scale at once.** One picture shows the current moment and the whole piece together. Sapp's keyscapes and wavescapes do this: they show the key of every bar and the key of the whole piece in one triangle. Hooktheory Trends does it with the next chord set against 75,000 songs.

The most striking concrete finding: **Bach's Prelude in C uses all three diminished-seventh chords**: C♯dim7 in bar 12, Bdim7 in bars 14 and 23, F♯dim7 in bars 22 and 28. **Each of its three dominant-seventh chords is one of those chords with a single note lowered a half step**: G7 comes from Bdim7 (A♭ drops to G), C7 from C♯dim7 (C♯ to C), D7 from F♯dim7 (E♭ to D). I checked this note by note against our own analysis data. Bars 23 to 24 play that move literally, with the bass sliding A♭ to G. This is Barry Harris's idea, and Lendvai's axis system describes the same three groups. It means the Barry Harris lens isn't a nerd add-on. It explains the piece we already ship.

---

## 1. mDecks in depth

### 1.1 What mDecks is
mDecks Music (Ariel J. Ramos) sells practice apps and books for jazz and harmony. The ones that visualize something are Mapping Tonal Harmony Pro, VoicingFlow, Tessitura Pro, See Music Pro and Politonus ([mdecks.com](https://mdecks.com/)).

### 1.2 Mapping Tonal Harmony Pro (MTH): the map

**The idea in one line:** tonal harmony drawn as a map of a country with three regions. Every function has a fixed address, so a song becomes a trip.

**The regions and their metaphors.** The map has three regions: **Tonic** (home, a house icon), **Subdominant** (a mountain icon, "higher ground" you come down from) and **Dominant** (a boat on a rough sea, maximum tension) ([Vocal article by mDecks](https://vocal.media/beat/mapping-tonal-harmony), ["What is Tonal Harmony?"](https://mdecksmusic.com/2025/09/05/what-is-tonal-harmony/)). Chords in the same region "sound, and behave, similarly" ([MTH Pro 10 manual](https://mdecksmusic.com/2022/04/05/mapping-tonal-harmony-pro-9-user-manual-macos-version/)).

**The geometry, from the text.** Positions come from the circle of fifths and never change between keys. The I is "always" at 12 o'clock in the tonic region, the V7 at 1 o'clock in the dominant region and the IV at 11 o'clock ([manual](https://mdecksmusic.com/2022/04/05/mapping-tonal-harmony-pro-9-user-manual-macos-version/), [What is Tonal Harmony](https://mdecksmusic.com/2025/09/05/what-is-tonal-harmony/)). The fixed positions create fixed "roads" between functions ([mapharmony page](https://mdecks.com/mapharmony.phtml)). **Major and minor share one map**: chords outside the circles belong to the major key, and chords inside belong to the minor key. That is how borrowed (modal-interchange) chords get an address ([manual](https://mdecksmusic.com/2022/04/05/mapping-tonal-harmony-pro-9-user-manual-macos-version/)).

**The geometry, from the product screenshots.** I downloaded and studied four official screenshots from the [mapharmony page](https://mdecks.com/mapharmony.phtml): the functions map, the chord-names map in the dark theme, the song analysis and the Reharmonizer. What they show:
- A landscape canvas (old-parchment style in one theme, near-black in the dark theme) split into **three wedges by a "Y" of lines**: Subdominant at upper left (mountain icon), Dominant at upper right (boat icon), Tonic along the bottom (house icon and key label, e.g. "A♭:").
- **One large disc per region.** The diatonic major-key functions sit around the disc's outer edge. The minor and borrowed functions sit inside it. In the screenshots: the **tonic disc** has I∆ on its top rim, at the point where the three regions meet, with I‑6, ♭III∆ and VI‑7♭5 inside and VI‑7, III‑7 and I°7 outside. The **subdominant disc** has IV‑7, II‑7♭5, ♭VI∆ and ♭II∆ inside, with IV∆ and II‑7 outside. The **dominant disc** has ♭VII7, V‑, N6 (the Neapolitan) and VII°7 inside, with V7 on its rim and VII‑7♭5 outside.
- **Satellite clusters.** Each diatonic target has a small constellation of overlapping circles: its related **II‑7 and V7** (joined by a bracket), the minor **II‑7♭5**, the tritone sub **subV7** (dashed line), the **VII°7**, **V7sus4**, **I/5** and an **N6**. Curved arrows run from each cluster into its target. The manual calls these "mini-maps". From the Secondary Functions level on, the map "drastically changes" and each diatonic chord gets one ([manual](https://mdecksmusic.com/2022/04/05/mapping-tonal-harmony-pro-9-user-manual-macos-version/); [Scribd copy of an older guide](https://www.scribd.com/document/209475217/Manual50-Tonal-Harmony), via search snippet).
- **Color in the dark theme.** Diatonic functions are white. Secondary II‑7 and V7 are blue or cyan. Tritone subs are magenta. The chord now playing gets a dark-red disc. The manual adds that related ii–Vs share one color, and that every color can be customized for hue, saturation and brightness.
- **A song draws only what it uses.** In song analysis ("All the Things You Are"), only the chords the song uses are labeled. The rest of the map stays as empty outlines, so each song has a visible **footprint**. A curved arrow shows the move from the last chord to the current one, and the current chord glows red.

**The seven levels.** The map grows in levels: (1) Basic Diatonic, (2) Diatonic Extensions, (3) Secondary Functions, (4) SubV • N6 • I°7, (5) Tritone Substitutions & Related II‑7s, (6) Modal Interchange, (7) Complete Map. It "automatically switches to the minimum level needed for the current song" ([manual](https://mdecksmusic.com/2022/04/05/mapping-tonal-harmony-pro-9-user-manual-macos-version/)). Older marketing names different steps ("Blues and Modes"), so the set has changed between versions ([MTH in Music Education](https://mdecksmusic.com/2016/11/03/mapping-tonal-harmony-in-music-education/)).

**Templates (harmonic languages).** The same map can be shown in Jazz Standard, Blues, Late Classical, Rock-Pop and other templates, and each changes the default chord type. The tonic is Imaj7 in Jazz, I7 in Blues and a plain triad in Classical ([MTH Pro 7 iPad manual](https://mdecksmusic.com/2019/08/04/mapping-tonal-harmony-pro-7-for-ipad-manual/)). The Analyzer add-on supports 10 harmonic languages ([manual](https://mdecksmusic.com/2022/04/05/mapping-tonal-harmony-pro-9-user-manual-macos-version/)).

**How each harmonic idea appears:**

| Idea | How MTH shows it |
|---|---|
| Function | Which region the chord sits in (house, mountain, boat) |
| Secondary dominants | Blue V7 in the target's satellite cluster, with an arrow into the target |
| Related ii–V | Blue II‑7 + V7 joined by a bracket, in the map and in the score |
| Tritone sub | Magenta subV7 in the cluster, dashed line to the target |
| Diminished | VII°7 satellites; I°7 next to the tonic disc |
| Modal interchange | Inside the disc (minor) as opposed to outside (major), so borrowed chords "fall in" |
| Modulation | Pivot modulations (old chord re-read in the new key) and direct ones; the map re-keys **[uncertain how the switch is animated]** |
| Cadences | When you click the map, it detects and highlights common cadences and bass-line moves |

**The score view next to the map.** Seen in the screenshots: a lead sheet where each bar carries the **chord symbol** above the staff, the **chord-scale** name in green ("Dorian", "Mixo. b9b13"), the **Roman numeral** in blue below the staff, **red arrows** from each dominant to the chord it resolves to, **brackets** joining a ii to its V, and **boxed key changes** such as "↑M3 C: II‑7♭5". The Scales Keyboard colors chord tones purple and tensions white ([manual](https://mdecksmusic.com/2022/04/05/mapping-tonal-harmony-pro-9-user-manual-macos-version/), screenshot).

**What the user can do:**
- **Browse** the map: tap a function to hear it with good voice leading in any key, and see its most common scale ([MTH in Music Education](https://mdecksmusic.com/2016/11/03/mapping-tonal-harmony-in-music-education/); [Fractal Audio forum](https://forum.fractalaudio.com/threads/mapping-tonal-harmony.64380/)).
- **Write progressions** by tapping the map. The app stores "harmonic progressions (not chord progressions)", meaning functions, and works out the chord symbols from the key.
- **Analyze**: the Analyzer add-on reads text chords or MusicXML (e.g. exported from iReal Pro) and produces the full layered analysis ([App Store](https://apps.apple.com/us/app/mapping-tonal-harmony-pro/id566767002)).
- **Reharmonize**: the Reharmonizer has one density switch (NONE / FEW / SOME / MANY / ALL) per technique: IIm7 Interpolation, Secondary V7 Anticipation, Secondary o7 Anticipation, subV7 Substitution, Modal Interchange, Melodic Line Cliché, Bass-line Cliché, Dominant Variations and Extended Dominants. It also has a "Randomize Order" toggle and Reharmonize / Back to Original buttons (from the screenshot).
- **Heat map**: shows how often each function is used across a collection of songs.
- **Practice**: play-along with AI piano and guitar players, groove styles and 12-key workouts (up to 8 bars cycled through keys by fifths, half-steps and so on).
- **Spatial sound**: version 4.0 added 3-D panning, so each function's sound comes from its position on the map ([Fractal Audio forum](https://forum.fractalaudio.com/threads/mapping-tonal-harmony.64380/)).
- An older Audio mode synced the analysis to iTunes tracks ([MTH in Music Education](https://mdecksmusic.com/2016/11/03/mapping-tonal-harmony-in-music-education/)).

**Price and audience.** iOS costs $14.99, with add-ons: 1000+ Jazz Standards $9.99, Target Notes $6.99, Upper Structures $6.99, The Analyzer $5.99, Bird Bebop Progressions $9.99. Version 10.8.3 (March 2025) is rated 4.1 from 65 ratings and also runs on Vision Pro ([App Store](https://apps.apple.com/us/app/mapping-tonal-harmony-pro/id566767002)). macOS was $39.99 at the version 9 launch in April 2023 ([rekkerd.org](https://rekkerd.org/mdecks-music-releases-mapping-tonal-harmony-pro-9/)). An Interactive PDF version has no sound ([mapharmony page](https://mdecks.com/mapharmony.phtml)). The audience is jazz pianists, improvisers, arrangers, composers, teachers and theory students. The map is pitched as an introduction for beginners, with the deeper tools for experienced players. The Berklee Groove called it their "strongest recommendation" (quoted on the product page).

**Weaknesses (worth not copying).** Users call the interface confusing. One wrote that they had tried to understand the app "many times over the years" ([Loopy Pro forum](https://forum.loopypro.com/discussion/13270/mapping-tonal-harmony-pro)). Even a positive review admits it "isn't entirely intuitive at first" ([No Treble](https://www.notreble.com/buzz/2013/03/04/mapping-tonal-harmony-pro-a-look-at-the-harmony-app-for-ios-and-android/)). The audio analysis didn't do what users expected. The full map is dense, with dozens of labels in old-parchment style. **The lesson: steal the geography and the recursion. Fix the clutter with progressive disclosure, and show only what the piece uses.**

### 1.3 Other mDecks tools that visualize something
- **VoicingFlow 4** (Mac): a keyboard with color-coded note labels (chord tones, guide tones, tensions, avoid tensions) and upper-structure detection. It rates how well a voicing fits as Risky, Usable, Strong or Excellent, offers a "Find Context" reverse search (which chords a voicing works over), and has an **Acoustic Canvas** that maps notes *and their partials* into a harmonic graph ([VoicingFlow page](https://mdecks.com/voicingFlow.phtml)). Worth stealing: graded fit labels instead of right/wrong, and showing overtones.
- **Tessitura Pro**: 2,048 scales shown four ways (circle of fifths, keyboard, notation, "pitch-map"), plus a Scale Painter ([Tessitura page](https://mdecks.com/tessituramac.phtml)).
- **Politonus**: "reverse" ear training, where you reshape the sound to match a target structure. It isn't really a visualizer ([Politonus page](https://mdecks.com/politonus.phtml)).
- A book, *The Composer's Guide to Tonality: Harmony Maps in All Keys* ([Amazon](https://www.amazon.com/Composers-Guide-Tonality-Harmony-Maps/dp/B0CVSCVZPK)). I couldn't read its contents. **[uncertain]**

### 1.4 The "Barry Harris 3D color harmony" system: Metaharmony
**Found (by a second research agent, confirmed on the creator's site):** the hourglass and colour-wheel images come from **Metaharmony** by Tom, a UK musician ([metaharmony.co.uk](https://www.metaharmony.co.uk/), [his story](https://www.metaharmony.co.uk/mystory.html)). His YouTube channel (@metaharmony, about 85 videos) was permanently deleted in mid-2023, which is why the Feb 2023 video can't be found. It relaunched in 2025 with short videos ([@metaharmony1](https://www.youtube.com/@metaharmony1)).
- **Colours:** the three diminished sevenths are the primary colours (yellow, red, blue), and major and minor chords are the secondaries (orange, green, purple).
- **Geometry:** squares grow into cubes, then into the hypercube "key cube" (the hourglass), then into a "metaprism".
- **Roots:** it grew out of Barry Harris, and the creator calls it isomorphic to Lendvai's axes.
- **Old 2D web app:** [meta-harmony.web.app](https://meta-harmony.web.app/).

**It's his IP:** credit and link to it, or collaborate. Don't clone the course or the colour identity. The math under it is public:
- **Barry Harris:** the 12 notes split into exactly **three diminished-seventh chords**. Lowering any one note of a dim7 by a half step gives a dominant seventh, so each dim7 has four dominant "children" that can stand in for each other (e.g. F7, B7, D7, A♭7) ([Galliano's notes on the method](https://irfu.cea.fr/Pisp/frederic.galliano/Zique/barry_harris.html)). The 6th-diminished scale alternates a tonic 6th chord with a diminished chord, which gives rest and motion. *Barry Companion* frames the dim7 as built from the two whole-tone scales ("mother" and "father") ([barrycompanion.com](https://barrycompanion.com/harmony/)).
- **Lendvai's axis system** uses the same three groups and names them the tonic, subdominant and dominant **axes**. Within an axis, notes a tritone apart are "pole and counterpole" and can stand in for each other without a change of function ([Wikipedia: Axis system](https://en.wikipedia.org/wiki/Axis_system)). Paul Wilson criticized these substitution claims (same page).
- **Coltrane's tone circle** shows the same symmetric shapes on one wheel: squares for dim7, triangles for augmented, a hexagon for whole-tone, a diameter for the tritone sub ([interactive essay by Tom Schroeder](https://jtomschroeder.com/blog/tone-circle/)).
- DESIGN.md's v0 orange / green / purple function colours were taken from Metaharmony's images. Replace them with MusicHub's own palette, or license them.

---

## 2. Other systems worth stealing from (26)

Format for each: **what it shows**. *The visual idea in one line.* Why it's insightful. Link.

**Function and progression**
1. **Hooktheory TheoryTab.** Songs as melody plus chords in key-relative notation. *Chord blocks colored by scale degree, a playhead synced to the song, block width = duration.* Colors run **rainbow by scale degree**: I red, ii orange, iii yellow and so on, so "red to yellow" is the same distance in every key. Note this is not function coloring. 75,000+ songs. ([TheoryTab](https://www.hooktheory.com/theorytab); color logic via [Hookpad user guide](https://www.hooktheory.com/support/hookpad), search snippet)
2. **Hooktheory Trends.** Next-chord probabilities. *Pick a chord, and every likely next chord appears with its probability; drill down into a list of matching songs.* Turns "what usually comes next" into a measured thing, the basis for showing surprise. ([Trends](https://www.hooktheory.com/trends))
3. **Hookpad.** Writing with a palette of in-key chords. *Key-relative color, "Magic Chords" ranked by corpus popularity, melody guides showing which notes fit.* Free plan; $7.99/month or $199 lifetime. ([Hookpad](https://www.hooktheory.com/hookpad))
4. **Chordify.** Chords of any recording on a beat grid. *One square per beat, the current beat darkened, chord labels only where the chord changes; animated chord diagrams scroll in time.* The beat grid makes **harmonic rhythm** visible for free. ([Chordify desktop guide](https://support.chordify.net/hc/en-us/articles/360002148497-How-to-use-Chordify-on-Desktop))
5. **The Chord Wheel (Jim Fleser, Hal Leonard 2000).** A paper wheel with a rotating window over the circle of fifths. *Turn the window to a key and its diatonic chords line up inside it.* Transposition becomes rotation, the physical form of "same shape in every key". ([Google Books](https://books.google.com/books/about/The_Chord_Wheel.html?id=hR_4PQAACAAJ))

**Geometry of chords and voice leading**

6. **Tonnetz explorers (TonnetzViz).** Live MIDI on Euler's triangle grid. *Triads are triangles (major points down, minor up); notes leave fading "ghost" trails.* Common-tone moves (P, L, R) become flips across a triangle edge. Offers Riemannian and Sonome layouts and three tunings. Ondřej Cífka, 2016. ([TonnetzViz](https://cifkao.github.io/tonnetz-viz/))
7. **Z-Tonnetz.** A 3D Tonnetz (axes: fifths, thirds, sharp/flat) driven by MIDI files or built-in instruments, with "Chord Decay" and "Scale Decay" settings so the harmonic context fades over time. Beta, free. *Context as a fading field, not a single chord.* ([ztonnetz.com](https://ztonnetz.com/))
8. **Tymoczko's ChordGeometries.** Chords as points in voice-leading space. *Two-note chords live on a Möbius strip; three-note chords live in a twisted triangular prism with augmented triads on the center line and major and minor triads near it; voice leadings are continuous paths.* The demos animate Chopin's E minor prelude and Deep Purple. Now Max/MSP source only. ([ChordGeometries](https://dmitri.mycpanel.princeton.edu/ChordGeometries.html); [Science 2006](https://www.science.org/doi/10.1126/science.1126287), via search summary) Insight: **distance means voice-leading effort.** Smooth progressions are short walks.
9. **Cube Dance (Douthett & Steinbach).** A graph of single-semitone moves between the 24 major and minor triads and the 4 augmented triads. *Augmented triads are hubs joining four cubes; any path length = total semitones moved.* Tymoczko notes that, unlike the Tonnetz, it is faithful to distance even between chords that aren't neighbors ([MTO 16.1, Tymoczko](https://mtosmt.org/issues/mto.10.16.1/mto.10.16.1.tymoczko.html)). [Chord Scale Reference](https://chordscalereference.com/) offers it next to a Tonnetz and a circle of fifths with P/R/L/N/S/H moves.
10. **Navichord (iOS, 2014).** A playable Tonnetz grid: fifths horizontal, thirds on the diagonals. *Touch a triangle's center to play the triad; the same shape works from any root; Roman-numeral mode.* Shows that a Tonnetz can be an *instrument*, not only a diagram. ([Navichord](https://www.navichord.com/); [Synthtopia](https://www.synthtopia.com/content/2014/09/17/navichord-a-new-ipad-instrument-for-exploring-chord-progressions/))
11. **Isomorphic keyboard visualizers** (harmonic table, Wicki-Hayden; e.g. Musix Pro, GridInstruments). *A hex grid where every chord or scale is one shape in every key.* Shape memory beats key-by-key memory. ([Harmonic table layout](https://en.wikipedia.org/wiki/Harmonic_table_note_layout); [Musix Pro](https://shiverware.com/musixpro/); [GridInstruments](https://github.com/zitongcharliedeng/gridinstruments))

**Keys and tonality over time**

12. **Elaine Chew's Spiral Array / MuSA_RT.** Pitches on a helix (a fifth per step around, a major third straight up). Chords are "centers of effect" of their notes, and keys are centers of effect of their I, IV and V chords. *Live audio drives a 3D helix where pitch, chord and key markers move and the key is found by nearest neighbor.* Free on iOS and Mac with an AR mode (2.0, 2021). ([MuSA_RT 2.0](https://alexandrefrancois.org/music/mathematics/visualization/software/2021/01/08/MuSA_RT-2.0.html); [Spiral array](https://en.wikipedia.org/wiki/Spiral_array_model))
13. **Craig Sapp's keyscapes.** The key of every possible stretch of a piece. *A triangle: the x-axis is time, the y-axis is window length; the top point is the key of the whole piece, the bottom row is chord by chord.* Colors map the **diatonic circle of fifths onto the rainbow**; accidentals shift the hue slightly; **major and minor differ by brightness**. A color that reaches high in the triangle is a stable key area ([Sapp, "Visual Hierarchical Key Analysis"](https://ccrma.stanford.edu/~craig/papers/05/p3d-sapp.pdf), read in full). The best one-glance fingerprint of a whole piece's tonal plan.
14. **Wavescapes (Viaccoz, Harasim, Moss, Rohrmeier 2022).** The keyscape layout, but colored by the discrete Fourier transform (DFT) of the pitch-class content, so it doesn't assume major/minor. *Six triangles, one per Fourier coefficient: phase becomes hue, magnitude becomes opacity.* Coefficient 5 tracks how diatonic the music is and coefficient 3 how triad-like, so it works for Josquin, Bach, Scriabin, Webern, Coltrane and Ligeti alike ([paper PDF on Zenodo](https://zenodo.org/records/7272148), read). Web tool: **midiVERTO** ([Moss talk page](https://fabian-moss.de/talk/interactive-music-analysis-using-the-dft-and-pitch-class-distributions-extracted-from-midi-files/)).
15. **Mardirossian & Chew, key distributions (ISMIR 2007).** *Keys on Lerdahl's 2D map of key distances, with a translucent disc for each key that grows as the piece spends time there.* Related keys sit close together with related colors. A piece's tonal "diet" becomes a picture you can compare: their example sets classical pieces against Armenian folk music ([PDF](https://ismir2007.ismir.net/proceedings/ISMIR2007_p189_mardirossian.pdf), read).
16. **Lerdahl, *Tonal Pitch Space* (2001).** A distance model for pitches, chords and keys (five levels: octave, fifth, triad, diatonic, chromatic). It is the basis for tension and attraction values ([OUP](https://global.oup.com/academic/product/tonal-pitch-space-9780195178296); summary via search). Use it to compute "how far from home" honestly.

**Scales and sets**

17. **Scale Navigator (Nathan Turczan).** Tymoczko's scale network as an instrument: scales are nodes, joined when one note moves a semitone ("circle of fifths on steroids"). *A hex network, explorable in 3D, with an ensemble mode that keeps players on one harmonic state.* Free iOS dashboard, v1.0.6, April 2026. ([App Store](https://apps.apple.com/us/app/scale-navigator-dashboard/id6757498960); [scalenavigator.com](http://www.scalenavigator.com/); [NIME 2019 paper](https://www.nime.org/proceedings/2019/nime2019_paper020.pdf))
18. **Ian Ring's scale encyclopedia.** Every scale as a 12-bit number (major = 2741). *A bracelet diagram (notes clockwise from 12 o'clock with mirror axes), a Tonnetz, a keyboard and staff, plus properties: Forte class, hemitonia, "brightness", maximal evenness, Myhill's property, modes, neighbors.* The model for a deep, linkable reference page per chord or scale ([Major scale page](https://ianring.com/musictheory/scales/2741)).
19. **Pitch constellations.** *Chords and scales as polygons on a 12-point clock*; the minor scale is the major shape rotated. That is v0's Chords view. **[uncertain]** I found no "Julio Herrera's Pitch Constellations": the [Wikipedia article](https://en.wikipedia.org/wiki/Pitch_constellation) credits no Herrera, and searches came up empty. NYU MusEDLab's *Theory aQWERTYon* lights the notes you play on a chromatic circle in real time ([MusEDLab](https://wp.nyu.edu/musedlab/tag/chords/)).

**Notes, motion and performance**

20. **Stephen Malinowski's Music Animation Machine.** Colored piano-roll animations with a huge vocabulary. **Harmonic coloring** maps the color wheel onto the circle of fifths (tonic = blue), so a key's notes form one connected band of color and a V–I cadence reads violet to blue ([Harmonic Coloring](http://www.musanim.com/mam/circle.html)). His technique catalog includes connecting lines for melodies, a "fat connector" for a motif, color for interval type, background gradients for accent structure, and an **overview mode for structure** ([techniques](http://www.musanim.com/techniques/)). His 115 renderers include **Dissonance** (shows colliding notes), **CriticalBand** (bar widths show the critical band), **Harmonics**, **DyadSpiral / Yarn** (interval types), **BarsFisheye** (the whole song with a few seconds magnified) and **Wheel** (a live harmonic-color wheel) ([renderers](http://www.musanim.com/renderers/)). Our piano roll should borrow from this catalog, not from Synthesia.
21. **Synthesia.** *Notes fall onto a keyboard, colored by hand or track.* Familiar and great for playing along, but it carries no harmony. A baseline, not a model. ([synthesiagame.com](https://synthesiagame.com/))
22. **Performance Worm (Dixon, Goebl, Widmer, 2002).** *A dot moves through tempo (x) × loudness (y) space, leaving a fading trail.* Expressive shaping becomes a gesture you can see. ([ResearchGate](https://www.researchgate.net/publication/2534712_The_Performance_Worm_Real_Time_Visualisation_of_Expression_based_on_Langner's_Tempo-Loudness_Animation)) Sapp's Mazurka work adds **timescapes** and **dynascapes**: keyscape-style triangles for tempo and loudness across about 2,500 recordings of 49 mazurkas ([Sapp ISMIR 2007](https://ismir2007.ismir.net/proceedings/ISMIR2007_p497_sapp.pdf), via search summary).

**Form, rhythm, tension, surprise**

23. **Martin Wattenberg, *The Shape of Song* (2001).** *Translucent arcs join repeated passages* (from MIDI). Bach, Glass and Madonna look completely different. The clearest form picture ever made. ([bewitched.com](http://www.bewitched.com/song.html))
24. **Foote's self-similarity matrix.** *Each time point compared with every other one: blocks are sections, off-diagonal stripes are repeats.* A "novelty" curve built from it finds the boundaries between sections ([Foote PDF](http://www.musanim.com/wavalign/foote.pdf), via search summary).
25. **Groove Pizza (NYU MusEDLab, 2015–16).** *A rhythm "necklace": one bar is a circle cut into 16 slices, with rings for kick, snare and cymbal.* Regular polygons make maximally even rhythms: on 16 slices a pentagon gives a clave-like pattern and a hexagon a tresillo, following Toussaint ([Groove Pizza](https://www.musedlab.org/groovepizza/); [evolution post](https://wp.nyu.edu/musedlab/2016/04/27/the-evolution-of-the-groove-pizza/)).
26. **Tension ribbons (Herremans & Chew, TENOR 2016).** Three tension measures on Chew's spiral: **cloud diameter** (how spread out the notes are), **cloud momentum** (how far the harmony moves) and **tensile strain** (distance from the key), *drawn as ribbons over the score* ([preprint](http://dorienherremans.com/sites/default/files/paper_tenor_dh_preprint_small.pdf), via search summary). The direct upgrade for v0's single tension line.

**Corpus and landscape** (for the Archive)
- **Jazz Harmony Treebank (Harasim et al., ISMIR 2020).** Tree analyses of **150 jazz standards** from the open iRealPro collection. *Chords are leaves; branches show which chord prepares or prolongs which*, so long-range links can span whole sections. Includes an open-source tree-drawing tool ([paper](https://program.ismir2020.net/static/final_papers/80.pdf), read; [GitHub](https://github.com/DCMLab/JazzHarmonyTreebank)).
- **Moss, Lieck & Rohrmeier (2024).** Interval distributions on the Tonnetz across centuries. *The perfect fifth dominates for centuries; major and minor thirds rise sharply in the 19th century* ([publication page](https://fabian-moss.de/publication/2024/20240601_hss_tdm/), via search summary).
- **Harmonic Fingerprints (Miller, Bonnici, El-Assady 2019).** *A circle-of-fifths glyph next to each bar of sheet music*; in a user study it helped people spot repeated harmony without close reading ([arXiv](https://arxiv.org/abs/1908.00003)).
- **Musicmap (Kwinten Crauwels).** The family tree of 230+ genres since 1870. *Genre columns with decades running top to bottom, links for influence (and "anti-links" for backlash).* Playlists per genre ([Open Culture](https://www.openculture.com/2018/03/behold-the-musicmap-the-ultimate-interactive-genealogy-of-music-created-between-1870-and-2016.html)).
- **Every Noise at Once (Glenn McDonald).** 6,291 genres on a scatter plot (down = organic, up = mechanical; left = dense and atmospheric, right = spiky and bouncy). Frozen since December 2023 ([Wikipedia](https://en.wikipedia.org/wiki/Every_Noise_at_Once)).
- Survey to mine later: Khulusi et al., *A Survey on Visualizations for Musical Data*, Computer Graphics Forum 2020, classifies 129 works ([Eurographics library](https://diglib.eg.org/items/bc980964-28a6-49e5-a3f7-95205ee46bc5)).

**Newer (2023–2026) and genuinely good:** Scale Navigator Dashboard (2026), Z-Tonnetz (beta, date unclear), VoicingFlow 4's Acoustic Canvas and MTH 10.8 (2025), midiVERTO and wavescapes (2022), Moss et al. (2024). Several 2025–26 GitHub "harmony atlas" repos turned up in searches. They read as AI-generated and unfinished, so I didn't count them.

---

## 3. Dimensions a deep app could show and link

For each: the best known way to draw it, and one fresh idea for MusicHub.

| Dimension | Best known way to draw it | Fresh idea for MusicHub |
|---|---|---|
| **Harmonic function** | MTH's three regions with fixed addresses | **Address + gravity:** each function keeps its MTH-style address, and the playhead's route on the map leaves a fading trail (TonnetzViz ghosts) so the last 4 bars stay visible as a shape |
| **Key and modulation distance** | Sapp keyscape; Lerdahl's key map; Mardirossian & Chew's growing discs | **Key itinerary:** key areas as islands placed by Lerdahl distance; disc size = bars spent there; the piece's trip drawn as one line, so a "far" modulation looks far |
| **Chord identity** | Pitch-constellation polygon (v0 clock); Ian Ring's bracelet | **Polygon morph:** when the chord changes, each corner slides around the rim to its new note, so you *see* which notes move and which stay |
| **Voice leading** | Tymoczko's spaces; Cube Dance path length; MAM connecting lines | **Threads:** each voice is one continuous colored line through the roll; line thickness = step size; a running count of semitones moved per bar (Tymoczko's taxicab size) |
| **Intervals** | MAM interval coloring, DyadSpiral and Yarn renderers; Ian Ring's interval vector | **Interval fingerprint:** a tiny 6-bar glyph per chord (counts of the six interval classes), so a dim7's "all minor thirds" or a cluster's "all seconds" reads at a glance |
| **Tension and dissonance** | Plomp-Levelt / Sethares roughness curves; Herremans & Chew tension ribbons; Lerdahl tension | **Tension braid:** three strands (roughness, distance from home, surprise) braided under the strip; where they agree the braid is tight, where they disagree it opens. Each strand's method is one tap away |
| **Surprise / expectation** | IDyOM information content (Pearce); Hooktheory Trends probabilities; Huron's ITPRA | **Ghost chords:** just before a change, faint "ghosts" of the 2–3 most likely next functions appear at their map addresses; then the real chord lands. Surprise = how far it landed from the ghosts |
| **Rhythm and meter** | Groove Pizza necklaces; MAM accent gradients; Chordify beat grid | **Bar necklaces:** one 16-slice circle per bar beside the strip; repeated rhythm = the same polygon, so you see the rhythmic rhyme scheme |
| **Tempo and rubato** | Performance Worm; Sapp timescapes | Later, with real recordings: two worms racing on the same piece (Horowitz vs. Gould). Today: let the tempo slider draw a worm of the *user's* own scrubbing |
| **Texture and density** | MAM note thickness; spectrograms | **Voice river:** a stream graph of how many voices are sounding, by register; thin = solo, swollen = full chord |
| **Register** | Ambitus bars | **Register silhouette:** the highest and lowest notes as a soft band behind the whole-piece strip (the Bach prelude's low-G pedal shows up as a floor dropping) |
| **Form and repetition** | Wattenberg arcs; Foote self-similarity | **Harmonic self-similarity:** compare *chords* bar by bar, not audio; arcs over the strip join repeated progressions (bars 1–4 to bars 32–35 in the Bach) |
| **Motif** | MAM "fat connector" | Tap a motif and every occurrence lights up across roll, strip and score; transformed versions (inverted, augmented) glow dimmer |
| **Cadences** | MTH's detected cadences, arrows and brackets | **Landing marks:** a cadence stamps a mark on the strip whose size is its strength (authentic > half > deceptive), so form becomes visible as punctuation |
| **Harmonic rhythm** | Chordify's one square per beat | Chip *width* on the strip = chord duration, plus a thin "changes per bar" sparkline |
| **Borrowed chords** | MTH's inside-the-disc address | **Shadow key:** the parallel minor as a darker mirror layer under the map; borrowed chords drop into the shadow |
| **Chord-scale links** | MTH's green scale labels and purple/white scale keyboard; VoicingFlow's tone classes | **Scale halo:** on the clock, the chord is the polygon and the scale is a dotted ring around it; chord tones, available tensions and avoid notes get three weights. The current scale is named |
| **Substitution families** | Barry Harris dim families; Lendvai axes; tritone diameter; Cube Dance | **Family glow:** tap a chord and every substitute lights up at its own address (tritone sub, the other three dim-children, borrowed versions) |
| **Hierarchy** | Jazz Harmony Treebank trees; Schenkerian graphs | A collapsible tree hanging above the strip: at the top level the Bach prelude is just I – V – I |
| **Tonal quality (DFT)** | Wavescapes; midiVERTO | **Six-coefficient barcode** per piece for the Archive wall, which works for any style |
| **Corpus statistics** | Hooktheory Trends; MTH heat map; Moss et al.; JHT | **Atlas heat map:** a piece's (or composer's) footprint on the same map; compare Bach vs. Chopin vs. Jobim as three glowing footprints |

---

## 4. Synthesis: ten views for MusicHub

**What links them all.** Every view reads and writes one shared focus object: `{bars, functions (map addresses), pitchClasses, keyArea, family}`. Tap anything, and every view that holds that item lights it. A map address lights its bars on the strip, its notes on the clock and in the roll, its cadence brackets and its substitute family. This is DESIGN.md's linked-views rule (Becker & Cleveland), now with richer keys.

**Color grammar check.** MTH uses hue for chord *kinds* (blue for secondary chords, magenta for subs). MusicHub keeps hue for **function only**. So an applied chord like V7/IV is drawn in the Tension color, and it is the *leader line to its target* that marks it as applied. Tritone subs get a dashed line, not a new hue. Note color (circle-of-fifths hues, as in Malinowski and Sapp) stays a separate mode that never appears alongside function color.

Ranked by insight per unit of effort (**S** small / **M** medium / **L** large).

### 1. The Analysis Ribbon (upgrades the whole-piece strip). Effort S, insight high
The strip becomes MTH's layered score, synced to the playhead. Per bar it shows the chord symbol, the Roman numeral, an **arrow from each dominant to the chord it resolves to**, **brackets** over ii–V pairs, **boxed key changes** with the pivot named, a pedal bar under the long G (bars 24–31) and the long C (32–35), and cadence landing marks. Each layer is a toggle, so curious listeners see colors and arrows and nerds see everything. Our analysis file already holds `rn`, `fn`, `key`, `pivot`, `applied` and `pedal`, so this is mostly drawing.
Sources: MTH score view (arrows, brackets, key boxes, chord-scales); Chordify (duration on the grid); Harmonic Fingerprints (a glyph per bar).
Links: an arrow lights both its chords on the Atlas; a bracket lights its ii–V route.

### 2. The Harmony Atlas. Effort M, insight very high. **Signature.**
MusicHub's version of the MTH map, rebuilt to the ColorHub craft bar. Three regions (Home, Away, Tension); **every function at a fixed address** using circle-of-fifths positions (I at the meeting point, IV upper left, V upper right); diatonic functions on each disc's rim and borrowed ones in a "shadow" interior; **satellites** (V/x, vii°/x, ii/x, subV/x) that appear *only* when the piece uses them. The piece draws its **route** live with a fading trail, and afterwards its **footprint** remains. The level of detail starts at the minimum the piece needs (MTH's auto-level), and you can pinch for more.
In the Bach prelude: bar 12's C♯dim7 appears as a satellite of ii, bar 20's C7 as a satellite of IV, bars 22 and 28's F♯dim7 as satellites of V. Bars 5–11 re-key the map to G, while a small house marks how far away home is. **[uncertain]** I think MTH's small second house icon does the same job, but I couldn't confirm it. The eight-bar G pedal becomes the route *orbiting* the V address without landing.
Sources: MTH (geography, mini-maps, inside/outside, auto-level, footprint); Lendvai (regions as axes); Hooktheory (key-relative so shapes transfer); Mardirossian & Chew (disc size = time spent); TonnetzViz (fading trail).
Links: tap an address and its bars light on the Ribbon, its chord on the Clock and its notes in the Roll.
Why it's the signature: it answers David's "way more interesting" directly. It turns v0's Journey chambers into a navigable country. And every later view (Ghost chords, Reharm Lab, heat maps, Three Squares) is drawn *on top of it*.

### 3. The Living Clock (upgrades the Chords view). Effort S–M, insight high
Keep the 12-note clock, and add (a) a **polygon morph**: corners slide around the rim to the next chord, with common tones pinned and glowing; (b) a **voice-leading count** for each move ("4 semitones in total"; Bach's prelude moves very little); (c) a **scale halo** for chord-scales; (d) an **interval fingerprint** glyph. The Bach prelude is a voice-leading masterpiece, and this view shows it.
Sources: Tymoczko (voice-leading size), Cube Dance (path = semitones), MAM connecting lines, pitch constellations, VoicingFlow and MTH (tone classes), Ian Ring (interval vector).
Links: a moving corner lights its voice's thread in the Roll.

### 4. Form Arcs and harmonic self-similarity. Effort S, insight medium (high for pop and jazz)
Wattenberg arcs over the Ribbon join repeated *progressions*, not just identical bars: bars 1–4 rhyme with bars 32–35. A chord-level self-similarity matrix sits one tap deeper for nerds.
Sources: Wattenberg; Foote; MAM overview mode.
Links: tap an arc and both passages light everywhere, and play back to back.

### 5. Three Squares: the Barry Harris / Lendvai lens. Effort M, insight high for learners and nerds. **Second signature.**
The clock splits its 12 notes into the **three diminished squares** (DESIGN.md's three axis colors, used only in this lens). Every chord is drawn as "a square with one note moved": a dominant is a square with one corner lowered a half step, and its three siblings plus the tritone sub glow as its family. In the Bach prelude the lens shows that **all three squares appear** (C♯dim7, Bdim7, F♯dim7) and that **G7, C7 and D7 each come from one square with one note lowered**, with bar 23 to 24 doing it in the bass (A♭ to G). (I checked this note by note against `data/bwv846-analysis.js`.) Later, the 3D **hourglass** showpiece is this lens folded into a solid.
Sources: Barry Harris (Galliano notes, Barry Companion); Lendvai axis system; Coltrane's tone circle; Cube Dance (symmetric chords as hubs).
Links: a square lights every bar that uses it on the Ribbon and its satellites on the Atlas.

### 6. Keyscape + Key Itinerary. Effort S–M, insight medium-high
A Sapp keyscape triangle (Krumhansl-Schmuckler on sliding windows; rainbow on the fifths; brightness for major or minor) doubles as a **second scrubber**: tap anywhere to jump there. Next to it, a Lerdahl-distance island map with growing discs. A wavescape toggle for nerds. This becomes the piece's **poster** on the Archive wall.
Sources: Sapp; Viaccoz et al. / midiVERTO; Mardirossian & Chew; Lerdahl.
Links: a triangle cell lights the bars it covers; a key island re-keys the Atlas.

### 7. Tension Braid (replaces the single tension line). Effort M, insight high
Three strands with honest labels: **roughness** (Plomp-Levelt / Sethares on the actual notes), **distance from home** (Lerdahl or spiral-array tensile strain) and **surprise** (from #8 once there's a corpus). Strands that agree pull tight; strands that disagree spread apart, and that gap is the teaching moment. Each strand's method is one tap away, per the honesty rules.
Sources: Herremans & Chew tension ribbons; Lerdahl; [Sethares-style dissonance calculator](https://www.aykutcaglayan.net/dissonance_curve.html); Huron.
Links: a peak lights its chord on the Atlas and its rough note pairs in the Roll (MAM "Dissonance" renderer).

### 8. Ghost Chords: the expectation layer. Effort M–L (needs a corpus), insight very high
Just before each change, faint ghosts appear at the Atlas addresses of the likely next functions. Then the real chord lands, and a surprise tick goes into the braid. This needs transition statistics: start with our own growing public-domain corpus (DESIGN.md says 50+ pieces) and label everything as an estimate. **[uncertain]** I haven't checked whether Hooktheory's data can be licensed.
Sources: Hooktheory Trends; IDyOM (Pearce); Huron's ITPRA ([MIT Press preview](https://direct.mit.edu/books/monograph/1961/bookpreview-pdf/2429413)).
Links: ghosts live on the Atlas; the surprise strand lives in the braid.

### 9. Reharm Lab. Effort L, insight high for jazz nerds
MTH's Reharmonizer done beautifully: one density slider per technique (secondary dominants, tritone subs, modal interchange, Barry Harris dim passing chords, bass-line clichés). New satellites bloom on the Atlas, new arrows on the Ribbon, and you can A/B by ear. Grade the results like VoicingFlow (Risky, Usable, Strong, Excellent) instead of right and wrong.
Sources: MTH Reharmonizer; VoicingFlow fit labels; Barry Harris families.

### 10. The Archive layer: footprints and fingerprints. Effort L, insight high at scale
Each piece gets an Atlas heat map (MTH's heat map), a keyscape thumbnail and a six-coefficient barcode. The wall is sorted by fingerprint, and "where else does this route happen?" uses Trends-style matching. Tree view (JHT) for jazz standards.
Sources: MTH heat map; Hooktheory Trends song lists; Moss et al.; JHT; Musicmap and Every Noise for the landscape metaphor.

**Honorable mentions:** bar rhythm necklaces (Groove Pizza), the voice river, motif threads, a playable Tonnetz pad (Navichord) in the Lab, and a performance worm once real recordings arrive.

**Who each view serves:**

| View | Curious listener | Learner | Jazz nerd |
|---|---|---|---|
| Ribbon | colors + arrows | numerals, brackets | chord-scales, pivots |
| Atlas | "where are we" | why a chord works | satellites, subs |
| Living Clock | shapes moving | chord spelling | voice-leading size |
| Form Arcs | "this again!" | phrase structure | similarity matrix |
| Three Squares | — | dominant families | Barry Harris, axes |
| Keyscape | the piece's poster | key areas | wavescape |
| Tension Braid | the feeling curve | why it's tense | three methods |
| Ghost Chords | surprise moments | expectation | statistics |
| Reharm Lab | — | try a sub | full reharm |
| Archive | discovery | comparison | corpus stats |

---

## 5. Recommendation: build next

**Build the Harmony Atlas (#2), with the Analysis Ribbon (#1) as its companion.** It is what David pointed at. It replaces the weakest v0 view (three chambers with no internal geography). It runs on fields our analysis data already has. And it is the base every other rich view is drawn on. Start with MTH levels 1–3 (diatonic, extensions, secondary functions) and the inside/outside split for borrowed chords; that covers the Bach prelude completely. Hold it to the ColorHub bar: test three data states (a sparse piece, the Bach prelude, a dense jazz tune) before David sees it, and show it on his phone at 440×956.

Open question for David: should piece 2 be a jazz standard, so the Atlas's satellites and tritone subs get a real workout? (The 3D video is answered: it was Metaharmony, §1.4.)
