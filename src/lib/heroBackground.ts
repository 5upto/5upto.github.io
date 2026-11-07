import type {
  AntigravityColorMode,
  AntigravityParticleShape,
  AntigravitySettings,
  GalaxyDirection,
  GalaxySettings,
  HeroBackgroundSettings,
  HeroBackgroundStyle,
  HyperspeedCurve,
  HyperspeedSettings,
  LetterGlitchClickEffect,
  LetterGlitchSettings,
  LightningSettings,
  ParticleClickMode,
  ParticleDetectOn,
  ParticleHoverMode,
  ParticleMoveDirection,
  ParticleOutMode,
  ParticleSettings,
  ParticleShapeType,
  SideRaysOrigin,
  SideRaysSettings,
} from '../types/database'

const HEX_RE = /^#[0-9a-fA-F]{6}$/
const clamp = (value: unknown, min: number, max: number, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback
const oneOf = <T extends string>(value: unknown, options: readonly T[], fallback: T): T =>
  typeof value === 'string' && (options as readonly string[]).includes(value) ? (value as T) : fallback

export const HERO_BACKGROUND_STYLES: readonly HeroBackgroundStyle[] = [
  'particles',
  'antigravity',
  'galaxy',
  'letter-glitch',
  'hyperspeed',
  'lightning',
  'side-rays',
]

export const ANTIGRAVITY_COLOR_MODES: readonly AntigravityColorMode[] = ['conic', 'radial', 'random']

export const ANTIGRAVITY_SHAPES: readonly AntigravityParticleShape[] = [
  'capsule',
  'sphere',
  'box',
  'tetrahedron',
]

export const GALAXY_DIRECTIONS: readonly GalaxyDirection[] = ['forward', 'backward']

export const LETTER_GLITCH_CLICK_EFFECTS: readonly LetterGlitchClickEffect[] = ['tear', 'burst', 'none']

export const HYPERSPEED_CURVES: readonly HyperspeedCurve[] = [
  'straight',
  'gentle',
  'winding',
  'hills',
  'racing',
  'deep',
]

export const SIDE_RAYS_ORIGINS: readonly SideRaysOrigin[] = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
  'right',
  'left',
]

export const PARTICLE_SHAPES: readonly ParticleShapeType[] = [
  'circle',
  'edge',
  'triangle',
  'polygon',
  'star',
  'image',
]

export const PARTICLE_MOVE_DIRECTIONS: readonly ParticleMoveDirection[] = [
  'none',
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left',
  'top-left',
]

export const PARTICLE_OUT_MODES: readonly ParticleOutMode[] = ['out', 'bounce']

export const PARTICLE_DETECT_ON: readonly ParticleDetectOn[] = ['canvas', 'window']

export const PARTICLE_HOVER_MODES: readonly ParticleHoverMode[] = ['grab', 'repulse', 'bubble']

export const PARTICLE_CLICK_MODES: readonly ParticleClickMode[] = ['push', 'remove', 'repulse', 'bubble']

/** ReactBits Letter Glitch default glyph set. */
export const LETTER_GLITCH_DEFAULT_CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789'

export const HERO_BACKGROUND_OPTIONS: {
  value: HeroBackgroundStyle
  label: string
  description: string
  preview: string
}[] = [
  {
    value: 'particles',
    label: 'Particles',
    description: 'The original connected-dot field. Lightweight and subtle.',
    preview: 'radial-gradient(circle at 20% 30%, #4338ca 1.5px, transparent 1.6px) 0 0 / 18px 18px',
  },
  {
    value: 'antigravity',
    label: 'Antigravity',
    description: 'ReactBits particle field that orbits the cursor and bursts on click.',
    preview: 'conic-gradient(from 210deg at 50% 50%, #4285F4, #9B72CB, #D96570, #F9AB00, #4285F4)',
  },
  {
    value: 'galaxy',
    label: 'Galaxy',
    description: 'Deep space with swirling nebula colors.',
    preview: 'radial-gradient(ellipse at 30% 20%, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    value: 'letter-glitch',
    label: 'Letter Glitch',
    description: 'Horizontal scan lines with color shifting text.',
    preview: 'linear-gradient(90deg, #ff0000 0%, #00ff00 20%, #0000ff 40%, #ffff00 60%, #ff00ff 80%, #ff0000 100%)',
  },
  {
    value: 'hyperspeed',
    label: 'Hyperspeed',
    description: 'Dynamic diagonal streaks suggesting motion.',
    preview: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
  },
  {
    value: 'lightning',
    label: 'Lightning',
    description: 'Bright zigzag lightning bolts.',
    preview: 'conic-gradient(from 0deg at 50% 50%, #fbbf24, #f87171, #a3e635, #60a5fa, #fbbf24)',
  },
  {
    value: 'side-rays',
    label: 'Side Rays',
    description: 'Radial rays from left and right edges.',
    preview: 'repeated-linear-gradient(90deg, rgba(255,255,255,.1) 0px, rgba(255,255,255,.1) 10px, transparent 10px, transparent 20px)',
  },
]

