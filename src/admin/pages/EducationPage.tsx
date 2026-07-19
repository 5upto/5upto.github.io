import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { sortByDate } from '../../lib/sortByDate'
import type { Education } from '../../types/database'
import FormDialog from '../components/FormDialog'
import DeleteDialog from '../components/DeleteDialog'
import Toast from '../components/Toast'
import ImagePicker from '../components/ImagePicker'
import { MdEdit, MdDelete, MdCheckCircle } from 'react-icons/md'

const empty = { degree: '', subject: '', institution: '', logo: '', year: '', style: 'bangladesh' as 'nit' | 'bangladesh' | 'international', country_name: '', board_name: '', certificate_label: 'Certificate of', signatory: '' }

export default function EducationPage() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<Education | null>(null)
  const [deleting, setDeleting] = useState<Education | null>(null)
  const [form, setForm] = useState(empty)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-education'],
    queryFn: async () => { const { data, error } = await supabase.from('education').select('*'); if (error) throw error; return sortByDate(data as Education[], 'year') },
  })

  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      if (editing) { const { error } = await supabase.from('education').update(d).eq('id', editing.id); if (error) throw error }
      else { const { error } = await supabase.from('education').insert(d); if (error) throw error }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-education'] }); setDialogOpen(false); setEditing(null); setToast({ message: editing ? 'Updated' : 'Added', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('education').delete().eq('id', id); if (error) throw error },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-education'] }); setDeleteOpen(false); setDeleting(null); setToast({ message: 'Deleted', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Education</h1><p className="text-sm text-[var(--text-muted)] mt-1">{items.length} entries</p></div>
        <button onClick={() => { setEditing(null); setForm(empty); setDialogOpen(true) }} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25">+ Add Education</button>
      </div>

      <div className="space-y-3">
        {isLoading ? <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div> : items.map(e => (
          <div key={e.id} className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl p-4 hover:border-primary-500/30 transition-all group">
            <div className="flex items-start gap-4">
              {e.logo && <img src={e.logo} alt="" className="w-12 h-12 rounded-xl object-contain bg-[var(--bg-elevated)] shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{e.degree}</h3>
                <p className="text-xs text-accent-400">{e.institution}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-600/10 text-primary-400">{e.year}</span>
                  {e.subject && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)]">{e.subject}</span>}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">{e.style || 'bangladesh'}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setEditing(e); setForm({ degree: e.degree, subject: e.subject, institution: e.institution, logo: e.logo, year: e.year, style: e.style || 'bangladesh', country_name: e.country_name || '', board_name: e.board_name || '', certificate_label: e.certificate_label || 'Certificate of', signatory: e.signatory || '' }); setDialogOpen(true) }} className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] text-primary-400"><MdEdit className="w-4 h-4" /></button>
                <button onClick={() => { setDeleting(e); setDeleteOpen(true) }} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"><MdDelete className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FormDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        title={editing ? 'Edit Education' : 'Add Education'}
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 text-sm text-[var(--text-muted)]">Cancel</button>
            <button onClick={() => save.mutate(form)} disabled={save.isPending || !form.degree || !form.institution} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium">{save.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Live Preview */}
          <div className="bg-[var(--bg-elevated)] rounded-xl p-4">
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Preview</p>
            {form.style === 'nit' ? (
              <div className="bg-[#faf8f0] dark:bg-[#1a1818] rounded-lg p-4">
                <div className="border-2 border-[#1a237e]/40 dark:border-[#5a6abf]/40 p-1">
                  <div className="border border-[#1a237e]/20 dark:border-[#5a6abf]/20">
                    <div className="flex">
                      <div className="w-[30%] flex items-center justify-center py-4">
                        {form.logo ? <img src={form.logo} alt="" className="w-16 h-16 rounded-full object-contain" /> : <div className="w-16 h-16 rounded-full bg-[#e8eaf6] flex items-center justify-center text-[#1a237e] text-xs">Logo</div>}
                      </div>
                      <div className="w-[70%] text-left py-4">
                        {form.country_name && <p className="text-[9px] tracking-[0.15em] uppercase text-[#5a6a8a] font-medium">{form.country_name}</p>}
                        {form.institution && <p className="text-[10px] tracking-[0.08em] text-[#1a237e] font-bold mt-0.5 font-certificate">{form.institution}</p>}
                        <div className="w-8 h-px bg-[#1a237e]/30 my-2" />
                        {form.certificate_label && <p className="text-[9px] text-[#8a9aaa] uppercase tracking-wider">{form.certificate_label}</p>}
                        <h3 className="text-sm font-bold text-[#1a1a2a] mt-1 font-certificate">{form.degree || 'Degree'}</h3>
                        {form.subject && <p className="text-[10px] text-[#5a6a7a] mt-0.5">in <span className="font-medium">{form.subject}</span></p>}
                        <div className="flex items-center gap-3 mt-2">
                          {form.year && <span className="text-[10px] text-[#1a237e] font-bold font-certificate">{form.year}</span>}
                          {form.signatory && <span className="text-[8px] text-[#8a9aaa] font-certificate">{form.signatory}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : form.style === 'international' ? (
              <div className="bg-[#fdfbf5] dark:bg-[#0f0e0c] rounded-lg p-4">
                <div className="border border-[#c9a84c]/30 dark:border-[#c9a84c]/20 p-1">
                  <div className="text-center p-3">
                    {form.country_name && <p className="text-[8px] tracking-[0.2em] uppercase text-[#8a7a5a] font-sans">{form.country_name}</p>}
                    {form.board_name && <p className="text-[9px] tracking-[0.1em] uppercase text-[#1a1a2e] dark:text-[#c9a84c]/60 font-medium mt-0.5 font-sans">{form.board_name}</p>}
                    {form.institution && <p className="text-[11px] text-[#1a1a2e] dark:text-[#e0d5c0] mt-3 font-certificate">{form.institution}</p>}
                    <div className="flex justify-center my-3"><div className="w-10 h-px bg-[#c9a84c]/40 dark:bg-[#c9a84c]/25" /></div>
                    {form.certificate_label && <p className="text-[8px] text-[#8a7a5a] dark:text-[#c9a84c]/45 uppercase tracking-[0.2em] font-sans">{form.certificate_label}</p>}
                    <h3 className="text-lg text-[#1a1a2e] dark:text-[#f0e6d0] mt-1 font-certificate tracking-wide">{form.degree || 'Degree'}</h3>
                    {form.subject && <p className="text-[11px] text-[#5a5a5a] dark:text-[#c9a84c]/55 mt-1 font-sans">in {form.subject}</p>}
                    {form.logo && <div className="flex justify-center my-3"><img src={form.logo} alt="" className="w-10 h-10 rounded-full object-contain opacity-70" /></div>}
                    <div className="flex justify-center my-2"><div className="w-10 h-px bg-[#c9a84c]/40 dark:bg-[#c9a84c]/25" /></div>
                    <div className="flex items-end justify-between mt-1">
                      <div className="text-left">{form.signatory && <p className="text-[8px] text-[#8a7a5a] dark:text-[#c9a84c]/45 font-certificate">{form.signatory}</p>}</div>
                      <div className="text-center">{form.year && <p className="text-[10px] font-semibold text-[#1a1a2e] dark:text-[#c9a84c] font-sans tracking-widest">{form.year}</p>}</div>
                      <div className="text-right"><div className="w-5 h-5 flex items-center justify-center mx-auto"><MdCheckCircle className="w-2.5 h-2.5 text-[#c9a84c]/40" /></div></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#faf8f0] dark:bg-[#1a1816] rounded-lg p-4">
                <div className="border-2 border-[#c8b88a] dark:border-[#5a4f3a] p-1">
                  <div className="border border-[#c8b88a]/60 dark:border-[#5a4f3a]/60">
                    <div className="flex">
                      <div className="w-[30%] flex items-center justify-center py-4">
                        {form.logo ? <img src={form.logo} alt="" className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-[#f5f0e0] flex items-center justify-center text-[#8a7a6a] text-xs">Logo</div>}
                      </div>
                      <div className="w-[70%] text-left py-4">
                        {form.country_name && <p className="text-[9px] tracking-[0.15em] uppercase text-[#8a7a6a] font-medium">{form.country_name}</p>}
                        {form.board_name && <p className="text-[10px] tracking-[0.1em] uppercase text-[#006633] font-bold mt-0.5">{form.board_name}</p>}
                        <div className="w-8 h-px bg-[#c8b88a] my-2" />
                        {form.certificate_label && <p className="text-[9px] text-[#a09080] uppercase tracking-wider">{form.certificate_label}</p>}
                        <h3 className="text-sm font-bold text-[#1a1a1a] mt-1">{form.degree || 'Degree'}</h3>
                        {form.subject && <p className="text-[10px] text-[#6a5a4a] mt-0.5">{form.subject}</p>}
                        <p className="text-[10px] text-[#4a4a4a] italic mt-1">{form.institution || 'Institution'}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {form.year && <span className="text-[10px] text-[#006633] font-bold">{form.year}</span>}
                          {form.signatory && <span className="text-[8px] text-[#a09080]">{form.signatory}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Certificate Style</label>
            <select value={form.style} onChange={e => {
              const style = e.target.value as 'nit' | 'bangladesh' | 'international'
              setForm(f => ({
                ...f, style,
                country_name: style === 'nit' ? 'भारत सरकार · Government of India' : style === 'international' ? '' : "Government of the People's Republic of Bangladesh",
                board_name: style === 'nit' ? '' : style === 'international' ? '' : 'Board of Intermediate and Secondary Education, Dhaka',
                certificate_label: style === 'nit' ? 'Conferred the Degree of' : style === 'international' ? 'This is to certify that' : 'Certificate of',
                signatory: style === 'nit' ? '— Registrar' : style === 'international' ? '— Vice Chancellor' : '— Controller of Examinations'
              }))
            }} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)]">
              <option value="bangladesh">Bangladesh</option>
              <option value="nit">India</option>
              <option value="international">International</option>
            </select></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Degree *</label><input value={form.degree} onChange={e => setForm(f => ({...f, degree: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Subject</label><input value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Institution *</label><input value={form.institution} onChange={e => setForm(f => ({...f, institution: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Year</label><input value={form.year} onChange={e => setForm(f => ({...f, year: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
          <ImagePicker value={form.logo} onChange={v => setForm(f => ({...f, logo: v}))} bucket="logos" label="Institution Logo" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Country Name</label><input value={form.country_name} onChange={e => setForm(f => ({...f, country_name: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Board Name</label><input value={form.board_name} onChange={e => setForm(f => ({...f, board_name: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Certificate Label</label><input value={form.certificate_label} onChange={e => setForm(f => ({...f, certificate_label: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Signatory</label><input value={form.signatory} onChange={e => setForm(f => ({...f, signatory: e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
        </div>
      </FormDialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => deleting && del.mutate(deleting.id)} title="Education" loading={del.isPending} />
    </div>
  )
}
