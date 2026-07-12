import { useEffect } from 'react'

export default function ParticleBackground() {
  useEffect(() => {
    const init = () => {
      const isDark = document.documentElement.classList.contains('dark')

      window.particlesJS!('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: isDark ? '#818cf8' : '#1e1b4b' },
          shape: { type: 'circle' },
          opacity: {
            value: 0.5,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: false },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: isDark ? '#6366f1' : '#1e1b4b',
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 3,
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
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 },
          },
        },
        retina_detect: true,
      })

      const observer = new MutationObserver(() => {
        const pJS = window.pJSDom?.[0]?.pJS
        if (!pJS) return
        const d = document.documentElement.classList.contains('dark')
        pJS.particles.color.value = d ? '#818cf8' : '#1e1b4b'
        pJS.particles.line_linked.color = d ? '#6366f1' : '#1e1b4b'
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

  return <div id="particles-js" className="fixed inset-0 z-0" />
}