/** ReactBits' own "LOOK" defaults, used as the base for every preset. */
const BASE_ANTIGRAVITY_SETTINGS: AntigravitySettings = {
  colors: ['#5227FF', '#FF9FFC', '#B497CF'],
  colorMode: 'conic',
  colorSpeed: 0.05,
  count: 1500,
  particleSize: 0.9,
  particleVariance: 1,
  particleShape: 'capsule',
  magnetRadius: 9,
  ringRadius: 7,
  fieldStrength: 10,
  waveAmplitude: 1,
  waveCount: 3,
  waveSpeed: 0.4,
  rotationSpeed: 0,
  pulseSpeed: 3,
  depthFactor: 1,
  ambient: 0.25,
  lerpSpeed: 0.05,
  opacity: 1,
  interactive: true,
  clickBurst: true,
  intro: true,
}

/**
 * Gemini / Google spectrum preset: the look the Antigravity demo ships with.
 * Sizing, palette and motion match the ReactBits preset exactly.
 */
export const DEFAULT_ANTIGRAVITY_SETTINGS: AntigravitySettings = {
  ...BASE_ANTIGRAVITY_SETTINGS,
  colors: ['#4285F4', '#9B72CB', '#D96570', '#F9AB00'],
  colorSpeed: 0.08,
  count: 2000,
  magnetRadius: 11,
}

export const DEFAULT_GALAXY_SETTINGS: GalaxySettings = {
  focalX: 0.5,
  focalY: 0.5,
  rotationAngle: 0,
  starSpeed: 0.5,
  density: 1,
  hueShift: 140,
  disableAnimation: false,
  speed: 1,
  mouseInteraction: true,
  glowIntensity: 0.3,
  saturation: 0,
  mouseRepulsion: true,
  repulsionStrength: 2,
  twinkleIntensity: 0.3,
  rotationSpeed: 0.1,
  autoCenterRepulsion: 0,
  transparent: true,
  starColors: [],
  starSize: 1,
  flareIntensity: 1,
  layers: 4,
  direction: 'forward',
  clickWarp: true,
  intro: true,
  backgroundColor: '',
  opacity: 1,
}

export const DEFAULT_LETTER_GLITCH_SETTINGS: LetterGlitchSettings = {
  glitchColors: [],
  baseColor: '',
  characters: LETTER_GLITCH_DEFAULT_CHARACTERS,
  fontFamily: '',
  fontSize: 14,
  spacing: 0.6,
  density: 0.9,
  baseOpacity: 0.16,
  glitchAmount: 0.5,
  speed: 1,
  smooth: true,
  interactive: true,
  cursorRadius: 140,
  clickEffect: 'tear',
  flow: 0.5,
  edgeFade: 0,
  centerFade: 0,
  intro: true,
  backgroundColor: '',
}

export const DEFAULT_HYPERSPEED_SETTINGS: HyperspeedSettings = {
  curve: 'winding',
  curvature: 1,
  speed: 1,
  boost: 3,
  fov: 90,
  boostFov: 130,
  lanes: 3,
  roadWidth: 10,
  medianWidth: 2,
  density: 40,
  trailLength: 1,
  lightSize: 1,
  poles: 20,
  poleHeight: 1,
  dust: 100,
  glow: 0.6,
  reflections: 0.5,
  steer: 0.35,
  tailColors: [],
  headColors: [],
  poleColors: [],
  roadColor: '',
  roadOpacity: 0.1,
  lineColor: '',
  background: '',
  interactive: true,
}

export const DEFAULT_LIGHTNING_SETTINGS: LightningSettings = {
  color: '#4d6bff',
  bolts: 1,
  spread: 0.6,
  branches: 0.5,
  xOffset: 0,
  angle: 0,
  size: 1,
  thickness: 1,
  glow: 1,
  intensity: 1,
  speed: 1,
  flicker: 0.6,
  mouseInteraction: true,
  mouseStrength: 1,
  clickStrike: true,
  intro: true,
  fade: 0,
  opacity: 1,
  paused: false,
}

