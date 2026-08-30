import { loadSectionFromBlob, loadAllFromBlob } from './blob'
import { loadSectionFromDb, loadAllFromDb } from './db'
import {
  type SectionKey,
  type AnySectionContent,
  type SectionContentMap,
} from './types'

type AllContentResult = { [K in SectionKey]: SectionContentMap[K] | Record<string, never> }

function sourceMode(): 'db' | 'blob' {
  return process.env.CONTENT_SOURCE === 'db' ? 'db' : 'blob'
}

export function errorCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code
    if (typeof code === 'string') return code
  }
  return 'unknown'
}

export async function getSectionContent(section: SectionKey): Promise<AnySectionContent | null> {
  if (sourceMode() === 'db') {
    try {
      const dbContent = await loadSectionFromDb(section)
      if (dbContent) return dbContent
      console.warn(`[content] DB row missing for "${section}" — falling back to Blob/JSON`)
    } catch (e) {
      console.warn(`[content] DB read failed for "${section}" (${errorCode(e)}) — falling back to Blob/JSON`)
    }
  }
  return await loadSectionFromBlob(section)
}

export async function getAllContent(): Promise<AllContentResult> {
  if (sourceMode() === 'db') {
    try {
      return await loadAllFromDb()
    } catch (e) {
      console.warn(`[content] DB bulk read failed (${errorCode(e)}) — falling back to Blob/JSON`)
    }
  }
  const blobContent = await loadAllFromBlob()
  return {
    hero: blobContent.hero ?? {},
    about: blobContent.about ?? {},
    skills: blobContent.skills ?? {},
    projects: blobContent.projects ?? {},
    contact: blobContent.contact ?? {},
  }
}