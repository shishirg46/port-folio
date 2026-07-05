"use client"

import Image from 'next/image'
import { ArrowDownRight, Mail, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useContent } from '@/lib/content'

const defaultData = {
  name: 'Shishir Ghimire',
  title: 'Full Stack Developer',
  subtitle: 'MERN Stack Developer',
  badge: 'Available for web development projects',
  subheading: 'Building useful web products with clean, modern interfaces.',
  description: "I'm Shishir Ghimire, a MERN stack developer focused on responsive apps, practical user flows, and frontend details that make products feel easy to use.",
  stats: [
    { value: '2+', label: 'Featured projects' },
    { value: 'MERN', label: 'Core stack' },
    { value: '2024', label: 'Active since' },
  ],
  techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
  profileImage: '/port-image.jpeg',
}

const Hero = () => {
  const { data } = useContent('hero', defaultData)
  const d = { ...defaultData, ...data }

  return (
    <section id="home" className="px-6 py-20 md:min-h-screen md:px-12 md:py-24">
      <div className="grid min-h-[calc(100vh-9rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          {d.badge && (
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              {d.badge}
            </div>
          )}
          <h1 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight text-balance text-foreground md:text-5xl">
            {d.subheading}
          </h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-pretty text-muted-foreground">
            {(() => {
              const parts = d.description.split(d.name)
              return parts.map((part, i) => (
                <span key={i}>
                  {part}
                  {i < parts.length - 1 && <span className="font-semibold text-primary">{d.name}</span>}
                </span>
              ))
            })()}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Projects
              <ArrowDownRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Mail className="h-4 w-4" />
              Contact Me
            </Button>
          </div>
          {d.stats && d.stats.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {d.stats.map((stat: { value: string; label: string }) => (
                <div key={stat.label} className="inline-flex items-center gap-2.5 rounded-lg border border-border bg-card/80 px-4 py-2.5 shadow-sm">
                  <span className="text-xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-xs leading-4 text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-lg bg-accent/25" />
          <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-xl">
            <Image
              src={d.profileImage || '/port-image.jpeg'}
              alt={d.name || 'Shishir Ghimire'}
              width={928}
              height={1238}
              className="aspect-4/5 w-full object-cover"
              priority
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/25 bg-background/88 p-4 shadow-lg backdrop-blur">
              <p className="text-sm font-semibold text-foreground">{d.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {(d.techStack || []).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
