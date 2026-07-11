import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import Legacy from './components/Legacy'
import ProjectStory from './components/ProjectStory'
import ExperienceStory from './components/ExperienceStory'
import ClickSpark from './components/ClickSpark'

const LOGO_KEY = 'portfolio-logo'

function HomePage({ logo, onLogoClick }: { logo: string; onLogoClick: () => void }) {
  return (
    <>
      <Navbar logo={logo} onLogoClick={onLogoClick} />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
    </>
  )
}

function LegacyPage({ onSelect }: { onSelect: (file: string) => void }) {
  return <Legacy onBack={() => window.history.back()} onSelect={onSelect} />
}

export default function App() {
  const [logo, setLogo] = useState(() => localStorage.getItem(LOGO_KEY) || 'w26.jpeg')

  useEffect(() => {
    localStorage.setItem(LOGO_KEY, logo)
  }, [logo])

  const handleLogoClick = () => {
    window.location.href = '/legacy'
  }

  const handleLegacySelect = (file: string) => {
    setLogo(file)
    window.location.href = '/'
  }

  return (
    <ClickSpark sparkColor="#818cf8" sparkSize={8} sparkRadius={25} sparkCount={6} duration={400}>
      <Routes>
        <Route path="/" element={<HomePage logo={logo} onLogoClick={handleLogoClick} />} />
        <Route path="/legacy" element={<LegacyPage onSelect={handleLegacySelect} />} />
        <Route path="/projects/:slug" element={<ProjectStory />} />
        <Route path="/experience/:slug" element={<ExperienceStory />} />
      </Routes>
    </ClickSpark>
  )
}