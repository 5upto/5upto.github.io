import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { sortByDate } from '../../lib/sortByDate'
import type { Blog, ContentBlock } from '../../types/database'
import FormDialog from '../components/FormDialog'
import DeleteDialog from '../components/DeleteDialog'
import JsonArrayField from '../components/JsonArrayField'
import Toast from '../components/Toast'
import { MdEdit, MdDelete } from 'react-icons/md'

const emptyBlog = { title: '', excerpt: '', date: '', image: '', tags: [] as string[], content: [] as ContentBlock[], slug: '' }

export default function BlogsAdminPage() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [deleting, setDeleting] = useState<Blog | null>(null)
  const [form, setForm] = useState(emptyBlog)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => { const { data, error } = await supabase.from('blogs').select('*'); if (error) throw error; return sortByDate((data ?? []) as Blog[], 'date') },
  })

  const save = useMutation({
    mutationFn: async (data: typeof form) => {
      if (editing) { const { error } = await supabase.from('blogs').update(data).eq('id', editing.id); if (error) throw error }
      else { const { error } = await supabase.from('blogs').insert(data); if (error) throw error }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blogs'] }); setDialogOpen(false); setEditing(null); setToast({ message: editing ? 'Updated' : 'Added', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('blogs').delete().eq('id', id); if (error) throw error },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blogs'] }); setDeleteOpen(false); setDeleting(null); setToast({ message: 'Deleted', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const addContentBlock = (type: string) => {
    let block: ContentBlock
    if (type === 'paragraph') block = { type: 'paragraph', text: '' }
    else if (type === 'code') block = { type: 'code', language: 'javascript', code: '' }
    else block = { type: 'image', src: '', alt: '', caption: '' }
    setForm(f => ({ ...f, content: [...f.content, block] }))
  }

  const updateContentBlock = (index: number, updates: Partial<ContentBlock>) => {
    setForm(f => ({ ...f, content: f.content.map((b, i) => i === index ? { ...b, ...updates } as ContentBlock : b) }))
  }

  const removeContentBlock = (index: number) => {
    setForm(f => ({ ...f, content: f.content.filter((_, i) => i !== index) }))
  }

  const moveContentBlock = (index: number, direction: 'up' | 'down') => {
    setForm(f => {
      const newContent = [...f.content]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= newContent.length) return f
      ;[newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]]
      return { ...f, content: newContent }
    })
  }

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Blog Posts</h1><p className="text-sm text-[var(--text-muted)] mt-1">{blogs.length} posts</p></div>
        <button onClick={() => { setEditing(null); setForm(emptyBlog); setDialogOpen(true) }} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25">+ Add Post</button>
      </div>

      <div className="space-y-3">
        {isLoading ? <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div> : blogs.map(b => (
          <div key={b.id} className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl overflow-hidden hover:border-primary-500/30 transition-all group">
            <div className="flex flex-col sm:flex-row">
              {b.image && <div className="sm:w-48 h-32 sm:h-auto shrink-0 bg-[var(--bg-elevated)]"><img src={b.image} alt={b.title} className="w-full h-full object-cover" /></div>}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">{b.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{b.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-600/10 text-primary-400">{b.date}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)]">{b.content.length} blocks</span>
                    </div>
                    {b.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {b.tags.slice(0, 3).map((t, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)]">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setEditing(b); setForm({ title: b.title, excerpt: b.excerpt, date: b.date, image: b.image ?? '', tags: b.tags, content: b.content, slug: b.slug }); setDialogOpen(true) }} className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] text-primary-400"><MdEdit className="w-4 h-4" /></button>
                    <button onClick={() => { setDeleting(b); setDeleteOpen(true) }} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"><MdDelete className="w-4 h-4" /></button>
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
        title={editing ? 'Edit Blog Post' : 'Add Blog Post'}
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
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Date</label><input value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} placeholder="Jun 2025" className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Image URL</label><input value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Excerpt</label><textarea value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} rows={2} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30 resize-y" /></div>
          <JsonArrayField value={form.tags} onChange={v => setForm(f => ({...f, tags: v}))} label="Tags" />

          {/* Content Blocks Editor */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Content Blocks</label>
            <div className="space-y-3">
              {form.content.map((block, i) => (
                <div key={i} className="bg-[var(--glass-bg)] backdrop-blur-sm border border-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase bg-[var(--bg-elevated)] px-2 py-0.5 rounded">{block.type}</span>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => moveContentBlock(i, 'up')} disabled={i === 0} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30 text-xs px-1">↑</button>
                        <button type="button" onClick={() => moveContentBlock(i, 'down')} disabled={i === form.content.length - 1} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30 text-xs px-1">↓</button>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeContentBlock(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                  </div>
                  {block.type === 'paragraph' && (
                    <textarea value={block.text} onChange={(e) => updateContentBlock(i, { text: e.target.value })} rows={3} placeholder="Write paragraph text..." className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 resize-y" />
                  )}
                  {block.type === 'code' && (
                    <div className="space-y-2">
                      <input value={block.language} onChange={(e) => updateContentBlock(i, { language: e.target.value })} placeholder="Language (javascript, python...)" className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50" />
                      <textarea value={block.code} onChange={(e) => updateContentBlock(i, { code: e.target.value })} rows={5} placeholder="Paste code here..." className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded text-sm text-[var(--text-primary)] font-mono placeholder:text-[var(--text-muted)] placeholder:opacity-50 resize-y" />
                    </div>
                  )}
                  {block.type === 'image' && (
                    <div className="space-y-2">
                      <input value={block.src} onChange={(e) => updateContentBlock(i, { src: e.target.value })} placeholder="Image URL" className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50" />
                      <div className="grid grid-cols-2 gap-2">
                        <input value={block.alt} onChange={(e) => updateContentBlock(i, { alt: e.target.value })} placeholder="Alt text" className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50" />
                        <input value={block.caption ?? ''} onChange={(e) => updateContentBlock(i, { caption: e.target.value })} placeholder="Caption (optional)" className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50" />
                      </div>
                      {block.src && <img src={block.src} alt={block.alt} className="w-full h-32 object-cover rounded" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button type="button" onClick={() => addContentBlock('paragraph')} className="px-3 py-1.5 bg-primary-600/10 text-primary-400 rounded-lg text-xs font-medium hover:bg-primary-600/20 transition-colors">+ Paragraph</button>
              <button type="button" onClick={() => addContentBlock('code')} className="px-3 py-1.5 bg-green-600/10 text-green-400 rounded-lg text-xs font-medium hover:bg-green-600/20 transition-colors">+ Code Block</button>
              <button type="button" onClick={() => addContentBlock('image')} className="px-3 py-1.5 bg-purple-600/10 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-600/20 transition-colors">+ Image</button>
            </div>
          </div>
        </div>
      </FormDialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => deleting && del.mutate(deleting.id)} title="Blog Post" loading={del.isPending} />
    </div>
  )
}
