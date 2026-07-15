import { useParams, useNavigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { useExperiences } from '../hooks/useExperiences'
import LoadingSpinner from './LoadingSpinner'

function getDominantColor(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return 'var(--bg-elevated)'
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  ctx.drawImage(img, 0, 0)
  const corners = [
    [0, 0], [canvas.width - 1, 0], [0, canvas.height - 1],
    [canvas.width - 1, canvas.height - 1], [Math.floor(canvas.width / 2), 0],
    [0, Math.floor(canvas.height / 2)], [canvas.width - 1, Math.floor(canvas.height / 2)],
    [Math.floor(canvas.width / 2), canvas.height - 1],
  ]
  const colorCounts = new Map<string, number>()
  for (const [x, y] of corners) {
    const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data
    if (a < 128) continue
    const qr = Math.round(r / 8) * 8
    const qg = Math.round(g / 8) * 8
    const qb = Math.round(b / 8) * 8
    const key = `${qr},${qg},${qb}`
    colorCounts.set(key, (colorCounts.get(key) || 0) + 1)
  }
  let maxCount = 0
  let dominant = '128,128,128'
  for (const [color, count] of colorCounts) {
    if (count > maxCount) { maxCount = count; dominant = color }
  }
  const [r, g, b] = dominant.split(',').map(Number)
  return `rgb(${r}, ${g}, ${b})`
}

export default function ExperienceStory() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [imgColors, setImgColors] = useState<Record<string, string>>({})
  const { data: experiences, isLoading } = useExperiences()

  const handleImageLoad = useCallback((company: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const color = getDominantColor(e.currentTarget)
    setImgColors(prev => ({ ...prev, [company]: color }))
  }, [])

  if (isLoading) return <LoadingSpinner />
  const experience = experiences?.find((exp) => exp.slug === slug)

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Experience Not Found</h1>
          <button onClick={() => navigate('/')} className="px-6 py-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity">Back to Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative z-10 bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-10 group">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
        <header className="mb-12">
          <div className="mb-6">
            {experience.logo && (
              <img src={experience.logo} alt={experience.company}
                className="w-full h-48 md:h-64 object-contain rounded-2xl p-6 transition-colors duration-500"
                style={{ backgroundColor: imgColors[experience.company] || 'var(--bg-elevated)' }}
                onLoad={(e) => handleImageLoad(experience.company, e)}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)] mb-2">{experience.role}</h1>
          <p className="text-accent-400 text-lg font-medium mb-4">{experience.company}</p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-primary-400 font-mono">{experience.period}</span>
            <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)] px-3 py-1 rounded-full">{experience.location}</span>
          </div>
        </header>
        <article className="mb-12">
          {experience.story.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-[var(--text-secondary)] text-base leading-relaxed mb-6">{paragraph}</p>
          ))}
        </article>
        <footer>
          <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Key Contributions</h3>
          <div className="flex flex-wrap gap-2">
            {experience.points.map((point, idx) => (
              <span key={idx} className="text-xs px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]">{point}</span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}
