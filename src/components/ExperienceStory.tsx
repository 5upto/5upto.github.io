import { useParams, useNavigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { useExperiences } from '../hooks/useExperiences'
import { logoPanelStyle } from '../lib/logoPanel'

export default function ExperienceStory() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [imgColors, setImgColors] = useState<Record<string, string>>({})
  const { data: experiences } = useExperiences()

  const handleImageLoad = useCallback((company: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const panel = logoPanelStyle(e.currentTarget)
    if (panel) setImgColors(prev => ({ ...prev, [company]: panel }))
  }, [])

  const experience = experiences?.find((exp) => exp.slug === slug)

  if (!experiences) return null

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
                crossOrigin="anonymous"
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
