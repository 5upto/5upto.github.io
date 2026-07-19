import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Toast from '../components/Toast'
import { MdCloudUpload, MdImage } from 'react-icons/md'

const buckets = ['avatars', 'logos', 'projects', 'gallery', 'blogs']

export default function StoragePage() {
  const [uploading, setUploading] = useState(false)
  const [selectedBucket, setSelectedBucket] = useState('logos')
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const listFiles = async () => {
    setLoading(true)
    const { data, error } = await supabase.storage.from(selectedBucket).list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setFiles(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { listFiles() }, [selectedBucket])

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { error } = await supabase.storage.from(selectedBucket).upload(fileName, file)
    setUploading(false)
    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setToast({ message: 'File uploaded', type: 'success' })
      listFiles()
    }
    e.target.value = ''
  }

  const deleteFile = async (name: string) => {
    const { error } = await supabase.storage.from(selectedBucket).remove([name])
    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setToast({ message: 'File deleted', type: 'success' })
      listFiles()
    }
  }

  const getUrl = (name: string) => {
    const { data } = supabase.storage.from(selectedBucket).getPublicUrl(name)
    return data.publicUrl
  }

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name)

  const images = files.filter(f => isImage(f.name))
  const otherFiles = files.filter(f => !isImage(f.name))

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div>
        <h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Storage</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Manage uploaded images and files</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select value={selectedBucket} onChange={(e) => setSelectedBucket(e.target.value)}
          className="px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/30">
          {buckets.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <label className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium cursor-pointer transition-all hover:shadow-lg hover:shadow-primary-500/25">
          <MdCloudUpload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" className="hidden" accept="image/*" onChange={uploadFile} disabled={uploading} />
        </label>
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="text-center py-12 text-[var(--text-muted)] text-sm">Loading files...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl">
          <MdImage className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No images in {selectedBucket}</p>
        </div>
      ) : (
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-3">{images.length} images</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 lg:gap-3">
            {images.map((file) => {
              const url = getUrl(file.name)
              return (
                <div key={file.name} className="group relative aspect-square bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl overflow-hidden hover:border-primary-500/50 hover:shadow-lg transition-all">
                  <img src={url} alt={file.name} className="w-full h-full object-cover" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white truncate mb-1">{file.name.split('-').slice(1).join('-')}</p>
                    <div className="flex gap-1">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-1 bg-white/20 backdrop-blur-sm rounded text-[10px] text-white hover:bg-white/30">View</a>
                      <button onClick={() => deleteFile(file.name)} className="flex-1 text-center py-1 bg-red-500/50 backdrop-blur-sm rounded text-[10px] text-white hover:bg-red-500/70">Delete</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Other files */}
      {otherFiles.length > 0 && (
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-3">{otherFiles.length} other files</p>
          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[var(--border)]"><th className="text-left px-4 py-3 text-[var(--text-muted)]">Name</th><th className="text-right px-4 py-3 text-[var(--text-muted)]">Action</th></tr></thead>
              <tbody>
                {otherFiles.map((f) => (
                  <tr key={f.name} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)]">
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{f.name}</td>
                    <td className="px-4 py-3 text-right"><button onClick={() => deleteFile(f.name)} className="text-red-400 hover:text-red-300 text-xs">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
