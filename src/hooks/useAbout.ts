import { useMemo } from 'react'
import { useProfile } from './useProfile'
import { useExperiences } from './useExperiences'
import { useEducation } from './useEducation'
import { useProjects } from './useProjects'
import { useJobTitle } from './useJobTitle'
import { buildAboutHighlights, buildAboutParagraph } from '../lib/aboutGenerator'

/**
 * Derives the About section copy and stat cards from the visitor's real content.
 * Every sentence and every number comes from the tables, so the section
 * updates itself as experiences / education / certifications change in admin.
 */
export function useAbout() {
  const { data: profile } = useProfile()
  const { data: experiences, isLoading: expLoading } = useExperiences()
  const { data: educationBundle, isLoading: eduLoading } = useEducation()
  const { data: projects, isLoading: projLoading } = useProjects()
  const jobTitle = useJobTitle()

  const education = educationBundle?.education ?? []
  const certifications = educationBundle?.certifications ?? []
  const publications = educationBundle?.publications ?? []

  const isLoading = expLoading || eduLoading || projLoading

  const content = useMemo(
    () => ({ experiences: experiences ?? [], education, certifications, publications, projects: projects ?? [] }),
    [experiences, education, certifications, publications, projects],
  )

  const paragraph = useMemo(
    () => buildAboutParagraph(profile, content, jobTitle) || profile?.bio || '',
    [profile, content, jobTitle],
  )

  const highlights = useMemo(() => buildAboutHighlights(content), [content])

  return { paragraph, highlights, isLoading }
}
