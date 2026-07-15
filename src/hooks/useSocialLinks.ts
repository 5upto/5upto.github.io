import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { SocialLink } from '../types/database'

export function useSocialLinks() {
  return useQuery({
    queryKey: ['social_links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as SocialLink[]
    },
  })
}
