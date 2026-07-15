export interface Profile {
  id: string
  name: string
  title: string
  handle: string
  tagline: string
  status: string
  location: string
  bio: string
  avatar_url: string
  about_highlights: AboutHighlight[]
  created_at: string
  updated_at: string
}

export interface AboutHighlight {
  label: string
  value: string
}

export interface Experience {
  id: string
  role: string
  company: string
  logo: string
  location: string
  period: string
  slug: string
  points: string[]
  story: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  tagline: string
  period: string
  org: string
  image: string
  slug: string
  points: string[]
  tech: string[]
  story: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  degree: string
  subject: string
  institution: string
  logo: string
  year: string
  style: 'nit' | 'bangladesh'
  country_name: string
  board_name: string
  certificate_label: string
  signatory: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  name: string
  sort_order: number
  created_at: string
}

export interface Publication {
  id: string
  title: string
  authors: PublicationAuthor[]
  affiliations: string[]
  conference: string
  location: string
  date: string
  doi: string
  pages: string
  keywords: string[]
  abstract: string
  url: string
  created_at: string
  updated_at: string
}

export interface PublicationAuthor {
  name: string
  affil: number
}

export interface Skill {
  id: string
  label: string
  color: string
  icon_name: string
  category: 'languages' | 'web' | 'databases'
  sort_order: number
  created_at: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  label: string
  icon_svg: string
  sort_order: number
  created_at: string
}

export interface Blog {
  id: string
  title: string
  excerpt: string
  date: string
  image: string
  tags: string[]
  content: ContentBlock[]
  slug: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'image'; src: string; alt: string; caption?: string }

export interface GalleryStory {
  id: string
  title: string
  image: string
  period: string
  slug: string
  story: string
  tags: string[]
  sort_order: number
  created_at: string
  updated_at: string
}

export interface NavItem {
  id: string
  label: string
  href: string
  sort_order: number
  created_at: string
}

export interface LegacyLogo {
  id: string
  file: string
  number: string
  aspect: string
  sort_order: number
  created_at: string
}

export interface SiteConfig {
  key: string
  value: Record<string, unknown>
  updated_at: string
}
