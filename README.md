# Ziad Emad — desktop portfolio

An interactive macOS-style desktop: two folders (Projects and About Me) and an AI terminal that
answers questions about Ziad from the same content file that builds the site.

Built with React 19, Vite 8, Tailwind CSS 4 and a small Vercel function for Gemini.

```bash
npm install
npm run dev        # http://localhost:5173 (or the next free port)
npm run build      # static build → dist/
npm run preview    # serve the production build locally
```

## Editing content

All copy, projects, certifications, honors, experience, photos, links, the music library and the
terminal's knowledge live in **`src/config.js`**. Components read from that object, so editing a
project, certificate or track updates the desktop, folders, Spotlight, Launchpad, résumé and the
agent together.

## Music

The **Music** icon in the Dock opens a macOS Music-style window: Listen Now, Songs, Albums, playlists,
search, favourites, a working transport with seek/volume/shuffle/repeat, and an Up Next queue. The
three tracks are original instrumentals made for this desktop, stored in `public/media/music/` with
their cover art, so the player needs no external audio service and no third-party licence.

## The AI terminal

The desktop terminal sends free-text questions to `/api/chat`, a server-side Vercel function that
calls Gemini with the full portfolio as context. `/help` lists the shell commands; `/clear` resets
the screen.

`/live` starts a real **Gemini Live** voice call. The browser asks for the microphone, streams
16 kHz PCM to Gemini, and plays the 24 kHz voice answer while the terminal draws the audio as a
moving waveform. You can speak, interrupt, or type; `/exit` ends the call. The browser never sees
the API key: `/api/live` mints a one-use ephemeral token that is already locked to the model, the
`Charon` voice, audio output, and Ziad's full profile. The Live socket is opened directly from the
browser to Google.

The key must never be committed or shipped to the browser. Locally it goes in `.env` (gitignored):

```bash
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.1-flash-lite       # optional, text terminal
GEMINI_LIVE_MODEL=gemini-3.8-live        # optional, voice call
GEMINI_LIVE_VOICE=Charon                 # optional
```

Add the same `GEMINI_API_KEY` in **Vercel → Project → Settings → Environment Variables** for the
live deployment, then redeploy. Without a key the terminal says so and answers from the local
profile instead, so the site never breaks. The microphone needs HTTPS (or localhost), so use the
deployed URL or `npm run dev` when testing a call.

## Structure

```
src/config.js            all site content, folders, certificates, honors, agent profile
src/desktop/Desktop.jsx  desktop state, folders, windows, icons, keyboard shortcuts
src/components/          MenuBar, Dock, Spotlight, Launchpad, ControlCenter,
                         Window, DesktopIcon, ClockWidget, Media
src/apps/                Folder, Project, About, Certifications, Honors, Experience,
                         Skills, Notes, Photos, Music, Social, Contact, Resume,
                         Terminal, Viewer, Shortcuts
src/lib/                 local agent fallback, text API client and Live audio client
server/agent.js          Gemini prompt, model call and error handling
server/live.js           Live system prompt, voice config and ephemeral token minting
api/chat.js              Vercel function (GET status, POST question)
api/live.js              Vercel function (GET status, POST one-use Live token)
public/images/           macOS wallpapers, folder, Terminal and app icons
public/icons/            GitHub, LinkedIn, Instagram and mail glyphs
public/cursors/          macOS Tahoe arrow, hand and I-beam cursors (MIT)
public/media/            project photos, certificate scans, the Pipe Inspector clip
public/media/music/      original Desk Sessions instrumentals and cover art
```

The site uses the macOS Tahoe cursor set from `dazham/MacOS-Cursors-on-Windows` (MIT) throughout the
desktop, including a custom I-beam in text fields and a pointing hand on links. The licence is kept
in `public/cursors/LICENSE.txt`.

There is no database. The résumé window is printable HTML (“Print / Save PDF”); no PDF file is
fabricated.

## Deployment

The live site is deployed on Vercel from `main` at
[portfolio-2kkf.vercel.app](https://portfolio-2kkf.vercel.app). Pushing to `main` triggers a
production build. Set `GEMINI_API_KEY` in Vercel for the AI terminal; no other environment
variables are required.
