"use client"

import { Code2, Layers3, Rocket } from 'lucide-react'
import { useContent } from '@/lib/content'

const iconMap: Record<string, React.ElementType> = { Code2, Layers3, Rocket }

const defaultData = {
  heading: 'I turn ideas into responsive web experiences.',
  paragraphs: [
    'As a full stack web developer specializing in the MERN stack, I combine practical engineering with a careful eye for interface details. I like building apps that feel direct, fast, and comfortable to use.',
  ],
  highlights: [
    { icon: 'Code2', title: 'Clean builds', text: 'Readable React components, practical state, and APIs that stay easy to maintain.' },
    { icon: 'Layers3', title: 'Full stack flow', text: 'Comfortable moving from UI polish to Express routes and MongoDB data models.' },
    { icon: 'Rocket', title: 'Product mindset', text: 'Focused on shipping interfaces that solve real problems, not just look finished.' },
  ],
  experience: [
    {
      role: 'Web Developer',
      description: 'Building MERN stack applications with attention to responsive layouts, reusable components, database-backed features, and practical deployment.',
      period: '2024 - Present',
    },
  ],
}

const About = () => {
  const { data } = useContent('about', defaultData)
  const d = { ...defaultData, ...data }

  return (
    <section id="about" className="border-t border-border px-6 py-24 md:px-12">
      <div className="max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">About</p>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-balance text-foreground md:text-5xl">
            {d.heading}
          </h2>
          {(d.paragraphs || []).map((p: string, i: number) => (
            <p key={i} className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">
              {p}
            </p>
          ))}
        </div>

        {(d.highlights || []).length > 0 && (
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {(d.highlights || []).map((item: { icon?: string; title: string; text: string }) => {
              const Icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : Code2
              return (
                <div key={item.title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              )
            })}
          </div>
        )}

        {(d.experience || []).length > 0 && (
          <div className="mt-14 grid gap-8 lg:grid-cols-[0.75fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Experience</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Current focus</h3>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              {(d.experience || []).map((exp: { role: string; description: string; period: string }, i: number) => (
                <div key={i} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{exp.role}</h4>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{exp.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {exp.period}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default About
