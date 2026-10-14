import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'cot_sound' // keep parity with the reference site's storage key

type SoundContextValue = {
  enabled: boolean
  toggle: () => void
  play: (freq?: number, dur?: number) => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    try {
      return localStorage.getItem(STORAGE_KEY) !== '0'
    } catch {
      return true
    }
  })

  const ctxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const analyserDataRef = useRef<Uint8Array | null>(null)
  const droneGainRef = useRef<GainNode | null>(null)
  const droneOsc1Ref = useRef<OscillatorNode | null>(null)
  const droneOsc2Ref = useRef<OscillatorNode | null>(null)
  const unlockedRef = useRef(false)
  const lastHoveredRef = useRef<HTMLElement | null>(null)
  const tickTimerRef = useRef<number | null>(null)
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  const isFinePointer =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches

  const ensureAudio = useCallback(() => {
    if (ctxRef.current) return
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      ctxRef.current = ctx

      const master = ctx.createGain()
      master.gain.value = 1
      masterGainRef.current = master

      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser
      analyserDataRef.current = new Uint8Array(analyser.frequencyBinCount)
      master.connect(analyser)
      analyser.connect(ctx.destination)

      const droneGain = ctx.createGain()
      droneGain.gain.value = 0
      droneGain.connect(master)
      droneGainRef.current = droneGain

      const osc1 = ctx.createOscillator()
      osc1.type = 'sine'
      osc1.frequency.value = 60
      osc1.connect(droneGain)
      osc1.start()
      droneOsc1Ref.current = osc1

      const osc2 = ctx.createOscillator()
      osc2.type = 'sine'
      osc2.frequency.value = 90.5
      const g2 = ctx.createGain()
      g2.gain.value = 0.5
      osc2.connect(g2)
      g2.connect(droneGain)
      osc2.start()
      droneOsc2Ref.current = osc2
    } catch (err) {
      ctxRef.current = null
      /* audio unavailable; continue silently */
    }
  }, [])

  const startDrone = useCallback(() => {
    const ctx = ctxRef.current
    const droneGain = droneGainRef.current
    if (!ctx || !droneGain || !enabledRef.current) return
    try {
      droneGain.gain.cancelScheduledValues(ctx.currentTime)
      droneGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.6)
    } catch {
      /* ignore */
    }
  }, [])

  const stopDrone = useCallback(() => {
    const ctx = ctxRef.current
    const droneGain = droneGainRef.current
    if (!ctx || !droneGain) return
    try {
      droneGain.gain.cancelScheduledValues(ctx.currentTime)
      droneGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
    } catch {
      /* ignore */
    }
  }, [])

  const playNow = useCallback((freq: number, dur: number) => {
    const ctx = ctxRef.current
    const master = masterGainRef.current
    if (!ctx || !master || ctx.state !== 'running') return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    g.gain.value = 0
    osc.connect(g)
    g.connect(master)
    g.gain.linearRampToValueAtTime(0.02, now + 0.008)
    g.gain.linearRampToValueAtTime(0, now + dur)
    osc.start(now)
    osc.stop(now + dur + 0.02)
  }, [])

  const play = useCallback((freq = 720, dur = 0.07) => {
    if (!enabledRef.current) return
    if (!ctxRef.current) ensureAudio()
    const ctx = ctxRef.current
    const master = masterGainRef.current
    if (!ctx || !master) return
    if (ctx.state !== 'running') {
      void ctx.resume().then(() => playNow(freq, dur))
      return
    }
    playNow(freq, dur)
  }, [ensureAudio, playNow])

  const playAmbientTick = useCallback(() => {
    if (!enabledRef.current) return
    const ctx = ctxRef.current
    const master = masterGainRef.current
    if (!ctx || !master || ctx.state !== 'running') return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 480
    g.gain.value = 0
    osc.connect(g)
    g.connect(master)
    const now = ctx.currentTime
    g.gain.linearRampToValueAtTime(0.03, now + 0.01)
    g.gain.linearRampToValueAtTime(0, now + 0.12)
    osc.start(now)
    osc.stop(now + 0.14)
  }, [])

  const playKeySound = useCallback((panValue?: number) => {
    if (!enabledRef.current) return
    const ctx = ctxRef.current
    const master = masterGainRef.current
    if (!ctx || !master || ctx.state !== 'running') return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = 620 + (Math.random() * 40 - 20)
    g.gain.value = 0
    const now = ctx.currentTime
    if (isFinePointer && typeof panValue === 'number' && (ctx as any).createStereoPanner) {
      const panner = (ctx as any).createStereoPanner()
      panner.pan.value = Math.max(-1, Math.min(1, panValue))
      osc.connect(g)
      g.connect(panner)
      panner.connect(master)
    } else {
      osc.connect(g)
      g.connect(master)
    }
    g.gain.linearRampToValueAtTime(0.025, now + 0.008)
    g.gain.linearRampToValueAtTime(0, now + 0.05)
    osc.start(now)
    osc.stop(now + 0.06)
  }, [isFinePointer])

  const playHoverTick = useCallback((panValue?: number) => {
    if (!enabledRef.current || !isFinePointer) return
    const ctx = ctxRef.current
    const master = masterGainRef.current
    if (!ctx || !master || ctx.state !== 'running') return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 760 + (panValue || 0) * 60
    g.gain.value = 0
    const now = ctx.currentTime
    if ((ctx as any).createStereoPanner) {
      const panner = (ctx as any).createStereoPanner()
      panner.pan.value = Math.max(-1, Math.min(1, panValue || 0))
      osc.connect(g)
      g.connect(panner)
      panner.connect(master)
    } else {
      osc.connect(g)
      g.connect(master)
    }
    g.gain.linearRampToValueAtTime(0.024, now + 0.006)
    g.gain.linearRampToValueAtTime(0, now + 0.06)
    osc.start(now)
    osc.stop(now + 0.07)
  }, [isFinePointer])

  const playErrorThud = useCallback(() => {
    if (!enabledRef.current) return
    const ctx = ctxRef.current
    const master = masterGainRef.current
    if (!ctx || !master || ctx.state !== 'running') return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 95
    g.gain.value = 0
    osc.connect(g)
    g.connect(master)
    g.gain.linearRampToValueAtTime(0.045, now + 0.012)
    g.gain.linearRampToValueAtTime(0, now + 0.15)
    osc.start(now)
    osc.stop(now + 0.17)
  }, [])

  const playUnlockChime = useCallback(() => {
    if (!enabledRef.current) return
    const ctx = ctxRef.current
    const master = masterGainRef.current
    if (!ctx || !master || ctx.state !== 'running') return
    const now = ctx.currentTime
    const thud = ctx.createOscillator()
    const thudGain = ctx.createGain()
    thud.type = 'sine'
    thud.frequency.value = 110
    thudGain.gain.value = 0
    thud.connect(thudGain)
    thudGain.connect(master)
    thudGain.gain.linearRampToValueAtTime(0.05, now + 0.01)
    thudGain.gain.linearRampToValueAtTime(0, now + 0.1)
    thud.start(now)
    thud.stop(now + 0.12)

    const notes = [440, 660, 880]
    notes.forEach((f, i) => {
      const t = now + 0.08 + i * 0.09
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'triangle'
      o.frequency.value = f
      g.gain.value = 0
      o.connect(g)
      g.connect(master)
      g.gain.linearRampToValueAtTime(0.035, t + 0.01)
      g.gain.linearRampToValueAtTime(0, t + 0.16)
      o.start(t)
      o.stop(t + 0.18)
    })
  }, [])

  const panForElement = useCallback((el: Element | null) => {
    if (!el || typeof window === 'undefined') return 0
    const rect = (el as HTMLElement).getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    return (centerX / window.innerWidth) * 2 - 1
  }, [])

  const unlock = useCallback(async () => {
    ensureAudio()
    const ctx = ctxRef.current
    if (!ctx) return
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume()
      } catch {
        /* ignore */
      }
    }
    if (ctx.state === 'running') {
      unlockedRef.current = true
      if (enabledRef.current) {
        startDrone()
        playUnlockChime()
      }
    }
  }, [ensureAudio, startDrone, playUnlockChime])

  // persist + sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')
    } catch {
      /* ignore */
    }
    enabledRef.current = enabled
    if (enabled && unlockedRef.current) startDrone()
    if (!enabled) stopDrone()
    // No periodic ticks; sound is driven by user interactions instead.
  }, [enabled, startDrone, stopDrone, playAmbientTick])

  // first-gesture unlock
  useEffect(() => {
    const handler = () => {
      void unlock()
    }
    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart', 'wheel']
    events.forEach(ev =>
      window.addEventListener(ev, handler, { once: true, passive: true } as AddEventListenerOptions),
    )
    return () => {
      events.forEach(ev => window.removeEventListener(ev, handler))
    }
  }, [unlock])

  // global hover ticks (once per distinct element)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!enabledRef.current || !isFinePointer) return
      const target = e.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest('button, a, [role="button"], input, select, textarea, label')
      if (!interactive) return
      if (lastHoveredRef.current === interactive) return
      lastHoveredRef.current = interactive as HTMLElement
      playHoverTick(panForElement(interactive))
    }
    const leaveHandler = () => { lastHoveredRef.current = null }
    document.addEventListener('mouseover', handler)
    document.addEventListener('mouseout', (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null
      if (!related || !related.closest?.('button, a, [role="button"], input, select, textarea, label')) {
        lastHoveredRef.current = null
      }
    })
    window.addEventListener('blur', leaveHandler)
    return () => {
      document.removeEventListener('mouseover', handler)
      window.removeEventListener('blur', leaveHandler)
    }
  }, [panForElement])

  // global key sounds on inputs
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!enabledRef.current) return
      const target = e.target as HTMLElement | null
      if (!target) return
      if (target.matches('input, textarea, [contenteditable="true"]')) {
        playKeySound(panForElement(target))
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [panForElement])

  // global click sound: richer two-tone pop, pitch by element position
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!enabledRef.current) return
      const target = e.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest('button, a, [role="button"], input[type="submit"]')
      if (!interactive) return
      const rect = (interactive as HTMLElement).getBoundingClientRect()
      const xPan = (rect.left + rect.width / 2) / window.innerWidth * 2 - 1
      const base = 360 + (1 - (rect.top / window.innerHeight)) * 260
      play(base, 0.05)
      setTimeout(() => play(base * 1.5, 0.07), 40)
      // stereo nudge using panner not exposed; pan captured implicitly by pitch only
      void xPan
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [play])

  // action-driven sound layer: scroll motion, fast mouse movement, section reveals
  useEffect(() => {
    let lastScrollY = window.scrollY
    let lastScrollT = performance.now()
    let lastMoveX = window.innerWidth / 2
    let lastMoveY = window.innerHeight / 2
    let lastMoveT = performance.now()
    const seenSections = new Set<string>()

    const onMove = (e: MouseEvent) => {
      const hero = document.getElementById('hero')
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
      if (!inside) return
      const target = e.target as HTMLElement | null
      if (target && target.closest('button, a, input, textarea, [role="button"], .pointer-events-auto')) return
      const now = performance.now()
      const dt = now - lastMoveT
      if (dt < 35) return
      const dx = e.clientX - lastMoveX
      const dy = e.clientY - lastMoveY
      const speed = (Math.sqrt(dx * dx + dy * dy) / dt) * 1000
      if (speed > 900) {
        play(880 + Math.min(320, speed / 5), 0.028)
      }
      lastMoveX = e.clientX
      lastMoveY = e.clientY
      lastMoveT = now
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const id = entry.target.id || (entry.target as HTMLElement).dataset.section || ''
        if (id && !seenSections.has(id)) {
          seenSections.add(id)
          play(440, 0.06)
          setTimeout(() => play(660, 0.06), 90)
        }
      })
    }, { threshold: 0.35 })
    document.querySelectorAll('section[id], [data-section]').forEach((el) => io.observe(el))

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      io.disconnect()
    }
  }, [])

  // expose play to non-React modules (e.g. ScrollStack) for synced feedback
  useEffect(() => {
    (window as any).__portfolioPlaySound = play
    return () => {
      delete (window as any).__portfolioPlaySound
    }
  }, [play])

  const toggle = useCallback(() => {
    setEnabled(v => {
      const next = !v
      if (next) {
        void unlock()
      } else {
        stopDrone()
      }
      return next
    })
  }, [unlock, stopDrone])

  useEffect(() => {
    return () => {
      if (tickTimerRef.current) window.clearTimeout(tickTimerRef.current)
      try {
        droneOsc1Ref.current?.stop()
        droneOsc2Ref.current?.stop()
        ctxRef.current?.close()
      } catch {
        /* ignore */
      }
    }
  }, [])

  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) return { enabled: true, toggle: () => {}, play: () => {} }
  return ctx
}
