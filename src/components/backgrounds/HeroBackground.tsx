import Antigravity from './Antigravity'
import AuroraBackground from './AuroraBackground'
import GridBackground from './GridBackground'
import ParticleBackground from '../ParticleBackground'
import type { HeroBackgroundSettings } from '../../types/database'

interface HeroBackgroundProps {
  settings: HeroBackgroundSettings
  /** Current site theme, used to keep the Antigravity palette readable. */
  isDark: boolean
}

/** Renders the hero background chosen in Admin → Hero Background. */
export default function HeroBackground({ settings, isDark }: HeroBackgroundProps) {
  if (!settings.enabled) return null

  if (settings.style === 'particles') return <ParticleBackground />

  const antigravity = settings.antigravity

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {settings.style === 'antigravity' && (
        <Antigravity
          colors={antigravity.colors}
          colorMode={antigravity.colorMode}
          colorSpeed={antigravity.colorSpeed}
          count={antigravity.count}
          particleSize={antigravity.particleSize}
          particleVariance={antigravity.particleVariance}
          particleShape={antigravity.particleShape}
          magnetRadius={antigravity.magnetRadius}
          ringRadius={antigravity.ringRadius}
          fieldStrength={antigravity.fieldStrength}
          waveAmplitude={antigravity.waveAmplitude}
          waveCount={antigravity.waveCount}
          waveSpeed={antigravity.waveSpeed}
          rotationSpeed={antigravity.rotationSpeed}
          pulseSpeed={antigravity.pulseSpeed}
          depthFactor={antigravity.depthFactor}
          ambient={antigravity.ambient}
          lerpSpeed={antigravity.lerpSpeed}
          opacity={antigravity.opacity}
          interactive={antigravity.interactive}
          clickBurst={antigravity.clickBurst}
          intro={antigravity.intro}
          lightMode={!isDark}
          className="h-full w-full"
        />
      )}
      {settings.style === 'aurora' && <AuroraBackground />}
      {settings.style === 'grid' && <GridBackground />}
    </div>
  )
}
