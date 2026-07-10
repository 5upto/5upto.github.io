import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number; hue: number }[]>([])
  const mouse = useRef({ x: 0, y: 0 })
  const animFrame = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const count = Math.min(80, Math.floor(window.innerWidth / 20))
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() * 60 + 230,
    }))

    const onMouse = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMouse)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const pArr = particles.current
      for (const p of pArr) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        const dx = mouse.current.x - p.x
        const dy = mouse.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150
          p.x -= dx * force * 0.01
          p.y -= dy * force * 0.01
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity})`
        ctx.fill()
      }
      for (let i = 0; i < pArr.length; i++) {
        for (let j = i + 1; j < pArr.length; j++) {
          const dx = pArr[i].x - pArr[j].x
          const dy = pArr[i].y - pArr[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(pArr[i].x, pArr[i].y)
            ctx.lineTo(pArr[j].x, pArr[j].y)
            ctx.strokeStyle = `hsla(230, 50%, 60%, ${0.08 * (1 - dist / 120)})`
            ctx.stroke()
          }
        }
      }
      animFrame.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animFrame.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}
