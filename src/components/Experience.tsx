import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    role: 'Software Engineer',
    company: 'Regnum Resource Ltd.',
    logo: '/images/logos/regnum.png',
    location: 'Dhaka, Bangladesh',
    period: 'Jun 2026 – Present',
    points: [
      'Developing intelligent transportation solutions powered by AI and Computer Vision.',
      'Designing high-performance desktop applications using Python and PyQt for real-time monitoring.',
      'Developing AI-based vehicle detection, tracking and classification modules using Deep Learning.',
      'Building REST APIs with FastAPI and integrating Oracle SQL databases for enterprise applications.',
      'Working on ANPR, RFID integration, traffic analytics and real-time automation systems.',
    ],
  },
  {
    role: 'Technology Specialist',
    company: 'Betopia Limited',
    logo: '/images/logos/betopia.png',
    location: 'Dhaka, Bangladesh',
    period: 'Oct 2025 – May 2026',
    points: [
      'Built enterprise business applications using Microsoft Power Apps with focus on scalability.',
      'Developed Visitor Management, Gate Pass and Requisition Management Systems.',
      'Implemented workflow automation via Power Automate, reducing manual intervention.',
      'Administered Microsoft 365 and Active Directory (AD DS), managing users and access control.',
    ],
  },
  {
    role: 'Intern Developer',
    company: 'Itransition Group',
    logo: '/images/logos/itransition.png',
    location: 'Minsk, Belarus',
    period: 'Jul 2025 – Sep 2025',
    points: [
      'Developed and deployed scalable web applications using MERN stack and Agile practices.',
      'Engineered a user management module with secure role-based authentication.',
      'Built a library management system with automated fake data generation for testing.',
      'Collaborated on a real-time presentation platform with multi-user editing.',
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'BigBasket',
    logo: '/images/logos/bigbasket.png',
    location: 'Bengaluru, India',
    period: 'Jan 2025 – Jul 2025',
    points: [
      'Collaborated with the professional services team to integrate enterprise solutions.',
      'Developed a workflow for store incharges to collect COD payments from delivery partners.',
      'Built an interactive UI using ReactFlow to visualize task templates.',
      'Integrated the UI with existing Java Vert.x backend APIs.',
    ],
  },
  {
    role: 'Undergraduate Research Assistant',
    company: 'NIT Rourkela',
    logo: '/images/logos/nitrkl.png',
    location: 'Rourkela, India',
    period: 'Jul 2024 – Dec 2024',
    points: [
      'Conducted research on Building Classification under Diverse Lighting Conditions.',
      'Applied image augmentation techniques: blur, rotation, zooming and histogram equalization.',
      'Developed a CNN integrated with self-attention Transformer for robust image classification.',
      'Published the research at an IEEE International Conference.',
    ],
  },
  {
    role: 'Research Intern',
    company: 'IIT Mandi',
    logo: '/images/logos/iitmandi.png',
    location: 'Mandi, India',
    period: 'May 2024 – Jul 2024',
    points: [
      'Worked in the Visual Intelligence and Machine Learning (VIML) research group.',
      'Developed DICOMET, a desktop app for DICOM visualization and metadata extraction.',
      'Improved AI detection accuracy and optimized bounding-box placement for medical image analysis.',
    ],
  },
]

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
      const items = sectionRef.current?.querySelectorAll('.exp-item')
      if (items) {
        gsap.fromTo(items,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
        )
        items.forEach((item) => {
          const dot = item.querySelector('.timeline-dot')
          if (dot) {
            gsap.to(dot, {
              backgroundColor: '#f472b6',
              boxShadow: '0 0 12px rgba(244, 114, 182, 0.6)',
              scrollTrigger: {
                trigger: item,
                start: 'top 70%',
                end: 'top 30%',
                toggleActions: 'play reverse play reverse',
              },
            })
          }
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <h2 ref={headingRef} className="section-heading text-center">
          Experience
        </h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-accent-500 to-transparent" />
          {experiences.map((exp, idx) => (
            <div key={idx} className={`exp-item relative flex flex-col md:flex-row gap-4 md:gap-8 mb-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="hidden md:block flex-1" />
              <div className="timeline-dot absolute left-4 md:left-1/2 w-3 h-3 bg-primary-500 rounded-full -translate-x-1/2 mt-2 ring-4 ring-slate-950 transition-shadow duration-300" />
              <div className={`flex-1 ml-10 md:ml-0 ${idx % 2 === 0 ? 'md:text-right md:pr-8' : 'md:pl-8'}`}>
                <div className={`flex items-center gap-3 mb-2 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {exp.logo && (
                    <img
                      src={exp.logo}
                      alt={exp.company}
                      className="w-8 h-8 object-contain rounded bg-white/10 p-1"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                  <div>
                    <span className="text-xs text-primary-400 font-mono">{exp.period}</span>
                    <h3 className="text-xl font-display font-bold text-white mt-1">{exp.role}</h3>
                    <p className="text-accent-400 font-medium text-sm">{exp.company}</p>
                    <p className="text-slate-500 text-xs">{exp.location}</p>
                  </div>
                </div>
                <ul className={`space-y-2 mt-3 ${idx % 2 === 0 ? 'md:text-right' : ''}`}>
                  {exp.points.map((point, i) => (
                    <li key={i} className="text-slate-400 text-sm leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
