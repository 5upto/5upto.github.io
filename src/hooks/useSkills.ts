import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Skill } from '../types/database'

export function useSkills() {
  return useQuery({
    queryKey: ['skills-v2'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data as Skill[]
    },
  })
}
