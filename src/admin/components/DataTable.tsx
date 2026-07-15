interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  onAdd: () => void
}

export default function DataTable<T extends { id: string }>({ data, columns, onEdit, onDelete, onAdd }: DataTableProps<T>) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <p className="text-sm text-[var(--text-muted)]">{data.length} items</p>
        <button onClick={onAdd} className="w-full sm:w-auto px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors text-center">
          + Add New
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-4 py-3 text-[var(--text-muted)] font-medium">{col.label}</th>
                ))}
                <th className="text-right px-4 py-3 text-[var(--text-muted)] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)] transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-[var(--text-secondary)]">
                      {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onEdit(item)} className="text-primary-400 hover:text-primary-300 text-xs mr-3">Edit</button>
                    <button onClick={() => onDelete(item)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {data.map((item) => (
          <div key={item.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            {columns.slice(0, 2).map((col) => (
              <div key={col.key} className="mb-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{col.label}: </span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                </span>
              </div>
            ))}
            {columns.length > 2 && (
              <div className="mt-2 text-xs text-[var(--text-muted)]">
                {columns.slice(2, 4).map((col) => (
                  <span key={col.key} className="mr-3">{col.label}: {String((item as any)[col.key] ?? '').slice(0, 30)}</span>
                ))}
              </div>
            )}
            <div className="flex gap-3 mt-3 pt-3 border-t border-[var(--border)]">
              <button onClick={() => onEdit(item)} className="flex-1 py-2 text-sm text-primary-400 hover:bg-primary-600/10 rounded-lg transition-colors text-center font-medium">Edit</button>
              <button onClick={() => onDelete(item)} className="flex-1 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-center font-medium">Delete</button>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">No items found</div>
        )}
      </div>
    </div>
  )
}
