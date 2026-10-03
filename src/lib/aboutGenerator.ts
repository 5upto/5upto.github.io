import { parsePeriodRange } from './sortByDate'
import type { AboutHighlight, Certification, Education, Experience, Profile, Project, Publication } from '../types/database'

const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30.44

export type ExperienceSpan = { years: number; months: number }

export type AboutContent = {
  experiences: Experience[]
  education: Education[]
  certifications: Certification[]
  publications: Publication[]
  projects: Project[]
}

/**
 * Total professional experience as a merged span, so overlapping roles
 * (e.g. an internship during a full-time stint) are never double counted.
 */
export function computeExperienceSpan(experiences: Experience[]): ExperienceSpan {
  const ranges = experiences
    .map(e => parsePeriodRange(e.period ?? ''))
    .filter((r): r is { start: number; end: number } => r !== null && r.end > r.start)
    .sort((a, b) => a.start - b.start)

  if (!ranges.length) return { years: 0, months: 0 }

  const merged: { start: number; end: number }[] = []
  for (const range of ranges) {
    const last = merged[merged.length - 1]
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end)
    } else {
      merged.push({ ...range })
    }
  }

  const totalMonths = merged.reduce((sum, r) => sum + (r.end - r.start) / MS_PER_MONTH, 0)
  return { years: Math.floor(totalMonths / 12), months: Math.round(totalMonths) }
}

export function formatExperienceSpan({ years, months }: ExperienceSpan): string {
  if (years >= 1) return `${years}+ Years`
  if (months >= 1) return `${months} Months`
  return '0'
}

/** "Data Engineer" → "a Data Engineer", "Engineer" → "an Engineer" */
function withArticle(phrase: string): string {
  const text = phrase.trim()
  if (!text) return ''
  const first = text[0].toLowerCase()
  return `${/[aeiou]/.test(first) ? 'an' : 'a'} ${text}`
}

function list(items: string[], conjunction = 'and'): string {
  const seen = new Set<string>()
  const clean = items.map(i => i.trim()).filter(i => {
    if (!i) return false
    const key = i.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  if (!clean.length) return ''
  if (clean.length === 1) return clean[0]
  if (clean.length === 2) return `${clean[0]} ${conjunction} ${clean[1]}`
  return `${clean.slice(0, -1).join(', ')}, ${conjunction} ${clean[clean.length - 1]}`
}

function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

/** "Microsoft Certified: Fabric Data Engineer Associate (DP-700)" → "Fabric Data Engineer Associate (DP-700)" */
function shortenCredential(name: string): string {
  const trimmed = name.trim()
  const colon = trimmed.indexOf(':')
  return colon === -1 ? trimmed : trimmed.slice(colon + 1).trim()
}

/** Collapse whitespace and strip trailing punctuation, preserving acronyms like AI / REST. */
function tidy(text: string): string {
  return text.trim().replace(/\s+/g, ' ').replace(/[.\s]+$/, '')
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

/** Appends a full stop without doubling up on punctuation that is already there. */
function sentence(text: string): string {
  const clean = tidy(text)
  if (!clean) return ''
  return /[.!?]$/.test(clean) ? clean : `${clean}.`
}

function joinSentences(parts: (string | null | undefined)[]): string {
  return parts
    .map(part => (part ? sentence(part) : ''))
    .filter(Boolean)
    .join(' ')
}

export function buildAboutParagraph(
  profile: Profile | undefined,
  { experiences, education, certifications, publications, projects }: AboutContent,
  jobTitle: string,
): string {
  if (!profile) return ''

  const currentExp = experiences[0]
  const span = computeExperienceSpan(experiences)
  const degree = education[0]
  const pastCompanies = experiences.slice(1).map(e => e.company)
  const credentials = certifications.map(c => c.name)
  const focus = currentExp?.points?.[0]
  const keywords = publications[0]?.keywords?.slice(0, 3) ?? []

  const opener = [
    jobTitle ? `I'm ${withArticle(jobTitle)}` : `I'm ${profile.name}`,
    profile.location ? `based in ${profile.location}` : '',
    currentExp ? `currently working as ${withArticle(currentExp.role)} at ${tidy(currentExp.company)}` : '',
  ]
    .filter(Boolean)
    .join(', ')

  return joinSentences([
    opener,
    focus ? `My current focus is ${lowerFirst(tidy(focus))}` : '',
    span.months >= 1
      ? `I have ${formatExperienceSpan(span).toLowerCase()} of professional experience${
          pastCompanies.length ? `, including ${list(pastCompanies)}` : ''
        }`
      : '',
    degree
      ? `I hold ${withArticle(degree.degree)} in ${degree.subject} from ${degree.institution}${
          degree.year ? `, earned in ${degree.year}` : ''
        }`
      : '',
    credentials.length
      ? `I hold ${plural(credentials.length, 'professional certification')}, including ${list(
          credentials.slice(0, 2).map(shortenCredential),
        )}${credentials.length > 2 ? ', among others' : ''}`
      : '',
    publications.length
      ? `I have published ${publications.length === 1 ? 'a paper' : plural(publications.length, 'paper')}${
          keywords.length ? ` on ${list(keywords)}` : ''
        }`
      : '',
    projects.length
      ? `Alongside my professional work I have built ${plural(projects.length, 'project')}${
          projects[0]?.title ? `, including ${projects[0].title}` : ''
        }`
      : '',
  ])
}

export function buildAboutHighlights({
  experiences,
  certifications,
  publications,
  projects,
}: AboutContent): AboutHighlight[] {
  const span = computeExperienceSpan(experiences)

  return [
    { label: 'Experience', value: formatExperienceSpan(span) },
    { label: 'Projects', value: `${projects.length}` },
    { label: 'Publications', value: `${publications.length}` },
    { label: 'Certifications', value: `${certifications.length}` },
  ]
}
