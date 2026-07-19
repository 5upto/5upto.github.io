import { useState, useEffect, useRef } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'
import {
  MdHome,
  MdPerson,
  MdWork,
  MdFolder,
  MdSchool,
  MdCardMembership,
  MdMenuBook,
  MdLightbulb,
  MdLink,
  MdArticle,
  MdPhotoLibrary,
  MdMenu,
  MdCloudUpload,
  MdDarkMode,
  MdLightMode,
  MdLogout,
  MdLaunch,
  MdChevronLeft,
  MdClose,
  MdMenuOpen,
} from 'react-icons/md'

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: MdHome },
  { label: 'Profile', href: '/admin/profile', icon: MdPerson },
  { label: 'Experiences', href: '/admin/experiences', icon: MdWork },
  { label: 'Projects', href: '/admin/projects', icon: MdFolder },
  { label: 'Education', href: '/admin/education', icon: MdSchool },
  { label: 'Certifications', href: '/admin/certifications', icon: MdCardMembership },
  { label: 'Publications', href: '/admin/publications', icon: MdMenuBook },
  { label: 'Skills', href: '/admin/skills', icon: MdLightbulb },
  { label: 'Social Links', href: '/admin/social-links', icon: MdLink },
  { label: 'Blogs', href: '/admin/blogs', icon: MdArticle },
  { label: 'Gallery', href: '/admin/gallery', icon: MdPhotoLibrary },
  { label: 'Nav Items', href: '/admin/nav-items', icon: MdMenu },
  { label: 'Storage', href: '/admin/storage', icon: MdCloudUpload },
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
            className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0">
            {dark ? (
              <MdLightMode className="w-4 h-4" />
            ) : (
              <MdDarkMode className="w-4 h-4" />
            )}
          </button>
        )}
        <button onClick={onToggleCollapse} title={collapsed ? 'Expand' : 'Collapse'}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0">
          <MdChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {!collapsed && <p className="px-3 mb-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Menu</p>}
        {sidebarItems.map((item) => {
          const isActive = currentPath === item.href || (item.href === '/admin' && currentPath === '/admin')
          return (
            <button key={item.href} onClick={() => onNavigate(item.href)} title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-primary-600/15 text-primary-400 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}>
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
              {!collapsed && item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-[var(--border)]" ref={menuRef}>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} title={collapsed ? 'Menu' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all ${collapsed ? 'justify-center' : ''}`}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-semibold shrink-0">S</div>
            )}
            {!collapsed && <span className="truncate">{userEmail}</span>}
          </button>
          {showMenu && (
            <div className={`absolute bottom-full mb-2 ${collapsed ? 'left-0' : 'left-0 right-0'} bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-xl py-1.5 z-50 min-w-[160px]`}>
              <button onClick={() => { setShowMenu(false); window.open('/', '_blank') }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
                <MdLaunch className="w-4 h-4" />
                Go to Portfolio
              </button>
              <div className="my-1 border-t border-[var(--border)]" />
              <button onClick={() => { setShowMenu(false); onSignOut() }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                <MdLogout className="w-4 h-4" />
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
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

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
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 flex items-center px-4 z-40">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 -ml-2 rounded-xl hover:bg-[var(--bg-elevated)] text-[var(--text-muted)]">
          {mobileOpen ? (
            <MdClose className="w-5 h-5" />
          ) : (
            <MdMenuOpen className="w-5 h-5" />
          )}
        </button>
        {/* Theme toggle */}
        <button onClick={() => setDark(!dark)} className="ml-auto p-2 rounded-xl hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors">
          {dark ? (
            <MdLightMode className="w-5 h-5" />
          ) : (
            <MdDarkMode className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)} />}

      {/* Desktop sidebar */}
      <aside className={`${collapsed ? 'w-[72px]' : 'w-60'} hidden lg:flex flex-col fixed h-full border-r border-[var(--glass-border)] backdrop-blur-xl bg-[var(--glass-bg)] z-30 transition-all duration-300`}>
        <SidebarContent collapsed={collapsed} onNavigate={(href) => navigate(href)} currentPath={location.pathname} userEmail={user?.email} onSignOut={handleSignOut} onToggleCollapse={() => setCollapsed(!collapsed)} dark={dark} onToggleTheme={() => setDark(!dark)} showThemeToggle={true} avatarUrl={profile?.avatar_url} />
      </aside>

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 w-72 h-full z-50 shadow-2xl border-r border-[var(--border)] transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: dark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)' }}>
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
