import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skillCategories = [
  {
    name: 'Languages',
    skills: ['Python', 'Java', 'C++', 'C', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    name: 'Frameworks',
    skills: ['PyQt5', 'FastAPI', 'Flask', 'React.js', 'Node.js', 'Express.js', 'Vert.x'],
  },
  {
    name: 'Machine Learning',
    skills: ['PyTorch', 'TensorFlow', 'OpenCV', 'YOLOv8', 'DeepLabV3', 'Scikit-Learn', 'NumPy', 'Pandas'],
  },
  {
    name: 'Databases',
    skills: ['Oracle SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'SQLite'],
  },
  {
    name: 'Cloud & Data',
    skills: ['Microsoft Fabric', 'Power BI', 'Power Apps', 'Power Automate', 'SharePoint'],
  },
  {
    name: 'Tools',
    skills: ['Git', 'Docker', 'Linux', 'Firebase', 'MLflow'],
  },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
      const items = sectionRef.current?.querySelectorAll('.skill-cat')
      if (items) {
        gsap.fromTo(items,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="skills" className="py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <h2 ref={headingRef} className="section-heading text-center">
          Technical <span className="gradient-text">Skills</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat) => (
            <div key={cat.name} className="skill-cat card">
              <h3 className="text-lg font-display font-semibold text-primary-400 mb-4">{cat.name}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-primary-500/50 hover:text-primary-300 transition-all duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
