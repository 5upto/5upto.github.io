import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollStack, { ScrollStackItem } from './ScrollStack'
import { useExperiences } from '../hooks/useExperiences'

gsap.registerPlugin(ScrollTrigger)

const brandColors: Record<string, string> = {
  'Google': '#4285F4',
  'Meta': '#0866FF',
  'Amazon': '#FF9900',
  'Microsoft': '#00A4EF',
  'Apple': '#555555',
  'Netflix': '#E50914',
  'Spotify': '#1DB954',
  'LinkedIn': '#0A66C2',
  'GitHub': '#4078C0',
  'Stripe': '#635BFF',
  'Slack': '#4A154B',
  'Figma': '#F24E1E',
  'Shopify': '#96BF48',
  'Uber': '#09091A',
  'Airbnb': '#FF5A5F',
  'Dropbox': '#0061FF',
  'IBM': '#006699',
  'Intel': '#0071C5',
  'Oracle': '#C74634',
  'Salesforce': '#00A1E0',
  'SAP': '#0FAA5B',
  'Cisco': '#049FD9',
  'Dell': '#007DB8',
  'VMware': '#607078',
  'Red Hat': '#EE0000',
  'MongoDB': '#47A248',
  'Twilio': '#F22F46',
  'Atlassian': '#0052CC',
  'Cloudflare': '#F38020',
  'DigitalOcean': '#0080FF',
  'Netlify': '#00C7B7',
  'HashiCorp': '#000000',
  'Snowflake': '#29B5E8',
  'Datadog': '#632CA6',
  'New Relic': '#008C99',
  'Sentry': '#362D59',
  'Elastic': '#005571',
  'Confluent': '#F15F2C',
  'Adobe': '#FF0000',
  'Unity': '#222222',
  'Epic Games': '#313131',
  'Blender': '#F5792A',
  'Autodesk': '#0696D7',
}

