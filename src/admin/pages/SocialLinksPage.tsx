import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { SocialLink } from '../../types/database'
import FormDialog from '../components/FormDialog'
import DeleteDialog from '../components/DeleteDialog'
import Toast from '../components/Toast'
import { platformIcons } from '../../lib/socialIcons'
import { FaGlobe } from 'react-icons/fa'
import { useTouchReorder } from '../hooks/useTouchReorder'

const empty = { platform: '', url: '', label: '', icon_svg: '' }

export default function SocialLinksPage() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<SocialLink | null>(null)
  const [deleting, setDeleting] = useState<SocialLink | null>(null)
  const [form, setForm] = useState(empty)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const desktopDragIdx = useRef<number | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-social-links'],
    queryFn: async () => { const { data, error } = await supabase.from('social_links').select('*').order('sort_order'); if (error) throw error; return data as SocialLink[] },
  })

  const handleReorder = async (from: number, to: number) => {
    try {
      const a = items[from]
      const b = items[to]
      await supabase.from('social_links').update({ sort_order: b.sort_order }).eq('id', a.id)
      await supabase.from('social_links').update({ sort_order: a.sort_order }).eq('id', b.id)
      qc.invalidateQueries({ queryKey: ['admin-social-links'] })
      setToast({ message: 'Reordered', type: 'success' })
    } catch (e: any) {
      setToast({ message: e.message, type: 'error' })
    }
  }

  const { dragIdx, overIdx, touchHandlers } = useTouchReorder(items.length, handleReorder)

  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      if (editing) { const { error } = await supabase.from('social_links').update(d).eq('id', editing.id); if (error) throw error }
      else { const { error } = await supabase.from('social_links').insert({ ...d, sort_order: items.length }); if (error) throw error }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-social-links'] }); setDialogOpen(false); setEditing(null); setToast({ message: editing ? 'Updated' : 'Added', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('social_links').delete().eq('id', id); if (error) throw error },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-social-links'] }); setDeleteOpen(false); setDeleting(null); setToast({ message: 'Deleted', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    desktopDragIdx.current = idx
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => { desktopDragIdx.current = null }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault()
    const from = desktopDragIdx.current
    if (from !== null && from !== dropIdx) handleReorder(from, dropIdx)
    desktopDragIdx.current = null
  }

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Social Links</h1><p className="text-sm text-[var(--text-muted)] mt-1">{items.length} links</p></div>
        <button onClick={() => { setEditing(null); setForm(empty); setDialogOpen(true) }} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25">+ Add Link</button>
      </div>

      {/* Drag & Drop Reorder */}
      <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-4">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Drag to Reorder</p>
        <div className="space-y-2">
          {isLoading ? <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div> : items.map((l, idx) => (
            <div
              key={l.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              {...touchHandlers}
              data-idx={idx}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-grab active:cursor-grabbing select-none touch-none transition-all ${
                overIdx === idx ? 'bg-primary-600/10 border border-primary-500/30 scale-[1.02]' : 'bg-[var(--bg-elevated)] border border-transparent'
              } ${dragIdx === idx || desktopDragIdx.current === idx ? 'opacity-50 scale-95' : ''}`}
            >
              <svg className="w-4 h-4 text-[var(--text-muted)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
              <span className="text-[10px] text-[var(--text-muted)] w-4 text-center">{idx + 1}</span>
              <div className="w-8 h-8 bg-[var(--bg-card)] rounded-lg flex items-center justify-center shrink-0">
                <span className="fill-[var(--text-primary)]">{platformIcons[l.platform] || <FaGlobe size={18} className="fill-[var(--text-muted)]" />}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-[var(--text-primary)]">{l.platform}</span>
                <p className="text-[10px] text-[var(--text-muted)] truncate">{l.url}</p>
              </div>
              <div className="flex gap-1 ml-2">
                <button onClick={(e) => { e.stopPropagation(); setEditing(l); setForm({ platform: l.platform, url: l.url, label: l.label, icon_svg: l.icon_svg ?? '' }); setDialogOpen(true) }} className="w-6 h-6 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-card)] transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleting(l); setDeleteOpen(true) }} className="w-6 h-6 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FormDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        title={editing ? 'Edit Social Link' : 'Add Social Link'}
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 text-sm text-[var(--text-muted)]">Cancel</button>
            <button onClick={() => save.mutate(form)} disabled={save.isPending || !form.platform || !form.url} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium">{save.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Platform</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {Object.keys(platformIcons).map(p => (
                <button key={p} type="button" onClick={() => setForm(f => ({...f, platform: p, label: p}))}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${form.platform === p ? 'border-primary-500 bg-primary-500/10' : 'border-[var(--border)] hover:border-primary-500/30'}`}>
                  <span className="fill-[var(--text-primary)]">{platformIcons[p]}</span>
                  <span className="text-[9px] text-[var(--text-muted)] text-center leading-tight">{p}</span>
                </button>
              ))}
            </div></div>
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">URL *</label>
            <input value={form.url} onChange={e => setForm(f => ({...f, url: e.target.value}))} placeholder="https://..." className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
        </div>
      </FormDialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => deleting && del.mutate(deleting.id)} title="Social Link" loading={del.isPending} />
    </div>
  )
}
