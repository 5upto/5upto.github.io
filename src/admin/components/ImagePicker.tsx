import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
  label?: string
  compact?: boolean
}

export default function ImagePicker({ value, onChange, bucket = 'logos', label = 'Image', compact }: ImagePickerProps) {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [browseOpen, setBrowseOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadImages = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: listError } = await supabase.storage.from(bucket).list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
      if (listError) {
        setError(`Cannot list files: ${listError.message}`)
        setLoading(false)
        return
      }
      if (data) {
        const urls = data
          .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f.name))
          .map(f => {
            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(f.name)
            return urlData.publicUrl
          })
        setImages(urls)
      }
    } catch (e: any) {
      setError(`Error: ${e.message}`)
    }
    setLoading(false)
  }

  useEffect(() => { if (browseOpen) loadImages() }, [bucket, browseOpen])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file)
    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`)
    } else {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName)
      onChange(urlData.publicUrl)
      await loadImages()
    }
    setUploading(false)
    e.target.value = ''
  }

  const selectImage = (url: string) => {
    onChange(url)
    setBrowseOpen(false)
  }

  if (compact) {
    return (
      <div>
        <div className="flex items-center gap-2">
          {value && (
            <img src={value} alt="Selected" className="w-10 h-10 object-cover rounded-lg shrink-0 border border-[var(--border)]" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}} />
          )}
          <label className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-500/5 transition-colors shrink-0">
            <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <span className="text-[10px] text-[var(--text-muted)]">{uploading ? '...' : 'Upload'}</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
          <button type="button" onClick={() => setBrowseOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-[var(--border)] rounded-lg hover:border-primary-500 hover:bg-primary-500/5 transition-colors shrink-0">
            <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-[10px] text-[var(--text-muted)]">Storage</span>
          </button>
          {value && <button type="button" onClick={() => onChange('')} className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded shrink-0"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
        </div>
        {error && <div className="mt-1.5 text-[10px] text-red-400">{error}</div>}
        <StorageModal open={browseOpen} onClose={() => setBrowseOpen(false)} images={images} loading={loading} error={error} onSelect={selectImage} bucket={bucket} onRefresh={loadImages} />
      </div>
    )
  }

  return (
    <div>
      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">{label}</label>

      {value && (
        <div className="mb-3 flex items-center gap-3 p-2 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]">
          <img src={value} alt="Selected" className="w-12 h-12 object-cover rounded-lg shrink-0" onError={(e) => {(e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>'}} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--text-muted)] truncate">{value.split('/').pop()}</p>
          </div>
          <button type="button" onClick={() => onChange('')} className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {error && <div className="mb-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</div>}

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-500/5 transition-colors">
          <svg className="w-5 h-5 text-[var(--text-muted)] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          <span className="text-xs text-[var(--text-muted)]">{uploading ? 'Uploading...' : 'Upload New'}</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>

        <button type="button" onClick={() => setBrowseOpen(true)}
          className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-[var(--border)] rounded-xl hover:border-primary-500 hover:bg-primary-500/5 transition-colors">
          <svg className="w-5 h-5 text-[var(--text-muted)] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-xs text-[var(--text-muted)]">From Storage</span>
        </button>
      </div>

      <StorageModal open={browseOpen} onClose={() => setBrowseOpen(false)} images={images} loading={loading} error={error} onSelect={selectImage} bucket={bucket} onRefresh={loadImages} />
    </div>
  )
}

function StorageModal({ open, onClose, images, loading, error, onSelect, bucket, onRefresh }: {
  open: boolean
  onClose: () => void
  images: string[]
  loading: boolean
  error: string
  onSelect: (url: string) => void
  bucket: string
  onRefresh: () => void
}) {
  const [selected, setSelected] = useState('')

  useEffect(() => { if (!open) setSelected('') }, [open])

  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      if (scrollY) window.scrollTo(0, -parseInt(scrollY || '0'))
    }
    return () => {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      if (scrollY) window.scrollTo(0, -parseInt(scrollY || '0'))
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[200] flex items-center justify-center" style={{ height: '100dvh' }}>
      <div className="fixed inset-0 bg-black/60 touch-none" onClick={onClose} />
      <div className="relative w-[calc(100%-2rem)] max-w-lg max-h-[80dvh] bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Storage — {bucket}</h3>
            <span className="text-[10px] text-[var(--text-muted)]">{images.length} images</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onRefresh} className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Refresh">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto overscroll-contain flex-1">
          {loading ? (
            <div className="text-xs text-[var(--text-muted)] py-8 text-center">Loading images...</div>
          ) : error ? (
            <div className="text-xs text-red-400 py-8 text-center">{error}</div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">No images in {bucket} bucket</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {images.map((url, i) => (
                <button key={i} type="button" onClick={() => setSelected(url)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${selected === url ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-transparent hover:border-[var(--border)]'}`}>
                  <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-[var(--border)] flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">Cancel</button>
          <button onClick={() => { if (selected) onSelect(selected) }} disabled={!selected}
            className="px-5 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white rounded-xl text-xs font-medium transition-all">
            Select
          </button>
        </div>
      </div>
    </div>
  )
}
