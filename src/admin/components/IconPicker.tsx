import { useState, useMemo } from 'react'
import {
  getIconFallbackColor,
  getIconColor,
  POPULAR_ICONS,
  useIconLibrary,
  type IconCatalogEntry,
} from '../../lib/iconLibrary'

interface IconPickerProps {
  value: string
  color?: string
  onChange: (iconName: string, color?: string) => void
}

export default function IconPicker({ value, color, onChange }: IconPickerProps) {
  const [search, setSearch] = useState('')
  const { icons, loaded } = useIconLibrary()

  const filteredIcons = useMemo(() => {
    const searchLower = search.toLowerCase().trim()
    const filtered: IconCatalogEntry[] = POPULAR_ICONS.filter(icon =>
      icon.label.toLowerCase().includes(searchLower) ||
      icon.name.toLowerCase().includes(searchLower)
    )

    if (loaded && searchLower.length > 0) {
      const seen = new Set(filtered.map(icon => icon.name))
      Object.keys(icons).forEach(key => {
        if (seen.has(key)) return
        const label = key.replace(/^(Si|Fa|Fi|Io|Md|Hi|Bi|Ai|Bs|Cg|Di|Fc|Gi|Gr|Go|Im|Lia|Lu|Pi|Ri|Ti|Vsc|Wi)(.+)/, (_, _prefix, name) => {
          return name.replace(/([A-Z])/g, ' $1').trim()
        })
        if (label.toLowerCase().includes(searchLower) || key.toLowerCase().includes(searchLower)) {
          filtered.push({ name: key, label, color: getIconFallbackColor(key) })
        }
      })
    }

    return filtered.slice(0, 50)
  }, [search, icons, loaded])

  const selectedIcon = POPULAR_ICONS.find(i => i.name === value) || (value ? { name: value, label: value, color: getIconFallbackColor(value) } : null)
  const SelectedIconComponent = value ? (icons[value] || null) : null
  const selectedColor = color || selectedIcon?.color || getIconFallbackColor(value)

  return (
    <div>
      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Icon</label>

      {value && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-[var(--bg-elevated)] rounded-lg">
          {SelectedIconComponent && <SelectedIconComponent size={24} style={{ color: selectedColor }} />}
          <span className="text-sm text-[var(--text-primary)]">{selectedIcon?.label || value}</span>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">{selectedColor}</span>
          <button type="button" onClick={() => onChange('')} className="ml-auto text-red-400 hover:text-red-300 text-xs">Clear</button>
        </div>
      )}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search icons... (e.g. Power Apps, Dataverse, Python)"
        className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:outline-none focus:border-primary-500"
      />

      {filteredIcons.length > 0 && (
        <div className="mt-2 grid grid-cols-8 gap-1 max-h-48 overflow-y-auto p-1 bg-[var(--bg-elevated)] rounded-lg">
          {filteredIcons.map((icon) => {
            const IconComp = icons[icon.name]
            const iconColor = getIconColor(icon.name) ?? icon.color
            return (
              <button
                key={icon.name}
                type="button"
                onClick={() => { onChange(icon.name, iconColor); setSearch('') }}
                title={icon.label}
                className={`p-2 rounded-lg transition-all hover:scale-110 flex items-center justify-center ${
                  value === icon.name ? 'bg-primary-600/20 ring-2 ring-primary-500' : 'hover:bg-[var(--bg-card)]'
                }`}
              >
                {IconComp ? <IconComp size={20} style={{ color: iconColor }} /> : <span className="text-[10px] text-[var(--text-muted)]">{icon.label.slice(0, 2)}</span>}
              </button>
            )
          })}
        </div>
      )}

      {!loaded && search.length > 0 && (
        <p className="mt-1 text-[10px] text-[var(--text-muted)]">Loading full icon library…</p>
      )}
    </div>
  )
}
