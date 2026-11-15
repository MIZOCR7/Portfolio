import { useState } from 'react'

/* Image with an honest fallback — no broken-image icons on the desktop. */
export default function Media({ src, alt = '', className = '', fallback = null, ...rest }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return fallback
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  )
}
