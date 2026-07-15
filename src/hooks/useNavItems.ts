import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { NavItem } from '../types/database'

export function useNavItems() {
  return useQuery({
    queryKey: ['nav_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nav_items')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data as NavItem[]
    },
  })
}
