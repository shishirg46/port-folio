import { prisma } from '../prisma'
import {
  type SectionKey,
  type AnySectionContent,
  type SectionContentMap,
  type HeroContent,
  type AboutContent,
  type SkillsContent,
  type ProjectsContent,
  type ContactContent,
} from './types'

const SINGLE = 'single'

async function loadHero(): Promise<HeroContent | null> {
  const profile = await prisma.profile.findUnique({
    where: { id: SINGLE },
    include: {
      stats: { orderBy: { order: 'asc' } },
    },
  })
  if (!profile) return null
  return {
    name: profile.name,
    title: profile.title,
    subtitle: profile.subtitle ?? '',
    badge: profile.badge ?? '',
    subheading: profile.subheading ?? '',
    description: profile.description ?? '',
    stats: profile.stats.map((s) => ({ value: s.value, label: s.label })),
    techStack: profile.techStack,
    profileImage: profile.profileImage ?? '',
    resumeUrl: profile.resumeUrl ?? '',
  }
}

async function loadAbout(): Promise<AboutContent | null> {
  const about = await prisma.about.findUnique({
    where: { id: SINGLE },
    include: {
      paragraphs: { orderBy: { order: 'asc' } },
      highlights: { orderBy: { order: 'asc' } },
    },
  })
  if (!about) return null
  const experiences = await prisma.experience.findMany({
    where: { profileId: SINGLE },
    orderBy: { order: 'asc' },
  })
  return {
    heading: about.heading,
    paragraphs: about.paragraphs.map((p) => p.content),
    highlights: about.highlights.map((h) => ({
      ...(h.icon ? { icon: h.icon } : {}),
      title: h.title,
      text: h.text,
    })),
    experience: experiences.map((e) => ({
      role: e.role,
      description: e.description,
      period: e.period,
    })),
  }
}

async function loadSkills(): Promise<SkillsContent | null> {
  const section = await prisma.skillSection.findUnique({
    where: { id: SINGLE },
    include: {
      categories: {
        orderBy: { order: 'asc' },
        include: {
          skills: { orderBy: { order: 'asc' } },
        },
      },
    },
  })
  if (!section) return null
  return {
    description: section.description,
    categories: section.categories.map((c) => ({
      category: c.category,
      description: c.description ?? '',
      items: c.skills.map((s) => s.name),
    })),
  }
}

async function loadProjects(): Promise<ProjectsContent | null> {
  const section = await prisma.projectSection.findUnique({
    where: { id: SINGLE },
    include: {
      projects: { orderBy: { order: 'asc' } },
    },
  })
  if (!section) return null
  return {
    description: section.description,
    projects: section.projects.map((p) => ({
      title: p.title,
      description: p.description,
      ...(p.link ? { link: p.link } : {}),
      tech: p.tech,
      image: p.image ?? '',
      featured: p.featured,
    })),
  }
}

async function loadContact(): Promise<ContactContent | null> {
  const settings = await prisma.contactSettings.findUnique({ where: { id: SINGLE } })
  if (!settings) return null
  return {
    email: settings.email,
    tagline: settings.tagline ?? '',
    description: settings.description ?? '',
    social: {
      github: settings.github ?? '',
      linkedin: settings.linkedin ?? '',
    },
  }
}

export async function loadSectionFromDb(section: SectionKey): Promise<AnySectionContent | null> {
  switch (section) {
    case 'hero':
      return await loadHero()
    case 'about':
      return await loadAbout()
    case 'skills':
      return await loadSkills()
    case 'projects':
      return await loadProjects()
    case 'contact':
      return await loadContact()
  }
}

export async function loadAllFromDb(): Promise<SectionContentMap> {
  const [hero, about, skills, projects, contact] = await Promise.all([
    loadHero(),
    loadAbout(),
    loadSkills(),
    loadProjects(),
    loadContact(),
  ])
  if (!hero || !about || !skills || !projects || !contact) {
    throw new Error('DB content incomplete')
  }
  return { hero, about, skills, projects, contact }
}