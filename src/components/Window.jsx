import { useCallback, useEffect, useRef, useState } from 'react'

const MENU_H = 30
const MIN_W = 380
const MIN_H = 280

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

export default function Window({
  win,
  active,
  mobile,
  viewport,
  onFocus,
  onClose,
  onMinimize,
  children,
}) {
  const ref = useRef(null)
  const drag = useRef(null)
  const resize = useRef(null)
  const [pos, setPos] = useState({ x: win.x, y: win.y, w: win.w, h: win.h })
  const [maxed, setMaxed] = useState(false)

  // move focus into the window when it opens or is restored
  useEffect(() => {
    if (win.minimized) return
    // wait a tick so the overlay that launched the window has unmounted first
    const t = window.setTimeout(() => ref.current?.focus?.({ preventScroll: true }), 60)
    return () => window.clearTimeout(t)
  }, [win.key, win.minimized])

  useEffect(() => {
    if (mobile || maxed) return
    setPos(p => {
      const w = Math.min(p.w, viewport.w - 16)
      const h = Math.min(p.h, viewport.h - MENU_H - 96)
      return {
        w,
        h,
        x: clamp(p.x, 8, Math.max(8, viewport.w - w - 8)),
        y: clamp(p.y, MENU_H + 8, Math.max(MENU_H + 8, viewport.h - h - 58)),
      }
    })
  }, [viewport.w, viewport.h, mobile, maxed])

  const startDrag = useCallback(
    e => {
      onFocus()
      if (mobile || maxed || e.button !== 0) return
      if (e.target.closest('button, a, input, video')) return
      e.currentTarget.setPointerCapture(e.pointerId)
      drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y }
      document.body.classList.add('is-dragging')
    },
    [mobile, maxed, onFocus, pos.x, pos.y]
  )

  const moveDrag = e => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const w = ref.current?.offsetWidth || pos.w
    const h = ref.current?.offsetHeight || pos.h
    setPos(p => ({
      ...p,
      x: clamp(d.ox + e.clientX - d.sx, 0, Math.max(0, viewport.w - w)),
      y: clamp(d.oy + e.clientY - d.sy, MENU_H, Math.max(MENU_H, viewport.h - h - 8)),
    }))
  }

  const endDrag = e => {
    if (!drag.current || drag.current.id !== e.pointerId) return
    drag.current = null
    document.body.classList.remove('is-dragging')
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }

  const startResize = e => {
    if (mobile || maxed) return
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    resize.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, w: pos.w, h: pos.h }
  }

  const moveResize = e => {
    const r = resize.current
    if (!r || r.id !== e.pointerId) return
    setPos(p => ({
      ...p,
      w: clamp(r.w + e.clientX - r.sx, MIN_W, viewport.w - p.x - 8),
      h: clamp(r.h + e.clientY - r.sy, MIN_H, viewport.h - p.y - 12),
    }))
  }

  const endResize = e => {
    if (!resize.current || resize.current.id !== e.pointerId) return
    resize.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }

  const style = mobile
    ? { zIndex: win.z }
    : maxed
      ? {
          zIndex: win.z,
          left: 8,
          top: MENU_H + 6,
          width: viewport.w - 16,
          height: viewport.h - MENU_H - 106,
        }
      : { zIndex: win.z, left: pos.x, top: pos.y, width: pos.w, height: pos.h }

  return (
    <article
      ref={ref}
      role="dialog"
      aria-label={win.title}
      aria-modal="false"
      tabIndex={-1}
      hidden={win.minimized}
      style={style}
      onPointerDown={onFocus}
      className={[
        'window-shadow window-surface pointer-events-auto absolute flex flex-col overflow-hidden outline-none',
        mobile
          ? 'left-2 right-2 top-[calc(34px+env(safe-area-inset-top,0px))] bottom-[calc(90px+env(safe-area-inset-bottom,0px))] h-auto w-auto rounded-[18px]'
          : maxed
            ? 'rounded-[12px]'
            : 'rounded-[13px]',
      ].join(' ')}
      data-window={win.key}
    >
      <header
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={e => {
          if (e.target.closest('button')) return
          if (!mobile) setMaxed(v => !v)
        }}
        className="group/title relative z-10 flex h-[42px] flex-none select-none items-center gap-2 border-b border-[var(--line)] bg-[var(--win-2)] px-3"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${win.title}`}
            className="traffic-light traffic-close"
          >
            <svg viewBox="0 0 8 8" aria-hidden="true"><path d="M2 2l4 4M6 2L2 6" /></svg>
          </button>
          <button
            type="button"
            onClick={onMinimize}
            aria-label={`Minimise ${win.title}`}
            className="traffic-light traffic-min"
          >
            <svg viewBox="0 0 8 8" aria-hidden="true"><path d="M1.6 4h4.8" /></svg>
          </button>
          <button
            type="button"
            onClick={() => !mobile && setMaxed(v => !v)}
            aria-label={maxed ? `Restore ${win.title}` : `Maximise ${win.title}`}
            disabled={mobile}
            className="traffic-light traffic-max disabled:opacity-40"
          >
            <svg viewBox="0 0 8 8" aria-hidden="true"><path d="M2 2.4h3.6V6M6 5.6H2.4V2" /></svg>
          </button>
        </div>

        <h2 className="pointer-events-none flex-1 truncate text-center text-[13px] font-semibold tracking-[-0.01em] text-[var(--fg)] opacity-80">
          {win.title}
        </h2>
        <span className="w-[58px]" aria-hidden="true" />
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 rounded-md px-2 py-1 text-[12px] font-semibold text-[var(--dim)] hover:bg-[var(--hover)]"
          >
            Done
          </button>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[var(--win)] text-[var(--fg)] overscroll-contain">
        {children}
      </div>

      {!mobile && !maxed && (
        <div
          role="presentation"
          onPointerDown={startResize}
          onPointerMove={moveResize}
          onPointerUp={endResize}
          onPointerCancel={endResize}
          className="absolute bottom-0 right-0 z-20 h-4 w-4 cursor-nwse-resize"
          style={{ touchAction: 'none' }}
        >
          <span className="absolute bottom-[3px] right-[3px] h-2 w-2 rounded-br-[3px] border-b-2 border-r-2 border-[var(--line)] opacity-60" />
        </div>
      )}
    </article>
  )
}
