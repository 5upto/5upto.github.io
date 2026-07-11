import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

interface NavbarProps {
  logo: string
  onLogoClick: () => void
}

export default function Navbar({ logo, onLogoClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const menuRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return

    if (mobileOpen) {
      menu.style.display = 'block'
      const items = menu.querySelectorAll('.mobile-nav-item')
      gsap.set(menu, { height: 0, opacity: 0 })
      gsap.set(items, { y: -10, opacity: 0 })

      tlRef.current = gsap.timeline()
        .to(menu, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power3.out' })
        .to(items, { y: 0, opacity: 1, duration: 0.25, stagger: 0.05, ease: 'power2.out' }, '-=0.1')
    } else {
      if (tlRef.current) {
        tlRef.current.reverse()
        tlRef.current.eventCallback('onReverseComplete', () => {
          if (menu) menu.style.display = 'none'
        })
      } else {
        menu.style.display = 'none'
      }
    }
  }, [mobileOpen])

  const toggleMenu = () => setMobileOpen(prev => !prev)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[var(--nav-bg)] backdrop-blur-lg shadow-lg shadow-black/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={onLogoClick} className="group w-10 overflow-hidden rounded-lg aspect-[513/531]">
          <img
            src={`/images/logos/${logo}`}
            alt="26"
            className="w-full h-full object-cover"
          />
        </button>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
        <button
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-2"
          onClick={() => setDark(!dark)}
          aria-label="Toggle theme"
        >
          {dark ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>
        <button
          className="md:hidden flex flex-col items-center justify-center w-9 h-9 gap-[5px] group"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span className={`block w-5 h-[2px] bg-current rounded transition-all duration-300 ${mobileOpen ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`block w-5 h-[2px] bg-current rounded transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-[2px] bg-current rounded transition-all duration-300 ${mobileOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </div>
      <div ref={menuRef} className="md:hidden bg-[var(--bg-secondary)] backdrop-blur-lg border-t border-[var(--border)] overflow-hidden" style={{ display: 'none' }}>
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => { setMobileOpen(false); tlRef.current?.kill(); if (menuRef.current) menuRef.current.style.display = 'none' }}
              className="mobile-nav-item block text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
