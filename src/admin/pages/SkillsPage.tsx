import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Skill } from '../../types/database'
import FormDialog from '../components/FormDialog'
import DeleteDialog from '../components/DeleteDialog'
import IconPicker from '../components/IconPicker'
import Toast from '../components/Toast'

const empty: { label: string; color: string; icon_name: string; category: 'languages' | 'web' | 'databases' } = { label: '', color: '#000000', icon_name: '', category: 'web' }

// Load all icons dynamically
const allIcons: Record<string, React.ComponentType<any>> = {}
let iconsLoaded = false

function useAllIcons() {
  const [loaded, setLoaded] = useState(iconsLoaded)

  useEffect(() => {
    if (loaded) return
    Promise.all([
      import('react-icons/si'),
      import('react-icons/fa'),
    ]).then(([si, fa]) => {
      Object.assign(allIcons, si, fa)
      iconsLoaded = true
      setLoaded(true)
    })
  }, [loaded])

  return loaded
}

export default function SkillsPage() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [deleting, setDeleting] = useState<Skill | null>(null)
  const [form, setForm] = useState(empty)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: async () => { const { data, error } = await supabase.from('skills').select('*').order('category').order('created_at', { ascending: false }); if (error) throw error; return data as Skill[] },
  })

  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      if (editing) { const { error } = await supabase.from('skills').update(d).eq('id', editing.id); if (error) throw error }
      else { const { error } = await supabase.from('skills').insert(d); if (error) throw error }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-skills'] }); setDialogOpen(false); setEditing(null); setToast({ message: editing ? 'Updated' : 'Added', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('skills').delete().eq('id', id); if (error) throw error },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-skills'] }); setDeleteOpen(false); setDeleting(null); setToast({ message: 'Deleted', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const categories = [
    { key: 'languages' as const, label: 'Languages', color: 'blue' },
    { key: 'web' as const, label: 'Web Technologies', color: 'purple' },
    { key: 'databases' as const, label: 'Databases', color: 'green' },
  ]

  const iconsLoaded = useAllIcons()

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Skills</h1><p className="text-sm text-[var(--text-muted)] mt-1">{items.length} skills across {categories.length} categories</p></div>
        <button onClick={() => { setEditing(null); setForm(empty); setDialogOpen(true) }} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25">+ Add Skill</button>
      </div>

      {isLoading ? <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div> : categories.map(cat => {
        const catItems = items.filter(s => s.category === cat.key)
        return (
          <div key={cat.key}>
            <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">{cat.label} ({catItems.length})</h2>
            <div className="flex flex-wrap gap-2">
              {catItems.map(skill => {
                const IconComp = skill.icon_name ? allIcons[skill.icon_name] : null
                return (
                  <div key={skill.id} className="group bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl px-3 py-2 flex items-center gap-2 hover:border-primary-500/30 transition-all cursor-pointer" onClick={() => { setEditing(skill); setForm({ label: skill.label, color: skill.color, icon_name: skill.icon_name || '', category: skill.category }); setDialogOpen(true) }}>
                    {IconComp ? <IconComp size={16} style={{ color: skill.color }} /> : <span className="w-3 h-3 rounded-full shrink-0" style={{ background: skill.color }} />}
                    <span className="text-sm text-[var(--text-secondary)]">{skill.label}</span>
                    <button onClick={(e) => { e.stopPropagation(); setDeleting(skill); setDeleteOpen(true) }} className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-red-400 hover:text-red-300 transition-all">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <FormDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        title={editing ? 'Edit Skill' : 'Add Skill'}
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 text-sm text-[var(--text-muted)]">Cancel</button>
            <button onClick={() => save.mutate(form)} disabled={save.isPending || !form.label} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium">{save.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Live Preview */}
          <div className="bg-[var(--bg-elevated)] rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${form.color}15` }}>
              {(() => {
                const Icon = form.icon_name ? allIcons[form.icon_name] : null
                return Icon ? <Icon size={24} style={{ color: form.color }} />
                  : (form.label && <span className="text-sm font-bold" style={{ color: form.color }}>{form.label.charAt(0)}</span>)
              })()}
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">{form.label || 'Skill Name'}</p>
              <p className="text-xs text-[var(--text-muted)]">{form.category}</p>
            </div>
          </div>
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Name *</label>
            <input value={form.label} onChange={e => setForm(f => ({...f, label: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          <IconPicker value={form.icon_name} onChange={iconName => {
            const colors: Record<string, string> = { SiPython: '#3776AB', FaJava: '#ED8B00', SiCplusplus: '#00599C', SiJavascript: '#F7DF1E', SiTypescript: '#3178C6', SiReact: '#61DAFB', SiNodedotjs: '#339933', SiPostgresql: '#4169E1', SiMongodb: '#47A248', SiDocker: '#2496ED', SiTailwindcss: '#06B6D4', SiFastapi: '#009688', SiDjango: '#092E20', SiTensorflow: '#FF6F00', SiPytorch: '#EE4C2C', SiGit: '#F05032' }
            setForm(f => ({...f, icon_name: iconName, color: colors[iconName] || f.color}))
          }} />
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Color</label>
              <div className="flex gap-2"><input type="color" value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)]" /><input value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)]" /></div></div>
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value as any}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)]">
                <option value="languages">Languages</option><option value="web">Web</option><option value="databases">Databases</option>
              </select></div>
          </div>
        </div>
      </FormDialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => deleting && del.mutate(deleting.id)} title="Skill" loading={del.isPending} />
    </div>
  )
}
