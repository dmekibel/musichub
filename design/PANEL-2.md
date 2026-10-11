# Panel review 2: the beta, screen by screen (2026-10-11)

The panel:
- **Product lead:** the meta. Does the beta prove the purpose?
- **Visual designer:** iconic and beautiful.
- **Interaction designer:** user-friendly; does everything do what it looks like it does?
- **Music theorist:** accuracy.
- **Learning scientist.**
- **Engineer:** does it work on David's iPhone?

## Verdict
The idea is now visible: one song plays, the harmony moves on the Atlas, and the whole screen changes color with it.
What still reads as "cheap" isn't the color or the type. It's three things:
1. **Dead buttons.** Things look tappable and do nothing.
2. **Generic list rows.** They make pages feel like a settings app.
3. **Clip-art sleeve shapes.** A pin or a tree is an icon, not data.

Fix those three, and the beta looks like a product.

## Fixed in this pass (so the beta works with one song)
- **The Player plays Bach's Prelude in C**, with real synthesized sound. Play, pause, step bar by bar, and tap or scrub the progress bar.
  The Atlas, the chord, the plain-language line, the ribbon and the pills all follow the music.
- **Lenses that work:** Atlas, Dials (live, per bar), Clock (the sounding notes as a shape) and Story (the section).
  The Score lens is hidden until it exists.
- **The signature moment:** while it plays, the whole screen takes the color of the harmony.
  Warm at home, green away, indigo in tension, fading over 0.7 s.
- **A live mini-player** follows you across rooms, with play and pause. Today shows it only once something is playing.
- **Sound everywhere it's promised:**
  - "Hear it" on the square plays the diminished chord, and the three square tiles play their chords.
  - The Lab plays every move you make.
  - The style page plays the bossa clave.
- **The lesson works.** A and B play the real bars 11 and 12; you pick, then Check.
  The reveal colors both answers by their harmony, so the color rule *is* the teaching moment.
- **Save toggles, and Share opens the phone's share sheet.**
- **iPhone fix:** the silent switch was muting Web Audio. A silent audio clip on the first tap moves the page into playback mode.
- **Cache-busted files**, so the phone always gets the latest build.

