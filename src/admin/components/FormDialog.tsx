import { useEffect } from 'react'

interface FormDialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function FormDialog({ open, onClose, title, children }: FormDialogProps) {
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
    <div className="fixed inset-x-0 top-0 z-[100] flex items-end sm:items-center justify-center" style={{ height: '100dvh' }}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 touch-none" onClick={onClose} onAuxClick={onClose} />
      {/* Modal */}
      <div className="relative w-full sm:max-w-2xl max-h-[90dvh] sm:max-h-[85vh] bg-white dark:bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--border)] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border)] shrink-0">
          <h2 className="text-base sm:text-lg font-display font-bold text-[var(--text-primary)] truncate pr-2">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
