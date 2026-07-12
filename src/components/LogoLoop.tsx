import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './LogoLoop.css'

export type LogoItem = {
  node: React.ReactNode
}

interface LogoLoopProps {
  logos: LogoItem[]
  speed?: number
  gap?: number
  fadeOut?: boolean
  className?: string
  pauseOnHover?: boolean
}

export default function LogoLoop({
  logos,
  speed = 80,
  gap = 24,
  fadeOut = true,
  className,
  pauseOnHover = true,
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const seqRef = useRef<HTMLUListElement>(null)
  const [seqWidth, setSeqWidth] = useState(0)
  const [copyCount, setCopyCount] = useState(2)
  const rafRef = useRef<number | null>(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)

  const updateDimensions = useCallback(() => {
    const cw = containerRef.current?.clientWidth ?? 0
    const sw = seqRef.current?.getBoundingClientRect()?.width ?? 0
    if (sw > 0) {
      setSeqWidth(Math.ceil(sw))
      setCopyCount(Math.max(2, Math.ceil(cw / sw) + 2))
    }
  }, [])

  useEffect(() => {
    updateDimensions()
    const ro = new ResizeObserver(updateDimensions)
    if (containerRef.current) ro.observe(containerRef.current)
    if (seqRef.current) ro.observe(seqRef.current)
    return () => ro.disconnect()
  }, [logos, gap])

  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? []
    let remaining = images.length
    if (remaining === 0) { updateDimensions(); return }
    const check = () => { remaining--; if (remaining === 0) updateDimensions() }
    images.forEach(img => {
      if (img.complete) check()
      else { img.addEventListener('load', check, { once: true }); img.addEventListener('error', check, { once: true }) }
    })
  }, [logos, gap])

  useEffect(() => {
    const track = trackRef.current
    if (!track || seqWidth === 0) return

    offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`

    const absSpeed = Math.abs(speed)
    const dir = speed >= 0 ? 1 : -1

    const animate = () => {
      if (!track) return
      if (!pausedRef.current) {
        offsetRef.current += dir * absSpeed * 0.016
        offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }
  }, [speed, seqWidth])

  const logoLists = useMemo(
    () => Array.from({ length: copyCount }, (_, ci) => (
      <ul
        className="logoloop__list"
        key={ci}
        aria-hidden={ci > 0}
        ref={ci === 0 ? seqRef : undefined}
      >
        {logos.map((item, ii) => (
          <li className="logoloop__item" key={`${ci}-${ii}`}>
            <span className="logoloop__node">{item.node}</span>
          </li>
        ))}
      </ul>
    )),
    [copyCount, logos]
  )

  const handleMouseEnter = () => { if (pauseOnHover) pausedRef.current = true }
  const handleMouseLeave = () => { if (pauseOnHover) pausedRef.current = false }

  return (
    <div
      ref={containerRef}
      className={`logoloop${fadeOut ? ' logoloop--fade' : ''}${className ? ` ${className}` : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Skills logos"
    >
      <div ref={trackRef} className="logoloop__track" style={{ gap: `${gap}px` }}>
        {logoLists}
      </div>
    </div>
  )
}
