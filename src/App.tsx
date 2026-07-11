import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import Legacy from './components/Legacy'
import ClickSpark from './components/ClickSpark'

export default function App() {
  const [page, setPage] = useState<'home' | 'legacy'>('home')
  const [logo, setLogo] = useState('w26.jpeg')

  return (
    <ClickSpark sparkColor="#818cf8" sparkSize={8} sparkRadius={25} sparkCount={6} duration={400}>
      {page !== 'legacy' && <Navbar logo={logo} onLogoClick={() => setPage('legacy')} />}
      {page === 'legacy' ? (
        <Legacy onBack={() => setPage('home')} onSelect={(l) => { setLogo(l); setPage('home') }} />
      ) : (
        <main className="relative z-10">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Education />
          <Contact />
        </main>
      )}
    </ClickSpark>
  )
}
