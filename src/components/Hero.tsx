import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ProfileCard from './ProfileCard'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(textRef.current?.children ?? [],
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }
    )
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        <div ref={textRef} className="flex-1 text-center lg:text-left">
          <p className="text-primary-400 font-display text-base md:text-lg mb-4 tracking-[0.2em] uppercase opacity-80">
            Software Engineer
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-4 leading-tight">
            Shawon{' '}
            <span className="gradient-text">Ghosh</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base md:text-lg leading-relaxed mb-10">
            I build production systems at the intersection of computer vision, AI, and software engineering.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
            <button
              onClick={() => scrollTo('experience')}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25"
            >
              View My Work
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="px-8 py-3 border border-[var(--border)] hover:border-primary-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full font-medium transition-all duration-300"
            >
              Get In Touch
            </button>
          </div>
        </div>
        <div className="flex-shrink-0 w-full max-w-sm lg:max-w-md">
          <ProfileCard
            avatarUrl="/images/DSC_0329.jpg.jpeg"
            handle="5upto"
            status="Open to opportunities"
            contactText="Contact"
            onContactClick={() => scrollTo('contact')}
          />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
