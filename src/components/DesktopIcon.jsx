import { useRef } from 'react'
import Media from './Media'

const WIDTHS = {
  landscape: { wide: 196, mid: 158 },
  square: { wide: 154, mid: 128 },
  portrait: { wide: 138, mid: 114 },
}

export default function DesktopIcon({
  project,
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
  const width = WIDTHS[project.aspect][compact || small ? 'mid' : 'wide']
  const iconH = project.aspect === 'portrait' ? Math.round(width * 1.33) : project.aspect === 'square' ? width : Math.round(width * 0.68)

  const left = 16 + position.x * Math.max(0, area.w - width - 32)
  const top = 8 + position.y * Math.max(0, area.h - iconH - 44)

  const down = e => {
    if (compact || e.button !== 0) return
    onSelect(project.id)
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
      onDragState(project.id)
    }
    const maxX = Math.max(1, area.w - width - 32)
    const maxY = Math.max(1, area.h - iconH - 44)
    onMove(project.id, {
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
      // suppress the click that follows a drag
      ref.current?.setAttribute('data-dragged', '1')
      window.setTimeout(() => ref.current?.removeAttribute('data-dragged'), 0)
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`${project.title} — ${project.kind}. Double-click or press Enter to open.`}
      data-desk-id={project.id}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onClick={() => {
        if (compact) return onOpen(project.id)
        if (ref.current?.getAttribute('data-dragged')) return
        onSelect(project.id)
      }}
      onDoubleClick={() => onOpen(project.id)}
      onKeyDown={e => {
        const step = e.shiftKey ? 0.06 : 0.015
        const map = {
          ArrowLeft: [-step, 0],
          ArrowRight: [step, 0],
          ArrowUp: [0, -step],
          ArrowDown: [0, step],
        }
        if (map[e.key]) {
          e.preventDefault()
          onMove(project.id, {
            x: Math.max(0, Math.min(1, position.x + map[e.key][0])),
            y: Math.max(0, Math.min(1, position.y + map[e.key][1])),
          })
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(project.id)
        }
      }}
      style={
        compact
          ? { width: '100%', touchAction: 'manipulation' }
          : {
              width,
              left,
              top,
              transform: dragging ? 'scale(1.06)' : undefined,
              touchAction: 'none',
            }
      }
      className={[
        'desk-icon group flex flex-col items-center gap-1.5 rounded-lg p-1.5 text-center outline-none',
        compact ? 'relative w-full' : 'absolute',
        selected ? 'is-selected' : '',
        dragging ? 'is-dragging z-30' : 'z-10',
      ].join(' ')}
    >
      <span
        className="desk-cover relative block w-full overflow-hidden rounded-[7px]"
        style={
          compact
            ? { aspectRatio: project.aspect === 'portrait' ? '3 / 4' : project.aspect === 'square' ? '1 / 1' : '4 / 3', height: undefined }
            : { height: iconH }
        }
      >
        <Media
          src={project.cover}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          fallback={
            <span
              className={`flex h-full w-full items-center justify-center rounded-[7px] bg-gradient-to-br ${project.tileTone || 'from-neutral-600 to-neutral-900'}`}
            >
              <span className="font-mono text-[26px] font-semibold tracking-tight text-white/90">
                {project.tile}
              </span>
            </span>
          }
        />
        <span className="pointer-events-none absolute inset-0 rounded-[7px] ring-1 ring-inset ring-white/25" />
      </span>
      <span className="desk-label max-w-full truncate rounded-[5px] px-1.5 pb-[2px] text-[11.5px] font-medium leading-[1.35] text-white">
        {project.title}
      </span>
    </button>
  )
}
