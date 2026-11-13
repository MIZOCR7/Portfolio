import { useEffect } from 'react'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import About from './components/About'
import Work from './components/Work'
import Capstone from './components/Capstone'
import Recognition from './components/Recognition'
import Archive from './components/Archive'
import Metu from './components/Metu'
import Toolkit from './components/Toolkit'
import Resume from './components/Resume'
import Contact from './components/Contact'
import Companion from './components/Companion'
import { useReveal } from './hooks/useReveal'
import { BAND } from './data'

export default function App() {
  useReveal()

  // Scroll progress bar — one rAF per scroll burst, no re-renders.
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>('.progress')
    let raf = 0

    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const value = max > 0 ? window.scrollY / max : 0
      if (bar) bar.style.setProperty('--p', value.toFixed(4))
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <Cursor />
      <div className="progress" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <div className="band" aria-hidden="true">
          <div className="band-track">
            {[...BAND, ...BAND].map((word, i) => (
              <span key={`${word}-${i}`}>
                {word}
                <i>✳</i>
              </span>
            ))}
          </div>
        </div>
        <About />
        <Work />
        <Capstone />
        <Recognition />
        <Archive />
        <Metu />
        <Toolkit />
        <Resume />
        <Contact />
      </main>
      <Companion />
    </>
  )
}
