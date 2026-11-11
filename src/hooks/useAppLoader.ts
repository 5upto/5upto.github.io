import { useEffect, useRef } from 'react'

// Long enough for the neon sign to finish its flicker-on before we fade out.
const MIN_VISIBLE_MS = 1600
const MAX_VISIBLE_MS = 6000
// Only wait for the faces the first screen actually uses, not every Google
// font file on a cold cache.
const FONT_WAIT_MS = 900

function loaderStartedAt(): number {
  const started = (window as Window & { __appLoaderStart?: number }).__appLoaderStart
  return typeof started === 'number' ? started : performance.now()
}

/**
 * Hides the static loader rendered in index.html once the app has its initial
 * data and fonts. The loader lives outside React on purpose: it has to cover the
 * screen while the bundle is still downloading.
 *
 * `ready` should be true once the initial queries have settled (success or
 * error), so a failed request never traps the page behind the loader.
 */
export function useAppLoader(ready: boolean, enabled = true) {
  const startedAt = useRef(loaderStartedAt())
  const hidden = useRef(false)

  useEffect(() => {
    const loader = document.getElementById('app-loader')
    if (!loader) return

    let cancelled = false
    let hideTimer = 0
    let fontTimer = 0
    let frame = 0

    if (!enabled) {
      hidden.current = true
      loader.classList.add('is-hidden')
      loader.style.animation = 'none'
      loader.setAttribute('aria-hidden', 'true')
      document.documentElement.classList.remove('app-loading')
      return
    }

    document.documentElement.classList.remove('app-admin-route')

    const hide = () => {
      if (hidden.current) return
      hidden.current = true
      loader.classList.add('is-hidden')
      loader.style.animation = 'none'
      loader.setAttribute('aria-hidden', 'true')
      document.documentElement.classList.remove('app-loading')
    }

    // Hard stop: a hung request must never keep the page covered. Both clocks
    // here are `performance.now()`, matching the value stored in index.html.
    const elapsed = performance.now() - startedAt.current
    const maxTimer = window.setTimeout(hide, Math.max(0, MAX_VISIBLE_MS - elapsed))

    if (ready) {
      const fontSpecs = ['700 46px Ubuntu', '400 16px Inter', '700 32px Space Grotesk']
      const fontsReady = document.fonts?.load
        ? Promise.all(fontSpecs.map((spec) => document.fonts.load(spec))).catch(() => undefined)
        : Promise.resolve()
      const fontCap = new Promise<void>((resolve) => {
        fontTimer = window.setTimeout(resolve, FONT_WAIT_MS)
      })

      Promise.race([fontsReady, fontCap]).then(() => {
        if (cancelled || hidden.current) return
        const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - startedAt.current))
        hideTimer = window.setTimeout(() => {
          // Two frames give the freshly rendered page a chance to paint first.
          frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(hide)
          })
        }, wait)
      })
    }

    return () => {
      cancelled = true
      window.clearTimeout(maxTimer)
      window.clearTimeout(hideTimer)
      window.clearTimeout(fontTimer)
      cancelAnimationFrame(frame)
    }
  }, [ready, enabled])
}
