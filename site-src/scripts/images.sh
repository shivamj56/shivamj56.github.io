#!/bin/sh
# Re-make the site's images from the raw app captures.
#
#   sh scripts/images.sh <captures-dir> <brand-dir>
#
# <captures-dir> holds the raw 1290x2796 PNG captures of the seller app
# (430x932 pt @3x, light/dark), laid out as  light/<name>.png  dark/<name>.png
# <brand-dir> is the app repo's mobile/assets folder (brand/osht-mark.png,
# icon-set/ios-light.png, icon-set/ios-dark.png).
#
# Every screen ships as WebP in three widths for srcset; nothing is cropped,
# the phone frame and its status bar are drawn by the page (PhoneFrame.tsx).
set -eu
CAP=${1:?captures dir}
BRAND=${2:?brand dir}
OUT=$(dirname "$0")/../public/media
mkdir -p "$OUT/screens" "$OUT/brand"

shot() { # <source png> <name>
  for w in 400 720 1080; do
    cwebp -quiet -q 80 -m 6 -sharp_yuv -resize "$w" 0 "$1" -o "$OUT/screens/$2-$w.webp"
  done
}
shot "$CAP/light/home.png"          home
shot "$CAP/light/rates.png"         rates
shot "$CAP/light/money.png"         money
shot "$CAP/light/lorry.png"         lorry
shot "$CAP/light/lorry-papers.png"  papers
shot "$CAP/light/repeat.png"        repeat
shot "$CAP/light/madam.png"         madam
shot "$CAP/light/profile.png"       level
shot "$CAP/light/wizard-ask.png"    ask
shot "$CAP/light/wizard-review.png" review
shot "$CAP/light/login.png"         login
shot "$CAP/light/notifications.png" updates
shot "$CAP/dark/home.png"           home-night
shot "$CAP/dark/money.png"          money-night

cwebp -quiet -q 90 -alpha_q 100 -m 6 "$BRAND/brand/osht-mark.png" -o "$OUT/brand/mark.webp"
cp "$BRAND/brand/osht-mark.png" "$OUT/brand/mark.png"
cwebp -quiet -q 86 -m 6 -resize 320 0 "$BRAND/icon-set/ios-light.png" -o "$OUT/brand/icon-day.webp"
cwebp -quiet -q 86 -m 6 -resize 320 0 "$BRAND/icon-set/ios-dark.png"  -o "$OUT/brand/icon-night.webp"
png() { ffmpeg -loglevel error -y -i "$1" -vf "scale=$2:$2:flags=lanczos" "$3"; }
png "$BRAND/icon-set/ios-light.png" 180 "$OUT/../apple-touch-icon.png"
png "$BRAND/icon-set/ios-light.png" 192 "$OUT/brand/icon-192.png"
png "$BRAND/icon-set/ios-light.png" 512 "$OUT/brand/icon-512.png"
png "$BRAND/icon-set/ios-light.png" 48 "$OUT/../favicon.png"
echo "images written to $OUT"
