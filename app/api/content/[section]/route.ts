import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { verifyToken } from '@/lib/auth'

const ALLOWED = ['hero', 'about', 'skills', 'projects', 'contact'] as const

function getPath(section: string): string {
  return path.join(process.cwd(), 'content', `${section}.json`)
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  if (!ALLOWED.includes(section as typeof ALLOWED[number])) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }
  try {
    const file = await fs.readFile(getPath(section), 'utf-8')
    return NextResponse.json(JSON.parse(file))
  } catch {
    return NextResponse.json({})
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  if (!ALLOWED.includes(section as typeof ALLOWED[number])) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }
  const auth = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!auth || !verifyToken(auth)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  await fs.writeFile(getPath(section), JSON.stringify(body, null, 2), 'utf-8')
  return NextResponse.json({ ok: true })
}
