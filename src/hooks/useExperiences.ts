import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Experience } from '../types/database'

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data as Experience[]
    },
  })
}
