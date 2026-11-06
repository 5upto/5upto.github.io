import type {
  AntigravityColorMode,
  AntigravityParticleShape,
  AntigravitySettings,
  HeroBackgroundSettings,
  HeroBackgroundStyle,
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
  'aurora',
  'grid',
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
    value: 'aurora',
    label: 'Aurora',
    description: 'Soft drifting colour clouds. Calm and GPU-cheap.',
    preview: 'radial-gradient(circle at 25% 30%, #6366f1 0%, transparent 45%), radial-gradient(circle at 75% 60%, #f472b6 0%, transparent 45%), radial-gradient(circle at 55% 85%, #22d3ee 0%, transparent 45%)',
  },
  {
    value: 'grid',
    label: 'Blueprint grid',
    description: 'Fading technical grid with a slow glow. Crisp and minimal.',
    preview: 'linear-gradient(rgba(99,102,241,.4) 1px, transparent 1px) 0 0 / 16px 16px, linear-gradient(90deg, rgba(99,102,241,.4) 1px, transparent 1px) 0 0 / 16px 16px',
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

export const DEFAULT_HERO_BACKGROUND_SETTINGS: HeroBackgroundSettings = {
  enabled: true,
  style: 'particles',
  antigravity: DEFAULT_ANTIGRAVITY_SETTINGS,
  galaxyDensity: 100,
  galaxySpeed: 1,
  galaxyHoles: 0,
  glitchSpeed: 1,
  glitchIntensity: 5,
  glitchOpacity: 0.5,
  hyperspeedStreaks: 20,
  hyperspeedLength: 5,
  hyperspeedRotation: 1,
  lightningBolts: 5,
  lightningThickness: 3,
  lightningFrequency: 1,
  sideraysCount: 4,
  sideraysWidth: 2,
  sideraysIntensity: 0.5,
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

export function normalizeHeroBackgroundSettings(value: unknown): HeroBackgroundSettings {
  const v = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>

  return {
    enabled: typeof v.enabled === 'boolean' ? v.enabled : DEFAULT_HERO_BACKGROUND_SETTINGS.enabled,
    style: oneOf(v.style, HERO_BACKGROUND_STYLES, DEFAULT_HERO_BACKGROUND_SETTINGS.style),
    antigravity: normalizeAntigravitySettings(v.antigravity),
    galaxyDensity: typeof v.galaxyDensity === 'number' ? v.galaxyDensity : DEFAULT_HERO_BACKGROUND_SETTINGS.galaxyDensity,
    galaxySpeed: typeof v.galaxySpeed === 'number' ? v.galaxySpeed : DEFAULT_HERO_BACKGROUND_SETTINGS.galaxySpeed,
    galaxyHoles: typeof v.galaxyHoles === 'number' ? v.galaxyHoles : DEFAULT_HERO_BACKGROUND_SETTINGS.galaxyHoles,
    glitchSpeed: typeof v.glitchSpeed === 'number' ? v.glitchSpeed : DEFAULT_HERO_BACKGROUND_SETTINGS.glitchSpeed,
    glitchIntensity: typeof v.glitchIntensity === 'number' ? v.glitchIntensity : DEFAULT_HERO_BACKGROUND_SETTINGS.glitchIntensity,
    glitchOpacity: typeof v.glitchOpacity === 'number' ? v.glitchOpacity : DEFAULT_HERO_BACKGROUND_SETTINGS.glitchOpacity,
    hyperspeedStreaks: typeof v.hyperspeedStreaks === 'number' ? v.hyperspeedStreaks : DEFAULT_HERO_BACKGROUND_SETTINGS.hyperspeedStreaks,
    hyperspeedLength: typeof v.hyperspeedLength === 'number' ? v.hyperspeedLength : DEFAULT_HERO_BACKGROUND_SETTINGS.hyperspeedLength,
    hyperspeedRotation: typeof v.hyperspeedRotation === 'number' ? v.hyperspeedRotation : DEFAULT_HERO_BACKGROUND_SETTINGS.hyperspeedRotation,
    lightningBolts: typeof v.lightningBolts === 'number' ? v.lightningBolts : DEFAULT_HERO_BACKGROUND_SETTINGS.lightningBolts,
    lightningThickness: typeof v.lightningThickness === 'number' ? v.lightningThickness : DEFAULT_HERO_BACKGROUND_SETTINGS.lightningThickness,
    lightningFrequency: typeof v.lightningFrequency === 'number' ? v.lightningFrequency : DEFAULT_HERO_BACKGROUND_SETTINGS.lightningFrequency,
    sideraysCount: typeof v.sideraysCount === 'number' ? v.sideraysCount : DEFAULT_HERO_BACKGROUND_SETTINGS.sideraysCount,
    sideraysWidth: typeof v.sideraysWidth === 'number' ? v.sideraysWidth : DEFAULT_HERO_BACKGROUND_SETTINGS.sideraysWidth,
    sideraysIntensity: typeof v.sideraysIntensity === 'number' ? v.sideraysIntensity : DEFAULT_HERO_BACKGROUND_SETTINGS.sideraysIntensity,
  }
}
