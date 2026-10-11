# MusicHub makeover research: Metaharmony in depth, plus lenses, sliders and premium controls

2026-10-11. Every claim has a link. **[unverified]** means I couldn't confirm it from a primary page.
**[inferred]** means I worked it out myself from the source (code or note math), not from his words.
This goes deeper than section 1.4 of `RESEARCH-VISUALIZATION.md`, and doesn't repeat it.

**Access notes.** metaharmony.co.uk pages fetched fine. meta-harmony.web.app is a blank React shell
to a fetcher, so I downloaded its public JS bundle and read the strings in it. YouTube (@metaharmony1)
and the Vimeo OTT course page (metaharmony.vhx.tv) returned no readable content. The course forum
threads did load.

---

## PART A: Metaharmony (Tom Glazebrook, UK)

### A1. Who and what
- Tom took a music degree built around harmony modules. Then Barry Harris's work gave him the sense
  that "all harmony was connected." Changing keys felt like moving across a physical landscape
  ([My Story](https://www.metaharmony.co.uk/mystory.html)).
- After about 20 months of research he had the colour wheel and the "meta prism". A friend, Charlie,
  helped him name it "metaharmony". Then came a YouTube channel. In April 2023 a spiritual conversion
  led him to delete all his digital work. He started rebuilding in 2025 with a new site
  ([My Story](https://www.metaharmony.co.uk/mystory.html)).
- The paid course lives on Vimeo OTT. It has at least 14 lessons in chapters, and he has said a
  handbook is coming ([forum thread](https://metaharmony.vhx.tv/forums/general-discussion/60607-is-there-a-transcription-book-avaiable)).
  Price and video count: **[unverified]**.
- The site has three ways in: Colours, Geometry and Cook Book. His line: "There's no right place
  to start" ([home](https://www.metaharmony.co.uk)).
- A Hacker News commenter calls the system isomorphic to Lendvai's axis theory
  ([HN](https://news.ycombinator.com/item?id=41436781)). So the math isn't new. What he invented
  is the way it's taught and pictured.

### A2. The colour system: one rule makes everything
1. **Primaries = the three diminished sevenths.** Colour the chromatic scale yellow, red, blue,
   yellow, red, blue, starting on C. Yellow = C, E♭, F♯, A. Red = C♯, E, G, B. Blue = D, F, A♭, B♭.
   Every colour group is a dim7 chord, a stack of minor 3rds
   ([Primaries](https://www.metaharmony.co.uk/colours/primaries.html)).
2. **Secondaries = triads, by mixing.** C major is C, E, G = yellow + red + red, so the chord is
   orange. C minor is orange too
   ([Secondaries](https://www.metaharmony.co.uk/colours/secondaries.html)). Move a triad up a semitone
   at a time and the colours cycle orange, purple, green. So chords of the same colour sit a minor
   3rd apart (same page).
   - [inferred] G major = G, B, D = red + blue + blue = purple. F major = F, A, C = blue + yellow +
     yellow = green. G7 adds F (blue), so it stays purple. His secondaries page doesn't cover
     dominant sevenths (same page).
   - Augmented and sus triads come out three-coloured. The HN commenter reads that as a sign of how
     ambiguous they are ([HN](https://news.ycombinator.com/item?id=41436781)).
3. **Colour = function, inside a family of keys.** In C: orange = tonic, purple = dominant, green =
   subdominant. The purple dominants of C include G, D♭ (the tritone sub), B♭ (the backdoor) and E
   ([Functions 1](https://www.metaharmony.co.uk/colours/functions.html)). The keys C, E♭, G♭ and A
   (the "orange hypercube") share every dominant. G is the plain dominant of C, the backdoor of A,
   the tritone sub of G♭, and the dominant of E♭'s minor
   ([Functions 2](https://www.metaharmony.co.uk/colours/functions%202.html)).
4. **Complementary colour = tension → resolution.** Orange C6 (C, E, G, A) resolves from blue Dº7
   (D, F, A♭, B). Blue sits opposite orange on the wheel. C's extensions (maj7, add9, add11, add♭13)
   are the blue notes, so an "orange triad with a blue 7th" carries its own pull home. The same
   logic holds for red/green and yellow/purple
   ([Complementary](https://www.metaharmony.co.uk/colours/complimentary.html)).
   - The page lists the blue chord as D, F♯, B♭, A♭. That looks like a typo: D, F, A♭, B is the blue
     group on the primaries page. **[unverified which]**

**Why it's clever.** Colour mixing *is* chord construction. Mix two dim7 "parents" and you get a
triad. A triad's tension notes are its complementary colour. Every substitution in a family shows
up as "same colour", so you don't have to memorize a list of subs. The catch is that the colours
are fixed to pitch. "Purple = dominant" holds only in the orange keys. In G, purple is home
([Functions 2](https://www.metaharmony.co.uk/colours/functions%202.html)). It also loses
information: C major and C minor are both orange.

### A3. The geometry: squares → cubes → hypercube → metaprism
| Stage | How it's built | What the parts mean in music |
|---|---|---|
| **Squares** | Each primary's 4 notes, drawn on the circle of fifths, make a square ([Squares](https://www.metaharmony.co.uk/Geometry/squares.html)) | Edges = minor 3rds, diagonals = tritones. Shows the dim7's symmetry, which a keyboard hides (same page) |
| **Alpha cubes** | Primary squares join in pairs to make secondary cubes: orange = yellow + red, and so on ([Alpha cubes](https://www.metaharmony.co.uk/Geometry/Alphacubes.html)) | One face (C, E, G, A) is both C major and A minor. Every secondary-colour edge is a perfect 5th. Moving a chord a minor 3rd = turning the cube 90°; a tritone = 180° (same page) |
| **Hypercube** | Stack three alpha cubes (purple and orange join at red, orange and green at yellow), fold, and join the top and bottom blue notes ([Hypercubes](https://www.metaharmony.co.uk/Geometry/Hypercubes.html)) | It holds 4 keys a minor 3rd apart. He names three axes: stacks of 5ths, minor 3rds, and 1-4-5 function. "Think of it intuitively as a 3D object" (same page) |
| **Key cube / hourglass** | Pull out one key's notes and they form their own cube, the major scale (same page) | I and vi in the middle, V and iii above, IV and ii below. Tonic in the waist, dominant on top, subdominant below. A 651 or a backdoor 2-5-1 is drawn as a path (same page) |
| **Metaprism** | 12 hypercubes in a ring. Stretch the inner cube flat so neighbours share a cube; each hypercube appears as an "innie" (tonic inside) and an "outie" ([Metaprism](https://www.metaharmony.co.uk/Geometry/metaprism.html)) | Modulation = moving through a shared cube. Example: C → F minor (the minor backdoor) → G. He claims nothing in Western harmony falls outside it; no proof is given (same page) |

The overview page sums it up: "All possible harmonic movements and key changes become geometric
movements" ([Geometry](https://www.metaharmony.co.uk/Geometry/Geometry.html)). It also lists
advanced pages: diminished cubes, higher dimensions, arcades and atria. I didn't read those.

**Why it works as a teaching and navigation system.**
- **One object at every zoom.** Chord (square) → triad pair (cube face) → key (key cube) → family
  of 4 keys (hypercube) → all 12 keys (metaprism). You never switch metaphors.
- **Transposition becomes rotation.** Minor 3rd = 90°, tritone = 180°. Symmetry you can see stands
  in for interval maths.
- **Function becomes place.** Tonic sits in the waist, dominant above, subdominant below. A
  progression is a route; a modulation is passing through a shared room.
- **Many ways in.** Colours, geometry and recipes all lead to the same model
  ([home](https://www.metaharmony.co.uk)).

### A4. What his web app does (read from its bundle) [inferred]
From the strings in `main.247e2fa6.js` ([app](https://meta-harmony.web.app/)):
- Views: `colorwheel`, `cube` (with `rotateLeft` / `rotateRight` and `cubeRotation`), `hypercube`
  (with `hypercubeTonic`, `hypercubeDomLeft/Right`, `hypercubeSubLeft/Right`), `coupled`,
  `diatonic`, `chordTable`, plus an augmented-chord panel.
- Pick a key (C major ... B major), a colour (`yellowPick`, `colorCubePick`) and a mode (every key
  × Ionian … Locrian, as `modesActive`). Hovering highlights chord tones (`noteOne chordhover` …).
- Relations it draws: `Complementary`, `Common`, `Syntonic`, and colour-to-colour moves such as
  `blueToGreen`. Chord labels: "its major", "its minor", "its a dominant 7 chord", "its a minor 6 chord".
- **I found no audio code.** There's no AudioContext, oscillator or MIDI string in the bundle. As
  far as I can tell, the app is silent and has no timeline.

### A5. Weak spots (where MusicHub can lead)
- **No real music in time.** Nothing in the app plays a piece or follows a playhead (A4). A
  third-party Streamlit "Crayon Box" colours the chords of a song you type in. Sus, m7♭5 and other
  extensions are still on its to-do list ([GitHub](https://github.com/Lion-Mod/meta-harmony-crayon-box)).
- **No sound in the app** (A4). **Unfinished written theory:** dominant sevenths aren't on the
  secondaries page, and the advanced pages are "forthcoming"
  ([Colours](https://www.metaharmony.co.uk/colours/colours.html)).
- **The 4D/3D object is hard to read**, even by his own framing ("think of it intuitively as 3D").
- **Fragile platform.** The original channel and work were deleted in 2023
  ([My Story](https://www.metaharmony.co.uk/mystory.html)).
- **Colours fixed to pitch** need a key in mind before "purple = dominant" means anything (A2).

### A6. Lessons for MusicHub that don't take his IP
**His:** the yellow/red/blue semitone cycle mapped to orange/green/purple, the names (alpha cube,
key cube, hypercube-as-key-family, metaprism, innie/outie, Cook Book, "Colouring Out") and the
course. **Note:** DESIGN.md's "harmonic hourglass" and its amber/green/violet function hues came
from his images. Rename them and re-hue them, or ask him for permission.
**Public, and free to use:** Barry Harris's three dim7s, Lendvai's axes, Coltrane's circle, and
the fact that transposing by a minor 3rd is a symmetry.
1. **One geometry that zooms.** The same picture should work as a chord, a key, a piece and the
   archive. MusicHub's own: the 12-note clock zooms out to a key region, then a piece's footprint.
2. **Substitution as sameness.** Subs share a slot or shape and differ only by turning
   (tritone = half turn on the clock). Don't give subs their own colour.
3. **Tension points at its resolution.** Draw extensions and leading tones as vectors toward the
   target chord, not as more colour.
4. **Transposition = rotation, animated.** Turn the clock 90° for a minor-3rd shift; never redraw
   it from scratch.
5. **Keep function key-relative** (MusicHub's rule). That's a real difference from his fixed-pitch
   colours, and it's easier for listeners.
6. **Fill his gap:** real pieces, real playback, the playhead, the archive. That's what makes
   MusicHub different, not a competitor.
7. **Credit him.** A short "Further reading: Metaharmony" link in the Lab is good manners and
   avoids any look of copying.

---

## PART B: References for "one song, many lenses" and premium controls

### B1. Grain / zoom / grouping sliders over time
1. **Craig Sapp keyscapes.** Time runs along x and window length up y: the bottom row is chord by
   chord, the top point is the whole piece. *Steal:* the y-axis **is** the grain slider, so every
   grain shows at once and the triangle doubles as a scrubber
   ([Sapp paper](https://ccrma.stanford.edu/~craig/papers/05/p3d-sapp.pdf)).
2. **Wavescapes / midiVERTO (DCML).** The same triangle, coloured by DFT coefficients of pitch-class
   sets, with `aw_size` (the shortest window, in quarter notes) as the grain setting. *Steal:* a
   **coefficient picker** gives one song many lenses (fifths-ness, tritone-ness, whole-tone-ness)
   in one frame ([wavescapes](https://github.com/DCMLab/wavescapes)). midiVERTO itself rendered
   blank to my fetcher ([midiVERTO](https://dcmlab.github.io/midiVERTO/)) **[UI unverified]**.
3. **Martin Wattenberg, *The Shape of Song*.** Translucent arcs join repeated passages. *Steal:*
   **arc thickness = length of the repeat**, so form reads as one picture with no labels
   ([bewitched.com](http://www.bewitched.com/song.html)).
4. **Sonic Visualiser.** Panes stack vertically and share one time axis; each pane holds any number
   of layers (spectrogram behind, notes and onsets in front). *Steal:* **lenses as stacked layers
   on a shared clock**, so a new lens is a layer, not a new page
   ([features](https://sonicvisualiser.org/features.html)).
5. **Ableton Live: Session vs Arrangement.** The same clips seen two ways: a free-order grid and a
   fixed timeline ([manual](https://www.ableton.com/en/live-manual/12/session-view/)).
   **Ableton Note** cuts it to 8×8 on a phone
   ([Sound On Sound](https://www.soundonsound.com/reviews/ableton-note)). *Steal:* a **"grid ⇄
   timeline" toggle** for a piece: sections as clips you can loop, or the score in order.
6. **Hooktheory / Chordify.** Chord blocks sized by duration, a beat grid, a synced playhead
   (details in RESEARCH-VISUALIZATION §2). *Steal:* **chip width = time**, so harmonic rhythm
   shows up for free.
7. **Synthesia-style falling notes.** Coloured blocks fall onto a keyboard; colour = hand or voice
   ([Klavia, describing the genre](https://klavia-piano.com/synthesia-alternative-for-your-own-sheet-music.html))
   **[Synthesia's own docs unverified]**. *Steal:* keep it as the familiar entry lens, with colour
   reserved for function, not hand.
8. **Chrome Music Lab.** Single-purpose toys: Spectrogram, Harmonics, Chords
   ([techlearning](https://www.techlearning.com/news/learning-music-art-science-math-and-more-with-chrome-music-lab)).
   *Steal:* **one idea per screen, playable in a second**, as a model for MusicHub's Lab cards.

### B2. Landscapes (the archive scale)
9. **Every Noise at Once.** A scatter of about 1,500 genres on two audio-feature axes; click to hear
   ([Wikipedia](https://en.wikipedia.org/wiki/Every_Noise_at_Once)). *Steal:* **axes you can
   explain in one sentence**, with sound on tap. Sources disagree on which feature runs along which
   axis **[unverified]**.
10. **Musicmap (Kwinten Crauwels).** A genealogy from 1870 to 2016: 22 super-genres, 230+ genres,
    zoom levels, playlists built in
    ([Open Culture](https://www.openculture.com/2018/03/behold-the-musicmap-the-ultimate-interactive-genealogy-of-music-created-between-1870-and-2016.html)).
    *Steal:* **levels of detail drawn like an architect's plan**, so each zoom level is its own
    designed drawing, not just a scaled one.
11. **The Pudding.** Sparse-text visual essays, e.g. a Billboard timeline that plays each No. 1 for
    a time proportional to its weeks at the top
    ([Storybench](https://www.storybench.org/the-proof-is-in-the-pudding-how-one-online-publication-is-using-cutting-edge-data-visualizations-to-tell-meaningful-pop-culture-stories/)).
    *Steal:* **sound duration as a data channel**, plus a guided story mode over the lenses.

### B3. Morphing between views of the same data
12. **Object constancy (Mike Bostock).** Each mark keeps its identity (a key function), so the eye
    can follow it through the change. Cross-fade when the two views have nothing in common
    ([bost.ocks.org](https://bost.ocks.org/mike/constancy/)). *Steal:* **every chord keeps one ID
    across Strip, Clock, Journey and Roll**, so switching lens *moves* the chord rather than
    swapping the picture.
13. **Heer & Robertson, "Animated Transitions in Statistical Data Graphics" (2007).** Two experiments
    found animated transitions improve graphical perception. Staging works best: e.g. stacked →
    grouped bars changes x and width first, then drops to the baseline
    ([paper](http://vis.stanford.edu/papers/animated-transitions)). *Steal:* **staged morphs**:
    chip lifts out of the strip → travels → lands on the clock.
14. **Flourish stories.** Slides morph only when they share a template; there's a setting for
    "morph vs redraw" ([help](https://helpcenter.flourish.studio/hc/en-us/articles/8761559998351-Creating-a-story),
    [filters blog](https://flourish.studio/blog/chart-filters/)). *Steal:* morph only between lenses
    whose marks map one to one; otherwise do a clean cross-fade.
15. **Apple Music time-synced lyrics.** Lyrics scroll in time over a moving background drawn from
    the album art ([Apple newsroom](https://www.apple.com/newsroom/2022/12/apple-introduces-apple-music-sing/),
    [iDB](https://www.idownloadblog.com/2019/06/13/apple-music-ios-13-overview/)). A word-by-word
    reveal mask is described in a third-party write-up
    ([dev.to](https://dev.to/vimu_kale_4b5058f002ff8b1/how-apple-music-maps-audio-to-lyrics-the-engineering-behind-real-time-lyric-sync-4fin))
    **[unverified]**. *Steal:* **the current chord name "fills" left to right over its duration**,
    and tapping a past line seeks there.

### B4. Premium controls: what makes them feel expensive
16. **Teenage Engineering OP-1 / OP-1 field.** Four encoders (blue, green, white, orange) match the
    colours of the four on-screen parameters they control. The field keeps the mapping with muted
    tones ([Perfect Circuit review](https://www.perfectcircuit.com/signal/teenage-engineering-op-1-field-review)).
    **OP-XY:** a greyscale set of encoders, a 480×220 monochrome screen, and encoders that click as
    buttons ([Sound On Sound](https://www.soundonsound.com/reviews/teenage-engineering-op-xy),
    [Mehatronika](https://magazinmehatronika.com/en/teenage-engineering-op-xy-review/)).
    *Steal:* **one control ↔ one on-screen mark, tied by a shared colour or position**. Few
    controls, each always meaning the same thing.
17. **Apple "Designing Fluid Interfaces" (WWDC18).** Motion should be responsive, interruptible and
    redirectable; springs carry velocity; rubber-banding at edges
    ([WWDC18 803](https://developer.apple.com/videos/play/wwdc2018/803/)). *Steal:* the scrubber
    and grain slider **follow the finger 1:1, keep momentum, rubber-band at the ends**, and never
    lock input during a morph.
18. **Haptic detents.** Apple's HIG offers selection haptics; guides recommend a selection tick for
    sliders ([HIG: playing haptics](https://developer.apple.com/design/human-interface-guidelines/playing-haptics),
    [summary](https://saropa-contacts.medium.com/2025-guide-to-haptics-enhancing-mobile-ux-with-tactile-feedback-676dd5937774))
    **[HIG page not fetched]**. *Steal:* the grain slider **snaps with a tick at musical units**
    (beat / bar / phrase / section / piece). The web has no iOS haptics, so use a visual snap plus
    a soft click sound.
19. **Koala Sampler.** Three tabs (Sample / Sequence / Perform) map to the three stages of the
    work. It isn't pretty, but reviewers call it the clearest UX on iOS
    ([Sound On Sound](https://www.soundonsound.com/reviews/elf-audio-koala-sampler),
    [DJ TechTools](https://djtechtools.com/2023/02/07/meet-the-koala-sampler-app-a-mobile-production-powerhouse-now-with-stems/)).
    *Steal:* **tabs = the user's stages** (Listen / Understand / Play), not feature categories.
20. **Endlesss.** Each "rifff" is drawn as a circular waveform, with more colours for richer layers;
    history is a chain you can step back through
    ([musicxtechxfuture](https://www.musicxtechxfuture.com/2021/01/12/musics-non-static-future-as-seen-through-music-making-app-endlesss/),
    [Sonicstate](https://sonicstate.com/news/2019/04/16/sonic-lab-tim-exiles-endlesss-first-look/)).
    *Steal:* **each section as a small circular glyph**: a thumbnail you can both read and tap.

**What separates expensive from cheap (synthesis of 16–20) [inferred]:**
- Expensive: few controls, each with one fixed meaning and a visible partner on screen (OP-1).
  Cheap: many small identical buttons.
- Expensive: motion that keeps your velocity, can be interrupted and settles on a spring (Apple).
  Cheap: fixed-time ease-in-out that locks input.
- Expensive: snaps at units that mean something (bar, phrase). Cheap: free float or arbitrary steps.
- Expensive: a press shows depth or a state change within one frame. Cheap: a hover tint only.
- Expensive: colour used sparingly and always mapped to meaning (OP-XY greyscale + one accent).
  Cheap: decorative gradients.

### B5. The MusicHub move this points to [inferred]
**A grain slider + morphing lenses.** One horizontal slider snaps at note → beat → bar → phrase →
section → piece. Every lens regroups at that grain (strip chips merge, clock trails lengthen, Journey
shows the dwell time per region). A Sapp-style triangle is the "all grains at once" view. Lens
switches are staged morphs with stable chord IDs. Controls follow the OP-1 rule: one control, one
mark, one meaning.

---

## A7. Full read of every page, done myself (2026-10-11, after David asked "did you actually go through his concepts?")
Pages read: home, Colours, Functions, Squares, Alpha cubes, Hypercubes, Metaprism, Arcades, Atria, Recap, Diminished cubes,
Higher dimensions, Cook Book index. What the earlier summary missed, and what matters most for MusicHub:
- **Function families, not single chords.** "All purple chords are dominant to C": G (the dominant), D♭ (tritone sub), B♭
  (backdoor) and E all pull to C, because they sit a minor third apart. Each function is a *family of four* chords a
  minor third apart. That's the real payoff of the three squares: substitution = staying in the same family.
- **The hypercube is a 2D chart in disguise.** On his Geometry page, left/right = the minor-third cycle and up/down =
  1-4-5. So the 12 major chords fit a 4 × 3 grid that wraps around (a torus): columns = the four keys a minor third
  apart (C, E♭, G♭, A), rows = tonic / dominant / subdominant families. A key change to the dominant = the grid slides
  one row. (Our own derivation of the math; his pictures and names stay his.)
- **The key cube (his hourglass).** I and vi in the waist, V and iii above, IV and ii below: function = height.
- **Arcades** = whole-tone families of keys (six keys); moving along one changes hypercube, so the same chord takes a
  new function (C → A: tonic-to-tonic in one view, subdominant of E in another).
- **Atria** hold the three alpha cubes (the tonic cubes) and the three diminished cubes.
- **Diminished cubes:** two diminished squares turned 90° → the vii° triad and Barry Harris's 8-note 6th-diminished scale.
- **Metaprism worked examples:** C7–Em7–D7 (Em is iii in C, then heard as ii in D, "within one arcade");
  C7–Fm–G7 (F minor as the minor backdoor carries you to G: "we've traversed the metaprism").
- **Still missing on his side:** the advanced pages are short; the Cook Book has 4 entries ("more coming soon"); no
  real pieces played in time.
- **IP flag (confirmed):** his function colours are orange tonic / green subdominant / purple dominant. MusicHub's
  saffron / green / indigo are too close. Recolour before any public launch.
