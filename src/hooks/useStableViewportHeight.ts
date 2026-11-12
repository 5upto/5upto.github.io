import { useEffect, useState } from 'react'

/**
 * A height-only viewport change smaller than this is treated as a mobile
 * browser toolbar collapsing or expanding, not as a real layout resize.
 * Toolbars are usually 44–140px; keyboards and rotations are far larger.
 */
const TOOLBAR_RESIZE_LIMIT = 200

/** Visible viewport height, or null when the page is pinch-zoomed. */
function readHeight(): number | null {
  if (typeof window === 'undefined') return 0
  const visual = window.visualViewport
  if (visual && visual.scale > 1.01) return null
  const layout = window.innerHeight
  const visible = visual?.height ?? Number.POSITIVE_INFINITY
  return Math.round(Math.min(layout, visible))
}

/**
 * Height of the visible viewport, frozen against the browser's toolbar
 * collapsing while the page is scrolled.
 *
 * `svh` is stable in Chrome and Safari, but the Facebook and Instagram
 * in-app browsers report the *current* visual viewport for it. Their toolbar
 * retracts on scroll, the hero grows, and the WebGL canvases inside re-fit to
 * the new size — which looks like the hero and lanyard zooming in.
 *
 * Measuring once and ignoring small height-only changes keeps the hero (and
 * everything rendered inside it) the same size for the whole session, while
 * still following rotations, keyboard-sized changes and desktop resizes.
 */
export function useStableViewportHeight() {
  const [height, setHeight] = useState(() => readHeight() ?? 0)

  useEffect(() => {
    const applied = { value: readHeight() ?? 0, width: window.innerWidth }
    // Some in-app webviews report a fine pointer; treat any touch-capable
    // device as touch to be safe.
    const coarsePointer =
      (window.matchMedia?.('(pointer: coarse)').matches ?? false) || navigator.maxTouchPoints > 0
    let frame = 0

    const measure = () => {
      frame = 0
      const next = readHeight()
      if (next === null || next <= 0) return
      const width = window.innerWidth
      const widthChanged = width !== applied.width
      const delta = Math.abs(next - applied.value)

      // Height-only changes on touch devices are the browser chrome moving.
      // Ignore them so the hero never resizes mid-scroll.
      if (!widthChanged && coarsePointer && delta > 0 && delta <= TOOLBAR_RESIZE_LIMIT) return

      applied.value = next
      applied.width = width
      setHeight(next)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    window.addEventListener('resize', schedule)
    window.visualViewport?.addEventListener('resize', schedule)
    window.addEventListener('orientationchange', schedule)
    schedule()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('resize', schedule)
      window.visualViewport?.removeEventListener('resize', schedule)
      window.removeEventListener('orientationchange', schedule)
    }
  }, [])

  return height
}
