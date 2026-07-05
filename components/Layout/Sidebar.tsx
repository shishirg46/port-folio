"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Download, Github, Linkedin, Menu, X } from 'lucide-react'
import { useContent } from '@/lib/content'

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

const adminTabs = [
  { id: 'hero', label: 'Hero', href: '/admin?tab=hero' },
  { id: 'about', label: 'About', href: '/admin?tab=about' },
  { id: 'skills', label: 'Skills', href: '/admin?tab=skills' },
  { id: 'projects', label: 'Projects', href: '/admin?tab=projects' },
  { id: 'contact', label: 'Contact', href: '/admin?tab=contact' },
]

const defaultHero = {
  name: 'Shishir Ghimire',
  title: 'Full Stack Developer',
  subtitle: 'MERN Stack Developer',
  resumeUrl: '/Shishir%20Ghimire.pdf',
  profileImage: '/port-image.jpeg',
}

const defaultContact = {
  social: {
    github: 'https://github.com/shishirg46',
    linkedin: 'https://www.linkedin.com/in/shishir-ghimire-b2b0a32a7/',
  },
}

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isAdmin = pathname.startsWith('/admin')

  const { data: heroData } = useContent('hero', defaultHero)
  const { data: contactData } = useContent('contact', defaultContact)
  const h = { ...defaultHero, ...heroData }
  const c = { ...defaultContact, ...contactData }

  useEffect(() => {
    if (!isHome) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    )
    const elements = sections.map(({ id }) => document.getElementById(id)).filter(Boolean)
    elements.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [isHome])

  const scrollTo = (id: string) => {
    setIsMenuOpen(false)
    if (isHome) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = `/#${id}`
    }
  }

  const navLink = ({ id, label }: { id: string; label: string }) => (
    <button
      key={id}
      onClick={() => scrollTo(id)}
      className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
        activeSection === id
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full transition-colors ${
          activeSection === id ? 'bg-primary-foreground' : 'bg-border group-hover:bg-primary'
        }`}
      />
      {label}
    </button>
  )

  const socialLinks: { label: string; url: string }[] = []
  if (c.social?.github) socialLinks.push({ label: 'GitHub', url: c.social.github })
  if (c.social?.linkedin) socialLinks.push({ label: 'LinkedIn', url: c.social.linkedin })

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 flex-col justify-between border-r border-border bg-background/85 p-8 backdrop-blur">
        <div>
          <a href="/" className="block">
            <Image src="/web-title-icon.png" alt="Shishir Ghimire" width={160} height={160} className="object-contain" priority />
          </a>
          <nav className="mt-10 space-y-1">{sections.map(navLink)}</nav>
          <a
            href={h.resumeUrl || '/Shishir%20Ghimire.pdf'}
            download
            className="mt-8 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-primary"
          >
            <Download className="h-4 w-4" />
            Resume
          </a>
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              aria-label={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border bg-card p-2 transition-colors hover:text-primary"
            >
              {link.label === 'GitHub' ? <Github className="h-4 w-4" /> : <Linkedin className="h-4 w-4" />}
            </a>
          ))}
        </div>
      </aside>

      <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-5 h-14">
          <a href="/" className="block shrink-0">
            <Image src="/web-title-icon.png" alt="Shishir Ghimire" width={36} height={36} className="object-contain" priority />
          </a>
          <button
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="border-t border-border px-5 py-4 space-y-1 bg-background/95 shadow-lg">
            {isAdmin ? (
              <>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-1.5">Admin</div>
                {adminTabs.map(t => (
                  <a key={t.id} href={t.href} onClick={() => setIsMenuOpen(false)} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    {t.label}
                  </a>
                ))}
              </>
            ) : (
              <>
                <nav className="space-y-1">{sections.map(navLink)}</nav>
                <hr className="my-3 border-border" />
                <a href={h.resumeUrl || '/Shishir%20Ghimire.pdf'} download className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
                  <Download className="h-4 w-4" />
                  Resume
                </a>
                {socialLinks.map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
                    {link.label === 'GitHub' ? <Github className="h-4 w-4" /> : <Linkedin className="h-4 w-4" />}
                    {link.label}
                  </a>
                ))}
              </>
            )}
          </div>
        )}
      </header>
    </>
  )
}

export default Sidebar
