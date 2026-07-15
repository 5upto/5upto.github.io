import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { GalleryStory } from '../types/database'

export function useGallery() {
  return useQuery({
    queryKey: ['gallery_stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_stories')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data as GalleryStory[]
    },
  })
}
