import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { sortByDate } from '../lib/sortByDate'
import type { GalleryStory } from '../types/database'

/** All photos on a story, falling back to the legacy single `image` column. */
export function galleryPhotos(story: Pick<GalleryStory, 'photos' | 'image'>): string[] {
  const photos = Array.isArray(story.photos) ? story.photos.filter(Boolean) : []
  if (photos.length) {
    return story.image && !photos.includes(story.image) ? [story.image, ...photos] : photos
  }
  return story.image ? [story.image] : []
}

/** The photo that represents the story in the circular gallery. */
export function galleryCover(story: Pick<GalleryStory, 'photos' | 'image'>): string {
  if (story.image) return story.image
  return galleryPhotos(story)[0] ?? ''
}

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
