import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { sortByDate } from '../lib/sortByDate'
import type { GalleryStory } from '../types/database'

export function useGallery() {
  return useQuery({
    queryKey: ['gallery_stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_stories')
        .select('*')
      if (error) throw error
      return sortByDate(data as GalleryStory[], 'period')
    },
  })
}
