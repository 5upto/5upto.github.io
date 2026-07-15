import { useEffect } from 'react'

export default function ParticleBackground() {
  useEffect(() => {
    const init = () => {
      const isDark = document.documentElement.classList.contains('dark')

      window.particlesJS!('particles-js', {
        particles: {
          number: { value: 160, density: { enable: true, value_area: 500 } },
          color: { value: isDark ? '#a5b4fc' : '#312e81' },
          shape: { type: 'circle' },
          opacity: {
            value: 0.65,
            random: true,
            anim: { enable: true, speed: 0.6, opacity_min: 0.2, sync: false },
          },
          size: {
            value: 3.5,
            random: true,
            anim: { enable: true, speed: 1, size_min: 1, sync: false },
          },
          line_linked: {
            enable: true,
            distance: 120,
            color: isDark ? '#818cf8' : '#4338ca',
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
          },
        },
        interactivity: {
          detect_on: 'window',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true,
          },
          modes: {
            repulse: { distance: 80, duration: 0.4 },
            push: { particles_nb: 3 },
          },
        },
        retina_detect: true,
      })

      const observer = new MutationObserver(() => {
        const pJS = window.pJSDom?.[0]?.pJS
        if (!pJS) return
        const d = document.documentElement.classList.contains('dark')
        pJS.particles.color.value = d ? '#a5b4fc' : '#312e81'
        pJS.particles.line_linked.color = d ? '#818cf8' : '#4338ca'
        pJS.particles.array.forEach((p: any) => { p.color.value = pJS.particles.color.value })
      })
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    }

    if (window.particlesJS) {
      init()
    } else {
      // poll until particlesJS is available (script loads before React)
      const interval = setInterval(() => {
        if (window.particlesJS) {
          clearInterval(interval)
          init()
        }
      }, 50)
    }

    return () => {
      if (window.pJSDom) window.pJSDom = []
      const el = document.getElementById('particles-js')
      if (el) el.innerHTML = ''
    }
  }, [])

  return <div id="particles-js" className="fixed inset-0 z-0 pointer-events-none" />
}
