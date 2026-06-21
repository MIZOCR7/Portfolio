import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface LoaderProps {
  setHeroImages: (images: HTMLImageElement[]) => void
  setHandsImages: (images: HTMLImageElement[]) => void
  setIsLoaded: (loaded: boolean) => void
}

const HERO_FRAMES = 150
const HANDS_FRAMES = 150
const TOTAL_FRAMES = HERO_FRAMES + HANDS_FRAMES

export default function Loader({ setHeroImages, setHandsImages, setIsLoaded }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    let loadedCount = 0
    const loadedHero: HTMLImageElement[] = new Array(HERO_FRAMES)
    const loadedHands: HTMLImageElement[] = new Array(HANDS_FRAMES)
    let hasFinished = false

    // Fake log generator for the HUD vibe
    const logInterval = setInterval(() => {
      const hex = Math.floor(Math.random() * 16777215).toString(16).padEnd(6, '0')
      const msg = `[0x${hex.toUpperCase()}] ALLOCATING MEMORY BLOCKS...`
      setLogs(prev => [...prev.slice(-4), msg])
    }, 150)

    const checkComplete = () => {
      if (loadedCount >= TOTAL_FRAMES && !hasFinished) {
        hasFinished = true
        clearInterval(logInterval)
        setHeroImages(loadedHero)
        setHandsImages(loadedHands)
        
        setTimeout(() => {
          setIsLoaded(true)
        }, 1200) // Hold at 100% for a dramatic second
      }
    }

    const loadSequence = (
      prefix: string, 
      count: number, 
      arr: HTMLImageElement[]
    ) => {
      for (let i = 1; i <= count; i++) {
        const img = new Image()
        const indexStr = i.toString().padStart(4, '0')
        img.src = `/${prefix}/frame_${indexStr}.webp`

        const onLoadOrError = () => {
          arr[i - 1] = img
          loadedCount++
          setProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100))
          checkComplete()
        }

        img.onload = onLoadOrError
        img.onerror = onLoadOrError
      }
    }

    // Start preloading both sequences
    loadSequence('frames', HERO_FRAMES, loadedHero)
    loadSequence('hands', HANDS_FRAMES, loadedHands)

    return () => clearInterval(logInterval)
  }, [setHeroImages, setHandsImages, setIsLoaded])

  return (
    <motion.div
      initial={{ y: '0%' }}
      exit={{ y: '-100%', transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[9999] bg-[#020202] text-white flex flex-col justify-between p-6 sm:p-10 pointer-events-none overflow-hidden"
    >
      {/* Background grid scanline effect */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Top Left: System Status */}
      <div className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 mb-2"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          SYSTEM_ONLINE
        </motion.div>
        <div>Z.E.A NEURAL ENGINE v2.0.4</div>
        <div>CONNECTING TO MAINFRAME...</div>
      </div>

      {/* Center HUD */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        {/* Geometric Rotating Rings */}
        <div className="relative w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border border-white/10 rounded-full"
            style={{ borderTopColor: 'rgba(255,255,255,0.8)' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 border border-white/5 rounded-full"
            style={{ borderBottomColor: 'rgba(255,255,255,0.4)', borderRightColor: 'rgba(255,255,255,0.4)' }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-8 border border-white/5 rounded-full border-dashed"
          />
          
          {/* Central Percentage */}
          <div className="absolute flex flex-col items-center">
            <div 
              className="text-5xl sm:text-7xl font-bold tracking-tighter" 
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {progress}<span className="text-2xl sm:text-3xl text-white/40">%</span>
            </div>
          </div>
        </div>
        
        {/* Loading Bar */}
        <div className="w-[200px] sm:w-[300px] h-[2px] bg-white/10 mt-12 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 bottom-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>

      {/* Bottom Right: Fake logs & diagnostics */}
      <div className="font-mono text-[9px] sm:text-[10px] tracking-widest text-white/30 text-right uppercase self-end flex flex-col gap-1 w-full max-w-xs">
        <div className="text-white/50 mb-2 border-b border-white/10 pb-2">BOOT SEQUENCE</div>
        {logs.map((log, i) => (
          <div key={i} className="truncate">{log}</div>
        ))}
        <div className="mt-2 text-white/60">
          RAM: {Math.floor((progress / 100) * 8192)} MB / 8192 MB
        </div>
      </div>
    </motion.div>
  )
}
