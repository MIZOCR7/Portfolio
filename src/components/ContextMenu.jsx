import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/* A macOS-style desktop context menu. Position is clamped to the viewport so
   a right-click near the edge still opens a fully visible menu. */
export default function ContextMenu({ x, y, items, onClose, label = 'Desktop menu' }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x, y })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({
      x: Math.max(6, Math.min(x, window.innerWidth - rect.width - 6)),
      y: Math.max(34, Math.min(y, window.innerHeight - rect.height - 6)),
    })
  }, [x, y, items])

  useEffect(() => {
    const onDown = e => {
      if (!ref.current?.contains(e.target)) onClose()
    }
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={label}
      style={{ left: pos.x, top: pos.y }}
      className="fixed z-[650] w-[238px] overflow-hidden rounded-[9px] border border-black/20 bg-[var(--menu)] p-[5px] text-[var(--fg)] shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-2xl dark:border-white/15"
    >
      {items.map((item, i) =>
        item.sep ? (
          <div key={`sep-${i}`} role="separator" className="my-[5px] h-px bg-[var(--line)]" />
        ) : (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              onClose()
              item.action?.()
            }}
            className="flex w-full items-center gap-2 rounded-[5px] px-2.5 py-[5px] text-left text-[12.5px] disabled:opacity-35 enabled:hover:bg-[#0a84ff] enabled:hover:text-white focus-visible:bg-[#0a84ff] focus-visible:text-white focus-visible:outline-none"
          >
            <span className="w-3 flex-none text-[11px]">{item.checked ? '✓' : ''}</span>
            <span className="flex-1 truncate">{item.label}</span>
            {item.kbd ? <span className="text-[10.5px] opacity-50">{item.kbd}</span> : null}
          </button>
        )
      )}
    </div>
  )
}
