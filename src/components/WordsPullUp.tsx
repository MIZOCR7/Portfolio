import { motion } from 'framer-motion'

interface WordsPullUpProps {
  text: string
  className?: string
  delay?: number
}

// Typed as a 4-number cubic-bezier array that Framer Motion accepts
const BEZIER: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * Splits text into words, each word into characters.
 * Each character is masked and pulled up from y:20 → 0
 * with a per-character stagger of 0.04s.
 */
export default function WordsPullUp({ text, className = '', delay = 0 }: WordsPullUpProps) {
  const chars = text.split('')

  return (
    <span className={`inline-flex flex-wrap ${className}`} aria-label={text}>
      {chars.map((char, i) => (
        <span
          key={i}
          className="overflow-hidden inline-block"
          // Spaces need a small width to be visible
          style={char === ' ' ? { width: '0.28em' } : {}}
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 1.1,
              delay: delay + i * 0.04,
              ease: BEZIER,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
