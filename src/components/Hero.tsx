import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    )
    .fromTo(subtitleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.4'
    )
    .fromTo(descRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.4'
    )
    .fromTo(ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.3'
    )
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p
          ref={subtitleRef}
          className="text-primary-400 font-display text-lg md:text-xl mb-4 tracking-wider uppercase"
        >
          Software Engineer
        </p>
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6"
        >
          Shawon{' '}
          <span className="gradient-text">Ghosh</span>
        </h1>
        <p
          ref={descRef}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Building scalable systems at the intersection of AI and software engineering.
          From real-time computer vision pipelines to full-stack web platforms.
        </p>
        <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => scrollTo('experience')}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25"
          >
            View My Work
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="px-8 py-3 border border-slate-600 hover:border-primary-500 text-slate-300 hover:text-white rounded-full font-medium transition-all duration-300"
          >
            Get In Touch
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
