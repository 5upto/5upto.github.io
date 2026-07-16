import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { sortByDate } from '../../lib/sortByDate'
import type { GalleryStory } from '../../types/database'
import FormDialog from '../components/FormDialog'
import DeleteDialog from '../components/DeleteDialog'
import JsonArrayField from '../components/JsonArrayField'
import ImagePicker from '../components/ImagePicker'
import Toast from '../components/Toast'

const empty = { title: '', image: '', period: '', slug: '', story: '', tags: [] as string[] }

export default function GalleryAdminPage() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryStory | null>(null)
  const [deleting, setDeleting] = useState<GalleryStory | null>(null)
  const [form, setForm] = useState(empty)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => { const { data, error } = await supabase.from('gallery_stories').select('*'); if (error) throw error; return sortByDate(data as GalleryStory[], 'period') },
  })

  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      if (editing) { const { error } = await supabase.from('gallery_stories').update(d).eq('id', editing.id); if (error) throw error }
      else { const { error } = await supabase.from('gallery_stories').insert(d); if (error) throw error }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-gallery'] }); setDialogOpen(false); setEditing(null); setToast({ message: editing ? 'Updated' : 'Added', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('gallery_stories').delete().eq('id', id); if (error) throw error },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-gallery'] }); setDeleteOpen(false); setDeleting(null); setToast({ message: 'Deleted', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Gallery Stories</h1><p className="text-sm text-[var(--text-muted)] mt-1">{items.length} stories</p></div>
        <button onClick={() => { setEditing(null); setForm(empty); setDialogOpen(true) }} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25">+ Add Story</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {isLoading ? <div className="text-center py-12 text-[var(--text-muted)] col-span-3">Loading...</div> : items.map(s => (
          <div key={s.id} className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl overflow-hidden hover:border-primary-500/30 transition-all group cursor-pointer" onClick={() => { setEditing(s); setForm({ title: s.title, image: s.image, period: s.period, slug: s.slug, story: s.story, tags: s.tags }); setDialogOpen(true) }}>
            {s.image && <div className="h-32 bg-[var(--bg-elevated)]"><img src={s.image} alt={s.title} className="w-full h-full object-cover" /></div>}
            <div className="p-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{s.title}</h3>
              <p className="text-xs text-primary-400 mt-0.5">{s.period}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {s.tags.slice(0, 3).map((t, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)]">{t}</span>)}
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                <button onClick={(e) => { e.stopPropagation(); setEditing(s); setForm({ title: s.title, image: s.image, period: s.period, slug: s.slug, story: s.story, tags: s.tags }); setDialogOpen(true) }} className="flex-1 py-1.5 text-xs text-primary-400 hover:bg-primary-600/10 rounded-lg">Edit</button>
                <button onClick={(e) => { e.stopPropagation(); setDeleting(s); setDeleteOpen(true) }} className="flex-1 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FormDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        title={editing ? 'Edit Gallery Story' : 'Add Gallery Story'}
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
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Slug *</label><input value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Period</label><input value={form.period} onChange={e => setForm(f => ({...f, period: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
          <ImagePicker value={form.image} onChange={v => setForm(f => ({...f, image: v}))} bucket="gallery" label="Story Image" />
          <JsonArrayField value={form.tags} onChange={v => setForm(f => ({...f, tags: v}))} label="Tags" />
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Story</label><textarea value={form.story} onChange={e => setForm(f => ({...f, story: e.target.value}))} rows={8} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30 resize-y" /></div>
        </div>
      </FormDialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => deleting && del.mutate(deleting.id)} title="Gallery Story" loading={del.isPending} />
    </div>
  )
}
