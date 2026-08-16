# Om Shri Hari Trading — Landing Page

Marketing site for **Om Shri Hari Trading Pvt Ltd**, a voice-first ordering app for
agricultural commodity trading. Traders speak an order in Hindi or English and it
becomes a purchase order — with every truck, paper and payment date tracked.

Imported from the Claude Design project *Liquid theme redesign*
(`Landing Page v3 dark.dc.html`).

## Running locally

Any static file server works — there is no build step.

```bash
python3 -m http.server 8787
```

Then open <http://localhost:8787>.

Opening `index.html` over `file://` will **not** work: the runtime fetches
`flying-posters.jsx` with `fetch()`, which browsers block on the file protocol.

## Deploying

There is no build step, so any static host serves this directly from the repo root.

- **Netlify** — connect the repo; `netlify.toml` already sets the publish directory,
  so leave the build command empty.
- **Vercel** — connect the repo and pick the "Other" framework preset. No config needed.

## Layout

| Path                 | Purpose |
| -------------------- | ------- |
| `index.html`         | The whole page. Content, styles and page logic. |
| `support.js`         | Claude Design `dc-runtime`. Parses `<x-dc>`, hoists `<helmet>` into `<head>`, resolves `{{ }}` bindings, and transpiles `<x-import>` components. Generated — do not edit. |
| `flying-posters.jsx` | WebGL poster reel for the "all twelve screens" section. Adapted from React Bits so the page's own scroll drives it instead of hijacking the wheel. See [The user manual reel](#the-user-manual-reel). |
| `screens/`           | The twelve app screenshots, in the order a trade moves through them. |

## How the page is built

`index.html` is a Claude Design document, not plain HTML. `support.js` loads first and
then, at runtime in the browser:

1. reads the `<x-dc>` element's markup as a template;
2. hoists `<helmet>` into `<head>` (fonts, CSS custom properties, scroll-reveal script);
3. runs the `<script type="text/x-dc">` class at the bottom of the file — it holds the
   English and Hindi copy, the language toggle and the accent-colour theming, and
   exposes them as the `{{ }}` bindings used throughout the markup;
4. transpiles and mounts `<x-import>` components such as `FlyingPosters`.

To change copy, edit the `EN` and `HI` objects near the bottom of `index.html`.

## The scroll-scrubbed background

`bg/f001.webp` … `bg/f050.webp` are 50 frames of the brand emblem lighting up,
scrubbed by scroll position across the whole page: the top of the page is the
dark wall, the bottom is the emblem fully resolved. They are blitted to a fixed
full-viewport canvas behind everything.

It is an image sequence rather than a `<video>` on purpose. Seeking a video on
every scroll event stalls badly on Safari and iOS; decoding stills once and
blitting them is what scroll-scrubbed product pages actually do.

Adjacent frames are crossfaded, which is what lets 50 stills read as continuous
motion over a page this tall — without it the steps are obvious.

Loading is deliberately lazy: it waits for `load` and then an idle callback, so
the background never competes with content for bandwidth. Frame 1 lands first and
the rest stream in six at a time; scrubbing works throughout, falling back to the
nearest decoded frame rather than flashing empty.

**Legibility is the thing to watch when tuning.** Two knobs, both in the CSS:

| | Default | |
| --- | --- | --- |
| `.site-bg.is-ready canvas` opacity | `.58` | Overall presence of the emblem |
| `.site-bg-scrim` | radial + linear | Darkens the middle, where the copy sits |

Raising the opacity past roughly `.7` starts to cost contrast on the manual
section's captions. Check that section specifically after any change — it is the
first place text becomes hard to read.

Under `prefers-reduced-motion` the sequence is not scrubbed at all: the last
frame is drawn once, statically.

### Re-encoding the frames

Source was 50 × 3840×2160 PNG, 206 MB. Shipped as 1440×810 WebP at q66, 1.9 MB:

```bash
for i in $(seq -f "%03g" 1 50); do
  sips -Z 1440 "src/ezgif-frame-$i.png" --out "/tmp/$i.png"
  cwebp -q 66 -m 6 -mt -quiet "/tmp/$i.png" -o "bg/f$i.webp"
done
```

## The hero device mockup

Two devices float at a shared angle, staged the way a product mockup render would
stage them — but as live markup, not a flattened export. Each crossfades through
its own three screens every 2.8s, on opposite beats, so the pair is never showing
the same thing. They use the same files in `screens/` the manual section does, so
a screenshot only ever has to be updated in one place. Cycling stops while the
hero is off screen, and holds on one screen under `prefers-reduced-motion`.

