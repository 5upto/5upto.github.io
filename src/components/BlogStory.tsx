import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { blogs, slugify, estimateReadTime } from './BlogsPage'

export default function BlogStory() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (contentRef.current) {
      const blocks = contentRef.current.querySelectorAll('.story-block')
      gsap.fromTo(blocks,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      )
    }
  }, [slug])

  const blog = blogs.find((b) => slugify(b.title) === slug)

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-4">Post Not Found</h1>
          <button onClick={() => navigate('/blog')} className="text-primary-400 hover:text-primary-300 transition-colors">
            Back to Blog
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative z-10 bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-10 group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        <header className="mb-12">
          {blog.image && (
            <div className="mb-6">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 md:h-64 object-cover rounded-2xl"
              />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)] mb-3">
            {blog.title}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-primary-400 font-mono">{blog.date}</span>
            <span className="text-sm text-[var(--text-muted)]">{estimateReadTime(blog.content)}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((t: string) => (
              <span key={t} className="text-xs px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]">
                {t}
              </span>
            ))}
          </div>
        </header>

        <article ref={contentRef} className="mb-12">
          {blog.content.map((block: any, i: number) => {
            if (block.type === 'paragraph') {
              return (
                <p key={i} className="story-block text-[var(--text-secondary)] text-base leading-relaxed mb-6">
                  {block.text}
                </p>
              )
            }

            if (block.type === 'code') {
              return (
                <div key={i} className="story-block mb-6 rounded-xl overflow-hidden border border-[var(--border)]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-elevated)] border-b border-[var(--border)]">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">{block.language}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(block.code)}
                      className="text-[10px] text-[var(--text-muted)] hover:text-primary-400 transition-colors font-mono"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto bg-[var(--bg-secondary)]">
                    <code className="text-sm font-mono text-[var(--text-secondary)] leading-relaxed whitespace-pre">
                      {block.code}
                    </code>
                  </pre>
                </div>
              )
            }

            if (block.type === 'image') {
              return (
                <figure key={i} className="story-block mb-6">
                  <img
                    src={block.src}
                    alt={block.alt}
                    className="w-full h-48 md:h-72 object-cover rounded-xl"
                  />
                  {block.caption && (
                    <figcaption className="text-center text-xs text-[var(--text-muted)] mt-2">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              )
            }

            return null
          })}
        </article>
      </div>
    </div>
  )
}
