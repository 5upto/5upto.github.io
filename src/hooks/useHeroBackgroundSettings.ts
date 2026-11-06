import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { DEFAULT_HERO_BACKGROUND_SETTINGS, normalizeHeroBackgroundSettings } from '../lib/heroBackground'
import type { HeroBackgroundSettings } from '../types/database'

export const HERO_BACKGROUND_SETTINGS_KEY = ['site-config', 'hero-background'] as const

async function fetchHeroBackgroundSettings(): Promise<HeroBackgroundSettings> {
  const { data, error } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'hero_background')
    .maybeSingle()
  if (error) throw error
  return normalizeHeroBackgroundSettings(data?.value)
}

/** Public hero background settings, stored in site_config under the "hero_background" key. */
export function useHeroBackgroundSettings() {
  const query = useQuery({
    queryKey: HERO_BACKGROUND_SETTINGS_KEY,
    queryFn: fetchHeroBackgroundSettings,
    staleTime: 1000 * 60 * 5,
  })

  return {
    ...query,
    data: query.data ?? DEFAULT_HERO_BACKGROUND_SETTINGS,
  }
}
