import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
    title: 'Alzheimer\'s Detection',
    tagline: 'Deep Learning on MRI Data',
    period: 'May 2024 – Jul 2024',
    org: 'IIT Mandi',
    image: '/images/projects/alzheimer.svg',
    points: [
      'Deep learning framework using MRI data for early detection of Alzheimer\'s disease.',
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
      const cards = sectionRef.current?.querySelectorAll('.project-card')
      if (cards) {
        gsap.fromTo(cards,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="projects" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <h2 ref={headingRef} className="section-heading text-center">
          <span className="gradient-text">Projects</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <div key={idx} className="project-card group rounded-2xl bg-slate-800/40 border border-slate-700/40 overflow-hidden hover:border-primary-500/40 hover:bg-slate-800/60 transition-all duration-500">
              <div className="relative h-44 overflow-hidden bg-slate-800/60">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 animate-float"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs text-primary-300 font-mono">{project.period}</span>
                  {project.org && (
                    <span className="text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-full">{project.org}</span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-display font-bold text-white group-hover:text-primary-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-accent-400 text-sm font-medium mb-3">{project.tagline}</p>
                <ul className="space-y-1.5 mb-4">
                  {project.points.slice(0, 3).map((point, i) => (
                    <li key={i} className="text-slate-400 text-xs leading-relaxed flex gap-2">
                      <span className="text-primary-500 mt-0.5 shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 6).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
