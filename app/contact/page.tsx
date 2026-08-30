import type { Metadata } from 'next'
import Contact from '@/components/sections/Contact'
import { getSectionForRender } from '@/lib/content/server-content'
import { pageMeta } from '@/lib/seo'
import { JsonLd, buildWebPageLd, buildBreadcrumbLd } from '@/lib/seo/jsonld'

const PATH = '/contact'

async function contactDescription(): Promise<string> {
  const contact = await getSectionForRender('contact')
  const description = typeof contact.description === 'string' ? contact.description : ''
  return (
    description.slice(0, 157) ||
    'Get in touch with Shishir Ghimire — open to internships, freelance work, and collaborations.'
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta('Contact', await contactDescription(), PATH)
}

export default async function ContactPage() {
  const description = await contactDescription()
  return (
    <>
      <section className="px-6 pt-20 md:px-12">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl md:text-5xl">
          Contact Shishir Ghimire
        </h1>
      </section>
      <Contact />
      <JsonLd data={buildWebPageLd('Contact Shishir Ghimire', description, PATH)} />
      <JsonLd data={buildBreadcrumbLd(PATH, 'Contact')} />
    </>
  )
}
