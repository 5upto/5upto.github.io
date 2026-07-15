import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
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
import ParticleBackground from './components/ParticleBackground'
import CircularGalleryPage from './components/CircularGalleryPage'
import GalleryStory from './components/GalleryStory'
import BlogsPage from './components/BlogsPage'
import BlogStory from './components/BlogStory'
import { useNavItems } from './hooks/useNavItems'
import LoadingSpinner from './components/LoadingSpinner'

const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const LoginPage = lazy(() => import('./admin/pages/LoginPage'))
const ProtectedRoute = lazy(() => import('./admin/ProtectedRoute'))
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage'))
const ProfilePage = lazy(() => import('./admin/pages/ProfilePage'))
const ExperiencesPage = lazy(() => import('./admin/pages/ExperiencesPage'))
const ProjectsPage = lazy(() => import('./admin/pages/ProjectsPage'))
const EducationPage = lazy(() => import('./admin/pages/EducationPage'))
const CertificationsPage = lazy(() => import('./admin/pages/CertificationsPage'))
const PublicationsPage = lazy(() => import('./admin/pages/PublicationsPage'))
const SkillsPage = lazy(() => import('./admin/pages/SkillsPage'))
const SocialLinksPage = lazy(() => import('./admin/pages/SocialLinksPage'))
const BlogsAdminPage = lazy(() => import('./admin/pages/BlogsAdminPage'))
const GalleryAdminPage = lazy(() => import('./admin/pages/GalleryAdminPage'))
const NavItemsPage = lazy(() => import('./admin/pages/NavItemsPage'))
const StoragePage = lazy(() => import('./admin/pages/StoragePage'))

const LOGO_KEY = 'portfolio-logo'

function HomePage({ logo, onLogoClick }: { logo: string; onLogoClick: () => void }) {
  const { data: navItems } = useNavItems()
  const items = (navItems ?? []).map(n => ({ label: n.label, href: n.href }))
  return (
    <>
      <Navbar logo={logo} onLogoClick={onLogoClick} items={items} />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
    </>
  )
}

function LegacyPage({ onSelect }: { onSelect: (file: string) => void }) {
  return <Legacy onBack={() => window.history.back()} onSelect={onSelect} />
}

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <LoadingSpinner />
    </div>
  )
}

const S = ({ children }: { children: React.ReactNode }) => <Suspense fallback={<AdminFallback />}>{children}</Suspense>

export default function App() {
  const navigate = useNavigate()
  const [logo, setLogo] = useState(() => localStorage.getItem(LOGO_KEY) || 'w26.jpeg')

  useEffect(() => { localStorage.setItem(LOGO_KEY, logo) }, [logo])

  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (link) link.href = `/images/logos/${logo}`
  }, [logo])

  const handleLogoClick = () => navigate('/legacy')
  const handleLegacySelect = (file: string) => { setLogo(file); navigate('/') }

  return (
    <>
      <ParticleBackground />
      <Routes>
        <Route path="/" element={<HomePage logo={logo} onLogoClick={handleLogoClick} />} />
        <Route path="/legacy" element={<LegacyPage onSelect={handleLegacySelect} />} />
        <Route path="/projects/:slug" element={<ProjectStory />} />
        <Route path="/experience/:slug" element={<ExperienceStory />} />
        <Route path="/gallery" element={<CircularGalleryPage />} />
        <Route path="/gallery/:slug" element={<GalleryStory />} />
        <Route path="/blog" element={<BlogsPage />} />
        <Route path="/blog/:slug" element={<BlogStory />} />
        <Route path="/admin/login" element={<S><LoginPage /></S>} />
        <Route path="/admin" element={<S><ProtectedRoute /></S>}>
          <Route element={<S><AdminLayout /></S>}>
            <Route index element={<S><DashboardPage /></S>} />
            <Route path="profile" element={<S><ProfilePage /></S>} />
            <Route path="experiences" element={<S><ExperiencesPage /></S>} />
            <Route path="projects" element={<S><ProjectsPage /></S>} />
            <Route path="education" element={<S><EducationPage /></S>} />
            <Route path="certifications" element={<S><CertificationsPage /></S>} />
            <Route path="publications" element={<S><PublicationsPage /></S>} />
            <Route path="skills" element={<S><SkillsPage /></S>} />
            <Route path="social-links" element={<S><SocialLinksPage /></S>} />
            <Route path="blogs" element={<S><BlogsAdminPage /></S>} />
            <Route path="gallery" element={<S><GalleryAdminPage /></S>} />
            <Route path="nav-items" element={<S><NavItemsPage /></S>} />
            <Route path="storage" element={<S><StoragePage /></S>} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}
