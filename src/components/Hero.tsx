import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import Lanyard from './lanyard/Lanyard'
import HeroBackground from './backgrounds/HeroBackground'
import { useProfile } from '../hooks/useProfile'
import { useSound } from '../hooks/useSound'
import { useExperiences } from '../hooks/useExperiences'
import { useLiveResume } from '../hooks/useResumes'
import { useLanyardSettings } from '../hooks/useLanyardSettings'
import { useHeroBackgroundSettings } from '../hooks/useHeroBackgroundSettings'
import { renderCardBack, renderCardFront, renderRibbon } from '../lib/lanyardCard'
import type { LanyardSettings } from '../types/database'

function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    )
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}

function useIdCardImages(profile: any, currentExp: any, settings: LanyardSettings, ready = true) {
  const [images, setImages] = useState<{ front: string | null; back: string | null; band: string | null }>({ front: null, back: null, band: null })
  const [themeTick, setThemeTick] = useState(0)

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => setThemeTick(t => t + 1))
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!profile || !ready) return
    let cancelled = false

    renderCardFront({
      name: profile.name || '',
      role: currentExp?.role || profile.title || '',
      avatarUrl: profile.avatar_url,
      isDark: document.documentElement.classList.contains('dark'),
      settings,
    })
      .then((front) => { if (!cancelled) setImages(prev => ({ ...prev, front })) })
      .catch(() => { /* keep the previous card */ })

    return () => { cancelled = true }
  }, [profile, currentExp?.role, settings, themeTick, ready])

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    const isDark = document.documentElement.classList.contains('dark')

    Promise.all([
      renderCardBack({ logoUrl: currentExp?.logo, isDark, settings }),
      renderRibbon({ company: currentExp?.company || '', logoUrl: currentExp?.logo, isDark, settings }),
    ])
      .then(([back, band]) => {
        if (!cancelled) setImages(prev => ({ ...prev, back, band }))
      })
      .catch(() => { /* keep the previous card */ })

    return () => { cancelled = true }
  }, [currentExp?.logo, currentExp?.company, settings, themeTick, ready])

  return images
}

