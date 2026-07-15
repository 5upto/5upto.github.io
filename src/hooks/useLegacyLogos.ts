import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { LegacyLogo } from '../types/database'

export function useLegacyLogos() {
  return useQuery({
    queryKey: ['legacy_logos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legacy_logos')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as LegacyLogo[]
    },
  })
}
