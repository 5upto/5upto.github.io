import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Experience } from '../../types/database'
import FormDialog from '../components/FormDialog'
import DeleteDialog from '../components/DeleteDialog'
import ImagePicker from '../components/ImagePicker'
import JsonArrayField from '../components/JsonArrayField'
import Toast from '../components/Toast'

const empty = { role: '', company: '', logo: '', location: '', period: '', slug: '', points: [] as string[], story: '', sort_order: 0 }

export default function ExperiencesPage() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [deleting, setDeleting] = useState<Experience | null>(null)
  const [form, setForm] = useState(empty)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-experiences'],
    queryFn: async () => { const { data, error } = await supabase.from('experiences').select('*').order('sort_order'); if (error) throw error; return data as Experience[] },
  })

  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      if (editing) { const { error } = await supabase.from('experiences').update(d).eq('id', editing.id); if (error) throw error }
      else { const { error } = await supabase.from('experiences').insert(d); if (error) throw error }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-experiences'] }); setDialogOpen(false); setEditing(null); setToast({ message: editing ? 'Updated' : 'Added', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('experiences').delete().eq('id', id); if (error) throw error },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-experiences'] }); setDeleteOpen(false); setDeleting(null); setToast({ message: 'Deleted', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const openAdd = () => { setEditing(null); setForm(empty); setDialogOpen(true) }
  const openEdit = (e: Experience) => { setEditing(e); setForm({ role: e.role, company: e.company, logo: e.logo, location: e.location, period: e.period, slug: e.slug, points: e.points, story: e.story, sort_order: e.sort_order }); setDialogOpen(true) }
  const F = ({ l, v, onChange, ph, ta, r }: { l: string; v: string; onChange: (s: string) => void; ph?: string; ta?: boolean; r?: number }) => (
    <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{l}</label>
      {ta ? <textarea value={v} onChange={e => onChange(e.target.value)} rows={r||3} placeholder={ph} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-y" />
      : <input value={v} onChange={e => onChange(e.target.value)} placeholder={ph} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />}</div>
  )

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Experiences</h1><p className="text-sm text-[var(--text-muted)] mt-1">{items.length} entries</p></div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25">+ Add Experience</button>
      </div>
      <div className="space-y-3">
        {isLoading ? <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div> : items.map(e => (
          <div key={e.id} className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl p-4 hover:border-primary-500/30 transition-all">
            <div className="flex items-start gap-4">
              {e.logo && <img src={e.logo} alt="" className="w-12 h-12 rounded-xl object-contain bg-[var(--bg-elevated)] shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{e.role}</h3>
                <p className="text-xs text-primary-400">{e.company}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-600/10 text-primary-400">{e.period}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)]">{e.location}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(e)} className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] text-primary-400 transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                <button onClick={() => { setDeleting(e); setDeleteOpen(true) }} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? 'Edit Experience' : 'Add Experience'}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><F l="Role *" v={form.role} onChange={v => setForm(f => ({...f, role: v}))} /><F l="Company *" v={form.company} onChange={v => setForm(f => ({...f, company: v}))} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><F l="Period" v={form.period} onChange={v => setForm(f => ({...f, period: v}))} ph="Jun 2026 – Present" /><F l="Location" v={form.location} onChange={v => setForm(f => ({...f, location: v}))} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><F l="Slug *" v={form.slug} onChange={v => setForm(f => ({...f, slug: v}))} /><F l="Sort Order" v={String(form.sort_order)} onChange={v => setForm(f => ({...f, sort_order: Number(v)}))} /></div>
          <ImagePicker value={form.logo} onChange={v => setForm(f => ({...f, logo: v}))} bucket="logos" label="Company Logo" />
          <JsonArrayField value={form.points} onChange={v => setForm(f => ({...f, points: v}))} label="Key Points" />
          <F l="Full Story" v={form.story} onChange={v => setForm(f => ({...f, story: v}))} ta r={6} />
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">Cancel</button>
            <button onClick={() => save.mutate(form)} disabled={save.isPending || !form.role || !form.company} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium">{save.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </FormDialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => deleting && del.mutate(deleting.id)} title="Experience" loading={del.isPending} />
    </div>
  )
}