export const DEFAULT_SIDE_RAYS_SETTINGS: SideRaysSettings = {
  rayColor1: '#FFC46B',
  rayColor2: '#96c8ff',
  blend: 0.6,
  origin: 'top-right',
  speed: 2.5,
  intensity: 2,
  spread: 2,
  density: 5,
  sharpness: 0.5,
  tilt: 0,
  falloff: 1.6,
  glow: 1,
  saturation: 1,
  dust: 0,
  followMouse: true,
  mouseInfluence: 0.5,
  intro: true,
  opacity: 1,
}

export const DEFAULT_PARTICLE_SETTINGS: ParticleSettings = {
  number: 110,
  densityEnable: true,
  densityArea: 700,
  color: '',
  shapeType: 'circle',
  shapeStrokeWidth: 0,
  shapeStrokeColor: '#ff0000',
  polygonSides: 5,
  imageSrc: '',
  imageWidth: 100,
  imageHeight: 100,
  opacity: 0.65,
  opacityRandom: true,
  opacityAnimEnable: true,
  opacityAnimSpeed: 0.6,
  opacityAnimMin: 0.2,
  opacityAnimSync: false,
  size: 3.5,
  sizeRandom: true,
  sizeAnimEnable: true,
  sizeAnimSpeed: 1,
  sizeAnimMin: 1,
  sizeAnimSync: false,
  lineLinkedEnable: true,
  lineLinkedDistance: 210,
  lineLinkedColor: '',
  lineLinkedOpacity: 0.4,
  lineLinkedWidth: 1,
  moveEnable: true,
  moveSpeed: 1.5,
  moveDirection: 'none',
  moveRandom: true,
  moveStraight: false,
  moveOutMode: 'out',
  moveBounce: false,
  moveAttractEnable: false,
  moveAttractRotateX: 6000,
  moveAttractRotateY: 1200,
  detectOn: 'window',
  hoverEnable: true,
  hoverMode: 'repulse',
  clickEnable: true,
  clickMode: 'push',
  resize: true,
  grabDistance: 180,
  grabLineOpacity: 0.4,
  bubbleDistance: 200,
  bubbleSize: 8,
  bubbleDuration: 2,
  bubbleOpacity: 1,
  repulseDistance: 180,
  repulseDuration: 0.4,
  pushCount: 3,
  removeCount: 2,
  retinaDetect: true,
}

export const DEFAULT_HERO_BACKGROUND_SETTINGS: HeroBackgroundSettings = {
  enabled: true,
  style: 'particles',
  antigravity: DEFAULT_ANTIGRAVITY_SETTINGS,
  particles: DEFAULT_PARTICLE_SETTINGS,
  galaxy: DEFAULT_GALAXY_SETTINGS,
  letterGlitch: DEFAULT_LETTER_GLITCH_SETTINGS,
  hyperspeed: DEFAULT_HYPERSPEED_SETTINGS,
  lightning: DEFAULT_LIGHTNING_SETTINGS,
  sideRays: DEFAULT_SIDE_RAYS_SETTINGS,
}

export const ANTIGRAVITY_PRESETS: {
  value: string
  label: string
  description: string
  settings: AntigravitySettings
}[] = [
  {
    value: 'gemini',
    label: 'Gemini',
    description: 'Google spectrum · 2000 particles',
    settings: DEFAULT_ANTIGRAVITY_SETTINGS,
  },
  {
    value: 'reactbits',
    label: 'ReactBits',
    description: 'Original violet / pink look',
    settings: BASE_ANTIGRAVITY_SETTINGS,
  },
  {
    value: 'orbit',
    label: 'Orbit',
    description: 'Sky blue · stronger field · slow spin',
    settings: {
      ...BASE_ANTIGRAVITY_SETTINGS,
      colors: ['#7dd3fc', '#e0f2fe', '#38bdf8'],
      rotationSpeed: 1.2,
      fieldStrength: 25,
      waveAmplitude: 0.6,
    },
  },
  {
    value: 'bloom',
    label: 'Bloom',
    description: 'Pink radial shimmer with tall waves',
    settings: {
      ...BASE_ANTIGRAVITY_SETTINGS,
      colors: ['#FF9FFC', '#ffd6a5', '#fda4af'],
      colorMode: 'radial',
      waveAmplitude: 6,
      waveCount: 5,
    },
  },
  {
    value: 'stardust',
    label: 'Stardust',
    description: 'Fine white dust with deep parallax',
    settings: {
      ...BASE_ANTIGRAVITY_SETTINGS,
      colors: ['#ffffff', '#c7d2fe'],
      particleShape: 'sphere',
      count: 2600,
      particleSize: 0.7,
      depthFactor: 2.5,
      ambient: 0.45,
      rotationSpeed: 0.3,
    },
  },
  {
    value: 'confetti',
    label: 'Confetti',
    description: 'Bold random-coloured boxes',
    settings: {
      ...BASE_ANTIGRAVITY_SETTINGS,
      colors: ['#5227FF', '#FF9FFC', '#ffd166', '#06d6a0'],
      colorMode: 'random',
      particleShape: 'box',
      count: 900,
      particleSize: 1.3,
    },
  },
]

