#!/bin/sh
# Phone-size screenshots of prototype routes via headless Chrome. Usage: tools/shots.sh <outdir> route...
OUT="$1"; shift; mkdir -p "$OUT"
for r in "$@"; do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=520,956 --virtual-time-budget=8000 --screenshot="$OUT/$r.png" \
    "http://localhost:8793/tools/frame.html#%2Fdesign%2Fapp%2Findex.html%23$r" 2>/dev/null
  sips -c 956 440 --cropOffset 0 0 "$OUT/$r.png" >/dev/null 2>&1
done
