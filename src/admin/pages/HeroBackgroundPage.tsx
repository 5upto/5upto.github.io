import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type {
  AntigravityColorMode,
  AntigravityParticleShape,
  AntigravitySettings,
  GalaxySettings,
  HeroBackgroundSettings,
  HyperspeedSettings,
  LetterGlitchSettings,
  LightningSettings,
  ParticleSettings,
  SideRaysSettings,
} from '../../types/database'
import {
  ANTIGRAVITY_COLOR_MODES,
  ANTIGRAVITY_PRESETS,
  ANTIGRAVITY_SHAPES,
  DEFAULT_HERO_BACKGROUND_SETTINGS,
  GALAXY_DIRECTIONS,
  HERO_BACKGROUND_OPTIONS,
  HYPERSPEED_CURVES,
  LETTER_GLITCH_CLICK_EFFECTS,
  PARTICLE_CLICK_MODES,
  PARTICLE_DETECT_ON,
  PARTICLE_HOVER_MODES,
  PARTICLE_MOVE_DIRECTIONS,
  PARTICLE_OUT_MODES,
  PARTICLE_SHAPES,
  SIDE_RAYS_ORIGINS,
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
  min = 2,
  max = 6,
}: {
  colors: string[]
  onChange: (colors: string[]) => void
  min?: number
  max?: number
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
            disabled={colors.length <= min}
            title="Remove colour"
            className="mb-0.5 p-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/50 disabled:opacity-30 disabled:hover:text-[var(--text-muted)] disabled:hover:border-[var(--border)] transition-colors"
          >
            <MdDeleteOutline className="w-4 h-4" />
          </button>
        </div>
      ))}
      {colors.length < max && (
        <button
          type="button"
          onClick={() => onChange([...colors, colors[colors.length - 1] || '#4285F4'])}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[var(--border-hover)] text-xs font-medium text-[var(--text-muted)] hover:text-primary-400 hover:border-primary-500/50 transition-colors"
        >
          <MdAdd className="w-4 h-4" />
          Add colour
        </button>
      )}
      {colors.length === 0 && (
        <p className="text-[10px] leading-relaxed text-[var(--text-muted)]">Using the theme colour palette.</p>
      )}
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  description,
  multiline = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  description?: string
  multiline?: boolean
}) {
  const className =
    'w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all'
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          spellCheck={false}
          className={`${className} resize-y font-mono text-xs leading-relaxed`}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          className={className}
        />
      )}
      {description && <p className="mt-1.5 text-[10px] leading-relaxed text-[var(--text-muted)]">{description}</p>}
    </div>
  )
}

function OptionalColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <ColorField label={label} value={value} onChange={onChange} />
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="text-[10px] leading-relaxed text-[var(--text-muted)]">
          {value ? 'Custom colour applied.' : 'Using the theme colour.'}
        </p>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            Use theme
          </button>
        )}
      </div>
    </div>
  )
}

type SettingsField<K extends string = string> =
  | { kind: 'range'; key: K; label: string; min: number; max: number; step?: number; suffix?: string }
  | { kind: 'toggle'; key: K; label: string; description?: string }
  | { kind: 'select'; key: K; label: string; options: readonly string[] }
  | { kind: 'color'; key: K; label: string }
  | { kind: 'optional-color'; key: K; label: string }
  | { kind: 'palette'; key: K; label: string; max: number; min?: number }
  | {
      kind: 'text'
      key: K
      label: string
      placeholder?: string
      description?: string
      multiline?: boolean
    }

