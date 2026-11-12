export interface Profile {
  id: string
  name: string
  title: string
  handle: string
  tagline: string
  status: string
  location: string
  bio: string
  avatar_url: string
  nav_avatar_url: string
  about_highlights: AboutHighlight[]
  created_at: string
  updated_at: string
}

export interface AboutHighlight {
  label: string
  value: string
}

export interface Resume {
  id: string
  label: string
  version: number
  is_live: boolean
  file_url: string
  storage_path: string
  file_name: string
  file_size: number | null
  note: string | null
  created_at: string
}

export interface Experience {
  id: string
  role: string
  company: string
  logo: string
  location: string
  period: string
  slug: string
  points: string[]
  story: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  tagline: string
  period: string
  org: string
  image: string
  slug: string
  points: string[]
  tech: string[]
  story: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  degree: string
  subject: string
  institution: string
  logo: string
  year: string
  style: 'nit' | 'bangladesh' | 'international'
  country_name: string
  board_name: string
  certificate_label: string
  signatory: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  name: string
  sort_order: number
  created_at: string
}

export interface Publication {
  id: string
  title: string
  publisher: string
  authors: PublicationAuthor[]
  affiliations: string[]
  conference: string
  location: string
  date: string
  doi: string
  pages: string
  keywords: string[]
  abstract: string
  url: string
  created_at: string
  updated_at: string
}

export interface PublicationAuthor {
  name: string
  affil: number
}

export interface Skill {
  id: string
  label: string
  color: string
  icon_name: string
  category: string
  sort_order: number
  created_at: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  label: string
  icon_svg: string
  sort_order: number
  created_at: string
}

export interface Blog {
  id: string
  title: string
  excerpt: string
  date: string
  image: string
  tags: string[]
  content: ContentBlock[]
  slug: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'image'; src: string; alt: string; caption?: string }

export interface GalleryStory {
  id: string
  title: string
  /** Cover image shown in the circular gallery and at the top of the story. */
  image: string
  /** All uploaded photos for this story. `image` is always one of these when present. */
  photos: string[]
  period: string
  slug: string
  story: string
  tags: string[]
  sort_order: number
  created_at: string
  updated_at: string
}

export interface NavItem {
  id: string
  label: string
  href: string
  sort_order: number
  created_at: string
}

export interface SiteConfig {
  key: string
  value: Record<string, unknown>
  updated_at: string
}

export type HeroBackgroundStyle = 'particles' | 'antigravity' | 'galaxy' | 'letter-glitch' | 'hyperspeed' | 'lightning' | 'side-rays'

export type AntigravityColorMode = 'conic' | 'radial' | 'random'

export type AntigravityParticleShape = 'capsule' | 'sphere' | 'box' | 'tetrahedron'

export type GalaxyDirection = 'forward' | 'backward'

export type LetterGlitchClickEffect = 'tear' | 'burst' | 'none'

export type HyperspeedCurve = 'straight' | 'gentle' | 'winding' | 'hills' | 'racing' | 'deep'

export type SideRaysOrigin = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'right' | 'left'

export type ParticleShapeType = 'circle' | 'edge' | 'triangle' | 'polygon' | 'star' | 'image'

export type ParticleMoveDirection =
  | 'none'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'
  | 'top-left'

export type ParticleOutMode = 'out' | 'bounce'

export type ParticleDetectOn = 'canvas' | 'window'

export type ParticleHoverMode = 'grab' | 'repulse' | 'bubble'

export type ParticleClickMode = 'push' | 'remove' | 'repulse' | 'bubble'

/** Full particles.js v2 configuration. */
export interface ParticleSettings {
  number: number
  densityEnable: boolean
  densityArea: number
  /** Empty means the theme colour. */
  color: string
  shapeType: ParticleShapeType
  shapeStrokeWidth: number
  shapeStrokeColor: string
  polygonSides: number
  imageSrc: string
  imageWidth: number
  imageHeight: number
  opacity: number
  opacityRandom: boolean
  opacityAnimEnable: boolean
  opacityAnimSpeed: number
  opacityAnimMin: number
  opacityAnimSync: boolean
  size: number
  sizeRandom: boolean
  sizeAnimEnable: boolean
  sizeAnimSpeed: number
  sizeAnimMin: number
  sizeAnimSync: boolean
  lineLinkedEnable: boolean
  lineLinkedDistance: number
  /** Empty means the theme colour. */
  lineLinkedColor: string
  lineLinkedOpacity: number
  lineLinkedWidth: number
  moveEnable: boolean
  moveSpeed: number
  moveDirection: ParticleMoveDirection
  moveRandom: boolean
  moveStraight: boolean
  moveOutMode: ParticleOutMode
  moveBounce: boolean
  moveAttractEnable: boolean
  moveAttractRotateX: number
  moveAttractRotateY: number
  detectOn: ParticleDetectOn
  hoverEnable: boolean
  hoverMode: ParticleHoverMode
  clickEnable: boolean
  clickMode: ParticleClickMode
  resize: boolean
  grabDistance: number
  grabLineOpacity: number
  bubbleDistance: number
  bubbleSize: number
  bubbleDuration: number
  bubbleOpacity: number
  repulseDistance: number
  repulseDuration: number
  pushCount: number
  removeCount: number
  retinaDetect: boolean
}

