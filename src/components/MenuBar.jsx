import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'

const AppleMark = () => (
  <svg viewBox="0 0 14 16" width="13" height="15" aria-hidden="true" fill="currentColor">
    <path d="M11.5 8.5c0-2 1.6-2.9 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7C3.4 3.9 2.1 4.7 1.4 6 .0 8.5 1.1 12.2 2.5 14c.7 1 1.5 2 2.6 1.9 1 0 1.4-.6 2.7-.6 1.2 0 1.6.6 2.7.6 1.1 0 1.8-.9 2.5-1.9.8-1.1 1.1-2.2 1.1-2.3-.1 0-2.6-1-2.6-3.2Z" />
    <path d="M9.3 2.6C9.9 1.9 10.3.9 10.2 0c-.8 0-1.8.5-2.4 1.2-.5.6-1 1.7-.9 2.6.9.1 1.8-.5 2.4-1.2Z" />
  </svg>
)

const Wifi = () => (
  <svg width="17" height="13" viewBox="0 0 17 13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M1.5 4.6a10 10 0 0 1 14 0M4 7.4a6.4 6.4 0 0 1 9 0M6.6 10.2a2.8 2.8 0 0 1 3.8 0" />
  </svg>
)

const Battery = () => (
  <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
    <rect x=".5" y=".5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity=".65" />
    <rect x="2" y="2" width="15" height="8" rx="1.6" fill="currentColor" />
    <rect x="22.4" y="4" width="1.6" height="4" rx=".8" fill="currentColor" opacity=".65" />
  </svg>
)

const SearchGlyph = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <circle cx="6.4" cy="6.4" r="4.4" />
    <path d="M9.8 9.8 13.4 13.4" />
  </svg>
)

const ControlGlyph = () => (
  <svg width="17" height="15" viewBox="0 0 18 15" aria-hidden="true">
    <rect x="1" y="1" width="16" height="6" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12.6" cy="4" r="1.9" fill="currentColor" />
    <rect x="1" y="9" width="16" height="5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="5.4" cy="11.5" r="1.4" fill="currentColor" />
  </svg>
)

