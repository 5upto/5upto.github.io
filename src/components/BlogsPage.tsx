import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FlexCarousel, { type FlexCarouselItem } from './reactbits/FlexCarousel'
import { useBlogs } from '../hooks/useBlogs'
import type { Blog, ContentBlock } from '../types/database'

gsap.registerPlugin(ScrollTrigger)

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function estimateReadTime(content: ContentBlock[]): string {
  let words = 0
  for (const block of content) {
    if (block.type === 'paragraph') words += block.text.split(/\s+/).length
    else if (block.type === 'code') words += block.code.split(/\s+/).length
    else if (block.type === 'image') words += 10
  }
  const mins = Math.max(1, Math.ceil(words / 200))
  return `${mins} min read`
}

export { slugify, estimateReadTime }
export type { Blog, ContentBlock }

const GRADIENTS: [string, string][] = [
  ['#6366f1', '#0ea5e9'],
  ['#f43f5e', '#f59e0b'],
  ['#10b981', '#0ea5e9'],
  ['#8b5cf6', '#ec4899'],
  ['#0ea5e9', '#22d3ee'],
  ['#f59e0b', '#ef4444'],
]

const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
    }
    return entities[char]
  })

/** A generated cover so image-less posts still get a proper carousel card. */
function gradientCover(title: string, index: number): string {
  const [from, to] = GRADIENTS[index % GRADIENTS.length]
  const words = title.split(/\s+/)
  const lines: string[] = []
  for (const word of words) {
    const current = lines[lines.length - 1]
    if (!current || current.length + word.length + 1 > 20) lines.push(word)
    else lines[lines.length - 1] = `${current} ${word}`
  }
  const text = lines
    .slice(0, 3)
    .map(
      (line, lineIndex) =>
        `<text x="80" y="${430 + lineIndex * 84}" font-family="Inter, system-ui, sans-serif" font-size="68" font-weight="700" fill="#ffffff">${escapeXml(line)}</text>`
    )
    .join('')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
    `<rect width="1200" height="800" fill="url(#g)"/>` +
    `<circle cx="1030" cy="130" r="310" fill="rgba(255,255,255,0.12)"/>` +
    `<circle cx="110" cy="720" r="260" fill="rgba(0,0,0,0.14)"/>` +
    text +
    `</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export default function BlogsPage() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { data: blogs } = useBlogs()

  const items = useMemo<FlexCarouselItem[]>(
    () =>
      (blogs ?? []).map((blog, index) => ({
        src: blog.image || gradientCover(blog.title, index),
        alt: blog.title,
        title: blog.title,
        subtitle: `${blog.date} · ${estimateReadTime(blog.content)}`,
      })),
    [blogs]
  )

  const openBlog = useCallback(
    (index: number) => {
      const blog = blogs?.[index]
      if (blog) navigate(`/blog/${blog.slug}`)
    },
    [blogs, navigate]
  )

  useEffect(() => {
    // The section is not rendered until blogs resolve, so wait for the refs.
    if (!blogs || !sectionRef.current || !headingRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [blogs])

  if (!blogs) return null

  return (
    <section ref={sectionRef} id="blog" className="min-h-screen py-24 px-4 relative">
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 z-20">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>
      <h2 ref={headingRef} className="section-heading text-center mb-4">
        <span className="gradient-text">Blog</span>
      </h2>
      <p className="text-center text-[var(--text-muted)] mb-2 max-w-md mx-auto text-sm">Notes on what I build, learn and break along the way.</p>
      <p className="text-center text-[var(--text-muted)] mb-8 max-w-md mx-auto text-xs">
        Drag or scroll the carousel. Click the front story to open it.
      </p>

      {items.length === 0 ? (
        <div className="max-w-5xl mx-auto grid place-items-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] py-20">
          <p className="text-sm text-[var(--text-muted)]">No posts yet.</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto h-[400px] sm:h-[480px] md:h-[540px]">
          <FlexCarousel
            items={items}
            cardHeight={0.52}
            gap={14}
            radius={18}
            fit="natural"
            captions
            focusOnClick={false}
            captureWheel={false}
            onSelect={(index) => openBlog(index)}
          />
        </div>
      )}
    </section>
  )
}
