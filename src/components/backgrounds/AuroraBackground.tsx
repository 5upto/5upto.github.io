import './backgrounds.css'

/** Soft, slowly drifting colour clouds behind the hero. */
export default function AuroraBackground() {
  return (
    <div className="hero-aurora" aria-hidden="true">
      <span className="hero-aurora-blob hero-aurora-blob--1" />
      <span className="hero-aurora-blob hero-aurora-blob--2" />
      <span className="hero-aurora-blob hero-aurora-blob--3" />
    </div>
  )
}
