import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollStack, { ScrollStackItem } from './ScrollStack'

gsap.registerPlugin(ScrollTrigger)

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'image'; src: string; alt: string; caption?: string }

interface Blog {
  title: string
  excerpt: string
  date: string
  image?: string
  tags: string[]
  content: ContentBlock[]
}

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

const blogs: Blog[] = [
  {
    title: 'Building Scalable APIs with Node.js',
    excerpt: 'A deep dive into designing RESTful APIs that handle thousands of requests without breaking a sweat.',
    date: 'Jun 2025',
    image: 'https://picsum.photos/seed/api/800/400',
    tags: ['Node.js', 'Backend', 'API'],
    content: [
      { type: 'paragraph', text: 'Designing an API that serves a handful of endpoints is straightforward. Designing one that handles thousands of concurrent requests without degrading requires deliberate architectural choices at every layer.' },
      { type: 'paragraph', text: 'The foundation is non-blocking I/O — Node.js handles concurrency through an event loop rather than thread-per-request, which means your API can serve far more clients with far less memory. But this advantage evaporates the moment you block the event loop with synchronous operations.' },
      { type: 'image', src: 'https://picsum.photos/seed/server/800/400', alt: 'Server architecture', caption: 'Event-driven architecture enables high concurrency' },
      { type: 'paragraph', text: 'Database queries are the most common offender. An ORM that lazily loads related entities can trigger N+1 queries on a single request, each one holding an open connection.' },
      { type: 'code', language: 'javascript', code: `// Bad: N+1 queries\nconst users = await User.findAll();\nfor (const user of users) {\n  user.posts = await Post.findAll({ where: { userId: user.id } });\n}\n\n// Good: Eager loading\nconst users = await User.findAll({\n  include: [{ model: Post, as: 'posts' }]\n});` },
      { type: 'paragraph', text: 'Rate limiting is another essential layer. Without it, a single misbehaving client — or a bot — can exhaust your connection pool and take down every other client. Token bucket algorithms provide a good balance between fairness and burst tolerance.' },
      { type: 'paragraph', text: 'Response compression, structured logging, and health check endpoints are not glamorous, but they are what separate a prototype from a production service. Compression reduces bandwidth. Structured logs enable debugging at scale. Health checks let load balancers and orchestrators make informed routing decisions.' },
      { type: 'paragraph', text: 'The most important lesson: performance is not a feature you bolt on — it is a property that emerges from consistent, disciplined choices made throughout the development process.' },
    ],
  },
  {
    title: 'Why TypeScript Changed How I Write JavaScript',
    excerpt: 'From skeptic to advocate — how type safety transformed my development workflow and caught bugs before they shipped.',
    date: 'May 2025',
    image: 'https://picsum.photos/seed/typescript/800/400',
    tags: ['TypeScript', 'JavaScript'],
    content: [
      { type: 'paragraph', text: 'I resisted TypeScript for longer than I should have. My arguments were familiar: JavaScript is flexible, types add friction, the compiler gets in the way. These arguments were wrong — or rather, they were optimizing for the wrong thing.' },
      { type: 'paragraph', text: 'The real cost of dynamic typing is not the occasional runtime error. It is the cognitive load of holding a mental model of what each variable contains, what each function expects, and what each object looks like. This load accumulates silently across a codebase until refactoring becomes an act of faith.' },
      { type: 'code', language: 'typescript', code: `// Without types: what does this return?\nfunction processData(input) {\n  // Is input a string? number? object?\n  // What does this return?\n}\n\n// With types: crystal clear\nfunction processData(input: UserInput): ProcessedResult {\n  // Both input and output are fully typed\n  // IDE autocompletion works perfectly\n}` },
      { type: 'paragraph', text: 'TypeScript converts that mental model into explicit declarations that the compiler can verify. The first time you rename a property and watch the compiler light up every affected location, you understand the value.' },
      { type: 'image', src: 'https://picsum.photos/seed/ide/800/400', alt: 'IDE with TypeScript', caption: 'Type safety catches errors at compile time' },
      { type: 'paragraph', text: 'The friction I feared is real but temporary. Types do slow you down initially — especially when working with complex generics or third-party libraries with incomplete type definitions. But the speed you lose in writing, you gain tenfold in reading, debugging, and refactoring. Code is read far more often than it is written.' },
      { type: 'paragraph', text: 'The practical approach is incremental adoption. Start with strict mode disabled, enable it progressively. Use any as an escape hatch, not a default. Let the type system evolve alongside the codebase rather than imposing it wholesale from day one.' },
      { type: 'paragraph', text: 'TypeScript did not make me a better programmer. It made the consequences of my mistakes visible sooner, which is the next best thing.' },
    ],
  },
  {
    title: 'Deploying ML Models in Production',
    excerpt: 'Lessons learned from moving machine learning pipelines from Jupyter notebooks to production-grade serving infrastructure.',
    date: 'Apr 2025',
    image: 'https://picsum.photos/seed/ml/800/400',
    tags: ['Machine Learning', 'DevOps', 'Python'],
    content: [
      { type: 'paragraph', text: 'The gap between a working Jupyter notebook and a production ML system is vast, and most tutorials ignore it entirely. Getting a model to 95% accuracy on a clean dataset is the easy part. Serving that model reliably, at scale, with acceptable latency — that is where engineering begins.' },
      { type: 'code', language: 'python', code: `# Training is easy\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\naccuracy = model.score(X_test, y_test)  # 0.95!\n\n# Production is harder\nimport onnxruntime as ort\nsession = ort.InferenceSession("model.onnx")\npredictions = session.run(None, {"input": input_data})` },
      { type: 'paragraph', text: 'The first challenge is model serialization. Pickle is convenient but insecure and version-dependent. ONNX provides a framework-agnostic format that enables inference across runtimes.' },
      { type: 'image', src: 'https://picsum.photos/seed/pipeline/800/400', alt: 'ML Pipeline', caption: 'From notebook to production pipeline' },
      { type: 'paragraph', text: 'Monitoring is where most ML deployments fail silently. Model performance degrades over time as input distributions shift — a phenomenon known as data drift. Without monitoring, you discover degradation only when users complain or metrics collapse.' },
      { type: 'paragraph', text: 'The hardest lesson is that ML systems are software systems, subject to the same engineering principles as any other. Testing, versioning, monitoring, rollback capability — none of these are optional. The model is the least complex part of the system.' },
    ],
  },
  {
    title: 'The Art of Clean Code',
    excerpt: 'Why readable code matters more than clever code, and practical habits that make your codebase a joy to work with.',
    date: 'Mar 2025',
    tags: ['Software Engineering', 'Best Practices'],
    content: [
      { type: 'paragraph', text: 'Clean code is not about aesthetics. It is about reducing the cost of change — the time and effort required to understand, modify, and extend a codebase. This cost is dominated not by writing new code, but by reading existing code.' },
      { type: 'paragraph', text: 'The most impactful habit is naming. A well-named variable or function eliminates the need for comments, reduces cognitive load, and makes refactoring safer. If you find yourself writing a comment to explain what a function does, the function name is probably wrong.' },
      { type: 'code', language: 'javascript', code: `// Bad: what does this do?\nconst d = new Date() - u.ct;\n\n// Good: intent is obvious\nconst timeSinceCreation = Date.now() - user.createdAt;` },
      { type: 'paragraph', text: 'Short functions are easier to understand, test, and reuse. But "short" is not an end in itself — a function that does one thing clearly is better split into two functions that each do one thing clearly than combined into one that does two things vaguely.' },
      { type: 'paragraph', text: 'The test suite is not optional. Untested code is code that cannot be safely changed. The cost of a bug caught in production dwarfs the cost of a test written during development.' },
      { type: 'paragraph', text: 'Clean code is not written — it is rewritten. The first draft of any function is a rough approximation. Refactoring is the process of turning that approximation into something precise, readable, and robust. Budget time for it, or pay for it later.' },
    ],
  },
  {
    title: 'Getting Started with React Server Components',
    excerpt: 'Understanding the new mental model behind RSC and how it changes the way we think about rendering in React.',
    date: 'Feb 2025',
    image: 'https://picsum.photos/seed/react/800/400',
    tags: ['React', 'Frontend', 'Next.js'],
    content: [
      { type: 'paragraph', text: 'React Server Components represent the most significant shift in React\'s mental model since hooks. The core idea: some components run only on the server, producing serialized output that is sent to the client as part of the initial HTML. They never ship JavaScript to the browser.' },
      { type: 'code', language: 'jsx', code: `// This component runs ONLY on the server\nasync function BlogPost({ id }) {\n  const post = await db.posts.findById(id); // direct DB access!\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <p>{post.content}</p>\n    </article>\n  );\n}\n\n// This component runs on the client\n'use client';\nfunction LikeButton({ postId }) {\n  const [liked, setLiked] = useState(false);\n  return <button onClick={() => setLiked(!liked)}>\n    {liked ? '❤️' : '🤍'}\n  </button>\n}` },
      { type: 'paragraph', text: 'This is not server-side rendering in the traditional sense. SSR executes components on the server but hydrates them on the client — the JavaScript is still sent. RSC eliminates the JavaScript entirely for server components. The client only receives the rendered output, not the component code.' },
      { type: 'image', src: 'https://picsum.photos/seed/architecture/800/400', alt: 'RSC Architecture', caption: 'Server and client component boundaries' },
      { type: 'paragraph', text: 'The practical benefit is reduced bundle size. Components that fetch data, access databases, or perform heavy computation can run on the server without adding to the client JavaScript payload.' },
      { type: 'paragraph', text: 'The migration path for existing applications is gradual. New features can use RSC from the start. Existing pages can be migrated incrementally, moving data fetching to server components while keeping interactive elements as client components.' },
    ],
  },
]

export { slugify, estimateReadTime, blogs }
export type { Blog, ContentBlock }

export default function BlogsPage() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="blog" className="min-h-screen py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-10 group"
        >
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
          {blogs.map((blog, idx) => (
            <ScrollStackItem
              key={idx}
              itemClassName="!h-auto !p-0 !rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden cursor-pointer"
              onClick={() => navigate(`/blog/${slugify(blog.title)}`)}
            >
              <div className="flex flex-col md:flex-row">
                {blog.image && (
                  <div className="md:w-2/5 relative h-44 md:h-auto overflow-hidden bg-[var(--bg-elevated)]">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
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
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]">
                        {t}
                      </span>
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
