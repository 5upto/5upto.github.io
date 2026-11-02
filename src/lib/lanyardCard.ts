import type { LanyardSettings } from '../types/database'

export const CARD_WIDTH = 800
export const CARD_HEIGHT = 1100
export const RIBBON_WIDTH = 512
export const RIBBON_HEIGHT = 128

/** Fonts already loaded by index.html, so canvas can use them without a flash. */
export const LANYARD_FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Space Grotesk', value: 'Space Grotesk' },
  { label: 'Ubuntu', value: 'Ubuntu' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Oswald', value: 'Oswald' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Fira Code', value: 'Fira Code' },
] as const

export const DEFAULT_LANYARD_SETTINGS: LanyardSettings = {
  cardBg: '#f8fafc',
  cardBgDark: '#1a1a1a',
  ribbonColor: '#4338ca',
  ribbonColorDark: '#262626',
  photoScale: 100,
  photoOffsetX: 0,
  photoOffsetY: 0,
  fontFamily: 'Inter',
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/
const clamp = (value: unknown, min: number, max: number, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback

export function normalizeLanyardSettings(raw: unknown): LanyardSettings {
  const value = (raw && typeof raw === 'object' ? raw : {}) as Partial<LanyardSettings>
  return {
    cardBg: typeof value.cardBg === 'string' && HEX_RE.test(value.cardBg) ? value.cardBg : DEFAULT_LANYARD_SETTINGS.cardBg,
    cardBgDark: typeof value.cardBgDark === 'string' && HEX_RE.test(value.cardBgDark) ? value.cardBgDark : DEFAULT_LANYARD_SETTINGS.cardBgDark,
    ribbonColor: typeof value.ribbonColor === 'string' && HEX_RE.test(value.ribbonColor) ? value.ribbonColor : DEFAULT_LANYARD_SETTINGS.ribbonColor,
    ribbonColorDark: typeof value.ribbonColorDark === 'string' && HEX_RE.test(value.ribbonColorDark) ? value.ribbonColorDark : DEFAULT_LANYARD_SETTINGS.ribbonColorDark,
    photoScale: clamp(value.photoScale, 50, 200, DEFAULT_LANYARD_SETTINGS.photoScale),
    photoOffsetX: clamp(value.photoOffsetX, -50, 50, DEFAULT_LANYARD_SETTINGS.photoOffsetX),
    photoOffsetY: clamp(value.photoOffsetY, -50, 50, DEFAULT_LANYARD_SETTINGS.photoOffsetY),
    fontFamily: LANYARD_FONT_OPTIONS.some((font) => font.value === value.fontFamily)
      ? (value.fontFamily as string)
      : DEFAULT_LANYARD_SETTINGS.fontFamily,
  }
}

function parseHex(color: string): [number, number, number] {
  const hex = HEX_RE.test(color) ? color.slice(1) : '000000'
  const n = Number.parseInt(hex, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Relative brightness, used to pick readable text/logo colours automatically. */
export function isLightColor(color: string): boolean {
  const [r, g, b] = parseHex(color)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.58
}

export function contrastText(color: string): string {
  return isLightColor(color) ? '#1a1a1a' : '#ffffff'
}

function fontStack(family: string): string {
  return `"${family}", Inter, system-ui, sans-serif`
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load: ${src}`))
    img.src = src
  })
}

export interface CardFrontOptions {
  name: string
  role: string
  avatarUrl?: string | null
  isDark: boolean
  settings: LanyardSettings
  scale?: number
}

export async function renderCardFront({
  name,
  role,
  avatarUrl,
  isDark,
  settings,
  scale = 1,
}: CardFrontOptions): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(CARD_WIDTH * scale)
  canvas.height = Math.round(CARD_HEIGHT * scale)
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)

  const bg = isDark ? settings.cardBgDark : settings.cardBg
  const textColor = contrastText(bg)
  const roleColor = isDark ? '#c7c7c7' : '#4338ca'
  const INNER_PAD = 70
  const BOTTOM_ZONE = 200
  const imageX = INNER_PAD
  const imageY = INNER_PAD
  const imageW = CARD_WIDTH - INNER_PAD * 2
  const imageH = CARD_HEIGHT - INNER_PAD - BOTTOM_ZONE

  ctx.fillStyle = bg
  ctx.beginPath()
  ctx.roundRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 40)
  ctx.fill()

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(imageX, imageY, imageW, imageH, 20)
  ctx.clip()
  try {
    if (!avatarUrl) throw new Error('No avatar')
    const avatar = await loadImage(avatarUrl)
    const zoom = settings.photoScale / 100
    const cover = Math.max(imageW / avatar.naturalWidth, imageH / avatar.naturalHeight)
    const drawW = avatar.naturalWidth * cover * zoom
    const drawH = avatar.naturalHeight * cover * zoom
    const drawX = imageX + (imageW - drawW) / 2 + (settings.photoOffsetX / 100) * imageW
    const drawY = imageY + (imageH - drawH) / 2 + (settings.photoOffsetY / 100) * imageH
    ctx.drawImage(avatar, drawX, drawY, drawW, drawH)
  } catch {
    ctx.fillStyle = isDark ? '#333333' : '#4338ca'
    ctx.fillRect(imageX, imageY, imageW, imageH)
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold 120px ${fontStack(settings.fontFamily)}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(name.charAt(0) || '?', CARD_WIDTH / 2, imageY + imageH / 2)
    ctx.textBaseline = 'alphabetic'
  }
  ctx.restore()

  const textY = CARD_HEIGHT - BOTTOM_ZONE + 80
  ctx.textAlign = 'center'
  ctx.fillStyle = textColor
  ctx.font = `bold 44px ${fontStack(settings.fontFamily)}`
  ctx.fillText(name, CARD_WIDTH / 2, textY)

  ctx.fillStyle = roleColor
  ctx.font = `600 26px ${fontStack(settings.fontFamily)}`
  ctx.fillText(role, CARD_WIDTH / 2, textY + 50)

  return canvas.toDataURL('image/png')
}

export interface CardBackOptions {
  logoUrl?: string | null
  isDark: boolean
  settings: LanyardSettings
  scale?: number
}

export async function renderCardBack({ logoUrl, isDark, settings, scale = 1 }: CardBackOptions): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(CARD_WIDTH * scale)
  canvas.height = Math.round(CARD_HEIGHT * scale)
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)

  ctx.fillStyle = isDark ? settings.cardBgDark : settings.cardBg
  ctx.beginPath()
  ctx.roundRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 40)
  ctx.fill()

  if (logoUrl) {
    try {
      const logo = await loadImage(logoUrl)
      const size = Math.min(CARD_WIDTH, CARD_HEIGHT) * 0.4
      const aspect = logo.naturalWidth / logo.naturalHeight
      const logoW = aspect > 1 ? size : size * aspect
      const logoH = aspect > 1 ? size / aspect : size
      const x = (CARD_WIDTH - logoW) / 2
      const y = (CARD_HEIGHT - logoH) / 2
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(x, y, logoW, logoH, 24)
      ctx.clip()
      ctx.drawImage(logo, x, y, logoW, logoH)
      ctx.restore()
    } catch {
      // Logo is optional; keep the plain card back.
    }
  }

  return canvas.toDataURL('image/png')
}

export interface RibbonOptions {
  company: string
  logoUrl?: string | null
  isDark: boolean
  settings: LanyardSettings
  scale?: number
}

export async function renderRibbon({ company, logoUrl, isDark, settings, scale = 1 }: RibbonOptions): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(RIBBON_WIDTH * scale)
  canvas.height = Math.round(RIBBON_HEIGHT * scale)
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)

  const bg = isDark ? settings.ribbonColorDark : settings.ribbonColor
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, RIBBON_WIDTH, RIBBON_HEIGHT)

  ctx.fillStyle = contrastText(bg)
  ctx.font = `bold 28px ${fontStack(settings.fontFamily)}`
  ctx.textBaseline = 'middle'

  let logo: HTMLImageElement | null = null
  if (logoUrl) {
    try {
      logo = await loadImage(logoUrl)
    } catch {
      logo = null
    }
  }

  const text = company || ''
  const gap = 20
  const logoH = 50
  const logoW = logo ? (logo.naturalWidth >= logo.naturalHeight ? logoH * (logo.naturalWidth / logo.naturalHeight) : logoH) : 0
  const textW = ctx.measureText(text).width
  const totalW = (logo ? logoW + gap : 0) + textW
  const startX = (RIBBON_WIDTH - totalW) / 2
  const logoY = (RIBBON_HEIGHT - logoH) / 2

  if (logo) ctx.drawImage(logo, startX, logoY, logoW, logoH)
  ctx.textAlign = 'left'
  ctx.fillText(text, startX + (logo ? logoW + gap : 0), RIBBON_HEIGHT / 2)

  return canvas.toDataURL('image/png')
}
