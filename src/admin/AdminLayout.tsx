import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Profile', href: '/admin/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { label: 'Experiences', href: '/admin/experiences', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'Projects', href: '/admin/projects', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Education', href: '/admin/education', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
  { label: 'Certifications', href: '/admin/certifications', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { label: 'Publications', href: '/admin/publications', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { label: 'Skills', href: '/admin/skills', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { label: 'Social Links', href: '/admin/social-links', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { label: 'Blogs', href: '/admin/blogs', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { label: 'Gallery', href: '/admin/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Nav Items', href: '/admin/nav-items', icon: 'M4 6h16M4 12h16M4 18h16' },
  { label: 'Storage', href: '/admin/storage', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
]

function SidebarContent({ collapsed, onNavigate, currentPath, userEmail, onSignOut, onToggleCollapse, dark, onToggleTheme, showThemeToggle = true }: {
  collapsed: boolean
  onNavigate: (href: string) => void
  currentPath: string
  userEmail?: string
  onSignOut: () => void
  onToggleCollapse: () => void
  dark: boolean
  onToggleTheme: () => void
  showThemeToggle?: boolean
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'gap-3'} border-b border-[var(--border)]`}>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-[var(--text-muted)] truncate">{userEmail}</p>
          </div>
        )}
        {!collapsed && showThemeToggle && (
          <button onClick={onToggleTheme} title={dark ? 'Light mode' : 'Dark mode'}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0">
            {dark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        )}
        <button onClick={onToggleCollapse} title={collapsed ? 'Expand' : 'Collapse'}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0">
          <svg className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
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
              <svg className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2 : 1.5} d={item.icon} />
              </svg>
              {!collapsed && item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-[var(--border)]">
        <button onClick={onSignOut} title={collapsed ? 'Sign Out' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && 'Sign Out'}
        </button>
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

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleSignOut = async () => { await signOut(); navigate('/admin/login') }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 flex items-center px-4 z-40">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 -ml-2 rounded-xl hover:bg-[var(--bg-elevated)] text-[var(--text-muted)]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        {/* Theme toggle */}
        <button onClick={() => setDark(!dark)} className="ml-auto p-2 rounded-xl hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors">
          {dark ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)} />}

      {/* Desktop sidebar */}
      <aside className={`${collapsed ? 'w-[72px]' : 'w-60'} hidden lg:flex flex-col fixed h-full border-r border-[var(--glass-border)] backdrop-blur-xl bg-[var(--glass-bg)] z-30 transition-all duration-300`}>
        <SidebarContent collapsed={collapsed} onNavigate={(href) => navigate(href)} currentPath={location.pathname} userEmail={user?.email} onSignOut={handleSignOut} onToggleCollapse={() => setCollapsed(!collapsed)} dark={dark} onToggleTheme={() => setDark(!dark)} showThemeToggle={true} />
      </aside>

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 w-72 h-full z-50 shadow-2xl border-r border-[var(--border)] transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: dark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)' }}>
        <SidebarContent collapsed={false} onNavigate={(href) => navigate(href)} currentPath={location.pathname} userEmail={user?.email} onSignOut={handleSignOut} onToggleCollapse={() => setMobileOpen(false)} dark={dark} onToggleTheme={() => setDark(!dark)} showThemeToggle={false} />
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
