import type { HeroContent, SkillsContent, ContactContent } from '@/lib/content/types'
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo'

type JsonRecord = Record<string, unknown>

function clean<T extends JsonRecord>(obj: T): T {
  const out: JsonRecord = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) out[key] = value
  }
  return out as T
}

export function JsonLd({ data }: { data: JsonRecord | null | undefined }) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

export function buildPersonLd(
  hero?: Partial<HeroContent> | null,
  contact?: Partial<ContactContent> | null,
  skills?: Partial<SkillsContent> | null,
): JsonRecord {
  const sameAs = [contact?.social?.github, contact?.social?.linkedin].filter(
    (url): url is string => Boolean(url),
  )
  const skillsList = (skills?.categories ?? []).flatMap((category) => category.items ?? [])
  return clean({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: hero?.name || SITE_NAME,
    url: `${SITE_URL}/`,
    image: hero?.profileImage ? absoluteUrl(hero.profileImage) : `${SITE_URL}/port-image.jpeg`,
    jobTitle: hero?.title || undefined,
    description: hero?.description || undefined,
    knowsAbout: skillsList.length ? skillsList : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  })
}

export function buildWebSiteLd(): JsonRecord {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: 'en',
  })
}

export function buildWebPageLd(title: string, description: string, path: string): JsonRecord {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${path}`,
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
  })
}

export function buildBreadcrumbLd(path: string, label: string): JsonRecord {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: label, item: `${SITE_URL}${path}` },
    ],
  })
}

export function buildProjectsLd(projects: Array<{ title: string; description?: string; image?: string }>): JsonRecord {
  const itemListElement = projects.map((project, index) =>
    clean({
      '@type': 'ListItem',
      position: index + 1,
      item: clean({
        '@type': 'CreativeWork',
        name: project.title,
        description: project.description || undefined,
        image: project.image ? absoluteUrl(project.image) : undefined,
      }),
    }),
  )
  return clean({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects by Shishir Ghimire',
    itemListElement,
  })
}
