import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollStack, { ScrollStackItem } from './ScrollStack'

gsap.registerPlugin(ScrollTrigger)

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

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
      'Designed and developed enterprise-grade business applications using Microsoft Power Apps, focusing on scalability, usability, and performance.',
      'Built a fully automated Visitor Management System, streamlining check-in, tracking, and security workflows.',
      'Developed a Gate Pass Management System, enabling end-to-end automation of request, approval, and monitoring processes.',
      'Designed and delivered a Requisition Management System, automating request, approval, and tracking processes.',
      'Implemented workflow automation using Microsoft Power Automate to eliminate manual interventions and improve process efficiency.',
    ],
  },
  {
    role: 'Intern Developer',
    company: 'Itransition Group',
    logo: '/images/logos/itransition.png',
    location: 'Minsk, Belarus',
    period: 'Jul 2025 – Sep 2025',
    points: [
      'Developed and deployed scalable web applications using MERN, Agile methodologies and clean coding practices.',
      'Engineered a user management module with secure role-based authentication and authorization workflows.',
      'Designed and implemented a library management system featuring automated fake book generation for testing and demonstration.',
      'Collaborated on building a real-time presentation platform supporting multi-user editing and content synchronization.',
      'Delivered a customizable inventory management system with dynamic data fields and adaptive visualization.',
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'BigBasket',
    logo: '/images/logos/bigbasket.png',
    location: 'Bengaluru, India',
    period: 'Jan 2025 – Jul 2025',
    points: [
      'Collaborated with the professional services team to integrate and optimize solutions.',
      'Developed a new workflow for store incharges to collect COD payments from delivery partners.',
      'Built an interactive UI using ReactFlow to visualize and create reusable process and task templates, improving efficiency for the configuration team.',
      'Integrated the UI with existing Java Vert.x backend APIs to support automation and streamline workflow configuration.',
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
      'Worked as a research intern at IIT Mandi in the VIML research group for 2 months.',
      'Developed MedImagePro, an application for DICOM operations like detection, metadata extraction, bounding box management, and report generation.',
      'Fixed bugs related to incorrect detection and bounding box placements, and enabled annotation.',
      'The application generates PDF reports and saves updated DICOM files for further research.',
    ],
  },
]

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="py-24 px-4 relative">
      <h2 ref={headingRef} className="section-heading text-center mb-12">
        Experience
      </h2>
      <div className="max-w-3xl mx-auto">
        <ScrollStack useWindowScroll={true} itemDistance={120} itemScale={0.03} itemStackDistance={25} stackPosition="15%" baseScale={0.88}>
          {experiences.map((exp, idx) => (
            <ScrollStackItem key={idx} itemClassName="!h-auto !p-6 md:!p-8 !rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] cursor-pointer" onClick={() => navigate(`/experience/${slugify(exp.company)}`)}>
            <div className="flex items-center gap-3 mb-4">
              {exp.logo && (
                <img
                  src={exp.logo}
                  alt={exp.company}
                  className="w-10 h-10 object-contain rounded bg-white/10 p-1.5"
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
          </ScrollStackItem>
        ))}
        </ScrollStack>
      </div>
    </section>
  )
}
