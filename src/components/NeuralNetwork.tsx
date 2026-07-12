import { useEffect, useRef } from 'react'
import './NeuralNetwork.css'

interface Node {
  x: number; y: number
  vx: number; vy: number
  radius: number
  phase: number
  freq: number
  connections: number[]
}

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const ripplesRef = useRef<Array<{ x: number; y: number; r: number; maxR: number; strength: number }>>([])
  const nodesRef = useRef<Node[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      initNodes()
    }

    function initNodes() {
      const count = Math.min(180, Math.floor((w * h) / 8000))
      const nodes: Node[] = []
      const connectionDist = Math.min(w, h) * 0.18

      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 1.5 + Math.random() * 2.5,
          phase: Math.random() * Math.PI * 2,
          freq: 0.3 + Math.random() * 0.7,
          connections: [],
        })
      }

      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          if (dx * dx + dy * dy < connectionDist * connectionDist) {
            nodes[i].connections.push(j)
            nodes[j].connections.push(i)
          }
        }
      }

      nodesRef.current = nodes
    }

    const isDark = () => document.documentElement.classList.contains('dark')
    const dotColor = () => isDark() ? '196, 154, 255' : '99, 102, 241'
    const lineColor = () => isDark() ? '139, 92, 246' : '99, 102, 241'

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h)
      const nodes = nodesRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseRadius = 120
      const ripples = ripplesRef.current

      for (let i = 0; i < ripples.length; i++) {
        const rip = ripples[i]
        rip.r += (rip.maxR - rip.r) * 0.04
        if (rip.r >= rip.maxR * 0.95) {
          ripples.splice(i, 1)
          i--
          continue
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]

        n.x += n.vx
        n.y += n.vy

        if (n.x < 0) n.x += w
        if (n.x > w) n.x -= w
        if (n.y < 0) n.y += h
        if (n.y > h) n.y -= h

        const dx = mx - n.x
        const dy = my - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < mouseRadius && dist > 0) {
          const force = (1 - dist / mouseRadius) * 0.5
          n.vx += (dx / dist) * force
          n.vy += (dy / dist) * force
        }

        for (const rip of ripples) {
          const rdx = n.x - rip.x
          const rdy = n.y - rip.y
          const rDist = Math.sqrt(rdx * rdx + rdy * rdy)
          if (rDist < rip.r && rDist > 0) {
            const push = (1 - rDist / rip.r) * rip.strength
            n.vx += (rdx / rDist) * push
            n.vy += (rdy / rDist) * push
          }
        }

        n.vx *= 0.98
        n.vy *= 0.98
      }

      const lineDist = Math.min(w, h) * 0.15

      for (let i = 0; i < nodes.length; i++) {
        for (const j of nodes[i].connections) {
          if (j <= i) continue
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < lineDist) {
            const alpha = (1 - dist / lineDist) * 0.35
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.strokeStyle = `rgba(${lineColor()}, ${alpha})`
            ctx!.lineWidth = 0.6
            ctx!.stroke()
          }
        }
      }

      const dc = dotColor()
      for (const n of nodes) {
        const pulse = 0.7 + 0.3 * Math.sin(t * 0.001 * n.freq + n.phase)
        const r = n.radius * pulse
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${dc}, ${0.6 + 0.4 * pulse})`
        ctx!.fill()

        ctx!.beginPath()
        ctx!.arc(n.x, n.y, r * 1.8, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${dc}, ${0.08 * pulse})`
        ctx!.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    function onMouseLeave() {
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }

    function onMouseDown(e: MouseEvent) {
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        r: 10,
        maxR: Math.min(w, h) * 0.3,
        strength: 3,
      })
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('mousedown', onMouseDown)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  return <canvas ref={canvasRef} className="neural-bg" />
}
