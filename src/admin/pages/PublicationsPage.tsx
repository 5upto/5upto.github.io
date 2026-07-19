import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { sortByDate } from '../../lib/sortByDate'
import type { Publication } from '../../types/database'
import FormDialog from '../components/FormDialog'
import DeleteDialog from '../components/DeleteDialog'
import Toast from '../components/Toast'
import { publisherIcons } from '../../components/PublisherIcons'
import { MdDelete } from 'react-icons/md'

const pubFormats = [
  { name: 'IEEE', color: '#006699', icon: publisherIcons.IEEE },
  { name: 'Springer', color: '#C41230', icon: publisherIcons.Springer },
  { name: 'Elsevier', color: '#FF6C00', icon: publisherIcons.Elsevier },
  { name: 'ACM', color: '#007398', icon: publisherIcons.ACM },
  { name: 'Wiley', color: '#003B5C', icon: publisherIcons.Wiley },
  { name: 'MDPI', color: '#89B842', icon: publisherIcons.MDPI },
  { name: 'Preprint', color: '#8B5CF6', icon: publisherIcons.Preprint },
  { name: 'Other', color: '#6B7280', icon: publisherIcons.Other },
]

function PublisherIcon({ format, size = 24 }: { format: string; size?: number }) {
  const fmt = pubFormats.find(f => f.name === format)
  if (!fmt || !fmt.icon) return null
  const Icon = fmt.icon
  return <Icon size={size} style={{ color: fmt.color }} />
}

const empty = { format: 'IEEE', title: '', authors: [] as { name: string; affil: number }[], affiliations: [] as string[], conference: '', location: '', date: '', doi: '', pages: '', keywords: [] as string[], abstract: '', url: '' }

