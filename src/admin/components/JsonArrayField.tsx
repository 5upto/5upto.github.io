import { useState } from 'react'

interface JsonArrayFieldProps {
  value: string[]
  onChange: (value: string[]) => void
  label: string
  placeholder?: string
}

export default function JsonArrayField({ value, onChange, label, placeholder }: JsonArrayFieldProps) {
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...value, newItem.trim()])
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, newValue: string) => {
    const updated = [...value]
    updated[index] = newValue
    onChange(updated)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{label}</label>
      <div className="space-y-2 mb-3">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:outline-none focus:border-primary-500"
            />
            <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300 px-2">✕</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
          placeholder={placeholder || `Add ${label.toLowerCase()}...`}
          className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:outline-none focus:border-primary-500"
        />
        <button type="button" onClick={addItem} className="px-3 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm transition-colors">Add</button>
      </div>
    </div>
  )
}
