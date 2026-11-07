import { useEffect } from 'react'
import type { ParticleSettings } from '../types/database'

interface ParticleBackgroundProps {
  /** Full particles.js v2 configuration. */
  settings: ParticleSettings
}

const THEME_COLORS = {
  dark: { particle: '#c7c7c7', line: '#737373' },
  light: { particle: '#312e81', line: '#4338ca' },
}

export default function ParticleBackground({ settings }: ParticleBackgroundProps) {
  useEffect(() => {
    const elementId = 'particles-js'
    let observer: MutationObserver | null = null
    let interval: ReturnType<typeof setInterval> | null = null
    let disposed = false

    const destroy = () => {
      const dom = window.pJSDom
      if (dom) {
        dom.forEach((instance) => {
          try {
            instance.pJS?.fn?.vendors?.destroypJS?.()
          } catch {
            /* ignore teardown errors */
          }
        })
        window.pJSDom = []
      }
      const el = document.getElementById(elementId)
      if (el) el.innerHTML = ''
    }

    const init = () => {
      if (disposed) return
      destroy()

      const isDark = document.documentElement.classList.contains('dark')
      const theme = isDark ? THEME_COLORS.dark : THEME_COLORS.light
      const particleColor = settings.color || theme.particle
      const lineColor = settings.lineLinkedColor || theme.line
      const shapeType = settings.shapeType === 'image' && !settings.imageSrc ? 'circle' : settings.shapeType

      window.particlesJS?.(elementId, {
        particles: {
          number: {
            value: settings.number,
            density: { enable: settings.densityEnable, value_area: settings.densityArea },
          },
          color: { value: particleColor },
          shape: {
            type: shapeType,
            stroke: { width: settings.shapeStrokeWidth, color: settings.shapeStrokeColor },
            polygon: { nb_sides: settings.polygonSides },
            image: {
              src: settings.imageSrc,
              width: settings.imageWidth,
              height: settings.imageHeight,
            },
          },
          opacity: {
            value: settings.opacity,
            random: settings.opacityRandom,
            anim: {
              enable: settings.opacityAnimEnable,
              speed: settings.opacityAnimSpeed,
              opacity_min: settings.opacityAnimMin,
              sync: settings.opacityAnimSync,
            },
          },
          size: {
            value: settings.size,
            random: settings.sizeRandom,
            anim: {
              enable: settings.sizeAnimEnable,
              speed: settings.sizeAnimSpeed,
              size_min: settings.sizeAnimMin,
              sync: settings.sizeAnimSync,
            },
          },
          line_linked: {
            enable: settings.lineLinkedEnable,
            distance: settings.lineLinkedDistance,
            color: lineColor,
            opacity: settings.lineLinkedOpacity,
            width: settings.lineLinkedWidth,
          },
          move: {
            enable: settings.moveEnable,
            speed: settings.moveSpeed,
            direction: settings.moveDirection,
            random: settings.moveRandom,
            straight: settings.moveStraight,
            out_mode: settings.moveOutMode,
            bounce: settings.moveBounce,
            attract: {
              enable: settings.moveAttractEnable,
              rotateX: settings.moveAttractRotateX,
              rotateY: settings.moveAttractRotateY,
            },
          },
        },
        interactivity: {
          detect_on: settings.detectOn,
          events: {
            onhover: { enable: settings.hoverEnable, mode: settings.hoverMode },
            onclick: { enable: settings.clickEnable, mode: settings.clickMode },
            resize: settings.resize,
          },
          modes: {
            grab: {
              distance: settings.grabDistance,
              line_linked: { opacity: settings.grabLineOpacity },
            },
            bubble: {
              distance: settings.bubbleDistance,
              size: settings.bubbleSize,
              duration: settings.bubbleDuration,
              opacity: settings.bubbleOpacity,
            },
            repulse: {
              distance: settings.repulseDistance,
              duration: settings.repulseDuration,
            },
            push: { particles_nb: settings.pushCount },
            remove: { particles_nb: settings.removeCount },
          },
        },
        retina_detect: settings.retinaDetect,
      })

      // Keep the theme-driven colours in sync when the site theme changes.
      if (!settings.color || !settings.lineLinkedColor) {
        observer = new MutationObserver(() => {
          const pJS = window.pJSDom?.[0]?.pJS
          if (!pJS) return
          const dark = document.documentElement.classList.contains('dark')
          const nextTheme = dark ? THEME_COLORS.dark : THEME_COLORS.light
          if (!settings.color) {
            pJS.particles.color.value = nextTheme.particle
            pJS.particles.array.forEach((particle: any) => {
              particle.color.value = nextTheme.particle
            })
          }
          if (!settings.lineLinkedColor) {
            pJS.particles.line_linked.color = nextTheme.line
          }
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
      }
    }

    if (window.particlesJS) {
      init()
    } else {
      // Poll until the particles.js script (loaded before React) is available.
      interval = setInterval(() => {
        if (window.particlesJS) {
          if (interval) clearInterval(interval)
          interval = null
          init()
        }
      }, 50)
    }

    return () => {
      disposed = true
      if (interval) clearInterval(interval)
      observer?.disconnect()
      destroy()
    }
  }, [settings])

  return <div id="particles-js" className="absolute inset-0 z-0 pointer-events-none" />
}
