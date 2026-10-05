import {
  MdHome,
  MdInfo,
  MdCode,
  MdWork,
  MdFolderOpen,
  MdPhotoLibrary,
  MdArticle,
  MdEmail,
  MdLabelOutline,
} from 'react-icons/md'
import type { IconType } from 'react-icons'

// Statically imported (not lazy-loaded like the skills section) because the
// navbar renders above the fold and a dynamic import would flash empty buttons.
const iconByLabel: Record<string, IconType> = {
  home: MdHome,
  about: MdInfo,
  skills: MdCode,
  experience: MdWork,
  projects: MdFolderOpen,
  gallery: MdPhotoLibrary,
  blog: MdArticle,
  contact: MdEmail,
}

// href last segment, so '#projects' and '/projects' resolve the same way.
const iconBySegment: Record<string, IconType> = {
  hero: MdHome,
  about: MdInfo,
  skills: MdCode,
  experience: MdWork,
  projects: MdFolderOpen,
  gallery: MdPhotoLibrary,
  blog: MdArticle,
  contact: MdEmail,
}

export function getNavIcon(label: string, href: string): IconType {
  const byLabel = iconByLabel[label.trim().toLowerCase()]
  if (byLabel) return byLabel

  const segment = href.split('#')[1]?.split('?')[0].replace(/^\/+|\/+$/g, '') ?? ''
  const bySegment = iconBySegment[segment.toLowerCase()]
  if (bySegment) return bySegment

  const slug = label.trim().toLowerCase().replace(/\s+/g, '')
  return iconBySegment[slug] ?? MdLabelOutline
}
