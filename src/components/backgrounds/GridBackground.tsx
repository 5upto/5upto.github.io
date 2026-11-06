import './backgrounds.css'

/** Fading technical grid with a slow central glow. */
export default function GridBackground() {
  return (
    <div className="hero-grid" aria-hidden="true">
      <div className="hero-grid-lines" />
      <div className="hero-grid-glow" />
    </div>
  )
}
