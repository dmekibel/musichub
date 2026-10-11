#!/bin/sh
# Mirrors the site into a folder the local preview server can read.
# (The preview server can't read ~/Documents directly on this Mac.) Usage: tools/sync-preview.sh <dest>
cd "$(dirname "$0")/.." && rsync -a --delete --exclude _src --exclude .git --exclude node_modules ./ "$1/"
