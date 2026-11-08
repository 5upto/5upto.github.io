// @ts-nocheck
/* eslint-disable react/no-unknown-property */
'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'
import './Lanyard.css'

extend({ MeshLineGeometry, MeshLineMaterial })

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 }
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 }
const BLANK = '/lanyard/blank.png'

interface LanyardProps {
  position?: [number, number, number]
  gravity?: [number, number, number]
  fov?: number
  transparent?: boolean
  frontImage?: string | null
  backImage?: string | null
  imageFit?: 'cover' | 'contain'
  lanyardImage?: string | null
  lanyardWidth?: number
  /** Centre the card for small preview boxes (same framing as the mobile hero). */
  compact?: boolean
  /** Colour of the metal clip / ID-card cover hardware. */
  coverColor?: 'silver' | 'black'
}

/**
 * R3F has no built-in frame cap. With `frameloop="demand"` this keeps the
 * simulation advancing while drawing only as often as we ask, which roughly
 * halves GPU work on phones.
 */
function FramePacer({
  fps,
  awakeRef
}: {
  fps: number
  awakeRef: { current: boolean }
}) {
  const invalidate = useThree(state => state.invalidate)
  useEffect(() => {
    const id = window.setInterval(() => {
      if (awakeRef.current) invalidate()
    }, 1000 / fps)
    return () => window.clearInterval(id)
  }, [fps, invalidate, awakeRef])
  return null
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  compact = false,
  coverColor = 'black',
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const [phoneLandscape, setPhoneLandscape] = useState(() => typeof window !== 'undefined' && window.innerWidth > window.innerHeight && window.innerHeight < 600)
  const wrapperRef = useRef<HTMLDivElement>(null!)
  // Stop rendering once the rope/card physics has settled; any touch wakes it.
  const awakeRef = useRef(true)
  // Stop the render loop when the hero is offscreen or the tab is hidden, so
  // the always-on canvas does not keep the GPU busy while reading the page.
  const [active, setActive] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setPhoneLandscape(window.innerWidth > window.innerHeight && window.innerHeight < 600)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    let onScreen = true
    const update = () => setActive(onScreen && !document.hidden)
    const observer = new IntersectionObserver(
      entries => {
        onScreen = entries.some(entry => entry.isIntersecting)
        update()
      },
      { rootMargin: '100px' }
    )
    observer.observe(el)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  const dpr = useMemo<[number, number]>(() => (isMobile ? [1, 1.5] : [1.5, 2]), [isMobile])
  const glOptions = useMemo(
    () => ({ alpha: transparent, antialias: !isMobile, powerPreference: 'high-performance' as const }),
    [transparent, isMobile]
  )

  return (
    <div
      ref={wrapperRef}
      className="lanyard-wrapper"
      onPointerDown={() => {
        awakeRef.current = true
      }}
    >
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={dpr}
        frameloop={active ? 'demand' : 'never'}
        gl={glOptions}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
          gl.domElement.style.touchAction = 'pan-y'
        }}
      >
        <FramePacer fps={isMobile ? 30 : 60} awakeRef={awakeRef} />
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              phoneLandscape={phoneLandscape}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
              compact={compact}
              coverColor={coverColor}
              awakeRef={awakeRef}
            />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  )
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  phoneLandscape = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  compact = false,
  coverColor = 'black',
  awakeRef = null
}) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef()
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3()
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 6, linearDamping: 6 }
  const compactLayout = compact || isMobile

  const { nodes, materials } = useGLTF('/lanyard/card.glb')
  const { size } = useThree()
  const fallbackTexture = useTexture('/lanyard/lanyard.png')

  // The GLB ships a near-black metal material. Clone it so silver/black can be
  // switched per-instance without mutating the shared cached material.
  const coverMaterial = useMemo(() => {
    const material = (materials.metal as THREE.MeshStandardMaterial).clone()
    material.color = new THREE.Color(coverColor === 'silver' ? '#d8dce2' : '#151515')
    material.metalness = 1
    material.roughness = coverColor === 'silver' ? 0.2 : 0.5
    return material
  }, [materials.metal, coverColor])

  useEffect(() => () => { coverMaterial.dispose() }, [coverMaterial])

  const texture = useMemo(() => {
    if (!lanyardImage) return fallbackTexture
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')!
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = lanyardImage
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    img.onload = () => {
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
      tex.needsUpdate = true
    }
    if (img.complete) {
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
      tex.needsUpdate = true
    }
    return tex
  }, [lanyardImage, fallbackTexture])

  const frontTex = useTexture(frontImage || BLANK)
  const backTex = useTexture(backImage || BLANK)

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map
    if (!frontImage && !backImage) return baseMap

    const baseImg = baseMap.image
    const W = baseImg.width
    const H = baseImg.height
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) return baseMap
    ctx.drawImage(baseImg, 0, 0, W, H)

    const drawFitted = (img, rect) => {
      const rx = rect.x * W
      const ry = rect.y * H
      const rw = rect.w * W
      const rh = rect.h * H
      const pick = imageFit === 'contain' ? Math.min : Math.max
      const scale = pick(rw / img.width, rh / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      const dx = rx + (rw - dw) / 2
      const dy = ry + (rh - dh) / 2
      ctx.save()
      ctx.beginPath()
      ctx.rect(rx, ry, rw, rh)
      ctx.clip()
      ctx.drawImage(img, dx, dy, dw, dh)
      ctx.restore()
    }

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT)
    if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT)

    const composite = new THREE.CanvasTexture(canvas)
    composite.colorSpace = THREE.SRGBColorSpace
    composite.flipY = baseMap.flipY
    composite.anisotropy = 16
    composite.needsUpdate = true
    return composite
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map])

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(2, -2.5, 0),
        new THREE.Vector3(1.5, 0, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0.5, 0, 0)
      ])
  )
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0]
  ])

  useEffect(() => {
    if (dragged) {
      document.body.style.cursor = 'grabbing'
    } else {
      document.body.style.cursor = hovered ? 'grab' : ''
    }
  }, [dragged, hovered])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    if (fixed.current) {
      ;[j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        const rate = dragged ? Math.min(delta * 8, 0.15) : delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        ref.current.lerped.lerp(ref.current.translation(), rate)
      })
      if (!card.current.lerped) card.current.lerped = new THREE.Vector3().copy(card.current.translation())
      card.current.lerped.lerp(card.current.translation(), Math.min(1, delta * (dragged ? 30 : 20)))
      curve.points[0].copy(card.current.lerped)
      const off = new THREE.Vector3(0, 1.5, 0).applyQuaternion(card.current.rotation())
      curve.points[0].add(off)
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(compactLayout ? 16 : 32))
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
    if (awakeRef) {
      const bodies = [j1, j2, j3, card]
      const moving =
        dragged ||
        bodies.some(ref => {
          const body = ref.current
          return body && typeof body.isSleeping === 'function' && !body.isSleeping()
        })
      awakeRef.current = moving
    }
  })

  curve.curveType = 'chordal'
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[phoneLandscape ? 3 : (compactLayout ? 0 : 5), compactLayout ? 5 : 4.5, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => {
              try {
                e.target.releasePointerCapture(e.pointerId)
              } catch {
                /* capture may already be gone after a cancelled touch */
              }
              drag(false)
            }}
            onPointerCancel={() => {
              // Vertical page scroll wins on touch; release the card cleanly.
              drag(false)
              hover(false)
            }}
            onPointerDown={e => {
              try {
                e.target.setPointerCapture(e.pointerId)
              } catch {
                /* no-op */
              }
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={coverMaterial} material-roughness={coverColor === 'silver' ? 0.2 : 0.5} />
            <mesh geometry={nodes.clamp.geometry} material={coverMaterial} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} raycast={() => null}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={phoneLandscape ? lanyardWidth * 0.7 : (compactLayout ? lanyardWidth * 1.4 : lanyardWidth * 0.7)}
        />
      </mesh>
    </>
  )
}