function normalizeColors(value: unknown): string[] {
  const colors = Array.isArray(value)
    ? value.filter((color): color is string => typeof color === 'string' && HEX_RE.test(color)).slice(0, 6)
    : []
  if (colors.length === 0) return [...DEFAULT_ANTIGRAVITY_SETTINGS.colors]
  if (colors.length === 1) return [colors[0], colors[0]]
  return colors
}

export function normalizeAntigravitySettings(value: unknown): AntigravitySettings {
  const v = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
  const d = DEFAULT_ANTIGRAVITY_SETTINGS

  return {
    colors: normalizeColors(v.colors),
    colorMode: oneOf(v.colorMode, ANTIGRAVITY_COLOR_MODES, d.colorMode),
    colorSpeed: clamp(v.colorSpeed, 0, 1, d.colorSpeed),
    count: clamp(v.count, 100, 8000, d.count),
    particleSize: clamp(v.particleSize, 0.1, 4, d.particleSize),
    particleVariance: clamp(v.particleVariance, 0, 4, d.particleVariance),
    particleShape: oneOf(v.particleShape, ANTIGRAVITY_SHAPES, d.particleShape),
    magnetRadius: clamp(v.magnetRadius, 0, 40, d.magnetRadius),
    ringRadius: clamp(v.ringRadius, 0, 40, d.ringRadius),
    fieldStrength: clamp(v.fieldStrength, 0.1, 60, d.fieldStrength),
    waveAmplitude: clamp(v.waveAmplitude, 0, 12, d.waveAmplitude),
    waveCount: Math.round(clamp(v.waveCount, 0, 12, d.waveCount)),
    waveSpeed: clamp(v.waveSpeed, 0, 4, d.waveSpeed),
    rotationSpeed: clamp(v.rotationSpeed, -6, 6, d.rotationSpeed),
    pulseSpeed: clamp(v.pulseSpeed, 0, 12, d.pulseSpeed),
    depthFactor: clamp(v.depthFactor, 0, 5, d.depthFactor),
    ambient: clamp(v.ambient, 0, 1, d.ambient),
    lerpSpeed: clamp(v.lerpSpeed, 0.001, 1, d.lerpSpeed),
    opacity: clamp(v.opacity, 0, 1, d.opacity),
    interactive: typeof v.interactive === 'boolean' ? v.interactive : d.interactive,
    clickBurst: typeof v.clickBurst === 'boolean' ? v.clickBurst : d.clickBurst,
    intro: typeof v.intro === 'boolean' ? v.intro : d.intro,
  }
}

const normalizePalette = (value: unknown, max: number) =>
  Array.isArray(value)
    ? value.filter((color): color is string => typeof color === 'string' && HEX_RE.test(color)).slice(0, max)
    : []

const normalizeOptionalColor = (value: unknown) =>
  typeof value === 'string' && HEX_RE.test(value) ? value : ''

const normalizeRequiredColor = (value: unknown, fallback: string) =>
  typeof value === 'string' && HEX_RE.test(value) ? value : fallback

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

