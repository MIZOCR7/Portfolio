# Haldoren — Motion Design Portfolio

A one-screen portfolio hero: a photographic studio scene, a giant HALDOREN wordmark behind the
subject, a hanging lanyard card, and a scroll-driven dive into the open laptop that lands on a
case video framed by a punched paper ticket.

Everything ships in **`index.html`** — inline CSS and JS, no frameworks, no build step, no local
assets. The three Google Fonts (Inter Tight variable, Anton, Caveat Brush) are embedded as base64
`data:font/woff2` URIs; photography and video are loaded from their original CDN URLs.

## Run

Open `index.html` directly, or serve the folder:

```bash
python -m http.server 4173
# http://127.0.0.1:4173/index.html
```

`npm run dev` (Vite) still serves `index.html` if you prefer a dev server; no bundling is involved.

## Behaviour

- The page never scrolls (`html, body { height:100%; overflow:hidden }`). Wheel, touch, keyboard
  and clicks are captured and drive the three modes: hero → laptop dive → case.
- Hero depth is built from a 1440×810 unit "frame" that is transformed into place with one
  `translate() scale()` (top-anchored hero, fitted case), with masks that fade the layer edges.
- The dive plays a 5.04 s Kling clip at an eased playback rate (≈1.7 s), then hands its last frame
  to the matching still so the swap is invisible. The transition clip is fetched into a Blob at
  load because the source has a single keyframe and streaming seeks stall.
- Three case videos sit inside the laptop display (`object-fit:contain`, one playing at a time),
  with the ticket, description and prev/next controls animating in and out around them.
- "my studio" (or prev on the first case) eases back to the hero with a blurred zoom-out reveal.
- Below 820 px the layout switches to a centred, bottom-anchored subject with a fixed UI layer
  (wordmark, handwriting and badge are duplicated there), and the case UI stacks above the laptop.
- `prefers-reduced-motion: reduce` removes all animation and the dive becomes an instant cut.

## Assets

Loaded at runtime, unmodified, from their source URLs:

- hero photo, laptop case photo, cutout, lanyard and the transition clip —
  `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/…`, with images routed
  through the `images.higgs.ai` wrapper (`?default=1&output=webp&url=…&w=2048&q=85`).
- case previews `vell-lookbook.mp4`, `vasari-vhs-hero.mp4`, `living-portrait-hero.mp4` —
  `https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/`.

All names (Haldoren, Vell, Vasari, Mina) are fictional.

## Note on the old build

The earlier React/Vite portfolio sources (`src/`, `api/`, `public/`, `vite.config.ts`, …) are still
in the tree but are no longer referenced by `index.html`. The site itself is the single file.
