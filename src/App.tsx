import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import PillNav from './components/PillNav'
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
import NeuralNetwork from './components/NeuralNetwork'

const LOGO_KEY = 'portfolio-logo'

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

function HomePage({ logo, onLogoClick }: { logo: string; onLogoClick: () => void }) {
  return (
    <>
      <PillNav logo={logo} onLogoClick={onLogoClick} items={navItems} />
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
  const navigate = useNavigate()
  const [logo, setLogo] = useState(() => localStorage.getItem(LOGO_KEY) || 'w26.jpeg')

  useEffect(() => {
    localStorage.setItem(LOGO_KEY, logo)
  }, [logo])

  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (link) link.href = `/images/logos/${logo}`
  }, [logo])

  const handleLogoClick = () => {
    navigate('/legacy')
  }

  const handleLegacySelect = (file: string) => {
    setLogo(file)
    navigate('/')
  }

  return (
    <>
      <NeuralNetwork />
      <Routes>
        <Route path="/" element={<HomePage logo={logo} onLogoClick={handleLogoClick} />} />
        <Route path="/legacy" element={<LegacyPage onSelect={handleLegacySelect} />} />
        <Route path="/projects/:slug" element={<ProjectStory />} />
        <Route path="/experience/:slug" element={<ExperienceStory />} />
      </Routes>
    </>
  )
}