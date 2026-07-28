import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Lanyard from './lanyard/Lanyard'
import ParticleBackground from './ParticleBackground'
import { useProfile } from '../hooks/useProfile'
import { useExperiences } from '../hooks/useExperiences'

function useIdCardImages(profile: any, currentExp: any) {
  const [images, setImages] = useState<{ front: string | null; back: string | null; band: string | null }>({ front: null, back: null, band: null })
  const [themeTick, setThemeTick] = useState(0)

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => setThemeTick(t => t + 1))
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!profile) return

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error(`Failed to load: ${src}`))
        img.src = src
      })

    const generate = async () => {
      const W = 800, H = 1100
      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!
      const isDark = document.documentElement.classList.contains('dark')

      const bg = isDark ? '#1e293b' : '#f8fafc'
      const textColor = isDark ? '#ffffff' : '#1a1a2e'
      const accentColor = isDark ? '#818cf8' : '#4338ca'
      const INNER_PAD = 70
      const BOTTOM_ZONE = 200

      ctx.fillStyle = bg
      ctx.beginPath()
      ctx.roundRect(0, 0, W, H, 40)
      ctx.fill()

      const imgX = INNER_PAD
      const imgY = INNER_PAD
      const imgW = W - INNER_PAD * 2
      const imgH = H - INNER_PAD - BOTTOM_ZONE

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imgX, imgY, imgW, imgH, 20)
      ctx.clip()
      try {
        const avatarImg = await loadImage(profile.avatar_url)
        const imgAspect = avatarImg.naturalWidth / avatarImg.naturalHeight
        let dw: number, dh: number, dx: number, dy: number
        if (imgAspect > imgW / imgH) {
          dh = imgH; dw = dh * imgAspect
          dx = imgX + (imgW - dw) / 2; dy = imgY
        } else {
          dw = imgW; dh = dw / imgAspect
          dx = imgX; dy = imgY + (imgH - dh) / 2
        }
        ctx.drawImage(avatarImg, dx, dy, dw, dh)
      } catch {
        ctx.fillStyle = accentColor
        ctx.fillRect(imgX, imgY, imgW, imgH)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 120px Inter, system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(profile.name?.charAt(0) || '?', W / 2, imgY + imgH / 2)
        ctx.textBaseline = 'alphabetic'
      }
      ctx.restore()

      const textY = H - BOTTOM_ZONE + 80
      ctx.textAlign = 'center'
      ctx.fillStyle = textColor
      ctx.font = 'bold 44px Inter, system-ui, sans-serif'
      ctx.fillText(profile.name || '', W / 2, textY)

      ctx.fillStyle = accentColor
      ctx.font = '600 26px Inter, system-ui, sans-serif'
      ctx.fillText(currentExp?.role || profile.title || '', W / 2, textY + 50)

      setImages(prev => ({ ...prev, front: canvas.toDataURL('image/png') }))
    }

    generate()
  }, [profile, currentExp, themeTick])

  useEffect(() => {
    if (!currentExp?.logo) return
    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = () => reject(img)
        img.src = src
      })

    const generateBack = async () => {
      const W = 800, H = 1100
      try {
        const logoImg = await loadImage(currentExp.logo)
        const canvas = document.createElement('canvas')
        canvas.width = W
        canvas.height = H
        const ctx = canvas.getContext('2d')!
        const isDark = document.documentElement.classList.contains('dark')

        ctx.fillStyle = isDark ? '#1e293b' : '#f8fafc'
        ctx.beginPath()
        ctx.roundRect(0, 0, W, H, 40)
        ctx.fill()

        const logoSize = Math.min(W, H) * 0.4
        const aspect = logoImg.naturalWidth / logoImg.naturalHeight
        let lw: number, lh: number
        if (aspect > 1) { lw = logoSize; lh = logoSize / aspect }
        else { lh = logoSize; lw = logoSize * aspect }
        ctx.save()
        ctx.beginPath()
        ctx.roundRect((W - lw) / 2, (H - lh) / 2, lw, lh, 24)
        ctx.clip()
        ctx.drawImage(logoImg, (W - lw) / 2, (H - lh) / 2, lw, lh)
        ctx.restore()

        setImages(prev => ({ ...prev, back: canvas.toDataURL('image/png') }))

        const bandCanvas = document.createElement('canvas')
        bandCanvas.width = 512
        bandCanvas.height = 128
        const bCtx = bandCanvas.getContext('2d')!
        const isDarkBand = document.documentElement.classList.contains('dark')
        bCtx.fillStyle = isDarkBand ? '#1e1b4b' : '#4338ca'
        bCtx.fillRect(0, 0, 512, 128)

        const logoH = 50
        const logoW = aspect > 1 ? logoH * aspect : logoH
        const logoY = (128 - logoH) / 2

        const companyName = currentExp?.company || ''
        bCtx.fillStyle = '#ffffff'
        bCtx.font = 'bold 28px Inter, system-ui, sans-serif'
        bCtx.textAlign = 'left'
        bCtx.textBaseline = 'middle'

        const textW = bCtx.measureText(companyName).width
        const gap = 20
        const totalW = logoW + gap + textW
        const startX = (512 - totalW) / 2
        bCtx.drawImage(logoImg, startX, logoY, logoW, logoH)
        bCtx.fillText(companyName, startX + logoW + gap, 64)

        setImages(prev => ({ ...prev, band: bandCanvas.toDataURL('image/png') }))
      } catch { /* logo not available */ }
    }

    generateBack()
  }, [currentExp?.logo, themeTick])

  return images
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const { data: profile } = useProfile()
  const { data: experiences } = useExperiences()
  const currentExp = experiences?.[0] ?? null
  const { front, back, band } = useIdCardImages(profile, currentExp)

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
      className="relative min-h-dvh flex items-center px-4 py-12"
    >
      <ParticleBackground />
      {front && <Lanyard frontImage={front} backImage={back} lanyardImage={band} position={[0, 0, 28]} fov={18} transparent />}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col landscape:flex-row md:flex-row items-center gap-8 landscape:gap-16 md:gap-16 pointer-events-none">
        <div ref={textRef} className="hidden landscape:block md:block w-full landscape:w-1/2 md:w-1/2 text-left pointer-events-auto">
          <p className="text-primary-400 font-display text-base landscape:text-lg md:text-lg mb-4 tracking-[0.2em] uppercase opacity-80">
            {profile.title}
          </p>
          <h1 className="text-5xl landscape:text-6xl md:text-6xl font-display font-bold mb-4 leading-tight">
            {profile.name.split(' ')[0]}{' '}
            <span className="gradient-text">{profile.name.split(' ').slice(1).join(' ')}</span>
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
            <button
              onClick={() => scrollTo('contact')}
              className="px-8 py-3 border border-[var(--border)] hover:border-primary-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full font-medium transition-all duration-300"
            >
              Get In Touch
            </button>
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
        <button
          onClick={() => scrollTo('contact')}
          className="px-8 py-3 border border-[var(--border)] hover:border-primary-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full font-medium transition-all duration-300"
        >
          Get In Touch
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-10 hidden landscape:block md:block">
        <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
