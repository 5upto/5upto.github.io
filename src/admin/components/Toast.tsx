import { useEffect } from 'react'
import { MdCheck, MdClose } from 'react-icons/md'

interface ToastProps {
  message: string | undefined
  type: 'success' | 'error' | undefined
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <div className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 ${
      type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? (
          <MdCheck className="w-4 h-4" />
        ) : (
          <MdClose className="w-4 h-4" />
        )}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
      </div>
    </div>
  )
}
