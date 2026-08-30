import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { requireAdmin } from '@/lib/auth'
import { getSectionContent, errorCode } from '@/lib/content/repository'
import { saveSection, normalizeSectionPayload } from '@/lib/content/save'
import { SECTIONS } from '@/lib/content/types'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  if (!SECTIONS.includes(section as (typeof SECTIONS)[number])) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }
  const content = await getSectionContent(section as (typeof SECTIONS)[number])
  return NextResponse.json(content ?? {})
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  if (!SECTIONS.includes(section as (typeof SECTIONS)[number])) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }

  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  let normalized: ReturnType<typeof normalizeSectionPayload>
  try {
    normalized = normalizeSectionPayload(section as (typeof SECTIONS)[number], body)
  } catch {
    return NextResponse.json({ error: 'Invalid content payload' }, { status: 400 })
  }

  try {
    await saveSection(section as (typeof SECTIONS)[number], normalized)
  } catch (e) {
    console.warn(`[content] DB write failed for "${section}" (${errorCode(e)}) — content not saved`)
    return NextResponse.json({ error: 'Database write failed' }, { status: 500 })
  }

  try {
    await put(`content/${section}.json`, JSON.stringify(normalized, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
  } catch {
    console.warn(`[content] DB write OK but Blob sync failed for "${section}" — stores out of sync`)
    return NextResponse.json(
      { error: 'Saved to database but failed to sync Blob; content may be out of sync' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}