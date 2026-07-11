import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollStack, { ScrollStackItem } from './ScrollStack'

gsap.registerPlugin(ScrollTrigger)

const education = [
  {
    degree: 'Bachelor of Technology',
    subject: 'Computer Science & Engineering',
    institution: 'National Institute of Technology Rourkela',
    logo: '/images/logos/nitrkl.png',
    year: '2025',
  },
  {
    degree: 'Higher Secondary Certificate',
    subject: 'Science',
    institution: 'Govt. Debendra College, Manikganj',
    logo: '/images/logos/dhaka-board.png',
    year: '2019',
  },
  {
    degree: 'Secondary School Certificate',
    subject: 'Science',
    institution: 'Manikganj Govt. High School, Manikganj',
    logo: '/images/logos/dhaka-board.png',
    year: '2017',
  },
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
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="education" className="py-24 px-4 relative">
      <h2 ref={headingRef} className="section-heading text-center mb-12">
        <span className="gradient-text">Education</span>
      </h2>
      <div className="max-w-4xl mx-auto">
        <ScrollStack useWindowScroll={true} itemDistance={120} itemScale={0.03} itemStackDistance={25} stackPosition="15%" baseScale={0.88}>
          {education.map((edu, idx) => (
            <ScrollStackItem
              key={idx}
              itemClassName={`!h-auto !p-0 !rounded-sm overflow-hidden !bg-transparent !border-none !shadow-none`}
            >
              {edu.degree === 'Bachelor of Technology' ? (
                /* NIT Rourkela degree style */
                <div className="bg-white dark:bg-[#1a1818] rounded-sm overflow-hidden">
                  <div className="px-6 md:px-10 py-6 md:py-8">
                    <div className="border-2 border-[#1a237e]/40 dark:border-[#5a6abf]/40 p-1">
                      <div className="border border-[#1a237e]/20 dark:border-[#5a6abf]/20">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-[30%] flex items-center justify-center py-6 px-4">
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#f0f0f5] dark:bg-[#252535] flex items-center justify-center p-3 overflow-hidden">
                              <img src={edu.logo} alt={edu.institution} className="w-full h-full object-contain" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}} />
                            </div>
                          </div>
                          <div className="md:w-[70%] text-center md:text-left py-6 px-4 md:pl-0 md:pr-6">
                            <p className="text-[10px] tracking-[0.15em] uppercase text-[#5a6a8a] dark:text-[#7a8aaa] font-medium">भारत सरकार · Government of India</p>
                            <p className="text-xs tracking-[0.08em] uppercase text-[#1a237e] dark:text-[#7a8adf] font-bold mt-0.5">{edu.institution}</p>
                            <div className="w-10 h-px bg-[#1a237e]/30 dark:bg-[#5a6abf]/30 mx-auto md:mx-0 my-3" />
                            <p className="text-[10px] text-[#8a9aaa] dark:text-[#7a8aaa] uppercase tracking-wider">Conferred the Degree of</p>
                            <h3 className="text-lg md:text-xl font-bold text-[#1a1a2a] dark:text-[#d0d8e8] mt-1 leading-tight">{edu.degree}</h3>
                            <p className="text-xs text-[#5a6a7a] dark:text-[#8a9aaa] mt-1">in <span className="font-medium">{edu.subject}</span></p>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-4">
                              <span className="text-xs text-[#1a237e] dark:text-[#7a8adf] font-bold">{edu.year}</span>
                              <span className="text-[9px] text-[#8a9aaa] dark:text-[#6a7a8a]">— Registrar</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Bangladesh Board certificate style (HSC / SSC) */
                <div className="bg-white dark:bg-[#1a1816] rounded-sm overflow-hidden">
                  <div className="px-6 md:px-10 py-6 md:py-8">
                    <div className="border-2 border-[#c8b88a] dark:border-[#5a4f3a] p-1">
                      <div className="border border-[#c8b88a]/60 dark:border-[#5a4f3a]/60">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-[30%] flex items-center justify-center py-6 px-4">
                            <img src={edu.logo} alt={edu.institution} className="w-24 h-24 md:w-28 md:h-28 object-contain rounded-lg" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}} />
                          </div>
                          <div className="md:w-[70%] text-center md:text-left py-6 px-4 md:pl-0 md:pr-6">
                            <p className="text-[10px] tracking-[0.15em] uppercase text-[#8a7a6a] dark:text-[#8a7a6a] font-medium">Government of the People's Republic of Bangladesh</p>
                            <p className="text-[11px] tracking-[0.1em] uppercase text-[#006633] dark:text-[#4a9a6a] font-bold mt-0.5">Board of Intermediate and Secondary Education, Dhaka</p>
                            <div className="w-10 h-px bg-[#c8b88a] dark:bg-[#5a4f3a] mx-auto md:mx-0 my-3" />
                            <p className="text-[10px] text-[#a09080] dark:text-[#8a7a6a] uppercase tracking-wider">Certificate of</p>
                            <h3 className="text-lg md:text-xl font-bold text-[#1a1a1a] dark:text-[#e0d5c5] mt-1 leading-tight">{edu.degree}</h3>
                            <p className="text-xs text-[#6a5a4a] dark:text-[#a09080] mt-1">{edu.subject}</p>
                            <p className="text-xs text-[#4a4a4a] dark:text-[#8a7a6a] mt-2 italic">{edu.institution}</p>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-4">
                              <span className="text-xs text-[#006633] dark:text-[#4a9a6a] font-bold">{edu.year}</span>
                              <span className="text-[9px] text-[#a09080] dark:text-[#6a5a4a]">— Controller of Examinations</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      <div className="max-w-4xl mx-auto space-y-16 mt-20">
        <div>
          <h2 className="section-heading text-center">
            <span className="gradient-text">Certifications</span>
          </h2>
          <div className="space-y-3 mt-8">
            {certifications.map((cert, idx) => (
              <div key={idx} className="card flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                <p className="text-[var(--text-secondary)] text-sm">{cert}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="section-heading text-center">
            <span className="gradient-text">Publications</span>
          </h2>
          <div className="mt-8">
            {publications.map((pub, idx) => (
              <div key={idx} className="card">
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed italic">{pub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
