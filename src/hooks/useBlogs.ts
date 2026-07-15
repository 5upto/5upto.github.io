import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Blog } from '../types/database'

export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data as Blog[]
    },
  })
}
