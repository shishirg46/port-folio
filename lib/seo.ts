import type { Metadata } from 'next'

export const SITE_URL = 'https://www.shishirg.com.np'
export const SITE_NAME = 'Shishir Ghimire'
export const SITE_TITLE = 'Shishir Ghimire | Portfolio'
export const SITE_DESCRIPTION =
  'Web Developer from Biratnagar, Nepal building React, Next.js, Node.js, and database-backed applications.'
export const SITE_OG_IMAGE = '/port-image.jpeg'
export const OG_IMAGE = {
  url: SITE_OG_IMAGE,
  width: 928,
  height: 1238,
  alt: 'Shishir Ghimire',
}

export function absoluteUrl(path?: string): string {
  if (!path) return `${SITE_URL}/`
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function pageMeta(title: string, description: string, path: string): Metadata {
  const full = `${title} | ${SITE_NAME}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: full,
      description,
      url: path,
    },
    twitter: {
      card: 'summary_large_image',
      title: full,
      description,
    },
  }
}
