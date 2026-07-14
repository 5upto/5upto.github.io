import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import CircularGallery from './CircularGallery'

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const galleryImages = [
  { image: 'https://picsum.photos/seed/mountain/800/600', text: 'Mountain Escape' },
  { image: 'https://picsum.photos/seed/urban/800/600', text: 'Urban Nights' },
  { image: 'https://picsum.photos/seed/ocean/800/600', text: 'Ocean Breeze' },
  { image: 'https://picsum.photos/seed/forest/800/600', text: 'Forest Trail' },
  { image: 'https://picsum.photos/seed/desert/800/600', text: 'Desert Dunes' },
]

export default function CircularGalleryPage() {
  const navigate = useNavigate()
  const headingRef = useRef<HTMLHeadingElement>(null)

  const handleClick = useCallback((index: number) => {
    const item = galleryImages[index % galleryImages.length]
    navigate(`/gallery/${slugify(item.text)}`)
  }, [navigate])

  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
    }
  }, [])

  return (
    <section className="min-h-screen py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-10 group"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <h2 ref={headingRef} className="section-heading text-center mb-4">
        <span className="gradient-text">Gallery</span>
      </h2>
      <p className="text-center text-[var(--text-muted)] mb-6 max-w-md mx-auto text-sm">
        Click any image to view its story.
      </p>

      <div className="max-w-5xl mx-auto h-[400px] md:h-[500px]">
        <CircularGallery
          items={galleryImages}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          font="bold 24px Inter, system-ui, sans-serif"
          scrollSpeed={2}
          scrollEase={0.05}
          onItemClick={handleClick}
        />
      </div>
    </section>
  )
}