export default function PublicationsPage() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<Publication | null>(null)
  const [deleting, setDeleting] = useState<Publication | null>(null)
  const [form, setForm] = useState(empty)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [authorInput, setAuthorInput] = useState('')
  const [affilInput, setAffilInput] = useState('')
  const [keywordInput, setKeywordInput] = useState('')
  const [fetchingDOI, setFetchingDOI] = useState(false)
  const [doiInput, setDoiInput] = useState('')

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-publications'],
    queryFn: async () => { const { data, error } = await supabase.from('publications').select('*'); if (error) throw error; return sortByDate(data as Publication[], 'date') },
  })

  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      const pubData = { title: d.title, publisher: d.format, authors: d.authors, affiliations: d.affiliations, conference: d.conference || `${d.format} Publication`, location: d.location, date: d.date, doi: d.doi, pages: d.pages, keywords: d.keywords, abstract: d.abstract, url: d.url }
      if (editing) { const { error } = await supabase.from('publications').update(pubData).eq('id', editing.id); if (error) throw error }
      else { const { error } = await supabase.from('publications').insert(pubData); if (error) throw error }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-publications'] }); setDialogOpen(false); setEditing(null); setToast({ message: editing ? 'Updated' : 'Added', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('publications').delete().eq('id', id); if (error) throw error },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-publications'] }); setDeleteOpen(false); setDeleting(null); setToast({ message: 'Deleted', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const fetchFromDOI = async (doi: string) => {
    if (!doi.trim()) return
    setFetchingDOI(true)
    try {
      const cleanDoi = doi.replace(/^https?:\/\/doi\.org\//, '').trim()

      // Try Semantic Scholar first (better abstract coverage)
      let title = '', authors: { name: string; affil: number }[] = [], affiliations: string[] = []
      let conference = '', publisher = '', date = '', pages = '', keywords: string[] = [], abstract = '', url = ''
      let detectedFormat = 'Other'

      try {
        const ssRes = await fetch(`https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(cleanDoi)}?fields=title,abstract,authors,venue,year,externalIds,journal`)
        if (ssRes.ok) {
          const ssData = await ssRes.json()
          title = ssData.title || ''
          abstract = ssData.abstract || ''
          conference = ssData.venue || ''
          date = ssData.year ? String(ssData.year) : ''
          if (ssData.journal?.name) conference = ssData.journal.name
          if (ssData.externalIds?.Url) url = ssData.externalIds.Url
        }
      } catch {}

      // Fallback to CrossRef for more metadata
      const crRes = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`)
      if (!crRes.ok && !title) throw new Error('DOI not found')
      if (crRes.ok) {
        const crData = await crRes.json()
        const work = crData.message
        if (!title) title = work.title?.[0] || ''
        if (!authors.length) {
          authors = (work.author || []).map((a: any) => ({
            name: `${a.given || ''} ${a.family || ''}`.trim(),
            affil: 1,
          }))
        }
        if (!affiliations.length) {
          const rawAffils = (work.author || []).flatMap((a: any) =>
            (a.affiliation || []).map((af: any) => String(af.name || af))
          ) as string[]
          affiliations = [...new Set(rawAffils)]
        }
        if (!conference) conference = work['container-title']?.[0] || ''
        publisher = work.publisher || ''
        if (!date) {
          const dateParts = work['published-print']?.['date-parts']?.[0] || work['published-online']?.['date-parts']?.[0] || []
          date = dateParts.length >= 3 ? `${dateParts[0]}-${String(dateParts[1]).padStart(2, '0')}-${String(dateParts[2]).padStart(2, '0')}` : dateParts.length >= 2 ? `${dateParts[0]}-${String(dateParts[1]).padStart(2, '0')}` : `${dateParts[0] || ''}`
        }
        if (!pages) pages = work.page || ''
        if (!keywords.length) keywords = (work.keyword || work.subject || []).map((k: any) => String(k))
        if (!abstract) abstract = (work.abstract || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim()
        if (!url) url = work.URL || `https://doi.org/${cleanDoi}`
      }

      // Auto-detect publisher format
      const publisherLower = (publisher + ' ' + conference).toLowerCase()
      if (publisherLower.includes('ieee') || conference.toLowerCase().includes('ieee')) detectedFormat = 'IEEE'
      else if (publisherLower.includes('springer') || publisherLower.includes('lncs')) detectedFormat = 'Springer'
      else if (publisherLower.includes('elsevier')) detectedFormat = 'Elsevier'
      else if (publisherLower.includes('acm')) detectedFormat = 'ACM'
      else if (publisherLower.includes('wiley')) detectedFormat = 'Wiley'
      else if (publisherLower.includes('mdpi')) detectedFormat = 'MDPI'
      else if (publisherLower.includes('arxiv') || publisherLower.includes('preprint')) detectedFormat = 'Preprint'

      setForm(f => ({
        ...f,
        format: detectedFormat,
        title,
        authors: authors.length > 0 ? authors : f.authors,
        affiliations: affiliations.length > 0 ? affiliations : f.affiliations,
        conference: conference || f.conference,
        date: date || f.date,
        doi: cleanDoi,
        pages: pages || f.pages,
        keywords: keywords.length > 0 ? keywords : f.keywords,
        abstract: abstract || f.abstract,
        url,
      }))
      setToast({ message: `Fetched: ${title.substring(0, 60)}${title.length > 60 ? '...' : ''}`, type: 'success' })
    } catch (e: any) {
      setToast({ message: `DOI fetch failed: ${e.message}`, type: 'error' })
    }
    setFetchingDOI(false)
  }

  const openAdd = () => { setEditing(null); setForm(empty); setDoiInput(''); setDialogOpen(true) }
  const openEdit = (p: Publication) => {
    const fmt = pubFormats.find(f => f.name === p.publisher) || pubFormats.find(f => p.conference?.includes(f.name)) || pubFormats[0]
    setForm({ format: fmt.name, title: p.title, authors: p.authors, affiliations: p.affiliations, conference: p.conference, location: p.location, date: p.date, doi: p.doi, pages: p.pages, keywords: p.keywords, abstract: p.abstract, url: p.url })
    setEditing(p); setDialogOpen(true)
  }

  const addAuthor = () => { if (authorInput.trim()) { setForm(f => ({...f, authors: [...f.authors, { name: authorInput.trim(), affil: f.authors.length + 1 }]})); setAuthorInput('') } }
  const addAffil = () => { if (affilInput.trim()) { setForm(f => ({...f, affiliations: [...f.affiliations, affilInput.trim()]})); setAffilInput('') } }
  const addKeyword = () => { if (keywordInput.trim()) { setForm(f => ({...f, keywords: [...f.keywords, keywordInput.trim()]})); setKeywordInput('') } }

  const selectedFormat = pubFormats.find(f => f.name === form.format) || pubFormats[0]

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Publications</h1><p className="text-sm text-[var(--text-muted)] mt-1">{items.length} publications</p></div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25">+ Add Publication</button>
      </div>

      <div className="space-y-3">
        {isLoading ? <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div> : items.map(p => {
          const fmt = pubFormats.find(f => f.name === p.publisher) || pubFormats.find(f => p.conference?.includes(f.name)) || pubFormats[0]
          return (
            <div key={p.id} className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl overflow-hidden hover:border-primary-500/30 transition-all group cursor-pointer" onClick={() => openEdit(p)}>
              <div className="h-1.5" style={{ background: fmt.color }} />
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${fmt.color}15` }}>
                    <PublisherIcon format={fmt.name} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: fmt.color }}>{fmt.name}</p>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mt-0.5 line-clamp-2">{p.title}</h3>
                    <p className="text-xs text-accent-400 mt-1">{p.conference}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.keywords.slice(0, 3).map((k, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)]">{k}</span>)}
                      {p.keywords.length > 3 && <span className="text-[10px] text-[var(--text-muted)]">+{p.keywords.length - 3}</span>}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setDeleting(p); setDeleteOpen(true) }} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-all shrink-0">
                    <MdDelete className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <FormDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        title={editing ? 'Edit Publication' : 'Add Publication'}
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 text-sm text-[var(--text-muted)]">Cancel</button>
            <button onClick={() => save.mutate(form)} disabled={save.isPending || !form.title} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium">{save.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* DOI Fetch */}
          {!editing && (
            <div className="bg-[var(--bg-elevated)] rounded-xl p-4">
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Quick Add via DOI</label>
              <div className="flex gap-2">
                <input value={doiInput} onChange={e => setDoiInput(e.target.value)} placeholder="10.1109/ICITIIT64777.2025.11040288"
                  className="flex-1 min-w-0 px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm" />
                <button type="button" onClick={() => fetchFromDOI(doiInput)} disabled={fetchingDOI || !doiInput.trim()}
                  className="shrink-0 px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium">
                  {fetchingDOI ? 'Fetching...' : 'Fetch'}
                </button>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] mt-1.5">Enter a DOI to auto-fill title, authors, conference, and more</p>
            </div>
          )}

          {/* Live Preview */}
          <div className="bg-[var(--bg-elevated)] rounded-xl overflow-hidden">
            <div className="h-1.5" style={{ background: selectedFormat.color }} />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <PublisherIcon format={form.format} size={24} />
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: selectedFormat.color }}>{form.format}</p>
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{form.title || 'Publication Title'}</h3>
              {form.authors.length > 0 && (
                <p className="text-xs text-accent-400 mt-1">{form.authors.map((a, i) => `${i > 0 ? ', ' : ''}${a.name}`).join('')}</p>
              )}
              {form.conference && <p className="text-[10px] text-[var(--text-muted)] mt-1">{form.conference}</p>}
              {form.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.keywords.map((k, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--text-muted)]">{k}</span>)}
                </div>
              )}
            </div>
          </div>

          {/* Publisher selector */}
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Publisher</label>
            <div className="grid grid-cols-4 gap-2">
              {pubFormats.map(f => (
                <button key={f.name} type="button" onClick={() => setForm(fm => ({...fm, format: f.name}))}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${form.format === f.name ? 'border-primary-500 bg-primary-500/10' : 'border-[var(--border)] hover:border-primary-500/30'}`}>
                  <PublisherIcon format={f.name} size={22} />
                  <span className="text-[9px] text-[var(--text-muted)]">{f.name}</span>
                </button>
              ))}
            </div></div>

          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Conference / Journal</label>
              <input value={form.conference} onChange={e => setForm(f => ({...f, conference: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Date</label>
              <input value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} placeholder="2025-02-21" className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Location</label>
              <input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">DOI</label>
              <input value={form.doi} onChange={e => setForm(f => ({...f, doi: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Pages</label>
              <input value={form.pages} onChange={e => setForm(f => ({...f, pages: e.target.value}))} placeholder="pp. 1-6" className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">URL</label>
              <input value={form.url} onChange={e => setForm(f => ({...f, url: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
          {/* Authors */}
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Authors</label>
            <div className="flex gap-2 mb-2"><input value={authorInput} onChange={e => setAuthorInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAuthor())} placeholder="Author name" className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50" /><button type="button" onClick={addAuthor} className="px-3 py-2 bg-primary-600 text-white rounded-lg text-xs">Add</button></div>
            <div className="flex flex-wrap gap-1">{form.authors.map((a, i) => <span key={i} className="text-xs px-2 py-1 bg-[var(--bg-elevated)] rounded-lg flex items-center gap-1">{a.name}<sup className="text-[9px] text-primary-400">{a.affil}</sup><button type="button" onClick={() => setForm(f => ({...f, authors: f.authors.filter((_, j) => j !== i)}))} className="text-red-400 ml-1">×</button></span>)}</div></div>
          {/* Affiliations */}
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Affiliations</label>
            <div className="flex gap-2 mb-2"><input value={affilInput} onChange={e => setAffilInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAffil())} placeholder="Institution" className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50" /><button type="button" onClick={addAffil} className="px-3 py-2 bg-primary-600 text-white rounded-lg text-xs">Add</button></div>
            <div className="flex flex-wrap gap-1">{form.affiliations.map((a, i) => <span key={i} className="text-xs px-2 py-1 bg-[var(--bg-elevated)] rounded-lg flex items-center gap-1"><sup className="text-[9px] text-primary-400">{i+1}</sup> {a}<button type="button" onClick={() => setForm(f => ({...f, affiliations: f.affiliations.filter((_, j) => j !== i)}))} className="text-red-400 ml-1">×</button></span>)}</div></div>
          {/* Keywords */}
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Keywords</label>
            <div className="flex gap-2 mb-2"><input value={keywordInput} onChange={e => setKeywordInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())} placeholder="Keyword" className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50" /><button type="button" onClick={addKeyword} className="px-3 py-2 bg-primary-600 text-white rounded-lg text-xs">Add</button></div>
            <div className="flex flex-wrap gap-1">{form.keywords.map((k, i) => <span key={i} className="text-xs px-2 py-1 bg-primary-600/10 text-primary-400 rounded-lg flex items-center gap-1">{k}<button type="button" onClick={() => setForm(f => ({...f, keywords: f.keywords.filter((_, j) => j !== i)}))} className="text-red-400 ml-1">×</button></span>)}</div></div>
        </div>
      </FormDialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => deleting && del.mutate(deleting.id)} title="Publication" loading={del.isPending} />
    </div>
  )
}
