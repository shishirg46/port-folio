import { head } from '@vercel/blob'
import { promises as fs } from 'fs'
import path from 'path'
import {
  type SectionKey,
  type SectionContentMap,
} from './types'

async function readRaw(section: SectionKey): Promise<unknown | null> {
  try {
    const blob = await head(`content/${section}.json`, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    if (blob?.url) {
      const res = await fetch(blob.url)
      if (res.ok) return await res.json()
    }
  } catch {}
  try {
    const file = await fs.readFile(
      path.join(process.cwd(), 'content', `${section}.json`),
      'utf-8',
    )
    return JSON.parse(file)
  } catch {
    return null
  }
}

export async function loadSectionFromBlob<K extends SectionKey>(
  section: K,
): Promise<SectionContentMap[K] | null> {
  const raw = await readRaw(section)
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null
  return raw as SectionContentMap[K]
}

export async function loadAllFromBlob(): Promise<Partial<SectionContentMap>> {
  const [hero, about, skills, projects, contact] = await Promise.all([
    loadSectionFromBlob('hero'),
    loadSectionFromBlob('about'),
    loadSectionFromBlob('skills'),
    loadSectionFromBlob('projects'),
    loadSectionFromBlob('contact'),
  ])
  const result: Partial<SectionContentMap> = {}
  if (hero !== null) result.hero = hero
  if (about !== null) result.about = about
  if (skills !== null) result.skills = skills
  if (projects !== null) result.projects = projects
  if (contact !== null) result.contact = contact
  return result
}