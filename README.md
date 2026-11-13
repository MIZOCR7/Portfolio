# Ziad Emad — portfolio

A single-page editorial portfolio built for the Türkiye Bursları application, with METU as the
destination. React 19 + Vite + TypeScript, hand-written CSS, no animation framework.

```bash
npm install
npm run dev        # http://localhost:5173 (this project runs on :3000)
npm run build      # tsc -b && vite build → dist/
npm run preview
```

## Editing content

Every string, date and caption lives in **`src/data.ts`** — nothing is hard-coded in components.
Swap the values there and the page follows. That file is also the translation seam: replace the
strings in `data.ts` with Turkish text (or wrap the module in a locale map) and the layout, motion
and image treatment stay identical.

| Export | Used by |
| --- | --- |
| `PROFILE`, `LEDE`, `FACTS`, `MARQUEE`, `BAND` | hero, footer, marquee |
| `ABOUT` | 01 About |
| `FEATURE`, `PROJECTS`, `MINOR`, `STATS`, `CASE_COLUMNS` | 02 Work, 03 Capstone |
| `CERTIFICATES`, `ALSO_ON_FILE` | 04 the certificate wall |
| `ARCHIVE` | 05 visual archive |
| `METU` | 06 Why METU |
| `TOOLKIT`, `TIMELINE` | 07 toolkit, 08 journey |

Chapter numbers in section labels are plain text, so reordering sections means editing the
`kicker`/`label` strings only.

## Asset inventory

Originals are untouched in `D:\IMPORTANT\Admission\Certifications`. Every web image is regenerated
from them by `python tools/prepare-assets.py` (needs Pillow), which crops, resizes and compresses
into `public/img/`.

| Original | Web file | Where it is used |
| --- | --- | --- |
| `images and showcase stuff/my formal image.jpg` | `img/portrait.jpg` | hero portrait (cropped 4:5 above the studio watermark) |
| `images and showcase stuff/my best casual image with a suit.jpg` | `img/about.jpg` | 01 About |
| `images and showcase stuff/image of the METU univeristy…jpg` | `img/metu-sign.jpg` | 06 METU, full-bleed opener |
| `images and showcase stuff/METU's Stadium.jpg` | `img/metu-stadium.jpg` | 05 archive |
| `images and showcase stuff/METU logo.jpg` | `img/metu-logo.png` | 06 METU crest card — unmodified, aspect ratio preserved |
| `images and showcase stuff/pipe inspector demo.mp4` (58 MB, 70 s) | `img/pipe-demo.mp4` (4.5 MB, 640 px, no audio) | 03 Capstone, click-to-play |
| frame 4 s of the same video | `img/pipe-poster.jpg` | video poster |
| `Capstone project images for the new green house/*` | `img/archive/team.jpg`, `build-1…4.jpg` | 05 archive, `Sprout` cover |
| `images and showcase stuff/acpc1.jpg`, `acpc2.jpg` | `img/archive/contest-1.jpg`, `contest-2.jpg` | 05 archive |
| `images and showcase stuff/3D design of ISEF project (1).jpg`, `(4).jpg` | `img/archive/model-1.jpg`, `model-2.jpg` | 05 archive |
| `isef finalist/isef.jpg` | `img/certs/isef.jpg` | 02 Work card, 04 wall |
| `ACPC/*`, `Nasa Space Apps/*`, `Earth Prize/*`, `mal certification/*`, `Geology club/*`, `IBM/*` | `img/certs/{acpc,nasa,earth,mal,geo,ibm}.jpg` | 04 wall |
| `METU certification/Herkes_icin_Yapay_Zeka_I-Sertifika_485366.pdf` | `img/certs/metu-ai.jpg` | 04 wall, 06 METU evidence |
| `METU certification/Logo Similarity Study.PDF` | `img/certs/metu-study.jpg` | 04 wall, 06 METU evidence |
| `physics brawl/11016_en.pdf` | `img/certs/physics.jpg` | 04 wall |
| `قصر القفاقة/photo_2026-09-14_12-36-47.jpg` | `img/certs/culture.jpg` | 04 wall (programming instructor) |
| `Be My Eyes/…jpg`, `School House/*.pdf`, `Computer Network Fundamentals/*.pdf`, `AWS scholars/*.png` | — | listed as text in `ALSO_ON_FILE`, not published as images |
| `Doctor Sinan Kalkan…png` | — | **not published**: a third party's portrait, no consent on file |

Photos are served at ≤1400 px, progressive JPEG, `loading="lazy"` everywhere except the hero
portrait (`fetchPriority="high"`). Whole `public/img` folder is ~7 MB and only ~80 KB of it is
requested before the first scroll.

## Deploying

Vercel picks up `vercel.json` and `api/token.js` as-is.

1. `GEMINI_API_KEY` → Project → Settings → Environment Variables (needed by the Ada voice panel).
2. Redeploy. `POST /api/token` mints a short-lived Live API token; the browser never sees the key.
3. Without the key the panel stays closed and the endpoint answers `missing_key` — the page itself
   is fully functional.

`GEMINI_API_KEY` must never be committed. Locally it goes in `.env` (gitignored); use
`.env.example` as the template.

## What is not on the page, and why

- **CV download** — there is no CV PDF in the admissions folder, so the «One-page résumé» button
  prints the page (`window.print()`, print stylesheet included) instead of linking to a file that
  does not exist. Drop a `cv.pdf` into `public/` and point one anchor at it if you want a real file.
- **Phone number** — deliberately unpublished.
- **AWS Scholars screenshots** — three browser screenshots; not included as certificates because
  they do not show a completed credential.
- **Skill Up courses** — the folder holds a `.crdownload` (an unfinished download). No certificate
  exists to show.
- **Physics Brawl** — the diploma itself says it is *not* an official certificate of placement, so
  the caption repeats that.
- **METU campus photograph** — comes from your application folder; authorship is unconfirmed, so
  the credit line names the folder rather than claiming the photo. Replace it with your own the
  day you stand in front of that sign.
- **LinkedIn** — `linkedin.com/in/ziad-emad-470604400`, taken from the phone's profile export, not
  scraped. Verify it resolves.

## Structure

```
api/token.js            ephemeral Gemini Live token (server-side only)
src/data.ts             all content
src/App.tsx             chapter order
src/index.css           base design system
src/chapters.css        About, archive, viewer, METU, mobile menu
src/components/         Hero, About, Work, Capstone, Recognition, Archive,
                        Metu, Toolkit, Resume, Contact, Nav, Lightbox,
                        Companion, Cursor, DotSphere, TurkishFlag
src/hooks/              useReveal, useTilt, useLive
public/img/             every web image (regenerate with tools/prepare-assets.py)
public/fonts/           Instrument Serif + Inter Tight woff2, self-hosted
```
