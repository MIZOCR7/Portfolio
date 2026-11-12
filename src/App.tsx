import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import Capstone from './components/Capstone'
import Toolkit from './components/Toolkit'
import Resume from './components/Resume'
import Contact from './components/Contact'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Work />
        <Capstone />
        <Toolkit />
        <Resume />
        <Contact />
      </main>
    </>
  )
}
