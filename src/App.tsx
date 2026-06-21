import { useState } from 'react'
import { ReactLenis } from 'lenis/react'
import { AnimatePresence } from 'framer-motion'
import './App.css'

import Loader from './components/Loader'
import CanvasSequence from './components/CanvasSequence'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import CustomCursor from './components/CustomCursor'

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [heroImages, setHeroImages] = useState<HTMLImageElement[]>([])
  const [handsImages, setHandsImages] = useState<HTMLImageElement[]>([])

  return (
    <>
      <CustomCursor />

      {/* The Loader handles the dual preloading logic and features the HUD */}
      <AnimatePresence>
        {!isLoaded && (
          <Loader 
            setHeroImages={setHeroImages} 
            setHandsImages={setHandsImages} 
            setIsLoaded={setIsLoaded} 
          />
        )}
      </AnimatePresence>

      <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
        {/* Layer 0 — global background canvas sequence */}
        <CanvasSequence images={heroImages} />

        <Navbar />

        <main>
          <Hero />
          {/* About section will receive handsImages for its scroll sequence */}
          <About handsImages={handsImages} />
          <Projects />
          <Contact />
        </main>
      </ReactLenis>
    </>
  )
}
