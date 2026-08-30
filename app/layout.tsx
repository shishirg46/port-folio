import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Sidebar from '@/components/Layout/Sidebar'
import Footer from '@/components/Layout/Footer'
import { ContentProvider } from '@/lib/content-provider'
import { getAllContent } from '@/lib/content/repository'
import type { HeroContent, SkillsContent, ContactContent } from '@/lib/content/types'
import { JsonLd, buildPersonLd, buildWebSiteLd } from '@/lib/seo/jsonld'
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, SITE_NAME, OG_IMAGE, absoluteUrl } from '@/lib/seo'
import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: '%s | Shishir Ghimire',
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(OG_IMAGE.url)],
  },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  let content: Awaited<ReturnType<typeof getAllContent>> | null = null
  try {
    content = await getAllContent()
  } catch {
    content = null
  }

  const hero = content?.hero as Partial<HeroContent> | undefined
  const contact = content?.contact as Partial<ContactContent> | undefined
  const skills = content?.skills as Partial<SkillsContent> | undefined

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <ContentProvider initialData={content}>
          <Sidebar />
          <div className="md:ml-72 min-h-screen pt-14 md:pt-0">
            {children}
            <Footer />
          </div>
        </ContentProvider>
        <JsonLd data={buildPersonLd(hero, contact, skills)} />
        <JsonLd data={buildWebSiteLd()} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
