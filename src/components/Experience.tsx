import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollStack, { ScrollStackItem } from './ScrollStack'
import { useExperiences } from '../hooks/useExperiences'
import LoadingSpinner from './LoadingSpinner'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const navigate = useNavigate()
  const { data: experiences, isLoading } = useExperiences()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  if (isLoading) return <LoadingSpinner />

  return (
    <section ref={sectionRef} id="experience" className="py-24 px-4 relative">
      <h2 ref={headingRef} className="section-heading text-center mb-12">
        Experience
      </h2>
      <div className="max-w-3xl mx-auto">
        <ScrollStack useWindowScroll={true} itemDistance={120} itemScale={0.03} itemStackDistance={25} stackPosition="15%" baseScale={0.88}>
          {(experiences ?? []).map((exp) => (
            <ScrollStackItem key={exp.id} itemClassName="!h-auto !p-6 md:!p-8 !rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] cursor-pointer">
              <button
                type="button"
                className="w-full text-left p-0 m-0 bg-transparent border-0"
                onClick={() => navigate(`/experience/${exp.slug}`)}
              >
                <div className="flex items-center gap-3 mb-4">
                  {exp.logo && (
                    <img
                      src={exp.logo}
                      alt={exp.company}
                      className="w-10 h-10 object-contain rounded"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                  <div>
                    <span className="text-xs text-primary-400 font-mono">{exp.period}</span>
                    <h3 className="text-xl font-display font-bold text-[var(--text-primary)] mt-0.5">{exp.role}</h3>
                    <p className="text-accent-400 font-medium text-sm">{exp.company}</p>
                    <p className="text-[var(--text-muted)] text-xs">{exp.location}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.points.map((point, i) => (
                    <li key={i} className="text-[var(--text-muted)] text-sm leading-relaxed flex gap-2">
                      <span className="text-primary-500 mt-1 shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </button>
            </ScrollStackItem>
        ))}
        </ScrollStack>
      </div>
    </section>
  )
}
