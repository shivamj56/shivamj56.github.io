#!/usr/bin/env python3
"""Give every app screenshot a clean rounded silhouette.

Each capture bakes in whatever sat behind the phone: the original set was shot
on the app's dark backdrop, the newer exports on light grey. Either way the card
arrives as a rectangle with a backdrop in its corners, which is what makes the
edges look unfinished once the card is composited onto the page.

Flood-filling inward from the four corners identifies that backdrop whatever its
colour, so the same pass works on both sets. What survives is the card itself,
cropped to its own bounds and padded back out to one shared aspect so every card
in the reel is the same shape.
"""
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

TARGET_ASPECT = 392 / 846      # the shape the reel and the hero are built around
THRESH = int(os.environ.get('THRESH', '60'))
ERODE = int(os.environ.get('ERODE', '5'))   # MinFilter kernel; 5 trims ~2px


def refine(src, dst):
    im = Image.open(src).convert('RGB')
    w, h = im.size

    # The two sets need very different thresholds: the original captures sit on
    # a dark gradient that a tight threshold cannot span, while the newer ones
    # sit on light grey only ~28 levels from the card itself, where a loose
    # threshold floods straight through the screen. So try increasing thresholds
    # and keep the largest that still leaves the middle of the card untouched.
    SENTINEL = (255, 0, 255)
    cy0, cy1 = int(h * 0.35), int(h * 0.65)
    cx0, cx1 = int(w * 0.30), int(w * 0.70)
    alpha = None
    for t in (14, 18, 24, 32, 42, 55, 70):
        work = im.copy()
        for xy in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
            ImageDraw.floodfill(work, xy, SENTINEL, thresh=t)
        a = np.asarray(work)
        outside = (a[..., 0] == 255) & (a[..., 1] == 0) & (a[..., 2] == 255)
        if outside[cy0:cy1, cx0:cx1].any():
            break                      # leaked into the card — the previous t stands
        cand = np.where(outside, 0, 255).astype(np.uint8)
        corner = cand[:h // 12, :w // 8]
        if (corner == 0).mean() > 0.02:
            alpha = cand              # keying something real, and not leaking
    if alpha is None:
        raise SystemExit(f'{src}: backdrop not separable from the card')

    ys, xs = np.where(alpha > 0)
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    bw, bh = box[2] - box[0], box[3] - box[1]

    # The flood gives a mask with a ragged, antialiased edge and a fringe of the
    # old backdrop clinging to the arc. Rather than erode that away and hope, use
    # it only to measure the card, then draw the mask exactly: a card is a
    # rounded rectangle, so the clean answer is to render one.
    # Measuring the radius off the flood mask under-reads it, because the mask
    # still counts the fringe as card. The display corner radius on these
    # devices is a fixed share of the screen width, so use that and let the
    # inward pull below absorb the difference.
    radius = round(bw * 0.108)

    SS = 4                                        # supersample for a smooth arc
    mask = Image.new('L', (bw * SS, bh * SS), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, bw * SS - 1, bh * SS - 1), radius=radius * SS, fill=255)
    mask = mask.resize((bw, bh), Image.LANCZOS)
    # Pull in by a hair so no row of the old backdrop survives under the arc.
    mask = mask.filter(ImageFilter.MinFilter(ERODE))

    card = Image.fromarray(np.asarray(im)[box[1]:box[3], box[0]:box[2]]).convert('RGB')
    card.putalpha(mask)

    # Pad to the shared aspect so every card in the reel is the same shape.
    cw, ch = card.size
    tw, th = cw, ch
    if cw / ch > TARGET_ASPECT:
        th = round(cw / TARGET_ASPECT)
    else:
        tw = round(ch * TARGET_ASPECT)
    out = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    out.paste(card, ((tw - cw) // 2, (th - ch) // 2))
    out.save(dst)
    return im.size, box, out.size


if __name__ == '__main__':
    print(refine(sys.argv[1], sys.argv[2]))
