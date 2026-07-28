import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedStepper from './AnimatedStepper'
import { useExperiences } from '../hooks/useExperiences'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const navigate = useNavigate()
  const { data: experiences } = useExperiences()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  if (!experiences) return null

  return (
    <section ref={sectionRef} id="experience" className="py-24 px-4 relative">
      <h2 ref={headingRef} className="section-heading text-center mb-12">
        Experience
      </h2>
      <div className="max-w-4xl mx-auto">
        <AnimatedStepper
          items={experiences ?? []}
          onItemClick={(slug) => navigate(`/experience/${slug}`)}
        />
      </div>
    </section>
  )
}
