import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollStack, { ScrollStackItem } from './ScrollStack'
import Folder from './reactbits/Folder'
import CardSwap, { Card } from './reactbits/CardSwap'
import { useEducation } from '../hooks/useEducation'
import { FaAws } from 'react-icons/fa'
import { SiIeee, SiElsevier, SiAcm, SiArxiv, SiGooglecloud, SiCisco, SiComptia, SiLinuxfoundation, SiHashicorp } from 'react-icons/si'
import { GrOracle } from 'react-icons/gr'
import { publisherIcons } from './PublisherIcons'

gsap.registerPlugin(ScrollTrigger)

function useIsDark() {
  const [isDark, setIsDark] = useState(() =>
    typeof document === 'undefined' ? false : document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

// Publisher detection from conference name
const publishers = [
  { name: 'IEEE', color: '#006699', icon: publisherIcons.IEEE },
  { name: 'Springer', color: '#C41230', icon: publisherIcons.Springer },
  { name: 'Elsevier', color: '#FF6C00', icon: publisherIcons.Elsevier },
  { name: 'ACM', color: '#007398', icon: publisherIcons.ACM },
  { name: 'Wiley', color: '#003B5C', icon: publisherIcons.Wiley },
  { name: 'MDPI', color: '#89B842', icon: publisherIcons.MDPI },
  { name: 'Preprint', color: '#8B5CF6', icon: publisherIcons.Preprint },
  { name: 'Other', color: '#6B7280', icon: publisherIcons.Other },
]

function getPublisher(pub: { publisher?: string; conference?: string }) {
  if (pub.publisher) {
    const match = publishers.find(p => p.name === pub.publisher)
    if (match) return match
  }
  const lower = (pub.conference || '').toLowerCase()
  for (const p of publishers) {
    if (lower.includes(p.name.toLowerCase())) return p
  }
  return publishers[publishers.length - 1] // default to Other
}

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { data } = useEducation()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const isDark = useIsDark()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (!data) return null

  const { education, certifications, publications } = data

  const renderEducationDocument = (edu: typeof education[0]) => {
    const unit = (value: number) => `calc(${value}px * var(--folder-scale))`
    const isNIT = edu.style === 'nit'
    const isInternational = edu.style === 'international'
    const accent = isNIT ? '#1a237e' : isInternational ? '#a8872f' : '#006633'
    const rule = isNIT ? 'rgba(26, 35, 126, 0.3)' : isInternational ? 'rgba(201, 168, 76, 0.4)' : '#c8b88a'
    const outerFrame = isNIT ? 'rgba(26, 35, 126, 0.4)' : isInternational ? 'rgba(201, 168, 76, 0.32)' : 'rgba(200, 184, 138, 0.95)'
    const innerFrame = isNIT ? 'rgba(26, 35, 126, 0.2)' : isInternational ? 'rgba(201, 168, 76, 0.22)' : 'rgba(200, 184, 138, 0.6)'

    const logo = (
      <div
        className="flex flex-none items-center justify-center rounded-full"
        style={{
          width: unit(isInternational ? 30 : 36),
          height: unit(isInternational ? 30 : 36),
          background: 'transparent',
          overflow: 'hidden',
        }}
      >
        {edu.logo ? (
          <img
            src={edu.logo}
            alt={edu.institution}
            draggable={false}
            className="h-full w-full object-contain"
            style={{ transform: 'scale(1.08)', opacity: isInternational ? 0.8 : 1 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <span
            className="font-certificate"
            style={{ color: accent, fontSize: unit(10), opacity: 0.5 }}
          >
            {edu.institution?.charAt(0) || 'E'}
          </span>
        )}
      </div>
    )

    const ruleLine = (
      <div
        className="flex-none"
        style={{ width: unit(12), height: unit(0.7), margin: `${unit(4)} auto`, background: rule }}
      />
    )

    const footer = (
      <div className="flex w-full items-end justify-between leading-tight">
        <span
          className="font-certificate text-left leading-tight"
          style={{ color: isInternational ? '#8a7a5a' : isNIT ? '#8a9aaa' : '#a09080', fontSize: unit(3.8), maxWidth: '42%' }}
        >
          {edu.signatory}
        </span>
        <span
          className="font-semibold leading-tight"
          style={{ color: isInternational ? '#1a1a2e' : isNIT ? '#1a237e' : '#006633', fontSize: unit(4.8), letterSpacing: '0.12em' }}
        >
          {edu.year}
        </span>
        <span className="flex text-right" style={{ width: '24%', justifyContent: 'flex-end' }}>
          <svg viewBox="0 0 16 16" style={{ width: unit(4), height: unit(4), fill: isInternational ? 'rgba(201, 168, 76, 0.45)' : isNIT ? 'rgba(26, 35, 126, 0.35)' : 'rgba(0, 102, 51, 0.35)' }}>
            <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.71 0L7 9.29 5.35 7.65a.5.5 0 10-.7.7l2 2c.2.2.5.2.7 0l4-4a.5.5 0 000-.7z" />
          </svg>
        </span>
      </div>
    )

    if (isInternational) {
      return (
        <div className="h-full w-full overflow-hidden" style={{ background: '#ffffff', padding: unit(4) }}>
          <div className="flex h-full flex-col" style={{ border: `${unit(1.3)} solid ${outerFrame}`, padding: unit(1) }}>
            <div
              className="flex h-full flex-col items-center justify-between text-center"
              style={{ border: `${unit(0.6)} solid ${innerFrame}`, padding: `${unit(3.5)} ${unit(3)}` }}
            >
              <div className="flex w-full flex-col items-center">
                {edu.logo && <div style={{ marginBottom: unit(2) }}>{logo}</div>}
                {edu.country_name && (
                  <p className="uppercase leading-tight" style={{ color: '#8a7a5a', fontSize: unit(3.7), letterSpacing: '0.2em' }}>
                    {edu.country_name}
                  </p>
                )}
                {edu.board_name && (
                  <p className="uppercase leading-tight" style={{ color: '#1a1a2e', fontSize: unit(4.2), letterSpacing: '0.1em', marginTop: unit(1) }}>
                    {edu.board_name}
                  </p>
                )}
                {edu.institution && (
                  <p className="font-certificate leading-tight" style={{ color: '#1a1a2e', fontSize: unit(5.6), marginTop: unit(3) }}>
                    {edu.institution}
                  </p>
                )}
              </div>

              <div className="flex w-full flex-col items-center">
                {ruleLine}
                {edu.certificate_label && (
                  <p className="uppercase leading-tight" style={{ color: '#8a7a5a', fontSize: unit(3.7), letterSpacing: '0.18em' }}>
                    {edu.certificate_label}
                  </p>
                )}
                <h3 className="font-certificate leading-tight" style={{ color: '#1a1a2e', fontSize: unit(8.2), marginTop: unit(1.5), letterSpacing: '0.02em' }}>
                  {edu.degree}
                </h3>
                {edu.subject && (
                  <p className="italic leading-tight" style={{ color: '#5a5a5a', fontSize: unit(4.6), marginTop: unit(1.5) }}>
                    in {edu.subject}
                  </p>
                )}
              </div>

              <div className="flex w-full flex-col items-center">
                {ruleLine}
                {footer}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="h-full w-full overflow-hidden" style={{ background: '#ffffff', padding: unit(4) }}>
        <div className="flex h-full flex-col" style={{ border: `${unit(1.3)} solid ${outerFrame}`, padding: unit(1) }}>
          <div
            className="flex h-full flex-col items-center justify-between text-center"
            style={{ border: `${unit(0.6)} solid ${innerFrame}`, padding: `${unit(3.5)} ${unit(3)}` }}
          >
            <div className="flex w-full flex-col items-center">
              {logo}
              {edu.country_name && (
                <p
                  className="uppercase leading-tight"
                  style={{
                    color: isNIT ? '#5a6a8a' : '#8a7a6a',
                    fontSize: unit(3.8),
                    letterSpacing: '0.15em',
                    marginTop: unit(2),
                  }}
                >
                  {edu.country_name}
                </p>
              )}
              {isNIT ? (
                edu.institution && (
                  <p
                    className="font-certificate font-bold leading-tight"
                    style={{ color: '#1a237e', fontSize: unit(5.2), marginTop: unit(1), letterSpacing: '0.04em' }}
                  >
                    {edu.institution}
                  </p>
                )
              ) : (
                edu.board_name && (
                  <p
                    className="font-bold uppercase leading-tight"
                    style={{ color: '#006633', fontSize: unit(4.4), marginTop: unit(1), letterSpacing: '0.06em' }}
                  >
                    {edu.board_name}
                  </p>
                )
              )}
            </div>

            <div className="flex w-full flex-col items-center">
              {ruleLine}
              {edu.certificate_label && (
                <p
                  className="uppercase leading-tight"
                  style={{
                    color: isNIT ? '#8a9aaa' : '#a09080',
                    fontSize: unit(3.7),
                    letterSpacing: '0.12em',
                  }}
                >
                  {edu.certificate_label}
                </p>
              )}
              <h3
                className={isNIT ? 'font-certificate font-bold leading-tight' : 'font-bold leading-tight'}
                style={{
                  color: isNIT ? '#1a1a2a' : '#1a1a1a',
                  fontSize: unit(isNIT ? 8 : 7.4),
                  marginTop: unit(1.5),
                }}
              >
                {edu.degree}
              </h3>
              {edu.subject && (
                <p
                  className="leading-tight"
                  style={{
                    color: isNIT ? '#5a6a7a' : '#6a5a4a',
                    fontSize: unit(4.4),
                    marginTop: unit(1.5),
                  }}
                >
                  {isNIT ? `in ${edu.subject}` : edu.subject}
                </p>
              )}
              {!isNIT && edu.institution && (
                <p className="italic leading-tight" style={{ color: '#4a4a4a', fontSize: unit(4.2), marginTop: unit(2) }}>
                  {edu.institution}
                </p>
              )}
            </div>

            <div className="flex w-full flex-col items-center">
              {footer}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section ref={sectionRef} id="education" className="py-16 md:py-20 pb-8 md:pb-10 px-4 relative">
      <h2 ref={headingRef} className="section-heading text-center mb-8 md:mb-10">
          <span className="gradient-text">Education</span>
        </h2>
      <div className="max-w-4xl mx-auto">
        <div className="flex min-h-[360px] items-center justify-center md:min-h-[470px]">
          <Folder
            key={`education-folder-${education.length}`}
            mode="book"
            variant="solid"
            color={isDark ? '#4f5fd4' : '#1a237e'}
            paperColor="#ffffff"
            ariaLabel="Education records"
            tabPosition="right"
            layout={isDesktop ? 'spread' : 'stack'}
            size={isDesktop ? 1.8 : 1.45}
            openOn="click"
            draggable
            zoomOnClick
            theme={isDark ? 'dark' : 'light'}
            className="max-w-full"
          >
            {education.slice(0, 6).map((edu) => (
              <div key={edu.id} className="h-full w-full">
                {renderEducationDocument(edu)}
              </div>
            ))}
          </Folder>
        </div>
        <p className="mt-5 text-center text-xs text-[#6a7a8a] dark:text-[#7a8a9a]">
          Click the folder to open it, then click any record to enlarge.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-16 md:mt-20">
        <h2 className="section-heading text-center mb-8 md:mb-10">
          <span className="gradient-text">Certifications</span>
        </h2>
        <div className="relative mx-auto h-[400px] w-full max-w-3xl sm:h-[470px]">
          <CardSwap
            key={`certifications-${certifications.length}`}
            width={isDesktop ? 430 : 320}
            height={isDesktop ? 330 : 280}
            cardDistance={isDesktop ? 62 : 46}
            verticalDistance={isDesktop ? 66 : 52}
            depth={90}
            skewAmount={6}
            visibleCards={Math.min(4, Math.max(1, certifications.length))}
            delay={4200}
            autoplay={certifications.length > 1}
            pauseOnHover
            draggable
            speed={1}
            cardRadius={18}
            theme={isDark ? 'dark' : 'light'}
          >
          {certifications.map((cert) => {
            const match = cert.name.match(/^(.+?):\s*(.+?)\s*\((.+?)\)$/)
            const title = match ? match[2] : cert.name
            const certId = match ? match[3] : ''

            // Microsoft format
            if (cert.name.startsWith('Microsoft Certified')) {
              return (
                <Card key={cert.id}>
                  <div className="bg-[#f5f5f5] dark:bg-[#141414] flex h-full flex-col overflow-hidden rounded-[inherit] border border-[#d4d4d4] dark:border-[#2a2a2a] w-full">
                    <div className="px-6 md:px-8 py-5 md:py-6 flex flex-1 flex-col items-center justify-center text-center gap-4">
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
                          {certId && <span className="text-[11px] md:text-xs text-[#6a7a8a] dark:text-[#7a8a9a] font-mono">{certId}</span>}
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
                </Card>
              )
            }

            // AWS format
            if (cert.name.startsWith('AWS Certified')) {
              return (
                <Card key={cert.id}>
                  <div className="bg-white dark:bg-[#232f3e] flex h-full flex-col overflow-hidden rounded-[inherit] border border-[#d4d4d4] dark:border-[#2a2a2a] w-full">
                    <div className="px-6 md:px-8 py-5 md:py-6 flex flex-1 flex-col items-center justify-center text-center gap-4">
                      <div className="shrink-0 w-[92px] h-[92px] flex items-center justify-center">
                        <FaAws size={64} style={{ color: '#FF9900' }} />
                      </div>
                      <div>
                        <span className="text-[11px] md:text-xs text-[#FF9900] font-semibold tracking-[0.12em] uppercase">AWS Certified</span>
                        <h3 className="text-base md:text-lg font-bold text-[#232f3e] dark:text-white leading-snug mt-2">{title}</h3>
                        {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] dark:text-[#7a8a9a] font-mono mt-2">{certId}</p>}
                        <div className="flex items-center justify-center gap-1.5 mt-2.5">
                          <svg viewBox="0 0 16 16" className="w-3 h-3 fill-[#00a84e]"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.71 0L7 9.29 5.35 7.65a.5.5 0 10-.7.7l2 2c.2.2.5.2.7 0l4-4a.5.5 0 000-.7z"/></svg>
                          <span className="text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">Verified Credential</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            }

            // Google Cloud format
            if (cert.name.startsWith('Google Cloud Certified')) {
              return (
                <Card key={cert.id}>
                  <div className="bg-white dark:bg-[#1a1a2e] flex h-full flex-col overflow-hidden rounded-[inherit] border border-[#d4d4d4] dark:border-[#2a2a2a] w-full">
                    <div className="h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]" />
                    <div className="px-6 md:px-8 py-5 md:py-6 flex flex-1 flex-col items-center justify-center text-center gap-4">
                      <div className="shrink-0 w-[92px] h-[92px] flex items-center justify-center">
                        <SiGooglecloud size={64} style={{ color: '#4285F4' }} />
                      </div>
                      <div>
                        <span className="text-[11px] md:text-xs text-[#4285F4] font-semibold tracking-[0.12em] uppercase">Google Cloud Certified</span>
                        <h3 className="text-base md:text-lg font-bold text-[#1a1a2a] dark:text-white leading-snug mt-2">{title}</h3>
                        {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] dark:text-[#7a8a9a] font-mono mt-2">{certId}</p>}
                        <div className="flex items-center justify-center gap-1.5 mt-2.5">
                          <svg viewBox="0 0 16 16" className="w-3 h-3 fill-[#00a84e]"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.71 0L7 9.29 5.35 7.65a.5.5 0 10-.7.7l2 2c.2.2.5.2.7 0l4-4a.5.5 0 000-.7z"/></svg>
                          <span className="text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">Verified Credential</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            }

            // Cisco format
            if (cert.name.startsWith('Cisco Certified')) {
              return (
                <Card key={cert.id}>
                  <div className="bg-white dark:bg-[#0a1628] flex h-full flex-col overflow-hidden rounded-[inherit] border border-[#d4d4d4] dark:border-[#049fd9]/30 w-full">
                    <div className="px-6 md:px-8 py-5 md:py-6 flex flex-1 flex-col items-center justify-center text-center gap-4">
                      <div className="shrink-0 w-[92px] h-[92px] flex items-center justify-center">
                        <SiCisco size={64} style={{ color: '#049FD9' }} />
                      </div>
                      <div>
                        <span className="text-[11px] md:text-xs text-[#049FD9] font-semibold tracking-[0.12em] uppercase">Cisco Certified</span>
                        <h3 className="text-base md:text-lg font-bold text-[#049FD9] leading-snug mt-2">{title}</h3>
                        {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] dark:text-[#7a8a9a] font-mono mt-2">{certId}</p>}
                        <div className="flex items-center justify-center gap-1.5 mt-2.5">
                          <svg viewBox="0 0 16 16" className="w-3 h-3 fill-[#00a84e]"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.71 0L7 9.29 5.35 7.65a.5.5 0 10-.7.7l2 2c.2.2.5.2.7 0l4-4a.5.5 0 000-.7z"/></svg>
                          <span className="text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">Verified Credential</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            }

            // CompTIA format
            if (cert.name.startsWith('CompTIA')) {
              return (
                <Card key={cert.id}>
                  <div className="bg-white dark:bg-[#1a0a0c] flex h-full flex-col overflow-hidden rounded-[inherit] border border-[#d4d4d4] dark:border-[#e8112d]/30 w-full">
                    <div className="px-6 md:px-8 py-5 md:py-6 flex flex-1 flex-col items-center justify-center text-center gap-4">
                      <div className="shrink-0 w-[92px] h-[92px] flex items-center justify-center">
                        <SiComptia size={64} style={{ color: '#E8112D' }} />
                      </div>
                      <div>
                        <span className="text-[11px] md:text-xs text-[#E8112D] font-semibold tracking-[0.12em] uppercase">CompTIA</span>
                        <h3 className="text-base md:text-lg font-bold text-[#E8112D] leading-snug mt-2">{title}</h3>
                        {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] dark:text-[#7a8a9a] font-mono mt-2">{certId}</p>}
                        <div className="flex items-center justify-center gap-1.5 mt-2.5">
                          <svg viewBox="0 0 16 16" className="w-3 h-3 fill-[#00a84e]"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.71 0L7 9.29 5.35 7.65a.5.5 0 10-.7.7l2 2c.2.2.5.2.7 0l4-4a.5.5 0 000-.7z"/></svg>
                          <span className="text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">Verified Credential</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            }

            // Oracle format
            if (cert.name.startsWith('Oracle Certified')) {
              return (
                <Card key={cert.id}>
                  <div className="bg-white dark:bg-[#1a0e0d] flex h-full flex-col overflow-hidden rounded-[inherit] border border-[#d4d4d4] dark:border-[#c74634]/30 w-full">
                    <div className="px-6 md:px-8 py-5 md:py-6 flex flex-1 flex-col items-center justify-center text-center gap-4">
                      <div className="shrink-0 w-[92px] h-[92px] flex items-center justify-center">
                        <GrOracle size={64} style={{ color: '#C74634' }} />
                      </div>
                      <div>
                        <span className="text-[11px] md:text-xs text-[#C74634] font-semibold tracking-[0.12em] uppercase">Oracle Certified</span>
                        <h3 className="text-base md:text-lg font-bold text-[#C74634] leading-snug mt-2">{title}</h3>
                        {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] dark:text-[#7a8a9a] font-mono mt-2">{certId}</p>}
                        <div className="flex items-center justify-center gap-1.5 mt-2.5">
                          <svg viewBox="0 0 16 16" className="w-3 h-3 fill-[#00a84e]"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.71 0L7 9.29 5.35 7.65a.5.5 0 10-.7.7l2 2c.2.2.5.2.7 0l4-4a.5.5 0 000-.7z"/></svg>
                          <span className="text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">Verified Credential</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            }

            // Linux Foundation format
            if (cert.name.startsWith('Linux Foundation')) {
              return (
                <Card key={cert.id}>
                  <div className="bg-white dark:bg-[#1a1a10] flex h-full flex-col overflow-hidden rounded-[inherit] border border-[#d4d4d4] dark:border-[#fcc624]/30 w-full">
                    <div className="px-6 md:px-8 py-5 md:py-6 flex flex-1 flex-col items-center justify-center text-center gap-4">
                      <div className="shrink-0 w-[92px] h-[92px] flex items-center justify-center">
                        <SiLinuxfoundation size={64} style={{ color: '#FCC624' }} />
                      </div>
                      <div>
                        <span className="text-[11px] md:text-xs text-[#FCC624] font-semibold tracking-[0.12em] uppercase">Linux Foundation</span>
                        <h3 className="text-base md:text-lg font-bold text-[#333] dark:text-white leading-snug mt-2">{title}</h3>
                        {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] dark:text-[#7a8a9a] font-mono mt-2">{certId}</p>}
                        <div className="flex items-center justify-center gap-1.5 mt-2.5">
                          <svg viewBox="0 0 16 16" className="w-3 h-3 fill-[#00a84e]"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.71 0L7 9.29 5.35 7.65a.5.5 0 10-.7.7l2 2c.2.2.5.2.7 0l4-4a.5.5 0 000-.7z"/></svg>
                          <span className="text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">Verified Credential</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            }

            // HashiCorp format
            if (cert.name.startsWith('HashiCorp')) {
              return (
                <Card key={cert.id}>
                  <div className="bg-white dark:bg-[#1a0f0d] flex h-full flex-col overflow-hidden rounded-[inherit] border border-[#d4d4d4] dark:border-[#e04e39]/30 w-full">
                    <div className="px-6 md:px-8 py-5 md:py-6 flex flex-1 flex-col items-center justify-center text-center gap-4">
                      <div className="shrink-0 w-[92px] h-[92px] flex items-center justify-center">
                        <SiHashicorp size={64} style={{ color: '#e04e39' }} />
                      </div>
                      <div>
                        <span className="text-[11px] md:text-xs text-[#e04e39] font-semibold tracking-[0.12em] uppercase">HashiCorp</span>
                        <h3 className="text-base md:text-lg font-bold text-[#e04e39] leading-snug mt-2">{title}</h3>
                        {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] dark:text-[#7a8a9a] font-mono mt-2">{certId}</p>}
                        <div className="flex items-center justify-center gap-1.5 mt-2.5">
                          <svg viewBox="0 0 16 16" className="w-3 h-3 fill-[#00a84e]"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.71 0L7 9.29 5.35 7.65a.5.5 0 10-.7.7l2 2c.2.2.5.2.7 0l4-4a.5.5 0 000-.7z"/></svg>
                          <span className="text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">Verified Credential</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            }

            // Default format
            return (
              <Card key={cert.id}>
                <div className="bg-white dark:bg-[#1a1a2e] flex h-full flex-col overflow-hidden rounded-[inherit] border border-[#d4d4d4] dark:border-[#2a2a2a] w-full">
                  <div className="h-1.5 bg-gradient-to-r from-primary-500 to-accent-500" />
                  <div className="px-6 md:px-8 py-6 md:py-7 flex flex-1 flex-col justify-center">
                    <h3 className="text-base md:text-lg font-bold text-[#1a1a2a] dark:text-[#e0e0e8] leading-snug">{cert.name}</h3>
                    <div className="flex items-center justify-center gap-1.5 mt-2.5">
                      <svg viewBox="0 0 16 16" className="w-3 h-3 fill-[#00a84e]"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.71 0L7 9.29 5.35 7.65a.5.5 0 10-.7.7l2 2c.2.2.5.2.7 0l4-4a.5.5 0 000-.7z"/></svg>
                      <span className="text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">Verified Credential</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
          </CardSwap>
        </div>
        <p className="mt-4 text-center text-xs text-[#6a7a8a] dark:text-[#7a8a9a]">
          Drag a card or let the stack cycle through each credential.
        </p>

        <div className="mt-16 md:mt-20">
          <h2 className="section-heading text-center mb-8 md:mb-10">
            <span className="gradient-text">Publications</span>
          </h2>
          <ScrollStack useWindowScroll={true} itemDistance={60} itemScale={0.03} itemStackDistance={25} stackPosition="15%" baseScale={0.88}>
            {publications.map((publication) => { const pub = getPublisher(publication); const PubIcon = pub.icon; return (
            <ScrollStackItem key={publication.id} itemClassName="!h-auto !p-0 !rounded-2xl bg-white dark:bg-[#121212] border border-[#d0d0d0] dark:border-[#2a2a2a] overflow-hidden">
              <div className="h-1.5" style={{ background: pub.color }} />
              <div className="px-6 md:px-8 py-6 md:py-7">
                <div className="flex items-center gap-2 mb-3">
                  <PubIcon size={16} style={{ color: pub.color }} className="shrink-0" />
                  <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider" style={{ color: pub.color }}>{publication.conference}</span>
                </div>
                <a href={publication.url} target="_blank" rel="noopener noreferrer" className="group">
                  <h3 className="text-base md:text-lg font-bold text-[#1a1a2a] dark:text-[#e0e0e8] leading-snug group-hover:text-[#006699] dark:group-hover:text-[#4a9eff] transition-colors">{publication.title}</h3>
                </a>
                <div className="flex flex-wrap gap-x-1 mt-2 text-[13px] md:text-sm text-[#006699] dark:text-[#4a9eff]">
                  {publication.authors.map((author, ai) => (
                    <span key={ai}>
                      {ai > 0 && <span className="text-[#6a7a8a] mr-0.5">, </span>}
                      <span>{author.name}<sup className="text-[10px]">{author.affil}</sup></span>
                    </span>
                  ))}
                </div>
                <div className="mt-1.5 text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a] leading-relaxed">
                  {publication.affiliations.map((aff, ai) => (
                    <div key={ai}><sup className="text-[9px]">{ai + 1}</sup> {aff}</div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  <span className="text-[10px] font-semibold text-[#1a1a2a] dark:text-[#c0c0d0] uppercase tracking-wider">Keywords:</span>
                  {publication.keywords.map((kw, ki) => (
                    <span key={ki} className="text-[10px] md:text-[11px] text-[#006699] dark:text-[#4a9eff] bg-[#e8f0f8] dark:bg-[#0a1a2a] px-2 py-0.5 rounded">{kw}</span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-3 border-t border-[#e0e0e0] dark:border-[#2a2a2a] text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">
                  <span>Date: {publication.date}</span>
                  <span>Location: {publication.location}</span>
                  <span>{publication.pages}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                  <span className="text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">
                    DOI: <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className="text-[#006699] dark:text-[#4a9eff] hover:underline">{publication.doi}</a>
                  </span>
                  <a href={publication.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] md:text-[11px] text-white bg-[#006699] dark:bg-[#004466] px-3 py-1.5 rounded font-medium hover:bg-[#005580] transition-colors">
                    <svg viewBox="0 0 16 16" className="w-3 h-3 fill-current"><rect x="1" y="1" width="6" height="14" rx="1"/><rect x="9" y="4" width="6" height="11" rx="1"/><rect x="1" y="1" width="14" height="2" rx="1"/></svg>
                    PDF
                  </a>
                  <a href={publication.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] md:text-[11px] text-[#006699] dark:text-[#4a9eff] border border-[#006699] dark:border-[#4a9eff] px-3 py-1.5 rounded font-medium hover:bg-[#006699]/5 transition-colors">
                    <svg viewBox="0 0 16 16" className="w-3 h-3 fill-current"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.71 0L7 9.29 5.35 7.65a.5.5 0 10-.7.7l2 2c.2.2.5.2.7 0l4-4a.5.5 0 000-.7z"/></svg>
                    {pub.name === 'IEEE' ? 'IEEE Xplore' : 'View'}
                  </a>
                </div>
              </div>
            </ScrollStackItem>
            )})}
          </ScrollStack>
        </div>
      </div>
    </section>
  )
}