export default function MenuBar({
  clock,
  onOpen,
  onSpotlight,
  onControlCenter,
  controlOpen,
  theme,
  setTheme,
  motionOff,
  setMotionOff,
  onReset,
  onNextWallpaper,
  windows,
  onFocus,
  onCloseTop,
  onMinimizeTop,
  compact,
}) {
  const [open, setOpen] = useState(null)
  const navRef = useRef(null)
  const site = CONFIG.site

  useEffect(() => {
    if (!open) return
    const onDown = e => {
      if (!navRef.current?.contains(e.target)) setOpen(null)
    }
    const onKey = e => {
      if (e.key === 'Escape') setOpen(null)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const topWindow = windows.filter(w => !w.minimized).sort((a, b) => b.z - a.z)[0]

  const menus = {
    apple: [
      { label: 'About This Mac', action: () => onOpen('about') },
      { label: 'System Settings…', action: onControlCenter },
      { sep: true },
      { label: 'Open Projects', action: () => onOpen('folder', 'projects') },
      { label: 'Open About Me', action: () => onOpen('folder', 'about-me') },
      { label: 'Open AI Terminal', kbd: '⌘T', action: () => onOpen('terminal') },
      { label: 'Open Music', action: () => onOpen('music') },
      { label: 'Open YouTube', action: () => onOpen('youtube') },
      { label: 'Open Safari', action: () => onOpen('browser') },
      { label: 'Open Love', action: () => onOpen('love') },
      { label: 'Open Résumé', action: () => onOpen('resume') },
      { sep: true },
      { label: 'Reset Desktop', action: onReset },
    ],
    app: [
      { label: `About ${site.name}`, action: () => onOpen('about') },
      { sep: true },
      { label: 'Open Projects', kbd: '⌘1', action: () => onOpen('folder', 'projects') },
      { label: 'Open About Me', action: () => onOpen('folder', 'about-me') },
      { label: 'Open Notes', action: () => onOpen('notes') },
      { label: 'Open AI Terminal', kbd: '⌘T', action: () => onOpen('terminal') },
      { label: 'Open Music', action: () => onOpen('music') },
      { label: 'Open YouTube', action: () => onOpen('youtube') },
      { label: 'Open Safari', action: () => onOpen('browser') },
      { label: 'Open Love', action: () => onOpen('love') },
      { sep: true },
      { label: 'Toggle Appearance', action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
    ],
    File: [
      { label: 'Open Projects', kbd: '⌘1', action: () => onOpen('folder', 'projects') },
      { label: 'Open About Me', action: () => onOpen('folder', 'about-me') },
      { label: 'Open Achievements', action: () => onOpen('folder', 'achievements') },
      { label: 'Open Experience', action: () => onOpen('folder', 'experience') },
      { label: 'Open Contact', action: () => onOpen('folder', 'contact') },
      { label: 'Open Studio', action: () => onOpen('folder', 'studio') },
      { label: 'Open AI Terminal', kbd: '⌘T', action: () => onOpen('terminal') },
      { label: 'Open Music', action: () => onOpen('music') },
      { label: 'Open YouTube', action: () => onOpen('youtube') },
      { label: 'Open Safari', action: () => onOpen('browser') },
      { label: 'Open Love', action: () => onOpen('love') },
      { label: 'Contact Ziad', kbd: '⌘2', action: () => onOpen('contact') },
      { sep: true },
      { label: 'Close Window', kbd: '⌘W', action: onCloseTop, disabled: !topWindow },
    ],
    View: [
      { label: 'Next Wallpaper', action: onNextWallpaper },
      { label: 'Toggle Appearance', action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
      { label: 'Reduce Motion', checked: motionOff, action: () => setMotionOff(!motionOff) },
      { sep: true },
      {
        label: 'Enter Full Screen',
        action: () => {
          try {
            if (document.fullscreenElement) document.exitFullscreen()
            else document.documentElement.requestFullscreen()
          } catch {
            /* blocked by the browser */
          }
        },
      },
    ],
    Window: [
      { label: 'Minimise', kbd: '⌘M', action: onMinimizeTop, disabled: !topWindow },
      { sep: true },
      ...(windows.length
        ? windows.map(w => ({
            label: w.title,
            checked: w.key === topWindow?.key,
            action: () => onFocus(w.key),
          }))
        : [{ label: 'No open windows', disabled: true }]),
    ],
    Help: [
      { label: 'Ask the AI Terminal', kbd: '⌘T', action: () => onOpen('terminal') },
      { label: 'Keyboard Shortcuts', action: () => onOpen('shortcuts') },
      { sep: true },
      { label: 'Instagram ↗', action: () => window.open(site.instagram, '_blank', 'noopener,noreferrer') },
      { label: 'Email Ziad', action: () => onOpen('contact') },
      { label: 'GitHub ↗', action: () => window.open(site.github, '_blank', 'noopener,noreferrer') },
    ],
  }

  const renderMenu = key => (
    <div
      role="menu"
      aria-label={`${key} menu`}
      className="absolute left-0 top-[27px] z-[560] min-w-[236px] overflow-hidden rounded-[9px] border border-black/15 bg-[var(--menu)] p-[5px] text-[var(--fg)] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl dark:border-white/15"
    >
      {menus[key].map((item, i) =>
        item.sep ? (
          <div key={i} className="my-[5px] h-px bg-[var(--line)]" role="separator" />
        ) : (
          <button
            key={i}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              setOpen(null)
              item.action?.()
            }}
            className="flex w-full items-center gap-2 rounded-[5px] px-2.5 py-[4px] text-left text-[13px] disabled:opacity-40 enabled:hover:bg-[#0a84ff] enabled:hover:text-white focus-visible:bg-[#0a84ff] focus-visible:text-white focus-visible:outline-none"
          >
            <span className="w-3 text-[11px]">{item.checked ? '✓' : ''}</span>
            <span className="flex-1 truncate">{item.label}</span>
            {item.kbd && <span className="text-[11px] opacity-50">{item.kbd}</span>}
          </button>
        )
      )}
    </div>
  )

  return (
    <header
      ref={navRef}
      className="fixed inset-x-0 top-0 z-[540] flex h-[calc(30px+env(safe-area-inset-top,0px))] select-none items-center justify-between bg-[rgba(18,18,22,0.32)] px-2 pt-[env(safe-area-inset-top,0px)] text-[13px] text-white shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] backdrop-blur-2xl"
      role="banner"
    >
      <div className="flex h-full items-center gap-0.5">
        <div className="relative">
          <button
            type="button"
            aria-label="Apple menu"
            aria-haspopup="menu"
            aria-expanded={open === 'apple'}
            onClick={() => setOpen(open === 'apple' ? null : 'apple')}
            className={`flex h-[22px] items-center rounded-[5px] px-2.5 hover:bg-white/20 ${open === 'apple' ? 'bg-white/20' : ''}`}
          >
            <AppleMark />
          </button>
          {open === 'apple' && renderMenu('apple')}
        </div>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open === 'app'}
            onClick={() => setOpen(open === 'app' ? null : 'app')}
            onPointerEnter={() => open && setOpen('app')}
            className={`h-[22px] rounded-[5px] px-2.5 font-semibold hover:bg-white/20 ${open === 'app' ? 'bg-white/20' : ''}`}
          >
            {site.menuName}
          </button>
          {open === 'app' && renderMenu('app')}
        </div>

        {!compact &&
          ['File', 'View', 'Window', 'Help'].map(key => (
            <div key={key} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open === key}
                onClick={() => setOpen(open === key ? null : key)}
                onPointerEnter={() => open && setOpen(key)}
                className={`h-[22px] rounded-[5px] px-2.5 hover:bg-white/20 ${open === key ? 'bg-white/20' : ''}`}
              >
                {key}
              </button>
              {open === key && renderMenu(key)}
            </div>
          ))}
      </div>

      <div className="flex h-full items-center gap-3 pr-1">
        {!compact && (
          <>
            <span className="opacity-90" title="Connected">
              <Wifi />
            </span>
            <span className="opacity-90" title="Battery">
              <Battery />
            </span>
          </>
        )}
        <button
          type="button"
          onClick={onSpotlight}
          aria-label="Spotlight search"
          className="flex h-[22px] items-center rounded-[5px] px-1.5 hover:bg-white/20"
        >
          <SearchGlyph />
        </button>
        <button
          type="button"
          onClick={onControlCenter}
          aria-label="Control Centre"
          aria-expanded={controlOpen}
          className={`flex h-[22px] items-center rounded-[5px] px-1.5 hover:bg-white/20 ${controlOpen ? 'bg-white/20' : ''}`}
        >
          <ControlGlyph />
        </button>
        <span className="whitespace-nowrap pl-0.5 text-[12.5px] tabular-nums opacity-95">
          {compact ? clock.time : `${clock.day} ${clock.date}`} {!compact && <span className="ml-1.5">{clock.time}</span>}
        </span>
      </div>
    </header>
  )
}
