import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { sortByDate } from '../lib/sortByDate'
import type { Experience } from '../types/database'

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
      if (error) throw error
      return sortByDate(data as Experience[], 'period')
    },
  })
}
