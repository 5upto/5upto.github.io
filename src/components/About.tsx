import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const highlights = [
  { label: 'Experience', value: '2+ Years' },
  { label: 'Projects', value: '5+' },
  { label: 'Publications', value: '1' },
  { label: 'Certifications', value: '4' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

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

  return (
    <section ref={sectionRef} id="about" className="py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <h2 ref={headingRef} className="section-heading text-center">
          About <span className="gradient-text">Me</span>
        </h2>
        <p ref={textRef} className="text-slate-400 text-lg leading-relaxed max-w-3xl mx-auto text-center mb-16">
          I'm a Software Engineer from Dhaka, Bangladesh, currently building intelligent transportation
          solutions at Regnum Resource Ltd. I graduated from the National Institute of Technology Rourkela
          with a B.Tech in Computer Science, where I was awarded the ICCR International Scholarship by
          the Government of India. My work spans AI, computer vision, full-stack development, and
          enterprise systems.
        </p>
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {highlights.map((item) => (
            <div key={item.label} className="card text-center">
              <div className="text-3xl font-display font-bold gradient-text mb-1">{item.value}</div>
              <div className="text-slate-500 text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
