import { prisma } from '../prisma'
import type { Prisma } from '@prisma/client'
import type {
  SectionKey,
  SectionContentMap,
  HeroContent,
  AboutContent,
  SkillsContent,
  ProjectsContent,
  ContactContent,
} from './types'

const SINGLE = 'single'

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

function asStrings(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => asString(x)) : []
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {}
}

function normalizeTechStack(stack: unknown): string[] {
  return asStrings(stack).flatMap((item) => item.split(',').map((p) => p.trim()).filter(Boolean))
}

function normalizeHero(raw: unknown): HeroContent {
  const r = asRecord(raw)
  return {
    name: asString(r.name),
    title: asString(r.title),
    subtitle: asString(r.subtitle),
    badge: asString(r.badge),
    subheading: asString(r.subheading),
    description: asString(r.description),
    stats: (Array.isArray(r.stats) ? r.stats : []).map((s) => {
      const item = asRecord(s)
      return { value: asString(item.value), label: asString(item.label) }
    }),
    techStack: normalizeTechStack(r.techStack),
    profileImage: asString(r.profileImage),
    resumeUrl: asString(r.resumeUrl),
  }
}

function normalizeAbout(raw: unknown): AboutContent {
  const r = asRecord(raw)
  return {
    heading: asString(r.heading),
    paragraphs: asStrings(r.paragraphs),
    highlights: (Array.isArray(r.highlights) ? r.highlights : []).map((h) => {
      const item = asRecord(h)
      const text = asString(item.text)
      const title = asString(item.title)
      return {
        ...(asString(item.icon) ? { icon: asString(item.icon) } : {}),
        title,
        text,
      }
    }),
    experience: (Array.isArray(r.experience) ? r.experience : []).map((e) => {
      const item = asRecord(e)
      return { role: asString(item.role), description: asString(item.description), period: asString(item.period) }
    }),
  }
}

function normalizeSkills(raw: unknown): SkillsContent {
  const r = asRecord(raw)
  return {
    description: asString(r.description),
    categories: (Array.isArray(r.categories) ? r.categories : []).map((c) => {
      const item = asRecord(c)
      return {
        category: asString(item.category),
        description: asString(item.description),
        items: asStrings(item.items),
      }
    }),
  }
}

function normalizeProjects(raw: unknown): ProjectsContent {
  const r = asRecord(raw)
  return {
    description: asString(r.description),
    projects: (Array.isArray(r.projects) ? r.projects : []).map((p) => {
      const item = asRecord(p)
      const link = asString(item.link)
      return {
        title: asString(item.title),
        description: asString(item.description),
        ...(link ? { link } : {}),
        tech: asStrings(item.tech),
        image: asString(item.image),
        featured: Boolean(item.featured),
      }
    }),
  }
}

function normalizeContact(raw: unknown): ContactContent {
  const r = asRecord(raw)
  const social = asRecord(r.social)
  return {
    email: asString(r.email),
    tagline: asString(r.tagline),
    description: asString(r.description),
    social: {
      github: asString(social.github),
      linkedin: asString(social.linkedin),
    },
  }
}

export function normalizeSectionPayload<K extends SectionKey>(
  section: K,
  raw: unknown,
): SectionContentMap[K] {
  switch (section) {
    case 'hero':
      return normalizeHero(raw) as SectionContentMap[K]
    case 'about':
      return normalizeAbout(raw) as SectionContentMap[K]
    case 'skills':
      return normalizeSkills(raw) as SectionContentMap[K]
    case 'projects':
      return normalizeProjects(raw) as SectionContentMap[K]
    case 'contact':
      return normalizeContact(raw) as SectionContentMap[K]
  }
}

async function saveHero(
  tx: Prisma.TransactionClient,
  content: HeroContent,
): Promise<void> {
  await tx.profile.upsert({
    where: { id: SINGLE },
    update: {
      name: content.name,
      title: content.title,
      subtitle: content.subtitle || null,
      badge: content.badge || null,
      subheading: content.subheading || null,
      description: content.description || null,
      techStack: content.techStack,
      profileImage: content.profileImage || null,
      resumeUrl: content.resumeUrl || null,
    },
    create: {
      id: SINGLE,
      name: content.name,
      title: content.title,
      subtitle: content.subtitle || null,
      badge: content.badge || null,
      subheading: content.subheading || null,
      description: content.description || null,
      techStack: content.techStack,
      profileImage: content.profileImage || null,
      resumeUrl: content.resumeUrl || null,
    },
  })

  await tx.stat.deleteMany({ where: { profileId: SINGLE } })
  await tx.stat.createMany({
    data: content.stats.map((stat, order) => ({ ...stat, order, profileId: SINGLE })),
  })
}

