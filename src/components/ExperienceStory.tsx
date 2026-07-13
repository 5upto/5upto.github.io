import { useParams, useNavigate } from 'react-router-dom'
import { useState, useCallback } from 'react'

const experiences = [
  {
    role: 'Software Engineer',
    company: 'Regnum Resource Ltd.',
    logo: '/images/logos/regnum.png',
    location: 'Dhaka, Bangladesh',
    period: 'Jun 2026 – Present',
    slug: 'regnum-resource-ltd',
    story: `At Regnum Resource Ltd., I serve as a Software Engineer within the Intelligent Transportation Systems division, where the core mandate is to architect and deliver AI-driven solutions for traffic management and vehicular analytics. The scope of this role spans the full stack of computer vision inference pipelines—from model training and optimization to real-time deployment on edge and desktop platforms.

A central technical challenge has been designing a high-performance PyQt-based desktop application capable of ingesting live camera feeds and executing multi-object detection, tracking, and classification concurrently. The architecture employs a producer-consumer threading model, decoupling frame acquisition from inference to maintain sub-100ms latency. On the deep learning side, I developed custom YOLO-variant architectures fine-tuned for vehicle detection under adverse weather and lighting conditions, leveraging Albumentations for augmentation and mixed-precision training to accelerate convergence.

Integration with enterprise systems required building robust REST APIs using FastAPI, backed by Oracle SQL databases optimized with materialized views for time-series traffic data. The ANPR subsystem involved OCR pipelines with character-level segmentation, while RFID integration demanded low-latency event handling for toll and access control scenarios.

This role has deepened my expertise in real-time systems, production ML deployment, and the engineering trade-offs inherent in building safety-critical intelligent infrastructure.`,
    points: [
      'Developing intelligent transportation solutions powered by AI and Computer Vision.',
      'Designing high-performance desktop applications using Python and PyQt for real-time monitoring.',
      'Developing AI-based vehicle detection, tracking and classification modules using Deep Learning.',
      'Building REST APIs with FastAPI and integrating Oracle SQL databases for enterprise applications.',
      'Working on ANPR, RFID integration, traffic analytics and real-time automation systems.',
    ],
  },
  {
    role: 'Technology Specialist',
    company: 'Betopia Limited',
    logo: '/images/logos/betopia.png',
    location: 'Dhaka, Bangladesh',
    period: 'Oct 2025 – May 2026',
    slug: 'betopia-limited',
    story: `During my tenure as Technology Specialist at Betopia Limited, I was entrusted with the design and deployment of enterprise-grade business applications using the Microsoft Power Platform. The organizational context involved a mid-sized enterprise seeking to digitize legacy paper-based workflows, necessitating solutions that were both technically sound and adoption-friendly for non-technical stakeholders.

I architected three primary systems: a Visitor Management System with badge printing and host notification pipelines, a Gate Pass Management System with multi-level approval workflows, and a Requisition Management System that automated procurement requests end-to-end. Each solution was built within the constraints of the Power Apps canvas model, requiring careful data modeling in Dataverse and thoughtful use of delegation-aware formulas to ensure scalability beyond the 500-row delegation limit.

A significant technical challenge was implementing complex conditional approval flows in Power Automate that accommodated role-based routing, parallel branches, and escalation logic. These flows integrated with Microsoft 365 services—Outlook, Teams, and SharePoint—requiring thorough testing of connector throttling limits and error handling patterns.

Beyond application development, I administered Active Directory Domain Services, managing user lifecycle, group policies, and conditional access configurations. This work reinforced the importance of identity-centric security in enterprise environments.`,
    points: [
      'Built enterprise business applications using Microsoft Power Apps with focus on scalability.',
      'Developed Visitor Management, Gate Pass and Requisition Management Systems.',
      'Implemented workflow automation via Power Automate, reducing manual intervention.',
      'Administered Microsoft 365 and Active Directory (AD DS), managing users and access control.',
    ],
  },
  {
    role: 'Intern Developer',
    company: 'Itransition Group',
    logo: '/images/logos/itransition.png',
    location: 'Minsk, Belarus',
    period: 'Jul 2025 – Sep 2025',
    slug: 'itransition-group',
    story: `My internship at Itransition Group placed me within an Agile product team tasked with developing scalable web applications using the MERN stack. The engineering culture emphasized code review discipline, test-driven development, and continuous integration—practices that shaped my approach to software craftsmanship from an early career stage.

A primary deliverable was a user management module featuring secure role-based authentication. This involved implementing JWT-based session management with refresh token rotation, bcrypt hashing with configurable work factors, and fine-grained permission middleware on Express.js routes. The frontend leveraged React Context API for state management with protected route guards enforcing access control at the router level.

I independently designed and built a library management system as an internal tool, incorporating automated fake data generation using Faker.js to populate test environments at scale. The system demonstrated CRUD operations with pagination, filtering, and optimistic UI updates via React Query, showcasing attention to both backend data integrity and frontend responsiveness.

A collaborative highlight was contributing to a real-time presentation platform supporting multi-user concurrent editing. This required WebSocket-based synchronization with operational transformation principles to resolve edit conflicts, an introduction to distributed systems challenges that proved intellectually stimulating.`,
    points: [
      'Developed and deployed scalable web applications using MERN stack and Agile practices.',
      'Engineered a user management module with secure role-based authentication.',
      'Built a library management system with automated fake data generation for testing.',
      'Collaborated on a real-time presentation platform with multi-user editing.',
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'BigBasket',
    logo: '/images/logos/bigbasket.png',
    location: 'Bengaluru, India',
    period: 'Jan 2025 – Jul 2025',
    slug: 'bigbasket',
    story: `At BigBasket, India's leading online grocery platform, I worked within the Professional Services team on internal tooling and enterprise integration solutions. The operational context involved bridging the gap between frontline store operations and backend systems, with a focus on digitizing cash-on-delivery (COD) payment collection workflows.

A core contribution was developing an end-to-end workflow enabling store incharges to systematically collect and reconcile COD payments from delivery partners. This involved designing state machine-driven task templates that tracked payment status from initiation through reconciliation, with automated escalation for overdue collections.

On the frontend, I built an interactive task visualization interface using ReactFlow, rendering directed acyclic graphs of workflow steps with drag-and-drop node configuration and real-time status indicators. The component library was architected with a compound component pattern, ensuring reusability across different workflow types.

The integration layer required interfacing with existing Java Vert.x backend APIs over REST and gRPC, necessitating careful attention to data serialization formats and error boundary handling across technology boundaries. I implemented circuit breaker patterns using Resilience4j to ensure graceful degradation when downstream services experienced latency spikes.

This experience provided valuable exposure to distributed systems design in a high-traffic production environment serving millions of daily transactions.`,
    points: [
      'Collaborated with the professional services team to integrate enterprise solutions.',
      'Developed a workflow for store incharges to collect COD payments from delivery partners.',
      'Built an interactive UI using ReactFlow to visualize task templates.',
      'Integrated the UI with existing Java Vert.x backend APIs.',
    ],
  },
  {
    role: 'Undergraduate Research Assistant',
    company: 'NIT Rourkela',
    logo: '/images/logos/nitrkl.png',
    location: 'Rourkela, India',
    period: 'Jul 2024 – Dec 2024',
    slug: 'nit-rourkela',
    story: `As an Undergraduate Research Assistant at the National Institute of Technology Rourkela, I contributed to a computer vision research project focused on building classification under diverse and challenging lighting conditions. The research question addressed a real-world problem: robustly categorizing architectural structures from satellite and street-view imagery where illumination variability severely degrades classifier performance.

My primary technical contribution was the design and implementation of a hybrid deep learning architecture integrating Convolutional Neural Networks with a self-attention Transformer encoder. The CNN backbone extracted hierarchical spatial features, while the Transformer's multi-head attention mechanism captured long-range contextual dependencies across feature maps—enabling the model to maintain discriminative power across varied lighting scenarios.

The data pipeline employed extensive augmentation strategies: Gaussian blur for noise robustness, random affine transformations for geometric invariance, adaptive histogram equalization (CLAHE) for illumination normalization, and brightness/contrast jittering. These techniques were systematically ablated to quantify their individual and combinatorial contributions to model generalization.

The research was conducted under the guidance of faculty advisors and culminated in a peer-reviewed publication at an IEEE International Conference. This experience honed my abilities in experimental methodology, scholarly writing, and the rigorous evaluation frameworks demanded by top-tier academic venues.`,
    points: [
      'Conducted research on Building Classification under Diverse Lighting Conditions.',
      'Applied image augmentation techniques: blur, rotation, zooming and histogram equalization.',
      'Developed a CNN integrated with self-attention Transformer for robust image classification.',
      'Published the research at an IEEE International Conference.',
    ],
  },
  {
    role: 'Research Intern',
    company: 'IIT Mandi',
    logo: '/images/logos/iitmandi.png',
    location: 'Mandi, India',
    period: 'May 2024 – Jul 2024',
    slug: 'iit-mandi',
    story: `At the Indian Institute of Technology Mandi, I joined the Visual Intelligence and Machine Learning (VIML) research group as a Research Intern, undertaking a project at the intersection of deep learning and clinical neuroimaging. The research objective was to develop automated methods for early-stage Alzheimer's disease detection from structural MRI scans—a problem of immense clinical significance where timely diagnosis can meaningfully improve patient outcomes.

My technical approach centered on implementing and evaluating multiple Convolutional Neural Network architectures with transfer learning, leveraging pre-trained weights from ImageNet to overcome the inherent data scarcity in medical imaging domains. I experimented with EfficientNet, ResNet-50, and DenseNet-121 backbones, systematically comparing their feature extraction capabilities on T1-weighted MRI volumes after skull stripping and intensity normalization.

A key challenge was addressing class imbalance in the dataset, which I mitigated through a combination of oversampling (SMOTE), weighted cross-entropy loss, and strategic data augmentation tailored to 3D medical images. The comparative evaluation framework followed rigorous k-fold cross-validation protocols with statistical significance testing to ensure reproducible conclusions.

The project also involved developing DICOMET, an in-house desktop application for DICOM image visualization and metadata extraction, which streamlined the research team's annotation and quality assurance workflows. This internship deepened my understanding of AI-driven healthcare applications and the methodological rigor required for medical AI research.`,
    points: [
      'Worked in the Visual Intelligence and Machine Learning (VIML) research group.',
      'Developed DICOMET, a desktop app for DICOM visualization and metadata extraction.',
      'Improved AI detection accuracy and optimized bounding-box placement for medical image analysis.',
    ],
  },
]

function toSlug(company: string): string {
  return company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getDominantColor(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return 'var(--bg-elevated)'

  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  ctx.drawImage(img, 0, 0)

  // Sample corner pixels to find the background color
  const corners = [
    [0, 0],
    [canvas.width - 1, 0],
    [0, canvas.height - 1],
    [canvas.width - 1, canvas.height - 1],
    [Math.floor(canvas.width / 2), 0],
    [0, Math.floor(canvas.height / 2)],
    [canvas.width - 1, Math.floor(canvas.height / 2)],
    [Math.floor(canvas.width / 2), canvas.height - 1],
  ]

  const colorCounts = new Map<string, number>()
  for (const [x, y] of corners) {
    const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data
    if (a < 128) continue
    // Quantize to reduce noise
    const qr = Math.round(r / 8) * 8
    const qg = Math.round(g / 8) * 8
    const qb = Math.round(b / 8) * 8
    const key = `${qr},${qg},${qb}`
    colorCounts.set(key, (colorCounts.get(key) || 0) + 1)
  }

  let maxCount = 0
  let dominant = '128,128,128'
  for (const [color, count] of colorCounts) {
    if (count > maxCount) {
      maxCount = count
      dominant = color
    }
  }

  const [r, g, b] = dominant.split(',').map(Number)
  return `rgb(${r}, ${g}, ${b})`
}

export default function ExperienceStory() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [imgColors, setImgColors] = useState<Record<string, string>>({})

  const handleImageLoad = useCallback((company: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const color = getDominantColor(e.currentTarget)
    setImgColors(prev => ({ ...prev, [company]: color }))
  }, [])

  const experience = experiences.find((exp) => toSlug(exp.company) === slug)

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Experience Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative z-10 bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-4 py-12">
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

        <header className="mb-12">
          <div className="mb-6">
            {experience.logo && (
              <img
                src={experience.logo}
                alt={experience.company}
                className="w-full h-48 md:h-64 object-contain rounded-2xl p-6 transition-colors duration-500"
                style={{ backgroundColor: imgColors[experience.company] || 'var(--bg-elevated)' }}
                onLoad={(e) => handleImageLoad(experience.company, e)}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)] mb-2">
            {experience.role}
          </h1>
          <p className="text-accent-400 text-lg font-medium mb-4">{experience.company}</p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-primary-400 font-mono">{experience.period}</span>
            <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)] px-3 py-1 rounded-full">
              {experience.location}
            </span>
          </div>
        </header>

        <article className="mb-12">
          {experience.story.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </article>

        <footer>
          <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Key Contributions
          </h3>
          <div className="flex flex-wrap gap-2">
            {experience.points.map((point, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]"
              >
                {point}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}
