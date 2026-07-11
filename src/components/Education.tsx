import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const education = [
  { degree: 'Bachelor of Technology', subject: 'Computer Science & Engineering', institution: 'National Institute of Technology Rourkela', year: '2025' },
  { degree: 'Higher Secondary Certificate', subject: 'Science', institution: 'Govt. Debendra College, Manikganj', year: '2019' },
  { degree: 'Secondary School Certificate', subject: 'Science', institution: 'Manikganj Govt. High School, Manikganj', year: '2017' },
]

const certifications = [
  'Microsoft Certified: Fabric Analytics Engineer Associate (DP-600)',
  'Microsoft Certified: Fabric Data Engineer Associate (DP-700)',
  'Microsoft Certified: SQL AI Developer Associate (DP-800)',
  'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
]

const publications = [
  'S. Ghosh, S. K. Panda, M. K. Bishwal, and P. K. Sa, "Transformer-Based Model for Building Classification Under Diverse Lighting Conditions," in Proceedings of the IEEE International Conference on Innovative Trends in Information Technology, 2025.',
]

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
      const blocks = sectionRef.current?.querySelectorAll('.edu-block')
      if (blocks) {
        gsap.fromTo(blocks,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="education" className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="edu-block">
          <h2 ref={headingRef} className="section-heading text-center">
            <span className="gradient-text">Education</span>
          </h2>
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div key={idx} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-display font-semibold text-[var(--text-primary)]">{edu.degree}</h3>
                  <p className="text-[var(--text-muted)] text-sm">{edu.subject}</p>
                  <p className="text-[var(--text-muted)] text-xs">{edu.institution}</p>
                </div>
                <span className="text-primary-400 font-mono text-sm">{edu.year}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="edu-block">
          <h2 className="section-heading text-center">
            <span className="gradient-text">Certifications</span>
          </h2>
          <div className="space-y-3">
            {certifications.map((cert, idx) => (
              <div key={idx} className="card flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                <p className="text-[var(--text-secondary)] text-sm">{cert}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="edu-block">
          <h2 className="section-heading text-center">
            <span className="gradient-text">Publications</span>
          </h2>
          {publications.map((pub, idx) => (
            <div key={idx} className="card">
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed italic">{pub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
