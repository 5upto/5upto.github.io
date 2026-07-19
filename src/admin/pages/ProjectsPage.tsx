import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { sortByDate } from '../../lib/sortByDate'
import type { Project } from '../../types/database'
import FormDialog from '../components/FormDialog'
import DeleteDialog from '../components/DeleteDialog'
import ImagePicker from '../components/ImagePicker'
import JsonArrayField from '../components/JsonArrayField'
import Toast from '../components/Toast'
import { MdEdit, MdDelete } from 'react-icons/md'

const empty = { title: '', tagline: '', period: '', org: '', image: '', slug: '', points: [] as string[], tech: [] as string[], story: '' }

export default function ProjectsPage() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState<Project | null>(null)
  const [form, setForm] = useState(empty)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => { const { data, error } = await supabase.from('projects').select('*'); if (error) throw error; return sortByDate(data as Project[], 'period') },
  })

  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      if (editing) { const { error } = await supabase.from('projects').update(d).eq('id', editing.id); if (error) throw error }
      else { const { error } = await supabase.from('projects').insert(d); if (error) throw error }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); setDialogOpen(false); setEditing(null); setToast({ message: editing ? 'Updated' : 'Added', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('projects').delete().eq('id', id); if (error) throw error },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); setDeleteOpen(false); setDeleting(null); setToast({ message: 'Deleted', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Projects</h1><p className="text-sm text-[var(--text-muted)] mt-1">{items.length} projects</p></div>
        <button onClick={() => { setEditing(null); setForm(empty); setDialogOpen(true) }} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25">+ Add Project</button>
      </div>

      <div className="space-y-3">
        {isLoading ? <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div> : items.map(p => (
          <div key={p.id} className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl overflow-hidden hover:border-primary-500/30 transition-all group">
            <div className="flex flex-col sm:flex-row">
              {p.image && <div className="sm:w-48 h-32 sm:h-auto shrink-0 bg-[var(--bg-elevated)]"><img src={p.image} alt={p.title} className="w-full h-full object-cover" /></div>}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">{p.title}</h3>
                    <p className="text-xs text-accent-400 mt-0.5">{p.tagline}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-600/10 text-primary-400">{p.period}</span>
                      {p.org && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)]">{p.org}</span>}
                    </div>
                    {p.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tech.slice(0, 4).map((t, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)]">{t}</span>)}
                        {p.tech.length > 4 && <span className="text-[10px] text-[var(--text-muted)]">+{p.tech.length - 4}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setEditing(p); setForm({ title: p.title, tagline: p.tagline, period: p.period, org: p.org ?? '', image: p.image, slug: p.slug, points: p.points, tech: p.tech, story: p.story }); setDialogOpen(true) }} className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] text-primary-400"><MdEdit className="w-4 h-4" /></button>
                    <button onClick={() => { setDeleting(p); setDeleteOpen(true) }} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"><MdDelete className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FormDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        title={editing ? 'Edit Project' : 'Add Project'}
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 text-sm text-[var(--text-muted)]">Cancel</button>
            <button onClick={() => save.mutate(form)} disabled={save.isPending || !form.title || !form.slug} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium">{save.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Title *</label><input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Tagline</label><input value={form.tagline} onChange={e => setForm(f => ({...f, tagline: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Period</label><input value={form.period} onChange={e => setForm(f => ({...f, period: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Organization</label><input value={form.org} onChange={e => setForm(f => ({...f, org: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Slug *</label><input value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
          <ImagePicker value={form.image} onChange={v => setForm(f => ({...f, image: v}))} bucket="projects" label="Project Image" />
          <JsonArrayField value={form.points} onChange={v => setForm(f => ({...f, points: v}))} label="Key Points" />
          <JsonArrayField value={form.tech} onChange={v => setForm(f => ({...f, tech: v}))} label="Tech Stack" />
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Full Story</label><textarea value={form.story} onChange={e => setForm(f => ({...f, story: e.target.value}))} rows={6} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30 resize-y" /></div>
        </div>
      </FormDialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => deleting && del.mutate(deleting.id)} title="Project" loading={del.isPending} />
    </div>
  )
}
