# Portfolio — Ziad Emad

The personal site of **Ziad Emad Ahmed Metwally Salem** — Grade 12 at STEM High School 6th of October,
ISEF finalist 2026, and an applicant for Computer Engineering at METU on a Türkiye Bursları scholarship.

One page: selected work, the pipe-inspector capstone, a wall of framed certificates, an Ankara chapter,
the toolkit, a résumé timeline, contact — and **Ada**, a voice guide powered by the Gemini Live API.

## Stack

- React 19 + TypeScript, built with Vite
- Plain CSS — no Tailwind and no animation libraries
- Motion is hand-built: a 3D dot-sphere on one canvas, pointer tilt on cards and portrait, masked line
  reveals, clip-path image wipes, native scroll-driven parallax, custom cursor and scroll progress
- Self-hosted fonts: Instrument Serif and Inter Tight

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check + production build into dist/
```

## Ada, the voice assistant

Ada talks to visitors about the capstone, the awards and the METU plan. She needs a Gemini API key, held
**server-side only** — the browser never receives it, only a short-lived token.

1. Copy `.env.example` to `.env` and set `GEMINI_API_KEY=...` (a key with Live API access).
2. `npm run dev` — the Vite dev server exposes `POST /api/token` locally.
3. On Vercel, add `GEMINI_API_KEY` in **Project → Settings → Environment Variables**, then redeploy. The
   production endpoint is `api/token.js`.

If the key is missing the panel still opens and explains what to do; nothing else on the page depends on it.
`VITE_GEMINI_LIVE_MODEL` overrides the model name (default `gemini-3.8-live`).

## Editing content

Almost everything lives in `src/data.ts` — profile, projects, certificates, the Ankara copy, toolkit and
timeline. Images sit in `public/img/` and `public/img/certs/`.

## Printing the résumé

Press `Ctrl / ⌘ + P`, or the **PDF** button in the navigation. The print stylesheet strips the wall, the
Ankara chapter and the assistant, and turns the page into a clean one-page CV.

## Credits

Campus photographs of METU are from Wikimedia Commons under their free licences and are used as
placeholders for a campus Ziad has not visited yet.
