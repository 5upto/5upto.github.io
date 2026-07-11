import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

function AntigravityInner({
  count = 250,
  magnetRadius = 8,
  ringRadius = 8,
  waveSpeed = 0.3,
  waveAmplitude = 0.8,
  particleSize = 1.5,
  lerpSpeed = 0.08,
  color = '#818cf8',
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 0.05,
  depthFactor = 0.8,
  pulseSpeed = 2,
  particleShape = 'capsule',
  fieldStrength = 8,
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const { viewport } = useThree()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const lastMousePos = useRef({ x: 0, y: 0 })
  const lastMouseMoveTime = useRef(0)
  const virtualMouse = useRef({ x: 0, y: 0 })

  const particles = useMemo(() => {
    const temp: {
      t: number; factor: number; speed: number; xFactor: number; yFactor: number; zFactor: number
      mx: number; my: number; mz: number; cx: number; cy: number; cz: number
      vx: number; vy: number; vz: number; randomRadiusOffset: number
    }[] = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const x = (Math.random() - 0.5) * viewport.width
      const y = (Math.random() - 0.5) * viewport.height
      const z = (Math.random() - 0.5) * 20
      temp.push({
        t, factor: 20 + Math.random() * 100, speed,
        xFactor: -50 + Math.random() * 100,
        yFactor: -50 + Math.random() * 100,
        zFactor: -50 + Math.random() * 100,
        mx: x, my: y, mz: z,
        cx: x, cy: y, cz: z,
        vx: 0, vy: 0, vz: 0,
        randomRadiusOffset: (Math.random() - 0.5) * 2,
      })
    }
    return temp
  }, [count, viewport.width, viewport.height])

  useFrame(state => {
    const mesh = meshRef.current
    if (!mesh) return
    const { viewport: v, pointer: m } = state

    const mouseDist = Math.sqrt(
      Math.pow(m.x - lastMousePos.current.x, 2) + Math.pow(m.y - lastMousePos.current.y, 2)
    )
    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now()
      lastMousePos.current = { x: m.x, y: m.y }
    }

    let destX = (m.x * v.width) / 2
    let destY = (m.y * v.height) / 2

    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      const time = state.clock.getElapsedTime()
      destX = Math.sin(time * 0.5) * (v.width / 4)
      destY = Math.cos(time * 0.5 * 2) * (v.height / 4)
    }

    virtualMouse.current.x += (destX - virtualMouse.current.x) * 0.05
    virtualMouse.current.y += (destY - virtualMouse.current.y) * 0.05

    const targetX = virtualMouse.current.x
    const targetY = virtualMouse.current.y
    const globalRotation = state.clock.getElapsedTime() * rotationSpeed

    particles.forEach((particle, i) => {
      particle.t += particle.speed / 2
      const { t, speed } = particle
      const projectionFactor = 1 - particle.cz / 50
      const projX = targetX * projectionFactor
      const projY = targetY * projectionFactor
      const dx = particle.mx - projX
      const dy = particle.my - projY
      const dist = Math.sqrt(dx * dx + dy * dy)

      let targetPos = { x: particle.mx, y: particle.my, z: particle.mz * depthFactor }

      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation
        const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude)
        const deviation = particle.randomRadiusOffset * (5 / (fieldStrength + 0.1))
        const currentRingRadius = ringRadius + wave + deviation
        targetPos.x = projX + currentRingRadius * Math.cos(angle)
        targetPos.y = projY + currentRingRadius * Math.sin(angle)
        targetPos.z = particle.mz * depthFactor + Math.sin(t) * (1 * waveAmplitude * depthFactor)
      }

      particle.cx += (targetPos.x - particle.cx) * lerpSpeed
      particle.cy += (targetPos.y - particle.cy) * lerpSpeed
      particle.cz += (targetPos.z - particle.cz) * lerpSpeed

      dummy.position.set(particle.cx, particle.cy, particle.cz)
      dummy.lookAt(projX, projY, particle.cz)
      dummy.rotateX(Math.PI / 2)

      const distToMouse = Math.sqrt(
        Math.pow(particle.cx - projX, 2) + Math.pow(particle.cy - projY, 2)
      )
      let scaleFactor = 1 - Math.abs(distToMouse - ringRadius) / 10
      scaleFactor = Math.max(0, Math.min(1, scaleFactor))
      const finalScale = scaleFactor * (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) * particleSize
      dummy.scale.set(finalScale, finalScale, finalScale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === 'capsule' && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
      {particleShape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
      {particleShape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
      <meshBasicMaterial color={color} />
    </instancedMesh>
  )
}

export default function AntigravityBackground() {
  const [color, setColor] = useState('#818cf8')

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setColor(isDark ? '#818cf8' : '#6366f1')

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      setColor(isDark ? '#818cf8' : '#6366f1')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 50], fov: 35 }} gl={{ alpha: true }}>
        <AntigravityInner
          count={250}
          color={color}
          magnetRadius={8}
          ringRadius={8}
          waveSpeed={0.3}
          waveAmplitude={0.8}
          particleSize={1.5}
          autoAnimate={true}
          rotationSpeed={0.05}
          depthFactor={0.8}
          pulseSpeed={2}
          particleShape="capsule"
          fieldStrength={8}
        />
      </Canvas>
    </div>
  )
}
