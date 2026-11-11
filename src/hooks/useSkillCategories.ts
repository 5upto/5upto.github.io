import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface SkillCategory {
  key: string
  label: string
}

export const SKILL_CATEGORIES_CONFIG_KEY = 'skill_categories'
export const SKILL_CATEGORIES_QUERY_KEY = ['site-config', SKILL_CATEGORIES_CONFIG_KEY] as const

export const DEFAULT_SKILL_CATEGORIES: SkillCategory[] = [
  { key: 'languages', label: 'Languages' },
  { key: 'web', label: 'Web Technologies' },
  { key: 'databases', label: 'Databases' },
]

const DEFAULT_LABELS: Record<string, string> = Object.fromEntries(
  DEFAULT_SKILL_CATEGORIES.map(category => [category.key, category.label])
)

export function slugifyCategoryKey(label: string): string {
  const slug = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'section'
}

export function uniqueCategoryKey(label: string, existingKeys: string[]): string {
  const base = slugifyCategoryKey(label)
  let key = base
  let suffix = 2
  while (existingKeys.includes(key)) {
    key = `${base}-${suffix}`
    suffix += 1
  }
  return key
}

export function humanizeCategoryKey(key: string): string {
  if (DEFAULT_LABELS[key]) return DEFAULT_LABELS[key]
  return key
    .split(/[-_]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function normalizeSkillCategories(value: unknown): SkillCategory[] {
  let list: unknown = value
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Record<string, unknown>
    if (Array.isArray(record.categories)) list = record.categories
  }
  if (!Array.isArray(list)) return DEFAULT_SKILL_CATEGORIES

  const seen = new Set<string>()
  const categories: SkillCategory[] = []
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const record = item as Record<string, unknown>
    const key = typeof record.key === 'string' ? record.key.trim() : ''
    const label = typeof record.label === 'string' ? record.label.trim() : ''
    if (!key || !label || seen.has(key)) continue
    seen.add(key)
    categories.push({ key, label })
  }

  return categories.length > 0 ? categories : DEFAULT_SKILL_CATEGORIES
}

export function mergeSkillCategories(categories: SkillCategory[], skillCategoryKeys: string[]): SkillCategory[] {
  const seen = new Set(categories.map(category => category.key))
  const extras: SkillCategory[] = []
  for (const key of skillCategoryKeys) {
    if (!key || seen.has(key)) continue
    seen.add(key)
    extras.push({ key, label: humanizeCategoryKey(key) })
  }
  return [...categories, ...extras]
}

export async function fetchSkillCategories(): Promise<SkillCategory[]> {
  const { data, error } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', SKILL_CATEGORIES_CONFIG_KEY)
    .maybeSingle()
  if (error) throw error
  return normalizeSkillCategories(data?.value)
}

export async function saveSkillCategories(categories: SkillCategory[]): Promise<void> {
  const { error } = await supabase
    .from('site_config')
    .upsert(
      { key: SKILL_CATEGORIES_CONFIG_KEY, value: { categories }, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )
  if (error) throw error
}

/** Section names for the skills area, stored in site_config. */
export function useSkillCategories() {
  const query = useQuery({
    queryKey: SKILL_CATEGORIES_QUERY_KEY,
    queryFn: fetchSkillCategories,
    staleTime: 1000 * 60 * 5,
  })

  return {
    ...query,
    data: query.data ?? DEFAULT_SKILL_CATEGORIES,
  }
}
