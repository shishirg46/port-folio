import type { Metadata } from 'next'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import { getSectionForRender } from '@/lib/content/server-content'
import { pageMeta } from '@/lib/seo'
import { JsonLd, buildWebPageLd, buildBreadcrumbLd } from '@/lib/seo/jsonld'

const PATH = '/about'

async function aboutDescription(): Promise<string> {
  const about = await getSectionForRender('about')
  const paragraphs = Array.isArray(about.paragraphs)
    ? (about.paragraphs as string[]).filter(Boolean).join(' ').trim()
    : ''
  return paragraphs.slice(0, 157) || 'About Shishir Ghimire, a full stack web developer from Biratnagar, Nepal.'
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta('About', await aboutDescription(), PATH)
}

export default async function AboutPage() {
  const description = await aboutDescription()
  return (
    <>
      <section className="px-6 pt-20 md:px-12">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl md:text-5xl">
          About Shishir Ghimire
        </h1>
      </section>
      <About />
      <Skills />
      <JsonLd data={buildWebPageLd('About Shishir Ghimire', description, PATH)} />
      <JsonLd data={buildBreadcrumbLd(PATH, 'About')} />
    </>
  )
}