function getBrandColor(company: string): string {
  for (const [key, color] of Object.entries(brandColors)) {
    if (company.toLowerCase().includes(key.toLowerCase())) return color
  }
  const hue = company.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return `hsl(${hue}, 60%, 50%)`
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
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

  const updateLine = useCallback(() => {
    const line = lineRef.current
    if (!line || !experiences) return
    const logos = document.querySelectorAll<HTMLElement>('[data-logo]')
    if (logos.length < 2) return
    const parent = line.parentElement
    if (!parent) return
    const pr = parent.getBoundingClientRect()

    const cards = document.querySelectorAll<HTMLElement>('[data-card]')

    const centers: number[] = []
    logos.forEach(logo => {
      const r = logo.getBoundingClientRect()
      centers.push(r.top + r.height / 2 - pr.top)
    })

    const top = centers[0]
    const lastCardRect = cards[cards.length - 1].getBoundingClientRect()
    const bottom = lastCardRect.bottom - pr.top
    const totalHeight = bottom - top
    line.style.top = `${top}px`
    line.style.height = `${totalHeight}px`

    const stops: string[] = []
    for (let i = 0; i < centers.length; i++) {
      const pctStart = ((centers[i] - top) / totalHeight) * 100
      const pctEnd = i < centers.length - 1 ? ((centers[i + 1] - top) / totalHeight) * 100 : 100
      const color = getBrandColor(experiences[i].company)
      stops.push(`${color} ${pctStart}%`, `${color} ${pctEnd}%`)
    }
    line.style.background = `linear-gradient(to bottom, ${stops.join(', ')})`
  }, [experiences])

  useEffect(() => {
    updateLine()
    const onScroll = () => { cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(updateLine) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateLine)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateLine)
      cancelAnimationFrame(rafRef.current)
    }
  }, [updateLine, experiences])

  if (!experiences?.length) return null

  return (
    <section ref={sectionRef} id="experience" className="relative pb-12 pt-24 px-4">
      <h2 ref={headingRef} className="section-heading text-center mb-12 px-4">
        Experience
      </h2>

      <div className="max-w-4xl mx-auto relative">
        <div
          ref={lineRef}
          className="absolute left-1/2 w-[3px] -translate-x-1/2 z-0 pointer-events-none rounded-full"
        />

        <ScrollStack
          useWindowScroll={true}
          itemDistance={160}
          itemScale={0.03}
          itemStackDistance={30}
          stackPosition="15%"
          baseScale={0.88}
          opacityEnd={1}
        >
          {experiences.map((exp, i) => {
            const isEven = i % 2 === 0
            const brandColor = getBrandColor(exp.company)

            return (
              <ScrollStackItem
                key={exp.id}
                itemClassName="!h-auto !p-0 !rounded-2xl !bg-transparent !border-none !shadow-none !m-0"
              >
                  <div
                    data-card
                    className="relative w-full cursor-pointer pb-4 portrait-mobile:pb-3"
                    onClick={() => navigate(`/experience/${exp.slug}`)}
                  >
                  <div
                    data-logo
                    className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-8 h-8 portrait-mobile:w-7 portrait-mobile:h-7 md:w-11 md:h-11 shadow-[0_0_0_4px_var(--bg-primary)] portrait-mobile:shadow-[0_0_0_3px_var(--bg-primary)]"
                    style={{
                      borderRadius: '50%',
                      background: 'var(--bg-card)',
                      border: `3px solid ${brandColor}`,
                      top: 0,
                    }}
                  >
                    {exp.logo ? (
                      <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain rounded-full p-0.5 md:p-1" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-[10px] md:text-xs font-bold text-primary-500">
                        {exp.company.charAt(0)}
                      </span>
                    )}
                  </div>

                    {isEven ? (
                    <div className="w-[44%] portrait-mobile:w-[42%] mr-auto relative">
                      <div className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 portrait-mobile:p-3 md:p-6 shadow-none">
                        <div className="absolute top-4 portrait-mobile:top-[14px] md:top-[22px] left-full -translate-y-1/2 z-10" style={{ transform: 'rotate(180deg) translateY(50%)' }}>
                          <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] portrait-mobile:border-t-[5px] portrait-mobile:border-b-[5px] portrait-mobile:border-r-[5px] border-r-[var(--bg-card)]" />
                        </div>
                        <span className="text-primary-400 font-mono text-xs portrait-mobile:text-[11px]">{exp.period}</span>
                        <h3 className="text-lg portrait-mobile:text-base md:text-xl font-display font-bold text-[var(--text-primary)] mt-1 break-words">{exp.role}</h3>
                        <p className="text-accent-400 font-medium text-sm portrait-mobile:text-xs mt-1">{exp.company}</p>
                        {exp.location && <p className="text-[var(--text-muted)] text-xs portrait-mobile:text-[11px] mt-0.5">{exp.location}</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="w-[44%] portrait-mobile:w-[42%] ml-auto relative">
                      <div className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 portrait-mobile:p-3 md:p-6 shadow-none">
                        <div className="absolute top-4 portrait-mobile:top-[14px] md:top-[22px] right-full -translate-y-1/2 z-10">
                          <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] portrait-mobile:border-t-[5px] portrait-mobile:border-b-[5px] portrait-mobile:border-r-[5px] border-r-[var(--bg-card)]" />
                        </div>
                        <span className="text-primary-400 font-mono text-xs portrait-mobile:text-[11px]">{exp.period}</span>
                        <h3 className="text-lg portrait-mobile:text-base md:text-xl font-display font-bold text-[var(--text-primary)] mt-1 break-words">{exp.role}</h3>
                        <p className="text-accent-400 font-medium text-sm portrait-mobile:text-xs mt-1">{exp.company}</p>
                        {exp.location && <p className="text-[var(--text-muted)] text-xs portrait-mobile:text-[11px] mt-0.5">{exp.location}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollStackItem>
            )
          })}
        </ScrollStack>
      </div>
    </section>
  )
}
