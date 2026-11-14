import { useState, useEffect, useRef } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'
import { sectionIcons, type NavIcon } from '../lib/navIcons'
import {
  MdDarkMode,
  MdOutlineDarkMode,
  MdLightMode,
  MdOutlineLightMode,
  MdLogout,
  MdOutlineLogout,
  MdPublic,
  MdOutlinePublic,
  MdNavigateBefore,
  MdOutlineNavigateBefore,
  MdCancel,
  MdMenu,
} from 'react-icons/md'
import AdaptiveIcon from '../components/AdaptiveIcon'

const sidebarItems: { label: string; href: string; icon: NavIcon }[] = [
  { label: 'Dashboard', href: '/admin', icon: sectionIcons.home },
  { label: 'Profile', href: '/admin/profile', icon: sectionIcons.profile },
  { label: 'Lanyard Card', href: '/admin/lanyard', icon: sectionIcons.lanyard },
  { label: 'Hero Background', href: '/admin/hero-background', icon: sectionIcons.heroBackground },
  { label: 'Resume', href: '/admin/resume', icon: sectionIcons.resume },
  { label: 'Experiences', href: '/admin/experiences', icon: sectionIcons.experience },
  { label: 'Projects', href: '/admin/projects', icon: sectionIcons.projects },
  { label: 'Education', href: '/admin/education', icon: sectionIcons.education },
  { label: 'Certifications', href: '/admin/certifications', icon: sectionIcons.certifications },
  { label: 'Publications', href: '/admin/publications', icon: sectionIcons.publications },
  { label: 'Skills', href: '/admin/skills', icon: sectionIcons.skills },
  { label: 'Social Links', href: '/admin/social-links', icon: sectionIcons.socialLinks },
  { label: 'Blogs', href: '/admin/blogs', icon: sectionIcons.blog },
  { label: 'Gallery', href: '/admin/gallery', icon: sectionIcons.gallery },
  { label: 'Nav Items', href: '/admin/nav-items', icon: sectionIcons.navItems },
  { label: 'Storage', href: '/admin/storage', icon: sectionIcons.storage },
]

