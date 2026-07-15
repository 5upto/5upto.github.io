import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useGallery } from '../hooks/useGallery'
import LoadingSpinner from './LoadingSpinner'

export default function GalleryStory() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: stories, isLoading } = useGallery()

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (isLoading) return <LoadingSpinner />
  const story = stories?.find((s) => s.slug === slug)

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-4">Story Not Found</h1>
          <button onClick={() => navigate('/gallery')} className="text-primary-400 hover:text-primary-300 transition-colors">Back to Gallery</button>
        </div>
      </div>
    )
  }

  const paragraphs = story.story.split('\n\n')

  return (
    <div className="min-h-screen relative z-10 bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/gallery')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-10 group">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
        <header className="mb-12">
          <div className="mb-6">
            <img src={story.image} alt={story.title} className="w-full h-48 md:h-64 object-cover rounded-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)] mb-2">{story.title}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-primary-400 font-mono">{story.period}</span>
          </div>
        </header>
        <article className="mb-12">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="text-[var(--text-secondary)] text-base leading-relaxed mb-6">{paragraph}</p>
          ))}
        </article>
        <footer>
          <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {story.tags.map((t) => (
              <span key={t} className="text-xs px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]">{t}</span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}
