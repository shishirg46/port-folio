import { PrismaClient, type Prisma } from '@prisma/client'
import { promises as fs } from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const contentDir = path.join(process.cwd(), 'content')

async function readJson<T>(section: string): Promise<T> {
  const file = await fs.readFile(path.join(contentDir, `${section}.json`), 'utf-8')
  return JSON.parse(file) as T
}

type Stats = { value: string; label: string }
type Experience = { role: string; description: string; period: string }
type Highlight = { title: string; text: string }
type SkillCategory = { category: string; description: string; items: string[] }
type Project = {
  title: string
  description: string
  tech: string[]
  image: string
  featured: boolean
}

type HeroContent = {
  name: string
  title: string
  subtitle?: string
  badge?: string
  subheading?: string
  description?: string
  stats?: Stats[]
  techStack?: string[]
  profileImage?: string
  resumeUrl?: string
}

type AboutContent = {
  heading: string
  paragraphs: string[]
  highlights: Highlight[]
  experience: Experience[]
}

type SkillsContent = {
  description: string
  categories: SkillCategory[]
}

type ProjectsContent = {
  description: string
  projects: Project[]
}

type ContactContent = {
  email: string
  tagline?: string
  description?: string
  social?: { github?: string; linkedin?: string }
}

const SINGLE = 'single'

function normalizeTechStack(techStack: string[]): string[] {
  return techStack.flatMap((item) =>
    item.split(',').map((part) => part.trim()).filter(Boolean),
  )
}

async function seedAdminUser(tx: Prisma.TransactionClient) {
  const username = process.env.ADMIN_USERNAME?.trim()
  const password = process.env.ADMIN_PASSWORD

  const existing = await tx.adminUser.findFirst()
  if (existing) {
    console.log('[seed] admin user already exists, skipping')
    return
  }

  if (!username || !password) {
    console.warn(
      '[seed] ADMIN_USERNAME/ADMIN_PASSWORD not set — no admin user created. Rerun when available.',
    )
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await tx.adminUser.create({
    data: { username, passwordHash },
  })
  console.log(`[seed] admin user created: ${username}`)
}

async function main() {
  const hero = await readJson<HeroContent>('hero')
  const about = await readJson<AboutContent>('about')
  const skills = await readJson<SkillsContent>('skills')
  const projects = await readJson<ProjectsContent>('projects')
  const contact = await readJson<ContactContent>('contact')

  await prisma.$transaction(async (tx) => {
    // --- Profile (hero) ---
    await tx.profile.upsert({
      where: { id: SINGLE },
      update: {
        name: hero.name,
        title: hero.title,
        subtitle: hero.subtitle || null,
        badge: hero.badge ?? null,
        subheading: hero.subheading ?? null,
        description: hero.description ?? null,
        techStack: normalizeTechStack(hero.techStack ?? []),
        profileImage: hero.profileImage ?? null,
        resumeUrl: hero.resumeUrl ?? null,
      },
      create: {
        id: SINGLE,
        name: hero.name,
        title: hero.title,
        subtitle: hero.subtitle || null,
        badge: hero.badge ?? null,
        subheading: hero.subheading ?? null,
        description: hero.description ?? null,
        techStack: normalizeTechStack(hero.techStack ?? []),
        profileImage: hero.profileImage ?? null,
        resumeUrl: hero.resumeUrl ?? null,
      },
    })

    await tx.stat.deleteMany({ where: { profileId: SINGLE } })
    await tx.stat.createMany({
      data: (hero.stats ?? []).map((stat, order) => ({ ...stat, order, profileId: SINGLE })),
    })

    await tx.experience.deleteMany({ where: { profileId: SINGLE } })
    await tx.experience.createMany({
      data: (about.experience ?? []).map((exp, order) => ({
        role: exp.role,
        period: exp.period,
        description: exp.description,
        order,
        profileId: SINGLE,
      })),
    })

    // --- About ---
    await tx.about.upsert({
      where: { id: SINGLE },
      update: { heading: about.heading },
      create: { id: SINGLE, heading: about.heading },
    })

    await tx.aboutParagraph.deleteMany({ where: { aboutId: SINGLE } })
    await tx.aboutParagraph.createMany({
      data: (about.paragraphs ?? []).map((content, order) => ({ content, order, aboutId: SINGLE })),
    })

    await tx.highlight.deleteMany({ where: { aboutId: SINGLE } })
    await tx.highlight.createMany({
      data: (about.highlights ?? []).map((highlight, order) => ({
        title: highlight.title,
        text: highlight.text,
        order,
        aboutId: SINGLE,
      })),
    })

    // --- Skills ---
    await tx.skillSection.upsert({
      where: { id: SINGLE },
      update: { description: skills.description },
      create: { id: SINGLE, description: skills.description },
    })

    await tx.skill.deleteMany({ where: { category: { sectionId: SINGLE } } })
    await tx.skillCategory.deleteMany({ where: { sectionId: SINGLE } })

    for (const [index, cat] of (skills.categories ?? []).entries()) {
      const created = await tx.skillCategory.create({
        data: {
          category: cat.category,
          description: cat.description ?? null,
          order: index,
          sectionId: SINGLE,
        },
      })

      await tx.skill.createMany({
        data: (cat.items ?? []).map((name, skillOrder) => ({
          name,
          order: skillOrder,
          categoryId: created.id,
        })),
      })
    }

    // --- Projects ---
    await tx.projectSection.upsert({
      where: { id: SINGLE },
      update: { description: projects.description },
      create: { id: SINGLE, description: projects.description },
    })

    await tx.project.deleteMany({ where: { sectionId: SINGLE } })
    await tx.project.createMany({
      data: (projects.projects ?? []).map((project, order) => ({
        title: project.title,
        description: project.description,
        tech: project.tech ?? [],
        image: project.image ?? null,
        featured: project.featured ?? false,
        order,
        sectionId: SINGLE,
      })),
    })

    // --- Contact ---
    await tx.contactSettings.upsert({
      where: { id: SINGLE },
      update: {
        email: contact.email,
        tagline: contact.tagline ?? null,
        description: contact.description ?? null,
        github: contact.social?.github ?? null,
        linkedin: contact.social?.linkedin ?? null,
      },
      create: {
        id: SINGLE,
        email: contact.email,
        tagline: contact.tagline ?? null,
        description: contact.description ?? null,
        github: contact.social?.github ?? null,
        linkedin: contact.social?.linkedin ?? null,
      },
    })

    // --- Admin (one-time) ---
    await seedAdminUser(tx)
  }, { timeout: 30_000 })

  const counts = {
    Profile: await prisma.profile.count(),
    Stat: await prisma.stat.count(),
    Experience: await prisma.experience.count(),
    About: await prisma.about.count(),
    AboutParagraph: await prisma.aboutParagraph.count(),
    Highlight: await prisma.highlight.count(),
    SkillSection: await prisma.skillSection.count(),
    SkillCategory: await prisma.skillCategory.count(),
    Skill: await prisma.skill.count(),
    ProjectSection: await prisma.projectSection.count(),
    Project: await prisma.project.count(),
    ContactSettings: await prisma.contactSettings.count(),
    UploadedImage: await prisma.uploadedImage.count(),
    AdminUser: await prisma.adminUser.count(),
  }

  console.log('[seed] complete')
  console.log('[seed] counts:', JSON.stringify(counts, null, 2))
}

main()
  .catch((e) => {
    console.error('[seed] failed:', e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })