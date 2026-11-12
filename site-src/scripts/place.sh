#!/bin/sh
# Put the built site (dist/) at the repo ROOT, which Vercel and GitHub Pages
# serve as-is. Run only when the owner has said the new site may go live.
#
# ⚠ It never deletes anything. Both Google Search Console files (google*.html)
# must stay in the root forever, or that account silently loses the property.
set -eu
HERE=$(cd "$(dirname "$0")/.." && pwd)
ROOT=$(cd "$HERE/.." && pwd)
DIST="$HERE/dist"
[ -f "$DIST/index.html" ] && [ -f "$DIST/en/index.html" ] || { echo "build first: npm run build"; exit 1; }
cp "$DIST/index.html" "$ROOT/index.html"
mkdir -p "$ROOT/en"
cp "$DIST/en/index.html" "$ROOT/en/index.html"
cp -R "$DIST/assets" "$DIST/media" "$ROOT/"
cp "$DIST/favicon.png" "$DIST/apple-touch-icon.png" "$DIST/sitemap.xml" "$DIST/robots.txt" "$ROOT/"
ls "$ROOT"/google*.html >/dev/null 2>&1 || { echo "⚠ a Search Console file is missing from the root"; exit 1; }
echo "placed. Check: git -C \"$ROOT\" status"
