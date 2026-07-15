import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { sortByDate } from '../lib/sortByDate'
import type { Education, Certification, Publication } from '../types/database'

export function useEducation() {
  return useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const [eduRes, certRes, pubRes] = await Promise.all([
        supabase.from('education').select('*'),
        supabase.from('certifications').select('*').order('created_at', { ascending: false }),
        supabase.from('publications').select('*'),
      ])
      if (eduRes.error) throw eduRes.error
      if (certRes.error) throw certRes.error
      if (pubRes.error) throw pubRes.error
      return {
        education: sortByDate(eduRes.data as Education[], 'year'),
        certifications: certRes.data as Certification[],
        publications: sortByDate(pubRes.data as Publication[], 'date'),
      }
    },
  })
}