Below 1080px the back device is dropped and the front one straightens out: a
rotated element's axis-aligned box is wider than the element, so the steep desktop
angle would push it past a narrow viewport.

Two things to know before editing the tilt:

- The drift animation uses the independent `translate` property, **not**
  `transform`. `transform` already carries the tilt, and a keyframe writing
  `transform` replaces it outright rather than composing with it.
- The side buttons hang on `.hero-phone`, not `.hero-phone-frame`. The frame
  masks away everything but its own ring, which would erase them.

The bezel is drawn in CSS so the hero needs no image asset. **To swap in an
exported Figma frame:**

1. In Figma, hide or delete the placeholder screenshot inside the frame, so the
   screen aperture exports transparent. Export the frame as PNG @3x (or SVG if it
   is vector) to `assets/phone-frame.png`.
2. On each `[data-hero-phone]` in `index.html`, add the `data-frame-image`
   attribute and set three custom properties to match the exported frame:

   ```html
   <div class="hero-phone hero-phone--front" data-hero-phone data-frame-image
        style="--frame-src:url(assets/phone-frame.png);--bezel:14px;--screen-r:44px">
   ```

   `--bezel` is the frame thickness around the aperture and `--screen-r` its
   corner radius, both at the size the phone renders (~230px wide by default).

That is the whole change: the CSS rail and the drawn Dynamic Island switch off on
their own, and the tilt, drift and crossfade are untouched. If the aperture does
not line up, adjust `--bezel` and `--screen-r` — nothing else is involved.

Export the frame **flat and straight-on**, not at an angle. The tilt is applied in
CSS, so an already-angled export would be tilted twice.

To change which screens appear, edit the `[data-hero-shot]` list inside a phone;
any number of images works, and the first carries `class="is-on"`.

## The user manual reel

The twelve screenshots are one WebGL reel, and the section is built so a reader
can actually read them. Everything is driven from one number: each card's signed
distance from the centre of the reel, measured in slots (`0` is dead centre, `±1`
is one card away). Rotation, opacity and the caption all read from that, so they
can never drift out of sync with each other.

Scroll progress runs through a **staircase**: each screen parks dead centre and
holds there for `hold` of its share of the track, then travels to the next one.
While a card is parked it sits at distance `0`, which means it is perfectly flat,
undistorted and still — and its caption is at full opacity — for as long as it
takes to read. The turn happens between screens, not under them.

Tune it with the props on the `<x-import>` in `index.html`:

| Prop         | Default | Effect |
| ------------ | ------: | ------ |
| `hold`       |  `0.46` | Share of each screen's scroll spent parked. Raise to linger longer. |
| `dwell`      |   `0.1` | How far a card can drift from centre before it starts tilting. |
| `turn-end`   |   `0.8` | Distance at which the tilt has reached its maximum. |
| `max-turn`   |  `0.42` | Ceiling on the tilt, in half-turns. **Keep below `0.5`** — at `0.5` the card is edge-on, and past it the reader sees the mirrored back face with the copy running backwards. |
| `gap`        |  `0.05` | Clearance between cards, as a share of viewport height. Larger values leave more empty frame mid-transition. |
| `distortion` |   `2.2` | Twist applied during the turn only. Peaks mid-turn and is zero whenever the card is legible. |
| `scroll-ease`| `0.085` | Lerp toward the scroll target. Lower is smoother and lazier. |

Pacing is set by the track height in `index.html` — `[data-manual-track]` is
`calc(100vh + 5040px)`, i.e. about 420px of scroll per screen. Shorten it to
speed the section up, lengthen it to slow it down; nothing else needs to change.

The live instance is exposed as `window.__reel` for tuning from the console.

### Third-party dependencies

All are loaded from a CDN at runtime; nothing is vendored.

- **React 18.3.1, ReactDOM, Babel Standalone** — unpkg, pulled in by `support.js`.
- **ogl 1.0.11** — unpkg, WebGL library behind the poster reel.
- **Google Fonts** — Plus Jakarta Sans and Noto Sans Devanagari.
The hero device is plain CSS and needs no WebGL. The poster reel does; where it is
unavailable the section falls back to the static screenshot list.

## Accessibility and motion

Every reveal animation is gated behind `prefers-reduced-motion`. With it set, content
renders in place with no transitions and the poster reel is replaced by a plain
vertical list of the screenshots (also used below 820px wide).
