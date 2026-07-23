import { head } from '@vercel/blob'
import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ALLOWED = ['hero', 'about', 'skills', 'projects', 'contact'] as const

async function loadSection(section: string) {
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
    return {}
  }
}

export async function GET() {
  const entries = await Promise.all(ALLOWED.map((s) => loadSection(s).then((d) => [s, d] as const)))
  return NextResponse.json(Object.fromEntries(entries))
}
