import { useEffect, useRef } from 'react'

export type LightItem = {
  src: string
  alt: string
  title: string
  meta?: string
  note?: string
}

type Props = {
  items: LightItem[]
  index: number | null
  onIndex: (i: number) => void
  onClose: () => void
}

/** A full-screen viewer shared by the certificate wall and the archive. */
export default function Lightbox({ items, index, onIndex, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (index === null) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onIndex((index + 1) % items.length)
      else if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
      else if (e.key === 'Tab') {
        // Keep focus inside the viewer while it is open.
        e.preventDefault()
        closeRef.current?.focus()
      }
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [index, items.length, onIndex, onClose])

  if (index === null) return null
  const item = items[index]

  return (
    <div
      className="light"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="light-top">
        <span className="mono">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <button className="light-x" type="button" onClick={onClose} ref={closeRef} aria-label="Close viewer">
          Close <i>✕</i>
        </button>
      </div>

      <figure className="light-stage">
        <img src={item.src} alt={item.alt} decoding="async" />
        <figcaption>
          <span className="light-title">{item.title}</span>
          {item.meta && <span className="light-meta mono">{item.meta}</span>}
          {item.note && <span className="light-note">{item.note}</span>}
        </figcaption>
      </figure>

      <div className="light-nav">
        <button type="button" onClick={() => onIndex((index - 1 + items.length) % items.length)} aria-label="Previous">
          ←
        </button>
        <button type="button" onClick={() => onIndex((index + 1) % items.length)} aria-label="Next">
          →
        </button>
      </div>
    </div>
  )
}
