import Antigravity from './Antigravity'
import Galaxy from './Galaxy'
import LetterGlitch from './LetterGlitch'
import Hyperspeed from './Hyperspeed'
import Lightning from './Lightning'
import SideRays from './SideRays'
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

  const antigravity = settings.antigravity
  const galaxy = settings.galaxy
  const glitch = settings.letterGlitch
  const hyperspeed = settings.hyperspeed
  const lightning = settings.lightning
  const sideRays = settings.sideRays
  const theme = isDark ? 'dark' : 'light'
  const galaxyRotation: [number, number] = [
    Math.cos((galaxy.rotationAngle * Math.PI) / 180),
    Math.sin((galaxy.rotationAngle * Math.PI) / 180),
  ]

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {settings.style === 'particles' && <ParticleBackground settings={settings.particles} />}
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
      {settings.style === 'galaxy' && (
        <Galaxy
          focal={[galaxy.focalX, galaxy.focalY]}
          rotation={galaxyRotation}
          starSpeed={galaxy.starSpeed}
          density={galaxy.density}
          hueShift={galaxy.hueShift}
          disableAnimation={galaxy.disableAnimation}
          speed={galaxy.speed}
          mouseInteraction={galaxy.mouseInteraction}
          glowIntensity={galaxy.glowIntensity}
          saturation={galaxy.saturation}
          mouseRepulsion={galaxy.mouseRepulsion}
          repulsionStrength={galaxy.repulsionStrength}
          twinkleIntensity={galaxy.twinkleIntensity}
          rotationSpeed={galaxy.rotationSpeed}
          autoCenterRepulsion={galaxy.autoCenterRepulsion}
          transparent={galaxy.transparent}
          starColors={galaxy.starColors}
          starSize={galaxy.starSize}
          flareIntensity={galaxy.flareIntensity}
          layers={galaxy.layers}
          direction={galaxy.direction}
          clickWarp={galaxy.clickWarp}
          intro={galaxy.intro}
          backgroundColor={galaxy.backgroundColor || undefined}
          opacity={galaxy.opacity}
          lightMode={!isDark}
          className="h-full w-full"
        />
      )}
      {settings.style === 'letter-glitch' && (
        <LetterGlitch
          glitchColors={glitch.glitchColors}
          baseColor={glitch.baseColor || undefined}
          characters={glitch.characters}
          fontFamily={glitch.fontFamily || undefined}
          fontSize={glitch.fontSize}
          spacing={glitch.spacing}
          density={glitch.density}
          baseOpacity={glitch.baseOpacity}
          glitchAmount={glitch.glitchAmount}
          speed={glitch.speed}
          smooth={glitch.smooth}
          interactive={glitch.interactive}
          cursorRadius={glitch.cursorRadius}
          clickEffect={glitch.clickEffect}
          flow={glitch.flow}
          edgeFade={glitch.edgeFade}
          centerFade={glitch.centerFade}
          intro={glitch.intro}
          backgroundColor={glitch.backgroundColor || undefined}
          lightMode={!isDark}
          className="h-full w-full"
        />
      )}
      {settings.style === 'hyperspeed' && (
        <Hyperspeed
          curve={hyperspeed.curve}
          curvature={hyperspeed.curvature}
          speed={hyperspeed.speed}
          boost={hyperspeed.boost}
          fov={hyperspeed.fov}
          boostFov={hyperspeed.boostFov}
          lanes={hyperspeed.lanes}
          roadWidth={hyperspeed.roadWidth}
          medianWidth={hyperspeed.medianWidth}
          density={hyperspeed.density}
          trailLength={hyperspeed.trailLength}
          lightSize={hyperspeed.lightSize}
          poles={hyperspeed.poles}
          poleHeight={hyperspeed.poleHeight}
          dust={hyperspeed.dust}
          glow={hyperspeed.glow}
          reflections={hyperspeed.reflections}
          steer={hyperspeed.steer}
          tailColors={hyperspeed.tailColors}
          headColors={hyperspeed.headColors}
          poleColors={hyperspeed.poleColors}
          roadColor={hyperspeed.roadColor || undefined}
          roadOpacity={hyperspeed.roadOpacity}
          lineColor={hyperspeed.lineColor || undefined}
          background={hyperspeed.background || undefined}
          interactive={hyperspeed.interactive}
          theme={theme}
          className="h-full w-full"
        />
      )}
      {settings.style === 'lightning' && (
        <Lightning
          color={lightning.color}
          bolts={lightning.bolts}
          spread={lightning.spread}
          branches={lightning.branches}
          xOffset={lightning.xOffset}
          angle={lightning.angle}
          size={lightning.size}
          thickness={lightning.thickness}
          glow={lightning.glow}
          intensity={lightning.intensity}
          speed={lightning.speed}
          flicker={lightning.flicker}
          mouseInteraction={lightning.mouseInteraction}
          mouseStrength={lightning.mouseStrength}
          clickStrike={lightning.clickStrike}
          intro={lightning.intro}
          fade={lightning.fade}
          opacity={lightning.opacity}
          paused={lightning.paused}
          lightMode={!isDark}
          className="h-full w-full"
        />
      )}
      {settings.style === 'side-rays' && (
        <SideRays
          rayColor1={sideRays.rayColor1}
          rayColor2={sideRays.rayColor2}
          blend={sideRays.blend}
          origin={sideRays.origin}
          speed={sideRays.speed}
          intensity={sideRays.intensity}
          spread={sideRays.spread}
          density={sideRays.density}
          sharpness={sideRays.sharpness}
          tilt={sideRays.tilt}
          falloff={sideRays.falloff}
          glow={sideRays.glow}
          saturation={sideRays.saturation}
          dust={sideRays.dust}
          followMouse={sideRays.followMouse}
          mouseInfluence={sideRays.mouseInfluence}
          intro={sideRays.intro}
          opacity={sideRays.opacity}
          lightMode={!isDark}
          className="h-full w-full"
        />
      )}
    </div>
  )
}
