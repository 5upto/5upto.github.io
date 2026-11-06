import { Suspense, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { LanyardSettings } from '../../types/database'
import { useProfile } from '../../hooks/useProfile'
import { useExperiences } from '../../hooks/useExperiences'
import {
  DEFAULT_LANYARD_SETTINGS,
  LANYARD_FONT_OPTIONS,
  normalizeLanyardSettings,
  renderCardBack,
  renderCardFront,
  renderRibbon,
} from '../../lib/lanyardCard'
import Lanyard from '../../components/lanyard/Lanyard'
import Toast from '../components/Toast'
import { MdRestartAlt, MdSave } from 'react-icons/md'

const HEX_RE = /^#[0-9a-fA-F]{6}$/

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 lg:p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h2>
        {description && <p className="text-xs text-[var(--text-muted)] mt-1">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const pickerValue = HEX_RE.test(value) ? value : '#000000'
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-1"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          spellCheck={false}
          className="min-w-0 flex-1 px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-xs font-mono uppercase text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
        />
      </div>
    </div>
  )
}

function RangeField({
  label,
  value,
  min,
  max,
  suffix = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{label}</label>
        <span className="text-xs font-mono text-[var(--text-secondary)]">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary-500 cursor-pointer"
      />
    </div>
  )
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        {description && <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-[var(--border-hover)]'}`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  )
}

function CoverColorField({
  value,
  onChange,
}: {
  value: LanyardSettings['coverColor']
  onChange: (value: LanyardSettings['coverColor']) => void
}) {
  const options = [
    { value: 'silver', label: 'Silver', swatch: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 45%, #94a3b8 100%)' },
    { value: 'black', label: 'Black', swatch: '#151515' },
  ] as const

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
              active
                ? 'border-primary-500 bg-primary-600/10 text-[var(--text-primary)]'
                : 'border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:border-primary-500/50'
            }`}
          >
            <span
              className="h-5 w-5 shrink-0 rounded-full border border-black/10 shadow-inner"
              style={{ background: option.swatch }}
            />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default function LanyardPage() {
  const qc = useQueryClient()
  const [form, setForm] = useState<LanyardSettings>(DEFAULT_LANYARD_SETTINGS)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [preview, setPreview] = useState<{ front: string; back: string; ribbon: string }>({ front: '', back: '', ribbon: '' })
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  const { data: saved, isLoading } = useQuery({
    queryKey: ['admin-lanyard-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_config').select('value').eq('key', 'lanyard').maybeSingle()
      if (error) throw error
      return normalizeLanyardSettings(data?.value)
    },
  })

  const { data: profile } = useProfile()
  const { data: experiences } = useExperiences()
  const currentExp = experiences?.[0] ?? null
  const name = profile?.name || 'Your Name'
  const role = currentExp?.role || profile?.title || 'Your Role'

  useEffect(() => {
    if (saved) setForm(saved)
  }, [saved])

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false
    const timer = window.setTimeout(() => {
      Promise.all([
        renderCardFront({
          name,
          role,
          avatarUrl: profile?.avatar_url,
          isDark,
          settings: form,
          scale: 0.75,
        }),
        renderCardBack({
          logoUrl: currentExp?.logo,
          isDark,
          settings: form,
          scale: 0.75,
        }),
        renderRibbon({
          company: currentExp?.company || '',
          logoUrl: currentExp?.logo,
          isDark,
          settings: form,
          scale: 0.75,
        }),
      ])
        .then(([front, back, ribbon]) => {
          if (!cancelled) setPreview({ front, back, ribbon })
        })
        .catch(() => { /* preview keeps the previous frame */ })
    }, 120)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [name, role, profile?.avatar_url, currentExp?.company, currentExp?.logo, isDark, form])

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('site_config').upsert(
        { key: 'lanyard', value: normalizeLanyardSettings(form), updated_at: new Date().toISOString() },
        { onConflict: 'key' },
      )
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-lanyard-settings'] })
      qc.invalidateQueries({ queryKey: ['site-config', 'lanyard'] })
      setToast({ message: 'Lanyard card saved!', type: 'success' })
    },
    onError: (e: any) => setToast({ message: `Failed: ${e.message}`, type: 'error' }),
  })

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Lanyard Card</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Customise the ID card, photo, cover and ribbon shown in the hero</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setForm(DEFAULT_LANYARD_SETTINGS)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] hover:border-primary-500/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl text-sm font-medium transition-all"
          >
            <MdRestartAlt className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending || isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25"
          >
            <MdSave className="w-4 h-4" />
            {save.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">
        <div className="space-y-4">
          <Section title="Card background" description="Base colour behind the photo, name and role.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorField label="Light mode" value={form.cardBg} onChange={(v) => setForm((f) => ({ ...f, cardBg: v }))} />
              <ColorField label="Dark mode" value={form.cardBgDark} onChange={(v) => setForm((f) => ({ ...f, cardBgDark: v }))} />
            </div>
          </Section>

          <Section title="Card cover" description="Silver or black metal cover around the card edge and clip.">
            <CoverColorField value={form.coverColor} onChange={(v) => setForm((f) => ({ ...f, coverColor: v }))} />
          </Section>

          <Section title="Ribbon / strap" description="Colour of the lanyard strap behind the company logo.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorField label="Light mode" value={form.ribbonColor} onChange={(v) => setForm((f) => ({ ...f, ribbonColor: v }))} />
              <ColorField label="Dark mode" value={form.ribbonColorDark} onChange={(v) => setForm((f) => ({ ...f, ribbonColorDark: v }))} />
            </div>
          </Section>

          <Section title="Card photo" description="Zoom and shift the photo inside its frame on the card.">
            <ToggleField
              label="Rounded photo corners"
              description="Round the photo frame like a badge portrait."
              checked={form.photoRadius > 0}
              onChange={(checked) => setForm((f) => ({ ...f, photoRadius: checked ? (f.photoRadius || 20) : 0 }))}
            />
            {form.photoRadius > 0 && (
              <RangeField
                label="Corner radius"
                value={form.photoRadius}
                min={4}
                max={80}
                suffix="px"
                onChange={(v) => setForm((f) => ({ ...f, photoRadius: v }))}
              />
            )}
            <RangeField label="Photo size" value={form.photoScale} min={50} max={200} suffix="%" onChange={(v) => setForm((f) => ({ ...f, photoScale: v }))} />
            <RangeField label="Horizontal position" value={form.photoOffsetX} min={-50} max={50} suffix="%" onChange={(v) => setForm((f) => ({ ...f, photoOffsetX: v }))} />
            <RangeField label="Vertical position" value={form.photoOffsetY} min={-50} max={50} suffix="%" onChange={(v) => setForm((f) => ({ ...f, photoOffsetY: v }))} />
          </Section>

          <Section title="Typography" description="Font used for the card name, role and ribbon company name.">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Font family</label>
              <select
                value={form.fontFamily}
                onChange={(e) => setForm((f) => ({ ...f, fontFamily: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
              >
                {LANYARD_FONT_OPTIONS.map((font) => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-5 text-center">
              <p className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: `"${form.fontFamily}", Inter, system-ui, sans-serif` }}>
                {name}
              </p>
              <p className="text-sm text-primary-400 mt-1" style={{ fontFamily: `"${form.fontFamily}", Inter, system-ui, sans-serif` }}>
                {role}
              </p>
            </div>
          </Section>
        </div>

        <div className="space-y-4 xl:sticky xl:top-6 h-fit">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Live preview</h2>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full px-2 py-0.5">
                {isDark ? 'Dark' : 'Light'}
              </span>
            </div>

            <div className="relative mx-auto w-full max-w-[340px] aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[var(--bg-elevated)]">
              {preview.front ? (
                <Suspense
                  fallback={
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--text-muted)]">
                      Loading 3D preview…
                    </div>
                  }
                >
                  <Lanyard
                    frontImage={preview.front}
                    backImage={preview.back}
                    lanyardImage={preview.ribbon}
                    coverColor={form.coverColor}
                    position={[0, 0, 28]}
                    fov={18}
                    compact
                    transparent
                  />
                </Suspense>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--text-muted)]">Loading preview…</div>
              )}
            </div>

            <p className="text-[10px] text-[var(--text-muted)] mt-4 leading-relaxed">
              This is the same 3D lanyard used in the hero. Drag the card to spin it. Text colour switches automatically so the name, role and ribbon stay readable on your chosen backgrounds.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
