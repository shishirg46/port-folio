"use client"

import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Mail, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useContent } from '@/lib/content'

interface ContactFormData {
  name: string
  email: string
  message: string
}

const defaultData = {
  email: 'shishirghimire46@gmail.com',
  tagline: 'Open to internships, freelance work, and collaborations',
  description: "Have a project, internship opportunity, or collaboration in mind? Send a message and I'll reply as soon as I can.",
}

const Contact = () => {
  const { data: contactData } = useContent('contact', defaultData)
  const cd = { ...defaultData, ...contactData }

  const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 3500)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="border-t border-border px-6 py-24 md:px-12">
      <div className="grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Contact</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Let&apos;s build something useful.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{cd.description}</p>
          {cd.email && (
            <a
              href={`mailto:${cd.email}`}
              className="mt-8 inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              {cd.email}
            </a>
          )}
          {cd.tagline && (
            <div className="mt-8 inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm">
              {cd.tagline}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-8">
          {status === 'success' && (
            <p className="mb-5 rounded-md border border-primary/20 bg-primary/10 p-3 text-sm font-medium text-primary">
              Thank you for your message. I&apos;ll get back to you soon.
            </p>
          )}
          {status === 'error' && (
            <p className="mb-5 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
              Something went wrong. Please try again or email me directly.
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="text-sm font-semibold text-foreground">Name</label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" className="mt-2 h-11 bg-background" required />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-semibold text-foreground">Email</label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className="mt-2 h-11 bg-background" required />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="message" className="text-sm font-semibold text-foreground">Message</label>
            <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your project..." rows={6} className="mt-2 bg-background" required />
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send Message'}
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  )
}

export default Contact