## Still broken or weak (nitty-gritty), ranked
1. **Dead affordances:**
   - the piece page's lens tabs (Shape, Rhythm, Form, Story);
   - the Wall's sort pills;
   - the decade dial (not draggable);
   - "15 places";
   - "Start the trail";
   - the search box (can't type);
   - the Learn "Masters" tab;
   - locked path nodes with no explanation.

   Rule: wire it or remove it. Nothing may look tappable and fail.
2. **The Atlas doesn't re-key** when Bach visits G (bars 5–11 are shown with their meaning in C). That's honest, but incomplete:
   the map should slide to G and keep a small "home: C" marker (from mDecks).
3. **Roman numerals scare non-musicians.** Atlas nodes should read in plain words first (home, away, tension; "the five", "the four"),
   with numerals behind a toggle.
4. **The Atlas has no legend.** Satellites (V/IV and friends) need a one-line "points at" explanation on first view.
5. **Sleeve contrast on adaptive backgrounds:** a cobalt sleeve on a cobalt-deep page loses its edge. It needs a hairline frame or a soft shadow.
6. **The Clock lens is static.** The voice-gliding motion from v0 hasn't been ported yet.
7. **Soft grey text on colored grounds** sometimes falls below a readable contrast. Raise the soft ink to about 80%.

## Redesign brainstorm, menu by menu (iconic, friendly, beautiful)
- **Global:** an icon family for the tab bar (one stroke, one grid). The active room gets a small sleeve-colored dot.
  Swap the generic rows for **record shelves**: horizontal rows of sleeves with the name under each, like a record store.
  A sleeve tapped grows into its page (ColorHub's morph).
- **Today:**
  - The hero sleeve plays in place: tap it and it starts, and the screen starts changing color right there.
  - The three extras become three equal sleeves in a row: born today, a sound from somewhere, next lesson.
- **Player:**
  - The ribbon becomes the **whole piece as one scrubbable strip**, with all 35 bars and the section names.
  - One big chord name, a plain-language line, then numerals small.
  - An optional "guided" mode where story cards appear at section changes.
- **Pages:**
  - Hero sleeve, then the **Five Dials as one combined glyph** (all five shapes overlaid). That makes a signature for every page.
  - "Because…" as cards with the reason set large ("uses all three squares").
  - A sticky mini header once you scroll.
- **Explore:**
  - The map goes full bleed, with the decade dial as a real draggable wheel.
  - River: a horizontal swipe through time.
  - Wall: edge to edge with no gutters, like a wall of records.
- **Lab:** the squares toy is the right model. Each tool gets one sentence of "why this matters" and a "find it in a piece" link.
- **Learn:** path nodes become small sleeves; the lesson keeps the neutral-then-reveal pattern.
- **Sleeve shapes:** data only. A place's sleeve shows its rhythm necklace or its Five Dials glyph, never a pin. A style shows its clave or its dials, never a tree.

## Meta: does the beta prove the purpose?
The promise is "hear what's inside music". This beta should prove three things with one song:
1. **Seeing it while it plays** (Atlas + color) makes the music clearer. Does a non-musician say "oh, that's the tense part"?
2. **The connections** feel like a world (piece → the square → the Lab → Bach again).
3. **One number feels like a discovery:** "Squares 1.00 exactly where Bach writes a diminished chord".

Test with three people who have never seen it, on a phone, giving each one task and saying nothing (Krug). Record whether they:
- press play;
- name a "tension" moment;
- open a connection.

## Next steps, ranked (cost S, M, L)
1. **(S) Wire or remove every dead affordance**, and real copy everywhere. This is the biggest "cheap" fix and costs little.
2. **(M) Visual pass v2:** tab-bar icons, record shelves, sleeve shapes as data only, sleeve edges, the combined Dials glyph.
3. **(M) Player v2:** the whole-piece strip, plain-word Atlas labels, re-keying to G with a home marker, a short guided mode.
4. **(S) A three-person hallway test** of the beta link, then fix what they trip on.
5. Later (David: push features before building): ear gym, Key Wheel, piece 2, archive growth.

## Learn: a curriculum spine (from the jazz-piano levels David shared)
The five levels map onto MusicHub's visual lenses. Every skill becomes something you *see* as well as hear:

| Level | Skills | How MusicHub teaches it |
|---|---|---|
| 1 Novice | notes, sharps and flats, half and whole steps, major triads, find the tonic, simple melodies | the 12-note clock (steps = neighbors); a triad as a triangle; "find home" on the Atlas |
| 2 Beginner | major scales, diatonic triads, dominant 7ths, half-diminished, inversions, V7, sus chords, diminished triads | the scale as "7 in 12, most even"; the seven chords of a key as the Atlas's addresses; the bass ring for inversions |
| 3 Competent | 7ths and 9ths, maj9♯11, major and minor 2-5-1, drop 2, tritone placement, blues scale, pentatonics, **diminished 7ths**, basic improv, modes, rhythm patterns | the 2-5-1 as a route on the Atlas; **the three squares** (Lab); rhythm necklaces; pentatonic as a shape twin |
| 4 Intermediate | extensions, drop 2 7ths, 21 modes in every key, progressions, **V7♭9**, transcribing, any key | V7♭9 = a square plus its root (Barry Harris); modes as rotations of one shape; progressions as Atlas routes in any key |
| 5 Advanced | **bebop scales**, blues and gospel licks, **diminished scales and voicings**, unlimited progressions, drop 2 mastery, modal playing | Barry Harris's 6th-diminished scale; the octatonic scale as two squares; reharmonizing on the Atlas |

The Masters courses (Barry Harris and others) sit at levels 3–5. Ear training stays deferred until David pulls it forward.
