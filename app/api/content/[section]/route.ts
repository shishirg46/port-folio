import { NextResponse } from 'next/server'
import { head, put } from '@vercel/blob'
import { promises as fs } from 'fs'
import path from 'path'
import { verifyToken } from '@/lib/auth'

const ALLOWED = ['hero', 'about', 'skills', 'projects', 'contact'] as const

function getLocalPath(section: string): string {
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
    const blob = await head(`content/${section}.json`, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    if (blob && blob.url) {
      const res = await fetch(blob.url)
      if (res.ok) return NextResponse.json(await res.json())
    }
  } catch {}
  try {
    const file = await fs.readFile(getLocalPath(section), 'utf-8')
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
  try {
    await put(`content/${section}.json`, JSON.stringify(body, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[content] put error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
