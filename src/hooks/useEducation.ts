import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Education, Certification, Publication } from '../types/database'

export function useEducation() {
  return useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const [eduRes, certRes, pubRes] = await Promise.all([
        supabase.from('education').select('*').order('sort_order', { ascending: true }),
        supabase.from('certifications').select('*').order('sort_order', { ascending: true }),
        supabase.from('publications').select('*').limit(1).single(),
      ])
      if (eduRes.error) throw eduRes.error
      if (certRes.error) throw certRes.error
      if (pubRes.error) throw pubRes.error
      return {
        education: eduRes.data as Education[],
        certifications: certRes.data as Certification[],
        publication: pubRes.data as Publication,
      }
    },
  })
}
