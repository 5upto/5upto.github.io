import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollStack, { ScrollStackItem } from './ScrollStack'
import { useProjects } from '../hooks/useProjects'
import LoadingSpinner from './LoadingSpinner'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const navigate = useNavigate()
  const { data: projects, isLoading } = useProjects()

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
    <section ref={sectionRef} id="projects" className="py-24 px-4 relative">
      <h2 ref={headingRef} className="section-heading text-center mb-12">
        <span className="gradient-text">Projects</span>
      </h2>
      <div className="max-w-4xl mx-auto">
        <ScrollStack useWindowScroll={true} itemDistance={120} itemScale={0.03} itemStackDistance={25} stackPosition="15%" baseScale={0.88}>
          {(projects ?? []).map((project) => (
            <ScrollStackItem key={project.id} itemClassName="!h-auto !p-0 !rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden cursor-pointer" onClick={() => navigate(`/projects/${project.slug}`)}>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative h-44 md:h-auto overflow-hidden bg-[var(--bg-elevated)]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-contain p-6"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--bg-card)] hidden md:block" />
                </div>
                <div className="md:w-3/5 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-display font-bold text-[var(--text-primary)]">{project.title}</h3>
                      <p className="text-accent-400 text-sm font-medium">{project.tagline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-primary-400 font-mono">{project.period}</span>
                    {project.org && (
                      <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded-full">{project.org}</span>
                    )}
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {project.points.slice(0, 3).map((point, i) => (
                      <li key={i} className="text-[var(--text-muted)] text-xs leading-relaxed flex gap-2">
                        <span className="text-primary-500 mt-0.5 shrink-0">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 6).map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
          </ScrollStackItem>
        ))}
        </ScrollStack>
      </div>
    </section>
  )
}
