import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Resume } from '../types/database'

// The one resume the portfolio links to. Returns null when nothing is flagged
// live, which the hero uses to hide the button rather than link to a dead file.
export function useLiveResume() {
  return useQuery({
    queryKey: ['live-resume'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('is_live', true)
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return (data as Resume | null) ?? null
    },
  })
}
