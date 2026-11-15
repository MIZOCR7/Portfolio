import { useRef } from 'react'

/* A generic desktop tile: a folder, the AI terminal, or anything else.
   It keeps the macOS double-click, drag, keyboard-nudge and local layout. */
export default function DesktopIcon({
  item,
  position,
  area,
  compact,
  small,
  selected,
  dragging,
  onSelect,
  onOpen,
  onMove,
  onDragState,
}) {
  const ref = useRef(null)
  const drag = useRef(null)
  const size = compact ? 72 : small ? 82 : 96
  const boxH = size + (compact ? 8 : 26)

  const left = 16 + position.x * Math.max(0, area.w - size - 32)
  const top = 8 + position.y * Math.max(0, area.h - boxH - 20)

  const down = e => {
    if (compact || e.button !== 0) return
    onSelect(item.id)
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = {
      id: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      px: position.x,
      py: position.y,
      moved: false,
    }
  }

  const move = e => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (!d.moved && Math.hypot(dx, dy) < 5) return
    if (!d.moved) {
      d.moved = true
      onDragState(item.id)
    }
    const maxX = Math.max(1, area.w - size - 32)
    const maxY = Math.max(1, area.h - boxH - 20)
    onMove(item.id, {
      x: Math.max(0, Math.min(1, d.px + dx / maxX)),
      y: Math.max(0, Math.min(1, d.py + dy / maxY)),
    })
  }

  const up = e => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    onDragState(null)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
    if (d.moved) {
      ref.current?.setAttribute('data-dragged', '1')
      window.setTimeout(() => ref.current?.removeAttribute('data-dragged'), 0)
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`${item.label} — ${item.note || ''}. Double-click or press Enter to open.`}
      data-desk-id={item.id}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onClick={() => {
        if (compact) return onOpen(item.id)
        if (ref.current?.getAttribute('data-dragged')) return
        onSelect(item.id)
      }}
      onDoubleClick={() => onOpen(item.id)}
      onKeyDown={e => {
        if (compact) return
        const step = e.shiftKey ? 0.06 : 0.015
        const map = {
          ArrowLeft: [-step, 0],
          ArrowRight: [step, 0],
          ArrowUp: [0, -step],
          ArrowDown: [0, step],
        }
        if (map[e.key]) {
          e.preventDefault()
          onMove(item.id, {
            x: Math.max(0, Math.min(1, position.x + map[e.key][0])),
            y: Math.max(0, Math.min(1, position.y + map[e.key][1])),
          })
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(item.id)
        }
      }}
      style={
        compact
          ? { width: '100%', touchAction: 'manipulation' }
          : {
              width: size + 10,
              left,
              top,
              transform: dragging ? 'scale(1.06)' : undefined,
              touchAction: 'none',
            }
      }
      className={[
        'desk-icon group flex flex-col items-center gap-1 rounded-lg p-1 text-center outline-none',
        compact ? 'relative w-full' : 'absolute',
        selected ? 'is-selected' : '',
        dragging ? 'is-dragging z-30' : 'z-10',
      ].join(' ')}
    >
      <span
        className="desk-glyph relative block flex-none"
        style={{ width: size, height: size }}
      >
        <img
          src={item.icon}
          alt=""
          width="192"
          height="192"
          draggable={false}
          className="h-full w-full object-contain"
        />
        {item.id === 'terminal' && (
          <span className="pointer-events-none absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0a84ff] px-1 text-[9px] font-bold text-white shadow-md ring-2 ring-white/70">
            AI
          </span>
        )}
      </span>
      <span className="desk-label max-w-full truncate rounded-[5px] px-1.5 pb-[1px] text-[11.5px] font-medium leading-[1.3] text-white">
        {item.label}
      </span>
      {item.note && !compact && (
        <span className="max-w-full truncate text-[9.5px] font-medium leading-none text-white/65">
          {item.note}
        </span>
      )}
    </button>
  )
}
