# Who uses MusicHub, for what, and what that changes in the design (2026-10-11)

## The people (one song, seven different needs)
| Who | Their question at bar 12 of the Bach Prelude | What they need on screen |
|---|---|---|
| **Curious listener** | "Why does this part feel uneasy?" | Plain words, the color change, the story. No jargon unless asked. |
| **Theory student** | "What is that chord, and why does it work?" | The Atlas, Roman numerals, voice leading, a definition one tap away. |
| **Piano learner** | "How do I play this?" | A keyboard with the notes lit, slow-down, loop bars 12–14, step chord by chord, the same chord in other keys. |
| **Jazz player** | "What would Barry Harris do here?" | The squares, substitutions, chord-scales, the Lab tools. |
| **Explorer / digger** | "What else is like this? Where did it come from?" | Every name a link, "Because…" with reasons, a trail back, save to boards. |
| **Producer / songwriter** | "Can I use this move?" | Capture the progression, transpose it, export MIDI. |
| **Teacher** (later) | "Can I show this to my class?" | Big-screen mode, assign a trail. |

## The moments they come for
1. **Analyze a piece** (10–30 minutes, a study session): the Player as a workspace. They leave the song to look something up and come back to the same bar.
2. **A rabbit hole** (2–20 minutes): from one chord to an idea, to a master, to a style, to a place. This is Wikipedia and Pinterest.
3. **Learn a concept** (5 minutes): the Path.
4. **Practice at the piano** (hands busy): big, glanceable, loop and slow, one thumb.
5. **Play with theory** (the Lab).
6. **Find music like this** (discovery: the Atlas, the Wall, "more like this").
7. **Make something** (Capture → MIDI).

## What this changes in the design

### 1. The music never stops while you wander: the song is the thread
A study session and a rabbit hole are the same thing: you leave the moment to understand it. So the mini-player keeps the
song going (or paused at your bar) while you jump between pages, and coming back drops you on the same bar in the same lens.
**The trail** shows the way back: a compact line at the top, like "Prelude in C · bar 12 › C♯°7 › The square › Barry Harris".
Back returns exactly where you were (ColorHub's one trail; Pinterest's back stack).

### 2. Tap anything; long-press to peek
- **Tap:** every chord name, numeral, note, shape, place and person is a link, with one consistent signifier (a hairline
  underline), and opens its page (David: never an in-between sheet).
- **Long-press:** a quick peek card (the definition, the sound, two connections) that disappears when you let go, so an
  analyst can check something without losing the bar.

### 3. Moments are first-class
"Bar 12 of the Prelude in C" is an object you can link, save and share. Every idea page has a **Moments** section: every place in
the archive where it happens, each one opening the Player at that bar. This is Wikipedia's "what links here" for music, and it's
the bridge between analyzing and exploring. With one song, the diminished-seventh page already has five moments (bars 12, 14,
22, 23, 28).

### 4. Same screen, different default lens: personal by purpose
First run asks "what brings you here?" (already in the prototype), and that sets the defaults.

| Who | Default lens and words |
|---|---|
| Listener | Story + color, plain words |
| Student | Atlas + numerals |
| Pianist | Keyboard + loop + slow |
| Jazz | Atlas + squares |
| Producer | Palette + Capture |

A global **words switch** (Aa) flips between plain words (home, away, tension; "the five chord") and theory terms (T, S, D; V⁷)
everywhere at once.

### 5. Study tools in the Player (for analysts and pianists)
- Loop: select bars on the whole-piece strip.
- Tempo.
- Step mode.
- A **Keyboard lens:** the sounding notes lit on piano keys, with the bass hand and the right hand split.
- **Transpose:** play it in any key. The Atlas shapes stay the same, because addresses are fixed, so the route you learned
  works everywhere.
- Pin a moment and add a note.

### 6. Every page ends in "more like this"
A Pinterest-style grid of sleeves (same square, same move, same place, same decade), each with its reason. A page is never a
dead end.

### 7. Search is a command bar
Pull down anywhere to search across pieces, ideas, people, places and moments ("diminished seventh in Bach" → five moments).

### 8. Your rabbit hole, remembered
Under You, "your trail" shows today's journey as a little map (Bach → the square → Barry Harris → bebop). It's fun to look at, and
it's the start of the taste fingerprint.

## What to build next (one song, cheapest proof of the exploring mechanic)
1. **Tap-anything in the Player.** Chord names, ribbon chords and Atlas nodes open an **idea page generated from real data**
   for each chord kind in the Prelude (dominant seventh, diminished seventh, major seventh…). Each page has its Moments, which
   jump back into the Player at that bar.
2. **The trail bar plus exact back.** The song keeps its place.
3. **The Keyboard lens** (the piano learner's first need), plus **loop and tempo**.
4. **The words switch** (plain ↔ theory).

These four make the beta feel like Wikipedia and Pinterest with one song, and they serve the listener, the student and the
pianist at once. Everything else stays a design until it's pulled forward.
