import type { Metadata } from 'next'
import Projects from '@/components/sections/Projects'
import { getSectionForRender } from '@/lib/content/server-content'
import { pageMeta } from '@/lib/seo'
import { JsonLd, buildWebPageLd, buildBreadcrumbLd, buildProjectsLd } from '@/lib/seo/jsonld'

const PATH = '/projects'

async function projectsDescription(): Promise<string> {
  const projects = await getSectionForRender('projects')
  const description = typeof projects.description === 'string' ? projects.description : ''
  return (
    description.slice(0, 157) ||
    'Selected work by Shishir Ghimire — full stack projects built with React, Next.js, Node.js, MongoDB and more.'
  )
}

async function projectsList(): Promise<Array<{ title: string; description?: string; image?: string }>> {
  const projects = await getSectionForRender('projects')
  const list = Array.isArray(projects.projects) ? (projects.projects as any[]) : []
  return list.map((project) => ({
    title: typeof project.title === 'string' ? project.title : '',
    description: typeof project.description === 'string' ? project.description : undefined,
    image: typeof project.image === 'string' && project.image ? project.image : undefined,
  }))
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta('Projects', await projectsDescription(), PATH)
}

export default async function ProjectsPage() {
  const [description, projects] = await Promise.all([projectsDescription(), projectsList()])
  return (
    <>
      <section className="px-6 pt-20 md:px-12">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl md:text-5xl">
          Projects by Shishir Ghimire
        </h1>
      </section>
      <Projects />
      <JsonLd data={buildWebPageLd('Projects by Shishir Ghimire', description, PATH)} />
      <JsonLd data={buildBreadcrumbLd(PATH, 'Projects')} />
      <JsonLd data={buildProjectsLd(projects)} />
    </>
  )
}
