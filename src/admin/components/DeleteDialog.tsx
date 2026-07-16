import { useEffect } from 'react'

interface DeleteDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  loading?: boolean
}

export default function DeleteDialog({ open, onClose, onConfirm, title, loading }: DeleteDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center" style={{ height: '100dvh' }}>
      <div className="fixed inset-0 bg-black/60 touch-none" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--border)] rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-display font-bold text-[var(--text-primary)] mb-2">Delete {title}</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