function SettingsFields<T extends object>({
  fields,
  value,
  onChange,
}: {
  fields: readonly SettingsField<keyof T & string>[]
  value: T
  onChange: (patch: Partial<T>) => void
}) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const current = value[field.key]
        const key = field.key as string
        switch (field.kind) {
          case 'range':
            return (
              <RangeField
                key={key}
                label={field.label}
                value={Number(current)}
                min={field.min}
                max={field.max}
                step={field.step}
                suffix={field.suffix}
                onChange={(next) => onChange({ [field.key]: next } as unknown as Partial<T>)}
              />
            )
          case 'toggle':
            return (
              <ToggleField
                key={key}
                label={field.label}
                description={field.description}
                checked={Boolean(current)}
                onChange={(next) => onChange({ [field.key]: next } as unknown as Partial<T>)}
              />
            )
          case 'select':
            return (
              <SelectField
                key={key}
                label={field.label}
                value={String(current)}
                options={field.options}
                onChange={(next) => onChange({ [field.key]: next } as unknown as Partial<T>)}
              />
            )
          case 'color':
            return (
              <ColorField
                key={key}
                label={field.label}
                value={String(current ?? '')}
                onChange={(next) => onChange({ [field.key]: next } as unknown as Partial<T>)}
              />
            )
          case 'optional-color':
            return (
              <OptionalColorField
                key={key}
                label={field.label}
                value={String(current ?? '')}
                onChange={(next) => onChange({ [field.key]: next } as unknown as Partial<T>)}
              />
            )
          case 'palette':
            return (
              <ColorPaletteField
                key={key}
                colors={Array.isArray(current) ? (current as string[]) : []}
                min={field.min ?? 0}
                max={field.max}
                onChange={(next) => onChange({ [field.key]: next } as unknown as Partial<T>)}
              />
            )
          case 'text':
            return (
              <TextField
                key={key}
                label={field.label}
                value={String(current ?? '')}
                placeholder={field.placeholder}
                description={field.description}
                multiline={field.multiline}
                onChange={(next) => onChange({ [field.key]: next } as unknown as Partial<T>)}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}

type SettingsGroup<K extends string> = {
  title: string
  description: string
  fields: SettingsField<K>[]
}

const GALAXY_GROUPS: SettingsGroup<keyof GalaxySettings & string>[] = [
  {
    title: 'Star field',
    description: 'Camera focal point, rotation, density and star count.',
    fields: [
      { kind: 'range', key: 'focalX', label: 'Focal X', min: 0, max: 1, step: 0.01 },
      { kind: 'range', key: 'focalY', label: 'Focal Y', min: 0, max: 1, step: 0.01 },
      { kind: 'range', key: 'rotationAngle', label: 'Star rotation', min: -180, max: 180, step: 1, suffix: '°' },
      { kind: 'range', key: 'starSpeed', label: 'Star drift', min: 0, max: 5, step: 0.05 },
      { kind: 'range', key: 'density', label: 'Density', min: 0.05, max: 5, step: 0.05 },
      { kind: 'range', key: 'speed', label: 'Animation speed', min: 0.05, max: 10, step: 0.05 },
      { kind: 'range', key: 'layers', label: 'Parallax layers', min: 2, max: 8, step: 1 },
      { kind: 'range', key: 'opacity', label: 'Opacity', min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    title: 'Glow & colour',
    description: 'Star palette, glow, saturation and background.',
    fields: [
      { kind: 'range', key: 'hueShift', label: 'Hue shift', min: 0, max: 360, step: 1, suffix: '°' },
      { kind: 'range', key: 'glowIntensity', label: 'Glow intensity', min: 0, max: 3, step: 0.05 },
      { kind: 'range', key: 'saturation', label: 'Saturation', min: 0, max: 3, step: 0.05 },
      { kind: 'range', key: 'twinkleIntensity', label: 'Twinkle', min: 0, max: 1, step: 0.05 },
      { kind: 'range', key: 'starSize', label: 'Star size', min: 0, max: 5, step: 0.1 },
      { kind: 'range', key: 'flareIntensity', label: 'Flare', min: 0, max: 5, step: 0.1 },
      { kind: 'palette', key: 'starColors', label: 'Star palette', max: 4 },
      { kind: 'optional-color', key: 'backgroundColor', label: 'Background colour' },
      { kind: 'toggle', key: 'transparent', label: 'Transparent canvas', description: 'Let the page background show through.' },
    ],
  },
  {
    title: 'Motion & interaction',
    description: 'Repulsion, rotation and pointer behaviour.',
    fields: [
      { kind: 'range', key: 'rotationSpeed', label: 'Rotation speed', min: -3, max: 3, step: 0.05 },
      { kind: 'range', key: 'autoCenterRepulsion', label: 'Centre repulsion', min: 0, max: 10, step: 0.1 },
      { kind: 'range', key: 'repulsionStrength', label: 'Pointer repulsion', min: 0, max: 10, step: 0.1 },
      { kind: 'select', key: 'direction', label: 'Direction', options: GALAXY_DIRECTIONS },
      { kind: 'toggle', key: 'mouseInteraction', label: 'Mouse interaction', description: 'Stars react to the pointer.' },
      { kind: 'toggle', key: 'mouseRepulsion', label: 'Mouse repulsion', description: 'Push stars away from the cursor.' },
      { kind: 'toggle', key: 'clickWarp', label: 'Click warp', description: 'Warp the field when the hero is clicked.' },
      { kind: 'toggle', key: 'intro', label: 'Intro reveal', description: 'Stars fade into place on first load.' },
      { kind: 'toggle', key: 'disableAnimation', label: 'Freeze animation', description: 'Keep the field static.' },
    ],
  },
]

const LETTER_GLITCH_GROUPS: SettingsGroup<keyof LetterGlitchSettings & string>[] = [
  {
    title: 'Glyphs',
    description: 'Character set, typeface and grid spacing.',
    fields: [
      {
        kind: 'text',
        key: 'characters',
        label: 'Characters',
        placeholder: 'ABC123',
        description: 'Every glyph used by the field. Leave the default for the ReactBits set.',
        multiline: true,
      },
      {
        kind: 'text',
        key: 'fontFamily',
        label: 'Font family',
        placeholder: 'Default monospace stack',
      },
      { kind: 'range', key: 'fontSize', label: 'Font size', min: 6, max: 48, step: 1, suffix: 'px' },
      { kind: 'range', key: 'spacing', label: 'Spacing', min: 0, max: 2, step: 0.05 },
      { kind: 'range', key: 'density', label: 'Glyph density', min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    title: 'Colour',
    description: 'Glitch palette and base colours. Empty values follow the theme.',
    fields: [
      { kind: 'palette', key: 'glitchColors', label: 'Glitch palette', max: 8 },
      { kind: 'optional-color', key: 'baseColor', label: 'Base colour' },
      { kind: 'optional-color', key: 'backgroundColor', label: 'Background colour' },
    ],
  },
  {
    title: 'Motion',
    description: 'Glitch energy, fade and intro.',
    fields: [
      { kind: 'range', key: 'speed', label: 'Glitch speed', min: 0.05, max: 10, step: 0.05 },
      { kind: 'range', key: 'glitchAmount', label: 'Glitch amount', min: 0, max: 1, step: 0.05 },
      { kind: 'range', key: 'baseOpacity', label: 'Base opacity', min: 0, max: 1, step: 0.05 },
      { kind: 'range', key: 'flow', label: 'Flow', min: 0, max: 1, step: 0.05 },
      { kind: 'range', key: 'edgeFade', label: 'Edge fade', min: 0, max: 0.5, step: 0.05 },
      { kind: 'range', key: 'centerFade', label: 'Centre fade', min: 0, max: 1, step: 0.05 },
      { kind: 'toggle', key: 'smooth', label: 'Smooth fades', description: 'Blend glyph changes instead of snapping.' },
      { kind: 'toggle', key: 'intro', label: 'Intro reveal', description: 'Glyphs appear progressively on load.' },
    ],
  },
  {
    title: 'Interaction',
    description: 'Pointer radius and click effect.',
    fields: [
      { kind: 'toggle', key: 'interactive', label: 'Mouse interaction', description: 'Glyphs react around the cursor.' },
      { kind: 'range', key: 'cursorRadius', label: 'Cursor radius', min: 20, max: 500, step: 10, suffix: 'px' },
      { kind: 'select', key: 'clickEffect', label: 'Click effect', options: LETTER_GLITCH_CLICK_EFFECTS },
    ],
  },
]

const HYPERSPEED_GROUPS: SettingsGroup<keyof HyperspeedSettings & string>[] = [
  {
    title: 'Road',
    description: 'Curve shape, field of view and lane geometry.',
    fields: [
      { kind: 'select', key: 'curve', label: 'Curve', options: HYPERSPEED_CURVES },
      { kind: 'range', key: 'curvature', label: 'Curvature', min: 0, max: 5, step: 0.1 },
      { kind: 'range', key: 'speed', label: 'Speed', min: 0, max: 5, step: 0.1 },
      { kind: 'range', key: 'boost', label: 'Boost', min: 1, max: 10, step: 0.5 },
      { kind: 'range', key: 'fov', label: 'Field of view', min: 20, max: 170, step: 1 },
      { kind: 'range', key: 'boostFov', label: 'Boost field of view', min: 20, max: 170, step: 1 },
      { kind: 'range', key: 'lanes', label: 'Lanes', min: 1, max: 8, step: 1 },
      { kind: 'range', key: 'roadWidth', label: 'Road width', min: 1, max: 30, step: 0.5 },
      { kind: 'range', key: 'medianWidth', label: 'Median width', min: 0, max: 10, step: 0.5 },
    ],
  },
  {
    title: 'Traffic & light',
    description: 'Car density, trails and glow.',
    fields: [
      { kind: 'range', key: 'density', label: 'Traffic density', min: 0, max: 200, step: 1 },
      { kind: 'range', key: 'trailLength', label: 'Trail length', min: 0.05, max: 5, step: 0.05 },
      { kind: 'range', key: 'lightSize', label: 'Light size', min: 0.1, max: 5, step: 0.1 },
      { kind: 'range', key: 'glow', label: 'Glow', min: 0, max: 3, step: 0.05 },
      { kind: 'range', key: 'reflections', label: 'Reflections', min: 0, max: 2, step: 0.05 },
      { kind: 'range', key: 'steer', label: 'Steering', min: 0, max: 2, step: 0.05 },
      { kind: 'toggle', key: 'interactive', label: 'Mouse interaction', description: 'Steer the car with the pointer.' },
    ],
  },
  {
    title: 'Scenery',
    description: 'Poles and atmospheric dust.',
    fields: [
      { kind: 'range', key: 'poles', label: 'Poles', min: 0, max: 100, step: 1 },
      { kind: 'range', key: 'poleHeight', label: 'Pole height', min: 0.1, max: 4, step: 0.1 },
      { kind: 'range', key: 'dust', label: 'Dust', min: 0, max: 400, step: 5 },
    ],
  },
  {
    title: 'Palette',
    description: 'Tail, head and pole colours. Empty values follow the theme.',
    fields: [
      { kind: 'palette', key: 'tailColors', label: 'Tail colours', max: 8 },
      { kind: 'palette', key: 'headColors', label: 'Head colours', max: 8 },
      { kind: 'palette', key: 'poleColors', label: 'Pole colours', max: 8 },
      { kind: 'optional-color', key: 'roadColor', label: 'Road colour' },
      { kind: 'optional-color', key: 'lineColor', label: 'Line colour' },
      { kind: 'optional-color', key: 'background', label: 'Background colour' },
      { kind: 'range', key: 'roadOpacity', label: 'Road opacity', min: 0, max: 1, step: 0.05 },
    ],
  },
]

const LIGHTNING_GROUPS: SettingsGroup<keyof LightningSettings & string>[] = [
  {
    title: 'Strike shape',
    description: 'Bolt count, spread, branchiness and geometry.',
    fields: [
      { kind: 'color', key: 'color', label: 'Bolt colour' },
      { kind: 'range', key: 'bolts', label: 'Bolt count', min: 1, max: 8, step: 1 },
      { kind: 'range', key: 'spread', label: 'Spread', min: 0, max: 3, step: 0.05 },
      { kind: 'range', key: 'branches', label: 'Branches', min: 0, max: 1, step: 0.05 },
      { kind: 'range', key: 'xOffset', label: 'Horizontal offset', min: -2, max: 2, step: 0.05 },
      { kind: 'range', key: 'angle', label: 'Angle', min: -180, max: 180, step: 1, suffix: '°' },
      { kind: 'range', key: 'size', label: 'Strike size', min: 0.2, max: 4, step: 0.1 },
      { kind: 'range', key: 'thickness', label: 'Thickness', min: 0.2, max: 6, step: 0.1 },
    ],
  },
  {
    title: 'Energy',
    description: 'Glow, flicker and fade.',
    fields: [
      { kind: 'range', key: 'glow', label: 'Glow', min: 0, max: 3, step: 0.05 },
      { kind: 'range', key: 'intensity', label: 'Intensity', min: 0, max: 3, step: 0.05 },
      { kind: 'range', key: 'speed', label: 'Strike frequency', min: 0.1, max: 5, step: 0.1 },
      { kind: 'range', key: 'flicker', label: 'Flicker', min: 0, max: 1, step: 0.05 },
      { kind: 'range', key: 'fade', label: 'Fade', min: 0, max: 1, step: 0.05 },
      { kind: 'range', key: 'opacity', label: 'Opacity', min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    title: 'Interaction',
    description: 'Pointer and click behaviour.',
    fields: [
      { kind: 'toggle', key: 'mouseInteraction', label: 'Mouse interaction', description: 'Strikes follow the pointer.' },
      { kind: 'range', key: 'mouseStrength', label: 'Mouse strength', min: 0, max: 3, step: 0.05 },
      { kind: 'toggle', key: 'clickStrike', label: 'Click strike', description: 'Trigger a strike when the hero is clicked.' },
      { kind: 'toggle', key: 'intro', label: 'Intro reveal', description: 'Build the storm on first load.' },
      { kind: 'toggle', key: 'paused', label: 'Pause animation', description: 'Freeze the current bolt.' },
    ],
  },
]

const SIDE_RAYS_GROUPS: SettingsGroup<keyof SideRaysSettings & string>[] = [
  {
    title: 'Rays',
    description: 'Origin, palette, density and spread.',
    fields: [
      { kind: 'color', key: 'rayColor1', label: 'Ray colour 1' },
      { kind: 'color', key: 'rayColor2', label: 'Ray colour 2' },
      { kind: 'select', key: 'origin', label: 'Origin', options: SIDE_RAYS_ORIGINS },
      { kind: 'range', key: 'density', label: 'Ray count', min: 1, max: 40, step: 1 },
      { kind: 'range', key: 'spread', label: 'Spread', min: 0.1, max: 8, step: 0.1 },
      { kind: 'range', key: 'intensity', label: 'Intensity', min: 0, max: 5, step: 0.1 },
      { kind: 'range', key: 'speed', label: 'Speed', min: 0, max: 10, step: 0.1 },
      { kind: 'range', key: 'blend', label: 'Colour blend', min: 0, max: 1, step: 0.05 },
      { kind: 'range', key: 'sharpness', label: 'Sharpness', min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    title: 'Light',
    description: 'Glow, falloff, saturation, tilt and opacity.',
    fields: [
      { kind: 'range', key: 'glow', label: 'Glow', min: 0, max: 5, step: 0.1 },
      { kind: 'range', key: 'falloff', label: 'Falloff', min: 0.2, max: 6, step: 0.1 },
      { kind: 'range', key: 'saturation', label: 'Saturation', min: 0, max: 3, step: 0.1 },
      { kind: 'range', key: 'opacity', label: 'Opacity', min: 0, max: 1, step: 0.05 },
      { kind: 'range', key: 'tilt', label: 'Tilt', min: -180, max: 180, step: 1, suffix: '°' },
    ],
  },
  {
    title: 'Motion',
    description: 'Dust and pointer response.',
    fields: [
      { kind: 'range', key: 'dust', label: 'Dust', min: 0, max: 1, step: 0.05 },
      { kind: 'toggle', key: 'followMouse', label: 'Follow pointer', description: 'Rays drift with the cursor.' },
      { kind: 'range', key: 'mouseInfluence', label: 'Pointer influence', min: 0, max: 1, step: 0.05 },
      { kind: 'toggle', key: 'intro', label: 'Intro reveal', description: 'Rays fade in on first load.' },
    ],
  },
]

const PARTICLE_GROUPS: SettingsGroup<keyof ParticleSettings & string>[] = [
  {
    title: 'Count & shape',
    description: 'Full particles.js v2 field: particle count, density area, shape and size.',
    fields: [
      { kind: 'range', key: 'number', label: 'Particle count', min: 10, max: 1000, step: 10 },
      { kind: 'toggle', key: 'densityEnable', label: 'Density scaling', description: 'Scale the particle count with the canvas area.' },
      { kind: 'range', key: 'densityArea', label: 'Density area', min: 100, max: 3000, step: 50 },
      { kind: 'select', key: 'shapeType', label: 'Shape', options: PARTICLE_SHAPES },
      { kind: 'range', key: 'shapeStrokeWidth', label: 'Shape stroke width', min: 0, max: 10, step: 0.5 },
      { kind: 'color', key: 'shapeStrokeColor', label: 'Shape stroke colour' },
      { kind: 'range', key: 'polygonSides', label: 'Polygon sides', min: 3, max: 12, step: 1 },
      { kind: 'range', key: 'size', label: 'Particle size', min: 0.1, max: 30, step: 0.1 },
      { kind: 'toggle', key: 'sizeRandom', label: 'Random size', description: 'Vary particle size randomly.' },
      { kind: 'toggle', key: 'sizeAnimEnable', label: 'Animate size', description: 'Pulse particle sizes over time.' },
      { kind: 'range', key: 'sizeAnimSpeed', label: 'Size animation speed', min: 0, max: 10, step: 0.1 },
      { kind: 'range', key: 'sizeAnimMin', label: 'Minimum size', min: 0.1, max: 30, step: 0.1 },
      { kind: 'toggle', key: 'sizeAnimSync', label: 'Sync size animation', description: 'Animate every particle in step.' },
      {
        kind: 'text',
        key: 'imageSrc',
        label: 'Image URL',
        placeholder: 'https://example.com/sprite.png',
        description: 'Used when the shape is set to image. Leave empty to keep circles.',
      },
      { kind: 'range', key: 'imageWidth', label: 'Image width ratio', min: 10, max: 400, step: 1 },
      { kind: 'range', key: 'imageHeight', label: 'Image height ratio', min: 10, max: 400, step: 1 },
    ],
  },
  {
    title: 'Colour & opacity',
    description: 'Particle colour and opacity animation.',
    fields: [
      { kind: 'optional-color', key: 'color', label: 'Particle colour' },
      { kind: 'range', key: 'opacity', label: 'Opacity', min: 0, max: 1, step: 0.05 },
      { kind: 'toggle', key: 'opacityRandom', label: 'Random opacity', description: 'Vary particle opacity randomly.' },
      { kind: 'toggle', key: 'opacityAnimEnable', label: 'Animate opacity', description: 'Fade particles in and out.' },
      { kind: 'range', key: 'opacityAnimSpeed', label: 'Opacity animation speed', min: 0, max: 10, step: 0.1 },
      { kind: 'range', key: 'opacityAnimMin', label: 'Minimum opacity', min: 0, max: 1, step: 0.05 },
      { kind: 'toggle', key: 'opacityAnimSync', label: 'Sync opacity animation', description: 'Animate every particle in step.' },
    ],
  },
  {
    title: 'Linked lines',
    description: 'The connecting lines between nearby particles.',
    fields: [
      { kind: 'toggle', key: 'lineLinkedEnable', label: 'Show linked lines', description: 'Draw lines between nearby particles.' },
      { kind: 'range', key: 'lineLinkedDistance', label: 'Link distance', min: 0, max: 1000, step: 10 },
      { kind: 'optional-color', key: 'lineLinkedColor', label: 'Line colour' },
      { kind: 'range', key: 'lineLinkedOpacity', label: 'Line opacity', min: 0, max: 1, step: 0.05 },
      { kind: 'range', key: 'lineLinkedWidth', label: 'Line width', min: 0, max: 10, step: 0.5 },
    ],
  },
  {
    title: 'Motion',
    description: 'Drift direction, speed, wrapping and attraction.',
    fields: [
      { kind: 'toggle', key: 'moveEnable', label: 'Enable motion', description: 'Let particles drift across the canvas.' },
      { kind: 'range', key: 'moveSpeed', label: 'Drift speed', min: 0, max: 20, step: 0.1 },
      { kind: 'select', key: 'moveDirection', label: 'Direction', options: PARTICLE_MOVE_DIRECTIONS },
      { kind: 'toggle', key: 'moveRandom', label: 'Random direction', description: 'Give each particle its own heading.' },
      { kind: 'toggle', key: 'moveStraight', label: 'Straight motion', description: 'Move in straight lines without drift.' },
      { kind: 'select', key: 'moveOutMode', label: 'Out of bounds', options: PARTICLE_OUT_MODES },
      { kind: 'toggle', key: 'moveBounce', label: 'Bounce at edges', description: 'Bounce particles back instead of wrapping.' },
      { kind: 'toggle', key: 'moveAttractEnable', label: 'Attract to pointer', description: 'Orbit particles around the cursor.' },
      { kind: 'range', key: 'moveAttractRotateX', label: 'Attract rotate X', min: 0, max: 20000, step: 100 },
      { kind: 'range', key: 'moveAttractRotateY', label: 'Attract rotate Y', min: 0, max: 20000, step: 100 },
    ],
  },
  {
    title: 'Interaction',
    description: 'Hover, click, repulse and bubble behaviour.',
    fields: [
      { kind: 'select', key: 'detectOn', label: 'Pointer detection', options: PARTICLE_DETECT_ON },
      { kind: 'toggle', key: 'hoverEnable', label: 'Hover interaction', description: 'React while the pointer is over the canvas.' },
      { kind: 'select', key: 'hoverMode', label: 'Hover mode', options: PARTICLE_HOVER_MODES },
      { kind: 'toggle', key: 'clickEnable', label: 'Click interaction', description: 'React when the hero is clicked.' },
      { kind: 'select', key: 'clickMode', label: 'Click mode', options: PARTICLE_CLICK_MODES },
      { kind: 'toggle', key: 'resize', label: 'Resize on window change', description: 'Rebuild the field when the viewport changes.' },
      { kind: 'range', key: 'grabDistance', label: 'Grab distance', min: 0, max: 500, step: 10 },
      { kind: 'range', key: 'grabLineOpacity', label: 'Grab line opacity', min: 0, max: 1, step: 0.05 },
      { kind: 'range', key: 'bubbleDistance', label: 'Bubble distance', min: 0, max: 500, step: 10 },
      { kind: 'range', key: 'bubbleSize', label: 'Bubble size', min: 0, max: 40, step: 1 },
      { kind: 'range', key: 'bubbleDuration', label: 'Bubble duration', min: 0, max: 20, step: 0.1 },
      { kind: 'range', key: 'bubbleOpacity', label: 'Bubble opacity', min: 0, max: 1, step: 0.05 },
      { kind: 'range', key: 'repulseDistance', label: 'Repulse distance', min: 0, max: 500, step: 10 },
      { kind: 'range', key: 'repulseDuration', label: 'Repulse duration', min: 0, max: 10, step: 0.05 },
      { kind: 'range', key: 'pushCount', label: 'Click push count', min: 0, max: 50, step: 1 },
      { kind: 'range', key: 'removeCount', label: 'Click remove count', min: 0, max: 50, step: 1 },
      { kind: 'toggle', key: 'retinaDetect', label: 'Retina detect', description: 'Render at device pixel ratio for crisp lines.' },
    ],
  },
]

export default function HeroBackgroundPage() {
  const qc = useQueryClient()
  const [form, setForm] = useState<HeroBackgroundSettings>(DEFAULT_HERO_BACKGROUND_SETTINGS)
  const [formReady, setFormReady] = useState(false)
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
    if (saved) {
      setForm(saved)
      setFormReady(true)
    }
  }, [saved])

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const updateAntigravity = (patch: Partial<AntigravitySettings>) =>
    setForm((f) => ({ ...f, antigravity: { ...f.antigravity, ...patch } }))
  const updateParticles = (patch: Partial<ParticleSettings>) =>
    setForm((f) => ({ ...f, particles: { ...f.particles, ...patch } }))
  const updateGalaxy = (patch: Partial<GalaxySettings>) =>
    setForm((f) => ({ ...f, galaxy: { ...f.galaxy, ...patch } }))
  const updateLetterGlitch = (patch: Partial<LetterGlitchSettings>) =>
    setForm((f) => ({ ...f, letterGlitch: { ...f.letterGlitch, ...patch } }))
  const updateHyperspeed = (patch: Partial<HyperspeedSettings>) =>
    setForm((f) => ({ ...f, hyperspeed: { ...f.hyperspeed, ...patch } }))
  const updateLightning = (patch: Partial<LightningSettings>) =>
    setForm((f) => ({ ...f, lightning: { ...f.lightning, ...patch } }))
  const updateSideRays = (patch: Partial<SideRaysSettings>) =>
    setForm((f) => ({ ...f, sideRays: { ...f.sideRays, ...patch } }))

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

          {form.style === 'particles' && PARTICLE_GROUPS.map((group) => (
            <Section key={group.title} title={`Particles · ${group.title}`} description={group.description}>
              <SettingsFields fields={group.fields} value={form.particles} onChange={updateParticles} />
            </Section>
          ))}

          {form.style === 'galaxy' && GALAXY_GROUPS.map((group) => (
            <Section key={group.title} title={`Galaxy · ${group.title}`} description={group.description}>
              <SettingsFields fields={group.fields} value={form.galaxy} onChange={updateGalaxy} />
            </Section>
          ))}

          {form.style === 'letter-glitch' && LETTER_GLITCH_GROUPS.map((group) => (
            <Section key={group.title} title={`Letter Glitch · ${group.title}`} description={group.description}>
              <SettingsFields fields={group.fields} value={form.letterGlitch} onChange={updateLetterGlitch} />
            </Section>
          ))}

          {form.style === 'hyperspeed' && HYPERSPEED_GROUPS.map((group) => (
            <Section key={group.title} title={`Hyperspeed · ${group.title}`} description={group.description}>
              <SettingsFields fields={group.fields} value={form.hyperspeed} onChange={updateHyperspeed} />
            </Section>
          ))}

          {form.style === 'lightning' && LIGHTNING_GROUPS.map((group) => (
            <Section key={group.title} title={`Lightning · ${group.title}`} description={group.description}>
              <SettingsFields fields={group.fields} value={form.lightning} onChange={updateLightning} />
            </Section>
          ))}

          {form.style === 'side-rays' && SIDE_RAYS_GROUPS.map((group) => (
            <Section key={group.title} title={`Side Rays · ${group.title}`} description={group.description}>
              <SettingsFields fields={group.fields} value={form.sideRays} onChange={updateSideRays} />
            </Section>
          ))}

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
              {formReady && form.enabled && <HeroBackground settings={form} isDark={isDark} />}
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
