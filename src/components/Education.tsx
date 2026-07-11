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
  {
    title: 'Transformer-Based Model for Building Classification Under Diverse Lighting Conditions',
    authors: [
      { name: 'S. Ghosh', affil: 1 },
      { name: 'S. K. Panda', affil: 2 },
      { name: 'M. K. Bishwal', affil: 1 },
      { name: 'P. K. Sa', affil: 1 },
    ],
    affiliations: [
      'Department of Computer Science and Engineering, National Institute of Technology Rourkela, India',
      'Department of Computer Science, School of Computer Science, UPES Dehradun, India',
    ],
    conference: '2025 International Conference on Innovative Trends in Information Technology (ICITIIT)',
    location: 'Kottayam, India',
    date: '21–22 February 2025',
    doi: '10.1109/ICITIIT64777.2025.11040288',
    pages: 'pp. 1–6',
    keywords: ['Building Classification', 'Transformer', 'Self-Attention', 'Computer Vision', 'Image Enhancement'],
    abstract: 'Building classification is pivotal in various applications, such as urban planning, navigation, and campus management. This paper presents a novel approach for building classification using a transformer-based model. The proposed framework integrates convolutional neural networks and self-attention mechanisms, leveraging the capabilities of both local and non-local feature extraction. We have curated a diverse dataset by taking images of various buildings at the National Institute of Technology Rourkela (NITR) campus. To address challenges posed by diverse lighting conditions, we have included images of both day and night. Our dataset includes 1600 images in total, having 10 classes. Image enhancement techniques such as histogram equalization are employed to mitigate the effects of poor illumination. Experimental results demonstrate the superiority of our approach in achieving robust classification under varying lighting conditions. Additionally, a user-friendly graphical user interface (GUI) is developed, enabling building classification through image uploads.',
    url: 'https://ieeexplore.ieee.org/abstract/document/11040288',
  },
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
    <section ref={sectionRef} id="education" className="py-16 md:py-20 px-4 relative">
      <h2 ref={headingRef} className="section-heading text-center mb-8 md:mb-10">
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
                            <img src={edu.logo} alt={edu.institution} className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}} />
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

      <div className="max-w-4xl mx-auto mt-12 md:mt-16">
        <h2 className="section-heading text-center mb-8 md:mb-10">
          <span className="gradient-text">Certifications</span>
        </h2>
        <ScrollStack useWindowScroll={true} itemDistance={120} itemScale={0.03} itemStackDistance={25} stackPosition="15%" baseScale={0.88}>
          {certifications.map((cert, idx) => {
            const match = cert.match(/^Microsoft Certified:\s*(.+?)\s*\((.+?)\)$/)
            const title = match ? match[1] : cert
            const certId = match ? match[2] : ''
            return (
              <ScrollStackItem key={idx} itemClassName="!h-auto !p-0 !rounded-xl overflow-hidden !bg-transparent !border-none !shadow-none">
                <div className="bg-[#f5f5f5] dark:bg-[#141414] rounded-xl overflow-hidden border border-[#d4d4d4] dark:border-[#2a2a2a] w-full">
                  <div className="px-6 md:px-8 py-6 md:py-7 flex flex-col items-center text-center gap-5">
                    <div className="shrink-0 w-[92px] h-[92px]">
                      <svg viewBox="0 0 300 300" className="w-full h-full">
                        <path d="M283.38 118.47a16.44 16.44 0 00-10.75-6.69q-11.26-1.95-22.56-3.52V54.43A21.54 21.54 0 00235.49 34l-.16-.05h-.17l-74.74-22.61A32.63 32.63 0 00150 9.64a32.58 32.58 0 00-10.41 1.7L64.84 33.93h-.17l-.16.05a21.54 21.54 0 00-14.58 20.4v53.83q-11.3 1.58-22.56 3.52a16.44 16.44 0 00-10.75 6.69 13.48 13.48 0 00-2.25 10.25l11 57.39a14.64 14.64 0 0016.82 11.47c2.6-.45 5.2-.87 7.81-1.29.15 14.32 5.62 28.23 16.3 41.36 8.15 10 19.37 19.62 33.34 28.52a244.66 244.66 0 0047.18 23.07l3.28 1.12 3.27-1.15a250.23 250.23 0 0047.12-23.35c14-9 25.17-18.56 33.3-28.53 10.68-13.09 16.16-26.9 16.31-41 2.61.42 5.21.84 7.81 1.29a14.92 14.92 0 002.48.21 14.62 14.62 0 0014.34-11.69l10.95-57.37a13.49 13.49 0 00-2.3-10.25z" fill="#002050"/>
                        <path d="M60 194.35v1.34c0 53.33 90 84.06 90 84.06s90-31.52 90-84.06v-.91a633.88 633.88 0 00-180-.43z" fill="#0064b5"/>
                        <path d="M240 106.93V54.8a11.52 11.52 0 00-7.78-10.91l-74.85-22.63a22.81 22.81 0 00-14.72 0L67.74 43.89A11.52 11.52 0 0060 54.8v52.13a720.59 720.59 0 01180 0z" fill="#505050"/>
                        <path d="M104 88.53a7.62 7.62 0 01-3.63.77 5.89 5.89 0 01-4.5-1.8 6.71 6.71 0 01-1.69-4.74 7 7 0 011.9-5.1 6.46 6.46 0 014.82-2 7.73 7.73 0 013.1.54v1.64a6.34 6.34 0 00-3.12-.78 4.77 4.77 0 00-3.67 1.51 5.7 5.7 0 00-1.41 4 5.4 5.4 0 001.32 3.83 4.47 4.47 0 003.45 1.43A6.44 6.44 0 00104 87zm13.43.55h-7V75.93h6.68v1.4H112v4.37h4.75v1.39H112v4.6h5.43zm15.72 0h-1.83l-2.2-3.68a8.35 8.35 0 00-.59-.88 3.62 3.62 0 00-.58-.59 2.38 2.38 0 00-.65-.34 2.61 2.61 0 00-.77-.1h-1.27v5.59h-1.54V75.93h3.93a5.41 5.41 0 011.59.22 3.55 3.55 0 011.27.65 3.29 3.29 0 01.84 1.1 4 4 0 01.09 2.8 3.24 3.24 0 01-.59 1 3.54 3.54 0 01-.91.76 4.53 4.53 0 01-1.21.5 2.61 2.61 0 01.57.34 2.76 2.76 0 01.47.44c.14.17.29.37.43.58s.31.47.48.76zm-7.89-11.75v4.76h2.09a3 3 0 001.07-.17 2.48 2.48 0 00.85-.5 2.18 2.18 0 00.56-.8 2.54 2.54 0 00.2-1.06 2 2 0 00-.68-1.64 2.93 2.93 0 00-2-.59zm20.4 0h-3.8v11.75h-1.54V77.33h-3.79v-1.4h9.13zM153 89.08h-1.55V75.93H153zm13.92-11.75h-5.13v4.55h4.75v1.38h-4.75v5.82h-1.55V75.93h6.68zm7.8 11.75h-1.54V75.93h1.54zm14.2 0h-7V75.93h6.68v1.4h-5.14v4.37h4.76v1.39h-4.76v4.6h5.44zm6.29 0V75.93h3.63q7 0 7 6.41a6.48 6.48 0 01-1.93 4.9 7.17 7.17 0 01-5.17 1.84zm1.54-11.75v10.36h2a5.54 5.54 0 004-1.39 5.18 5.18 0 001.44-3.92q0-5.05-5.37-5zm-82.67-12.67h-3.94V54.08q0-1.71.15-3.78h-.1a18.93 18.93 0 01-.55 2.34l-4.14 12h-3.26L98 52.76a22.63 22.63 0 01-.56-2.46h-.11c.11 1.74.16 3.27.16 4.58v9.78h-3.56V47h5.83l3.62 10.48A15.3 15.3 0 01104 60h.08c.22-1 .46-1.83.7-2.56L108.39 47h5.69zM119.69 50a2.29 2.29 0 01-1.62-.59 1.88 1.88 0 01-.63-1.43 1.81 1.81 0 01.63-1.43 2.62 2.62 0 013.24 0 1.83 1.83 0 01.62 1.43 1.89 1.89 0 01-.62 1.45 2.32 2.32 0 01-1.62.57zm1.92 14.62h-3.9V52h3.9zm12.84-.42a7.7 7.7 0 01-3.81.77 6.42 6.42 0 01-4.7-1.77 6.08 6.08 0 01-1.8-4.55 6.73 6.73 0 011.92-5.07 7.13 7.13 0 015.16-1.85 6.54 6.54 0 013.23.59v3.3a4.41 4.41 0 00-2.72-.91 3.62 3.62 0 00-2.66 1 3.68 3.68 0 00-1 2.71A3.63 3.63 0 00129 61a3.42 3.42 0 002.58.95 5.08 5.08 0 002.84-.91zm10.79-8.65a3.31 3.31 0 00-1.64-.38 2.34 2.34 0 00-2 .93 4 4 0 00-.72 2.53v6H137V52h3.89v2.35a3.38 3.38 0 013.33-2.57 2.47 2.47 0 011 .15zM153 65a6.78 6.78 0 01-5-1.77 6.39 6.39 0 01-1.81-4.8 6.4 6.4 0 011.88-4.9 7.06 7.06 0 015.06-1.77 6.69 6.69 0 014.93 1.77 6.22 6.22 0 011.79 4.67 6.66 6.66 0 01-1.84 5A6.85 6.85 0 01153 65zm.1-10.26a2.62 2.62 0 00-2.15.95 4.18 4.18 0 00-.76 2.69q0 3.63 2.93 3.63t2.8-3.73q-.03-3.57-2.85-3.57zm8.46 9.59v-3.16a8.11 8.11 0 001.92.86 6.37 6.37 0 001.81.29 3.84 3.84 0 001.63-.29.91.91 0 00.6-.86.81.81 0 00-.27-.62 3.1 3.1 0 00-.7-.43 8.34 8.34 0 00-.93-.33c-.34-.1-.66-.21-1-.33a10.28 10.28 0 01-1.32-.61 3.88 3.88 0 01-1-.76 2.88 2.88 0 01-.59-1 3.89 3.89 0 01-.21-1.34 3.46 3.46 0 01.47-1.83 3.59 3.59 0 011.23-1.25A5.66 5.66 0 01165 52a9.32 9.32 0 012.07-.22 11.09 11.09 0 011.7.13 12.58 12.58 0 011.7.37v3a6.18 6.18 0 00-1.59-.65 6.79 6.79 0 00-1.65-.21 4.23 4.23 0 00-.73.06 2.91 2.91 0 00-.59.2 1.15 1.15 0 00-.41.33.78.78 0 00-.15.47.9.9 0 00.22.59 2 2 0 00.58.42 5.33 5.33 0 00.8.32l.87.29a11.54 11.54 0 011.4.6 4.32 4.32 0 011.08.75 2.93 2.93 0 01.69 1 4.08 4.08 0 01-.24 3.3 3.91 3.91 0 01-1.3 1.29 5.93 5.93 0 01-1.86.73 10.42 10.42 0 01-2.19.23 11.49 11.49 0 01-3.84-.67zm17.95.67a6.78 6.78 0 01-5-1.77 6.43 6.43 0 01-1.81-4.8 6.4 6.4 0 011.88-4.9 7.08 7.08 0 015.06-1.77 6.73 6.73 0 014.94 1.77 6.26 6.26 0 011.78 4.67 6.66 6.66 0 01-1.84 5 6.85 6.85 0 01-5.01 1.8zm.1-10.26a2.59 2.59 0 00-2.14.95 4.18 4.18 0 00-.77 2.69q0 3.63 2.93 3.63t2.8-3.73q0-3.57-2.82-3.57zM196.78 49a4.06 4.06 0 00-1.44-.29c-1.25 0-1.87.67-1.87 2V52h2.88v2.88h-2.88v9.75h-3.89v-9.72h-2.12V52h2.12v-1.53A4.54 4.54 0 01191 47a5.36 5.36 0 013.82-1.32 6.8 6.8 0 012 .25zm9.56 15.51a5.84 5.84 0 01-2.6.46q-4.12 0-4.12-4.28v-5.78h-2.05V52h2.05v-2.69l3.88-1.11V52h2.84v2.88h-2.84V60c0 1.32.52 2 1.57 2a2.74 2.74 0 001.27-.35zm-79.19 142.03l4.71 14.49h15.24l-12.33 8.95 4.71 14.49-12.33-8.95-12.33 8.95 4.71-14.49-12.33-8.95h15.24zm45.7 0l4.71 14.49h15.24l-12.33 8.95 4.71 14.49-12.33-8.95-12.33 8.95 4.71-14.49-12.33-8.95h15.24z" fill="#fff"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-[11px] md:text-xs text-[#0078d4] dark:text-[#4a9eff] font-semibold tracking-[0.12em] uppercase">Microsoft Certified</span>
                      <h3 className="text-base md:text-lg font-bold text-[#1a1a2a] dark:text-[#e0e0e8] leading-snug mt-2">{title}</h3>
                      <div className="flex items-center justify-center gap-3 mt-2.5">
                        {certId && (
                          <span className="text-[11px] md:text-xs text-[#6a7a8a] dark:text-[#7a8a9a] font-mono">{certId}</span>
                        )}
                        <span className="text-[10px] md:text-[11px] text-[#0078d4]/60 dark:text-[#4a9eff]/60 font-medium">Associate</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 mt-2.5">
                        <svg viewBox="0 0 16 16" className="w-3 h-3 fill-[#00a84e]">
                          <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.71 0L7 9.29 5.35 7.65a.5.5 0 10-.7.7l2 2c.2.2.5.2.7 0l4-4a.5.5 0 000-.7z"/>
                        </svg>
                        <span className="text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">Verified Credential</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            )
          })}
        </ScrollStack>

        <div className="mt-12 md:mt-16">
          <h2 className="section-heading text-center mb-8 md:mb-10">
            <span className="gradient-text">Publications</span>
          </h2>
          <div className="mt-6">
            {publications.map((pub, idx) => (
              <div key={idx} className="bg-white dark:bg-[#121212] rounded-lg overflow-hidden border border-[#d0d0d0] dark:border-[#2a2a2a]">
                {/* IEEE header bar */}
                <div className="bg-[#006699] dark:bg-[#004466] px-4 md:px-6 py-2.5">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 36 16" className="h-4 fill-white shrink-0">
                      <path d="M0 0v16h36V0H0zm34 2v12H2V2h32z"/>
                      <path d="M6 5h5v1H6zM6 7h8v1H6zM6 9h6v1H6zM6 11h7v1H6zM17 5h13v1H17zM17 7h13v1H17zM17 9h13v1H17zM17 11h13v1H17z"/>
                    </svg>
                    <span className="text-[10px] md:text-[11px] text-white/90 font-medium tracking-wide truncate">{pub.conference}</span>
                  </div>
                </div>
                <div className="px-4 md:px-6 py-4 md:py-5">
                  {/* Title with link */}
                  <a href={pub.url} target="_blank" rel="noopener noreferrer" className="group">
                    <h3 className="text-base md:text-lg font-bold text-[#1a1a2a] dark:text-[#e0e0e8] leading-snug group-hover:text-[#006699] dark:group-hover:text-[#4a9eff] transition-colors">{pub.title}</h3>
                  </a>
                  {/* Authors */}
                  <div className="flex flex-wrap gap-x-1 mt-2 text-[13px] md:text-sm text-[#006699] dark:text-[#4a9eff]">
                    {pub.authors.map((author, ai) => (
                      <span key={ai}>
                        {ai > 0 && <span className="text-[#6a7a8a] mr-0.5">, </span>}
                        <span>{author.name}<sup className="text-[10px]">{author.affil}</sup></span>
                      </span>
                    ))}
                  </div>
                  {/* Affiliations */}
                  <div className="mt-1.5 text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a] leading-relaxed">
                    {pub.affiliations.map((aff, ai) => (
                      <div key={ai}>
                        <sup className="text-[9px]">{ai + 1}</sup> {aff}
                      </div>
                    ))}
                  </div>
                  {/* Abstract */}
                  <div className="mt-3">
                    <span className="text-[10px] md:text-[11px] font-semibold text-[#1a1a2a] dark:text-[#c0c0d0] uppercase tracking-wider">Abstract</span>
                    <p className="text-xs md:text-sm text-[#4a4a5a] dark:text-[#9a9aaa] leading-relaxed mt-1">{pub.abstract}</p>
                  </div>
                  {/* Keywords */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    <span className="text-[10px] font-semibold text-[#1a1a2a] dark:text-[#c0c0d0] uppercase tracking-wider">Keywords:</span>
                    {pub.keywords.map((kw, ki) => (
                      <span key={ki} className="text-[10px] md:text-[11px] text-[#006699] dark:text-[#4a9eff] bg-[#e8f0f8] dark:bg-[#0a1a2a] px-2 py-0.5 rounded">{kw}</span>
                    ))}
                  </div>
                  {/* Metadata row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-3 border-t border-[#e0e0e0] dark:border-[#2a2a2a] text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">
                    <span>Date: {pub.date}</span>
                    <span>Location: {pub.location}</span>
                    <span>{pub.pages}</span>
                  </div>
                  {/* DOI + Actions */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                    <span className="text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">
                      DOI: <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-[#006699] dark:text-[#4a9eff] hover:underline">{pub.doi}</a>
                    </span>
                    <a href={pub.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] md:text-[11px] text-white bg-[#006699] dark:bg-[#004466] px-3 py-1.5 rounded font-medium hover:bg-[#005580] transition-colors">
                      <svg viewBox="0 0 16 16" className="w-3 h-3 fill-current">
                        <rect x="1" y="1" width="6" height="14" rx="1"/>
                        <rect x="9" y="4" width="6" height="11" rx="1"/>
                        <rect x="1" y="1" width="14" height="2" rx="1"/>
                      </svg>
                      PDF
                    </a>
                    <a href={pub.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] md:text-[11px] text-[#006699] dark:text-[#4a9eff] border border-[#006699] dark:border-[#4a9eff] px-3 py-1.5 rounded font-medium hover:bg-[#006699]/5 transition-colors">
                      <svg viewBox="0 0 16 16" className="w-3 h-3 fill-current">
                        <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.71 0L7 9.29 5.35 7.65a.5.5 0 10-.7.7l2 2c.2.2.5.2.7 0l4-4a.5.5 0 000-.7z"/>
                      </svg>
                      IEEE Xplore
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
