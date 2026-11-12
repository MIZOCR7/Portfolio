# Portfolio — Ziad Emad

The personal site of **Ziad Emad Ahmed**, a Grade 12 student at STEM High School 6th of October, Egypt.
Built as a one-page portfolio and résumé: selected work, the grade-12 capstone case study, toolkit and timeline.

## Stack

- React 19 + TypeScript, built with Vite
- Plain CSS — no Tailwind and no animation libraries
- Motion is hand-built: a 3D dot-sphere drawn on one canvas, pointer tilt on the cards and portrait,
masked line reveals, clip-path image wipes and native scroll-driven parallax where supported
- Two self-hosted fonts: Instrument Serif and Inter Tight

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check + production build into dist/
```

## Editing content

Almost everything lives in `src/data.ts` — name, email, links, projects, capstone copy, toolkit and timeline.
Images sit in `public/img/` (swap a file, keep the name, and it updates).

## Printing the résumé

Press `Ctrl / ⌘ + P`, or the **PDF** button in the navigation. The stylesheet has a print layout that turns
the page into a clean one-page CV.
