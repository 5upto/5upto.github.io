import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
  label?: string
}

export default function ImagePicker({ value, onChange, bucket = 'logos', label = 'Image' }: ImagePickerProps) {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [tab, setTab] = useState<'upload' | 'browse'>('upload')
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

  useEffect(() => { loadImages() }, [bucket])

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

  return (
    <div>
      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">{label}</label>

      {/* Current selection */}
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

      {/* Two options side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Upload option */}
        <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-500/5 transition-colors">
          <svg className="w-5 h-5 text-[var(--text-muted)] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          <span className="text-xs text-[var(--text-muted)]">{uploading ? 'Uploading...' : 'Upload New'}</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>

        {/* Browse existing */}
        <button type="button" onClick={() => { setTab('browse'); loadImages() }}
          className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-[var(--border)] rounded-xl hover:border-primary-500 hover:bg-primary-500/5 transition-colors">
          <svg className="w-5 h-5 text-[var(--text-muted)] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-xs text-[var(--text-muted)]">From Storage ({images.length})</span>
        </button>
      </div>

      {/* Storage images grid - only show when browsing */}
      {tab === 'browse' && (
        <div className="mt-3">
          {loading ? (
            <div className="text-xs text-[var(--text-muted)] py-3 text-center">Loading...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-4 text-xs text-[var(--text-muted)]">No images in {bucket} bucket</div>
          ) : (
            <>
              <p className="text-[10px] text-[var(--text-muted)] mb-1.5">Select from {bucket} bucket</p>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-36 overflow-y-auto">
                {images.map((url, i) => (
                  <button key={i} type="button" onClick={() => onChange(url)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${value === url ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-transparent hover:border-[var(--border)]'}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
