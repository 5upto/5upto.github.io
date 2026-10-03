import { useExperiences } from './useExperiences'
import { useProfile } from './useProfile'

/**
 * Job title shown across the site.
 * Derived from the most recent experience's role (experiences are sorted newest-first),
 * falling back to the manually set profile.title when there are no experiences.
 */
export function useJobTitle() {
  const { data: profile } = useProfile()
  const { data: experiences } = useExperiences()

  return experiences?.[0]?.role || profile?.title || ''
}
