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
- **`embed.mckp.live`** — the `<mockup-player>` element in the hero, which plays the
  interactive app mockup. Third-party; the hero degrades to empty space without it.

Both the hero mockup and the poster reel need WebGL. Browsers without it show a
fallback message rather than the animation.

## Accessibility and motion

Every reveal animation is gated behind `prefers-reduced-motion`. With it set, content
renders in place with no transitions and the poster reel is replaced by a plain
vertical list of the screenshots (also used below 820px wide).