/** Full ReactBits Antigravity configuration, so every tweak can be persisted. */
export interface AntigravitySettings {
  colors: string[]
  colorMode: AntigravityColorMode
  colorSpeed: number
  count: number
  particleSize: number
  particleVariance: number
  particleShape: AntigravityParticleShape
  magnetRadius: number
  ringRadius: number
  fieldStrength: number
  waveAmplitude: number
  waveCount: number
  waveSpeed: number
  rotationSpeed: number
  pulseSpeed: number
  depthFactor: number
  ambient: number
  lerpSpeed: number
  opacity: number
  interactive: boolean
  clickBurst: boolean
  intro: boolean
}

/** Full ReactBits Galaxy configuration, so every prop can be persisted. */
export interface GalaxySettings {
  focalX: number
  focalY: number
  /** Star rotation in degrees; converted to the ReactBits [cos, sin] pair. */
  rotationAngle: number
  starSpeed: number
  density: number
  hueShift: number
  disableAnimation: boolean
  speed: number
  mouseInteraction: boolean
  glowIntensity: number
  saturation: number
  mouseRepulsion: boolean
  repulsionStrength: number
  twinkleIntensity: number
  rotationSpeed: number
  autoCenterRepulsion: number
  transparent: boolean
  /** Empty means the theme palette. */
  starColors: string[]
  starSize: number
  flareIntensity: number
  layers: number
  direction: GalaxyDirection
  clickWarp: boolean
  intro: boolean
  /** Empty means the theme background. */
  backgroundColor: string
  opacity: number
}

/** Full ReactBits Letter Glitch configuration. */
export interface LetterGlitchSettings {
  /** Empty means the theme palette. */
  glitchColors: string[]
  /** Empty means the theme base colour. */
  baseColor: string
  characters: string
  /** Empty means the ReactBits monospace stack. */
  fontFamily: string
  fontSize: number
  spacing: number
  density: number
  baseOpacity: number
  glitchAmount: number
  speed: number
  smooth: boolean
  interactive: boolean
  cursorRadius: number
  clickEffect: LetterGlitchClickEffect
  flow: number
  edgeFade: number
  centerFade: number
  intro: boolean
  /** Empty means the theme background. */
  backgroundColor: string
}

/** Full ReactBits Hyperspeed configuration. */
export interface HyperspeedSettings {
  curve: HyperspeedCurve
  curvature: number
  speed: number
  boost: number
  fov: number
  boostFov: number
  lanes: number
  roadWidth: number
  medianWidth: number
  density: number
  trailLength: number
  lightSize: number
  poles: number
  poleHeight: number
  dust: number
  glow: number
  reflections: number
  steer: number
  /** Empty arrays and colours fall back to the theme palette. */
  tailColors: string[]
  headColors: string[]
  poleColors: string[]
  roadColor: string
  roadOpacity: number
  lineColor: string
  background: string
  interactive: boolean
}

/** Full ReactBits Lightning configuration. */
export interface LightningSettings {
  color: string
  bolts: number
  spread: number
  branches: number
  xOffset: number
  /** Rotation in degrees. */
  angle: number
  size: number
  thickness: number
  glow: number
  intensity: number
  speed: number
  flicker: number
  mouseInteraction: boolean
  mouseStrength: number
  clickStrike: boolean
  intro: boolean
  fade: number
  opacity: number
  paused: boolean
}

/** Full ReactBits Side Rays configuration. */
export interface SideRaysSettings {
  rayColor1: string
  rayColor2: string
  blend: number
  origin: SideRaysOrigin
  speed: number
  intensity: number
  spread: number
  density: number
  sharpness: number
  /** Tilt in degrees. */
  tilt: number
  falloff: number
  glow: number
  saturation: number
  dust: number
  followMouse: boolean
  mouseInfluence: number
  intro: boolean
  opacity: number
}
/** Hero section background, stored in site_config under the "hero_background" key. */
export interface HeroBackgroundSettings {
  /** Master switch. When false the hero renders on the plain page background. */
  enabled: boolean
  style: HeroBackgroundStyle
  antigravity: AntigravitySettings
  /** particles.js configuration */
  particles: ParticleSettings
  /** ReactBits backgrounds */
  galaxy: GalaxySettings
  letterGlitch: LetterGlitchSettings
  hyperspeed: HyperspeedSettings
  lightning: LightningSettings
  sideRays: SideRaysSettings
}

export interface LanyardSettings {
  /** Card face colour in light mode. */
  cardBg: string
  /** Card face colour in dark mode. */
  cardBgDark: string
  /** Ribbon / strap colour in light mode. */
  ribbonColor: string
  /** Ribbon / strap colour in dark mode. */
  ribbonColorDark: string
  /** Avatar zoom, 100 = fill the photo frame. */
  photoScale: number
  /** Avatar horizontal shift, as a percentage of the photo frame width. */
  photoOffsetX: number
  /** Avatar vertical shift, as a percentage of the photo frame height. */
  photoOffsetY: number
  /** Photo frame corner radius in px. 0 = square corners. */
  photoRadius: number
  /** Colour of the metal ID-card cover / clip hardware. */
  coverColor: 'silver' | 'black'
  /** Font family used for the name, role and ribbon text. */
  fontFamily: string
}