export function normalizeParticleSettings(value: unknown, legacy?: Record<string, unknown>): ParticleSettings {
  const d = DEFAULT_PARTICLE_SETTINGS
  const old = asObject(legacy)
  const v: Record<string, unknown> = {
    ...(typeof old.particleCount === 'number' ? { number: old.particleCount } : {}),
    ...(typeof old.particleSpeed === 'number' ? { moveSpeed: old.particleSpeed } : {}),
    ...(typeof old.particleOpacity === 'number' ? { opacity: old.particleOpacity } : {}),
    ...asObject(value),
  }

  return {
    number: Math.round(clamp(v.number, 10, 1000, d.number)),
    densityEnable: typeof v.densityEnable === 'boolean' ? v.densityEnable : d.densityEnable,
    densityArea: clamp(v.densityArea, 100, 3000, d.densityArea),
    color: normalizeOptionalColor(v.color),
    shapeType: oneOf(v.shapeType, PARTICLE_SHAPES, d.shapeType),
    shapeStrokeWidth: clamp(v.shapeStrokeWidth, 0, 10, d.shapeStrokeWidth),
    shapeStrokeColor: normalizeRequiredColor(v.shapeStrokeColor, d.shapeStrokeColor),
    polygonSides: Math.round(clamp(v.polygonSides, 3, 12, d.polygonSides)),
    imageSrc: typeof v.imageSrc === 'string' ? v.imageSrc : d.imageSrc,
    imageWidth: clamp(v.imageWidth, 10, 400, d.imageWidth),
    imageHeight: clamp(v.imageHeight, 10, 400, d.imageHeight),
    opacity: clamp(v.opacity, 0, 1, d.opacity),
    opacityRandom: typeof v.opacityRandom === 'boolean' ? v.opacityRandom : d.opacityRandom,
    opacityAnimEnable: typeof v.opacityAnimEnable === 'boolean' ? v.opacityAnimEnable : d.opacityAnimEnable,
    opacityAnimSpeed: clamp(v.opacityAnimSpeed, 0, 10, d.opacityAnimSpeed),
    opacityAnimMin: clamp(v.opacityAnimMin, 0, 1, d.opacityAnimMin),
    opacityAnimSync: typeof v.opacityAnimSync === 'boolean' ? v.opacityAnimSync : d.opacityAnimSync,
    size: clamp(v.size, 0.1, 30, d.size),
    sizeRandom: typeof v.sizeRandom === 'boolean' ? v.sizeRandom : d.sizeRandom,
    sizeAnimEnable: typeof v.sizeAnimEnable === 'boolean' ? v.sizeAnimEnable : d.sizeAnimEnable,
    sizeAnimSpeed: clamp(v.sizeAnimSpeed, 0, 10, d.sizeAnimSpeed),
    sizeAnimMin: clamp(v.sizeAnimMin, 0.1, 30, d.sizeAnimMin),
    sizeAnimSync: typeof v.sizeAnimSync === 'boolean' ? v.sizeAnimSync : d.sizeAnimSync,
    lineLinkedEnable: typeof v.lineLinkedEnable === 'boolean' ? v.lineLinkedEnable : d.lineLinkedEnable,
    lineLinkedDistance: clamp(v.lineLinkedDistance, 0, 1000, d.lineLinkedDistance),
    lineLinkedColor: normalizeOptionalColor(v.lineLinkedColor),
    lineLinkedOpacity: clamp(v.lineLinkedOpacity, 0, 1, d.lineLinkedOpacity),
    lineLinkedWidth: clamp(v.lineLinkedWidth, 0, 10, d.lineLinkedWidth),
    moveEnable: typeof v.moveEnable === 'boolean' ? v.moveEnable : d.moveEnable,
    moveSpeed: clamp(v.moveSpeed, 0, 20, d.moveSpeed),
    moveDirection: oneOf(v.moveDirection, PARTICLE_MOVE_DIRECTIONS, d.moveDirection),
    moveRandom: typeof v.moveRandom === 'boolean' ? v.moveRandom : d.moveRandom,
    moveStraight: typeof v.moveStraight === 'boolean' ? v.moveStraight : d.moveStraight,
    moveOutMode: oneOf(v.moveOutMode, PARTICLE_OUT_MODES, d.moveOutMode),
    moveBounce: typeof v.moveBounce === 'boolean' ? v.moveBounce : d.moveBounce,
    moveAttractEnable: typeof v.moveAttractEnable === 'boolean' ? v.moveAttractEnable : d.moveAttractEnable,
    moveAttractRotateX: clamp(v.moveAttractRotateX, 0, 20000, d.moveAttractRotateX),
    moveAttractRotateY: clamp(v.moveAttractRotateY, 0, 20000, d.moveAttractRotateY),
    detectOn: oneOf(v.detectOn, PARTICLE_DETECT_ON, d.detectOn),
    hoverEnable: typeof v.hoverEnable === 'boolean' ? v.hoverEnable : d.hoverEnable,
    hoverMode: oneOf(v.hoverMode, PARTICLE_HOVER_MODES, d.hoverMode),
    clickEnable: typeof v.clickEnable === 'boolean' ? v.clickEnable : d.clickEnable,
    clickMode: oneOf(v.clickMode, PARTICLE_CLICK_MODES, d.clickMode),
    resize: typeof v.resize === 'boolean' ? v.resize : d.resize,
    grabDistance: clamp(v.grabDistance, 0, 500, d.grabDistance),
    grabLineOpacity: clamp(v.grabLineOpacity, 0, 1, d.grabLineOpacity),
    bubbleDistance: clamp(v.bubbleDistance, 0, 500, d.bubbleDistance),
    bubbleSize: clamp(v.bubbleSize, 0, 40, d.bubbleSize),
    bubbleDuration: clamp(v.bubbleDuration, 0, 20, d.bubbleDuration),
    bubbleOpacity: clamp(v.bubbleOpacity, 0, 1, d.bubbleOpacity),
    repulseDistance: clamp(v.repulseDistance, 0, 500, d.repulseDistance),
    repulseDuration: clamp(v.repulseDuration, 0, 10, d.repulseDuration),
    pushCount: Math.round(clamp(v.pushCount, 0, 50, d.pushCount)),
    removeCount: Math.round(clamp(v.removeCount, 0, 50, d.removeCount)),
    retinaDetect: typeof v.retinaDetect === 'boolean' ? v.retinaDetect : d.retinaDetect,
  }
}

