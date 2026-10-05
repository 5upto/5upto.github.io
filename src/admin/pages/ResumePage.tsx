import { useEffect, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MdCheckCircle, MdDelete, MdDescription, MdEdit, MdHistory, MdOpenInNew, MdUploadFile } from 'react-icons/md'
import { supabase } from '../../lib/supabase'
import type { Resume } from '../../types/database'
import FormDialog from '../components/FormDialog'
import DeleteDialog from '../components/DeleteDialog'
import Toast from '../components/Toast'

const BUCKET = 'resumes'
const MAX_BYTES = 10 * 1024 * 1024

// Stable identity so the default below does not create a new array
// on every render and re-trigger the preview-selection effect.
const NO_RESUMES: Resume[] = []

function formatBytes(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ResumePage() {
  const qc = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Resume | null>(null)
  const [form, setForm] = useState({ label: '', note: '' })
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState<Resume | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [dragging, setDragging] = useState(false)

  const { data: rows = NO_RESUMES, isLoading } = useQuery({
    queryKey: ['admin-resumes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('resumes').select('*').order('version', { ascending: false })
      if (error) throw error
      return data as Resume[]
    },
  })

  // Default the preview to the live version, then to the newest upload.
  useEffect(() => {
    if (!rows.length) { setSelectedId(null); return }
    setSelectedId(prev => (prev && rows.some(r => r.id === prev) ? prev : (rows.find(r => r.is_live) ?? rows[0]).id))
  }, [rows])

  const selected = rows.find(r => r.id === selectedId) ?? null
  const live = rows.find(r => r.is_live) ?? null

  const upload = useMutation({
    mutationFn: async (file: File) => {
      if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
        throw new Error('Only PDF files are allowed')
      }
      if (file.size > MAX_BYTES) {
        throw new Error(`File is ${formatBytes(file.size)}. The limit is ${formatBytes(MAX_BYTES)}.`)
      }

      const storagePath = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
        contentType: 'application/pdf',
      })
      if (upErr) throw upErr

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
      const nextVersion = (rows.reduce((max, r) => Math.max(max, r.version ?? 0), 0) || 0) + 1

      const row = {
        label: file.name.replace(/\.pdf$/i, ''),
        version: nextVersion,
        // The very first upload goes live automatically so the hero button works.
        is_live: rows.length === 0,
        file_url: urlData.publicUrl,
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        note: null as string | null,
      }

      const { data, error } = await supabase.from('resumes').insert(row).select().single()
      if (error) {
        // Don't leave an orphaned file behind if the row fails to insert.
        await supabase.storage.from(BUCKET).remove([storagePath])
        throw error
      }
      return data as Resume
    },
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: ['admin-resumes'] })
      qc.invalidateQueries({ queryKey: ['live-resume'] })
      setSelectedId(row.id)
      setToast({ message: `Uploaded as version ${row.version}`, type: 'success' })
    },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  // Two statements rather than one so there is never more than one live row.
  const setLive = useMutation({
    mutationFn: async (id: string) => {
      const { error: offErr } = await supabase.from('resumes').update({ is_live: false }).neq('id', id)
      if (offErr) throw offErr
      const { error: onErr } = await supabase.from('resumes').update({ is_live: true }).eq('id', id)
      if (onErr) throw onErr
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-resumes'] })
      qc.invalidateQueries({ queryKey: ['live-resume'] })
      setToast({ message: 'Live resume updated', type: 'success' })
    },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const save = useMutation({
    mutationFn: async () => {
      if (!editing) throw new Error('Nothing selected')
      const { error } = await supabase.from('resumes').update({ label: form.label, note: form.note || null }).eq('id', editing.id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-resumes'] })
      setEditOpen(false)
      setEditing(null)
      setToast({ message: 'Updated', type: 'success' })
    },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const del = useMutation({
    mutationFn: async (r: Resume) => {
      const { error } = await supabase.from('resumes').delete().eq('id', r.id)
      if (error) throw error
      // Best effort: a missing file must not block the row from being gone.
      await supabase.storage.from(BUCKET).remove([r.storage_path])
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-resumes'] })
      qc.invalidateQueries({ queryKey: ['live-resume'] })
      setDeleteOpen(false)
      setDeleting(null)
      setToast({ message: 'Deleted', type: 'success' })
    },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const onPick = (file: File | undefined) => {
    if (file) upload.mutate(file)
  }

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Resume</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {rows.length} version{rows.length === 1 ? '' : 's'}
            {live ? ` · live: ${live.label}` : ' · nothing live yet'}
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={upload.isPending}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25"
        >
          {upload.isPending ? 'Uploading...' : '+ Upload PDF'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={e => { onPick(e.target.files?.[0]); e.target.value = '' }}
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={e => {
          // Ignore leave events fired while moving onto a child element,
          // otherwise the highlight flickers as the pointer crosses the icon.
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
        }}
        onDrop={e => { e.preventDefault(); setDragging(false); onPick(e.dataTransfer.files?.[0]) }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
          dragging ? 'border-primary-500 bg-primary-600/10' : 'border-[var(--border)] hover:border-primary-500/40'
        }`}
      >
        <MdUploadFile className="w-7 h-7 text-[var(--text-muted)]" />
        <p className="text-sm text-[var(--text-secondary)]">
          {upload.isPending ? 'Uploading...' : 'Drop a PDF here or click to browse'}
        </p>
        <p className="text-xs text-[var(--text-muted)]">PDF only · up to {formatBytes(MAX_BYTES)}</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div>
      ) : !rows.length ? (
        <div className="text-center py-12 text-[var(--text-muted)]">No resumes uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] gap-5 items-start">
          {/* Version history */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              <MdHistory className="w-4 h-4" /> Version History
            </div>
            {rows.map(r => {
              const active = r.id === selectedId
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`p-3 rounded-xl border backdrop-blur-xl cursor-pointer transition-all ${
                    active
                      ? 'border-primary-500/60 bg-primary-600/10'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-primary-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] font-mono">
                          v{r.version}
                        </span>
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{r.label}</p>
                        {r.is_live && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-500 font-medium">
                            <MdCheckCircle className="w-3 h-3" /> Live
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1 truncate">{r.file_name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {formatDate(r.created_at)}{r.file_size ? ` · ${formatBytes(r.file_size)}` : ''}
                      </p>
                      {r.note && <p className="text-[11px] text-[var(--text-secondary)] mt-1 italic">{r.note}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); setEditing(r); setForm({ label: r.label, note: r.note ?? '' }); setEditOpen(true) }}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-primary-400"
                        aria-label={`Edit ${r.label}`}
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setDeleting(r); setDeleteOpen(true) }}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"
                        aria-label={`Delete ${r.label}`}
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Side by side preview */}
          <div className="space-y-3 lg:sticky lg:top-4">
            {selected ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-[var(--text-primary)] truncate">{selected.label}</h2>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      v{selected.version} · {formatDate(selected.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={selected.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] hover:border-primary-500 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <MdOpenInNew className="w-3.5 h-3.5" /> Open
                    </a>
                    <button
                      onClick={() => setLive.mutate(selected.id)}
                      disabled={selected.is_live || setLive.isPending}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      <MdCheckCircle className="w-3.5 h-3.5" /> {selected.is_live ? 'Live' : 'Set Live'}
                    </button>
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--glass-border)] overflow-hidden bg-white">
                  <iframe
                    key={selected.id}
                    src={selected.file_url}
                    title={`Preview of ${selected.label}`}
                    className="w-full h-[60vh] lg:h-[calc(100dvh-16rem)] min-h-[420px]"
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-20 text-[var(--text-muted)]">
                <MdDescription className="w-8 h-8" />
                <p className="text-sm">Select a version to preview</p>
              </div>
            )}
          </div>
        </div>
      )}

      <FormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Resume Details"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setEditOpen(false)} className="px-4 py-2 text-sm text-[var(--text-muted)]">Cancel</button>
            <button
              onClick={() => save.mutate()}
              disabled={save.isPending || !form.label.trim()}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium"
            >
              {save.isPending ? 'Saving...' : 'Update'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Label *</label>
            <input
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Version Note</label>
            <textarea
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              rows={3}
              placeholder="What changed in this version?"
              className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500/30 resize-y"
            />
          </div>
          {editing && (
            <p className="text-xs text-[var(--text-muted)]">
              Uploading a new file creates a new version. This dialog only renames the existing one.
            </p>
          )}
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleting && del.mutate(deleting)}
        title={`version ${deleting?.version} (${deleting?.label})`}
        loading={del.isPending}
      />
    </div>
  )
}
