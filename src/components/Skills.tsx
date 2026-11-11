import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LogoLoop from './LogoLoop'
import { useSkills } from '../hooks/useSkills'
import { mergeSkillCategories, useSkillCategories } from '../hooks/useSkillCategories'
import { useIconLibrary, type IconComponent } from '../lib/iconLibrary'

gsap.registerPlugin(ScrollTrigger)

// Label -> icon_name mapping for fallback
const labelToIcon: Record<string, string> = {
  Python: 'SiPython', Java: 'FaJava', 'C++': 'SiCplusplus', JavaScript: 'SiJavascript', TypeScript: 'SiTypescript',
  HTML5: 'SiHtml5', CSS: 'SiCss', TailwindCSS: 'SiTailwindcss', React: 'SiReact', Redux: 'SiRedux',
  'Node.js': 'SiNodedotjs', 'Express.js': 'SiExpress', 'Next.js': 'SiNextdotjs', jQuery: 'SiJquery',
  Gulp: 'SiGulp', 'Spring Boot': 'SiSpringboot', Django: 'SiDjango', Flask: 'SiFlask',
  Streamlit: 'SiStreamlit', FastAPI: 'SiFastapi', Docker: 'SiDocker', 'Socket.io': 'SiSocketdotio',
  'Apache Kafka': 'SiApachekafka', Redis: 'SiRedis', Kubernetes: 'SiKubernetes', nginx: 'SiNginx',
  YAML: 'SiYaml', Jenkins: 'SiJenkins', Git: 'SiGit', GitHub: 'SiGithub', PyTorch: 'SiPytorch',
  Keras: 'SiKeras', TensorFlow: 'SiTensorflow', NumPy: 'SiNumpy', Pandas: 'SiPandas',
  Dask: 'SiDask', Polars: 'SiPolars', 'Scikit-learn': 'SiScikitlearn', OpenCV: 'SiOpencv',
  Plotly: 'SiPlotly', tqdm: 'SiTqdm', SciPy: 'SiScipy', MLflow: 'SiMlflow', LangChain: 'SiLangchain',
  PostgreSQL: 'SiPostgresql', MySQL: 'SiMysql', MongoDB: 'SiMongodb', SQLite: 'SiSqlite', Firebase: 'SiFirebase',
  'Power Platform': 'PowerPlatform', 'Power Apps': 'PowerApps', 'Power Automate': 'PowerAutomate',
  'Power Pages': 'PowerPages', 'Power BI': 'PowerBI', Dataverse: 'Dataverse', 'AI Builder': 'AIBuilder',
  SharePoint: 'SharePoint',
  Yeoman: 'DiYeoman',
}

function getIcon(skill: { label: string; icon_name?: string }, icons: Record<string, IconComponent>): IconComponent | null {
  // 1. Try icon_name from database
  if (skill.icon_name && icons[skill.icon_name]) return icons[skill.icon_name]
  // 2. Try label -> icon_name mapping
  const iconName = labelToIcon[skill.label]
  if (iconName && icons[iconName]) return icons[iconName]
  return null
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { data: skills } = useSkills()
  const { data: skillCategories } = useSkillCategories()
  const { icons, loaded: iconsLoaded } = useIconLibrary()

  const categories = useMemo(() => {
    const merged = mergeSkillCategories(skillCategories, (skills ?? []).map(skill => skill.category))
    return merged.map((category, index) => ({
      ...category,
      speed: index % 2 === 0 ? 50 : -60,
    }))
  }, [skillCategories, skills])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  if (!skills || !iconsLoaded) return null

  return (
    <section ref={sectionRef} id="skills" className="py-20 md:py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <h2 ref={headingRef} className="section-heading text-center">
          Technical <span className="gradient-text">Skills</span>
        </h2>
        <div className="mt-6 space-y-6">
          {categories.map((cat) => {
            const items = (skills ?? []).filter(s => s.category === cat.key)
            return (
              <div key={cat.key}>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">{cat.label}</p>
                <LogoLoop
                  logos={items.map((skill) => {
                    const Icon = getIcon(skill, icons)
                    return {
                      node: (
                        <span title={skill.label} className="skill-icon-wrapper inline-flex items-center justify-center cursor-pointer">
                          {Icon ? (
                            <Icon size={24} style={{ color: skill.color }} />
                          ) : (
                            <span className="text-sm font-medium" style={{ color: skill.color }}>{skill.label}</span>
                          )}
                        </span>
                      ),
                    }
                  })}
                  speed={cat.speed}
                  gap={32}
                  fadeOut
                  pauseOnHover
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