export function normalizeGalaxySettings(value: unknown, legacy?: Record<string, unknown>): GalaxySettings {
  const d = DEFAULT_GALAXY_SETTINGS
  const old = asObject(legacy)
  const v: Record<string, unknown> = {
    ...(typeof old.galaxyDensity === 'number' ? { density: old.galaxyDensity / 100 } : {}),
    ...(typeof old.galaxySpeed === 'number' ? { speed: old.galaxySpeed } : {}),
    ...(typeof old.galaxyHoles === 'number' ? { autoCenterRepulsion: old.galaxyHoles * 0.5 } : {}),
    ...asObject(value),
  }

  return {
    focalX: clamp(v.focalX, 0, 1, d.focalX),
    focalY: clamp(v.focalY, 0, 1, d.focalY),
    rotationAngle: clamp(v.rotationAngle, -180, 180, d.rotationAngle),
    starSpeed: clamp(v.starSpeed, 0, 5, d.starSpeed),
    density: clamp(v.density, 0.05, 5, d.density),
    hueShift: clamp(v.hueShift, 0, 360, d.hueShift),
    disableAnimation: typeof v.disableAnimation === 'boolean' ? v.disableAnimation : d.disableAnimation,
    speed: clamp(v.speed, 0.05, 10, d.speed),
    mouseInteraction: typeof v.mouseInteraction === 'boolean' ? v.mouseInteraction : d.mouseInteraction,
    glowIntensity: clamp(v.glowIntensity, 0, 3, d.glowIntensity),
    saturation: clamp(v.saturation, 0, 3, d.saturation),
    mouseRepulsion: typeof v.mouseRepulsion === 'boolean' ? v.mouseRepulsion : d.mouseRepulsion,
    repulsionStrength: clamp(v.repulsionStrength, 0, 10, d.repulsionStrength),
    twinkleIntensity: clamp(v.twinkleIntensity, 0, 1, d.twinkleIntensity),
    rotationSpeed: clamp(v.rotationSpeed, -3, 3, d.rotationSpeed),
    autoCenterRepulsion: clamp(v.autoCenterRepulsion, 0, 10, d.autoCenterRepulsion),
    transparent: typeof v.transparent === 'boolean' ? v.transparent : d.transparent,
    starColors: normalizePalette(v.starColors, 4),
    starSize: clamp(v.starSize, 0, 5, d.starSize),
    flareIntensity: clamp(v.flareIntensity, 0, 5, d.flareIntensity),
    layers: Math.round(clamp(v.layers, 2, 8, d.layers)),
    direction: oneOf(v.direction, GALAXY_DIRECTIONS, d.direction),
    clickWarp: typeof v.clickWarp === 'boolean' ? v.clickWarp : d.clickWarp,
    intro: typeof v.intro === 'boolean' ? v.intro : d.intro,
    backgroundColor: normalizeOptionalColor(v.backgroundColor),
    opacity: clamp(v.opacity, 0, 1, d.opacity),
  }
}

