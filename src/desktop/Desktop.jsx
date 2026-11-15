import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { CONFIG, appWindows } from '../config'
import { useClock, useMotionPreference, useStored, useViewport } from '../lib/hooks'
import MenuBar from '../components/MenuBar'
import Dock from '../components/Dock'
import ClockWidget from '../components/ClockWidget'
import DesktopIcon from '../components/DesktopIcon'
import Window from '../components/Window'
import Launchpad from '../components/Launchpad'
import Spotlight from '../components/Spotlight'
import ControlCenter from '../components/ControlCenter'
import Folder from '../apps/Folder'
import Project from '../apps/Project'
import About from '../apps/About'
import Certifications from '../apps/Certifications'
import Honors from '../apps/Honors'
import Experience from '../apps/Experience'
import Skills from '../apps/Skills'
import Notes from '../apps/Notes'
import Photos from '../apps/Photos'
import Social from '../apps/Social'
import Contact from '../apps/Contact'
import Resume from '../apps/Resume'
import Terminal from '../apps/Terminal'
import Viewer from '../apps/Viewer'
import Shortcuts from '../apps/Shortcuts'

const MENU_H = 30

export default function Desktop() {
  const viewport = useViewport()
  const liveWidth = typeof window !== 'undefined' ? window.innerWidth : viewport.w
  const mobile = Math.min(viewport.w, liveWidth) <= 760
  const compactIcons = Math.min(viewport.w, liveWidth) <= 1100
  const systemReduce = useMotionPreference()

  const [theme, setTheme] = useStored('ziad-theme', 'light')
  const [wallpaperId, setWallpaperId] = useStored('ziad-wallpaper', CONFIG.defaultWallpaper)
  const [motionOff, setMotionOff] = useStored('ziad-motion-off', false)
  const [dockSize, setDockSize] = useStored('ziad-dock-size', 58)
  const [layout, setLayout] = useStored('ziad-desk-layout-v2', {})
  const reduce = motionOff || systemReduce

  const [windows, setWindows] = useState([])
  const [selected, setSelected] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [launchpad, setLaunchpad] = useState(false)
  const [spotlight, setSpotlight] = useState(false)
  const [control, setControl] = useState(false)
  const [toast, setToast] = useState('')
  const [area, setArea] = useState({ w: 1200, h: 700 })

  const zRef = useRef(1000)
  const toastTimer = useRef(0)
  const openers = useRef(new Map())
  const wallpaperRef = useRef(null)
  const areaRef = useRef(null)

  const clock = useClock(CONFIG.site.timezone)
  const wallpaper = CONFIG.wallpapers.find(w => w.id === wallpaperId) || CONFIG.wallpapers[0]

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduce)
  }, [reduce])

  useLayoutEffect(() => {
    const measure = () => {
      const el = areaRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setArea(prev =>
        Math.abs(prev.w - r.width) < 0.5 && Math.abs(prev.h - r.height) < 0.5
          ? prev
          : { w: r.width, h: r.height }
      )
    }
    measure()
    window.addEventListener('resize', measure)
    const el = areaRef.current
    let ro
    if (el && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure)
      ro.observe(el)
    }
    return () => {
      window.removeEventListener('resize', measure)
      ro?.disconnect()
    }
  }, [mobile])

  useEffect(() => {
    if (reduce || mobile) return
    let raf = 0
    let tx = 0
    let ty = 0
    const apply = () => {
      raf = 0
      if (wallpaperRef.current)
        wallpaperRef.current.style.transform = `scale(1.045) translate3d(${tx}px, ${ty}px, 0)`
    }
    const onMove = e => {
      if (document.hidden) return
      tx = (e.clientX / window.innerWidth - 0.5) * -12
      ty = (e.clientY / window.innerHeight - 0.5) * -8
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
      if (wallpaperRef.current) wallpaperRef.current.style.transform = 'scale(1.04)'
    }
  }, [reduce, mobile])

  const notify = useCallback(message => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2600)
  }, [])

  const focus = useCallback(key => {
    setWindows(prev =>
      prev.map(w => (w.key === key ? { ...w, minimized: false, z: ++zRef.current } : w))
    )
  }, [])

  const open = useCallback(
    (app, data) => {
      const conf = appWindows[app]
      if (!conf) return
      const key =
        app === 'folder'
          ? `folder:${data}`
          : app === 'project'
            ? `project:${data}`
            : app === 'viewer'
              ? `viewer:${data?.src}`
              : app

      setWindows(prev => {
        const found = prev.find(w => w.key === key)
        if (found)
          return prev.map(w =>
            w.key === key ? { ...w, minimized: false, z: ++zRef.current } : w
          )
        const project = app === 'project' ? CONFIG.projects.find(p => p.id === data) : null
        const folder = app === 'folder' ? CONFIG.folders[data] : null
        const width = Math.min(conf.w, viewport.w - 24)
        const height = Math.min(conf.h, viewport.h - MENU_H - 92)
        const n = prev.length % 5
        openers.current.set(key, document.activeElement)
        return [
          ...prev,
          {
            key,
            app,
            title:
              app === 'project'
                ? project?.title || 'Project'
                : app === 'folder'
                  ? folder?.title || 'Finder'
                  : app === 'viewer'
                    ? data?.title || 'Preview'
                    : conf.title,
            data,
            x: Math.max(8, Math.round((viewport.w - width) / 2 + (n - 2) * 28)),
            y: Math.max(MENU_H + 8, 44 + n * 24),
            w: width,
            h: height,
            z: ++zRef.current,
            minimized: false,
          },
        ]
      })
      setLaunchpad(false)
      setSpotlight(false)
    },
    [viewport.w, viewport.h]
  )

  const launch = useCallback(
    target => {
      if (typeof target === 'string' && target.startsWith('project:'))
        return open('project', target.slice(8))
      if (typeof target === 'string' && target.startsWith('folder:'))
        return open('folder', target.slice(7))
      return open(target)
    },
    [open]
  )

  const close = useCallback(key => {
    setWindows(prev => {
      const next = prev.filter(w => w.key !== key)
      const opener = openers.current.get(key)
      openers.current.delete(key)
      window.requestAnimationFrame(() => {
        if (opener && document.contains(opener) && !opener.disabled)
          opener.focus?.({ preventScroll: true })
        else {
          const top = [...next].filter(w => !w.minimized).sort((a, b) => b.z - a.z)[0]
          if (top) document.querySelector(`[data-window="${CSS.escape(top.key)}"]`)?.focus?.()
          else document.querySelector('[aria-label="Dock"] button')?.focus?.()
        }
      })
      return next
    })
  }, [])

  const minimize = useCallback(key => {
    setWindows(prev => {
      const next = prev.map(w => (w.key === key ? { ...w, minimized: true } : w))
      const top = [...next].filter(w => !w.minimized).sort((a, b) => b.z - a.z)[0]
      window.requestAnimationFrame(() => {
        if (top) document.querySelector(`[data-window="${CSS.escape(top.key)}"]`)?.focus?.()
        else document.querySelector('[aria-label="Dock"] button')?.focus?.()
      })
      return next
    })
  }, [])

  const topWindow = useMemo(
    () => windows.filter(w => !w.minimized).sort((a, b) => b.z - a.z)[0],
    [windows]
  )

  const toggleApp = useCallback(
    (id, item) => {
      const app = item?.app || id
      const key = item?.windowKey || (app === 'folder' ? `folder:${item?.data}` : app)
      const existing = windows.find(w => w.key === key)
      if (existing) {
        if (existing.minimized) focus(existing.key)
        else if (topWindow?.key === existing.key) minimize(existing.key)
        else focus(existing.key)
      } else {
        if (app === 'folder') open('folder', item?.data)
        else open(app)
      }
    },
    [windows, topWindow, focus, minimize, open]
  )

  const openItem = useCallback(
    id => {
      const item = CONFIG.desktopItems.find(i => i.id === id)
      if (!item) return
      if (item.type === 'folder') open('folder', item.folder)
      else if (item.type === 'terminal') open('terminal')
    },
    [open]
  )

  const resetLayout = useCallback(() => {
    setLayout({})
    setSelected(null)
    try {
      window.localStorage.removeItem('ziad-desk-layout-v2')
    } catch {
      /* ignore */
    }
    notify(CONFIG.desktop.resetNote)
  }, [setLayout, notify])

  const nextWallpaper = useCallback(() => {
    const i = CONFIG.wallpapers.findIndex(w => w.id === wallpaper.id)
    const next = CONFIG.wallpapers[(i + 1) % CONFIG.wallpapers.length]
    setWallpaperId(next.id)
    notify(`Wallpaper: ${next.label}`)
  }, [wallpaper.id, setWallpaperId, notify])

  const running = useMemo(() => windows.map(w => w.key), [windows])

  useEffect(() => {
    const onKey = e => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setSpotlight(v => !v)
        return
      }
      if (meta && e.code === 'Space') {
        e.preventDefault()
        setSpotlight(v => !v)
        return
      }
      if (meta && (e.key === 't' || e.key === 'T')) {
        e.preventDefault()
        open('terminal')
        return
      }
      if (meta && e.key === '1') {
        e.preventDefault()
        open('folder', 'projects')
        return
      }
      if (meta && e.key === '2') {
        e.preventDefault()
        open('contact')
        return
      }
      if (meta && (e.key === 'w' || e.key === 'W') && topWindow) {
        e.preventDefault()
        close(topWindow.key)
        return
      }
      if (meta && (e.key === 'm' || e.key === 'M') && topWindow) {
        e.preventDefault()
        minimize(topWindow.key)
        return
      }
      if (e.key === 'F4') {
        e.preventDefault()
        setLaunchpad(v => !v)
        return
      }
      if (e.key === 'Escape') {
        if (launchpad) return setLaunchpad(false)
        if (spotlight) return setSpotlight(false)
        if (control) return setControl(false)
        if (topWindow) return close(topWindow.key)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [topWindow, launchpad, spotlight, control, close, minimize, open])

  const positions = useMemo(() => {
    const out = {}
    CONFIG.desktopItems.forEach(item => {
      out[item.id] = layout[item.id] || CONFIG.iconSeeds[item.id] || { x: 0.1, y: 0.1 }
    })
    return out
  }, [layout])

  const openLink = href => {
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const renderApp = win => {
    if (win.app === 'folder') {
      return (
        <Folder
          folderId={win.data}
          mobile={mobile}
          onOpenProject={id => open('project', id)}
          onOpenApp={app => open(app)}
          onOpenFolder={id => open('folder', id)}
          onView={item => open('viewer', item)}
          onLink={openLink}
        />
      )
    }
    if (win.app === 'project') {
      const project = CONFIG.projects.find(p => p.id === win.data)
      return project ? <Project project={project} onView={item => open('viewer', item)} /> : null
    }
    if (win.app === 'about') return <About onOpenApp={app => open(app)} />
    if (win.app === 'certifications')
      return <Certifications onView={item => open('viewer', item)} />
    if (win.app === 'honors') return <Honors onView={item => open('viewer', item)} />
    if (win.app === 'experience')
      return <Experience onOpenApp={app => open(app)} />
    if (win.app === 'skills') return <Skills onOpenApp={app => open(app)} />
    if (win.app === 'notes') return <Notes />
    if (win.app === 'photos') return <Photos onView={item => open('viewer', item)} />
    if (win.app === 'social') return <Social onLink={openLink} />
    if (win.app === 'contact') return <Contact onCopy={notify} />
    if (win.app === 'resume') return <Resume />
    if (win.app === 'terminal') {
      return (
        <Terminal
          onOpenProject={id => open('project', id)}
          onOpenApp={app => open(app)}
          onOpenFolder={id => open('folder', id)}
          onLink={openLink}
        />
      )
    }
    if (win.app === 'viewer') return <Viewer item={win.data} />
    if (win.app === 'shortcuts') return <Shortcuts />
    return null
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#1a1d21]">
      <img
        ref={wallpaperRef}
        key={wallpaper.src}
        src={wallpaper.src}
        alt=""
        aria-hidden="true"
        className="wallpaper-img"
        fetchPriority="high"
        draggable={false}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30"
        aria-hidden="true"
      />

      <MenuBar
        clock={clock}
        onOpen={open}
        onSpotlight={() => setSpotlight(true)}
        onControlCenter={() => setControl(v => !v)}
        controlOpen={control}
        theme={theme}
        setTheme={setTheme}
        motionOff={motionOff}
        setMotionOff={setMotionOff}
        onReset={resetLayout}
        onNextWallpaper={nextWallpaper}
        windows={windows}
        onFocus={focus}
        onCloseTop={() => topWindow && close(topWindow.key)}
        onMinimizeTop={() => topWindow && minimize(topWindow.key)}
        compact={mobile}
      />

      <div className="pointer-events-none absolute bottom-[112px] left-6 z-[4] hidden max-w-[340px] select-none rounded-[18px] border border-white/20 bg-black/25 p-4 text-white shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl lg:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
          Portfolio · 2026
        </p>
        <h1 className="mt-1 text-[36px] font-semibold leading-none tracking-[-0.035em] drop-shadow-sm">
          {CONFIG.site.name}
        </h1>
        <p className="mt-1.5 text-[12px] font-medium text-white/80">{CONFIG.site.role}</p>
        <p className="mt-2 max-w-[30ch] text-[12px] italic leading-snug text-white/65">
          {CONFIG.site.tagline}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-white/25 bg-white/10 px-2 py-[2px] text-[10px] font-semibold">
            {CONFIG.site.status}
          </span>
          <span className="text-[10.5px] text-white/60">{CONFIG.site.location}</span>
        </div>
        <p className="mt-2.5 text-[10.5px] leading-relaxed text-white/55">{CONFIG.desktop.hint}</p>
      </div>

      <div className="pointer-events-none absolute left-4 top-[calc(40px+env(safe-area-inset-top,0px))] z-[4] max-w-[270px] select-none text-white min-[760px]:hidden">
        <h1 className="text-[28px] font-semibold leading-none tracking-[-0.035em] drop-shadow">
          {CONFIG.site.name}
        </h1>
        <p className="mt-1 text-[11.5px] font-medium text-white/80">{CONFIG.site.role}</p>
        <span className="mt-2 inline-block rounded-full border border-white/25 bg-black/25 px-2 py-[2px] text-[10px] font-semibold backdrop-blur-md">
          {CONFIG.site.status}
        </span>
      </div>

      <ClockWidget clock={clock} />

      {!mobile ? (
        <div
          ref={areaRef}
          data-desk-area
          aria-label="Desktop folders and AI terminal"
          className="absolute inset-x-0 bottom-[104px] top-[36px] z-[6]"
          onClick={e => {
            if (e.target === e.currentTarget) setSelected(null)
          }}
        >
          {CONFIG.desktopItems.map(item => (
            <DesktopIcon
              key={item.id}
              item={item}
              position={positions[item.id]}
              area={area}
              compact={false}
              small={compactIcons}
              selected={selected === item.id}
              dragging={dragging === item.id}
              onSelect={setSelected}
              onOpen={openItem}
              onMove={(id, pos) => setLayout(prev => ({ ...prev, [id]: pos }))}
              onDragState={setDragging}
            />
          ))}

          <button
            type="button"
            onClick={() => open('terminal')}
            className="group absolute bottom-0 right-4 z-[8] hidden w-[250px] rounded-[14px] border border-white/25 bg-black/30 p-3 text-left text-white shadow-[0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-black/40 md:block"
          >
            <div className="flex items-center gap-2.5">
              <img
                src="images/icons/terminal.png"
                alt=""
                className="h-10 w-10 flex-none object-contain drop-shadow"
              />
              <div className="min-w-0">
                <p className="text-[12px] font-semibold">Talk to my AI</p>
                <p className="truncate text-[10.5px] text-white/60">Gemini Live voice · knows this portfolio</p>
              </div>
            </div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-white/65">
              Projects, certificates, teaching, contact. Try{' '}
              <span className="font-mono text-[#8ab4f8]">/help</span> or talk to it with{' '}
              <span className="font-mono text-[#8fe0aa]">/live</span>.
            </p>
          </button>
        </div>
      ) : (
        <div
          className="absolute inset-x-0 bottom-[calc(92px+env(safe-area-inset-bottom,0px))] top-[calc(118px+env(safe-area-inset-top,0px))] z-[6] overflow-y-auto px-3 pb-6"
          aria-label="Projects and about"
        >
          <p className="mb-3 px-1 text-[11px] text-white/65">
            Two folders, one AI terminal. Tap to open.
          </p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-4">
            {CONFIG.desktopItems.map(item => (
              <DesktopIcon
                key={item.id}
                item={item}
                position={{ x: 0, y: 0 }}
                area={area}
                compact
                selected={false}
                dragging={false}
                onSelect={() => {}}
                onOpen={openItem}
                onMove={() => {}}
                onDragState={() => {}}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => open('terminal')}
            className="mt-3 flex w-full items-center gap-3 rounded-[12px] border border-[#0a84ff]/50 bg-[#0a84ff]/20 p-3 text-left text-white backdrop-blur-md"
          >
            <img src="images/icons/terminal.png" alt="" className="h-9 w-9 object-contain" />
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-semibold">Talk to Ziad AI</span>
                              <span className="block text-[10.5px] text-white/65">
                  Ask anything · /help · /live voice
                </span>
            </span>
            <span className="text-[16px] text-white/60">›</span>
          </button>
        </div>
      )}

      <Dock
        running={running}
        onOpen={toggleApp}
        onLaunchpad={() => setLaunchpad(true)}
        onReset={resetLayout}
        size={dockSize}
        motionOff={reduce}
        compact={mobile}
      />

      <div className="pointer-events-none absolute inset-0 z-[300]">
        {windows.map(win => (
          <div key={win.key} className="pointer-events-auto contents">
            <Window
              win={win}
              active={topWindow?.key === win.key}
              mobile={mobile}
              viewport={viewport}
              onFocus={() => focus(win.key)}
              onClose={() => close(win.key)}
              onMinimize={() => minimize(win.key)}
            >
              {renderApp(win)}
            </Window>
          </div>
        ))}
      </div>

      <Launchpad open={launchpad} onClose={() => setLaunchpad(false)} onOpen={launch} />
      <Spotlight
        open={spotlight}
        onClose={() => setSpotlight(false)}
        onOpen={launch}
        onLink={openLink}
        onReset={resetLayout}
        onNextWallpaper={nextWallpaper}
      />
      <ControlCenter
        open={control}
        onClose={() => setControl(false)}
        theme={theme}
        setTheme={setTheme}
        motionOff={motionOff}
        setMotionOff={setMotionOff}
        wallpaperId={wallpaper.id}
        setWallpaperId={setWallpaperId}
        dockSize={dockSize}
        setDockSize={setDockSize}
        onReset={resetLayout}
      />

      <div
        aria-live="polite"
        className={`pointer-events-none fixed left-1/2 top-[44px] z-[700] -translate-x-1/2 rounded-[9px] border border-white/20 bg-[rgba(28,28,32,0.85)] px-4 py-2 text-[12px] font-medium text-white shadow-lg backdrop-blur-xl transition-all duration-200 ${
          toast ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        }`}
      >
        {toast}
      </div>
    </div>
  )
}
