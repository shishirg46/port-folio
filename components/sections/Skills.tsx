"use client"

import { useContent } from '@/lib/content'

const defaultData = {
  description: 'A practical stack for building full stack applications from first screen to database.',
  categories: [
    {
      category: 'Frontend',
      description: 'Interfaces, interactions, and responsive layouts.',
      items: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'],
    },
    {
      category: 'Backend',
      description: 'APIs, server logic, and database-backed features.',
      items: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Authentication', 'EmailJS'],
    },
    {
      category: 'Workflow',
      description: 'Tools and practices for getting products shipped.',
      items: ['Git', 'Reusable UI', 'Debugging', 'Deployment', 'Form Handling', 'Responsive QA'],
    },
  ],
}

const Skills = () => {
  const { data } = useContent('skills', defaultData)
  const d = { ...defaultData, ...data }

  return (
    <section id="skills" className="border-t border-border px-6 py-24 md:px-12">
      <div className="max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Skills</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Technologies I work with
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-pretty text-muted-foreground">{d.description}</p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {(d.categories || []).map((group: { category: string; description: string; items: string[] }) => (
            <div key={group.category} className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">{group.category}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {(group.items || []).map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