export function normalizeLetterGlitchSettings(value: unknown, legacy?: Record<string, unknown>): LetterGlitchSettings {
  const d = DEFAULT_LETTER_GLITCH_SETTINGS
  const old = asObject(legacy)
  const v: Record<string, unknown> = {
    ...(typeof old.glitchSpeed === 'number' ? { speed: old.glitchSpeed } : {}),
    ...(typeof old.glitchIntensity === 'number' ? { glitchAmount: old.glitchIntensity / 20 } : {}),
    ...(typeof old.glitchOpacity === 'number' ? { baseOpacity: old.glitchOpacity } : {}),
    ...asObject(value),
  }

  return {
    glitchColors: normalizePalette(v.glitchColors, 8),
    baseColor: normalizeOptionalColor(v.baseColor),
    characters:
      typeof v.characters === 'string' && v.characters.length > 0 ? v.characters : d.characters,
    fontFamily: typeof v.fontFamily === 'string' ? v.fontFamily : d.fontFamily,
    fontSize: clamp(v.fontSize, 6, 48, d.fontSize),
    spacing: clamp(v.spacing, 0, 2, d.spacing),
    density: clamp(v.density, 0, 1, d.density),
    baseOpacity: clamp(v.baseOpacity, 0, 1, d.baseOpacity),
    glitchAmount: clamp(v.glitchAmount, 0, 1, d.glitchAmount),
    speed: clamp(v.speed, 0.05, 10, d.speed),
    smooth: typeof v.smooth === 'boolean' ? v.smooth : d.smooth,
    interactive: typeof v.interactive === 'boolean' ? v.interactive : d.interactive,
    cursorRadius: clamp(v.cursorRadius, 20, 500, d.cursorRadius),
    clickEffect: oneOf(v.clickEffect, LETTER_GLITCH_CLICK_EFFECTS, d.clickEffect),
    flow: clamp(v.flow, 0, 1, d.flow),
    edgeFade: clamp(v.edgeFade, 0, 0.5, d.edgeFade),
    centerFade: clamp(v.centerFade, 0, 1, d.centerFade),
    intro: typeof v.intro === 'boolean' ? v.intro : d.intro,
    backgroundColor: normalizeOptionalColor(v.backgroundColor),
  }
}

export function normalizeHyperspeedSettings(value: unknown, legacy?: Record<string, unknown>): HyperspeedSettings {
  const d = DEFAULT_HYPERSPEED_SETTINGS
  const old = asObject(legacy)
  const v: Record<string, unknown> = {
    ...(typeof old.hyperspeedStreaks === 'number' ? { density: old.hyperspeedStreaks } : {}),
    ...(typeof old.hyperspeedLength === 'number' ? { trailLength: old.hyperspeedLength / 5 } : {}),
    ...(typeof old.hyperspeedRotation === 'number' ? { curvature: old.hyperspeedRotation } : {}),
    ...asObject(value),
  }

  return {
    curve: oneOf(v.curve, HYPERSPEED_CURVES, d.curve),
    curvature: clamp(v.curvature, 0, 5, d.curvature),
    speed: clamp(v.speed, 0, 5, d.speed),
    boost: clamp(v.boost, 1, 10, d.boost),
    fov: clamp(v.fov, 20, 170, d.fov),
    boostFov: clamp(v.boostFov, 20, 170, d.boostFov),
    lanes: Math.round(clamp(v.lanes, 1, 8, d.lanes)),
    roadWidth: clamp(v.roadWidth, 1, 30, d.roadWidth),
    medianWidth: clamp(v.medianWidth, 0, 10, d.medianWidth),
    density: Math.round(clamp(v.density, 0, 200, d.density)),
    trailLength: clamp(v.trailLength, 0.05, 5, d.trailLength),
    lightSize: clamp(v.lightSize, 0.1, 5, d.lightSize),
    poles: Math.round(clamp(v.poles, 0, 100, d.poles)),
    poleHeight: clamp(v.poleHeight, 0.1, 4, d.poleHeight),
    dust: Math.round(clamp(v.dust, 0, 400, d.dust)),
    glow: clamp(v.glow, 0, 3, d.glow),
    reflections: clamp(v.reflections, 0, 2, d.reflections),
    steer: clamp(v.steer, 0, 2, d.steer),
    tailColors: normalizePalette(v.tailColors, 8),
    headColors: normalizePalette(v.headColors, 8),
    poleColors: normalizePalette(v.poleColors, 8),
    roadColor: normalizeOptionalColor(v.roadColor),
    roadOpacity: clamp(v.roadOpacity, 0, 1, d.roadOpacity),
    lineColor: normalizeOptionalColor(v.lineColor),
    background: normalizeOptionalColor(v.background),
    interactive: typeof v.interactive === 'boolean' ? v.interactive : d.interactive,
  }
}

