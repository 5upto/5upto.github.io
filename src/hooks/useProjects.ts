import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { sortByDate } from '../lib/sortByDate'
import type { Project } from '../types/database'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
      if (error) throw error
      return sortByDate(data as Project[], 'period')
    },
  })
}
