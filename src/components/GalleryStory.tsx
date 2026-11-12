import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Stack from './reactbits/Stack'
import { galleryPhotos, useGallery } from '../hooks/useGallery'

export default function GalleryStory() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: stories } = useGallery()

  const story = stories?.find((s) => s.slug === slug)
  const photos = useMemo(() => (story ? galleryPhotos(story) : []), [story])

  if (!stories) return null

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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/gallery')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-10 group">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)] mb-2">{story.title}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-primary-400 font-mono">{story.period}</span>
            {photos.length > 1 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)]">
                {photos.length} photos
              </span>
            )}
          </div>

        </header>

        {photos.length > 0 && (
          <section className="mb-12">
            <div className="flex items-end justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">
                  {photos.length > 1 ? 'Story photos' : 'Story photo'}
                </h2>
                {photos.length > 1 && (
                  <p className="text-xs text-[var(--text-muted)] mt-1">Drag, flick or click the top photo to move through the stack.</p>
                )}
              </div>
            </div>
            <div className="mx-auto w-full max-w-[420px] aspect-[4/5]">
              <Stack
                cards={photos.map((photo, index) => (
                  <img
                    key={photo}
                    src={photo}
                    alt={`${story.title} photo ${index + 1}`}
                    draggable={false}
                    loading="lazy"
                  />
                ))}
                layout="fan"
                visible={Math.min(photos.length, 4)}
                spread={0.6}
                depth={0.4}
                radius={18}
                tilt={32}
                threshold={80}
                sendToBackOnClick
                pauseOnHover
              />
            </div>
          </section>
        )}

        <article className="mb-12">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="text-[var(--text-secondary)] text-base leading-relaxed mb-6">{paragraph}</p>
          ))}
        </article>

        {story.tags.length > 0 && (
          <footer>
            <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {story.tags.map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]">{t}</span>
              ))}
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}
