import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../types/database'
import ImagePicker from '../components/ImagePicker'
import Toast from '../components/Toast'
import { useJobTitle } from '../../hooks/useJobTitle'
import { useExperiences } from '../../hooks/useExperiences'
import { useAbout } from '../../hooks/useAbout'
import { MdPerson, MdEdit, MdImage, MdWork } from 'react-icons/md'

const InputField = ({ label, value, onChange, placeholder, textarea, rows }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean; rows?: number }) => (
  <div>
    <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows || 3} placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all resize-y" />
    ) : (
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
    )}
  </div>
)

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ name: '', handle: '', tagline: '', status: '', location: '', bio: '', avatar_url: '', nav_avatar_url: '', about_highlights: [] as { label: string; value: string }[] })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'about' | 'avatar'>('basic')

  const { data: profile } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => { const { data, error } = await supabase.from('profile').select('*').limit(1).single(); if (error) throw error; return data as Profile },
  })

  const jobTitle = useJobTitle()
  const { data: experiences } = useExperiences()
  const latestExp = experiences?.[0] ?? null
  const about = useAbout()

  useEffect(() => {
    if (profile) setForm({ name: profile.name, handle: profile.handle, tagline: profile.tagline, status: profile.status, location: profile.location, bio: profile.bio, avatar_url: profile.avatar_url, nav_avatar_url: profile.nav_avatar_url ?? '', about_highlights: profile.about_highlights })
  }, [profile])

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error('No profile loaded')
      const { error } = await supabase.from('profile').update(form).eq('id', profile.id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-profile'] }); setToast({ message: 'Profile saved!', type: 'success' }) },
    onError: (e: any) => setToast({ message: `Failed: ${e.message}`, type: 'error' }),
  })

  const tabs = [
    { id: 'basic' as const, label: 'Basic Info', icon: <MdPerson className="w-4 h-4" /> },
    { id: 'about' as const, label: 'About & Bio', icon: <MdEdit className="w-4 h-4" /> },
    { id: 'avatar' as const, label: 'Avatar', icon: <MdImage className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Profile</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage your personal information</p>
        </div>
        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name}
          className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25">
          {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Preview Card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-3xl text-white shrink-0">
          {form.avatar_url ? <img src={form.avatar_url} alt="" className="w-full h-full object-cover" /> : form.name?.charAt(0) || '?'}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{form.name || 'Your Name'}</h2>
          <p className="text-sm text-primary-400">{jobTitle || 'Your Title'}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{form.handle ? `@${form.handle}` : ''} {form.location ? `· ${form.location}` : ''}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl p-1">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-primary-600/10 text-primary-400 shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}>
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 lg:p-6">
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Full Name *" value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} placeholder="Shawon Ghosh" />
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MdWork className="w-3.5 h-3.5" /> Job Title
                </label>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-elevated)] border border-dashed border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] min-h-[42px]">
                  <span className="truncate">{jobTitle || 'Add an experience to set your title'}</span>
                </div>
                {/* <p className="text-xs text-[var(--text-muted)] mt-1.5">
                  {latestExp
                    ? <>Auto-set from your latest experience — <span className="text-[var(--text-primary)]">{latestExp.role}</span> at {latestExp.company}. Edit it under Experiences.</>
                    : 'No experiences yet, so the fallback title from the profile record is being used.'}
                </p> */}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Handle" value={form.handle} onChange={(v) => setForm(f => ({ ...f, handle: v }))} placeholder="5upto" />
              <InputField label="Status" value={form.status} onChange={(v) => setForm(f => ({ ...f, status: v }))} placeholder="Open to opportunities" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Location" value={form.location} onChange={(v) => setForm(f => ({ ...f, location: v }))} placeholder="Dhaka, Bangladesh" />
              <InputField label="Tagline" value={form.tagline} onChange={(v) => setForm(f => ({ ...f, tagline: v }))} placeholder="I build production systems..." />
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <InputField label="Bio" value={form.bio} onChange={(v) => setForm(f => ({ ...f, bio: v }))} textarea rows={3}
              placeholder="Fallback bio, only shown if you have no experiences, education or other content yet..." />
            <p className="text-xs text-[var(--text-muted)] -mt-1">
              This is only a fallback. The About section text is generated automatically from your experiences,
              education, certifications, publications and projects.
            </p>

            <div className="bg-[var(--bg-elevated)] rounded-xl p-4">
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Live Preview</p>
              <p className="text-xs text-[var(--text-muted)] mb-3">Exactly what visitors see on the homepage right now.</p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed bg-[var(--bg-card)] rounded-lg p-3 border border-[var(--border)]">
                {about.paragraph || 'Add an experience, education entry, certification or project to generate this automatically.'}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {about.highlights.map((h) => (
                  <div key={h.label} className="flex items-center gap-2 bg-[var(--bg-card)] rounded-lg px-3 py-2">
                    <span className="text-lg font-bold gradient-text">{h.value}</span>
                    <span className="text-xs text-[var(--text-muted)]">{h.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-3">
                Numbers are counted live from your records. Update an experience and both refresh automatically.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'avatar' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <ImagePicker value={form.avatar_url} onChange={(url) => setForm(f => ({ ...f, avatar_url: url }))} bucket="avatars" label="Lanyard Photo" />
              <p className="text-xs text-[var(--text-muted)] -mt-1">Shown on the lanyard / ID card in the hero section.</p>
              {form.avatar_url && (
                <div className="flex justify-center">
                  <img src={form.avatar_url} alt="Lanyard avatar" className="w-32 h-32 rounded-2xl object-cover border-2 border-[var(--border)]" />
                </div>
              )}
            </div>

            <div className="h-px bg-[var(--border)]" />

            <div className="space-y-3">
              <ImagePicker value={form.nav_avatar_url} onChange={(url) => setForm(f => ({ ...f, nav_avatar_url: url }))} bucket="logos" label="Navbar Logo & Favicon" />
              <p className="text-xs text-[var(--text-muted)] -mt-1">
                Separate from the lanyard photo. Displayed in the circular navbar logo and as the browser tab favicon.
                {!form.nav_avatar_url && form.avatar_url && (
                  <span className="block mt-1 text-primary-400">Empty — currently falling back to your lanyard photo.</span>
                )}
              </p>
              <div className="flex justify-center">
                {(form.nav_avatar_url || form.avatar_url) ? (
                  <img src={form.nav_avatar_url || form.avatar_url} alt="Navbar logo preview" className="w-20 h-20 rounded-full object-cover ring-2 ring-primary-500/30" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">?</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
