import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LogoLoop from './LogoLoop'
import {
  SiPython, SiCplusplus, SiJavascript, SiTypescript,
  SiFastapi, SiFlask, SiReact, SiNodedotjs, SiExpress,
  SiPostgresql, SiMysql, SiMongodb, SiSqlite,
  SiPytorch, SiTensorflow, SiOpencv, SiScikitlearn, SiNumpy, SiPandas,
  SiHtml5, SiCss, SiTailwindcss, SiRedux, SiNextdotjs,
  SiJquery, SiGulp, SiSpringboot, SiDjango, SiStreamlit,
  SiDocker, SiSocketdotio, SiApachekafka, SiRedis,
  SiKubernetes, SiNginx, SiYaml, SiJenkins, SiGit, SiGithub,
  SiKeras, SiDask, SiPolars, SiPlotly, SiTqdm, SiScipy,
  SiLangchain, SiMlflow, SiFirebase,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

interface SkillIcon {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  label: string
  color: string
}

const languages: SkillIcon[] = [
  { icon: SiPython, label: 'Python', color: '#3776AB' },
  { icon: FaJava, label: 'Java', color: '#ED8B00' },
  { icon: SiCplusplus, label: 'C++', color: '#00599C' },
  { icon: SiJavascript, label: 'JavaScript', color: '#F7DF1E' },
  { icon: SiTypescript, label: 'TypeScript', color: '#3178C6' },
]

const webTech: SkillIcon[] = [
  { icon: SiHtml5, label: 'HTML5', color: '#E34F26' },
  { icon: SiCss, label: 'CSS', color: '#1572B6' },
  { icon: SiTailwindcss, label: 'TailwindCSS', color: '#06B6D4' },
  { icon: SiReact, label: 'React', color: '#61DAFB' },
  { icon: SiRedux, label: 'Redux', color: '#764ABC' },
  { icon: SiNodedotjs, label: 'Node.js', color: '#339933' },
  { icon: SiExpress, label: 'Express.js', color: '#000000' },
  { icon: SiNextdotjs, label: 'Next.js', color: '#000000' },
  { icon: SiJquery, label: 'jQuery', color: '#0769AD' },
  { icon: SiGulp, label: 'Gulp', color: '#CF4647' },
  { icon: SiSpringboot, label: 'Spring Boot', color: '#6DB33F' },
  { icon: SiDjango, label: 'Django', color: '#092E20' },
  { icon: SiFlask, label: 'Flask', color: '#000000' },
  { icon: SiStreamlit, label: 'Streamlit', color: '#FF4B4B' },
  { icon: SiFastapi, label: 'FastAPI', color: '#009688' },
  { icon: SiDocker, label: 'Docker', color: '#2496ED' },
  { icon: SiSocketdotio, label: 'Socket.io', color: '#010101' },
  { icon: SiApachekafka, label: 'Apache Kafka', color: '#231F20' },
  { icon: SiRedis, label: 'Redis', color: '#FF4438' },
  { icon: SiKubernetes, label: 'Kubernetes', color: '#326CE5' },
  { icon: SiNginx, label: 'nginx', color: '#009639' },
  { icon: SiYaml, label: 'YAML', color: '#CB171E' },
  { icon: SiJenkins, label: 'Jenkins', color: '#D24939' },
  { icon: SiGit, label: 'Git', color: '#F05032' },
  { icon: SiGithub, label: 'GitHub', color: '#181717' },
  { icon: SiPytorch, label: 'PyTorch', color: '#EE4C2C' },
  { icon: SiKeras, label: 'Keras', color: '#D00000' },
  { icon: SiTensorflow, label: 'TensorFlow', color: '#FF6F00' },
  { icon: SiNumpy, label: 'NumPy', color: '#013243' },
  { icon: SiPandas, label: 'Pandas', color: '#150458' },
  { icon: SiDask, label: 'Dask', color: '#F9A03F' },
  { icon: SiPolars, label: 'Polars', color: '#CD7F32' },
  { icon: SiScikitlearn, label: 'Scikit-learn', color: '#F7931E' },
  { icon: SiOpencv, label: 'OpenCV', color: '#5C3EE8' },
  { icon: SiPlotly, label: 'Plotly', color: '#3F4F75' },
  { icon: SiTqdm, label: 'tqdm', color: '#FF6F00' },
  { icon: SiScipy, label: 'SciPy', color: '#8CAAE6' },
  { icon: SiMlflow, label: 'MLflow', color: '#0194E2' },
  { icon: SiLangchain, label: 'LangChain', color: '#1C3C3C' },
]

const databases: SkillIcon[] = [
  { icon: SiPostgresql, label: 'PostgreSQL', color: '#4169E1' },
  { icon: SiMysql, label: 'MySQL', color: '#4479A1' },
  { icon: SiMongodb, label: 'MongoDB', color: '#47A248' },
  { icon: SiSqlite, label: 'SQLite', color: '#003B57' },
  { icon: SiFirebase, label: 'Firebase', color: '#FFCA28' },
]

const rows = [
  { label: 'Languages', items: languages, speed: 50 },
  { label: 'Web Technologies', items: webTech, speed: -60 },
  { label: 'Databases', items: databases, speed: 50 },
]

export default function Skills() {
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
    <section ref={sectionRef} id="skills" className="py-20 md:py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <h2 ref={headingRef} className="section-heading text-center">
          Technical <span className="gradient-text">Skills</span>
        </h2>
        <div className="mt-6 space-y-6">
          {rows.map((row) => (
            <div key={row.label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">{row.label}</p>
              <LogoLoop
                logos={row.items.map(({ icon: Icon, label, color }) => ({
                  node: (
                    <span title={label} className="skill-icon-wrapper inline-flex items-center justify-center cursor-pointer">
                      <Icon size={24} style={{ color }} />
                    </span>
                  ),
                }))}
                speed={row.speed}
                gap={32}
                fadeOut
                pauseOnHover
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
