import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll offset per pathname, captured as each route is left.
 * Module scope so it survives route changes, and resets on reload — which pairs
 * with the `history.scrollRestoration = 'manual'` set up in main.tsx.
 */
const offsets = new Map<string, number>()

export type ScrollIntent = { scrollTop?: number }

function maxScroll(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
}

function applyScroll(target: number): void {
  window.scrollTo(0, Math.max(0, Math.min(target, maxScroll())))
}

/**
 * Keeps the reader where they left off.
 *
 * Without this, returning from /projects/foo or /experience/bar drops you at the
 * top of the homepage, because client-side navigation never triggers the
 * browser's own scroll restoration.
 */
export function useScrollRestoration() {
  const location = useLocation()
  const key = location.pathname

  // Live offset for the route currently on screen. Read from on cleanup rather
  // than window.scrollY, because a route change that shrinks the document can
  // clamp the scroll position before the cleanup runs.
  const liveY = useRef(0)

  useEffect(() => {
    const onScroll = () => { liveY.current = window.scrollY }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const hint = (location.state as ScrollIntent | null)?.scrollTop
    const target = typeof hint === 'number' ? hint : offsets.get(key) ?? 0

    // The first frame runs once this route is laid out; the second catches
    // above-the-fold images that resize the document after mount.
    let frame = requestAnimationFrame(() => {
      applyScroll(target)
      frame = requestAnimationFrame(() => {
        applyScroll(target)
        ScrollTrigger.refresh()
      })
    })

    return () => {
      cancelAnimationFrame(frame)
      offsets.set(key, liveY.current)
    }
  }, [key, location.state])
}
