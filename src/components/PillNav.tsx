import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'

export type PillNavItem = {
  label: string
  href: string
}

interface PillNavProps {
  logo: string
  onLogoClick: () => void
  items: PillNavItem[]
}

export default function PillNav({ logo, onLogoClick, items }: PillNavProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([])
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([])
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([])
  const navItemsRef = useRef<HTMLDivElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    let rafId: number
    const check = () => {
      setScrolled(window.scrollY > 80)
      rafId = requestAnimationFrame(check)
    }
    rafId = requestAnimationFrame(check)
    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return
        const pill = circle.parentElement as HTMLElement
        const rect = pill.getBoundingClientRect()
        const { width: w, height: h } = rect
        const R = ((w * w) / 4 + h * h) / (2 * h)
        const D = Math.ceil(2 * R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        const originY = D - delta

        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        })

        const label = pill.querySelector<HTMLElement>('.pill-label')
        const white = pill.querySelector<HTMLElement>('.pill-label-hover')

        if (label) gsap.set(label, { y: 0 })
        if (white) gsap.set(white, { y: h + 12, opacity: 0 })

        const index = circleRefs.current.indexOf(circle)
        if (index === -1) return

        tlRefs.current[index]?.kill()
        const tl = gsap.timeline({ paused: true })
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: 'power3.easeOut', overwrite: 'auto' }, 0)
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease: 'power3.easeOut', overwrite: 'auto' }, 0)
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 })
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease: 'power3.easeOut', overwrite: 'auto' }, 0)
        }
        tlRefs.current[index] = tl
      })
    }

    layout()
    const onResize = () => layout()
    window.addEventListener('resize', onResize)
    if (document.fonts) document.fonts.ready.then(layout).catch(() => {})

    const menu = mobileMenuRef.current
    if (menu) gsap.set(menu, { visibility: 'hidden', opacity: 0, y: 0 })

    if (navItemsRef.current) {
      gsap.set(navItemsRef.current, { width: 0 })
      gsap.to(navItemsRef.current, {
        width: 'auto',
        duration: 0.6,
        ease: 'power3.easeOut',
        onComplete: () => {
          if (navItemsRef.current) navItemsRef.current.style.width = ''
        }
      })
    }

    return () => window.removeEventListener('resize', onResize)
  }, [items])

  useEffect(() => {
    if (!mobileOpen) {
      const menu = mobileMenuRef.current
      const hamburger = hamburgerRef.current
      if (menu) {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          duration: 0.2,
          ease: 'power3.easeOut',
          onComplete: () => gsap.set(menu, { visibility: 'hidden' })
        })
      }
      if (hamburger) {
        const lines = hamburger.querySelectorAll('.hamburger-line')
        if (lines.length >= 2) {
          gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: 'power3.easeOut' })
          gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: 'power3.easeOut' })
        }
      }
    }
  }, [mobileOpen])

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: 'power3.easeOut',
      overwrite: 'auto'
    })
  }

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: 'power3.easeOut',
      overwrite: 'auto'
    })
  }

  const toggleMobile = () => {
    const newState = !mobileOpen
    setMobileOpen(newState)

    const hamburger = hamburgerRef.current
    const menu = mobileMenuRef.current

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line')
      if (lines.length >= 2) {
        if (newState) {
          gsap.to(lines[0], { rotation: 45, y: 3.5, duration: 0.3, ease: 'power3.easeOut' })
          gsap.to(lines[1], { rotation: -45, y: -3.5, duration: 0.3, ease: 'power3.easeOut' })
        } else {
          gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: 'power3.easeOut' })
          gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: 'power3.easeOut' })
        }
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' })
        gsap.fromTo(menu,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power3.easeOut' }
        )
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          duration: 0.2,
          ease: 'power3.easeOut',
          onComplete: () => gsap.set(menu, { visibility: 'hidden' })
        })
      }
    }
  }

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    if (mobileMenuRef.current) gsap.set(mobileMenuRef.current, { visibility: 'hidden' })
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(href)
    }
  }

  const baseStyle: React.CSSProperties = {
    '--nav-h': '42px',
    '--pill-pad-x': '18px',
    '--pill-gap': '3px'
  } as React.CSSProperties

  const isActive = (href: string) => {
    if (href.startsWith('#')) return location.hash === href
    return location.pathname === href
  }

  const pillBtnClasses =
    'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-sm leading-none tracking-[0.2px] whitespace-nowrap cursor-pointer px-0'

  return (
    <nav className="fixed top-0 left-0 right-0 z-[999]" style={{ ...baseStyle, height: 56 }}>
      <div
        className="flex items-center justify-center w-full h-full transition-all duration-300"
        style={{
          padding: scrolled ? '7px 1rem 0' : '0 1rem'
        }}
      >
        <div
          className="flex items-center transition-all duration-300"
          style={{
            height: 'var(--nav-h)',
            background: scrolled ? 'var(--bg-card)' : 'transparent',
            borderRadius: scrolled ? '9999px' : 0,
            padding: scrolled ? '0 2px' : '0 0.75rem',
            gap: scrolled ? 0 : 10,
            width: scrolled ? 'auto' : '100%',
            justifyContent: scrolled ? 'normal' : 'center'
          }}
        >
          <button
            onClick={onLogoClick}
            aria-label="Home"
            className="rounded-full p-[3px] inline-flex items-center justify-center overflow-hidden shrink-0"
            style={{ width: 'var(--nav-h)', height: 'var(--nav-h)' }}
          >
            <img src={`/images/logos/${logo}`} alt="logo" className="w-full h-full object-cover block rounded-full" />
          </button>

          <div
            ref={navItemsRef}
            className="hidden md:flex items-center h-full"
            style={{ overflow: 'visible' }}
          >
            <ul role="menubar" className="list-none flex items-stretch m-0 p-[3px] h-full" style={{ gap: 'var(--pill-gap)' }}>
              {items.map((item, i) => {
                const active = isActive(item.href)
                return (
                  <li key={item.href} role="none" className="flex h-full">
                    <button
                      role="menuitem"
                      onClick={() => handleNavClick(item.href)}
                      className={pillBtnClasses}
                      style={{
                        background: scrolled ? 'var(--bg-card)' : 'transparent',
                        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                        paddingLeft: 'var(--pill-pad-x)',
                        paddingRight: 'var(--pill-pad-x)',
                        transition: 'background 0.35s ease, color 0.35s ease'
                      }}
                      onMouseEnter={scrolled ? () => handleEnter(i) : undefined}
                      onMouseLeave={scrolled ? () => handleLeave(i) : undefined}
                    >
                      <span
                        className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                        style={{ background: 'var(--accent)', willChange: 'transform' }}
                        aria-hidden="true"
                        ref={el => { circleRefs.current[i] = el }}
                      />
                      <span className="label-stack relative inline-block leading-none z-[2]">
                        <span className="pill-label relative z-[2] inline-block leading-none" style={{ willChange: 'transform' }}>
                          {item.label}
                        </span>
                        <span
                          className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                          style={{ color: '#fff', willChange: 'transform, opacity' }}
                          aria-hidden="true"
                        >
                          {item.label}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <button
            className="rounded-full flex items-center justify-center shrink-0 transition-colors"
            style={{ width: 'var(--nav-h)', height: 'var(--nav-h)' }}
            onClick={() => setDark(d => !d)}
            aria-label="Toggle theme"
          >
            {dark ? (
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          <button
            ref={hamburgerRef}
            onClick={toggleMobile}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-[5px] cursor-pointer p-0 shrink-0"
            style={{ width: 'var(--nav-h)', height: 'var(--nav-h)' }}
          >
            <span className="hamburger-line block w-4 h-[2px] rounded-full" style={{ background: 'var(--text-muted)' }} />
            <span className="hamburger-line block w-4 h-[2px] rounded-full" style={{ background: 'var(--text-muted)' }} />
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU (shared) ── */}
      <div
        ref={mobileMenuRef}
        className="md:hidden absolute top-[4.5em] left-4 right-4 rounded-[27px] shadow-lg z-[998] origin-top overflow-hidden"
        style={{ background: 'var(--bg-card)' }}
      >
        <ul className="list-none m-0 p-[3px] flex flex-col gap-[3px]">
          {items.map(item => (
            <li key={item.href}>
              <button
                onClick={() => handleNavClick(item.href)}
                className="w-full text-left py-3 px-4 text-sm font-medium rounded-[50px] transition-all duration-200"
                style={{ color: isActive(item.href) ? 'var(--accent)' : 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-secondary)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => { toggleMobile(); navigate('/legacy') }}
              className="w-full text-left py-3 px-4 text-sm font-medium rounded-[50px] transition-all duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-secondary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              Legacy
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
