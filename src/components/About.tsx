import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useProfile } from '../hooks/useProfile'
import LoadingSpinner from './LoadingSpinner'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const { data: profile, isLoading } = useProfile()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
      gsap.fromTo(textRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      )
      gsap.fromTo(statsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  if (isLoading) return <LoadingSpinner />
  if (!profile) return null

  return (
    <section ref={sectionRef} id="about" className="py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <h2 ref={headingRef} className="section-heading text-center">
          About <span className="gradient-text">Me</span>
        </h2>
        <p ref={textRef} className="text-[var(--text-muted)] text-lg leading-relaxed max-w-3xl mx-auto text-center mb-16">
          {profile.bio}
        </p>
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {profile.about_highlights.map((item) => (
            <div key={item.label} className="card text-center">
              <div className="text-3xl font-display font-bold gradient-text mb-1">{item.value}</div>
              <div className="text-[var(--text-muted)] text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
