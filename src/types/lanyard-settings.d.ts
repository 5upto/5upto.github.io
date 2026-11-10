import './database'

declare module './database' {
  interface LanyardSettings {
    version: 'classic' | 'modern'
    orientation: 'portrait' | 'landscape'
    finish: 'glossy' | 'matte' | 'holographic' | 'metallic'
    cornerRadius: number
    size: number
    anchor: 'left' | 'center' | 'right'
    positionMode: 'classic' | 'custom'
    strapLength: number
    strapWidth: number
    metal: 'silver' | 'gold' | 'graphite'
    gravity: number
    damping: number
    elasticity: number
    breeze: number
    interactive: boolean
    intro: boolean
  }
}
