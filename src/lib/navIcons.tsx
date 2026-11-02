import {
  MdHome,
  MdOutlineHome,
  MdInfo,
  MdOutlineInfo,
  MdCode,
  MdWork,
  MdWorkOutline,
  MdFolder,
  MdOutlineFolder,
  MdPhotoLibrary,
  MdOutlinePhotoLibrary,
  MdArticle,
  MdOutlineArticle,
  MdEmail,
  MdOutlineEmail,
  MdLabel,
  MdOutlineLabel,
  MdPerson,
  MdOutlinePerson,
  MdPictureAsPdf,
  MdOutlinePictureAsPdf,
  MdSchool,
  MdOutlineSchool,
  MdWorkspacePremium,
  MdOutlineWorkspacePremium,
  MdLibraryBooks,
  MdOutlineLibraryBooks,
  MdLink,
  MdOutlineLink,
  MdMenu,
  MdCloudUpload,
  MdOutlineCloudUpload,
} from 'react-icons/md'
import type { IconPair } from '../components/AdaptiveIcon'

export type NavIcon = IconPair

/**
 * Single source of truth for section icons, shared by the portfolio navbar and
 * the admin menu so the same section always gets the same icon.
 *
 * Only Material icons whose outlined and filled glyphs actually differ are
 * used here; the code glyph has no separate outline variant, so it is stroked
 * for its outlined state instead.
 */
export const sectionIcons = {
  home: { outline: MdOutlineHome, filled: MdHome },
  about: { outline: MdOutlineInfo, filled: MdInfo },
  skills: { outline: MdCode, filled: MdCode, strokeOutline: true },
  experience: { outline: MdWorkOutline, filled: MdWork },
  projects: { outline: MdOutlineFolder, filled: MdFolder },
  gallery: { outline: MdOutlinePhotoLibrary, filled: MdPhotoLibrary },
  blog: { outline: MdOutlineArticle, filled: MdArticle },
  contact: { outline: MdOutlineEmail, filled: MdEmail },
  profile: { outline: MdOutlinePerson, filled: MdPerson },
  resume: { outline: MdOutlinePictureAsPdf, filled: MdPictureAsPdf },
  education: { outline: MdOutlineSchool, filled: MdSchool },
  certifications: { outline: MdOutlineWorkspacePremium, filled: MdWorkspacePremium },
  publications: { outline: MdOutlineLibraryBooks, filled: MdLibraryBooks },
  socialLinks: { outline: MdOutlineLink, filled: MdLink },
  navItems: { outline: MdMenu, filled: MdMenu, strokeOutline: true },
  storage: { outline: MdOutlineCloudUpload, filled: MdCloudUpload },
} satisfies Record<string, NavIcon>

const labelToSection: Record<string, keyof typeof sectionIcons> = {
  home: 'home',
  about: 'about',
  skills: 'skills',
  experience: 'experience',
  experiences: 'experience',
  projects: 'projects',
  gallery: 'gallery',
  blog: 'blog',
  blogs: 'blog',
  contact: 'contact',
}

// href last segment, so '#projects' and '/projects' resolve the same way.
const segmentToSection: Record<string, keyof typeof sectionIcons> = {
  hero: 'home',
  home: 'home',
  about: 'about',
  skills: 'skills',
  experience: 'experience',
  projects: 'projects',
  gallery: 'gallery',
  blog: 'blog',
  blogs: 'blog',
  contact: 'contact',
}

const fallbackIcon: NavIcon = { outline: MdOutlineLabel, filled: MdLabel }

export function getNavIcon(label: string, href: string): NavIcon {
  const byLabel = labelToSection[label.trim().toLowerCase()]
  if (byLabel) return sectionIcons[byLabel]

  const segment = href.split('#')[1]?.split('?')[0].replace(/^\/+|\/+$/g, '') ?? ''
  const bySegment = segmentToSection[segment.toLowerCase()]
  if (bySegment) return sectionIcons[bySegment]

  const slug = label.trim().toLowerCase().replace(/\s+/g, '')
  const bySlug = segmentToSection[slug]
  return bySlug ? sectionIcons[bySlug] : fallbackIcon
}