export function normalizeLightningSettings(value: unknown, legacy?: Record<string, unknown>): LightningSettings {
  const d = DEFAULT_LIGHTNING_SETTINGS
  const old = asObject(legacy)
  const v: Record<string, unknown> = {
    ...(typeof old.lightningBolts === 'number' ? { bolts: old.lightningBolts } : {}),
    ...(typeof old.lightningThickness === 'number' ? { thickness: old.lightningThickness } : {}),
    ...(typeof old.lightningFrequency === 'number' ? { speed: old.lightningFrequency } : {}),
    ...asObject(value),
  }

  return {
    color: normalizeRequiredColor(v.color, d.color),
    bolts: Math.round(clamp(v.bolts, 1, 8, d.bolts)),
    spread: clamp(v.spread, 0, 3, d.spread),
    branches: clamp(v.branches, 0, 1, d.branches),
    xOffset: clamp(v.xOffset, -2, 2, d.xOffset),
    angle: clamp(v.angle, -180, 180, d.angle),
    size: clamp(v.size, 0.2, 4, d.size),
    thickness: clamp(v.thickness, 0.2, 6, d.thickness),
    glow: clamp(v.glow, 0, 3, d.glow),
    intensity: clamp(v.intensity, 0, 3, d.intensity),
    speed: clamp(v.speed, 0.1, 5, d.speed),
    flicker: clamp(v.flicker, 0, 1, d.flicker),
    mouseInteraction: typeof v.mouseInteraction === 'boolean' ? v.mouseInteraction : d.mouseInteraction,
    mouseStrength: clamp(v.mouseStrength, 0, 3, d.mouseStrength),
    clickStrike: typeof v.clickStrike === 'boolean' ? v.clickStrike : d.clickStrike,
    intro: typeof v.intro === 'boolean' ? v.intro : d.intro,
    fade: clamp(v.fade, 0, 1, d.fade),
    opacity: clamp(v.opacity, 0, 1, d.opacity),
    paused: typeof v.paused === 'boolean' ? v.paused : d.paused,
  }
}

export function normalizeSideRaysSettings(value: unknown, legacy?: Record<string, unknown>): SideRaysSettings {
  const d = DEFAULT_SIDE_RAYS_SETTINGS
  const old = asObject(legacy)
  const v: Record<string, unknown> = {
    ...(typeof old.sideraysCount === 'number' ? { density: old.sideraysCount } : {}),
    ...(typeof old.sideraysWidth === 'number' ? { spread: old.sideraysWidth } : {}),
    ...(typeof old.sideraysIntensity === 'number' ? { intensity: old.sideraysIntensity * 2 } : {}),
    ...asObject(value),
  }

  return {
    rayColor1: normalizeRequiredColor(v.rayColor1, d.rayColor1),
    rayColor2: normalizeRequiredColor(v.rayColor2, d.rayColor2),
    blend: clamp(v.blend, 0, 1, d.blend),
    origin: oneOf(v.origin, SIDE_RAYS_ORIGINS, d.origin),
    speed: clamp(v.speed, 0, 10, d.speed),
    intensity: clamp(v.intensity, 0, 5, d.intensity),
    spread: clamp(v.spread, 0.1, 8, d.spread),
    density: clamp(v.density, 1, 40, d.density),
    sharpness: clamp(v.sharpness, 0, 1, d.sharpness),
    tilt: clamp(v.tilt, -180, 180, d.tilt),
    falloff: clamp(v.falloff, 0.2, 6, d.falloff),
    glow: clamp(v.glow, 0, 5, d.glow),
    saturation: clamp(v.saturation, 0, 3, d.saturation),
    dust: clamp(v.dust, 0, 1, d.dust),
    followMouse: typeof v.followMouse === 'boolean' ? v.followMouse : d.followMouse,
    mouseInfluence: clamp(v.mouseInfluence, 0, 1, d.mouseInfluence),
    intro: typeof v.intro === 'boolean' ? v.intro : d.intro,
    opacity: clamp(v.opacity, 0, 1, d.opacity),
  }
}

export function normalizeHeroBackgroundSettings(value: unknown): HeroBackgroundSettings {
  const v = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>

  return {
    enabled: typeof v.enabled === 'boolean' ? v.enabled : DEFAULT_HERO_BACKGROUND_SETTINGS.enabled,
    style: oneOf(v.style, HERO_BACKGROUND_STYLES, DEFAULT_HERO_BACKGROUND_SETTINGS.style),
    antigravity: normalizeAntigravitySettings(v.antigravity),
    particles: normalizeParticleSettings(v.particles, v),
    galaxy: normalizeGalaxySettings(v.galaxy, v),
    letterGlitch: normalizeLetterGlitchSettings(v.letterGlitch, v),
    hyperspeed: normalizeHyperspeedSettings(v.hyperspeed, v),
    lightning: normalizeLightningSettings(v.lightning, v),
    sideRays: normalizeSideRaysSettings(v.sideRays, v),
  }
}
