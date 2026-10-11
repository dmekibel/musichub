# MusicHub (working name)

See the music theory of a piece while it plays: a music archive that does the math, the way
ColorHub does for color. David is the product owner. Read `DESIGN.md` first (users, the
one-moment-many-lenses rule, ROI ranking, color grammar, 2D vs 3D).

## Philosophy
MusicHub hears every piece as a dataset. Compute everything you honestly can (chords, functions,
keys, tension, voice motion, form, rhythm, statistics), then show a calm summary with depth one tap
away. Every view is linked: tap anything and it lights up everywhere. The links are the product.
Design bar = ColorHub's craft bar (`../colorhub/CLAUDE.md`): nothing that feels cheap or vibe-coded;
every state designed; design decisions harvested from real products and cited.

## Honesty rules
- Harmonic analysis is hand-written in `data/<piece>-analysis.js` and must pass `node tools/check.js`
  (every chord tone sounds, every other note is listed as extra or pedal, the bass matches).
- Estimates are labeled as estimates, with the method one tap away (tension today).
- Stories in the section cards must be true to the notes. Check them against the data.

## Data and copyright
- Scores: public domain only. Source files (e.g. CCARH **kern) stay in `_src/` (gitignored); their
  encodings are copyrighted even though the music isn't. `tools/kern2json.py` extracts the facts
  (onset, length, pitch, spelling) into `data/`. Before a big public launch, spot-check the extracted
  notes against a public-domain scan (IMSLP).
- Sound: synthesized in the browser (`js/audio.js`). No copyrighted recordings. Later, licensed
  previews only through official APIs.

## Working here
- No build step. ES modules, static files, GitHub Pages-ready. `package.json` sets `"type": "module"`,
  so the dev server is `tools/serve.cjs`.
- Preview on this Mac: the preview server can't read ~/Documents. Mirror with
  `tools/sync-preview.sh <scratchpad>/musichub-preview` and point `.claude/launch.json` at
  `<that dir>/tools/serve.cjs` (port 8793). Re-run the sync after every edit.
- Check David's phone sizes: 440×956 and 375×812, plus desktop.
- Git: stage explicit paths only (same rule as alter and colorhub). Never commit `_src/`.
