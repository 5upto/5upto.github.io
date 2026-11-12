import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { MdCloudUpload, MdImage, MdClose, MdStar } from 'react-icons/md'
import { StorageModal } from './ImagePicker'

interface MultiImagePickerProps {
  photos: string[]
  cover: string
  onChange: (photos: string[]) => void
  onCoverChange: (cover: string) => void
  bucket?: string
  label?: string
}

export default function MultiImagePicker({
  photos,
  cover,
  onChange,
  onCoverChange,
  bucket = 'gallery',
  label = 'Photos',
}: MultiImagePickerProps) {
  const [uploading, setUploading] = useState(false)
  const [browseOpen, setBrowseOpen] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadImages = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: listError } = await supabase.storage
        .from(bucket)
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
      if (listError) {
        setError(`Cannot list files: ${listError.message}`)
        return
      }
      setImages((data ?? [])
        .filter((file) => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(file.name))
        .map((file) => supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl))
    } catch (e: any) {
      setError(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (browseOpen) loadImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browseOpen, bucket])

  const addPhotos = (urls: string[]) => {
    const next = Array.from(new Set([...photos, ...urls.filter(Boolean)]))
    onChange(next)
    if (!cover && next[0]) onCoverChange(next[0])
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    setUploading(true)
    setError('')
    const uploaded: string[] = []

    for (const file of files) {
      const unique = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const fileName = `${unique}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file)
      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`)
        continue
      }
      uploaded.push(supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl)
    }

    if (uploaded.length) addPhotos(uploaded)
    setUploading(false)
    event.target.value = ''
  }

  const removePhoto = (url: string) => {
    const next = photos.filter((photo) => photo !== url)
    onChange(next)
    if (cover === url) onCoverChange(next[0] ?? '')
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{label}</label>
        {photos.length > 0 && <span className="text-[10px] text-[var(--text-muted)]">{photos.length} photo{photos.length === 1 ? '' : 's'}</span>}
      </div>

      <p className="text-[11px] text-[var(--text-muted)] mb-3">
        Upload one or more photos. The starred cover is used in the circular gallery and at the top of the story page.
      </p>

      {error && <div className="mb-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</div>}

      {photos.length === 0 ? (
        <div className="mb-3 flex flex-col items-center justify-center h-28 border-2 border-dashed border-[var(--border)] rounded-xl text-center">
          <MdImage className="w-6 h-6 text-[var(--text-muted)] mb-1.5" />
          <span className="text-xs text-[var(--text-muted)]">No photos yet</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {photos.map((photo) => {
            const isCover = photo === cover
            return (
              <div
                key={photo}
                className={`group relative aspect-[4/3] overflow-hidden rounded-xl border-2 bg-[var(--bg-elevated)] transition-all ${isCover ? 'border-primary-500 ring-2 ring-primary-500/25' : 'border-[var(--border)]'}`}
              >
                <img src={photo} alt="" className="h-full w-full object-cover" />
                {isCover && (
                  <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-medium text-white shadow-lg">
                    <MdStar className="h-3 w-3" /> Cover
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-black/65 p-1.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                  {!isCover && (
                    <button
                      type="button"
                      onClick={() => onCoverChange(photo)}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-white hover:bg-white/15"
                    >
                      <MdStar className="h-3 w-3" /> Set cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(photo)}
                    className="rounded-md p-1 text-red-300 hover:bg-red-500/20 hover:text-red-200"
                    title="Remove photo"
                  >
                    <MdClose className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-500/5 transition-colors">
          <MdCloudUpload className="w-5 h-5 text-[var(--text-muted)] mb-1" />
          <span className="text-xs text-[var(--text-muted)]">{uploading ? 'Uploading...' : 'Upload Photos'}</span>
          <input type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} disabled={uploading} />
        </label>

        <button
          type="button"
          onClick={() => setBrowseOpen(true)}
          className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-[var(--border)] rounded-xl hover:border-primary-500 hover:bg-primary-500/5 transition-colors"
        >
          <MdImage className="w-5 h-5 text-[var(--text-muted)] mb-1" />
          <span className="text-xs text-[var(--text-muted)]">From Storage</span>
        </button>
      </div>

      <StorageModal
        open={browseOpen}
        onClose={() => setBrowseOpen(false)}
        images={images}
        loading={loading}
        error={error}
        onSelect={(url) => {
          addPhotos([url])
          setBrowseOpen(false)
        }}
        bucket={bucket}
        onRefresh={loadImages}
      />
    </div>
  )
}
