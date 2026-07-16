import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollStack, { ScrollStackItem } from './ScrollStack'
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

export default function BlogsPage() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { data: blogs } = useBlogs()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  if (!blogs) return null

  return (
    <section ref={sectionRef} id="blog" className="min-h-screen py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-10 group">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>
      <h2 ref={headingRef} className="section-heading text-center mb-12">
        <span className="gradient-text">Blog</span>
      </h2>
      <div className="max-w-4xl mx-auto">
        <ScrollStack useWindowScroll={true} itemDistance={120} itemScale={0.03} itemStackDistance={25} stackPosition="15%" baseScale={0.88}>
          {(blogs ?? []).map((blog) => (
            <ScrollStackItem
              key={blog.id}
              itemClassName="!h-auto !p-0 !rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden cursor-pointer"
              onClick={() => navigate(`/blog/${blog.slug}`)}
            >
              <div className="flex flex-col md:flex-row">
                {blog.image && (
                  <div className="md:w-2/5 relative h-44 md:h-auto overflow-hidden bg-[var(--bg-elevated)]">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--bg-card)] hidden md:block" />
                  </div>
                )}
                <div className={`${blog.image ? 'md:w-3/5' : 'w-full'} p-6`}>
                  <h3 className="text-lg font-display font-bold text-[var(--text-primary)] mb-1.5">{blog.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-3">{blog.excerpt}</p>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-primary-400 font-mono">{blog.date}</span>
                    <span className="text-xs text-[var(--text-muted)]">{estimateReadTime(blog.content)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  )
}
