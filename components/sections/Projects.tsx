"use client"

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useContent } from '@/lib/content'

const defaultData = {
  description: 'A few examples of how I approach interfaces, product flow, and full stack features.',
  projects: [
    {
      title: 'YatraAI Travel Safety',
      description: 'A polished travel safety landing experience for Nepal with AI-assisted route confidence, destination context, and a high-contrast product interface.',
      tech: ['Next.js', 'Tailwind CSS', 'UI Design'],
      image: '/landing.png',
      featured: true,
      link: '',
    },
    {
      title: 'Disaster Notifier and Relief',
      description: 'A MERN stack application concept for real-time disaster alerts, emergency updates, and relief coordination.',
      tech: ['React', 'Node.js', 'MongoDB', 'Express'],
      image: '/disaster-notifier-landing.svg',
      featured: false,
      link: '',
    },
    {
      title: 'School Website',
      description: 'A responsive school website focused on clear information architecture, quick scanning, and simple content updates.',
      tech: ['React', 'Tailwind CSS'],
      image: '/school-website-landing.svg',
      featured: false,
      link: '',
    },
  ],
}

const Projects = () => {
  const { data } = useContent('projects', defaultData)
  const d = { ...defaultData, ...data }

  return (
    <section id="projects" className="border-t border-border px-6 py-24 md:px-12">
      <div className="max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Projects</p>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Selected work
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-pretty text-muted-foreground">{d.description}</p>
        </div>

        <div className="mt-12 grid gap-5">
          {(d.projects || []).map((project: { title: string; description: string; tech: string[]; image?: string; featured?: boolean; link?: string }) => {
            const hasLink = !!project.link

            const CardInner = (
              <>
                {project.image && (
                  <div className="border-b border-border bg-muted lg:border-b-0 lg:border-r">
                    <Image
                      src={project.image}
                      alt={`${project.title} screenshot`}
                      width={1365}
                      height={768}
                      className={`aspect-video h-full w-full ${
                        project.image.endsWith('.svg') ? 'object-contain p-4 bg-white' : 'object-cover object-left-top'
                      }`}
                      unoptimized={project.image.endsWith('.svg')}
                    />
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">{project.title}</h3>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors ${hasLink ? 'group-hover:border-primary group-hover:text-primary' : ''}`}>
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {(project.tech || []).map((tech: string) => (
                      <span
                        key={tech}
                        className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )

            const cardClass = `group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-colors ${
              project.image ? 'lg:grid lg:grid-cols-[1.1fr_0.9fr]' : ''
            } ${hasLink ? 'hover:border-primary/40' : ''}`

            return hasLink ? (
              <a
                key={project.title}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {CardInner}
              </a>
            ) : (
              <article key={project.title} className={cardClass}>
                {CardInner}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Projects