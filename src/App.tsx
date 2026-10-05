import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import ProjectStory from './components/ProjectStory'
import ExperienceStory from './components/ExperienceStory'

import CircularGalleryPage from './components/CircularGalleryPage'
import GalleryStory from './components/GalleryStory'
import BlogsPage from './components/BlogsPage'
import BlogStory from './components/BlogStory'
import { useNavItems } from './hooks/useNavItems'
import { useProfile } from './hooks/useProfile'
import { useJobTitle } from './hooks/useJobTitle'
import { useScrollRestoration } from './hooks/useScrollRestoration'
import LoadingSpinner from './components/LoadingSpinner'

const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const LoginPage = lazy(() => import('./admin/pages/LoginPage'))
const ProtectedRoute = lazy(() => import('./admin/ProtectedRoute'))
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage'))
const ProfilePage = lazy(() => import('./admin/pages/ProfilePage'))
const ResumePage = lazy(() => import('./admin/pages/ResumePage'))
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

const FALLBACK_LOGO = '/images/logos/w26.jpeg'

const MIME_TYPES: Record<string, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  ico: 'image/x-icon',
}

function faviconMime(url: string): string {
  const ext = url.split('?')[0].split('#')[0].split('.').pop()?.toLowerCase() ?? ''
  return MIME_TYPES[ext] ?? 'image/jpeg'
}

function applyFavicon(url: string) {
  if (!url) return
  for (const rel of ['icon', 'apple-touch-icon']) {
    // index.html only ships an empty placeholder, so create the tag on demand.
    let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
    if (!link) {
      link = document.createElement('link')
      link.rel = rel
      document.head.appendChild(link)
    }
    link.href = url
    link.type = faviconMime(url)
  }
}

function HomePage({ logoUrl, onLogoClick }: { logoUrl: string; onLogoClick: () => void }) {
  const { data: navItems } = useNavItems()
  const items = (navItems ?? []).map(n => ({ label: n.label, href: n.href }))
  return (
    <>
      <Navbar logoUrl={logoUrl} onLogoClick={onLogoClick} items={items} />
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
  const { data: profile, isFetched } = useProfile()
  const name = profile?.name ?? ''
  const jobTitle = useJobTitle()
  useScrollRestoration()

  // Navbar logo + favicon image: navbar avatar, else lanyard avatar, else the legacy jersey.
  const logoUrl = isFetched ? profile?.nav_avatar_url || profile?.avatar_url || FALLBACK_LOGO : ''

  useEffect(() => {
    if (!logoUrl) return
    applyFavicon(logoUrl)
  }, [logoUrl])

  useEffect(() => {
    if (!jobTitle) return
    document.title = `${name} | ${jobTitle}`
  }, [name, jobTitle])

  const handleLogoClick = () => {
    if (window.location.pathname !== '/') {
      // scrollTop hint tells useScrollRestoration to go to the top instead of
      // restoring wherever the homepage was last left.
      navigate('/', { state: { scrollTop: 0 } })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage logoUrl={logoUrl} onLogoClick={handleLogoClick} />} />
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
            <Route path="resume" element={<S><ResumePage /></S>} />
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
