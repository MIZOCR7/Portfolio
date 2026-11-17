import { useEffect, useRef } from 'react'
import { CONFIG } from '../config'

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[22px] w-[38px] flex-none rounded-full transition-colors ${checked ? 'bg-[#30d158]' : 'bg-[var(--line)]'} outline-none`}
    >
      <span
        className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${checked ? 'left-[18px]' : 'left-[2px]'}`}
      />
    </button>
  )
}

export default function ControlCenter({
  open,
  onClose,
  theme,
  setTheme,
  motionOff,
  setMotionOff,
  wallpaperId,
  setWallpaperId,
  dockSize,
  setDockSize,
  onReset,
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = e => {
      if (!ref.current?.contains(e.target) && !e.target.closest('[aria-label="Control Centre"]')) onClose()
    }
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <section
      ref={ref}
      role="dialog"
      aria-label="Control Centre"
      className="fixed right-2 top-[34px] z-[560] w-[318px] max-w-[calc(100vw-16px)] rounded-[18px] border border-white/35 bg-[var(--menu)] p-3 text-[var(--fg)] shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-3xl dark:border-white/15"
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-[13px] font-semibold">Control Centre</h2>
        <button type="button" onClick={onClose} className="rounded px-1.5 text-[12px] opacity-60 hover:opacity-100">
          Done
        </button>
      </div>

      <div className="grid gap-2">
        <div className="rounded-[12px] bg-[var(--hover)] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12.5px] font-semibold">Appearance</span>
            <span className="text-[11px] opacity-55">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 rounded-[8px] bg-[var(--win)] p-1">
            {['light', 'dark'].map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => setTheme(mode)}
                aria-pressed={theme === mode}
                className={`rounded-[6px] py-1 text-[12px] font-medium capitalize transition-colors ${theme === mode ? 'bg-[#0a84ff] text-white shadow' : 'hover:bg-[var(--hover)]'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[12px] bg-[var(--hover)] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12.5px] font-semibold">Wallpaper</span>
            <span className="text-[11px] opacity-55">{CONFIG.wallpapers.find(w => w.id === wallpaperId)?.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CONFIG.wallpapers.map(w => (
              <button
                key={w.id}
                type="button"
                onClick={() => setWallpaperId(w.id)}
                aria-pressed={wallpaperId === w.id}
                className={`overflow-hidden rounded-[8px] border-2 text-left ${wallpaperId === w.id ? 'border-[#0a84ff]' : 'border-transparent'}`}
              >
                <span className="relative block">
                  {w.video ? (
                    <video
                      src={w.video}
                      poster={w.src}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                      className="h-[52px] w-full object-cover"
                    />
                  ) : (
                    <img src={w.src} alt="" className="h-[52px] w-full object-cover" loading="lazy" />
                  )}
                  {w.live ? (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-1.5 py-[2px] text-[8px] font-bold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-md">
                      Live
                    </span>
                  ) : null}
                </span>
                <span className="block bg-[var(--win)] px-2 py-1 text-[11px]">{w.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[12px] bg-[var(--hover)] p-3">
          <div>
            <p className="text-[12.5px] font-semibold">Reduce motion</p>
            <p className="text-[11px] opacity-55">Turns off the dock zoom and window motion.</p>
          </div>
          <Switch checked={motionOff} onChange={setMotionOff} label="Reduce motion" />
        </div>

        <div className="rounded-[12px] bg-[var(--hover)] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12.5px] font-semibold">Dock size</span>
            <span className="text-[11px] opacity-55">{dockSize}px</span>
          </div>
          <input
            type="range"
            min="46"
            max="76"
            step="2"
            value={dockSize}
            onChange={e => setDockSize(Number(e.target.value))}
            className="w-full accent-[#0a84ff]"
            aria-label="Dock icon size"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            onReset()
            onClose()
          }}
          className="flex items-center justify-between rounded-[12px] bg-[var(--hover)] p-3 text-[12.5px] font-semibold hover:bg-[var(--line)]"
        >
          Reset desktop layout
          <span className="text-[11px] font-normal opacity-55">Put covers back</span>
        </button>
      </div>
    </section>
  )
}
