import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { supabase } from '../../lib/supabase'
import type { Skill } from '../../types/database'
import FormDialog from '../components/FormDialog'
import DeleteDialog from '../components/DeleteDialog'
import IconPicker from '../components/IconPicker'
import Toast from '../components/Toast'
import { MdClose, MdDragIndicator } from 'react-icons/md'
import { getIconFallbackColor, useIconLibrary, type IconComponent } from '../../lib/iconLibrary'
import {
  mergeSkillCategories,
  saveSkillCategories,
  SKILL_CATEGORIES_QUERY_KEY,
  uniqueCategoryKey,
  useSkillCategories,
  type SkillCategory,
} from '../../hooks/useSkillCategories'

interface SkillForm {
  label: string
  color: string
  icon_name: string
  category: string
}

const empty: SkillForm = { label: '', color: '#000000', icon_name: '', category: 'web' }

function SortableSkill({ skill, icons, onEdit, onDelete }: {
  skill: Skill
  icons: Record<string, IconComponent>
  onEdit: (s: Skill) => void
  onDelete: (s: Skill) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  const IconComp = skill.icon_name ? icons[skill.icon_name] : null

  return (
    <div ref={setNodeRef} style={style} className="group bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl px-3 py-2 flex items-center gap-2 hover:border-primary-500/30 transition-all cursor-pointer" onClick={() => onEdit(skill)}>
      <button className="cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--text-secondary)] touch-none" {...attributes} {...listeners}>
        <MdDragIndicator className="w-3.5 h-3.5" />
      </button>
      {IconComp ? <IconComp size={16} style={{ color: skill.color }} /> : <span className="w-3 h-3 rounded-full shrink-0" style={{ background: skill.color }} />}
      <span className="text-sm text-[var(--text-secondary)]">{skill.label}</span>
      <button onClick={(e) => { e.stopPropagation(); onDelete(skill) }} className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-red-400 hover:text-red-300 transition-all">
        <MdClose className="w-3 h-3" />
      </button>
    </div>
  )
}

export default function SkillsPage() {
  const qc = useQueryClient()
  const { icons } = useIconLibrary()
  const { data: skillCategories } = useSkillCategories()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [deleting, setDeleting] = useState<Skill | null>(null)
  const [form, setForm] = useState<SkillForm>(empty)
  const [sectionDraft, setSectionDraft] = useState<SkillCategory[]>([])
  const [newSectionName, setNewSectionName] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: async () => {
      const { data, error } = await supabase.from('skills').select('*').order('category').order('sort_order')
      if (error) throw error
      return data as Skill[]
    },
  })

  const categories = useMemo(
    () => mergeSkillCategories(skillCategories, items.map(skill => skill.category)),
    [skillCategories, items]
  )

  const save = useMutation({
    mutationFn: async (d: SkillForm) => {
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

  const saveSections = useMutation({
    mutationFn: async (draft: SkillCategory[]) => {
      const cleaned = draft
        .map(category => ({ key: category.key, label: category.label.trim() }))
        .filter(category => category.key && category.label)
      await saveSkillCategories(cleaned)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SKILL_CATEGORIES_QUERY_KEY })
      setSectionDialogOpen(false)
      setToast({ message: 'Sections updated', type: 'success' })
    },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const reorder = useMutation({
    mutationFn: async (updates: { id: string; sort_order: number }[]) => {
      await Promise.all(updates.map(u => supabase.from('skills').update({ sort_order: u.sort_order }).eq('id', u.id)))
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-skills'] }),
  })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = (catKey: string, event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const catItems = items.filter(s => s.category === catKey)
    const oldIndex = catItems.findIndex(s => s.id === active.id)
    const newIndex = catItems.findIndex(s => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = [...catItems]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    const updates = reordered.map((s, i) => ({ id: s.id, sort_order: i + 1 }))
    qc.setQueryData<Skill[]>(['admin-skills'], prev =>
      prev?.map(s => s.category === catKey ? { ...s, sort_order: updates.find(u => u.id === s.id)?.sort_order ?? s.sort_order } : s) ?? prev
    )
    reorder.mutate(updates)
  }

  const openAddSkill = () => {
    setEditing(null)
    setForm({ ...empty, category: categories[0]?.key ?? 'web' })
    setDialogOpen(true)
  }

  const openEditSkill = (skill: Skill) => {
    setEditing(skill)
    setForm({ label: skill.label, color: skill.color, icon_name: skill.icon_name || '', category: skill.category })
    setDialogOpen(true)
  }

  const openSections = () => {
    setSectionDraft(categories.map(category => ({ ...category })))
    setNewSectionName('')
    setSectionDialogOpen(true)
  }

  const addSection = () => {
    const label = newSectionName.trim()
    if (!label) return
    const key = uniqueCategoryKey(label, sectionDraft.map(category => category.key))
    setSectionDraft(draft => [...draft, { key, label }])
    setNewSectionName('')
  }

  const removeSection = (key: string) => {
    if (items.some(skill => skill.category === key)) return
    setSectionDraft(draft => draft.filter(category => category.key !== key))
  }

  const sectionLabels = sectionDraft.map(category => category.label.trim().toLowerCase()).filter(Boolean)
  const hasDuplicateLabels = new Set(sectionLabels).size !== sectionLabels.length
  const hasBlankLabels = sectionDraft.some(category => !category.label.trim())
  const sectionsInvalid = hasDuplicateLabels || hasBlankLabels

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Skills</h1><p className="text-sm text-[var(--text-muted)] mt-1">{items.length} skills across {categories.length} sections</p></div>
        <div className="flex items-center gap-2">
          <button onClick={openSections} className="px-4 py-2.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded-xl text-sm font-medium transition-all">Edit Sections</button>
          <button onClick={openAddSkill} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25">+ Add Skill</button>
        </div>
      </div>

      {isLoading ? <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div> : categories.map(cat => {
        const catItems = items.filter(s => s.category === cat.key)
        return (
          <div key={cat.key}>
            <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">{cat.label} ({catItems.length})</h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(cat.key, e)}>
              <SortableContext items={catItems.map(s => s.id)} strategy={horizontalListSortingStrategy}>
                <div className="flex flex-wrap gap-2">
                  {catItems.map(skill => (
                    <SortableSkill key={skill.id} skill={skill} icons={icons} onEdit={openEditSkill} onDelete={(s) => { setDeleting(s); setDeleteOpen(true) }} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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
          <div className="bg-[var(--bg-elevated)] rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${form.color}15` }}>
              {(() => {
                const Icon = form.icon_name ? icons[form.icon_name] : null
                return Icon ? <Icon size={24} style={{ color: form.color }} />
                  : (form.label && <span className="text-sm font-bold" style={{ color: form.color }}>{form.label.charAt(0)}</span>)
              })()}
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">{form.label || 'Skill Name'}</p>
              <p className="text-xs text-[var(--text-muted)]">{categories.find(category => category.key === form.category)?.label ?? form.category}</p>
            </div>
          </div>
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Name *</label>
            <input value={form.label} onChange={e => setForm(f => ({...f, label: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          <IconPicker value={form.icon_name} color={form.color} onChange={(iconName, iconColor) => {
            setForm(f => ({
              ...f,
              icon_name: iconName,
              ...(iconName ? { color: iconColor ?? getIconFallbackColor(iconName) } : {}),
            }))
          }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Color</label>
              <div className="flex gap-2"><input type="color" value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)]" /><input value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)]" /></div></div>
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Section</label>
              <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)]">
                {categories.map(category => (
                  <option key={category.key} value={category.key}>{category.label}</option>
                ))}
              </select></div>
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={sectionDialogOpen}
        onClose={() => setSectionDialogOpen(false)}
        title="Edit Sections"
        footer={
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--text-muted)]">
              {hasDuplicateLabels ? 'Section names must be unique.' : hasBlankLabels ? 'Section names cannot be empty.' : 'Rename sections or add a new one.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setSectionDialogOpen(false)} className="px-4 py-2 text-sm text-[var(--text-muted)]">Cancel</button>
              <button onClick={() => saveSections.mutate(sectionDraft)} disabled={saveSections.isPending || sectionsInvalid || sectionDraft.length === 0} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium">{saveSections.isPending ? 'Saving...' : 'Save Sections'}</button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {sectionDraft.map((category) => {
              const count = items.filter(skill => skill.category === category.key).length
              return (
                <div key={category.key} className="flex items-center gap-2">
                  <input
                    value={category.label}
                    onChange={e => setSectionDraft(draft => draft.map(item => item.key === category.key ? { ...item, label: e.target.value } : item))}
                    className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500/30"
                  />
                  <span className="w-20 shrink-0 text-[11px] text-[var(--text-muted)]">{count} skill{count === 1 ? '' : 's'}</span>
                  <button
                    type="button"
                    onClick={() => removeSection(category.key)}
                    disabled={count > 0}
                    title={count > 0 ? 'Move or delete the skills in this section first' : 'Remove section'}
                    className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                  >
                    <MdClose className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>

          <div className="pt-4 border-t border-[var(--border)]">
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Add Section</label>
            <div className="flex gap-2">
              <input
                value={newSectionName}
                onChange={e => setNewSectionName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSection() } }}
                placeholder="e.g. Cloud & DevOps"
                className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30"
              />
              <button
                type="button"
                onClick={addSection}
                disabled={!newSectionName.trim()}
                className="px-4 py-2 bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border)] disabled:opacity-50 text-[var(--text-secondary)] rounded-xl text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </FormDialog>

      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => deleting && del.mutate(deleting.id)} title="Skill" loading={del.isPending} />
    </div>
  )
}
