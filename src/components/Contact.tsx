import { motion } from 'framer-motion'
import Magnetic from './Magnetic'

const EMAIL = 'ziad.1024087@stemoctober.moe.edu.eg'

const SOCIALS = [
  { name: 'GitHub', href: 'https://github.com/ZIZO17z' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/ziad-emad-470604400' },
  { name: 'Instagram', href: 'https://www.instagram.com/zes79586/' },
]

export default function Contact() {
  const textVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  }

  return (
    <section
      id="contact"
      className="relative bg-black py-28 md:py-40 px-5 sm:px-8 md:px-10 overflow-hidden"
      style={{ zIndex: 2 }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,255,255,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <p className="text-[11px] tracking-[0.35em] text-white/30 uppercase mb-10 font-mono">
          // 003 — contact
        </p>

        {/* Massive display text reveal */}
        <motion.h2
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="font-bold text-white leading-[0.88] tracking-tight mb-16 md:mb-20"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(3rem, 11vw, 12rem)',
          }}
        >
          <div className="overflow-hidden mb-2">
            <motion.div
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px' }}
            >
              LET'S BUILD
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px' }}
              transition={{ delay: 0.15 }}
              className="text-white/20"
            >
              THE FUTURE.
            </motion.div>
          </div>
        </motion.h2>

        {/* CTA Button */}
        <Magnetic>
          <a
            href={`mailto:${EMAIL}`}
            className="group inline-flex items-center gap-4 px-8 py-5 rounded-full border border-white/20 text-white hover:border-white/60 transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04)',
              fontSize: 'clamp(14px, 2vw, 20px)',
              fontFamily: 'var(--font-body)',
              transition:
                'border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.boxShadow =
                '0 0 50px rgba(255,255,255,0.08), 0 0 0 1px rgba(255,255,255,0.2)'
              el.style.background = 'rgba(255,255,255,0.07)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.04)'
              el.style.background = 'rgba(255,255,255,0.04)'
            }}
          >
            <span className="underline underline-offset-2 tracking-wide font-medium">
              {EMAIL}
            </span>
            <span className="group-hover:translate-x-1 transition-transform duration-300 text-white/50 group-hover:text-white">
              →
            </span>
          </a>
        </Magnetic>

        {/* Footer row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-24 pt-8 border-t border-white/5 gap-6">
          <span className="text-white/20 text-[13px] tracking-widest uppercase font-mono">
            © 2026 — Ziad Emad Ahmed
          </span>

          <div className="flex items-center gap-8">
            {SOCIALS.map(s => (
              <Magnetic key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/25 text-[13px] tracking-wider uppercase font-mono hover:text-white/60 transition-colors duration-200"
                >
                  {s.name}
                </a>
              </Magnetic>
            ))}
          </div>

          <span className="text-white/20 text-[13px] tracking-widest uppercase font-mono">
            All Systems Active
          </span>
        </div>
      </div>
    </section>
  )
}