async function saveAbout(
  tx: Prisma.TransactionClient,
  content: AboutContent,
): Promise<void> {
  await tx.about.upsert({
    where: { id: SINGLE },
    update: { heading: content.heading },
    create: { id: SINGLE, heading: content.heading },
  })

  await tx.aboutParagraph.deleteMany({ where: { aboutId: SINGLE } })
  await tx.aboutParagraph.createMany({
    data: content.paragraphs.map((paragraph, order) => ({ content: paragraph, order, aboutId: SINGLE })),
  })

  await tx.highlight.deleteMany({ where: { aboutId: SINGLE } })
  await tx.highlight.createMany({
    data: content.highlights.map((h, order) => ({
      icon: h.icon || null,
      title: h.title,
      text: h.text,
      order,
      aboutId: SINGLE,
    })),
  })

  await tx.experience.deleteMany({ where: { profileId: SINGLE } })
  await tx.experience.createMany({
    data: content.experience.map((exp, order) => ({
      role: exp.role,
      description: exp.description,
      period: exp.period,
      order,
      profileId: SINGLE,
    })),
  })
}

async function saveSkills(
  tx: Prisma.TransactionClient,
  content: SkillsContent,
): Promise<void> {
  await tx.skillSection.upsert({
    where: { id: SINGLE },
    update: { description: content.description },
    create: { id: SINGLE, description: content.description },
  })

  await tx.skill.deleteMany({ where: { category: { sectionId: SINGLE } } })
  await tx.skillCategory.deleteMany({ where: { sectionId: SINGLE } })

  for (const [index, cat] of content.categories.entries()) {
    const created = await tx.skillCategory.create({
      data: {
        category: cat.category,
        description: cat.description || null,
        order: index,
        sectionId: SINGLE,
      },
    })
    await tx.skill.createMany({
      data: cat.items.map((name, skillOrder) => ({
        name,
        order: skillOrder,
        categoryId: created.id,
      })),
    })
  }
}

async function saveProjects(
  tx: Prisma.TransactionClient,
  content: ProjectsContent,
): Promise<void> {
  await tx.projectSection.upsert({
    where: { id: SINGLE },
    update: { description: content.description },
    create: { id: SINGLE, description: content.description },
  })

  await tx.project.deleteMany({ where: { sectionId: SINGLE } })
  await tx.project.createMany({
    data: content.projects.map((project, order) => ({
      title: project.title,
      description: project.description,
      link: project.link || null,
      tech: project.tech,
      image: project.image || null,
      featured: project.featured,
      order,
      sectionId: SINGLE,
    })),
  })
}

async function saveContact(
  tx: Prisma.TransactionClient,
  content: ContactContent,
): Promise<void> {
  await tx.contactSettings.upsert({
    where: { id: SINGLE },
    update: {
      email: content.email,
      tagline: content.tagline || null,
      description: content.description || null,
      github: content.social.github || null,
      linkedin: content.social.linkedin || null,
    },
    create: {
      id: SINGLE,
      email: content.email,
      tagline: content.tagline || null,
      description: content.description || null,
      github: content.social.github || null,
      linkedin: content.social.linkedin || null,
    },
  })
}

export async function saveSection<K extends SectionKey>(
  section: K,
  content: SectionContentMap[K],
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    switch (section) {
      case 'hero':
        await saveHero(tx, content as HeroContent)
        return
      case 'about':
        await saveAbout(tx, content as AboutContent)
        return
      case 'skills':
        await saveSkills(tx, content as SkillsContent)
        return
      case 'projects':
        await saveProjects(tx, content as ProjectsContent)
        return
      case 'contact':
        await saveContact(tx, content as ContactContent)
        return
    }
  }, { timeout: 30_000 })
}