function SidebarContent({ collapsed, onNavigate, currentPath, userEmail, onSignOut, onToggleCollapse, dark, onToggleTheme, showThemeToggle = true, avatarUrl }: {
  collapsed: boolean
  onNavigate: (href: string) => void
  currentPath: string
  userEmail?: string
  onSignOut: () => void
  onToggleCollapse: () => void
  dark: boolean
  onToggleTheme: () => void
  showThemeToggle?: boolean
  avatarUrl?: string
}) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'gap-3'} border-b border-[var(--border)]`}>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-primary-400 font-display tracking-wide">Shawon's Space</p>
          </div>
        )}
        {!collapsed && showThemeToggle && (
          <button onClick={onToggleTheme} title={dark ? 'Light mode' : 'Dark mode'}
            className="group p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0">
            {dark ? (
              <AdaptiveIcon outline={MdOutlineLightMode} filled={MdLightMode} className="w-4 h-4" />
            ) : (
              <AdaptiveIcon outline={MdOutlineDarkMode} filled={MdDarkMode} className="w-4 h-4" />
            )}
          </button>
        )}
        <button onClick={onToggleCollapse} title={collapsed ? 'Expand' : 'Collapse'}
          className="group p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0">
          <AdaptiveIcon
            outline={MdOutlineNavigateBefore}
            filled={MdNavigateBefore}
            className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {!collapsed && <p className="px-3 mb-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Menu</p>}
        {sidebarItems.map((item) => {
          const isActive = currentPath === item.href || (item.href === '/admin' && currentPath === '/admin')
          return (
            <button key={item.href} onClick={() => onNavigate(item.href)} title={collapsed ? item.label : undefined}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-primary-600/15 text-primary-400 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}>
              <AdaptiveIcon
                outline={item.icon.outline}
                filled={item.icon.filled}
                active={isActive}
                className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`}
              />
              {!collapsed && item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-[var(--border)]" ref={menuRef}>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} title={collapsed ? 'Menu' : undefined}
            className={`w-full flex items-center rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5'}`}>
            {avatarUrl ? (
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                <img src={avatarUrl} alt="" width={28} height={28} className="block w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-semibold shrink-0">S</div>
            )}
            {!collapsed && <span className="truncate">{userEmail}</span>}
          </button>
          {showMenu && (
            <div className={`absolute bottom-full mb-2 ${collapsed ? 'left-0' : 'left-0 right-0'} bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-xl py-1.5 z-50 min-w-[160px]`}>
              <button onClick={() => { setShowMenu(false); window.open('/', '_blank') }}
                className="group w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
                <AdaptiveIcon outline={MdOutlinePublic} filled={MdPublic} className="w-4 h-4" />
                Go to Portfolio
              </button>
              <div className="my-1 border-t border-[var(--border)]" />
              <button onClick={() => { setShowMenu(false); onSignOut() }}
                className="group w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                <AdaptiveIcon outline={MdOutlineLogout} filled={MdLogout} className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { data: profile } = useQuery({
    queryKey: ['admin-sidebar-profile'],
    queryFn: async () => { const { data, error } = await supabase.from('profile').select('avatar_url').limit(1).single(); if (error) throw error; return data as Profile },
  })

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleSignOut = async () => { await signOut(); navigate('/admin/login') }

  return (
    <div className="min-h-screen relative z-10" style={{ background: 'transparent' }}>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 px-4 pt-3">
        <div className="flex items-center h-11 transition-all duration-300"
          style={{
            gap: scrolled ? '4px' : '0',
            justifyContent: 'space-between',
            background: scrolled ? 'color-mix(in srgb, var(--bg-card) 80%, transparent)' : 'transparent',
            backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
            border: scrolled ? '1px solid color-mix(in srgb, var(--border) 50%, transparent)' : '1px solid transparent',
            boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.06)' : 'none',
            borderRadius: scrolled ? '9999px' : '16px',
            padding: scrolled ? '0 6px' : '0',
          }}>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="group flex items-center justify-center w-9 h-9 shrink-0 rounded-full hover:bg-[var(--bg-elevated)] text-[var(--text-muted)]">
            {mobileOpen ? (
              <MdCancel className="block w-5 h-5" />
            ) : (
              <MdMenu className="block w-5 h-5" />
            )}
          </button>
          {/* Theme toggle */}
          <button onClick={() => setDark(!dark)} className="group flex items-center justify-center w-9 h-9 shrink-0 rounded-full hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors">
            {dark ? (
              <AdaptiveIcon outline={MdOutlineLightMode} filled={MdLightMode} className="block w-5 h-5" />
            ) : (
              <AdaptiveIcon outline={MdOutlineDarkMode} filled={MdDarkMode} className="block w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)} />}

      {/* Desktop sidebar */}
      <aside className={`${collapsed ? 'w-[72px]' : 'w-60'} hidden lg:flex flex-col fixed h-full border-r border-[var(--glass-border)] backdrop-blur-xl bg-[var(--glass-bg)] z-30 transition-all duration-300`}>
        <SidebarContent collapsed={collapsed} onNavigate={(href) => navigate(href)} currentPath={location.pathname} userEmail={user?.email} onSignOut={handleSignOut} onToggleCollapse={() => setCollapsed(!collapsed)} dark={dark} onToggleTheme={() => setDark(!dark)} showThemeToggle={true} avatarUrl={profile?.avatar_url} />
      </aside>

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 w-72 h-full z-50 shadow-2xl border-r border-[var(--border)] transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: dark ? 'rgba(18,18,18,0.96)' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)' }}>
        <SidebarContent collapsed={false} onNavigate={(href) => navigate(href)} currentPath={location.pathname} userEmail={user?.email} onSignOut={handleSignOut} onToggleCollapse={() => setMobileOpen(false)} dark={dark} onToggleTheme={() => setDark(!dark)} showThemeToggle={false} avatarUrl={profile?.avatar_url} />
      </aside>

      {/* Main content */}
      <main className={`${collapsed ? 'lg:ml-[72px]' : 'lg:ml-60'} pt-14 lg:pt-0 min-h-screen transition-all duration-300`}>
        <div className="p-4 lg:p-6 xl:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
