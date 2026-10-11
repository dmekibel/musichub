# Design pass 3: the last look before building (2026-10-11)

I reviewed the beta screen by screen (iPhone 440 px screenshots, playing and paused) against PANEL-2 and USERS. Each item
below is what I saw, then the decision. Items marked **(build)** go into this prototype round. The rest wait.

## What the screenshots show
1. **Tension on tension disappears.** When the screen turns indigo, the indigo "tension" nodes melt into it (the Atlas, the
   pill dot, the ribbon bars). The color rule is right, but the marks have no edge.
   → **(build)** Every colored mark on a colored ground gets a cream hairline ring. That's one rule, used everywhere.
2. **The Atlas on the piece page is unstyled.** Its labels fall back to body text, because the Atlas styles lived inside the Player.
   → **(build)** The Atlas styles move into the design system.
3. **The Player has three progress systems:** the 8-bar ribbon, the meter and "bar 3 of 35". It reads busy, and you can't see the whole piece.
   → **(build)** All three become one **whole-piece strip**:
   - 35 cells colored by function, with the 6 section names above;
   - tap a cell to jump there;
   - it doubles as the loop selector.
   The strip *is* the piece's shape, so you can see the trip to G and the long wait.
4. **The chord is big, but it leads nowhere.** "G⁷ over B" is the most interesting thing on screen and isn't tappable.
   → **(build)** Under the chord sits one link: "Dominant seventh ›", with the hairline underline that marks every link in the app.
   Atlas nodes are links too.
5. **Numerals first scares listeners** (PANEL-2 #3). → **(build)** An **Aa** switch in the top bar:
   - **Plain:** the Atlas shows chord names (C, Dm, G…) plus home / away / tension.
   - **Theory:** numerals (I, ii, V…) and function names.
   Pianists read chord names, students read numerals, and one tap flips everything.
6. **Nothing for hands.** → **(build)** A **Keys** lens:
   - two piano octaves and a half, showing the bar's notes lit in the harmony color;
   - the note sounding right now flashes;
   - left hand and right hand are written out underneath ("left C E · right G C E").
7. **Transport has no study tools.** → **(build)** **Loop** on the left, **tempo** on the right (♩ 66 / 52 / 40 / 80), prev / play / next in the middle.
   - Loop catches the current bar.
   - With loop on, tapping another cell stretches it ("Loop 12–14").
8. **You lose your place when you wander.** → **(build)** **The trail**:
   - one quiet line under the top bar, e.g. *Prelude › Playing · bar 12 › Diminished seventh › The square*;
   - each step taps back;
   - the song keeps its bar and its lens, because the player is shared;
   - going back never re-seeks.
9. **Learn:** the check marks over sleeves look muddy, and locked nodes don't explain themselves. → Later (the Learn pass).
10. **The tab bar is text only.** → Later (visual pass v2: one-stroke icons, record shelves).

## The new page type: the idea page (build)
This is the page that makes the Wikipedia/Pinterest feel work with one song. It's generated from real data, for:
- every chord kind in the Prelude (major, minor, dominant seventh, diminished seventh, major seventh, minor seventh, suspended);
- every Atlas address (home, the four, the five, the borrowed "leaners").

From top to bottom:
1. **Trail.**
2. **Hero sleeve.** Its shape is the chord on the 12-note clock, colored by what the chord usually does. The name is huge.
3. **Hear it.** It plays Bach's own voicing from the first moment.
4. **One plain sentence**, and a theory line under it (the Aa switch decides which one leads).
5. **Moments: where it happens in the Prelude.** A shelf of cards (bar number big, chord, function color). Tap one and the
   Player opens at that bar. This is Wikipedia's "what links here" for music.
6. **What it does here.** A home / away / tension split bar, e.g. "4 of 5 times it's tension".
7. **Its shape.** The Five Dials of the chord itself (a diminished seventh scores Squares 1.00).
8. **Relatives:** links with a reason ("drop one note by a half step → a dominant seventh").
9. **More like this:** sleeves of the other ideas, so the page never dead-ends.

## Deliberately not in this round
Default lens by purpose (needs the welcome screen to set it), long-press peek, transpose, search as a command bar, Learn
and Explore redesigns, piece 2, the archive, ear training (David: later).

## Done when
On David's phone, a listener can:
1. press play;
2. tap the chord name;
3. read the idea page;
4. tap a Moment;
5. land on that bar, still playing;
6. tap the trail back.

A pianist can open Keys, loop bars 12–14 at ♩ 40 and see both hands.
