import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type {
  AntigravityColorMode,
  AntigravityParticleShape,
  AntigravitySettings,
  HeroBackgroundSettings,
} from '../../types/database'
import {
  ANTIGRAVITY_COLOR_MODES,
  ANTIGRAVITY_PRESETS,
  ANTIGRAVITY_SHAPES,
  DEFAULT_HERO_BACKGROUND_SETTINGS,
  HERO_BACKGROUND_OPTIONS,
  normalizeHeroBackgroundSettings,
} from '../../lib/heroBackground'
import { HERO_BACKGROUND_SETTINGS_KEY } from '../../hooks/useHeroBackgroundSettings'
import HeroBackground from '../../components/backgrounds/HeroBackground'
import Toast from '../components/Toast'
import { MdAdd, MdDeleteOutline, MdRestartAlt, MdSave } from 'react-icons/md'

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
  step = 1,
  suffix = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
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
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary-500 cursor-pointer"
      />
    </div>
  )
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm capitalize text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
      >
        {options.map((option) => (
          <option key={option} value={option} className="capitalize">{option}</option>
        ))}
      </select>
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

function ColorPaletteField({
  colors,
  onChange,
}: {
  colors: string[]
  onChange: (colors: string[]) => void
}) {
  const update = (index: number, color: string) => {
    const next = [...colors]
    next[index] = color
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {colors.map((color, index) => (
        <div key={index} className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <ColorField label={`Colour ${index + 1}`} value={color} onChange={(value) => update(index, value)} />
          </div>
          <button
            type="button"
            onClick={() => onChange(colors.filter((_, i) => i !== index))}
            disabled={colors.length <= 2}
            title="Remove colour"
            className="mb-0.5 p-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/50 disabled:opacity-30 disabled:hover:text-[var(--text-muted)] disabled:hover:border-[var(--border)] transition-colors"
          >
            <MdDeleteOutline className="w-4 h-4" />
          </button>
        </div>
      ))}
      {colors.length < 6 && (
        <button
          type="button"
          onClick={() => onChange([...colors, colors[colors.length - 1] || '#4285F4'])}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[var(--border-hover)] text-xs font-medium text-[var(--text-muted)] hover:text-primary-400 hover:border-primary-500/50 transition-colors"
        >
          <MdAdd className="w-4 h-4" />
          Add colour
        </button>
      )}
    </div>
  )
}

