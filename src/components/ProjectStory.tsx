import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const projects = [
  {
    title: 'Itemplate',
    slug: 'itemplate',
    tagline: 'Your Inventory, Your Way',
    period: 'Aug 2025 – Sep 2025',
    org: 'Itransition Group',
    image: '/images/projects/inventory.svg',
    story: `Modern organizations face a persistent challenge: managing diverse inventories across distributed teams without sacrificing visibility, security, or responsiveness. Itemplate was conceived to address this gap—a full-stack inventory management platform built to unify CRUD operations, real-time collaboration, and enterprise-grade security within a single, cohesive interface.

The system is architecturally layered, with a React frontend communicating through a Node.js and Express REST API to a PostgreSQL database. Authentication was a primary concern; the platform supports JWT-based login alongside Google and GitHub OAuth, with role-based access control ensuring that users interact only with resources their permissions allow. Helmet and rate-limiting middleware fortify API endpoints against common attack vectors.

One of the more technically demanding aspects was enabling real-time synchronization across concurrent users. Socket.IO was integrated to broadcast live inventory updates and comment notifications, ensuring that every participant sees the latest state without manual refresh. This required careful state management on the client to reconcile optimistic UI updates with server-confirmed changes.

Media handling was another focal point. Multer handles multipart uploads on the server, while Cloudinary manages storage and transformation, enabling efficient image delivery via CDN. Performance optimizations—including response compression, structured logging, and paginated queries—were introduced to keep the application responsive under load.

On the frontend, React Query manages server-state caching and synchronization, while i18next provides internationalization for multilingual deployments. TailwindCSS enforces a consistent, responsive design language across all breakpoints.

The primary challenge was orchestrating these disparate technologies into a seamless workflow. Real-time features, in particular, demanded rigorous testing of race conditions and connection recovery. The result is a production-grade platform that demonstrates how thoughtful architecture can reconcile complexity with usability.`,
    tech: ['React.js', 'Node.js', 'Express', 'PostgreSQL', 'Socket.IO', 'TailwindCSS', 'JWT', 'Cloudinary'],
  },
  {
    title: 'WeatherPro',
    slug: 'weatherpro',
    tagline: 'See Today, Plan Tomorrow',
    period: 'May 2025 – Jul 2025',
    image: '/images/projects/weather.svg',
    story: `Weather data is abundant, yet translating raw meteorological readings into actionable insight remains nontrivial. WeatherPro was developed to bridge this divide—a modern weather application that combines real-time updates, multi-day forecasts, and historical data analysis within an interactive, visually rich interface.

The frontend is built on Streamlit, chosen for its ability to produce reactive data applications with minimal boilerplate. Plotly provides the visualization layer, rendering interactive charts that allow users to explore temperature trends, precipitation probabilities, and atmospheric conditions across temporal scales. OpenWeatherMap API supplies the underlying data, delivering current conditions and five-day forecasts for any location worldwide.

A notable architectural decision was pairing the Python frontend with a Vert.x backend. Vert.x, running on the Gradle build system, provides an event-driven, non-blocking runtime well-suited for handling concurrent API requests and managing user sessions. This polyglot approach—Python for data processing and visualization, Java/Kotlin for backend services—leveraged the strengths of each ecosystem.

User management was implemented with login, registration, and personalized saved-location functionality, allowing returning users to pick up where they left off. Pandas handles the data wrangling on the Python side, transforming raw API responses into clean, analysis-ready DataFrames.

The principal challenge lay in synchronizing state between the reactive Streamlit frontend and the asynchronous Vert.x backend, particularly when handling user authentication flows and location persistence. Careful API design and session management resolved these friction points.

WeatherPro demonstrates that cross-language architectures, when thoughtfully designed, can deliver both analytical depth and operational reliability in a domain where data freshness is paramount.`,
    tech: ['Python', 'Streamlit', 'Plotly', 'Vert.x', 'Gradle', 'Pandas', 'OpenWeatherMap API'],
  },
  {
    title: 'Feedalyze',
    slug: 'feedalyze',
    tagline: 'See What Customers Really Think',
    period: 'Oct 2024 – Nov 2024',
    org: 'NIT Rourkela',
    image: '/images/projects/sentiment.svg',
    story: `Customer feedback is among the most valuable—and most underutilized—data assets an organization possesses. Feedalyze was developed at NIT Rourkela to automate the extraction of actionable sentiment from unstructured review text, transforming qualitative impressions into quantifiable, classifiable signals.

The pipeline begins with rigorous NLP preprocessing: tokenization segments text into meaningful units, stemming reduces lexical variation, and vectorization (TF-IDF) converts cleaned tokens into numerical feature representations suitable for machine learning. This preprocessing stage proved critical; without it, downstream classifiers exhibited significant performance degradation due to lexical noise and high dimensionality.

A persistent challenge in sentiment analysis is class imbalance—negative reviews are typically underrepresented relative to neutral or positive ones. SMOTE (Synthetic Minority Over-sampling Technique) was employed to generate synthetic minority-class samples, substantially improving model recall without sacrificing precision.

Two classifiers were evaluated: Decision Tree and Random Forest. The Random Forest ensemble consistently outperformed the single-tree model, achieving superior accuracy through its aggregation of decorrelated decision boundaries. Hyperparameter tuning via cross-validation further refined performance.

Exploratory Data Analysis revealed meaningful patterns in review length, vocabulary density, and temporal distribution, offering secondary insights into customer behavior beyond sentiment polarity alone.

The primary technical challenge was balancing preprocessing aggressiveness with information preservation—over-stemming conflated semantically distinct terms, while under-preprocessing left noise that degraded classifier performance. Iterative experimentation, guided by validation metrics, converged on an effective pipeline.

Feedalyze demonstrates that classical machine learning techniques, when applied with careful feature engineering and class-balancing strategies, remain highly competitive with deep learning approaches for domain-specific text classification tasks.`,
    tech: ['Python', 'NLTK', 'SMOTE', 'Scikit-Learn', 'Pandas', 'EDA'],
  },
  {
    title: 'Intellidoor',
    slug: 'intellidoor',
    tagline: 'Detect. Notify. Protect.',
    period: 'Oct 2024 – Nov 2024',
    org: 'NIT Rourkela',
    image: '/images/projects/security.svg',
    story: `Physical security systems in residential and institutional settings often rely on binary mechanisms—locks that are either engaged or disengaged—with no capacity for intelligent access control or intrusion awareness. Intelledoor, developed at NIT Rourkela, addresses this limitation through an embedded system that integrates RFID-based authentication, IR-based intrusion detection, and automated servo-controlled door actuation within a single Arduino-managed platform.

The system architecture centers on an Arduino microcontroller coordinating three subsystems: an RFID reader module for identity verification, IR sensors for intruder detection, and servo motors for physical door control. Upon presenting a valid RFID card, the controller verifies the UID against an authorized registry; if granted, the servo executes a smooth opening sequence, and a distinct RGB LED pattern plus buzzer tone signals authorized access.

If an unauthorized card is presented—or if IR sensors detect motion without prior authentication—the system triggers a distinct alarm pattern, combining visual and auditory alerts to deter intrusion while logging the event via serial communication for downstream notification.

The primary engineering challenge was managing concurrent sensor inputs without introducing latency in the authentication loop. Arduino's single-threaded execution model necessitated non-blocking polling strategies and careful timing management to ensure that RFID reads, IR scans, and servo actuation operated harmoniously.

Serial communication protocols were implemented to forward access events to external monitoring systems, enabling real-time oversight without burdening the embedded controller with network responsibilities.

Inteldoordemonstrates that resource-constrained embedded platforms, when programmed with disciplined interrupt handling and state-machine logic, can deliver security functionality rivaling commercial systems at a fraction of the cost.`,
    tech: ['Arduino IDE', 'Python', 'C++', 'RFID', 'IoT', 'Embedded Systems'],
  },
  {
    title: "Alzheimer's Detection",
    slug: "alzheimers-detection",
    tagline: 'Deep Learning on MRI Data',
    period: 'May 2024 – Jul 2024',
    org: 'IIT Mandi',
    image: '/images/projects/alzheimer.svg',
    story: `Early detection of Alzheimer's disease remains one of the most consequential challenges in clinical neuroimaging. Manual interpretation of MRI scans is labor-intensive, subject to inter-rater variability, and constrained by the volume of cases neurologists must evaluate. This project, conducted at IIT Mandi, developed a deep learning framework capable of identifying Alzheimer's pathology from structural MRI data with accuracy meeting or exceeding established benchmarks.

The approach leverages Convolutional Neural Networks with transfer learning—pretrained weights from large-scale image classification tasks provide a robust feature extractor that is fine-tuned on domain-specific MRI slices. This strategy dramatically reduces the data requirements inherent in training deep architectures from scratch, a critical consideration given the limited availability of annotated medical imaging datasets.

The model architecture was designed to capture both local textural abnormalities (such as cortical thinning and ventricular enlargement) and global structural patterns indicative of disease progression. Transfer learning from ImageNet-pretrained backbones proved particularly effective, as low-level edge and texture detectors generalize well across visual domains.

Model evaluation employed standard clinical metrics: accuracy, sensitivity (recall), and specificity. The trained model demonstrated superior performance relative to comparable approaches in the literature, suggesting that transfer learning with careful fine-tuning can rival purpose-built architectures for neuroimaging classification.

The principal challenge was dataset heterogeneity—MRI acquisitions vary substantially across scanners, protocols, and institutions. Standardization and augmentation strategies were critical to building a model robust to these variations.

This work underscores the viability of AI-assisted diagnostic tools in neurology, provided that models are developed with rigorous validation protocols and awareness of the clinical deployment context.`,
    tech: ['Python', 'TensorFlow', 'CNN', 'Transfer Learning', 'MRI', 'Deep Learning'],
  },
  {
    title: 'MedImagePro',
    slug: 'medimagepro',
    tagline: 'Medical Image Processing Suite',
    period: 'May 2024 – Jul 2024',
    org: 'IIT Mandi',
    image: '/images/projects/medimage.svg',
    story: `Medical imaging workflows are fragmented across specialized tools—viewers for DICOM浏览, separate applications for detection, yet another for segmentation, and manual report generation. MedImagePro, developed at IIT Mandi, consolidates these functions into a unified desktop application capable of performing detection, segmentation, metadata extraction, bounding box management, and automated PDF report generation within a single interface.

The application is built on Python with Tkinter providing the GUI framework. YOLOv8 serves as the detection backbone, identifying regions of interest within DICOM images, while DeepLabV3 performs semantic segmentation—partitioning anatomical structures at the pixel level. OpenCV handles low-level image manipulation, including normalization, color space conversion, and annotation rendering.

A significant portion of the development effort involved debugging detection and bounding box placement errors. DICOM images carry rich metadata—window width, window center, photometric interpretation—that must be correctly interpreted to display and process images accurately. Miscalibrated metadata led to inconsistent visualizations and incorrect detection coordinates, requiring systematic validation against ground-truth annotations.

The annotation subsystem allows clinicians to refine detection results, adding or adjusting bounding boxes interactively—a critical feature for production use where false positives must be manually corrected.

PDF report generation aggregates detection results, segmentation overlays, and patient metadata into standardized clinical documents, eliminating the manual transcription step that introduces errors in conventional workflows.

Updated DICOM files, with embedded annotations and detection results, are saved for archival and downstream analysis.

MedImagePro demonstrates that integrating multiple computer vision models within a clinician-facing application is feasible when the interface is designed around actual diagnostic workflows rather than algorithmic capabilities.`,
    tech: ['Python', 'Tkinter', 'DICOM', 'YOLOv8', 'DeepLabV3', 'OpenCV'],
  },
  {
    title: 'Carrenter',
    slug: 'carrenter',
    tagline: 'Rent. Drive. Repeat.',
    period: 'Mar 2024 – Apr 2024',
    org: 'NIT Rourkela',
    image: '/images/projects/car.svg',
    story: `Car rental platforms demand a careful balance between user experience and operational complexity—multiple vehicle categories, dynamic availability, pricing logic, payment processing, and administrative oversight must coexist within a coherent system. Carrenter, developed at NIT Rourkela, implements this full-stack solution with a multi-role architecture serving both customers and administrators.

The frontend is a React.js single-page application featuring real-time vehicle filtering, availability checking, and a multi-step booking flow that guides users through vehicle selection, date specification, pricing calculation, and payment. State management ensures that booking context persists across navigation steps without redundant server calls.

The backend, built on Spring Boot with PostgreSQL, exposes RESTful APIs for vehicle management, reservation processing, and user administration. JWT authentication secures endpoints, while role-based access control separates customer functionality (browsing, booking, payment) from administrative capabilities (fleet management, rental oversight, user administration).

The multi-step booking flow presented the most significant architectural challenge: maintaining transactional integrity across asynchronous API calls while providing responsive user feedback required careful orchestration of frontend state, optimistic UI patterns, and server-side idempotency guarantees.

Admin dashboards provide operational visibility—vehicle utilization rates, pending reservations, and user management—enabling efficient fleet oversight without requiring direct database access.

TailwindCSS ensures consistent responsive design across devices, critical for a service where users may browse on mobile while planning trips.

Carrenter demonstrates that full-stack applications serving multiple user roles benefit significantly from clear API boundary definitions and role-enforced middleware, reducing both security surface area and code complexity.`,
    tech: ['React.js', 'Spring Boot', 'PostgreSQL', 'REST API', 'JWT'],
  },
  {
    title: 'Heart Sound Classification',
    slug: 'heart-sound-classification',
    tagline: 'CNN for Audio Diagnostics',
    period: 'Mar 2024 – Apr 2024',
    org: 'NIT Rourkela',
    image: '/images/projects/heart.svg',
    story: `Auscultation—the clinical practice of listening to heart sounds—remains a frontline diagnostic tool for cardiac pathology, yet its effectiveness is constrained by subjectivity and the expertise of the listener. This project at NIT Rourkela developed a Convolutional Neural Network capable of classifying heart sound recordings as normal or abnormal, offering an objective, scalable complement to manual auscultation.

Raw phonocardiogram recordings are inherently noisy: ambient sounds, motion artifacts, and varying recording conditions introduce significant variability. The preprocessing pipeline addresses this through noise reduction (bandpass filtering), heartbeat segmentation (identifying individual cardiac cycles), and normalization—producing clean, standardized inputs suitable for CNN processing.

The CNN architecture was optimized through systematic hyperparameter tuning: kernel sizes, layer depths, dropout rates, and learning rate schedules were iteratively refined to maximize classification accuracy on the validation set. Random Forest classifiers served as a comparative baseline, operating on hand-crafted features (spectral centroids, zero-crossing rates, MFCC coefficients) extracted from the same preprocessed recordings.

The CNN consistently outperformed the feature-based Random Forest approach, demonstrating that learned representations from raw or minimally processed audio data capture diagnostic patterns that manual feature engineering misses—likely because the CNN discovers subtle temporal and spectral relationships that are difficult to articulate as discrete features.

The primary challenge was acquiring sufficient labeled training data; cardiac auscultation datasets are small relative to typical deep learning benchmarks. Data augmentation—time stretching, pitch shifting, noise injection—partially mitigated this limitation.

This project demonstrates that convolutional architectures, originally designed for spatial pattern recognition in images, generalize effectively to one-dimensional temporal signals when the preprocessing pipeline produces sufficiently clean, well-structured inputs.`,
    tech: ['Python', 'CNN', 'TensorFlow', 'Scikit-Learn', 'Audio Processing', 'Signal Processing'],
  },
  {
    title: 'Sphere',
    slug: 'sphere',
    tagline: 'A Space for Thoughts',
    period: 'Jan 2024 – Feb 2024',
    image: '/images/projects/blog.svg',
    story: `Content platforms succeed or fail on the strength of their reader experience and the ease with which creators can publish. Sphere was developed as a social blogging platform that prioritizes both—enabling content creation and discovery while maintaining the responsiveness and security expected of modern web applications.

The stack is MERN-based: React.js frontend, Node.js and Express backend, MongoDB for document storage. JWT authentication secures user sessions, while role-based access control separates reader, author, and administrator privileges.

Core features include full CRUD operations for blog posts, a like and comment system for reader engagement, bookmarking for content curation, and profile management for author branding. An administrative dashboard provides oversight of users, content, and reported material, with real-time notifications keeping administrators informed of platform activity.

The most technically demanding feature was the real-time notification system—admin alerts for new reports, comment activity, and user registrations needed to propagate without requiring page refreshes. Socket.IO was integrated for this purpose, with careful attention to connection lifecycle management to prevent memory leaks in long-lived sessions.

Responsive design was non-negotiable; the platform must function equally well on mobile browsers and desktop screens. TailwindCSS provided the utility-first framework, with component-level design decisions ensuring that text readability, touch targets, and navigation hierarchy remained consistent across breakpoints.

Performance optimization—lazy loading of images, code splitting, and efficient MongoDB indexing—ensured that the platform remained responsive as content volume grew.

Sphere demonstrates that full-stack blog platforms, while conceptually straightforward, require significant attention to real-time state synchronization, role-based security, and responsive design to deliver a production-quality user experience.`,
    tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS', 'JWT'],
  },
]

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ProjectStory() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-4">Project Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  const paragraphs = project.story.split('\n\n')

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
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
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 md:h-64 object-contain bg-[var(--bg-elevated)] rounded-2xl p-6"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)] mb-2">
            {project.title}
          </h1>
          <p className="text-accent-400 text-lg font-medium mb-4">{project.tagline}</p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-primary-400 font-mono">{project.period}</span>
            {project.org && (
              <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)] px-3 py-1 rounded-full">
                {project.org}
              </span>
            )}
          </div>
        </header>

        <article className="mb-12">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="text-[var(--text-secondary)] text-base leading-relaxed mb-6"
            >
              {paragraph}
            </p>
          ))}
        </article>

        <footer>
          <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]"
              >
                {t}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}
