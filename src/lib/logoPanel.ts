export type RGB = [number, number, number]

/**
 * Samples a logo's own background colour from its border.
 *
 * The panel behind the logo is painted this exact colour so the logo blends in
 * seamlessly, whatever hue it happens to be. Because the colour is used as-is,
 * it has to be measured reliably:
 *
 * - The median of a ring of edge pixels is used rather than a few raw corners,
 *   so a mark that bleeds into one edge, or a gradient border, cannot skew it.
 * - Transparent pixels are ignored, so logos with alpha cut-outs still resolve
 *   to their real background instead of black.
 */
export function sampleBorderColor(img: HTMLImageElement): RGB | null {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx || !img.naturalWidth || !img.naturalHeight) return null

  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  try {
    ctx.drawImage(img, 0, 0)
  } catch {
    return null
  }

  const w = canvas.width
  const h = canvas.height
  const steps = Math.min(64, Math.max(8, Math.round(Math.max(w, h) / 40)))
  const coords: [number, number][] = []

  for (let i = 0; i <= steps; i++) {
    const x = Math.round((i / steps) * (w - 1))
    const y = Math.round((i / steps) * (h - 1))
    coords.push([x, 0], [x, h - 1], [0, y], [w - 1, y])
  }

  const samples: RGB[] = []
  try {
    for (const [x, y] of coords) {
      const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data
      if (a < 128) continue
      samples.push([r, g, b])
    }
  } catch {
    // Tainted canvas (cross-origin image served without CORS headers).
    return null
  }

  if (!samples.length) return null

  const median = (channel: 0 | 1 | 2) => {
    const values = samples.map(s => s[channel]).sort((a, b) => a - b)
    return values[Math.floor(values.length / 2)]
  }

  return [median(0), median(1), median(2)]
}

/**
 * Background colour to paint behind a logo: the logo's own background, verbatim.
 * Returns null when the colour cannot be sampled, so callers can fall back to
 * their normal surface.
 */
export function logoPanelStyle(img: HTMLImageElement): string | null {
  const sampled = sampleBorderColor(img)
  if (!sampled) return null
  return `rgb(${sampled[0]}, ${sampled[1]}, ${sampled[2]})`
}
