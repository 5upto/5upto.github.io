import { useState, useMemo, useEffect } from 'react'

const iconModules = {
  si: () => import('react-icons/si'),
  fa: () => import('react-icons/fa'),
}

interface IconPickerProps {
  value: string
  onChange: (iconName: string) => void
}

const popularIcons = [
  { name: 'SiPython', label: 'Python', color: '#3776AB' },
  { name: 'FaJava', label: 'Java', color: '#ED8B00' },
  { name: 'SiCplusplus', label: 'C++', color: '#00599C' },
  { name: 'SiJavascript', label: 'JavaScript', color: '#F7DF1E' },
  { name: 'SiTypescript', label: 'TypeScript', color: '#3178C6' },
  { name: 'SiReact', label: 'React', color: '#61DAFB' },
  { name: 'SiNodedotjs', label: 'Node.js', color: '#339933' },
  { name: 'SiPostgresql', label: 'PostgreSQL', color: '#4169E1' },
  { name: 'SiMongodb', label: 'MongoDB', color: '#47A248' },
  { name: 'SiDocker', label: 'Docker', color: '#2496ED' },
  { name: 'SiGit', label: 'Git', color: '#F05032' },
  { name: 'SiGithub', label: 'GitHub', color: '#181717' },
  { name: 'SiTailwindcss', label: 'TailwindCSS', color: '#06B6D4' },
  { name: 'SiNextdotjs', label: 'Next.js', color: '#000000' },
  { name: 'SiExpress', label: 'Express.js', color: '#000000' },
  { name: 'SiFastapi', label: 'FastAPI', color: '#009688' },
  { name: 'SiDjango', label: 'Django', color: '#092E20' },
  { name: 'SiFlask', label: 'Flask', color: '#000000' },
  { name: 'SiTensorflow', label: 'TensorFlow', color: '#FF6F00' },
  { name: 'SiPytorch', label: 'PyTorch', color: '#EE4C2C' },
  { name: 'SiKeras', label: 'Keras', color: '#D00000' },
  { name: 'SiOpencv', label: 'OpenCV', color: '#5C3EE8' },
  { name: 'SiScikitlearn', label: 'Scikit-learn', color: '#F7931E' },
  { name: 'SiNumpy', label: 'NumPy', color: '#013243' },
  { name: 'SiPandas', label: 'Pandas', color: '#150458' },
  { name: 'SiMysql', label: 'MySQL', color: '#4479A1' },
  { name: 'SiRedis', label: 'Redis', color: '#FF4438' },
  { name: 'SiKubernetes', label: 'Kubernetes', color: '#326CE5' },
  { name: 'SiFirebase', label: 'Firebase', color: '#FFCA28' },
  { name: 'SiStreamlit', label: 'Streamlit', color: '#FF4B4B' },
  { name: 'SiSpringboot', label: 'Spring Boot', color: '#6DB33F' },
  { name: 'SiRedux', label: 'Redux', color: '#764ABC' },
  { name: 'SiHtml5', label: 'HTML5', color: '#E34F26' },
  { name: 'SiCss', label: 'CSS', color: '#1572B6' },
  { name: 'SiPlotly', label: 'Plotly', color: '#3F4F75' },
  { name: 'SiLangchain', label: 'LangChain', color: '#1C3C3C' },
  { name: 'SiMlflow', label: 'MLflow', color: '#0194E2' },
  { name: 'SiJenkins', label: 'Jenkins', color: '#D24939' },
  { name: 'SiNginx', label: 'nginx', color: '#009639' },
  { name: 'SiSocketdotio', label: 'Socket.io', color: '#010101' },
]

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState('')
  const [icons, setIcons] = useState<Record<string, React.ComponentType<any>>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadIcons()
  }, [])

  const loadIcons = async () => {
    if (Object.keys(icons).length > 0) return
    setLoading(true)
    try {
      const [siModule, faModule] = await Promise.all([
        iconModules.si(),
        iconModules.fa(),
      ])
      const siIcons = (siModule as any).default || siModule
      const faIcons = (faModule as any).default || faModule
      setIcons({ ...siIcons, ...faIcons })
    } catch (e) {
      console.error('Failed to load icons:', e)
    }
    setLoading(false)
  }

  const filteredIcons = useMemo(() => {
    const searchLower = search.toLowerCase()
    const filtered = popularIcons.filter(icon =>
      icon.label.toLowerCase().includes(searchLower) ||
      icon.name.toLowerCase().includes(searchLower)
    )
    if (Object.keys(icons).length > 0 && search.length > 1) {
      Object.keys(icons).forEach(key => {
        if (!filtered.find(f => f.name === key)) {
          const label = key.replace(/^(Si|Fa|Fi|Io|Md|Hi|Bi|Ai|Bs|Cg|Di|Fc|Gi|Gr|Go|Im|Lia|Lu|Pi|Ri|Ti|Vsc|Wi)(.+)/, (_, prefix, name) => {
            return name.replace(/([A-Z])/g, ' $1').trim()
          })
          if (label.toLowerCase().includes(searchLower) || key.toLowerCase().includes(searchLower)) {
            filtered.push({ name: key, label, color: '#666' })
          }
        }
      })
    }
    return filtered.slice(0, 50)
  }, [search, icons])

  const selectedIcon = popularIcons.find(i => i.name === value) || (value ? { name: value, label: value, color: '#666' } : null)
  const SelectedIconComponent = value ? (icons[value] || null) : null

  return (
    <div>
      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Icon</label>

      {value && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-[var(--bg-elevated)] rounded-lg">
          {SelectedIconComponent && <SelectedIconComponent size={24} style={{ color: selectedIcon?.color || '#666' }} />}
          <span className="text-sm text-[var(--text-primary)]">{selectedIcon?.label || value}</span>
          <button type="button" onClick={() => onChange('')} className="ml-auto text-red-400 hover:text-red-300 text-xs">Clear</button>
        </div>
      )}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search icons... (e.g. Python, React, Docker)"
        className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:outline-none focus:border-primary-500"
      />

      {filteredIcons.length > 0 && (
        <div className="mt-2 grid grid-cols-8 gap-1 max-h-48 overflow-y-auto p-1 bg-[var(--bg-elevated)] rounded-lg">
          {loading ? (
            <div className="col-span-8 text-xs text-[var(--text-muted)] py-4 text-center">Loading icons...</div>
          ) : filteredIcons.map((icon) => {
            const IconComp = icons[icon.name]
            return (
              <button
                key={icon.name}
                type="button"
                onClick={() => { onChange(icon.name); setSearch('') }}
                title={icon.label}
                className={`p-2 rounded-lg transition-all hover:scale-110 flex items-center justify-center ${
                  value === icon.name ? 'bg-primary-600/20 ring-2 ring-primary-500' : 'hover:bg-[var(--bg-card)]'
                }`}
              >
                {IconComp ? <IconComp size={20} style={{ color: icon.color }} /> : <span className="text-[10px] text-[var(--text-muted)]">{icon.label.slice(0, 2)}</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
