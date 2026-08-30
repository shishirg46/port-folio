export const SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact'] as const

export type SectionKey = (typeof SECTIONS)[number]

export interface StatContent {
  value: string
  label: string
}

export interface HeroContent {
  name: string
  title: string
  subtitle: string
  badge: string
  subheading: string
  description: string
  stats: StatContent[]
  techStack: string[]
  profileImage: string
  resumeUrl: string
}

export interface HighlightContent {
  icon?: string
  title: string
  text: string
}

export interface ExperienceContent {
  role: string
  description: string
  period: string
}

export interface AboutContent {
  heading: string
  paragraphs: string[]
  highlights: HighlightContent[]
  experience: ExperienceContent[]
}

export interface SkillCategoryContent {
  category: string
  description: string
  items: string[]
}

export interface SkillsContent {
  description: string
  categories: SkillCategoryContent[]
}

export interface ProjectContent {
  title: string
  description: string
  tech: string[]
  image: string
  featured: boolean
  link?: string
}

export interface ProjectsContent {
  description: string
  projects: ProjectContent[]
}

export interface ContactContent {
  email: string
  tagline: string
  description: string
  social: {
    github: string
    linkedin: string
  }
}

export type AnySectionContent = HeroContent | AboutContent | SkillsContent | ProjectsContent | ContactContent

export type SectionContentMap = {
  hero: HeroContent
  about: AboutContent
  skills: SkillsContent
  projects: ProjectsContent
  contact: ContactContent
}