# Ziad Emad — desktop portfolio

An interactive macOS-style desktop portfolio for Ziad Emad: real macOS app icons, macOS wallpapers,
draggable windows, a magnifying dock, Spotlight, Launchpad and project apps. Every project, note,
photo and certificate lives in one content file.

Built with React 19, Vite 8 and Tailwind CSS 4.

```bash
npm install
npm run dev        # http://localhost:5173 (or the next free port)
npm run build      # static build → dist/
npm run preview    # serve the production build locally
```

## Editing content

All copy, projects, links, certificates, photos and window copy live in **`src/config.js`**.
Components read from that object, so changing a project name, image path or URL updates the desktop,
Spotlight, Launchpad and the project window together.

## Structure

```
src/config.js            all site content and project data
src/desktop/Desktop.jsx  desktop state, windows, icons, keyboard shortcuts
src/components/          MenuBar, Dock, Spotlight, Launchpad, ControlCenter,
                         Window, DesktopIcon, ClockWidget, Media
src/apps/                Work, Project, About, Notes, Photos, Social,
                         Contact, Resume, Terminal, Viewer, Shortcuts
public/images/           macOS wallpapers and app icons
public/icons/            GitHub, LinkedIn and mail glyphs
public/media/            project photos, certificate scans and the Pipe Inspector clip
```

There is no backend, database or environment variable. The résumé window is printable HTML
(“Print / Save PDF”); no PDF file is fabricated.

## Deployment

The live site is deployed on Vercel from `main` at
[portfolio-2kkf.vercel.app](https://portfolio-2kkf.vercel.app). Pushing to `main` triggers a
production build (`npm run build`); no environment variables are required.
