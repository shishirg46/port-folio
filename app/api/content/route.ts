import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const ALLOWED = ['hero', 'about', 'skills', 'projects', 'contact'] as const

export async function GET() {
  const results: Record<string, any> = {}
  for (const section of ALLOWED) {
    try {
      const file = await fs.readFile(path.join(process.cwd(), 'content', `${section}.json`), 'utf-8')
      results[section] = JSON.parse(file)
    } catch {
      results[section] = {}
    }
  }
  return NextResponse.json(results)
}