function NameReveal({ en, bn }: { en: ReactNode[]; bn: ReactNode[] }) {
  const boxRef = useRef<HTMLSpanElement>(null)
  const clipRef = useRef<HTMLSpanElement>(null)
  const ellipseRef = useRef<SVGRectElement>(null)
  const clipId = useId()
  const stateRef = useRef({
    tx: -300,
    ty: -300,
    x: -300,
    y: -300,
    vx: 0,
    vy: 0,
    r: 0,
    tr: 0,
  })
  const rafRef = useRef(0)
  const OVERSHOOT = 80
  const WORD_GAP = '0.35em'
  const marginFor = (i: number) =>
    i < en.length - 1 ? (i === 0 ? '0.65em' : WORD_GAP) : undefined

  const update = useCallback(() => {
    rafRef.current = 0
    const ell = ellipseRef.current
    const s = stateRef.current
    if (!ell) return

    const prevX = s.x
    const prevY = s.y

    // Balloon-like lag: chase the cursor with soft inertia.
    s.x += (s.tx - s.x) * 0.22
    s.y += (s.ty - s.y) * 0.22

    // Smoothed frame velocity (decays to rest when idle).
    const dvx = s.x - prevX
    const dvy = s.y - prevY
    s.vx += (dvx - s.vx) * 0.3
    s.vy += (dvy - s.vy) * 0.3

    // Reveal radius (grows on hover, collapses on leave).
    const diff = s.tr - s.r
    if (Math.abs(diff) > 0.5) s.r += diff * 0.2
    else s.r = s.tr

    // Pill (capsule) that stretches along the direction of movement,
    // keeping rounded ends and parallel sides instead of a pointed ellipse.
    const speed = Math.hypot(s.vx, s.vy)
    const stretch = Math.min(1, speed / 14)
    const angle = speed > 0.01 ? Math.atan2(s.vy, s.vx) : 0
    const lead = 24 * stretch
    const cx = s.x + Math.cos(angle) * lead + OVERSHOOT
    const cy = s.y + Math.sin(angle) * lead + OVERSHOOT
    const halfLen = s.r * (1 + stretch * 1.0)
    const halfWid = s.r

    ell.setAttribute('x', String(cx - halfLen))
    ell.setAttribute('y', String(cy - halfWid))
    ell.setAttribute('width', String(Math.max(0.02, halfLen * 2)))
    ell.setAttribute('height', String(Math.max(0.02, halfWid * 2)))
    ell.setAttribute('rx', String(Math.max(0.01, halfWid)))
    ell.setAttribute('ry', String(Math.max(0.01, halfWid)))
    ell.setAttribute('transform', `rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`)

    const chasing = Math.abs(s.tx - s.x) > 0.5 || Math.abs(s.ty - s.y) > 0.5
    const growing = Math.abs(s.tr - s.r) > 0.5
    const moving = speed > 0.05
    if (chasing || growing || moving) {
      rafRef.current = requestAnimationFrame(update)
    }
  }, [])

  const schedule = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(update)
  }, [update])

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      const rect = boxRef.current?.getBoundingClientRect()
      if (!rect) return
      stateRef.current.tx = e.clientX - rect.left
      stateRef.current.ty = e.clientY - rect.top
      stateRef.current.tr = 58
      schedule()
    },
    [schedule]
  )

  const handleLeave = useCallback(() => {
    stateRef.current.tr = 0
    stateRef.current.vx = 0
    stateRef.current.vy = 0
    schedule()
  }, [schedule])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return (
    <span
      ref={boxRef}
      className="relative inline-block max-w-full cursor-crosshair"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span className="flex whitespace-nowrap">
        {en.map((word, i) => (
          <span key={i} style={{ marginRight: marginFor(i) }}>{word}</span>
        ))}
      </span>
      <span
        ref={clipRef}
        aria-hidden
        className="absolute bg-black text-white dark:bg-white dark:text-black"
        style={{
          left: -OVERSHOOT,
          right: -OVERSHOOT,
          top: -OVERSHOOT,
          bottom: -OVERSHOOT,
          padding: OVERSHOOT,
          display: 'flex',
          clipPath: `url(#${clipId})`,
        }}
      >
        {en.map((word, i) => (
          <span key={i} className="relative" style={{ whiteSpace: 'nowrap', marginRight: marginFor(i) }}>
            <span style={{ visibility: 'hidden' }}>{word}</span>
            <span
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap',
              }}
            >
              {bn[i]}
            </span>
          </span>
        ))}
      </span>
      <svg aria-hidden className="absolute w-0 h-0 overflow-hidden">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <rect ref={ellipseRef} x="0" y="0" width="0" height="0" rx="0" ry="0" />
          </clipPath>
        </defs>
      </svg>
    </span>
  )
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const { data: profile } = useProfile()
  const { data: experiences, isFetched: experiencesFetched } = useExperiences()
  const { data: lanyardSettings, isFetched: lanyardSettingsFetched } = useLanyardSettings()
  const { data: heroBackground, isFetched: heroBackgroundFetched } = useHeroBackgroundSettings()
  const { data: resume } = useLiveResume()
  const currentExp = experiences?.[0] ?? null
  const { play } = useSound()
  const isDark = useIsDarkTheme()
  const jobTitle = currentExp?.role || profile?.title || ''
  const lanyardReady = experiencesFetched && lanyardSettingsFetched
  const { front, back, band } = useIdCardImages(profile, currentExp, lanyardSettings, lanyardReady)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(textRef.current?.children ?? [],
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }
    )
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!profile) return null

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative isolate min-h-svh flex items-center px-4 py-12 overflow-hidden"
    >
      {heroBackgroundFetched && <HeroBackground settings={heroBackground} isDark={isDark} />}
      {front && <Lanyard frontImage={front} backImage={back} lanyardImage={band} coverColor={lanyardSettings.coverColor} position={[0, 0, 28]} fov={18} transparent />}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col landscape:flex-row md:flex-row items-center gap-8 landscape:gap-16 md:gap-16 pointer-events-none">
        <div ref={textRef} className="hidden landscape:block md:block w-full landscape:w-1/2 md:w-1/2 text-left pointer-events-auto">
          <p className="text-primary-400 font-display text-base landscape:text-lg md:text-lg mb-4 tracking-[0.2em] uppercase opacity-80">
            {jobTitle}
          </p>
          <h1 onMouseEnter={() => { play(660, 0.06); setTimeout(() => play(880, 0.05), 80) }} className="text-5xl landscape:text-6xl md:text-6xl font-display font-bold mb-4 leading-tight cursor-default">
            <NameReveal
              en={[
                "I'm",
                profile.name.split(' ')[0],
                <span className="gradient-text" key="rest">{profile.name.split(' ').slice(1).join(' ')}</span>,
              ]}
              bn={[
                <span key="am" style={{ fontFamily: 'Kohinoor Bangla, Kohinoor, sans-serif', fontSize: '0.95em' }}>আমি</span>,
                profile.name.split(' ')[0],
                <span key="rest">{profile.name.split(' ').slice(1).join(' ')}</span>,
              ]}
            />
          </h1>
          <p className="text-[var(--text-muted)] text-base landscape:text-lg md:text-lg leading-relaxed mb-10">
            {profile.tagline}
          </p>
          <div className="flex flex-wrap gap-4 justify-start mb-8">
            <button
              onClick={() => scrollTo('experience')}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25"
            >
              View My Work
            </button>
            {resume && (
              <a
                href={resume.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 border border-[var(--border)] hover:border-primary-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full font-medium transition-all duration-300"
              >
                View Resume
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="landscape:hidden md:hidden absolute bottom-20 left-0 right-0 flex flex-col items-center gap-4 pointer-events-auto z-10">
        <p className="text-[var(--text-muted)] text-sm text-center px-6 leading-relaxed">
          {profile.tagline}
        </p>
        <button
          onClick={() => scrollTo('experience')}
          className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25"
        >
          View My Work
        </button>
        {resume && (
          <a
            href={resume.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 border border-[var(--border)] hover:border-primary-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full font-medium transition-all duration-300"
          >
            View Resume
          </a>
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-10 hidden landscape:block md:block">
        <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
