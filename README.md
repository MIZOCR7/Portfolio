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

All copy, projects, certifications, honors, experience, photos, links and the terminal's knowledge
live in **`src/config.js`**. Components read from that object, so editing a project or certificate
updates the desktop, folders, Spotlight, Launchpad, résumé and the agent together.

## The AI terminal

The desktop terminal sends free-text questions to `/api/chat`, a server-side Vercel function that
calls Gemini with the full portfolio as context. `/help` lists the shell commands; `/live` starts a
back-and-forth conversation; `/clear` resets the screen.

The key must never be committed or shipped to the browser. Locally it goes in `.env` (gitignored):

```bash
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.1-flash-lite   # optional
```

Add the same `GEMINI_API_KEY` in **Vercel → Project → Settings → Environment Variables** for the
live deployment, then redeploy. Without a key the terminal says so and answers from the local
profile instead, so the site never breaks.

## Structure

```
src/config.js            all site content, folders, certificates, honors, agent profile
src/desktop/Desktop.jsx  desktop state, folders, windows, icons, keyboard shortcuts
src/components/          MenuBar, Dock, Spotlight, Launchpad, ControlCenter,
                         Window, DesktopIcon, ClockWidget, Media
src/apps/                Folder, Project, About, Certifications, Honors, Experience,
                         Skills, Notes, Photos, Social, Contact, Resume, Terminal,
                         Viewer, Shortcuts
src/lib/                 local agent fallback and the API client
server/agent.js          Gemini prompt, model call and error handling
api/chat.js              Vercel function (GET status, POST question)
public/images/           macOS wallpapers, folder, Terminal and app icons
public/icons/            GitHub, LinkedIn, Instagram and mail glyphs
public/media/            project photos, certificate scans and the Pipe Inspector clip
```

There is no database. The résumé window is printable HTML (“Print / Save PDF”); no PDF file is
fabricated.

## Deployment

The live site is deployed on Vercel from `main` at
[portfolio-2kkf.vercel.app](https://portfolio-2kkf.vercel.app). Pushing to `main` triggers a
production build. Set `GEMINI_API_KEY` in Vercel for the AI terminal; no other environment
variables are required.
