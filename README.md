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
| `screens/`           | The twelve app screenshots, in the order a trade moves through them. WebP q88 — 304 KB for all twelve, against 4.3 MB as PNG. |

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

## Responsiveness

The page is fluid rather than stepped — `clamp()` on type and gutters, so it
holds at every width instead of only at breakpoints someone happened to test.
Verified with no horizontal overflow from 320px to 1920px.

Two things to know before touching it:

- **The dc-runtime normalises the `style` attribute.** `min-width:340px` in the
  source is `min-width: 340px` in the DOM. The responsive layer overrides inline
  styles via `[style*="…"]` selectors, so any selector that includes a property
  name **must** be written against the spaced form or it silently does nothing.
  Value-only matches like `[style*="104px 32px"]` are safe either way.
- **The shell has `overflow-x: clip`**, which means overflow does not produce a
  scrollbar — it just quietly cuts content off. `document.scrollWidth` will read
  clean while the headline is being sliced in half. Check narrow widths visually;
  the metric will not tell you.

Gutters come from `--gut` (`clamp(16px, 4.4vw, 32px)`), applied to the section
padding shorthands. Below 680px the `auto-fit` grids collapse to one column,
because a track with a fixed `minmax()` minimum overflows once the viewport is
narrower than that minimum.

## The scroll-scrubbed background

`bg/f001.webp` … `bg/f050.webp` are 50 frames of the brand emblem forming,
scrubbed by scroll. They are blitted to a fixed full-viewport canvas behind
everything.

It is an image sequence rather than a `<video>` on purpose. Seeking a video on
every scroll event stalls badly on Safari and iOS; decoding stills once and
blitting them is what scroll-scrubbed product pages actually do. Adjacent frames
are crossfaded, which is what lets 50 stills read as continuous motion over a
page this tall.

**The frames ship exactly as supplied — nothing is keyed, tinted or re-graded.**
An earlier pass keyed the backdrop away to keep the page dark; that rewrote the
asset rather than using it, and was reverted.

Instead the *page* follows the footage. The clip runs from a dark stone wall to a
bright studio white, so the site crossfades to a light theme over the same
stretch. The scroll handler writes `--lit` (0 → 1) on `<html>`, and the ink and
glass tokens in `:root` are all functions of it via `color-mix()`. That is why no
section is hand-themed: change `--lit` and the whole page follows.

Anything hardcoded to a light colour is invisible once `--lit` reaches 1 and has
to be converted too. `color:#ffb08a` and the reel's ghosted step number were both
caught this way; check for new ones after adding markup near the bottom of the
page.

The closing CTA card frosts (`backdrop-filter`) in proportion to `--lit`, so the
copy reads against a surface while the emblem stays visible behind it rather than
being dimmed away.

### Entry

The hero is left clean. `--bg-vis` is driven from the scroll handler: the emblem
holds off through the first screen, eases in over the next half viewport on a
slight scale settle, and only starts scrubbing from there. Under
`prefers-reduced-motion` nothing is scrubbed — the last frame is drawn once at
full visibility.

**Legibility knobs**, all in the CSS:

| | Default | |
| --- | --- | --- |
| `.site-bg.is-ready canvas` opacity | `.72` | Presence of the emblem |
| `.site-bg-scrim` | radial | Protects the middle, where copy sits |
| `[data-step-left]`, `[data-step-right]`, `[data-over-art]` | `text-shadow` | Contrast for copy sitting directly over the glow |

**Pacing.** `EASE` in the background script (0.75) shapes scroll progress before
it maps to a frame. It is a mild lead, bringing the clip's dark-to-light turn
forward so the backdrop has resolved to white *before* the manual section starts
— that section is designed to be read on white. Keep it mild: heavy easing parks
the footage and reads as a stall rather than a pace. `EASE = 1` plays the clip
evenly across the page.

The burst is the brightest, busiest stretch of the clip and it passes behind a
copy-heavy section, so `vis` dips ~30% while it goes by and recovers after —
short enough not to register as the artwork being dimmed.

**The background is ambient, and that is a composition decision, not a
compromise.** The canvas runs at 0.40 opacity under a centre-weighted scrim. At
full strength the emblem is a large, high-contrast graphic sitting directly
behind body copy, and no amount of ink weight, halo or local field rescues that
— the page stops reading as a landing page and starts reading as artwork with
text on top. Copy is primary; the emblem is texture.

Halos and per-caption backing fields were both tried and both removed. They are
patches for a background that is too loud, and they look like patches.

The theme flips across a **narrow** band (`smoothstep(0.30, 0.37)`). A wide ramp
leaves a stretch of mid-grey copy over mid-tone artwork, which is the worst
combination on the page.

**Time `--lit` from the frames, never by eye.** Mean luminance climbs from 0.18
at p=0.24 to 0.72 by p=0.43, so the ramp is `smoothstep(0.24, 0.40)` — leading it
slightly, so copy has turned dark before the backdrop behind it turns light. It
was originally guessed at 0.62–0.78, which left roughly a third of the page
showing light text on a light background.

The reel reads `window.__omLit` to soften its caption fade. Dipping to 18%
between screens reads as a clean fade for light copy on a dark page; the same dip
for dark copy on white looks like broken low-contrast type rather than a
transition.

The manual section's captions and the closing CTA subhead are where text goes
unreadable first. Check both after any change.

### Re-encoding

Source is 50 × 3840×2160 PNG. Shipped as 2560×1636 WebP, 3.6 MB.

**Resolution is set by the canvas, not the viewport.** The canvas is sized
`innerWidth × devicePixelRatio`, so a 1440px retina viewport needs a 2880px
source. An earlier pass encoded at 1440w and the background looked soft for
exactly that reason — it was being upscaled 2×, and no amount of quality setting
fixes an upscale.

**Framing is baked into the crop, measured from the frames themselves.** The
artwork spans x 22.1–81.3% (centre 51.7%) and the generator's watermark sits at
88.8–92.5%. Cropping to x 14.6–88.8% therefore does two jobs at once: it drops
the watermark, and it puts the artwork's own centre at exactly 50%.

That matters because the alternative — cover-fit plus a pan to recentre — needs
a large zoom to give the pan any room, and on artwork that already fills 1.6–95.5%
of the frame height that zoom crops the emblem top and bottom. Centring in the
crop needs no zoom at all.

`ART_CX` / `ART_CY` / `ZOOM` in the draw are kept so framing stays tunable
without re-encoding; they are 0.5 / 0.485 / 1.0 for the current frames.

```bash
for i in $(seq -f "%03g" 1 50); do
  # crop to left 88%, resize to 2560w  (see scratchpad, PIL)
  cwebp -q 72 -m 6 -mt -quiet "/tmp/$i.png" -o "bg/f$i.webp"
done
```

Text over the light half carries a **white** halo, not a dark one — `--lit`
inverts the `text-shadow` along with the ink. Mid-grey body copy with a dark glow
on a light, busy backdrop is what makes type look smudged rather than set.

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
