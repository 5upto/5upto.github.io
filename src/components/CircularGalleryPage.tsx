import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import CircularGallery from './CircularGallery'
import { galleryCover, useGallery } from '../hooks/useGallery'
import { useIsDarkTheme } from '../hooks/useIsDarkTheme'

export default function CircularGalleryPage() {
  const navigate = useNavigate()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { data: stories } = useGallery()
  const isDark = useIsDarkTheme()

  const galleryItems = useMemo(() => (stories ?? []).map((story) => ({
    image: galleryCover(story),
    text: story.title,
    description: story.period ? `${story.period} · Click to read the story` : 'Click to read the story',
  })), [stories])

  const handleClick = useCallback((_item: { image: string; text?: string }, index: number) => {
    const story = stories?.[index]
    if (story) navigate(`/gallery/${story.slug}`)
  }, [navigate, stories])

  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
    }
  }, [])

  if (!stories) return null

  return (
    <section className="min-h-screen py-24 px-4 relative">
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 z-20">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>
      <h2 ref={headingRef} className="section-heading text-center mb-4">
        <span className="gradient-text">Gallery</span>
      </h2>
      <p className="text-center text-[var(--text-muted)] mb-6 max-w-md mx-auto text-sm">Drag, scroll or use the arrow keys. Click any image to view its story.</p>

      {stories.length === 0 ? (
        <div className="max-w-5xl mx-auto h-[400px] md:h-[500px] grid place-items-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
          <p className="text-sm text-[var(--text-muted)]">No gallery stories yet.</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto h-[400px] md:h-[500px]">
          <CircularGallery
            items={galleryItems}
            bend={3}
            textColor={isDark ? '#ffffff' : '#0f172a'}
            borderRadius={0.06}
            font="bold 22px Inter, system-ui, sans-serif"
            scrollSpeed={2}
            scrollEase={0.05}
            itemSize={1.05}
            itemAspect={0.78}
            gap={0.28}
            shadow={0.3}
            fadeEdges={0.14}
            snap
            openOnClick={false}
            onItemClick={handleClick}
          />
        </div>
      )}
    </section>
  )
}
