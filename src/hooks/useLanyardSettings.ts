import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { DEFAULT_LANYARD_SETTINGS, normalizeLanyardSettings } from '../lib/lanyardCard'
import type { LanyardSettings } from '../types/database'

export const LANYARD_SETTINGS_KEY = ['site-config', 'lanyard'] as const

async function fetchLanyardSettings(): Promise<LanyardSettings> {
  const { data, error } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'lanyard')
    .maybeSingle()
  if (error) throw error
  return normalizeLanyardSettings(data?.value)
}

/** Public lanyard appearance settings, stored in site_config under the "lanyard" key. */
export function useLanyardSettings() {
  const query = useQuery({
    queryKey: LANYARD_SETTINGS_KEY,
    queryFn: fetchLanyardSettings,
    staleTime: 1000 * 60 * 5,
  })

  return {
    ...query,
    data: query.data ?? DEFAULT_LANYARD_SETTINGS,
  }
}
