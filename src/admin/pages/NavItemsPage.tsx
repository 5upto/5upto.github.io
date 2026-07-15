import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { NavItem } from '../../types/database'
import FormDialog from '../components/FormDialog'
import DeleteDialog from '../components/DeleteDialog'
import Toast from '../components/Toast'

const emptyNav = { label: '', href: '', sort_order: 0 }

export default function NavItemsPage() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<NavItem | null>(null)
  const [deleting, setDeleting] = useState<NavItem | null>(null)
  const [form, setForm] = useState(emptyNav)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-nav-items'],
    queryFn: async () => { const { data, error } = await supabase.from('nav_items').select('*').order('sort_order'); if (error) throw error; return data as NavItem[] },
  })

  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      if (editing) { const { error } = await supabase.from('nav_items').update(d).eq('id', editing.id); if (error) throw error }
      else { const { error } = await supabase.from('nav_items').insert({ ...d, sort_order: items.length }); if (error) throw error }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-nav-items'] }); setDialogOpen(false); setEditing(null); setToast({ message: editing ? 'Updated' : 'Added', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('nav_items').delete().eq('id', id); if (error) throw error },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-nav-items'] }); setDeleteOpen(false); setDeleting(null); setToast({ message: 'Deleted', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDragIdx(null)
    setOverIdx(null)
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOverIdx(idx)
  }

  const handleDrop = async (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === dropIdx) { setDragIdx(null); setOverIdx(null); return }
    try {
      const a = items[dragIdx]
      const b = items[dropIdx]
      await supabase.from('nav_items').update({ sort_order: b.sort_order }).eq('id', a.id)
      await supabase.from('nav_items').update({ sort_order: a.sort_order }).eq('id', b.id)
      qc.invalidateQueries({ queryKey: ['admin-nav-items'] })
      setToast({ message: 'Reordered', type: 'success' })
    } catch (e: any) {
      setToast({ message: e.message, type: 'error' })
    }
    setDragIdx(null)
    setOverIdx(null)
  }

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Navigation Items</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{items.length} items</p>
        </div>
        <button onClick={() => { setEditing(null); setForm(emptyNav); setDialogOpen(true) }} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25">+ Add Item</button>
      </div>

      {/* Pill Navigation Preview */}
      <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-4">Navigation Preview</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {isLoading ? <p className="text-[var(--text-muted)] text-sm">Loading...</p> : items.map(item => (
            <div key={item.id} className="group relative flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full px-4 py-2 transition-all hover:border-primary-500/50 hover:shadow-md">
              <span className="text-sm font-medium text-[var(--text-secondary)]">{item.label}</span>
              <button onClick={() => { setDeleting(item); setDeleteOpen(true) }} className="ml-1 w-4 h-4 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
          <button onClick={() => { setEditing(null); setForm(emptyNav); setDialogOpen(true) }} className="flex items-center gap-1 bg-primary-600/10 border border-dashed border-primary-500/30 rounded-full px-4 py-2 text-sm font-medium text-primary-400 hover:bg-primary-600/20 transition-all">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add
          </button>
        </div>
      </div>

      {/* Drag & Drop Reorder */}
      <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-4">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Drag to Reorder</p>
        <div className="space-y-2">
          {isLoading ? <p className="text-[var(--text-muted)] text-sm">Loading...</p> : items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-grab active:cursor-grabbing transition-all ${
                overIdx === idx ? 'bg-primary-600/10 border border-primary-500/30 scale-[1.02]' : 'bg-[var(--bg-elevated)] border border-transparent'
              } ${dragIdx === idx ? 'opacity-50 scale-95' : ''}`}
            >
              <svg className="w-4 h-4 text-[var(--text-muted)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
              <span className="text-[10px] text-[var(--text-muted)] w-4 text-center">{idx + 1}</span>
              <span className="text-sm text-[var(--text-secondary)] flex-1 truncate">{item.label}</span>
              <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline">{item.href}</span>
              <div className="flex gap-1 ml-2">
                <button onClick={(e) => { e.stopPropagation(); setEditing(item); setForm({ label: item.label, href: item.href, sort_order: item.sort_order }); setDialogOpen(true) }} className="w-6 h-6 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-card)] transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleting(item); setDeleteOpen(true) }} className="w-6 h-6 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? 'Edit Nav Item' : 'Add Nav Item'}>
        <div className="space-y-4">
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Label *</label>
            <input value={form.label} onChange={e => setForm(f => ({...f, label: e.target.value}))} placeholder="Home, About, Skills..." className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Href *</label>
            <input value={form.href} onChange={e => setForm(f => ({...f, href: e.target.value}))} placeholder="#hero or /blog" className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          <div className="bg-[var(--bg-elevated)] rounded-xl p-3">
            <p className="text-[10px] text-[var(--text-muted)]">Examples: #hero, #about, /blog, /gallery</p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 text-sm text-[var(--text-muted)]">Cancel</button>
            <button onClick={() => save.mutate(form)} disabled={save.isPending || !form.label || !form.href} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium">{save.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </FormDialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => deleting && del.mutate(deleting.id)} title="Nav Item" loading={del.isPending} />
    </div>
  )
}
