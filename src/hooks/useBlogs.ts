import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { sortByDate } from '../lib/sortByDate'
import type { Blog } from '../types/database'

export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
      if (error) throw error
      return sortByDate(data as Blog[], 'date')
    },
  })
}
