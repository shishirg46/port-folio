import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { verifyToken } from '@/lib/auth'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(req: Request) {
  const auth = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!auth || !verifyToken(auth)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum 5MB.' }, { status: 413 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const base = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-]/g, '_').slice(0, 40)
  const filename = `${Date.now()}-${base}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const blob = await put(filename, buffer, {
    access: 'public',
    contentType: file.type,
  })

  return NextResponse.json({ url: blob.url })
}
