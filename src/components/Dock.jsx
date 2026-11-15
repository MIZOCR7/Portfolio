import { useRef, useState } from 'react'
import { dockApps } from '../config'

const ENTER = { scale: 1, lift: 0, label: null }

export default function Dock({
  running,
  onOpen,
  onLaunchpad,
  onReset,
  size = 58,
  motionOff,
  compact,
}) {
  const dockRef = useRef(null)
  const itemRefs = useRef({})
  const centers = useRef([])
  const [hovered, setHovered] = useState(null)

  const items = [
    ...dockApps,
    { id: 'launchpad', label: 'Launchpad', icon: 'images/icons/apps.png', special: 'launchpad' },
    { id: 'reset', label: 'Reset Layout', icon: 'images/trash.png', special: 'reset' },
  ]

  const reset = () => {
    Object.values(itemRefs.current).forEach(el => {
      if (el) el.style.transform = ''
    })
    setHovered(null)
  }

  const measure = () => {
    if (!dockRef.current) return
    Object.values(itemRefs.current).forEach(el => {
      if (el) el.style.transform = ''
    })
    const base = dockRef.current.getBoundingClientRect()
    centers.current = items.map(item => {
      const el = itemRefs.current[item.id]
      if (!el) return 0
      const r = el.getBoundingClientRect()
      return r.left - base.left + r.width / 2
    })
  }

  const onMove = e => {
    if (motionOff || compact) return
    const base = dockRef.current.getBoundingClientRect()
    const x = e.clientX - base.left
    items.forEach((item, i) => {
      const el = itemRefs.current[item.id]
      if (!el) return
      const d = Math.abs(x - centers.current[i])
      const push = Math.exp(-(d * d) / (2 * 74 * 74))
      const lift = 13 * Math.exp(-(d * d) / (2 * 96 * 96))
      el.style.transform = `translateY(${-lift}px) scale(${1 + 0.42 * push})`
    })
  }

  const activate = item => {
    if (item.special === 'launchpad') return onLaunchpad()
    if (item.special === 'reset') return onReset()
    onOpen(item.id)
  }

  return (
    <nav
      aria-label="Dock"
      className={`fixed z-[480] flex justify-center ${compact ? 'inset-x-0 bottom-[max(8px,env(safe-area-inset-bottom))]' : 'inset-x-0 bottom-[10px]'}`}
    >
      <div
        ref={dockRef}
        onPointerEnter={measure}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className={`dock-bar flex items-end rounded-[22px] border border-white/30 bg-white/25 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl dark:border-white/15 dark:bg-black/35 ${compact ? 'gap-1 px-2 py-1.5' : 'gap-2 px-2.5 pb-2 pt-1.5'}`}
      >
        {items.map((item, i) => {
          const isRunning = item.special ? false : running.includes(item.id)
          return (
            <div key={item.id} className={`relative flex flex-col items-center ${item.special === 'launchpad' ? 'ml-1 border-l border-white/25 pl-2 dark:border-white/15' : ''}`}>
              <button
                type="button"
                ref={el => {
                  itemRefs.current[item.id] = el
                }}
                onClick={() => activate(item)}
                onFocus={() => setHovered(item.id)}
                onBlur={() => setHovered(null)}
                aria-label={item.label}
                className="dock-item group relative block rounded-[22%] outline-none transition-transform duration-150 ease-out"
                style={{ width: compact ? Math.max(38, size - 16) : size, height: compact ? Math.max(38, size - 16) : size }}
              >
                <img
                  src={item.icon}
                  alt=""
                  width="192"
                  height="192"
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.28)]"
                />
                <span
                  className={`pointer-events-none absolute left-1/2 top-[-34px] z-10 -translate-x-1/2 whitespace-nowrap rounded-[7px] border border-white/30 bg-[rgba(30,30,34,0.82)] px-2.5 py-[3px] text-[12px] font-medium text-white shadow-lg backdrop-blur-md transition-opacity duration-150 ${hovered === item.id ? 'opacity-100' : 'opacity-0'}`}
                  role="tooltip"
                >
                  {item.label}
                </span>
              </button>
              <span
                aria-hidden="true"
                className={`mt-[3px] h-[4px] w-[4px] rounded-full bg-white/85 shadow-[0_0_4px_rgba(0,0,0,0.5)] ${isRunning ? 'opacity-100' : 'opacity-0'}`}
              />
              {i === dockApps.length - 1 && (
                <span className="pointer-events-none absolute bottom-1 right-[-7px] top-1 w-px bg-white/30 dark:bg-white/20" />
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
