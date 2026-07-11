import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollStack, { ScrollStackItem } from './ScrollStack'

gsap.registerPlugin(ScrollTrigger)

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const projects = [
  {
    title: 'Itemplate',
    tagline: 'Your Inventory, Your Way',
    period: 'Aug 2025 – Sep 2025',
    org: 'Itransition Group',
    image: '/images/projects/inventory.svg',
    points: [
      'Full-stack inventory management system using React, Node.js, Express, and PostgreSQL with CRUD operations.',
      'Implemented JWT, Google, and GitHub OAuth, role-based access control, and secure API endpoints with Helmet and rate limiting.',
      'Integrated real-time updates via Socket.IO for live inventory and comment notifications across users.',
      'Built media upload with Multer and Cloudinary; optimized performance with compression, logging, and pagination.',
      'Responsive UI with React, TailwindCSS, React Query, internationalization (i18next), and search across inventories and items.',
    ],
    tech: ['React.js', 'Node.js', 'Express', 'PostgreSQL', 'Socket.IO', 'TailwindCSS', 'JWT', 'Cloudinary'],
  },
  {
    title: 'WeatherPro',
    tagline: 'See Today, Plan Tomorrow',
    period: 'May 2025 – Jul 2025',
    image: '/images/projects/weather.svg',
    points: [
      'Modern weather application using Streamlit and Plotly for real-time updates, forecasts, and historical data analysis.',
      'Integrated OpenWeatherMap API to fetch current weather and 5-day forecasts with interactive visualizations.',
      'Built Vert.x backend with Gradle for user authentication, location management, and weather alerts.',
      'Implemented user account management with login, registration, and personalized saved locations.',
      'Leveraged Python (Pandas) and reactive backend architecture for efficient data processing.',
    ],
    tech: ['Python', 'Streamlit', 'Plotly', 'Vert.x', 'Gradle', 'Pandas', 'OpenWeatherMap API'],
  },
  {
    title: 'Feedalyze',
    tagline: 'See What Customers Really Think',
    period: 'Oct 2024 – Nov 2024',
    org: 'NIT Rourkela',
    image: '/images/projects/sentiment.svg',
    points: [
      'NLP preprocessing including tokenization, stemming, and vectorization for feedback sentiment classification.',
      'Addressed class imbalance using SMOTE to improve model performance significantly.',
      'Utilized Decision Tree and Random Forest Classifiers for high accuracy in sentiment prediction.',
      'Applied EDA to uncover review patterns, demonstrating potential in customer service analytics.',
    ],
    tech: ['Python', 'NLTK', 'SMOTE', 'Scikit-Learn', 'Pandas', 'EDA'],
  },
  {
    title: 'Intellidoor',
    tagline: 'Detect. Notify. Protect.',
    period: 'Oct 2024 – Nov 2024',
    org: 'NIT Rourkela',
    image: '/images/projects/security.svg',
    points: [
      'Intelligent security lighting system using Arduino with RFID access control and IR-based intruder detection.',
      'Servo-controlled door automation with smooth open/close based on access authorization.',
      'Visual and audio alerts using RGB LEDs and buzzer with patterns for authorized access and intrusion alerts.',
      'Real-time access monitoring with RFID UID verification and serial communication for external notifications.',
    ],
    tech: ['Arduino IDE', 'Python', 'C++', 'RFID', 'IoT', 'Embedded Systems'],
  },
  {
    title: "Alzheimer's Detection",
    tagline: 'Deep Learning on MRI Data',
    period: 'May 2024 – Jul 2024',
    org: 'IIT Mandi',
    image: '/images/projects/alzheimer.svg',
    points: [
      "Deep learning framework using MRI data for early detection of Alzheimer's disease.",
      'Implemented CNN with transfer learning, achieving superior accuracy, sensitivity, and specificity.',
      'Model outperformed existing state-of-the-art diagnostic methods in comparative evaluation.',
      'Showcased potential of AI-driven approaches in advancing clinical neuroimaging and AD research.',
    ],
    tech: ['Python', 'TensorFlow', 'CNN', 'Transfer Learning', 'MRI', 'Deep Learning'],
  },
  {
    title: 'MedImagePro',
    tagline: 'Medical Image Processing Suite',
    period: 'May 2024 – Jul 2024',
    org: 'IIT Mandi',
    image: '/images/projects/medimage.svg',
    points: [
      'Application for DICOM operations including detection, metadata extraction, bounding box management, and report generation.',
      'Integrated YOLOv8 for detection and DeepLabV3 for segmentation on medical images.',
      'Fixed bugs related to incorrect detection and bounding box placements with annotation support.',
      'Generates PDF reports and saves updated DICOM files for further medical research.',
    ],
    tech: ['Python', 'Tkinter', 'DICOM', 'YOLOv8', 'DeepLabV3', 'OpenCV'],
  },
  {
    title: 'Carrenter',
    tagline: 'Rent. Drive. Repeat.',
    period: 'Mar 2024 – Apr 2024',
    org: 'NIT Rourkela',
    image: '/images/projects/car.svg',
    points: [
      'Full-stack car rental platform with seamless booking, payment, and admin management.',
      'React.js SPA with real-time vehicle filtering and rental tracking.',
      'Spring Boot backend with PostgreSQL for secure data handling and RESTful APIs.',
      'Admin Panel for managing vehicles, rentals, and users.',
    ],
    tech: ['React.js', 'Spring Boot', 'PostgreSQL', 'REST API', 'JWT'],
  },
  {
    title: 'Heart Sound Classification',
    tagline: 'CNN for Audio Diagnostics',
    period: 'Mar 2024 – Apr 2024',
    org: 'NIT Rourkela',
    image: '/images/projects/heart.svg',
    points: [
      'CNN to classify heart sound recordings as normal or abnormal with high accuracy.',
      'Applied noise reduction and heartbeat segmentation for clean audio inputs.',
      'Optimized CNN architecture by fine-tuning hyperparameters, improving accuracy.',
      'Random Forest classifier for comparative analysis with feature-based classification.',
    ],
    tech: ['Python', 'CNN', 'TensorFlow', 'Scikit-Learn', 'Audio Processing', 'Signal Processing'],
  },
]

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const navigate = useNavigate()

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
    <section ref={sectionRef} id="projects" className="py-24 px-4 relative">
      <h2 ref={headingRef} className="section-heading text-center mb-12">
        <span className="gradient-text">Projects</span>
      </h2>
      <div className="max-w-4xl mx-auto">
        <ScrollStack useWindowScroll={true} itemDistance={120} itemScale={0.03} itemStackDistance={25} stackPosition="15%" baseScale={0.88}>
          {projects.map((project, idx) => (
            <ScrollStackItem key={idx} itemClassName="!h-auto !p-0 !rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden cursor-pointer" onClick={() => navigate(`/projects/${slugify(project.title)}`)}>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative h-44 md:h-auto overflow-hidden bg-[var(--bg-elevated)]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-contain p-6"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--bg-card)] hidden md:block" />
                </div>
                <div className="md:w-3/5 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-display font-bold text-[var(--text-primary)]">{project.title}</h3>
                      <p className="text-accent-400 text-sm font-medium">{project.tagline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-primary-400 font-mono">{project.period}</span>
                    {project.org && (
                      <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded-full">{project.org}</span>
                    )}
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {project.points.slice(0, 3).map((point, i) => (
                      <li key={i} className="text-[var(--text-muted)] text-xs leading-relaxed flex gap-2">
                        <span className="text-primary-500 mt-0.5 shrink-0">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 6).map((t) => (
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