export default function HeroBackgroundPage() {
  const qc = useQueryClient()
  const [form, setForm] = useState<HeroBackgroundSettings>(DEFAULT_HERO_BACKGROUND_SETTINGS)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  const { data: saved, isLoading } = useQuery({
    queryKey: ['admin-hero-background-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_config').select('value').eq('key', 'hero_background').maybeSingle()
      if (error) throw error
      return normalizeHeroBackgroundSettings(data?.value)
    },
  })

  useEffect(() => {
    if (saved) setForm(saved)
  }, [saved])

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const updateAntigravity = (patch: Partial<AntigravitySettings>) =>
    setForm((f) => ({ ...f, antigravity: { ...f.antigravity, ...patch } }))

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('site_config').upsert(
        { key: 'hero_background', value: normalizeHeroBackgroundSettings(form), updated_at: new Date().toISOString() },
        { onConflict: 'key' },
      )
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-hero-background-settings'] })
      qc.invalidateQueries({ queryKey: HERO_BACKGROUND_SETTINGS_KEY })
      setToast({ message: 'Hero background saved!', type: 'success' })
    },
    onError: (e: any) => setToast({ message: `Failed: ${e.message}`, type: 'error' }),
  })

  const antigravity = form.antigravity
  const activeStyle = HERO_BACKGROUND_OPTIONS.find((option) => option.value === form.style)

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Hero Background</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Choose the motion behind the hero, or turn it off for a plain hero</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setForm(DEFAULT_HERO_BACKGROUND_SETTINGS)}
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

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-6">
        <div className="space-y-4">
          <Section title="Background" description="Turn the hero background on or off. The plain option keeps the page colour with no motion.">
            <ToggleField
              label="Enable hero background"
              description={form.enabled ? 'Motion is visible behind the hero content.' : 'The hero is plain — no particles or motion.'}
              checked={form.enabled}
              onChange={(enabled) => setForm((f) => ({ ...f, enabled }))}
            />

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-opacity ${form.enabled ? '' : 'opacity-50'}`}>
              {HERO_BACKGROUND_OPTIONS.map((option) => {
                const active = form.style === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, style: option.value }))}
                    aria-pressed={active}
                    className={`overflow-hidden rounded-xl border text-left transition-all ${
                      active
                        ? 'border-primary-500 ring-2 ring-primary-500/20'
                        : 'border-[var(--border)] hover:border-primary-500/50'
                    }`}
                  >
                    <span className="block h-20 w-full" style={{ background: option.preview }} />
                    <span className="block px-3 py-2.5 bg-[var(--bg-elevated)]">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">{option.label}</span>
                        {active && <span className="text-[10px] uppercase tracking-wider text-primary-400">Active</span>}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-[var(--text-muted)]">{option.description}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </Section>

          {form.style === 'antigravity' && (
            <>
              <Section title="Antigravity preset" description="The Gemini preset matches the ReactBits Antigravity default sizing and colours.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ANTIGRAVITY_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, antigravity: { ...preset.settings } }))}
                      className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-left hover:border-primary-500/60 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex -space-x-1">
                          {preset.settings.colors.slice(0, 4).map((color, index) => (
                            <span
                              key={`${preset.value}-${index}`}
                              className="h-3.5 w-3.5 rounded-full border border-black/10"
                              style={{ background: color }}
                            />
                          ))}
                        </span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">{preset.label}</span>
                      </span>
                      <span className="mt-1 block text-[11px] text-[var(--text-muted)]">{preset.description}</span>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Palette" description="Particles blend between these colours. Two to six colours work best.">
                <ColorPaletteField
                  colors={antigravity.colors}
                  onChange={(colors) => updateAntigravity({ colors })}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField<AntigravityColorMode>
                    label="Colour distribution"
                    value={antigravity.colorMode}
                    options={ANTIGRAVITY_COLOR_MODES}
                    onChange={(colorMode) => updateAntigravity({ colorMode })}
                  />
                  <SelectField<AntigravityParticleShape>
                    label="Particle shape"
                    value={antigravity.particleShape}
                    options={ANTIGRAVITY_SHAPES}
                    onChange={(particleShape) => updateAntigravity({ particleShape })}
                  />
                </div>
                <RangeField label="Colour cycle speed" value={antigravity.colorSpeed} min={0} max={0.3} step={0.01} onChange={(colorSpeed) => updateAntigravity({ colorSpeed })} />
                <RangeField label="Opacity" value={antigravity.opacity} min={0.1} max={1} step={0.05} onChange={(opacity) => updateAntigravity({ opacity })} />
              </Section>

              <Section title="Cursor field" description="How strongly particles gather around the pointer and the ring they form.">
                <RangeField label="Particle count" value={antigravity.count} min={200} max={5000} step={50} onChange={(count) => updateAntigravity({ count })} />
                <RangeField label="Particle size" value={antigravity.particleSize} min={0.2} max={2.5} step={0.05} onChange={(particleSize) => updateAntigravity({ particleSize })} />
                <RangeField label="Magnet radius" value={antigravity.magnetRadius} min={2} max={24} step={0.5} onChange={(magnetRadius) => updateAntigravity({ magnetRadius })} />
                <RangeField label="Ring radius" value={antigravity.ringRadius} min={1} max={20} step={0.5} onChange={(ringRadius) => updateAntigravity({ ringRadius })} />
                <RangeField label="Field strength" value={antigravity.fieldStrength} min={2} max={40} step={1} onChange={(fieldStrength) => updateAntigravity({ fieldStrength })} />
                <RangeField label="Wave speed" value={antigravity.waveSpeed} min={0} max={2} step={0.05} onChange={(waveSpeed) => updateAntigravity({ waveSpeed })} />
              </Section>

              <Section title="Motion details" description="Fine-tune the drift, depth and pulse of the field.">
                <RangeField label="Wave amplitude" value={antigravity.waveAmplitude} min={0} max={8} step={0.1} onChange={(waveAmplitude) => updateAntigravity({ waveAmplitude })} />
                <RangeField label="Wave count" value={antigravity.waveCount} min={0} max={8} step={1} onChange={(waveCount) => updateAntigravity({ waveCount })} />
                <RangeField label="Pulse speed" value={antigravity.pulseSpeed} min={0} max={8} step={0.1} onChange={(pulseSpeed) => updateAntigravity({ pulseSpeed })} />
                <RangeField label="Depth" value={antigravity.depthFactor} min={0} max={3} step={0.1} onChange={(depthFactor) => updateAntigravity({ depthFactor })} />
                <RangeField label="Ambient glow" value={antigravity.ambient} min={0} max={1} step={0.05} onChange={(ambient) => updateAntigravity({ ambient })} />
                <RangeField label="Size variance" value={antigravity.particleVariance} min={0} max={2} step={0.05} onChange={(particleVariance) => updateAntigravity({ particleVariance })} />
                <RangeField label="Rotation speed" value={antigravity.rotationSpeed} min={-3} max={3} step={0.1} onChange={(rotationSpeed) => updateAntigravity({ rotationSpeed })} />
                <RangeField label="Follow smoothing" value={antigravity.lerpSpeed} min={0.01} max={0.3} step={0.01} onChange={(lerpSpeed) => updateAntigravity({ lerpSpeed })} />
                <ToggleField
                  label="Interactive"
                  description="Particles follow the cursor and gather into a ring."
                  checked={antigravity.interactive}
                  onChange={(interactive) => updateAntigravity({ interactive })}
                />
                <ToggleField
                  label="Click burst"
                  description="Burst particles outward when the hero is clicked."
                  checked={antigravity.clickBurst}
                  onChange={(clickBurst) => updateAntigravity({ clickBurst })}
                />
                <ToggleField
                  label="Intro reveal"
                  description="Particles rise into place on first load."
                  checked={antigravity.intro}
                  onChange={(intro) => updateAntigravity({ intro })}
                />
              </Section>
            </>
          )}

{form.style === 'galaxy' && (
            <Section title="Galaxy Palette" description="Color controls for the galaxy background.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RangeField label="Star density" value={100} min={50} max={300} step={1} onChange={(val) => setForm(f => ({...f, galaxyDensity: val}))} />
                <RangeField label="Nebula speed" value={1} min={0.1} max={5} step={0.1} onChange={(val) => setForm(f => ({...f, galaxySpeed: val}))} />
                <RangeField label="Black hole count" value={0} min={0} max={10} step={1} onChange={(val) => setForm(f => ({...f, galaxyHoles: val}))} />
              </div>
            </Section>
          )}
          
          {form.style === 'letter-glitch' && (
            <Section title="Glitch Config" description="Settings for letter glitch effect.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RangeField label="Glitch speed" value={1} min={0.1} max={10} step={0.1} onChange={(val) => setForm(f => ({...f, glitchSpeed: val}))} />
                <RangeField label="Glitch intensity" value={5} min={1} max={20} step={1} onChange={(val) => setForm(f => ({...f, glitchIntensity: val}))} />
                <RangeField label="Scan line opacity" value={0.5} min={0} max={1} step={0.1} onChange={(val) => setForm(f => ({...f, glitchOpacity: val}))} />
              </div>
            </Section>
          )}
          
          {form.style === 'hyperspeed' && (
            <Section title="Hyperspeed Config" description="Settings for hyperspeed streaks.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RangeField label="Streak count" value={20} min={5} max={50} step={1} onChange={(val) => setForm(f => ({...f, hyperspeedStreaks: val}))} />
                <RangeField label="Streak length" value={5} min={1} max={20} step={1} onChange={(val) => setForm(f => ({...f, hyperspeedLength: val}))} />
                <RangeField label="Rotation speed" value={1} min={0.1} max={5} step={0.1} onChange={(val) => setForm(f => ({...f, hyperspeedRotation: val}))} />
              </div>
            </Section>
          )}
          
          {form.style === 'lightning' && (
            <Section title="Lightning Config" description="Settings for lightning bolts.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RangeField label="Bolt count" value={5} min={1} max={20} step={1} onChange={(val) => setForm(f => ({...f, lightningBolts: val}))} />
                <RangeField label="Bolt thickness" value={3} min={1} max={10} step={1} onChange={(val) => setForm(f => ({...f, lightningThickness: val}))} />
                <RangeField label="Strike frequency" value={1} min={0.1} max={5} step={0.1} onChange={(val) => setForm(f => ({...f, lightningFrequency: val}))} />
              </div>
            </Section>
          )}
          
          {form.style === 'side-rays' && (
            <Section title="Side Rays Config" description="Settings for side rays effect.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RangeField label="Ray count" value={4} min={2} max={10} step={1} onChange={(val) => setForm(f => ({...f, sideraysCount: val}))} />
                <RangeField label="Ray width" value={2} min={1} max={10} step={1} onChange={(val) => setForm(f => ({...f, sideraysWidth: val}))} />
                <RangeField label="Ray intensity" value={0.5} min={0} max={1} step={0.1} onChange={(val) => setForm(f => ({...f, sideraysIntensity: val}))} />
              </div>
            </Section>
          )}

        </div>

        <div className="space-y-4 xl:sticky xl:top-6 h-fit">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Live preview</h2>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full px-2 py-0.5">
                {form.enabled ? activeStyle?.label : 'Plain'}
              </span>
            </div>

            <div className="relative aspect-[16/11] min-h-[260px] rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[var(--bg-primary)]">
              {form.enabled && <HeroBackground settings={form} isDark={isDark} />}
              <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-8 pointer-events-none">
                <p className="text-[10px] font-display uppercase tracking-[0.2em] text-primary-400">Creative Developer</p>
                <p className="mt-2 text-2xl font-display font-bold text-[var(--text-primary)]">
                  I'm Shawon <span className="gradient-text">Ghosh</span>
                </p>
                <p className="mt-2 max-w-[260px] text-xs leading-relaxed text-[var(--text-muted)]">
                  A sample of the hero text so you can judge contrast and motion.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="rounded-full bg-primary-600 px-4 py-1.5 text-[11px] font-medium text-white">View My Work</span>
                  <span className="rounded-full border border-[var(--border)] px-4 py-1.5 text-[11px] font-medium text-[var(--text-secondary)]">View Resume</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-[var(--text-muted)] mt-4 leading-relaxed">
              Move the pointer inside the preview to test the cursor field. Antigravity colours automatically adjust for light and dark mode, and the saved setting follows the same theme as the live hero.
            </p>
          
          

          </div>
        </div>
      </div>
    </div>
  )
}
